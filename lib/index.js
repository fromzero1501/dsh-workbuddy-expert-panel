/**
 * dsh-workbuddy-expert-panel —— 宿主半区。
 *
 * 一个 Typert 远程服务（"workbuddyExperts"）：只读扫描本机 WorkBuddy 专家
 * （~/.workbuddy/plugins 下 cache 与 marketplaces 两处），把专家包解析成统一
 * 结构，并提供「转换为 DSH skill」的落盘动作。
 *
 * 不碰 WorkBuddy 目录里的任何文件；写盘只发生在 <dshHome>/skills/expert-<slug>/。
 */
import { z } from "zod";
import { TypertRemoteService } from "@deepseek-ai/dsh-typert-protocol";
import { readFileSync, existsSync, readdirSync, statSync, mkdirSync, renameSync, cpSync, rmSync } from "node:fs";
import { join, dirname } from "node:path";
import { spawn } from "node:child_process";
import { resolveDshHome } from "./paths.js";
import { scanExperts, findExpert, parseFrontmatter, safeRead, SOFT_OFF_FILE } from "./scan.js";
import { convertExpert, previewExpert } from "./convert.js";
import { listSkills as listInstalledSkills } from "./skills.js";

export const name = "dsh-workbuddy-expert-panel";
export const inject = ["typert"];

const PKG = "dsh-workbuddy-expert-panel";

/** Typert 0.2.x strict codec：{ mode, typeSymbol, create() } */
function codec(typeSymbol, schema) {
    return { mode: "strict", typeSymbol: `${PKG}#${typeSymbol}`, create: () => schema };
}

const idSchema = z.string();
const overwriteSchema = z.boolean().optional();
const anySchema = z.any();

const invocations = [];
function declare(method, parameters, resultSchema, resultSymbol) {
    invocations.push({
        id: `${PKG}#workbuddyExperts/${method}`,
        service: "workbuddyExperts",
        namespace: "workbuddyExperts",
        method,
        invocation: { kind: "direct" },
        parameters,
        result: codec(resultSymbol, resultSchema)
    });
}

declare("list", [], anySchema, "PanelList");
declare("detail", [{ name: "id", wire: "id", source: "json", codec: codec("ExpertId", idSchema) }], anySchema, "PanelDetail");
declare("avatar", [{ name: "id", wire: "id", source: "json", codec: codec("ExpertId", idSchema) }], anySchema, "PanelAvatar");
declare("preview", [{ name: "id", wire: "id", source: "json", codec: codec("ExpertId", idSchema) }], anySchema, "PanelPreview");
declare("convert", [
    { name: "id", wire: "id", source: "json", codec: codec("ExpertId", idSchema) },
    { name: "overwrite", wire: "overwrite", source: "json", acceptsUndefined: true, codec: codec("Overwrite", overwriteSchema) }
], anySchema, "PanelConvert");
declare("convertAll", [
    { name: "overwrite", wire: "overwrite", source: "json", acceptsUndefined: true, codec: codec("Overwrite", overwriteSchema) }
], anySchema, "PanelConvertAll");
declare("setEnabled", [
    { name: "id", wire: "id", source: "json", codec: codec("ExpertId", idSchema) },
    { name: "enabled", wire: "enabled", source: "json", codec: codec("Enabled", z.boolean()) }
], anySchema, "PanelSetEnabled");
declare("reveal", [
    { name: "path", wire: "path", source: "json", codec: codec("FilePath", z.string()) }
], anySchema, "PanelReveal");
declare("listSkills", [
    { name: "cwd", wire: "cwd", source: "json", acceptsUndefined: true, codec: codec("SkillCwd", z.string().optional()) }
], anySchema, "PanelSkillList");

const MANIFEST = {
    package: PKG,
    face: "host",
    schemas: [],
    invocations
};

function headOf(text, lines = 30) {
    return String(text ?? "").split("\n").slice(0, lines).join("\n");
}

/**
 * 协议层是「按 parameters 顺序位置调用」（remote-info.invoke → call.apply(receiver, values)），
 * 所以宿主方法必须收位置参数；同时兼容旧的对象式调用，避免探针脚本 / 手测失效。
 */
