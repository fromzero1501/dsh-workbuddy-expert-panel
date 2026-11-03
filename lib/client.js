window.__ModuleLoader__.load({
    id: "dsh-workbuddy-expert-panel",
    factory: (require) => {
        const bundleModule = { exports: {} };
        Object.defineProperty(bundleModule.exports, Symbol.toStringTag, { value: "Module" });
        const react = require("react");
        const h = react.createElement;

        const NS = "ui-workbuddy-expert-panel";
        const PANEL_ID = "workbuddy-experts";
        const PKG = "dsh-workbuddy-expert-panel";

        const zh = {
            nav: "WorkBuddy 专家",
            title: "WorkBuddy 专家",
            subtitle: "扫描本机已安装的 WorkBuddy 专家与专家团，一键转换为 DSH skill",
            rescan: "重新扫描",
            convertAll: "全部转换",
            search: "筛选：名称 / 职称 / 标签",
            empty: "没有检测到 WorkBuddy 专家。先在本机 WorkBuddy 里召唤一次专家，包会落到 ~/.workbuddy/plugins 下。",
            loading: "扫描中…",
            team: "专家团",
            single: "单专家",
            fromCache: "缓存",
            fromMarket: "市场",
            inUse: "使用中",
            installed: "已转 DSH",
            notInstalled: "未转换",
            convert: "转换为 skill",
            reconvert: "重新转换",
            preview: "预览",
            detail: "详情",
            reveal: "定位",
            close: "关闭",
            cancel: "取消",
            confirm: "确认转换",
            confirmOverwrite: "目标已存在，覆盖会把旧目录改名备份。继续？",
            converting: "转换中…",
            converted: "已转换：",
            skills: "技能",
            references: "资料",
            agents: "角色",
            roleCount: "个角色",
            source: "来源",
            license: "许可",
            author: "作者",
            needConvert: "尚未转换",
            skillMd: "SKILL.md 预览",
            failed: "操作失败",
            roots: "扫描路径",
            total: "共",
            installedCount: "已转",
            teamCount: "团队",
            refreshHint: "转换后无需重启：skill 目录热感知。",
            enabledOn: "已启用",
            enabledOff: "已关闭",
            state: "状态",
            enable: "启用",
            disable: "关闭",
            toggleOn: "启用：目录移回 skills 根，skill 恢复可召唤",
            toggleOff: "关闭：目录移到 skills-off，skill 不再被加载",
            toggleBusy: "切换中…",
            avatarWarn: "头像读取失败",
            offRoot: "关闭区",
            cmdExpert: "WorkBuddy 专家",
            cmdExpertDesc: "选一个本机 WorkBuddy 专家，转换或启用后直接引入当前会话",
            cmdSkill: "技能",
            cmdSkillDesc: "选择一个已安装的 DSH 技能并加载到当前会话",
            pickSearch: "筛选名称 / 职称 / 标签",
            pickEmptyExpert: "未检测到 WorkBuddy 专家，先在本机 WorkBuddy 里召唤一次",
            pickEmptySkill: "没有可用的技能",
            pickNoResults: "没有匹配项",
            groupReady: "已就绪 · 直接引入",
            groupOff: "已关闭 · 选中即启用",
            groupFresh: "未转换 · 选中即转换",
            groupExpertSkill: "由专家转换的 skill",
            groupUserSkill: "用户技能",
            groupProjectSkill: "项目技能",
            badgeTeam: "团",
            badgeSingle: "单",
            badgeOff: "关",
            notFound: "未找到对应专家，请重新扫描",
            skillOffHint: "该技能处于关闭状态，先在侧边栏 WorkBuddy 专家面板里启用",
            sendFailed: "引入失败",
            dockBtn: "专家",
            dockTitle: "引入 WorkBuddy 专家",
            dockSearch: "搜索专家名称 / 职称",
            dockEmpty: "未检测到 WorkBuddy 专家",
            dockSkillBtn: "技能",
            dockSkillTitle: "引入技能",
            dockSkillSearch: "搜索技能名称或说明",
            dockSkillEmpty: "未检测到已安装的技能",
            dockExpertSkill: "专家 skill",
            draftOk: "已放入输入框，补充内容后发送",
            copyOk: "已复制到剪贴板，粘贴后继续输入",
            dockLoading: "加载中…",
            dockClose: "关闭",
            dockLoad: "引入",
            dockWorking: "处理中…"
        };
        const en = {
            nav: "WorkBuddy Experts",
            title: "WorkBuddy Experts",
            subtitle: "Scan locally installed WorkBuddy experts and convert them into DSH skills",
            rescan: "Rescan",
            convertAll: "Convert all",
            search: "Filter: name / profession / tag",
            empty: "No WorkBuddy experts found. Summon an expert in WorkBuddy once so its package lands under ~/.workbuddy/plugins.",
            loading: "Scanning…",
            team: "Team",
            single: "Expert",
            fromCache: "Cache",
            fromMarket: "Market",
            inUse: "In use",
            installed: "Converted",
            notInstalled: "Not converted",
            convert: "Convert to skill",
            reconvert: "Reconvert",
            preview: "Preview",
            detail: "Details",
            reveal: "Reveal",
            close: "Close",
            cancel: "Cancel",
            confirm: "Convert",
            confirmOverwrite: "Target exists; overwriting renames the old folder as a backup. Continue?",
            converting: "Converting…",
            converted: "Converted: ",
            skills: "Skills",
            references: "References",
            agents: "Roles",
            roleCount: " roles",
            source: "Source",
            license: "License",
            author: "Author",
            needConvert: "Not converted",
            skillMd: "SKILL.md preview",
            failed: "Failed",
            roots: "Scan roots",
            total: "total",
            installedCount: "converted",
            teamCount: "teams",
            refreshHint: "No restart needed: the skills directory is hot-observed.",
            enabledOn: "Enabled",
            enabledOff: "Disabled",
            state: "State",
            enable: "Enable",
            disable: "Disable",
            toggleOn: "Enable: move the folder back under skills so the skill loads again",
            toggleOff: "Disable: move the folder to skills-off so the skill stops loading",
            toggleBusy: "Switching…",
            avatarWarn: "Avatar failed to load",
            offRoot: "disabled",
            cmdExpert: "WorkBuddy Expert",
            cmdExpertDesc: "Pick a local WorkBuddy expert; convert or enable it, then load it into this session",
            cmdSkill: "Skills",
            cmdSkillDesc: "Pick an installed DSH skill and load it into this session",
            pickSearch: "Filter by name / profession / tag",
            pickEmptyExpert: "No WorkBuddy expert detected — summon one in the WorkBuddy app first",
            pickEmptySkill: "No skill available",
            pickNoResults: "No match",
            groupReady: "Ready · load now",
            groupOff: "Disabled · select to enable",
            groupFresh: "Not converted · select to convert",
            groupExpertSkill: "From WorkBuddy experts",
            groupUserSkill: "User skills",
            groupProjectSkill: "Project skills",
            badgeTeam: "team",
            badgeSingle: "solo",
            badgeOff: "off",
            notFound: "Expert not found — rescan the panel",
            skillOffHint: "This skill is disabled; enable it in the WorkBuddy expert sidebar first",
            sendFailed: "Load failed",
            dockBtn: "Experts",
            dockTitle: "Load a WorkBuddy expert",
            dockSearch: "Search by name / profession",
            dockEmpty: "No WorkBuddy expert detected",
            dockSkillBtn: "Skills",
            dockSkillTitle: "Load a skill",
            dockSkillSearch: "Search skill name or description",
            dockSkillEmpty: "No installed skill detected",
            dockExpertSkill: "expert skill",
            draftOk: "Inserted into the composer",
            copyOk: "Copied to clipboard",
            dockLoading: "Loading…",
            dockClose: "Close",
            dockLoad: "Load",
            dockWorking: "Working…"
        };

        const skillNameOf = (expert) => {
            const dir = typeof expert?.dsh?.skillDir === "string" ? expert.dsh.skillDir : "";
            const parts = dir.split(/[\\/]/u).filter((part) => part !== "");
            return parts.length === 0 ? null : parts[parts.length - 1];
        };

        const codec = (symbol) => ({ mode: "strict", typeSymbol: `${PKG}#${symbol}`, create: () => ({ parse: (value) => value }) });

        const CONTRIBUTION = {
            package: PKG,
            descriptors: [
                { method: "list", parameters: [], result: "PanelList" },
                { method: "detail", parameters: [{ name: "id", wire: "id", source: "json", codec: codec("ExpertId") }], result: "PanelDetail" },
                { method: "avatar", parameters: [{ name: "id", wire: "id", source: "json", codec: codec("ExpertId") }], result: "PanelAvatar" },
                { method: "preview", parameters: [{ name: "id", wire: "id", source: "json", codec: codec("ExpertId") }], result: "PanelPreview" },
                {
                    method: "convert",
                    parameters: [
                        { name: "id", wire: "id", source: "json", codec: codec("ExpertId") },
                        { name: "overwrite", wire: "overwrite", source: "json", acceptsUndefined: true, codec: codec("Overwrite") }
                    ],
                    result: "PanelConvert"
                },
                { method: "convertAll", parameters: [{ name: "overwrite", wire: "overwrite", source: "json", acceptsUndefined: true, codec: codec("Overwrite") }], result: "PanelConvertAll" },
                {
                    method: "setEnabled",
                    parameters: [
                        { name: "id", wire: "id", source: "json", codec: codec("ExpertId") },
                        { name: "enabled", wire: "enabled", source: "json", codec: codec("Enabled") }
                    ],
                    result: "PanelSetEnabled"
                },
                { method: "reveal", parameters: [{ name: "path", wire: "path", source: "json", codec: codec("FilePath") }], result: "PanelReveal" },
                { method: "listSkills", parameters: [], result: "PanelSkillList" }
            ].map((d) => ({
                id: `${PKG}#workbuddyExperts/${d.method}`,
                service: "workbuddyExperts",
                namespace: "workbuddyExperts",
                method: d.method,
                invocation: { kind: "direct" },
                parameters: d.parameters,
                result: codec(d.result)
            }))
        };

        // ── 样式 ────────────────────────────────────────────────────────
        const S = {
            page: { display: "flex", flexDirection: "column", gap: 14, padding: "18px clamp(16px,3vw,40px) 40px", minHeight: 0, overflowY: "auto" },
            head: { display: "flex", alignItems: "flex-start", gap: 12, flexWrap: "wrap" },
            titleBox: { display: "flex", flexDirection: "column", gap: 4, minWidth: 220, flex: 1 },
            title: { fontSize: 18, fontWeight: 600, lineHeight: 1.3 },
            subtitle: { fontSize: 12, opacity: 0.65, lineHeight: 1.5 },
            actions: { display: "flex", gap: 8, flexWrap: "wrap" },
            button: {
                fontSize: 12,
                lineHeight: "18px",
                padding: "5px 11px",
                borderRadius: 8,
                border: "1px solid var(--dsw-alias-border-subtle, rgba(127,127,127,.32))",
                background: "transparent",
                color: "inherit",
                cursor: "pointer"
            },
            primary: {
                fontSize: 12,
                lineHeight: "18px",
                padding: "5px 11px",
                borderRadius: 8,
                border: "1px solid var(--dsw-alias-state-business-primary, #4c8dff)",
                background: "color-mix(in srgb, var(--dsw-alias-state-business-primary, #4c8dff) 14%, transparent)",
                color: "inherit",
                cursor: "pointer"
            },
            input: {
                fontSize: 12.5,
                lineHeight: "18px",
                padding: "6px 10px",
                borderRadius: 8,
                border: "1px solid var(--dsw-alias-border-subtle, rgba(127,127,127,.32))",
                background: "transparent",
                color: "inherit",
                minWidth: 240,
                flex: "0 1 320px"
            },
            stats: { display: "flex", gap: 14, fontSize: 11.5, opacity: 0.7, flexWrap: "wrap" },
            grid: { display: "grid", gap: 10, gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))" },
            card: {
                display: "flex",
                flexDirection: "column",
                gap: 8,
                padding: "12px 13px",
                borderRadius: 12,
                border: "1px solid var(--dsw-alias-border-subtle, rgba(127,127,127,.24))",
                background: "color-mix(in srgb, currentColor 3%, transparent)",
                minHeight: 132
            },
            cardTop: { display: "flex", gap: 10, alignItems: "flex-start" },
            avatar: { width: 38, height: 38, borderRadius: 10, objectFit: "cover", flex: "none", background: "color-mix(in srgb, currentColor 10%, transparent)" },
            avatarFallback: { width: 38, height: 38, borderRadius: 10, flex: "none", display: "grid", placeItems: "center", fontSize: 15, fontWeight: 600, background: "color-mix(in srgb, currentColor 10%, transparent)" },
            nameBox: { display: "flex", flexDirection: "column", gap: 2, minWidth: 0, flex: 1 },
            name: { fontSize: 13.5, fontWeight: 600, lineHeight: 1.35, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" },
            profession: { fontSize: 11.5, opacity: 0.7, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" },
            badges: { display: "flex", gap: 5, flexWrap: "wrap" },
            badge: {
                fontSize: 10.5,
                lineHeight: "16px",
                padding: "0 6px",
                borderRadius: 999,
                border: "1px solid var(--dsw-alias-border-subtle, rgba(127,127,127,.32))",
                opacity: 0.85,
                whiteSpace: "nowrap"
            },
            badgeOn: {
                fontSize: 10.5,
                lineHeight: "16px",
                padding: "0 6px",
                borderRadius: 999,
                border: "1px solid var(--dsw-alias-state-business-primary, #4c8dff)",
                background: "color-mix(in srgb, var(--dsw-alias-state-business-primary, #4c8dff) 16%, transparent)",
                whiteSpace: "nowrap"
            },
            badgeOff: {
                fontSize: 10.5,
                lineHeight: "16px",
                padding: "0 6px",
                borderRadius: 999,
                border: "1px dashed var(--dsw-alias-border-subtle, rgba(127,127,127,.5))",
                opacity: 0.75,
                whiteSpace: "nowrap"
            },
            switch: {
                fontSize: 11.5,
                lineHeight: "18px",
                padding: "3px 10px",
                borderRadius: 999,
                border: "1px solid var(--dsw-alias-border-subtle, rgba(127,127,127,.45))",
                background: "transparent",
                color: "inherit",
                cursor: "pointer",
                display: "inline-flex",
                alignItems: "center",
                gap: 6
            },
            switchOn: {
                fontSize: 11.5,
                lineHeight: "18px",
                padding: "3px 10px",
                borderRadius: 999,
                border: "1px solid var(--dsw-alias-state-business-primary, #4c8dff)",
                background: "color-mix(in srgb, var(--dsw-alias-state-business-primary, #4c8dff) 18%, transparent)",
                color: "inherit",
                cursor: "pointer",
                display: "inline-flex",
                alignItems: "center",
                gap: 6
            },
            switchDot: { width: 8, height: 8, borderRadius: 999, background: "currentColor", opacity: 0.9 },
            switchDotOff: { width: 8, height: 8, borderRadius: 999, border: "1px solid currentColor", opacity: 0.6 },
            cardFoot: { display: "flex", gap: 6, marginTop: "auto", flexWrap: "wrap" },
            desc: { fontSize: 11.5, lineHeight: 1.55, opacity: 0.78, display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical", overflow: "hidden" },
            drawer: {
                position: "fixed",
                top: 0,
                right: 0,
                bottom: 0,
                width: "min(560px, 92vw)",
                zIndex: 60,
                display: "flex",
                flexDirection: "column",
                background: "var(--dsw-alias-bg-surface, Canvas)",
                borderLeft: "1px solid var(--dsw-alias-border-subtle, rgba(127,127,127,.32))",
                boxShadow: "-18px 0 40px rgba(0,0,0,.18)"
            },
            drawerHead: { display: "flex", alignItems: "center", gap: 10, padding: "14px 16px", borderBottom: "1px solid var(--dsw-alias-border-subtle, rgba(127,127,127,.24))" },
            drawerBody: { padding: "14px 16px", overflowY: "auto", display: "flex", flexDirection: "column", gap: 12, fontSize: 12.5, lineHeight: 1.6 },
            pre: {
                fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
                fontSize: 11,
                lineHeight: 1.5,
                whiteSpace: "pre-wrap",
                wordBreak: "break-word",
                margin: 0,
                padding: 10,
                borderRadius: 8,
                maxHeight: 320,
                overflow: "auto",
                background: "color-mix(in srgb, currentColor 5%, transparent)"
            },
            mask: { position: "fixed", inset: 0, zIndex: 59, background: "rgba(0,0,0,.28)" },
            kv: { display: "grid", gridTemplateColumns: "auto 1fr", gap: "4px 10px", fontSize: 11.5, opacity: 0.85 },
            error: { fontSize: 11.5, color: "var(--dsw-alias-state-danger-primary, #d9534f)" },
            hint: { fontSize: 11, opacity: 0.6 }
        };

        function Badge({ children, on }) {
            return h("span", { style: on ? S.badgeOn : S.badge }, children);
        }

        function Avatar({ src, name }) {
            if (typeof src === "string" && src !== "")
                return h("img", { style: S.avatar, src, alt: name });
            return h("div", { style: S.avatarFallback }, String(name ?? "?").slice(0, 1).toUpperCase());
        }

        function SwitchButton({ on, busy, label, title, onClick }) {
            return h("button", {
                type: "button",
                style: on === true ? S.switchOn : S.switch,
                title: typeof title === "string" ? title : "",
                disabled: busy === true,
                "aria-pressed": on === true,
                onClick
            }, h("span", { style: on === true ? S.switchDot : S.switchDotOff }), busy === true ? "…" : label);
        }

        function PanelIcon(props) {
            const size = typeof props?.size === "number" ? props.size : 16;
            return h("svg", {
                width: size,
                height: size,
                viewBox: "0 0 16 16",
                fill: "none",
                "aria-hidden": "true"
            }, h("path", {
                d: "M8 1.8 9.7 6.3 14.2 8 9.7 9.7 8 14.2 6.3 9.7 1.8 8 6.3 6.3Z",
                stroke: "currentColor",
                strokeWidth: 1.4,
                strokeLinejoin: "round"
            }));
        }

        function DetailDrawer({ face, expertId, onClose, onConverted, onToggle, pending }) {
            const t = face.t;
            const [state, setState] = react.useState({ loading: true, data: null, error: null });
            const [preview, setPreview] = react.useState(null);
            react.useEffect(() => {
                let alive = true;
                face.detail(expertId)
                    .then((data) => {
                        if (alive)
                            setState({ loading: false, data, error: null });
                    })
                    .catch((error) => {
                        if (alive)
                            setState({ loading: false, data: null, error: String(error?.message ?? error) });
                    });
                return () => {
                    alive = false;
                };
            }, [expertId]);
            react.useEffect(() => {
                let alive = true;
                face.preview(expertId)
                    .then((data) => {
                        if (alive && data?.ok)
                            setPreview(data.skillMd);
                    })
                    .catch(() => { });
                return () => {
                    alive = false;
                };
            }, [expertId]);
            const expert = state.data?.expert;
            return h("div", { style: S.drawer, role: "dialog", "aria-modal": "true" },
                h("div", { style: S.drawerHead },
                    expert ? h(Avatar, { src: face.avatarOf(expert.id), name: expert.displayName }) : null,
                    h("div", { style: S.nameBox },
                        h("div", { style: S.name }, expert?.displayName ?? "…"),
                        h("div", { style: S.profession }, expert?.profession ?? "")),
                    h("button", { type: "button", style: S.button, onClick: onClose }, t("close"))),
                h("div", { style: S.drawerBody },
                    state.loading ? h("div", { style: S.hint }, t("loading")) : null,
                    state.error !== null ? h("div", { style: S.error }, state.error) : null,
                    expert ? h("div", { style: S.kv },
                        h("span", null, t("source")), h("span", null, `${expert.name}@${expert.version} · ${expert.kind === "cache" ? t("fromCache") : t("fromMarket")}`),
                        h("span", null, t("author")), h("span", null, expert.author?.name || "—"),
                        h("span", null, t("license")), h("span", null, expert.license || "—"),
                        h("span", null, t("agents")), h("span", null, `${(expert.agents ?? []).length}${t("roleCount")}`),
                        h("span", null, t("skills")), h("span", null, (expert.skills ?? []).length === 0 ? "—" : expert.skills.map((s) => s.name).join("、")),
                        h("span", null, t("references")), h("span", null, String((expert.references ?? []).length)),
                        h("span", null, t("state")), h("span", null, expert.dsh?.enabled === true ? t("enabledOn") : expert.dsh?.installed === true ? t("enabledOff") : t("notInstalled")),
                        h("span", null, "→ DSH"), h("span", null, expert.dsh?.skillDir ?? "—")) : null,
                    state.data?.agentDocs?.length
                        ? h("div", null,
                            h("div", { style: S.name }, t("agents")),
                            state.data.agentDocs.map((doc) => h("div", { key: doc.file, style: { marginTop: 6 } },
                                h("div", { style: S.profession }, `${doc.name}${doc.frontmatter?.description ? " — " + doc.frontmatter.description : ""}`),
                                h("pre", { style: S.pre }, doc.head))))
                        : null,
                    preview !== null
                        ? h("div", null, h("div", { style: S.name }, t("skillMd")), h("pre", { style: S.pre }, preview))
                        : null,
                    expert
                        ? h("div", { style: S.cardFoot },
                            h("button", {
                                type: "button",
                                style: S.primary,
                                onClick: async () => {
                                    const overwrite = expert.dsh?.installed === true;
                                    if (overwrite && typeof window.confirm === "function" && !window.confirm(t("confirmOverwrite")))
                                        return;
                                    try {
                                        const result = await face.convert(expert.id, overwrite);
                                        if (!result?.ok)
                                            window.alert(`${t("failed")}: ${result?.error ?? ""}`);
                                        else
                                            face.notify(`${t("converted")}${result.skillDir}`);
                                        if (typeof onConverted === "function")
                                            onConverted();
                                        onClose();
                                    }
                                    catch (error) {
                                        window.alert(`${t("failed")}: ${String(error?.message ?? error)}`);
                                    }
                                }
                            }, expert.dsh?.installed === true ? t("reconvert") : t("convert")),
                            h("button", { type: "button", style: S.button, onClick: () => face.reveal(expert.dsh?.installed === true ? expert.dsh.skillDir : expert.packageDir) }, t("reveal")),
                            expert.dsh?.installed === true
                                ? h(SwitchButton, {
                                    on: expert.dsh.enabled === true,
                                    busy: pending === expert.id,
                                    label: expert.dsh.enabled === true ? t("enabledOn") : t("enabledOff"),
                                    title: expert.dsh.enabled === true ? t("toggleOff") : t("toggleOn"),
                                    onClick: () => (typeof onToggle === "function" ? onToggle(expert, expert.dsh.enabled !== true) : undefined)
                                })
                                : null)
                        : null));
        }

        function PanelPage(props) {
            const face = props;
            const t = props.t;
            const [list, setList] = react.useState(null);
            const [error, setError] = react.useState(null);
            const [busy, setBusy] = react.useState(false);
            const [query, setQuery] = react.useState("");
            const [openId, setOpenId] = react.useState(null);
            const [pending, setPending] = react.useState(null);
            const [, forceAvatars] = react.useState(0);
            const rescan = react.useCallback(() => {
                setBusy(true);
                face.list()
                    .then((data) => {
                        setList(data);
                        setError(null);
                    })
                    .catch((err) => setError(String(err?.message ?? err)))
                    .finally(() => setBusy(false));
            }, []);
            react.useEffect(() => {
                rescan();
            }, []);
            const toggleExpert = async (expert, next) => {
                setPending(expert.id);
                try {
                    const result = await face.setEnabled(expert.id, next === true);
                    if (result?.ok !== true)
                        window.alert(`${t("failed")}: ${result?.error ?? ""}`);
                    else
                        face.notify(`${next === true ? t("enable") : t("disable")}：${expert.displayName}`);
                }
                catch (err) {
                    window.alert(`${t("failed")}: ${String(err?.message ?? err)}`);
                }
                finally {
                    setPending(null);
                    rescan();
                }
            };
            react.useEffect(() => {
                if (list === null)
                    return;
                let alive = true;
                for (const expert of list.experts) {
                    face.loadAvatar(expert.id).then(() => {
                        if (alive)
                            forceAvatars((n) => n + 1);
                    }).catch(() => { });
                }
                return () => {
                    alive = false;
                };
            }, [list]);
            const experts = list?.experts ?? [];
            const q = query.trim().toLowerCase();
            const shown = q === ""
                ? experts
                : experts.filter((e) => [e.name, e.displayName, e.profession, e.description, ...(e.tags ?? [])].join(" ").toLowerCase().includes(q));
            const doConvertAll = async () => {
                try {
                    const result = await face.convertAll(false);
                    if (!result?.ok)
                        window.alert(`${t("failed")}: ${(result?.results ?? []).filter((r) => !r.ok).map((r) => `${r.name}: ${r.error}`).join("; ")}`);
                    else
                        face.notify(`${t("converted")}${result.succeeded}/${result.attempted}`);
                    rescan();
                }
                catch (err) {
                    window.alert(`${t("failed")}: ${String(err?.message ?? err)}`);
                }
            };
            return h("div", { style: S.page },
                h("div", { style: S.head },
                    h("div", { style: S.titleBox },
                        h("div", { style: S.title }, t("title")),
                        h("div", { style: S.subtitle }, t("subtitle"))),
                    h("div", { style: S.actions },
                        h("button", { type: "button", style: S.button, onClick: rescan, disabled: busy }, busy ? t("loading") : t("rescan")),
                        h("button", { type: "button", style: S.primary, onClick: doConvertAll }, t("convertAll")))),
                h("div", { style: { display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" } },
                    h("input", {
                        style: S.input,
                        value: query,
                        placeholder: t("search"),
                        onChange: (event) => setQuery(event.target.value)
                    }),
                    list === null
                        ? null
                        : h("div", { style: S.stats },
                            h("span", null, `${t("total")} ${list.counts.total}`),
                            h("span", null, `${t("teamCount")} ${list.counts.team}`),
                            h("span", null, `${t("installedCount")} ${list.counts.installed}`),
                            h("span", null, `${t("enabledOn")} ${list.counts.enabled ?? 0}`),
                            h("span", null, `${t("roots")} ${list.roots.length}`))),
                error !== null ? h("div", { style: S.error }, error) : null,
                list !== null && list.counts.total === 0 ? h("div", { style: S.hint }, t("empty")) : null,
                h("div", { style: S.grid }, shown.map((expert) => h("div", { key: expert.id, style: S.card },
                    h("div", { style: S.cardTop },
                        h(Avatar, { src: face.avatarOf(expert.id), name: expert.displayName }),
                        h("div", { style: S.nameBox },
                            h("div", { style: S.name, title: expert.name }, expert.displayName),
                            h("div", { style: S.profession, title: expert.profession }, expert.profession || expert.name))),
                    h("div", { style: S.badges },
                        h(Badge, { on: expert.expertType === "team" }, expert.expertType === "team" ? t("team") : t("single")),
                        h(Badge, null, expert.kind === "cache" ? t("fromCache") : t("fromMarket")),
                        h(Badge, null, `v${expert.version}`),
                        expert.inUse ? h(Badge, { on: true }, t("inUse")) : null,
                        expert.dsh?.enabled === true
                            ? h(Badge, { on: true }, t("enabledOn"))
                            : expert.dsh?.installed === true
                                ? h(Badge, null, t("enabledOff"))
                                : h(Badge, null, t("notInstalled"))),
                    h("div", { style: S.desc }, expert.description || "—"),
                    h("div", { style: S.cardFoot },
                        h("button", {
                            type: "button",
                            style: expert.dsh?.installed ? S.button : S.primary,
                            onClick: async () => {
                                try {
                                    const result = await face.convert(expert.id, expert.dsh?.installed === true);
                                    if (!result?.ok)
                                        window.alert(`${t("failed")}: ${result?.error ?? ""}`);
                                    else
                                        face.notify(`${t("converted")}${result.skillDir}`);
                                    rescan();
                                }
                                catch (err) {
                                    window.alert(`${t("failed")}: ${String(err?.message ?? err)}`);
                                }
                            }
                        }, expert.dsh?.installed ? t("reconvert") : t("convert")),
                        h("button", { type: "button", style: S.button, onClick: () => setOpenId(expert.id) }, t("detail")),
                        h("button", { type: "button", style: S.button, onClick: () => face.reveal(expert.dsh?.installed === true ? expert.dsh.skillDir : expert.packageDir) }, t("reveal")),
                        expert.dsh?.installed === true
                            ? h(SwitchButton, {
                                on: expert.dsh.enabled === true,
                                busy: pending === expert.id,
                                label: expert.dsh.enabled === true ? t("enabledOn") : t("enabledOff"),
                                title: expert.dsh.enabled === true ? t("toggleOff") : t("toggleOn"),
                                onClick: () => toggleExpert(expert, expert.dsh.enabled !== true)
                            })
                            : null)))),
                h("div", { style: S.hint }, t("refreshHint")),
                openId === null
                    ? null
                    : h(react.Fragment, null,
                        h("div", { style: S.mask, onClick: () => setOpenId(null) }),
                        h(DetailDrawer, { face, expertId: openId, onClose: () => setOpenId(null), onConverted: rescan, onToggle: toggleExpert, pending })));
        }

        // 输入框下方的常驻入口：不依赖 commandUi，选中专家后把 /<skill> 提交给当前会话
        const D = {
            btn: { display: "inline-flex", alignItems: "center", gap: "6px", height: "24px", padding: "0 10px", borderRadius: "999px", border: "0.5px solid var(--dsw-alias-border-l1)", background: "var(--dsw-alias-bg-base)", color: "var(--dsw-alias-label-primary-dimmed)", font: "var(--dsw-font-xs-13)", cursor: "pointer" },
            btnDot: { display: "inline-grid", placeItems: "center", width: "16px", height: "16px", borderRadius: "4px", background: "var(--dsw-alias-state-business-primary)", color: "#fff", fontSize: "9px", fontWeight: "700", lineHeight: "1" },
            overlay: { position: "fixed", inset: 0, zIndex: 40, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(0,0,0,0.32)" },
            card: { width: "min(560px, calc(100vw - 48px))", maxHeight: "min(520px, calc(100vh - 96px))", display: "flex", flexDirection: "column", gap: "8px", padding: "14px", borderRadius: "12px", background: "var(--dsw-alias-bg-base)", boxShadow: "0 18px 48px rgba(0,0,0,0.28)" },
            head: { display: "flex", alignItems: "center", justifyContent: "space-between", gap: "8px" },
            title: { fontSize: "14px", fontWeight: "600", color: "var(--dsw-alias-label-primary)" },
            close: { border: "none", background: "transparent", color: "var(--dsw-alias-label-tertiary)", fontSize: "18px", lineHeight: "1", cursor: "pointer", padding: "0 4px" },
            input: { width: "100%", boxSizing: "border-box", height: "30px", padding: "0 10px", borderRadius: "8px", border: "0.5px solid var(--dsw-alias-border-l1)", background: "var(--dsw-alias-bg-base)", color: "var(--dsw-alias-label-primary)", fontSize: "13px" },
            list: { display: "flex", flexDirection: "column", gap: "2px", overflowY: "auto", minHeight: "80px" },
            hint: { padding: "18px 8px", textAlign: "center", color: "var(--dsw-alias-label-tertiary)", fontSize: "12px" },
            error: { padding: "6px 8px", borderRadius: "6px", background: "var(--dsw-alias-fill-danger, rgba(220,60,60,0.12))", color: "var(--dsw-alias-state-danger-primary, #c62828)", fontSize: "12px", whiteSpace: "pre-wrap" },
            row: { display: "flex", alignItems: "center", gap: "10px", width: "100%", padding: "7px 8px", border: "none", borderRadius: "8px", background: "transparent", textAlign: "left", cursor: "pointer" },
            avatar: { flex: "none", width: "26px", height: "26px", borderRadius: "6px", overflow: "hidden", display: "grid", placeItems: "center", background: "var(--dsw-alias-interactive-bg-hover)", color: "var(--dsw-alias-label-secondary)", fontSize: "12px", fontWeight: "600" },
            avatarImg: { width: "100%", height: "100%", objectFit: "cover" },
            rowMain: { display: "flex", flexDirection: "column", gap: "1px", minWidth: 0, flex: "1" },
            rowName: { fontSize: "13px", fontWeight: "500", color: "var(--dsw-alias-label-primary)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" },
            rowDetail: { fontSize: "11px", color: "var(--dsw-alias-label-tertiary)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" },
            rowBadge: { flex: "none", fontSize: "10px", padding: "1px 6px", borderRadius: "999px", border: "0.5px solid var(--dsw-alias-border-l1)", color: "var(--dsw-alias-label-tertiary)" },
            rowBusy: { flex: "none", fontSize: "11px", color: "var(--dsw-alias-state-business-primary)" }
        };

        function ComposerExpertEntry(props) {
            const face = props.face;
            const t = props.t;
            const send = props.send;
            const actions = props.inputActions;
            const mode = props.mode === "skill" ? "skill" : "expert";
            const [open, setOpen] = react.useState(false);
            const [rows, setRows] = react.useState([]);
            const [loading, setLoading] = react.useState(false);
            const [busy, setBusy] = react.useState("");
            const [error, setError] = react.useState("");
            const [query, setQuery] = react.useState("");
            const [, setTick] = react.useState(0);
            react.useEffect(() => {
                if (open !== true)
                    return undefined;
                let alive = true;
                setLoading(true);
                setError("");
                setRows([]);
                Promise.resolve()
                    .then(() => mode === "skill" ? face.listSkills() : face.list())
                    .then((data) => {
                    if (!alive)
                        return;
                    const source = mode === "skill"
                        ? (Array.isArray(data?.skills) ? data.skills : [])
                        : (Array.isArray(data?.experts) ? data.experts : []);
                    const list = source.map((item) => mode === "skill"
                        ? {
                            key: String(item.id),
                            label: String(item.name ?? item.dirName ?? "?"),
                            sub: String(item.description ?? "").slice(0, 80),
                            badge: item.expert === true ? t("dockExpertSkill") : "",
                            raw: item
                        }
                        : {
                            key: String(item.id),
                            label: String(item.displayName || item.name || "?"),
                            sub: [item.profession, item.description].filter((part) => typeof part === "string" && part !== "").join(" · ").slice(0, 80),
                            badge: item.expertType === "team" ? t("badgeTeam") : t("badgeSingle"),
                            raw: item
                        });
                    setRows(list);
                    if (mode !== "skill") {
                        for (const item of source) {
                            face.loadAvatar(item.id).then(() => {
                                if (alive)
                                    setTick((value) => value + 1);
                            });
                        }
                    }
                })
                    .catch((err) => {
                    if (alive)
                        setError(String(err?.message ?? err));
                })
                    .then(() => {
                    if (alive)
                        setLoading(false);
                });
                return () => {
                    alive = false;
                };
            }, [open]);
            const deliver = async (text) => {
                if (actions !== undefined && actions !== null && typeof actions.setDraft === "function") {
                    actions.setDraft(text);
                    face.notify(t("draftOk"));
                    return;
                }
                try {
                    await navigator.clipboard.writeText(text);
                    face.notify(t("copyOk"));
                    return;
                }
                catch {
                    // 剪贴板也不可用时退回发送，至少能让 skill 生效
                }
                await send(text);
            };
            const pick = async (item) => {
                setBusy(item.key);
                setError("");
                try {
                    if (mode === "skill") {
                        const skill = item.raw;
                        if (skill.enabled !== true) {
                            const result = await face.setEnabled(skill.id, true);
                            if (result?.ok === false)
                                throw new Error(String(result.error ?? t("failed")));
                        }
                        await deliver(`/${skill.name}`);
                    }
                    else {
                        const expert = item.raw;
                        const state = expert.dsh?.state ?? "absent";
                        if (state === "absent") {
                            const result = await face.convert(expert.id, false);
                            if (result?.ok === false)
                                throw new Error(String(result.error ?? t("failed")));
                        }
                        if (state !== "enabled") {
                            const result = await face.setEnabled(expert.id, true);
                            if (result?.ok === false)
                                throw new Error(String(result.error ?? t("failed")));
                        }
                        await deliver(`/${skillNameOf(expert) ?? String(expert.name)}`);
                    }
                    setOpen(false);
                }
                catch (err) {
                    setError(String(err?.message ?? err));
                }
                finally {
                    setBusy("");
                }
            };
            const title = mode === "skill" ? t("dockSkillTitle") : t("dockTitle");
            const trimmed = query.trim().toLowerCase();
            const filtered = trimmed === ""
                ? rows
                : rows.filter((item) => `${item.label} ${item.sub}`.toLowerCase().includes(trimmed));
            return h(react.Fragment, null, h("button", { type: "button", style: D.btn, title, onClick: () => setOpen(true) },
                h("span", { style: D.btnDot }, mode === "skill" ? "SK" : "WB"),
                mode === "skill" ? t("dockSkillBtn") : t("dockBtn")), open !== true
                ? null
                : h("div", { style: D.overlay, onClick: () => setOpen(false) }, h("div", { style: D.card, onClick: (event) => event.stopPropagation() },
                    h("div", { style: D.head }, h("div", { style: D.title }, title), h("button", { type: "button", style: D.close, onClick: () => setOpen(false) }, "×")),
                    h("input", { style: D.input, value: query, placeholder: mode === "skill" ? t("dockSkillSearch") : t("dockSearch"), onChange: (event) => setQuery(event.target.value) }),
                    error === "" ? null : h("div", { style: D.error }, error),
                    h("div", { style: D.list }, loading
                        ? h("div", { style: D.hint }, t("dockLoading"))
                        : filtered.length === 0
                            ? h("div", { style: D.hint }, rows.length === 0 ? (mode === "skill" ? t("dockSkillEmpty") : t("dockEmpty")) : t("pickNoResults"))
                            : filtered.map((item) => {
                                const avatar = mode === "skill" ? null : face.avatarOf(item.raw.id);
                                return h("button", { key: item.key, type: "button", style: D.row, disabled: busy !== "", onClick: () => pick(item) },
                                    h("span", { style: D.avatar }, avatar === null || avatar === undefined
                                        ? item.label.slice(0, 1)
                                        : h("img", { src: avatar, style: D.avatarImg, alt: "" })),
                                    h("span", { style: D.rowMain },
                                        h("span", { style: D.rowName }, item.label),
                                        h("span", { style: D.rowDetail }, item.sub)),
                                    item.badge === "" ? null : h("span", { style: D.rowBadge }, item.badge),
                                    busy === item.key ? h("span", { style: D.rowBusy }, t("dockWorking")) : null);
                            })))));
        }

        const inject = ["slots", "locale", "remote"];
        function apply(ctx) {
            ctx.effect(() => ctx.locale.register(NS, { zh, en }), `${PKG}: dictionaries`);
            const t = ctx.locale.bind(NS);
            const mount = ctx.remote.$mount(CONTRIBUTION);
            const avatars = new Map();
            const avatarErrors = new Map();
            let argStyle = "positional";
            const toNamed = (descriptor, args) => {
                const named = {};
                (descriptor?.parameters ?? []).forEach((param, index) => {
                    if (index < args.length)
                        named[param.wire ?? param.name] = args[index];
                });
                return named;
            };
            const describeError = (method, result) => {
                const error = result?.error;
                if (typeof error === "string" && error !== "")
                    return `${method}: ${error}`;
                const code = error?.code ?? "";
                const message = error?.message ?? "";
                const text = [code, message].filter((part) => part !== "").join(" ");
                return `${method}: ${text === "" ? "调用失败" : text}`;
            };
            const invoke = async (method, args, style) => {
                const remote = ctx.get("remote.workbuddyExperts");
                if (remote === null || typeof remote !== "object")
                    throw new Error("remote.workbuddyExperts 不可用");
                const descriptor = CONTRIBUTION.descriptors.find((d) => d.method === method);
                const result = style === "named"
                    ? await remote[method](toNamed(descriptor, args))
                    : await remote[method](...args);
                if (result !== null && typeof result === "object" && result.ok === false)
                    throw new Error(describeError(method, result));
                // 宿主直挂（无 envelope）时原样返回，有 { ok, value } 包装时取 value
                return result !== null && typeof result === "object" && "value" in result && "ok" in result ? result.value : result;
            };
            const call = async (method, ...args) => {
                await mount;
                if (argStyle === "named")
                    return invoke(method, args, "named");
                try {
                    return await invoke(method, args, "positional");
                }
                catch (first) {
                    if (args.length === 0)
                        throw first;
                    // 位置参数不可用时，按 wire 名组装成对象参数再试一次；成功即记住这条路
                    const retry = await invoke(method, args, "named");
                    argStyle = "named";
                    return retry;
                }
            };
            const face = () => ({
                t,
                list: () => call("list"),
                listSkills: () => call("listSkills"),
                detail: (id) => call("detail", id),
                preview: (id) => call("preview", id),
                convert: (id, overwrite) => call("convert", id, overwrite === true),
                convertAll: (overwrite) => call("convertAll", overwrite === true),
                setEnabled: (id, enabled) => call("setEnabled", id, enabled === true),
                reveal: (path) => call("reveal", path),
                loadAvatar: async (id) => {
                    if (avatars.has(id))
                        return avatars.get(id);
                    try {
                        const result = await call("avatar", id);
                        const dataUrl = typeof result?.dataUrl === "string" ? result.dataUrl : null;
                        avatars.set(id, dataUrl);
                        if (dataUrl === null)
                            avatarErrors.set(id, String(result?.error ?? "无头像文件"));
                    }
                    catch (error) {
                        avatars.set(id, null);
                        avatarErrors.set(id, String(error?.message ?? error));
                    }
                    return avatars.get(id) ?? null;
                },
                avatarOf: (id) => avatars.get(id) ?? null,
                avatarError: (id) => avatarErrors.get(id) ?? null,
                notify: (text) => {
                    try {
                        const layout = ctx.get("layout");
                        if (layout !== null && typeof layout?.notify === "function")
                            layout.notify(String(text));
                    }
                    catch {
                        // 通知失败不影响主流程
                    }
                },
                rescan: () => { }
            });
            ctx.slots.inject("sidebar.panellist", () => ctx.slots.register({
                name: "sidebar.panellist",
                id: PANEL_ID,
                order: 2,
                label: () => t("nav"),
                locale: NS
            }, PanelIcon));
            ctx.slots.inject("main", () => ctx.slots.register({
                name: "main",
                key: PANEL_ID,
                locale: NS,
                inject: face
            }, PanelPage));
            // 输入框下方常驻入口：选中专家后把 /<skill> 送进当前会话，不依赖 commandUi
            const sendSession = async (sessionId, text) => {
                const sessions = ctx.get("sessions");
                let lastError = "";
                const binding = typeof sessions?.binding === "function" ? sessions.binding(sessionId) : undefined;
                const session = binding?.session;
                if (session !== undefined && typeof session.prompt === "function") {
                    const result = await session.prompt([{ type: "text", text }], "queue");
                    if (result !== null && typeof result === "object" && result.ok === false)
                        lastError = `${t("sendFailed")}：${String(result.error?.code ?? result.error?.message ?? "")}`;
                    else
                        return true;
                }
                const conversation = binding?.ctx?.get?.("conversation") ?? ctx.get("conversation");
                if (conversation !== null && conversation !== undefined && typeof conversation.send === "function") {
                    try {
                        await conversation.send(text);
                        return true;
                    }
                    catch (error) {
                        lastError = `${t("sendFailed")}：${String(error?.message ?? error)}`;
                    }
                }
                throw new Error(lastError === "" ? t("sendFailed") : lastError);
            };
            const dockFace = face();
            try {
                const mountEntry = (id, order, mode) => ctx.slots.inject("conversation.input.left", () => ctx.slots.register({
                    name: "conversation.input.left",
                    id,
                    order,
                    locale: NS,
                    inject: (sessionId) => ({ face: dockFace, t, send: (text) => sendSession(sessionId, text), mode })
                }, ComposerExpertEntry));
                mountEntry("workbuddy-expert", 10, "expert");
                mountEntry("workbuddy-skill", 11, "skill");
            }
            catch {
                // 宿主没有该插槽时跳过，不影响面板与菜单
            }
        }

        bundleModule.exports.NS = NS;
        bundleModule.exports.apply = apply;
        bundleModule.exports.inject = inject;
        return bundleModule.exports;
    }
});
