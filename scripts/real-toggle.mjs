/** 真实 DSH_HOME 上试关/开一次，观察是否降级到软禁用（桌面端在跑，watcher 可能占着目录）。 */
import { existsSync } from "node:fs";
import { join } from "node:path";
import { Context } from "@deepseek-ai/cordis";
import { WorkbuddyExpertsGateway } from "../lib/index.js";

const gw = new WorkbuddyExpertsGateway(new Context());
const id = "cache:agency-video-commerce-crew";
const expert = gw.list().experts.find((e) => e.id === id);
if (expert === undefined) {
    console.log("!! 没有该专家");
    process.exit(1);
}
const onDir = expert.dsh.enabledDir;
const offDir = expert.dsh.disabledDir;
console.log("初始:", expert.dsh.state, "| soft:", expert.dsh.softDisabled === true);

const off = gw.setEnabled(id, false);
console.log("关闭:", JSON.stringify({ ok: off.ok, changed: off.changed, state: off.state, mode: off.mode, note: off.note ?? null, error: off.error ?? null }));
console.log("  skills/SKILL.md?", existsSync(join(onDir, "SKILL.md")),
    "| skills/SKILL.md.disabled?", existsSync(join(onDir, "SKILL.md.disabled")),
    "| skills-off/SKILL.md?", existsSync(join(offDir, "SKILL.md")));

const after = gw.list().experts.find((e) => e.id === id);
console.log("重扫:", after.dsh.state, "| soft:", after.dsh.softDisabled === true, "| installed:", after.dsh.installed);

const on = gw.setEnabled(id, true);
console.log("启用:", JSON.stringify({ ok: on.ok, changed: on.changed, state: on.state, mode: on.mode, note: on.note ?? null, error: on.error ?? null }));
console.log("  skills/SKILL.md?", existsSync(join(onDir, "SKILL.md")), "| skills-off/SKILL.md?", existsSync(join(offDir, "SKILL.md")));