function argId(value) {
    return value !== null && typeof value === "object" ? value.id : value;
}
function argFlag(value) {
    if (value !== null && typeof value === "object")
        return value.overwrite === true || value.enabled === true;
    return value === true;
}
function argPath(value) {
    return value !== null && typeof value === "object" ? value.path : value;
}

/** 同步睡一小会儿：给 watcher 释放句柄的机会，再重试 rename。 */
function sleepMs(ms) {
    try {
        Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, ms);
    }
    catch {
        // 环境不支持就退化成不等待
    }
}

/** 单文件/目录 rename，带 3 次重试（Windows 上 EPERM 多是瞬时占用）。 */
function tryRename(from, to) {
    let last = null;
    for (let attempt = 0; attempt < 3; attempt += 1) {
        try {
            if (attempt > 0)
                sleepMs(120 * attempt);
            renameSync(from, to);
            return { ok: true };
        }
        catch (error) {
            last = error;
        }
    }
    return { ok: false, error: `${last?.code ?? ""} ${String(last?.message ?? last)}`.trim(), code: last?.code ?? null };
}

/**
 * 整目录搬家：先 rename（快、原子），被占用就复制+删源。
 * 「复制成功但删不掉源」必须报错，否则两份同时存在会让人误判状态。
 */
function relocate(from, to) {
    try {
        mkdirSync(dirname(to), { recursive: true });
    }
    catch {
        // 目标根建不出来时下面 rename/copy 会给出真实错误
    }
    const renamed = tryRename(from, to);
    if (renamed.ok)
        return { ok: true, mode: "move" };
    try {
        cpSync(from, to, { recursive: true });
    }
    catch (error) {
        try {
            rmSync(to, { recursive: true, force: true });
        }
        catch {
            // 清理残留失败不影响错误返回
        }
        return { ok: false, error: `${renamed.error}；复制兜底也失败：${String(error?.message ?? error)}`, code: error?.code ?? renamed.code };
    }
    try {
        rmSync(from, { recursive: true, force: true });
    }
    catch (error) {
        return { ok: false, error: `已复制到目标位，但源目录删不掉：${String(error?.message ?? error)}`, code: error?.code ?? null };
    }
    return { ok: true, mode: "copy" };
}

export { WorkbuddyExpertsGateway };

class WorkbuddyExpertsGateway extends TypertRemoteService {
    constructor(ctx) {
        super(ctx, "workbuddyExperts");
    }

    /** 扫描全部专家（cache ∪ marketplaces，按 name 去重）。 */
    list() {
        return scanExperts();
    }

    /** 已安装的 DSH 技能清单（用户根 + 项目根，含软禁用态）。 */
    listSkills(cwdOrOptions) {
        const cwd = typeof cwdOrOptions === "string"
            ? cwdOrOptions
            : (typeof cwdOrOptions?.cwd === "string" ? cwdOrOptions.cwd : undefined);
        return listInstalledSkills(cwd === undefined ? {} : { cwd });
    }

    /** 单个专家详情：原始 plugin.json + 各角色 md 抬头 + 技能目录。 */
    detail(idOrOptions) {
        const id = argId(idOrOptions);
        const list = scanExperts();
        const expert = findExpert(list, id);
        if (expert === null)
            return { ok: false, error: "未找到专家", id };
        let pluginJson = null;
        try {
            pluginJson = JSON.parse(readFileSync(expert.pluginJsonPath, "utf8"));
        }
        catch {
            pluginJson = null;
        }
        const agentDocs = expert.agents.map((a) => {
            const { data, body } = parseFrontmatter(safeRead(a.file) ?? "");
            return { name: a.name, file: a.file, frontmatter: data, head: headOf(body, 24), bytes: a.bytes };
        });
        const skillDocs = expert.skills.map((s) => {
            const readme = join(s.dir, "SKILL.md");
            const text = existsSync(readme) ? safeRead(readme) ?? "" : "";
            const { data, body } = parseFrontmatter(text);
            return { name: s.name, dir: s.dir, frontmatter: data, head: headOf(body, 20) };
        });
        return { ok: true, expert, pluginJson, agentDocs, skillDocs };
    }

