/** M1 转换自测：把指定专家转到临时 dshHome，打印 SKILL.md 头 40 行。 */
import { scanExperts, findExpert } from "../lib/scan.js";
import { convertExpert, previewExpert } from "../lib/convert.js";

const target = process.argv[2] ?? "recruitment-expert";
const dshHome = process.argv[3] ?? "tmp-dsh-home";
const list = scanExperts();
const expert = findExpert(list, target);
if (expert === null) {
    console.error("没找到专家:", target, "可选:", list.experts.map((e) => e.name).join(", "));
    process.exit(1);
}
console.log("== 预览 ==");
const pv = previewExpert(expert, { dshHome });
console.log("skill:", pv.skillName, "→", pv.skillDir);
console.log("refs:", pv.references, "skills:", pv.skills.join(",") || "-", "teamDocs:", pv.teamDocs);
console.log("== 执行 ==");
const r = convertExpert(expert, { dshHome, overwrite: true });
console.log(JSON.stringify({ skillName: r.skillName, files: r.files, backupDir: r.backupDir ?? null, warnings: r.warnings }, null, 2));
console.log("== SKILL.md 前 45 行 ==");
console.log(pv.skillMd.split("\n").slice(0, 45).join("\n"));
