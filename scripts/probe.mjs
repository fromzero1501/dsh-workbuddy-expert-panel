/** M1 自测：只读扫描本机 WorkBuddy 专家，打印摘要。 */
import { scanExperts } from "../lib/scan.js";

const list = scanExperts();
console.log("workbuddy:", list.workbuddyHome);
console.log("dsh skills:", list.dshSkillsDir);
for (const r of list.roots)
    console.log(`root ${r.kind.padEnd(12)} exists=${r.exists} count=${r.count}  ${r.path}`);
console.log("counts:", JSON.stringify(list.counts));
for (const e of list.experts) {
    console.log(
        [
            e.kind === "cache" ? "[C]" : "[M]",
            e.expertType === "team" ? "团" : "专",
            e.name,
            "v" + e.version,
            e.inUse ? "使用中" : "",
            e.dsh.installed ? "已转DSH" : "",
            `agents=${e.agents.length}`,
            `skills=${e.skills.length}`,
            `refs=${e.references.length}`,
            `avatar=${e.avatar === null ? "-" : e.avatar.mime}`
        ].join(" ")
    );
    console.log(`     ${e.displayName} | ${e.profession} | ${e.description.slice(0, 70)}`);
}
