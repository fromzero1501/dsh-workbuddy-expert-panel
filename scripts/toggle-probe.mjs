/** 启用/关闭开关自测：临时 DSH_HOME，先转换一个专家，再开/关/幂等三轮校验。 */
import { existsSync, mkdtempSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { Context } from "@deepseek-ai/cordis";
import { WorkbuddyExpertsGateway } from "../lib/index.js";

const home = mkdtempSync(join(tmpdir(), "dsh-home-"));
process.env.DSH_HOME = home;

const ctx = new Context();
const gw = new WorkbuddyExpertsGateway(ctx);

const list0 = gw.list();
console.log("0) tempDSHHome =", home, "| counts =", JSON.stringify(list0.counts));

const target = list0.experts.find((e) => e.kind === "cache") ?? list0.experts[0];
const conv = gw.convert({ id: target.id, overwrite: true });
console.log("1) convert:", conv.ok, conv.skillDir ?? conv.error ?? "");
if (!conv.ok) process.exit(1);

const id = target.id;
const enabledDir = join(home, "skills", conv.skillName ?? `expert-${id}`);
const disabledDir = join(home, "skills-off", conv.skillName ?? `expert-${id}`);
console.log("   enabledDir =", enabledDir);
console.log("   disabledDir =", disabledDir);

const off = gw.setEnabled({ id, enabled: false });
console.log("2) disable:", JSON.stringify({ ok: off.ok, changed: off.changed, state: off.state, error: off.error ?? null }));
console.log("   skills/SKILL.md?", existsSync(join(enabledDir, "SKILL.md")), "| skills-off/SKILL.md?", existsSync(join(disabledDir, "SKILL.md")));

const list1 = gw.list();
const after1 = list1.experts.find((e) => e.id === id);
console.log("3) 重扫:", after1?.dsh?.state, "| installed =", after1?.dsh?.installed, "| counts =", JSON.stringify(list1.counts));

const on = gw.setEnabled({ id, enabled: true });
console.log("4) enable:", JSON.stringify({ ok: on.ok, changed: on.changed, state: on.state, error: on.error ?? null }));
console.log("   skills/SKILL.md?", existsSync(join(enabledDir, "SKILL.md")), "| skills-off/SKILL.md?", existsSync(join(disabledDir, "SKILL.md")));

const idle = gw.setEnabled({ id, enabled: true });
console.log("5) 幂等 enable:", JSON.stringify({ ok: idle.ok, changed: idle.changed, state: idle.state }));

const missing = gw.setEnabled({ id: "no-such-expert", enabled: true });
console.log("6) 不存在:", JSON.stringify({ ok: missing.ok, error: missing.error }));

ctx.dispose?.();
