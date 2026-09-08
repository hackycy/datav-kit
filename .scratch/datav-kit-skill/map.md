# Map: datav-kit skill 设计规格

Label: `wayfinder:map` · Effort: `.scratch/datav-kit-skill/` · Tracker: local-markdown

## Destination

为 datav-kit 定制一套可发布的 skill（`skills/datav-kit`，通过 `npx skills add hackycy/datav-kit` 安装），建立两个维度：

1. **知识库网络** — 以线上 `llms.txt` / 组件文档为源，让 agent 正确选型、写对 props / events / CSS 变量。
2. **大屏开发规范** — 原型优先工作流 + 设计系统 + 图表指导，让大屏产出稳定美观。

**本 map 的终点是一份锁定的、可直接照着实现的设计规格**（不是实现本身）。规格由本 map 的决策 ticket 汇编成 `.scratch/datav-kit-skill/spec.md`；skill 的实现是 map 结束之后的另一个 effort。

验收：新产出的真实大屏案例由 Leo 本人按"由设计规范逐条派生"的评分表评审；评审发现必须回写成 skill 修订项。

## Notes

### 事实基线（已查证，勿重复调研）

- **安装**：`skills` CLI（vercel-labs/skills v1.5.24）在仓库根 `skills/` 发现 skill，最多下探 3 层（`skills/<name>/SKILL.md` 或 `skills/<分类>/<name>/SKILL.md`）。真实命令：`npx skills add hackycy/datav-kit`。
- **知识库线上源**：`https://hackycy.github.io/datav-kit/llms.txt`（7.3 KB 目录索引，可常驻）；`llms-full.txt` 113 KB（**不可常驻**）；单组件页 URL 形如 `https://hackycy.github.io/datav-kit/components/decorations/decoration-1.md`。
- **组件规模**：35 个（11 decoration / 4 title / 16 border box / 5 other）+ 5 套主题 CSS 变量（`--dvk-color-primary`、`--dvk-color-secondary`、`--dvk-color-accent`、`--dvk-color-surface`、`--dvk-glow-soft/strong`、`--dvk-line-width`、`--dvk-motion-duration`）。
- **实测**：`file://` 页面可 `import()` `https://esm.sh/@datav-kit/elements@0.0.5` 或 `https://cdn.jsdelivr.net/npm/@datav-kit/elements@0.0.5/+esm`，组件注册与 Shadow DOM 正常 → 原型模板能加载**真实组件**。
- **三层分叉（14 查证，替代此前错误记录）**：`title-1/2/3`、`border-box-16`、`performance-monitor` **源码有、npm `@datav-kit/elements@0.0.5` 与线上文档站都没有**（线上 404）。`title-4` 是空目录，**不存在**。本地 `docs/.vitepress/dist/` 是 2026-07-10 的陈旧构建产物，**不可作为事实来源**。
- **库的边界**：只做装饰，不封装图表（架构非目标）。
- **Tracker**：本仓库无 `docs/agents/issue-tracker.md`，`gh` 未登录 → 用 local-markdown（`.scratch/`）。
- **大屏专属规范（01 查证）**：**T/CIDADS 00011-2022《数字大屏可视化设计指南》**（中国工业设计协会，2022，阿里云等起草）是唯一针对数字大屏的团体标准：视距 ≥150cm、最小字号物理高度 = 视距/200、同屏字体 ≤2 种、白色面积 ≤40%、动效 200–600ms。**条款经第三方转述取得，官方原文未获得**，引用须标来源等级。
- **两个仓库级冲突（01 查证）**：① `dvk-fit-screen` 用布局后 `transform: scale()`，`contain` 下 `--dvk-line-width: 1px` 会被缩成亚像素；② `--dvk-motion-duration` 为 **2200–2600ms**，比主流 UI 动效刻度（100–500ms）高一个数量级。
- **ECharts 关键事实（02 实测）**：`init(dom, themeObject)` 可直接传主题对象；令牌用 `getComputedStyle(最近的 .dvk-theme-* 载体)` 读；ECharts 无 alpha 语法需自备 `withAlpha()`；主题切换用 `setTheme(obj)` 不要重新 init；**不要把 `--dvk-motion-duration` 映射进图表**；本仓库 `echarts@6.1.0` 的 `resize()` 不刷新 DPR。
- **组件覆盖度（03 查证）**：两套 Demo 只用到 35 个组件中的 8 个；16 个 border-box **一律没有 `#header`/`#title` slot**（`frame`/`graphic`/`content` 是 Parts），面板标题必须写进默认 slot。

### 已定决策（charting 轮次产出；各 ticket 不得推翻，要改先改这里）