    /** 头像 → dataURL（面板直接 <img src>）。 */
    avatar(idOrOptions) {
        const id = argId(idOrOptions);
        const list = scanExperts();
        const expert = findExpert(list, id);
        if (expert === null || expert.avatar === null)
            return { ok: false, dataUrl: null };
        try {
            const buf = readFileSync(expert.avatar.file);
            if (buf.byteLength > 2 * 1024 * 1024)
                return { ok: false, dataUrl: null, error: "头像超过 2MB" };
            return { ok: true, mime: expert.avatar.mime, dataUrl: `data:${expert.avatar.mime};base64,${buf.toString("base64")}` };
        }
        catch (error) {
            return { ok: false, dataUrl: null, error: String(error?.message ?? error) };
        }
    }

    /** 只算不写：SKILL.md 预览 + 目标路径。 */
    preview(idOrOptions) {
        const id = argId(idOrOptions);
        const list = scanExperts();
        const expert = findExpert(list, id);
        if (expert === null)
            return { ok: false, error: "未找到专家", id };
        return { ok: true, ...previewExpert(expert, { dshHome: resolveDshHome() }) };
    }

    /** 转换单个专家 → <dshHome>/skills/expert-<slug>/ */
    convert(idOrOptions, overwriteFlag) {
        const id = argId(idOrOptions);
        const overwrite = overwriteFlag === undefined ? argFlag(idOrOptions) : overwriteFlag === true;
        const list = scanExperts();
        const expert = findExpert(list, id);
        if (expert === null)
            return { ok: false, error: "未找到专家", id };
        try {
            const result = convertExpert(expert, { dshHome: resolveDshHome(), overwrite: overwrite === true, disabled: expert.dsh.state === "disabled" && expert.dsh.softDisabled !== true });
            return { ok: true, id, ...result, detected: detectSkills(resolveDshHome()) };
        }
        catch (error) {
            return { ok: false, id, error: String(error?.message ?? error), code: error?.code ?? null };
        }
    }

    /** 批量转换：默认只转「尚未转换」的专家。 */
    convertAll(overwriteFlag) {
        const overwrite = argFlag(overwriteFlag);
        const list = scanExperts();
        const targets = list.experts.filter((e) => overwrite === true || !e.dsh.installed);
        const results = targets.map((expert) => {
            try {
                return { ok: true, id: expert.id, name: expert.name, ...convertExpert(expert, { dshHome: resolveDshHome(), overwrite: overwrite === true, disabled: expert.dsh.state === "disabled" && expert.dsh.softDisabled !== true }) };
            }
            catch (error) {
                return { ok: false, id: expert.id, name: expert.name, error: String(error?.message ?? error), code: error?.code ?? null };
            }
        });
        return {
            ok: results.every((r) => r.ok),
            total: list.experts.length,
            attempted: results.length,
            succeeded: results.filter((r) => r.ok).length,
            results,
            detected: detectSkills(resolveDshHome())
        };
    }

