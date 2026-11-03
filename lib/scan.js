/**
 * WorkBuddy 专家扫描：只读，不动磁盘上的 WorkBuddy 目录。
 *
 * 数据来源（两处并集，按 name 去重，cache 优先）：
 *   ~/.workbuddy/plugins/cache/experts/<name>/<version>/
 *   ~/.workbuddy/plugins/marketplaces/experts/plugins/<name>/
 */
import { readdirSync, readFileSync, statSync, existsSync } from "node:fs";
import { join } from "node:path";
import { expertRoots, resolveDshHome, workbuddyHome } from "./paths.js";

/** 软禁用标记文件名：目录留在 skills 根下，把 SKILL.md 改名即可让 skill 不再被加载。 */
export const SOFT_OFF_FILE = "SKILL.md.disabled";

function dirs(path) {
    try {
        return readdirSync(path, { withFileTypes: true }).filter((e) => e.isDirectory()).map((e) => e.name);
    }
    catch {
        return [];
    }
}

function files(path) {
    try {
        return readdirSync(path, { withFileTypes: true }).filter((e) => e.isFile()).map((e) => e.name);
    }
    catch {
        return [];
    }
}

function safeRead(path) {
    try {
        return readFileSync(path, "utf8");
    }
    catch {
        return null;
    }
}

function readJson(path) {
    const text = safeRead(path);
    if (text === null)
        return null;
    try {
        return JSON.parse(text);
    }
    catch {
        return null;
    }
}

function fileSize(path) {
    try {
        return statSync(path).size;
    }
    catch {
        return 0;
    }
}

/** 字段可能是字符串，也可能是 {zh,en} 双语对象。 */
export function textOf(value) {
    if (typeof value === "string")
        return value;
    if (value !== null && typeof value === "object") {
        for (const key of ["zh", "zh-CN", "en", "default"]) {
            const hit = value[key];
            if (typeof hit === "string" && hit !== "")
                return hit;
        }
        for (const hit of Object.values(value))
            if (typeof hit === "string" && hit !== "")
                return hit;
    }
    return "";
}

/** 数字段比较，容忍 1.0.13 / 1.2.0-rc 这类版本。 */
export function compareVersions(a, b) {
    const split = (v) => String(v ?? "0").split(/[.+-]/).map((x) => Number.parseInt(x, 10) || 0);
    const x = split(a);
    const y = split(b);
    for (let i = 0; i < Math.max(x.length, y.length); i++) {
        const d = (x[i] ?? 0) - (y[i] ?? 0);
        if (d !== 0)
            return d;
    }
    return 0;
}

/** 取 md 的 frontmatter（只解析 name/description 这类标量）。 */
export function parseFrontmatter(text) {
    if (typeof text !== "string" || !text.startsWith("---"))
        return { data: {}, body: text ?? "" };
    const end = text.indexOf("\n---", 3);
    if (end < 0)
        return { data: {}, body: text };
    const head = text.slice(3, end);
    const body = text.slice(end + 4).replace(/^\r?\n/, "");
    const data = {};
    for (const line of head.split(/\r?\n/)) {
        const m = /^([A-Za-z0-9_-]+)\s*:\s*(.*)$/.exec(line.trim());
        if (!m)
            continue;
        let value = m[2].trim();
        if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'")))
            value = value.slice(1, -1);
        data[m[1]] = value;
    }
    return { data, body };
}

