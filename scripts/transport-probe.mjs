/** 传输层等价调用：严格按 parameters 顺序位置传参（remote-info.invoke 就是这么调的）。 */
import { mkdtempSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { Context } from "@deepseek-ai/cordis";
import { WorkbuddyExpertsGateway } from "../lib/index.js";

process.env.DSH_HOME = mkdtempSync(join(tmpdir(), "dsh-home-"));

const ctx = new Context();
const gw = new WorkbuddyExpertsGateway(ctx);

const list = gw.list();
const first = list.experts[0];
console.log("1) list:", list.counts.total, "位专家 | id 示例:", first.id);

// —— 位置传参（= 面板实际路径）——
const detail = gw.detail(first.id);
console.log("2) detail(id):", detail.ok, detail.expert?.displayName ?? detail.error, "| agents:", detail.agentDocs?.length ?? "-");

const avatar = gw.avatar(first.id);
console.log("3) avatar(id):", avatar.ok, (avatar.dataUrl ?? "null").slice(0, 40));

const preview = gw.preview(first.id);
console.log("4) preview(id):", preview.ok, preview.skillName ?? preview.error);

const conv = gw.convert(first.id, true);
console.log("5) convert(id, true):", conv.ok, conv.skillDir ?? conv.error);

const off = gw.setEnabled(first.id, false);
console.log("6) setEnabled(id, false):", JSON.stringify({ ok: off.ok, state: off.state, changed: off.changed, error: off.error ?? null }));

const on = gw.setEnabled(first.id, true);
console.log("7) setEnabled(id, true):", JSON.stringify({ ok: on.ok, state: on.state, changed: on.changed }));

const rev = gw.reveal("D:\\500 工作\\DSH\\2026-10-26\\DSH专家功能插件对应");
console.log("8) reveal(path):", rev.ok, rev.error ?? "");

const all = gw.convertAll(false);
console.log("9) convertAll(false):", JSON.stringify({ ok: all.ok, total: all.total, attempted: all.attempted }));

// —— 旧对象式调用仍可用（探针兼容）——
const legacy = gw.detail({ id: first.id });
console.log("10) detail({id}) 兼容:", legacy.ok);

ctx.dispose?.();
