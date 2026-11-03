/**
 * DSH 已安装技能清单：只读扫描，用于「+」菜单的技能选择面板。
 *
 * 覆盖四个根：
 *   <dshHome>/skills            用户根（启用）
 *   <dshHome>/skills-off        软禁用 / 移位后的用户技能
 *   <cwd>/.dsh/skills           项目级
 *   <cwd>/.agents/skills        项目级（agents 约定）
 *
 * 支持两种形态（与 dsh-skill-filesystem 的加载判定一致）：
 *   目录型  <root>/<name>/SKILL.md     （软禁用标记 SKILL.md.disabled）
 *   单文件  <root>/<name>.md           （软禁用标记 <name>.md.disabled）
 */
import { existsSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { resolveDshHome } from "./paths.js";
import { parseFrontmatter, safeRead, SOFT_OFF_FILE } from "./scan.js";

function entries(path) {
    try {
        const list = readdirSync(path, { withFileTypes: true });
        return {
            dirs: list.filter((e) => e.isDirectory()).map((e) => e.name),
            files: list.filter((e) => e.isFile() && (e.name.endsWith(".md") || e.name.endsWith(".md.disabled"))).map((e) => e.name)
        };
    }
    catch {
        return { dirs: [], files: [] };
    }
}

function firstLine(text) {
    const line = String(text ?? "").split("\n").map((s) => s.trim()).find((s) => s !== "" && !s.startsWith("#"));
    return line ?? "";
}

function clip(text, max = 160) {
    const s = String(text ?? "").replace(/\s+/g, " ").trim();
    return s.length <= max ? s : `${s.slice(0, max - 1)}…`;
}

/**
 * 列出全部已安装技能。
 * @param options - { cwd?, dshHome? }
 * @returns { scannedAt, dshHome, cwd, count, skills[] }
 */
export function listSkills(options = {}) {
    const dshHome = options.dshHome ?? resolveDshHome();
    const cwd = typeof options.cwd === "string" && options.cwd !== "" ? options.cwd : process.cwd();
    const roots = [
        { path: join(dshHome, "skills"), scope: "user", enabled: true },
        { path: join(dshHome, "skills-off"), scope: "user", enabled: false },
        { path: join(cwd, ".dsh", "skills"), scope: "project", enabled: true },
        { path: join(cwd, ".agents", "skills"), scope: "project", enabled: true }
    ];
    const byName = new Map();
    for (const root of roots) {
        const listing = entries(root.path);
        for (const dirName of listing.dirs) {
            const dir = join(root.path, dirName);
            const enabledFile = join(dir, "SKILL.md");
            const disabledFile = join(dir, SOFT_OFF_FILE);
            const hasEnabled = existsSync(enabledFile);
            const hasDisabled = existsSync(disabledFile);
            if (!hasEnabled && !hasDisabled)
                continue;
            const text = safeRead(hasEnabled ? enabledFile : disabledFile) ?? "";
            const { data, body } = parseFrontmatter(text);
            const name = typeof data.name === "string" && data.name !== "" ? data.name : dirName;
            const description = typeof data.description === "string" && data.description !== ""
                ? data.description
                : firstLine(body);
            const item = {
                id: `${root.scope}:${dirName}`,
                name,
                dirName,
                description: clip(description),
                path: hasEnabled ? enabledFile : disabledFile,
                dir,
                scope: root.scope,
                enabled: root.enabled && hasEnabled,
                softDisabled: hasDisabled && !hasEnabled,
                expert: dirName.startsWith("expert-")
            };
            // 同名去重：启用优先，其次先出现的根（user 在前）
            const prev = byName.get(name);
            if (prev === undefined || (item.enabled && !prev.enabled))
                byName.set(name, item);
        }
        for (const fileName of listing.files) {
            const softOff = fileName.endsWith(".md.disabled");
            const base = softOff ? fileName.slice(0, -".md.disabled".length) : fileName.slice(0, -3);
            if (base === "" || base.startsWith("."))
                continue;
            const file = join(root.path, fileName);
            const text = safeRead(file) ?? "";
            const { data, body } = parseFrontmatter(text);
            const name = typeof data.name === "string" && data.name !== "" ? data.name : base;
            const description = typeof data.description === "string" && data.description !== ""
                ? data.description
                : firstLine(body);
            const item = {
                id: `${root.scope}:${base}`,
                name,
                dirName: base,
                description: clip(description),
                path: file,
                dir: root.path,
                scope: root.scope,
                enabled: root.enabled && !softOff,
                softDisabled: softOff,
                expert: base.startsWith("expert-")
            };
            const prev = byName.get(name);
            if (prev === undefined || (item.enabled && !prev.enabled))
                byName.set(name, item);
        }
    }
    const skills = [...byName.values()].sort((a, b) => {
        if (a.expert !== b.expert)
            return a.expert ? -1 : 1;
        return a.name.localeCompare(b.name);
    });
    return {
        scannedAt: Date.now(),
        dshHome,
        cwd,
        count: skills.length,
        skills
    };
}
