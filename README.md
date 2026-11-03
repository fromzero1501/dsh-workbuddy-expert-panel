# dsh-workbuddy-expert-panel

把本机 **WorkBuddy 专家（含专家团）** 搬进 DeepSeek Harness：侧边栏面板浏览 + 一键转成 DSH skill + 输入框左侧快选入口。

## 它做什么

- **探测**：扫描 WorkBuddy 本地专家包目录（`~/.workbuddy/plugins/cache/experts/<名>/<版本>/` 与 `~/.workbuddy/plugins/marketplaces/experts/plugins/<名>/`），读取 `.codebuddy-plugin/plugin.json`、`agents/*.md`、`avatars/*`。
- **展示**：DSH 侧边栏面板，卡片列表 + 详情抽屉 + 搜索筛选；专家 / 专家团用徽章区分。
- **转换**：把专家人设写成 DSH skill（`$DSH_HOME/skills/expert-<slug>/SKILL.md`），之后用 `/expert-<slug>` 即可调用。
- **启用 / 关闭**：转换后的 skill 可在面板上开关。关闭走目录移位（`skills` ↔ `skills-off`）；rename 被占用时降级为复制 + 删源；仍失败则软禁用（`SKILL.md` ↔ `SKILL.md.disabled`）。
- **快选入口**：输入框左侧两个按钮（WB 专家 / SK 技能），选中后把 `/专家名` 写进输入框草稿，不直接发消息。

## 安装

```bash
# 在 DSH profile 目录下
npm install "link:<本仓库路径>"
```

然后在同目录 `package.json` 的 `dsh.profile.bundles` 里加入 `dsh-workbuddy-expert-panel`，重启 DSH。

## 目录结构

```
lib/
  index.js     宿主服务 workbuddyExperts（typert direct 调用，位置传参）
  scan.js      扫描 WorkBuddy 专家包目录
  convert.js   专家 → DSH skill 转换
  skills.js    技能清单（目录型与单文件型两种落盘形态）
  paths.js     DSH_HOME / WorkBuddy 目录解析
  client.js    侧边栏面板 + 输入框按钮
scripts/       探针脚本（只读校验各方法）
```

## 宿主方法

`list` / `detail` / `avatar` / `preview` / `convert` / `convertAll` / `setEnabled` / `reveal` / `listSkills`

均为位置传参（typert `direct` 分支按 `parameters` 顺序 `apply`）。

## 已知取舍

- 只读 WorkBuddy 侧数据，不改动 WorkBuddy 安装目录。
- 专家团的多人协作流程按人设文本保留，不做成员级拆分执行。
- 转换产物是人设文本 + 触发描述，不带 WorkBuddy 的 MCP/连接器依赖声明。

## License

MIT
