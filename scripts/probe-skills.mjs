import { listSkills } from "../lib/skills.js";

const r = listSkills({
    dshHome: process.env.DSH_HOME ?? "C:/Users/Administrator/AppData/Roaming/dsh-desktop/harness",
    cwd: "D:/500 工作/DSH/2026-10-26/DSH专家功能插件对应"
});
const on = r.skills.filter((s) => s.enabled);
const off = r.skills.filter((s) => !s.enabled);
console.log("dshHome:", r.dshHome);
console.log("count:", r.count, "enabled:", on.length, "closed:", off.length, "expert:", r.skills.filter((s) => s.expert).length);
console.log("closed:", off.map((s) => s.name).join(", ") || "(none)");
console.log("first10:", on.slice(0, 10).map((s) => s.name).join(", "));
