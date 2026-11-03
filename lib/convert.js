/**
 * WorkBuddy 专家包 → DSH skill 目录的转换。
 *
 * 只读源包，只写 <dshHome>/skills/expert-<slug>/：
 *   SKILL.md              人设 + 方法论 + 团队分工 + 交付标准（frontmatter: name/description）
 *   references/           WorkBuddy 的 references/ 原样复制
 *   references/skills/    WorkBuddy 的 skills/<x>/ 原样复制（脚本只落盘，不执行）
 *   references/team/      专家团其余成员的 md（团长正文进 SKILL.md）
 *   ATTRIBUTION.md        来源、版本、作者、许可证
 */
import { cpSync, existsSync, mkdirSync, renameSync, rmSync, statSync, writeFileSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { SOFT_OFF_FILE } from "./scan.js";
import { parseFrontmatter, safeRead, textOf, slugOf, files, dirs } from "./scan.js";

function stamp() {
    const d = new Date();
    const p = (n) => String(n).padStart(2, "0");
    return `${d.getFullYear()}${p(d.getMonth() + 1)}${p(d.getDate())}-${p(d.getHours())}${p(d.getMinutes())}${p(d.getSeconds())}`;
}

/** frontmatter 的 description 要写成「能触发」的一句话：职称 + 能力 + 典型指令。 */
function buildDescription(expert) {
    const parts = [expert.displayName + (expert.profession === "" ? "" : `（${expert.profession}）`)];
    if (expert.description !== "")
        parts.push(expert.description);
    const triggers = expert.quickPrompts.slice(0, 3).map((q) => `「${q}」`).join("");
    if (triggers !== "")
        parts.push(`适用指令：${triggers}`);
    if (expert.tags.length > 0)
        parts.push(`标签：${expert.tags.slice(0, 8).join("/")}`);
    return parts.join("；").replace(/\s+/g, " ").slice(0, 480);
}

function agentName(expert, file) {
    const hit = expert.agents.find((a) => a.file === file);
    return hit === undefined ? file : hit.name;
}

/** 团长 = teamInfo.leadAgent 或 agents[] 的第一条；单专家 = 唯一条。 */
function pickLead(expert) {
    const declared = expert.pluginLead;
    if (typeof declared === "string" && declared !== "") {
        const hit = expert.agents.find((a) => a.name === declared || a.file.endsWith(`\\${declared}.md`) || a.file.endsWith(`/${declared}.md`));
        if (hit !== undefined)
            return hit;
    }
    return expert.agents[0] ?? null;
}

function members(expert, lead) {
    return expert.agents.filter((a) => a !== lead);
}

/** 把角色正文里的一级/二级标题整体降两级，避免与 SKILL.md 自己的结构撞层级。围栏代码块内不动。 */
function demoteHeadings(text) {
    const out = [];
    let fence = false;
    for (const line of text.split("\n")) {
        if (/^\s*(```|~~~)/.test(line))
            fence = !fence;
        out.push(!fence && /^#{1,4} /.test(line) ? "##" + line : line);
    }
    return out.join("\n");
}

/** 生成 SKILL.md 文本。 */
export function buildSkill(expert, options = {}) {
    const lead = pickLead(expert);
    const others = members(expert, lead);
    const lines = [];
    lines.push(`# ${expert.displayName}`);
    lines.push("");
    lines.push(`> 来源：WorkBuddy 专家 \`${expert.name}\` v${expert.version}（${expert.expertType === "team" ? "专家团" : "单专家"}）`
        + (expert.author.name === "" ? "" : `，作者 ${expert.author.name}`)
        + (expert.license === "" ? "" : `，许可证 ${expert.license}`) + "。");
    lines.push("");
    if (expert.description !== "")
        lines.push(expert.description, "");
    if (lead !== null) {
        const { body } = parseFrontmatter(safeRead(lead.file) ?? "");
        const persona = body.trim();
        if (persona !== "") {
            lines.push(`## 人设与方法论（${lead.name}）`, "", demoteHeadings(persona), "");
        }
    }
    if (expert.expertType === "team" && expert.agents.length > 1) {
        lines.push("## 团队构成与分工", "");
        if (lead !== null)
            lines.push(`- **${lead.name}（团长）**：拆解任务、分配角色、汇总交付。详见上文人设。`);
        for (const m of others)
            lines.push(`- **${m.name}**：${m.title === "" ? "（职责见 references/team）" : m.title}`);
        lines.push("");
        lines.push("团队协作方式：先由团长拆解并明确各角色输入/输出，再并行或接力推进，最后统一口径汇总结论；"
            + "需要多角色并行时用 workflow 承载，每个执行体开工前先 load 本 skill。");
        lines.push("");
    }
    lines.push("## 执行要求", "");
    lines.push("1. 先明确输入依据与交付物形态，依据不足时列出待补清单，不臆造事实。");
    lines.push("2. 按人设中的方法论推进，每一步给出可核对的中间产物（方案/表格/清单/脚本）。");
    lines.push("3. 交付前自检：结论是否可直接使用、口径是否与来源一致、是否标注不确定项。");
    lines.push("4. 涉及具体数据时给出区间与来源；不虚构引用。");
    lines.push("");
    const refs = [];
    if (expert.references.length > 0)
        refs.push("`references/`：原包参考资料");
    if (expert.skills.length > 0)
        refs.push(`\`references/skills/\`：原包技能（${expert.skills.map((s) => s.name).join("、")}），仅作资料，脚本不自动执行`);
    if (others.length > 0)
        refs.push("`references/team/`：其余角色的完整人设与方法论");
    if (refs.length > 0) {
        lines.push("## 参考资料", "");
        for (const r of refs)
            lines.push(`- ${r}`);
        lines.push("");
    }
    lines.push("## 禁止", "");
    lines.push("- 不脱离本专家职责范围作答；越界时说明应由哪位角色/哪个 skill 接手。");
    lines.push("- 不复述本文件的元信息，不解释自己是 AI 或模型。");
    lines.push("");
    lines.push(`<!-- converted from ${expert.packageDir} at ${new Date().toISOString()} -->`);
    const frontmatter = [
        "---",
        `name: expert-${slugOf(expert.name)}`,
        `description: ${buildDescription(expert).replace(/\n/g, " ")}`,
        `metadata:`,
        `  source: workbuddy-expert`,
        `  workbuddyName: ${expert.name}`,
        `  version: ${expert.version}`,
        `  expertType: ${expert.expertType}`,
        ...(expert.categoryId === "" ? [] : [`  categoryId: ${expert.categoryId}`]),
        "---",
        ""
    ].join("\n");
    return frontmatter + lines.join("\n");
}

function copyTree(from, to) {
    if (!existsSync(from))
        return 0;
    cpSync(from, to, { recursive: true, force: true, dereference: true });
    return countFiles(to);
}

function countFiles(dir) {
    let n = 0;
    for (const name of files(dir))
        n++;
    for (const name of dirs(dir))
        n += countFiles(join(dir, name));
    return n;
}

/**
 * 执行转换。
 * @returns {{ ok, skillDir, skillName, files, backupDir?, warnings: string[] }}
 */
export function convertExpert(expert, options = {}) {
    const dshHome = options.dshHome;
    if (typeof dshHome !== "string" || dshHome === "")
        throw new Error("convertExpert 需要 dshHome");
    const skillName = `expert-${slugOf(expert.name)}`;
    const rootDir = options.disabled === true ? "skills-off" : "skills";
    const skillDir = join(dshHome, rootDir, skillName);
    const warnings = [];
    let backupDir;
    if (existsSync(skillDir)) {
        if (options.overwrite !== true) {
            const err = new Error(`目标已存在：${skillDir}（传 overwrite 覆盖，旧目录会就地重写）`);
            err.code = "EEXIST_TARGET";
            throw err;
        }
        // 不整目录改名备份：Windows 上 skills 根被 watcher 盯着，目录级 rename 会 EPERM。
        // 改为就地覆盖，只把软禁用标记清掉，剩下的文件按需刷新。
        rmSync(join(skillDir, SOFT_OFF_FILE), { force: true });
        warnings.push("目标已存在：就地覆盖（未做整目录备份）");
    }
    mkdirSync(join(dshHome, rootDir), { recursive: true });
    mkdirSync(skillDir, { recursive: true });
    let fileCount = 0;
    writeFileSync(join(skillDir, "SKILL.md"), buildSkill(expert), "utf8");
    fileCount++;
    const refRoot = join(expert.packageDir, "references");
    if (existsSync(refRoot)) {
        cpSync(refRoot, join(skillDir, "references"), { recursive: true, force: true });
        fileCount += countFiles(join(skillDir, "references"));
    }
    for (const skill of expert.skills) {
        if (!existsSync(skill.dir)) {
            warnings.push(`技能目录缺失：${skill.dir}`);
            continue;
        }
        const target = join(skillDir, "references", "skills", skill.name);
        mkdirSync(join(skillDir, "references", "skills"), { recursive: true });
        cpSync(skill.dir, target, { recursive: true, force: true });
        fileCount += countFiles(target);
    }
    const lead = pickLead(expert);
    const others = members(expert, lead);
    if (others.length > 0) {
        mkdirSync(join(skillDir, "references", "team"), { recursive: true });
        for (const m of others) {
            const text = safeRead(m.file);
            if (text === null) {
                warnings.push(`团员 md 读不到：${m.file}`);
                continue;
            }
            writeFileSync(join(skillDir, "references", "team", `${m.name}.md`), text, "utf8");
            fileCount++;
        }
    }
    const attribution = [
        `# 来源与许可`,
        "",
        `- WorkBuddy 专家：${expert.name} v${expert.version}（${expert.displayName}）`,
        `- 类型：${expert.expertType === "team" ? "专家团" : "单专家"}${expert.team === null ? "" : `（团长 ${textOf(expert.team.leadAgent) || "见包内定义"}，成员 ${expert.team.members.length}）`}`,
        `- 作者：${expert.author.name}${expert.author.email === "" ? "" : ` <${expert.author.email}>`}`,
        `- 许可证：${expert.license === "" ? "（原包未声明）" : expert.license}`,
        `- 原包路径：${expert.packageDir}`,
        `- 转换时间：${new Date().toISOString()}`,
        "",
        "人设与方法论版权归原作者；本目录仅作本机 DSH 使用。"
    ].join("\n");
    writeFileSync(join(skillDir, "ATTRIBUTION.md"), attribution, "utf8");
    fileCount++;
    if (lead === null)
        warnings.push("未找到 agents/*.md，SKILL.md 只有元信息与通用执行要求");
    return { ok: true, skillName, skillDir, files: fileCount, backupDir, warnings };
}

/** 预览：不落盘，只回 SKILL.md 前 200 行与目标路径。 */
export function previewExpert(expert, options = {}) {
    return {
        skillName: `expert-${slugOf(expert.name)}`,
        skillDir: join(options.dshHome ?? "", "skills", `expert-${slugOf(expert.name)}`),
        skillMd: buildSkill(expert),
        references: expert.references.length,
        skills: expert.skills.map((s) => s.name),
        teamDocs: Math.max(0, expert.agents.length - 1)
    };
}

export { countFiles };