    /**
     * 启用 / 关闭已转换的 skill。
     *
     * 两条路径，优先第一条，失败自动降级：
     *   1) 目录移位：skills/expert-<slug>/ ↔ skills-off/expert-<slug>/
     *      Windows 上 skills 根被 skill-filesystem 的 watcher 盯着，整目录 rename 可能 EPERM/EBUSY；
     *      所以先重试 3 次，再退到目录复制+删除，最后才降级。
     *   2) 软禁用：目录原地不动，只把 SKILL.md ↔ SKILL.md.disabled 改名。
     *      skill-filesystem 只认 <dir>/SKILL.md，缺这个文件名即不会被加载，效果等同移除。
     */
    setEnabled(idOrOptions, enabledFlag) {
        const id = argId(idOrOptions);
        const enabled = enabledFlag === undefined ? argFlag(idOrOptions) : enabledFlag === true;
        const want = enabled === true;
        const list = scanExperts();
        const expert = findExpert(list, id);
        if (expert === null)
            return { ok: false, id, error: "未找到专家" };
        const enabledDir = expert.dsh.enabledDir;
        const disabledDir = expert.dsh.disabledDir;
        const softOffPath = join(enabledDir, SOFT_OFF_FILE);
        const skillMdPath = join(enabledDir, "SKILL.md");
        const has = (dir) => existsSync(join(dir, "SKILL.md"));

        if (want) {
            if (has(enabledDir))
                return { ok: true, id, changed: false, state: "enabled", mode: "none", skillDir: enabledDir };
            // 软禁用 → 改名回来即可，不动目录
            if (existsSync(softOffPath) && tryRename(softOffPath, skillMdPath).ok)
                return this.#done(id, enabledDir, "enabled", "soft");
            // 目录在 skills-off → 整目录搬回
            if (has(disabledDir)) {
                const moved = relocate(disabledDir, enabledDir);
                if (moved.ok)
                    return this.#done(id, enabledDir, "enabled", moved.mode);
                return { ok: false, id, error: moved.error, code: moved.code ?? null };
            }
            return { ok: false, id, error: "尚未转换：两个根目录里都没有 SKILL.md", code: "ENOT_CONVERTED" };
        }

        if (has(disabledDir) || existsSync(join(disabledDir, SOFT_OFF_FILE)))
            return { ok: true, id, changed: false, state: "disabled", mode: "none", skillDir: disabledDir };
        if (!has(enabledDir))
            return { ok: false, id, error: "尚未转换：两个根目录里都没有 SKILL.md", code: "ENOT_CONVERTED" };
        // 先试整目录移位（干净）；被占用就退到软禁用，只改一个文件名
        const moved = relocate(enabledDir, disabledDir);
        if (moved.ok)
            return this.#done(id, disabledDir, "disabled", moved.mode);
        const soft = tryRename(skillMdPath, softOffPath);
        if (soft.ok)
            return this.#done(id, enabledDir, "disabled", "soft", moved.error);
        return { ok: false, id, error: `${moved.error}；软禁用也失败：${soft.error}`, code: soft.code ?? moved.code ?? null };
    }

    /** setEnabled 统一收尾：回扫一次 skill 目录，把结果一起带回去。 */
    #done(id, skillDir, state, mode, note) {
        return {
            ok: true,
            id,
            changed: true,
            state,
            mode,
            skillDir,
            ...(note === undefined ? {} : { note }),
            detected: detectSkills(resolveDshHome())
        };
    }

    /** 在资源管理器里定位文件/目录。 */
    reveal(pathOrOptions) {
        const path = argPath(pathOrOptions);
        if (typeof path !== "string" || path.trim() === "")
            return { ok: false, error: "path 为空" };
        if (!existsSync(path))
            return { ok: false, error: "路径不存在", path };
        try {
            const stat = statSync(path);
            const args = stat.isDirectory() ? [path] : [`/select,${path}`];
            spawn("explorer.exe", args, { detached: true, stdio: "ignore" }).unref();
            return { ok: true, path };
        }
        catch (error) {
            return { ok: false, error: String(error?.message ?? error), path };
        }
    }
}

/** 列出某个根目录下的 expert-* 子目录名。 */
function listExpertDirs(root) {
    try {
        return readdirSync(root, { withFileTypes: true })
            .filter((entry) => entry.isDirectory() && entry.name.startsWith("expert-"))
            .map((entry) => entry.name);
    }
    catch {
        return [];
    }
}

/** 读 <dshHome>/skills（启用）与 <dshHome>/skills-off（关闭）下的 expert-* 目录。 */
function detectSkills(dshHome) {
    const root = join(dshHome, "skills");
    const offRoot = join(dshHome, "skills-off");
    return { root, offRoot, skills: listExpertDirs(root), disabled: listExpertDirs(offRoot) };
}

export function apply(ctx) {
    new WorkbuddyExpertsGateway(ctx);
    ctx.effect(() => ctx.typert.register(MANIFEST), `${PKG}: typert manifest`);
}
