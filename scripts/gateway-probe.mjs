/** M1 网关自测：真实 cordis Context 上实例化，逐个调方法（DSH_HOME 指向临时目录）。 */
import { Context } from "@deepseek-ai/cordis";
import { WorkbuddyExpertsGateway } from "../lib/index.js";

const ctx = new Context();
const gw = new WorkbuddyExpertsGateway(ctx);

console.log("1) ctx.get('workbuddyExperts') === gw ?", ctx.get("workbuddyExperts") === gw);

const list = gw.list();
console.log("2) list counts =", JSON.stringify(list.counts));

const first = list.experts[0];
const detail = gw.detail({ id: first.id });
console.log("3) detail:", detail.ok, detail.expert.name, "| agents:", detail.agentDocs.length, "| skills:", detail.skillDocs.length);

const avatar = gw.avatar({ id: first.id });
console.log("4) avatar:", avatar.ok, avatar.mime ?? "-", (avatar.dataUrl ?? "").slice(0, 48));

const preview = gw.preview({ id: first.id });
console.log("5) preview:", preview.skillName, "→", preview.skillDir);

const converted = gw.convert({ id: "recruitment-expert", overwrite: true });
console.log("6) convert:", JSON.stringify({ ok: converted.ok, files: converted.files, backup: converted.backupDir ?? null, code: converted.code ?? null, error: converted.error ?? null }));

const again = gw.convert({ id: "recruitment-expert" });
console.log("7) convert 无 overwrite 二次：", again.ok, again.code ?? "", again.error ?? "");

const all = gw.convertAll({});
console.log("8) convertAll:", JSON.stringify({ ok: all.ok, total: all.total, attempted: all.attempted, succeeded: all.succeeded, detected: all.detected.skills.length }));

const rev = gw.reveal({ path: first.packageDir });
console.log("9) reveal:", rev.ok, rev.error ?? "");

ctx.dispose?.();
