/**
 * 路径解析（内联版，不引 dsh-home-paths，避免 peer 链断掉）。
 * 语义与上游一致：DSH_HOME 优先，未设时 ~/.dsh。
 */
import { homedir } from "node:os";
import { join, resolve } from "node:path";

function expandHome(value) {
    if (value === "~")
        return homedir();
    if (value.startsWith("~/") || value.startsWith("~\\"))
        return join(homedir(), value.slice(2));
    return resolve(value);
}

export function resolveDshHome(override, env = process.env) {
    const direct = typeof override === "string" ? override.trim() : "";
    if (direct !== "")
        return expandHome(direct);
    const fromEnv = typeof env?.DSH_HOME === "string" ? env.DSH_HOME.trim() : "";
    return expandHome(fromEnv === "" ? join(homedir(), ".dsh") : fromEnv);
}

/**
 * 全局 Agent 配置根（与 @deepseek-ai/dsh-home-paths 的 resolveAgentsHome 同语义）：
 * $DSH_AGENTS_HOME 优先，未设时 ~/.agents。技能根为 <agentsHome>/skills。
 */
export function resolveAgentsHome(override, env = process.env) {
    const direct = typeof override === "string" ? override.trim() : "";
    if (direct !== "")
        return expandHome(direct);
    const fromEnv = typeof env?.DSH_AGENTS_HOME === "string" ? env.DSH_AGENTS_HOME.trim() : "";
    return expandHome(fromEnv === "" ? join(homedir(), ".agents") : fromEnv);
}

/** WorkBuddy 用户目录：~/.workbuddy */
export function workbuddyHome(env = process.env) {
    const direct = typeof env?.WORKBUDDY_HOME === "string" ? env.WORKBUDDY_HOME.trim() : "";
    return expandHome(direct === "" ? join(homedir(), ".workbuddy") : direct);
}

/** 两个专家落地根：cache（运行时加载的那份） + marketplaces（市场安装副本） */
export function expertRoots(wbHome) {
    return [
        {
            kind: "cache",
            label: "已召唤缓存",
            path: join(wbHome, "plugins", "cache", "experts"),
            withVersions: true
        },
        {
            kind: "marketplace",
            label: "市场安装",
            path: join(wbHome, "plugins", "marketplaces", "experts", "plugins"),
            withVersions: false,
            indexPath: join(wbHome, "plugins", "marketplaces", "experts", ".codebuddy-plugin", "marketplace.json")
        }
    ];
}