- **形态**：单个 skill `datav-kit`，`SKILL.md` 内部路由 + `references/` 渐进披露。隐式触发（不设 `disable-model-invocation`）。
- **语言**：正文英文；业务文案中文；另附中文 `README.md`。
- **知识库取用**：纯线上。常驻 `llms.txt` 索引，详情按需 fetch 组件页。**不考虑离线**。
- **知识库结构**：三层节点（组件 / 组合模式 / 设计令牌）+ 两类边（模式→组件、令牌→组件）。
- **工作流**：原型优先 — ① brief 澄清 → ② 出 2–3 个不同版式原型 → ③ 用户选定/修改 → ④ 按选定原型实现 → ⑤ 自检 → ⑥ 评审。模板为 3–5 套**固定骨架 HTML**，import map 加载真实组件，内置占位数据与主题切换。
- **设计基准**：新建精简令牌集（间距 8pt、字阶、层级、动效预算），颜色一律走 `--dvk-*`，**禁止第二套颜色源**；固定 1920×1080 设计画布 + `dvk-fit-screen` 缩放；**必须支持深度定制**（大屏内容差异大）。
- **图表**：在 skill 范围内（属于大屏开发职责），不在库范围内。给选型矩阵 + 主题映射 + 反模式 + 可复用 ECharts 配置模板；**不封装成组件**。
- **"稳定"**：以视觉稳定（不跑版）+ 产出稳定（方差小）为主，运行稳定作为硬约束。
- **验收**：案例**重新写**，现有两套 Demo **不作为基准**；Leo 本人评审；评分表由设计规范逐条派生；评审问题回写成 skill 修订项。
- **范围**：纯规划，不改仓库现有文件；规格与 ticket 全在 `.scratch/datav-kit-skill/`，中文。

### 每个 session 应查的技能

- `grilling`（所有 HITL 决策 ticket）、`domain-modeling`（术语收敛）
- `research`（01–03）
- `prototype`（08 如需提高保真度）

## 术语

**大屏**：1920×1080 设计画布 + `dvk-fit-screen` 缩放的目标产物。
**原型**：用户选定视觉契约的可预览 HTML 骨架。
**骨架**：原型中决定栏数、行高比例、顶栏形态与区块增删的结构层；改动必须回原型。
**区块**：骨架内的一个功能区域（面板、栏、KPI 条等）。
**视觉契约**：被选定的原型。
**红线**：四类不可偏离的约束（可读性 / 几何 / 语义 / 无障碍）。
**建议值**：设计规范给出的具体数值与形态；可偏离，但必须登记。
**自由区**：业务内容与数据驱动结构，无需登记。
**偏离清单**：项目内的显式文件，逐条记录偏离与理由；未声明即缺陷。

## Decisions so far