/** 专家名 → skill 目录名用的 slug（保留 ascii，其余折叠为 -）。 */
export function slugOf(name) {
    const ascii = String(name ?? "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
    return ascii === "" ? "workbuddy-expert" : ascii;
}

function packageDirOf(kind, root, entry) {
    if (kind === "cache") {
        const versions = dirs(join(root, entry)).sort(compareVersions);
        const version = versions.at(-1);
        return version === undefined ? null : { packageDir: join(root, entry, version), version };
    }
    return { packageDir: join(root, entry), version: undefined };
}

function avatarOf(packageDir, pluginJson) {
    const avatarDir = join(packageDir, "avatars");
    const declared = typeof pluginJson?.avatar === "string" ? pluginJson.avatar.trim() : "";
    const candidates = declared === "" ? [] : [join(avatarDir, declared), join(packageDir, declared)];
    const pool = [...candidates, ...files(avatarDir).map((n) => join(avatarDir, n))];
    for (const path of pool) {
        if (!existsSync(path))
            continue;
        const ext = path.split(".").pop()?.toLowerCase() ?? "";
        if (!["png", "jpg", "jpeg", "webp", "svg"].includes(ext))
            continue;
        return { file: path, mime: ext === "jpg" ? "image/jpeg" : `image/${ext}` };
    }
    return null;
}

/** 读单个专家包（不做去重/排序）。 */
function readExpert(kind, packageDir, version) {
    const pluginJsonPath = join(packageDir, ".codebuddy-plugin", "plugin.json");
    const pluginJson = readJson(pluginJsonPath);
    if (pluginJson === null)
        return null;
    const name = typeof pluginJson.name === "string" && pluginJson.name !== "" ? pluginJson.name : packageDir.split(/[\\/]/).pop();
    const agentsDir = join(packageDir, "agents");
    const agents = files(agentsDir)
        .filter((n) => n.toLowerCase().endsWith(".md"))
        .map((n) => {
            const path = join(agentsDir, n);
            const { data } = parseFrontmatter(safeRead(path) ?? "");
            return {
                file: path,
                name: typeof data.name === "string" && data.name !== "" ? data.name : n.replace(/\.md$/i, ""),
                title: typeof data.description === "string" ? data.description : "",
                bytes: fileSize(path)
            };
        });
    const skillsDir = join(packageDir, "skills");
    const skills = dirs(skillsDir).map((n) => ({
        name: n,
        dir: join(skillsDir, n),
        hasSkillMd: existsSync(join(skillsDir, n, "SKILL.md"))
    }));
    const referencesDir = join(packageDir, "references");
    const references = existsSync(referencesDir)
        ? [...dirs(referencesDir).map((n) => ({ name: n, kind: "dir" })), ...files(referencesDir).map((n) => ({ name: n, kind: "file" }))]
        : [];
    const teamInfo = pluginJson.teamInfo && typeof pluginJson.teamInfo === "object" ? pluginJson.teamInfo : null;
    const inUse = existsSync(join(packageDir, ".in_use"));
    const downloadedAt = (safeRead(join(packageDir, ".downloaded_at")) ?? "").trim() || null;
    const dshHome = resolveDshHome();
    const dshSlug = `expert-${slugOf(name)}`;
    const dshEnabledDir = join(dshHome, "skills", dshSlug);
    const dshDisabledDir = join(dshHome, "skills-off", dshSlug);
    const dshEnabled = existsSync(join(dshEnabledDir, "SKILL.md"));
    // 软禁用：目录还留在 skills 根，但 SKILL.md 被改名成 SKILL.md.disabled。
    // skill-filesystem 只认 <dir>/SKILL.md（parseSkillFile 缺文件就跳过），所以缺它即等于不加载。
    const dshSoftOff = !dshEnabled && existsSync(join(dshEnabledDir, SOFT_OFF_FILE));
    const dshDisabled = existsSync(join(dshDisabledDir, "SKILL.md")) || dshSoftOff;
    const dshState = dshEnabled ? "enabled" : dshDisabled ? "disabled" : "absent";
    return {
        id: `${kind}:${name}`,
        kind,
        name,
        version: version ?? (typeof pluginJson.version === "string" ? pluginJson.version : ""),
        packageDir,
        pluginJsonPath,
        displayName: textOf(pluginJson.displayName) || name,
        profession: textOf(pluginJson.profession),
        description: textOf(pluginJson.displayDescription) || textOf(pluginJson.description),
        categoryId: typeof pluginJson.categoryId === "string" ? pluginJson.categoryId : "",
        expertType: pluginJson.expertType === "team" ? "team" : "agent",
        tags: Array.isArray(pluginJson.tags) ? pluginJson.tags.filter((t) => typeof t === "string") : [],
        quickPrompts: Array.isArray(pluginJson.quickPrompts) ? pluginJson.quickPrompts.filter((t) => typeof t === "string") : [],
        author: {
            name: typeof pluginJson.author?.name === "string" ? pluginJson.author.name : typeof pluginJson.author === "string" ? pluginJson.author : "",
            email: typeof pluginJson.author?.email === "string" ? pluginJson.author.email : ""
        },
        license: typeof pluginJson.license === "string" ? pluginJson.license : "",
        homepage: typeof pluginJson.homepage === "string" ? pluginJson.homepage : "",
        avatar: avatarOf(packageDir, pluginJson),
        agents,
        skills,
        references,
        pluginLead: typeof teamInfo?.leadAgent === "string" ? teamInfo.leadAgent : null,
        team: teamInfo === null
            ? null
            : {
                leadAgent: teamInfo.leadAgent ?? null,
                members: Array.isArray(teamInfo.memberAgents) ? teamInfo.memberAgents : [],
                workflow: teamInfo.workflow ?? null
            },
        inUse,
        downloadedAt,
        dsh: {
            skillDir: dshState === "disabled" ? dshDisabledDir : dshEnabledDir,
            enabledDir: dshEnabledDir,
            disabledDir: dshDisabledDir,
            installed: dshState !== "absent",
            enabled: dshState === "enabled",
            disabled: dshState === "disabled",
            softDisabled: dshSoftOff,
            state: dshState
        }
    };
}

/** 扫描全部根，按 name 去重（cache 先入，marketplace 补空字段/标记 alsoIn）。 */
export function scanExperts(options = {}) {
    const wbHome = options.workbuddyHome ?? workbuddyHome();
    const roots = expertRoots(wbHome).map((r) => ({ ...r }));
    const byName = new Map();
    const rootReports = [];
    for (const root of roots) {
        const entries = dirs(root.path);
        let count = 0;
        const indexJson = root.indexPath === undefined ? null : readJson(root.indexPath);
        const indexByName = new Map();
        for (const item of Array.isArray(indexJson?.plugins) ? indexJson.plugins : []) {
            if (typeof item?.name === "string")
                indexByName.set(item.name, item);
        }
        for (const entry of entries) {
            const found = packageDirOf(root.kind, root.path, entry);
            if (found === null)
                continue;
            const expert = readExpert(root.kind, found.packageDir, found.version);
            if (expert === null)
                continue;
            const idx = indexByName.get(expert.name);
            if (idx !== undefined && idx.description && expert.description === "")
                expert.description = String(idx.description);
            count++;
            const existing = byName.get(expert.name);
            if (existing === undefined) {
                byName.set(expert.name, expert);
            }
            else {
                // 两份都存在：cache 为主，marketplace 补空缺并标注
                if (existing.skills.length === 0 && expert.skills.length > 0)
                    existing.skills = expert.skills;
                if (existing.references.length === 0 && expert.references.length > 0)
                    existing.references = expert.references;
                if (existing.avatar === null && expert.avatar !== null)
                    existing.avatar = expert.avatar;
                if (existing.description === "" && expert.description !== "")
                    existing.description = expert.description;
                if (existing.pluginJsonPath === undefined || existing.pluginJsonPath === "")
                    existing.pluginJsonPath = expert.pluginJsonPath;
                existing.alsoIn = [...(existing.alsoIn ?? []), expert.packageDir];
            }
        }
        rootReports.push({ kind: root.kind, label: root.label, path: root.path, exists: existsSync(root.path), count });
    }
    const experts = [...byName.values()].sort((a, b) => {
        if (a.kind !== b.kind)
            return a.kind === "cache" ? -1 : 1;
        return a.name.localeCompare(b.name);
    });
    return {
        scannedAt: new Date().toISOString(),
        workbuddyHome: wbHome,
        dshSkillsDir: join(resolveDshHome(), "skills"),
        roots: rootReports,
        counts: {
            total: experts.length,
            cache: experts.filter((e) => e.kind === "cache").length,
            marketplace: experts.filter((e) => e.kind === "marketplace").length,
            team: experts.filter((e) => e.expertType === "team").length,
            installed: experts.filter((e) => e.dsh.installed).length,
            enabled: experts.filter((e) => e.dsh.enabled).length
        },
        experts
    };
}

export function findExpert(list, id) {
    return list.experts.find((e) => e.id === id) ?? list.experts.find((e) => e.name === id) ?? null;
}

export { readJson, safeRead, files, dirs, fileSize };