- [规格汇编与锁定](issues/13-spec-assembly.md): `.scratch/datav-kit-skill/spec.md` 已汇编并锁定（交付物 / 目录树 / 逐文件规格 / 流程闸门 / 数值速查 / 实现顺序 / 交接清单）；实现方按它写代码，无需回读 ticket。
- [是否附带参考大屏示例](issues/17-minimal-example.md): **不附带完整大屏**，改为 `assets/minimal-example.html` 最小可运行示例（一屏 + 2–3 面板 + 1 图表）。
- [一屏一套主题](issues/16-one-theme-per-screen.md): **不允许一屏混用多套主题**；强调某区域用颜色角色账本的强调色。
- [skill 文件树与 SKILL.md 大纲](issues/12-skill-file-tree.md): **15 个文件**的目录树（SKILL.md + 中文 README + 5 个 references + 10 个 assets）；`SKILL.md` ≤250 行，含六步流程与五条闸门；`description` 草稿已定；**渐进披露**：6 项常驻（新增 `design-rules.md`）、其余按需；**同步机制**：动态部分靠运行时检测天然跟随，静态副本按发版后 6 项 checklist 核对。
- [项目专属主题的生成与校验](issues/15-project-theme-generation.md): `assets/themes/theme-template.css` 八变量骨架；**从品牌色的推导规则**（色相/明度/alpha，暗色必须降饱和、不用纯黑）；`assets/tools/contrast-check.js` 零依赖校验（文字/图形/装饰线/相邻标记四组，**不可四舍五入**）；**与库主题并存、不做部分继承**；主题不写任何图表或模板代码。
- [工作流检查点与产物](issues/11-workflow-checkpoints.md): 六步（澄清→原型→选定→实现→自检→评审）各有**显式产物文件**（`design/*.md`、`prototype-*.html`）与退出条件；**五条硬闸门**（未选定不得实现 / 不得跳过澄清 / 红线未过不得评审 / 碰红线改骨架回原型 / 未登记偏离即缺陷）；brief 七问；自检从 04 条目 1:1 派生并须查出硬编码值。
- [图表指导与 ECharts 参考实现](issues/10-echarts-templates.md): **分两层**——库无关的图表指导进设计规范（选型矩阵 / 四态 / 内边距 / 字号 / 描边 / 反模式），ECharts 只作**原型的参考实现**（7 个模板放 `assets/charts/`，六件套照抄、数据与选型必须改）；**令牌桥接契约**让规范能落到任意图表库；`map` 类不给模板。
- [知识库索引与路由规格](issues/09-knowledge-base-routing.md): 三层结构（组件层 = 线上 llms.txt + 详情页 / **模式层 = 路由主表** / 令牌层）；路由走 **brief → 模板 → 模式 → 组件**，不建"任务→组件"映射表；模式层六字段（含**可替换项**）；取数判据明确；**可用性清单以 `customElements.get()` 为准**（已发布 30 / 仅 main 5 / title-4 不存在）。
- [原型模板清单与内容规格](issues/08-prototype-templates.md): **四套骨架**（T1 三栏运维 / T2 两栏分析 / T3 单栏叙事 / T4 KPI 主导）；每套声明**骨架 / 区块清单（引用 pattern 编号）/ 组件构成 / 占位数据形状**四段；权限按三档划（骨架红线 = 行数栏数主视图位置顶栏形态区块增删）；**纯 HTML 单文件 + import map（jsDelivr `+esm` 为主）+ `tokens.css`**，图表槽位填最小 ECharts 实例。
- [标题栏实现路径：dvk-title-* 还是手搭](issues/14-title-bar-adjudication.md): 规范只写**组件无关的顶栏视觉契约**，实现路径用 `customElements.get('dvk-title-1')` **特性检测二选一**（Title 可用则用，否则 P3 手搭）；**Title 4 不存在**；知识库加**回退源**（线上 404 → 仓库 raw 文档，须标注"可能未发布"）。
- [设计令牌集的定义](issues/05-design-tokens.md): 五组令牌（间距 / 字体 / 层级 / 动效 / 布局），前缀 `--dvk-screen-*`，声明在 `.dvk-screen` 而非 `:root`；**颜色只读**；字号 5 级 + hero 例外且**必须按 `(视距/200)×(1080/屏高)` 校准**；落盘 `assets/tokens.css`。
- [栅格基准与降级策略](issues/07-grid-and-degradation.md): 画布 1920×1080 + `contain`/居中 + **留白用氛围层填充**；**12 列 / 沟槽 24 / 外边距 48**（8pt）；缩放副作用三条各有对策（SVG `non-scaling-stroke`、**图表优先 SVG renderer**）；降级策略覆盖超宽 / 拼接屏 / 竖屏（不支持）/ 小屏（仅预览）；产出全为建议值。
- [设计规范条目与评分表派生规则](issues/04-design-rules-and-rubric.md): 规范分 **6 组**（画布与栅格 / 间距与节奏 / 字体与层级 / 颜色角色 / 装饰与动效预算 / 数据呈现与异常态）+ 可访问性跨组；条目带**档位与阈值出处**；动效**分三档**（交互 150–300ms / 装饰沿用主题令牌 / 图表 200–400ms）；三个自定阈值（分类色 ≤5、装饰以层级定义、对比度上限 7:1–15:1）；**评分表 1:1 派生、红线二值、建议值三档、不出总分**。
- [深度定制的边界与表达方式](issues/06-customization-boundary.md): 定制分**主题层 / 项目层 / 区块层**；令牌覆盖与区块替换是一等公民，自由 CSS 允许但必须登记；红线四类；权限三档（硬红线 / 建议值 / 自由区）；偏离清单未声明即缺陷；**改骨架或碰红线必须回原型**；自定义主题是顶层入口。
- [大屏设计规范的行业事实基线](issues/01-design-conventions-baseline.md): 10 个规范维度 + 可引用阈值（WCAG 对比度/动效、SMPTE/EBU/ITU 安全边距、ISO 弧分字号、T/CIDADS 数字大屏团标）+ OpenAI 质量门原文；**"装饰预算"与"主色上限"无标准，安全边距无 px 值，21:9 无标准**——这三项必须自定并标注。
- [ECharts 主题化与 datav-kit 令牌映射](issues/02-echarts-theming.md): 令牌注入用 `init(dom, themeObject)` + `getComputedStyle` 读最近 `.dvk-theme-*` 载体；`setTheme(obj)` 切主题不丢状态；图表动效**不沿用** `--dvk-motion-duration`；6.1.0 的 `resize()` 不刷新 DPR；缩放对 canvas 清晰度的影响已量化。
- [组合模式提取（组件文档 + 两套 Demo）](issues/03-composition-patterns.md): 提取 19 个可复用模式（骨架 P1–P5 / 面板 P6–P8 / 指标 P9–P16 / 地图 P17–P19）+ 35 组件放置速查 + 16 条 Demo 不一致清单；结论是**任何从 Demo 提取的配色与面板选型都不得当规范**。

## Not yet specified

（雾区已清空——到期项均已毕业为 ticket 或划出范围）
- 面板容器的 border-box 变体选型规则（16 个变体如何按场景收敛）— 等 09 判定是并入知识库还是单独成票

## Out of scope

- **拼接屏的拼缝补偿做法**（edge offsetting vs content cropping）——规范只要求"精细元素绕开拼缝"（07 已定），补偿属实施技术，取决于厂商与安装精度。
- **大屏之外的组件用法**（常规后台页面）——skill 只管大屏，`SKILL.md` 的"不适用"章节写明。
- 新增或修改组件本身
- 修复 `llms.txt` 与站点不同步（Title 4）— 只作为容忍约束记录
- 在 VitePress 站点上加 skill 文档页
- CI 自动校验 skill 产出
- skill 的多语言版本
- **本次不写任何实现代码**；skill 实现在 map 结束后另开 effort
