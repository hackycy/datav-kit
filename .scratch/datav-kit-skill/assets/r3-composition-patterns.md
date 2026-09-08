# R3 · 组合模式提取（两套 Demo + 35 个组件文档）

> **性质**：事实基线，供知识库"组合模式层"与设计规范取用。只记录**结构、组件 tag、参数**，不抄业务文案。
> **来源**（全部为仓库内一手文件）：
> - `docs/.vitepress/theme/components/AviationCommandScreen.vue`（1051 行）
> - `docs/.vitepress/theme/components/ScenicSpotCommandScreen.vue`（868 行）
> - `docs/.vitepress/theme/components/BorderChartDemo.vue`（163 行）
> - `docs/components/**/*.md`（35 页：borders 16 / decorations 11 / titles 3 / other 5）
> - `docs/architecture.md`、`docs/reference/architecture-contracts.md`、`docs/guide/theming.md`、`docs/guide/framework-integration.md`
> - `docs/.vitepress/theme/index.ts`、`docs/.vitepress/theme/styles.css`
> **引用方式**：下文"参数"= 可复用结构参数（尺寸 / 栅格 / 属性名），**不是规范条文**。凡标 ⚠️ 的条目是 Demo 的偶然做法或缺陷，规范不得直接采用。

---

## 0. 结论摘要（先看这 6 条）

1. **Demo 只覆盖 8/35 个组件**：`dvk-fit-screen`、`dvk-count-to`、`dvk-border-box-10/11/13/15`、`dvk-decoration-6/8/9`。其余 27 个组件"放在哪"只能从文档页取，**不能从 Demo 反推**。
2. **两套 Demo 都没用 `dvk-title-1/2/3`**：顶部标题栏都是"成对镜像装饰轨 + 手写 `h1`"自建的。这与 `docs/architecture.md`「Title 系列用于大屏顶部标题栏、标题横幅和系统名称承载」的定位直接冲突。
3. **"面板用哪个 border-box"两套 Demo 完全不重叠**：Aviation 全用 `-13`（地图用 `-11`），Scenic 用 `-10`（主视觉/地图）+ `-15`（其余）。变体选择目前是"每套 Demo 一个家族"的偶然。
4. **两套 Demo 的设计画布不同**（1920×1280 vs 1920×1080），且都**硬编码色板、都不使用 `dvk-theme-*` 主题类**。
5. **Scenic 用固定像素行高，在 1080 画布上溢出 26px 被裁切**（见 §8-7）。这是缺陷，不可作为规范。
6. 文档页里的 `.datav-demo` / `.datav-panel` / `.datav-decoration-shell` / `.datav-chart-*` 是**文档站样式**（`docs/.vitepress/theme/styles.css`），不是 datav-kit 的组件或 API，引用时不要误当组件能力。

---

## 1. 事实基线：两套 Demo 骨架参数对照

| 维度 | AviationCommandScreen | ScenicSpotCommandScreen |
| --- | --- | --- |
| 适配壳 | `dvk-fit-screen fit-target="host" width="1920" height="1280" mode="contain" align="center center"` | `dvk-fit-screen fit-target="host" width="1920" height="1080" mode="contain" align="center center"` |
| 屏幕内距 | `padding: 46px 54px 52px` | `padding: 44px 50px 42px` |
| 总骨架 | `.screen-layout`：`grid-template-rows: 132px 106px minmax(0,1fr); gap: 28px`（标题 / KPI / 主区） | 无统一 grid：`header 104px` + `body 758px`（`margin-top: 24px`） + `footer 110px`（`margin-top: 24px`） |
| 顶栏 | `grid-template-columns: 390px minmax(0,1fr) 390px; gap: 22px` | `grid-template-columns: 350px minmax(0,1fr) 350px; gap: 24px; height: 104px` |
| 标题轨 | 2 × `dvk-decoration-9`，`position: absolute; top: 31px; width: 430px; height: 64px; opacity: .82`，左轨带 `reverse` | 2 × `dvk-decoration-6`，位于 grid 列 `minmax(170px,1fr)`，`height: 58px; opacity: .78`，左轨带 `reverse` |
| 标题块 | `.title-copy`：`width: min(660px, 100%)`，`padding: 18px 42px`，上下 1px 描边 | `.scenic-title`：`min-width: 560px`，`padding: 12px 32px 14px`，上下 1px 描边 |
| 指标条 | `.kpi-strip`：`repeat(5, minmax(0,1fr)); column-gap: 32px` | 无 KPI 条；`dvk-border-box-10` hero 指标 + `.metric-stack`（2 行） |
| 主区 | `.dashboard-grid`：`430px minmax(0,1fr) 430px; column-gap: 44px` | `.scenic-body`：`340px minmax(0,1fr) 340px; gap: 24px` |
| 左栏行高 | `grid-template-rows: minmax(0,1fr) 320px` | `grid-template-rows: 180px 172px minmax(0,1fr)` |
| 右栏行高 | `grid-template-rows: minmax(0,1fr) 300px 190px` | `grid-template-rows: 164px 150px minmax(0,1fr)` |
| 中栏行高 | `grid-template-rows: minmax(0,1fr) 190px` | 单行（地图占满） |
| 面板间距 | `gap: 18px` | `gap: 16px` |
| 页脚 | 无 | `.scenic-rhythm`：`repeat(7, minmax(0,1fr)); gap: 12px; height: 110px` |
| 面板组件 | `dvk-border-box-13` ×6（`colors="#168cff,#6ed7e8,#52f0b5"` `glow-intensity="0.82"`）+ `dvk-border-box-11` ×1（地图，`colors="#3d7fb8,#6ed7e8,#52f0b5"` `glow-intensity="0.9"`） | `dvk-border-box-10` ×2（hero / 地图，`colors="#36d8c6,#f2c76e" background-color="rgba(8, 26, 37, 0.78)"`）+ `dvk-border-box-15` ×3（`colors="rgba(210, 232, 235, 0.54),#36d8c6" background-color="rgba(8, 26, 37, 0.58)"`） |
| 内距覆盖 | `--dvk-border-box-13-padding: 24px 26px` | `--dvk-border-box-10-padding: 26px`（hero）/ `28px`（地图）；`--dvk-border-box-15-padding: 22px` |
| 用到的组件全集 | `dvk-fit-screen`、`dvk-count-to`、`dvk-border-box-11`、`dvk-border-box-13`、`dvk-decoration-8`、`dvk-decoration-9` | `dvk-fit-screen`、`dvk-count-to`、`dvk-border-box-10`、`dvk-border-box-15`、`dvk-decoration-6` |
| 背景手法 | 网格线（64px）+ 斜向线性渐变 + `::before` 竖线分隔（12% / 88%） | 中心径向光晕 + 网格线（64px）+ 斜向线性渐变 |
| 字体 | `Inter, "PingFang SC", "Microsoft YaHei", sans-serif` | 同左 |

**共同约定（可视为模式）**：眉标用英文（`Flight Waves` / `Capacity Bands`），主标题用中文（`运行波次执行` / `片区承载`）；数值一律走 `dvk-count-to`；面板一律走 `dvk-border-box-*` + 默认 slot；面板内再自建 `.panel-inner`（`grid-template-rows: auto minmax(0,1fr); gap: 16px`）。

---

## 2. 骨架模式（Screen Skeleton）

### P1 · 全屏适配壳

- **用途**：把固定设计稿等比缩放铺进页面容器，是整屏最外层、唯一负责缩放的容器。
- **组件构成**：`<dvk-fit-screen>` 包住整个屏幕 DOM。
- **参数**：`fit-target="host"`（跟随父容器，文档站内嵌用）、`mode="contain"`、`align="center center"`；`width` / `height` 见 §1（两套 Demo 不一致 ⚠️）。组件默认值 `width=1920 height=1080 mode=contain align="center center" fit-target="viewport"`。
- **栅格位置假设**：最外层，占满宿主；内部一切尺寸按设计画布绝对值（px）书写，不做响应式断点。
- **注意事项**：`fit-target="viewport"` 才是整页大屏外壳，`"host"` 只跟随父容器（文档站内嵌必须用 host）。`auto-fullscreen` 只是兼容标志，全屏必须由用户手势触发（`docs/components/other/fit-screen.md`、`architecture-contracts.md`）。宿主必须给定高度，否则画布高度塌陷（Demo 用 `height: clamp(360px, 66vw, 780px)`）。

### P2 · 三段式顶栏（Context + Title + Clock/Status）

- **用途**：大屏顶部信息带：左侧运行上下文、中间标题、右侧时钟/状态。
- **组件构成**：`header`（`grid` 三列）→ 左右两个"信息盒"（手写 `div`/`section`：`span` 小字 + `strong` 主字）+ 中间标题组（见 P3）。
- **参数**：Aviation `390px minmax(0,1fr) 390px; gap: 22px`；Scenic `350px minmax(0,1fr) 350px; gap: 24px; height: 104px`。信息盒内距 `16px 18px` / `18px 20px`，1px 描边 + 半透明底（`rgba(2,13,27,.62)` / `rgba(8,26,37,.6)`）。
- **栅格位置假设**：第一行，固定高度（104–132px），不参与 1fr 分配。
- **注意事项**：左右列宽两套 Demo 差 40px（390 vs 350），是场景偶然值；侧列必须与中列同高，用 `align-items: center` 或 `height: 100%` 对齐。Scenic 的左盒用 `border-left: 4px solid <accent>` 做强调，Aviation 用整圈 1px 描边 —— 两种都合法，但需在规范中二选一。

### P3 · 标题栏：成对镜像装饰轨 + 居中标题块

- **用途**：整屏主标题（系统名）的视觉承载，标题是视觉焦点。
- **组件构成**：`<dvk-decoration-9>`（或 `-6`）左右各一 + 手写标题块（`span` 英文眉标 + `h1` 中文主标题）。
- **参数**：
  - Aviation：`colors="#6ed7e8,#2f8cff,#52f0b5"`，左实例带 `reverse`；`width: 430px; height: 64px; opacity: .82`；标题块 `width: min(660px,100%)`、`padding: 18px 42px`、`border-top: 1px solid rgba(110,215,232,.34)`、`border-bottom: 1px solid rgba(82,240,181,.28)`、`background: linear-gradient(90deg, transparent, rgba(8,28,44,.78) 18% 82%, transparent)`；`h1` 46px / 800 字重 / `text-shadow` 辉光。
  - Scenic：`colors="#36d8c6,#8edfe5,#f2c76e"`，左实例带 `reverse`；轨 `height: 58px; opacity: .78`，位于 `grid-template-columns: minmax(170px,1fr) auto minmax(170px,1fr); gap: 18px`；标题块 `min-width: 560px`、`padding: 12px 32px 14px`；`h1` 40px / 820 字重。
- **栅格位置假设**：顶栏中列，水平居中；两条轨对称占据中列两侧剩余空间。
- **注意事项**：`reverse` 是 `dvk-decoration-5/6/7/9` 的**文档化用途**（"Mirrors the decoration horizontally for symmetric title or divider layouts"），成对镜像属于**有依据的模式**，不是偶然。两种定位方式各有风险：Aviation 的 `position: absolute; top: 31px` 在窄画布上会与标题文字重叠；Scenic 的 grid 列更稳。**⚠️ 标题两侧的 1px 上下描边 + 半透明底是两套 Demo 各自手写的**，不是任何组件的能力。

### P4 · KPI 指标条

- **用途**：整屏顶部一行 4–6 个核心指标。
- **组件构成**：`section.kpi-strip`（grid）→ `article.kpi-card` ×N（手写卡片）→ 每张卡内 `<dvk-count-to>`。
- **参数**：`grid-template-columns: repeat(5, minmax(0,1fr)); column-gap: 32px`；卡片 `padding: 14px 18px`、1px 描边、半透明底、`box-shadow: inset 0 0 18px rgba(24,240,255,.04)`；`dvk-count-to` 用 `:end-val` / `:decimals` / `:suffix` / `separator=","` / `duration="1600"`，并通过 CSS 变量 `--dvk-count-to-font-size: 32px`、`--dvk-count-to-font-weight: 800`、`--dvk-count-to-affix-font-size: 0.58em`、`--dvk-count-to-affix-color` 控制排版。
- **栅格位置假设**：总骨架第二行，固定高度（106px），不参与 1fr 分配；卡片等宽。
- **注意事项**：**⚠️ KPI 卡片是手写 `div`，没有用任何 datav-kit 组件**（既不是 `dvk-border-box-*`，也不是唯一带 slot 的 `dvk-decoration-4`）。这是性能/成本取舍的偶然，规范需要自己决定 KPI 卡片的推荐实现。颜色分档（`kpi-card--green/amber/violet` 改 `border-color`）也是手写。

### P5 · 三栏主栅格

- **用途**：大屏主区：左列（过程/列表）、中列（主视图）、右列（状态/队列）。
- **组件构成**：`main`（grid 三列）→ 三列各自是 `grid` 容器，行内放 `dvk-border-box-*` 面板。
- **参数**：Aviation `430px minmax(0,1fr) 430px; column-gap: 44px`；Scenic `340px minmax(0,1fr) 340px; gap: 24px`。列内行高见 §1。
- **栅格位置假设**：占满总骨架剩余高度（`minmax(0,1fr)`）；三列**必须**显式写 `minmax(0, …)` 与 `min-height: 0`，否则内容会把栅格撑破。
- **注意事项**：左右列宽是场景值（430 / 340，占 1920 的 22.4% / 17.7%），非规范；中列永远是 `minmax(0,1fr)`。**⚠️ 行高策略两套 Demo 相反**：Aviation 全流式 `minmax(0,1fr)`，Scenic 固定 px —— 规范应采用流式（见 §8-7）。

---

## 3. 面板模式（Panel）

### P6 · 面板容器（border-box 选型 + 内容内距）

- **用途**：承载一块业务内容，提供边框/角饰/底色。
- **组件构成**：`<dvk-border-box-N>` 包住 `.panel-inner`（默认 slot 内）。
- **参数**：
  - `colors` 是**逗号分隔**字符串，顺序 `primary,secondary` 或 `primary,secondary,accent`（16 个 border-box 全部如此）。
  - 有 `background-color` prop 的只有 `-7/-8/-9/-10/-15`（面板家族）；`-1/-2/-3/-4/-5/-6/-11/-12/-13/-14/-16` **没有**该 prop（大屏家族），面板底色要靠宿主 CSS 或屏幕背景提供。
  - `glow-intensity` 只存在于 `-2/-3/-4/-5/-6/-11/-12/-13/-14/-16`（`-16` 默认 `0.7`，其余 `1`）。
  - 内容内距：默认由组件按 `contentRect → CSS padding` 计算；可用 `--dvk-border-box-N-padding`（组件级）或 `--dvk-border-box-padding`（跨组件共享）覆盖，优先级 `-N-padding > -padding > 计算值`（`architecture-contracts.md`）。
- **栅格位置假设**：任意栅格单元格；组件默认 `height: 100%` 撑满父格，宽度 100%。
- **注意事项**：**16 个 border-box 一律只有默认 slot，没有 `#header` / `#title` slot**（`frame` / `graphic` / `content` 是 Parts，不是 slot）。所谓"标题栏一体"（`-11` 左侧 title rail、`-12` 顶部 title rail）只是**图形装饰**，标题文字仍需自己写进默认 slot。**⚠️ 两套 Demo 都覆盖了安全区内距**（`--dvk-border-box-N-padding`），意味着 Demo 并没有验证计算出的默认安全区；规范需给出"何时可覆盖"的判据。

### P7 · 面板头（eyebrow + 主标题 + 右侧区）

- **用途**：面板顶部信息带，交代"这是什么面板"和"当前状态"。
- **组件构成**：`header.panel-heading`（`display: flex; justify-content: space-between`）→ 左侧 `div`（`p` 英文眉标 + `h3` 中文标题）+ 右侧区（状态 chip / 标签组）。
- **参数**：`gap: 14px`；眉标 `font-size: 16px`、青色半透明；主标题 `font-size: 24px`、`font-weight: 760`、白色；右侧 chip：`padding: 5px 9px`、`border: 1px solid rgba(82,240,181,.32)`、`font-size: 14px`、半透明底。面板头与内容体的间距来自 `.panel-inner` 的 `gap: 16px`。
- **栅格位置假设**：面板内容区第一行（`grid-template-rows: auto minmax(0,1fr)` 的 `auto` 行）。
- **注意事项**：**⚠️ 两套 Demo 的面板头不同构**：Aviation 恒定三件套（`<p>` + `<h3>` + 右侧 `<span>` chip）；Scenic 只有 `<span>` 眉标 + `<strong>` 标题、**无右侧 chip**，且标题元素用 `strong` 而非 `h3`。规范必须统一标题层级元素（建议 `h3`）与"右侧区是否必选"。

### P8 · 面板头右侧：状态 chip 与标签组

- **用途**：在面板头右侧显示计数/状态，或一组分类标签。
- **组件构成**：纯手写 `span` / `div.map-tags > span`。
- **参数**：
  - 状态 chip：`4 WINDOWS` / `LIVE` / `3 ACTIVE` / `SLA`（大写英文短语或计数）；`border: 1px solid rgba(82,240,181,.32); background: rgba(82,240,181,.08); color: #c7fff0`。
  - 标签组：`display: flex; flex-wrap: wrap; justify-content: flex-end; gap: 8px`；每个 chip `padding: 7px 10px`、`border: 1px solid rgba(110,215,232,.18)`、`font-size: 15px`。
- **栅格位置假设**：面板头右侧，`flex: 0 0 auto`。
- **注意事项**：两种形态（状态 chip / 标签组）在 Demo 中都被使用，规范应分别定义；chip 文本全部是**业务文案**，不进入规范。

---

## 4. 指标与数据展示模式（Metric / Data Display）

### P9 · 水平进度行（progress line）

- **用途**：一行"标签 + 数值 + 进度条"，用于占比/完成率。
- **组件构成**：手写 `div.progress-line` + `<i>`；数值用 `<dvk-count-to>`。
- **参数**：`.progress-line { position: relative; height: 8px; overflow: hidden; background: rgba(110,215,232,.12) }`；填充 `<i> { width: var(--bar-value); background: linear-gradient(90deg, #168cff, #52f0b5); box-shadow: 0 0 12px rgba(82,240,181,.42) }`；进度值通过**内联 CSS 变量** `--bar-value` 注入（`:style="{ '--bar-value': \`${v}%\` }"`）。数值行用 `dvk-count-to`：`--dvk-count-to-font-size: 18px`、`--dvk-count-to-font-weight: 760`、`--dvk-count-to-affix-font-size: 0.62em`。
- **栅格位置假设**：面板列表行内，跨满行宽（`grid-column: 1 / -1`）。
- **注意事项**：**⚠️ 同一文件内有两套进度实现**：Scenic 的 `.capacity-row i` 用内联 `width`，`.scenic-rhythm i` 用 `--bar-value`；Aviation 统一用 `--bar-value`。规范应统一为 CSS 变量（可主题化、可动画）。

### P10 · 排行 / 压力行（Rank Row）

- **用途**：枢纽压力、片区承载一类的"名称 + 状态词 + 全宽进度"行。
- **组件构成**：`article`（grid）+ 名称区（`strong` 代号 + `span` 城市）+ `em` 状态词 + 全宽 `.progress-line`。
- **参数**：Aviation `.airport-row { grid-template-columns: minmax(0,120px) minmax(0,1fr) }`，进度条 `grid-column: 1 / -1`，代号 `font-size: 25px; color: #52f0b5`；行 `padding: 13px 14px`、1px 描边、半透明底；列表 `display: grid; gap: 12px`。
- **栅格位置假设**：左/右列面板内容区，纵向堆叠，`align-content: start`。
- **注意事项**：行高由内容决定，列表需 `overflow: hidden` 防止溢出面板。

### P11 · 处置队列卡（Triage Card）

- **用途**：风险/工单/任务队列，按等级配色。
- **组件构成**：`article`（grid）+ 等级徽标 `b` + 文本区（`strong` 标题 + `span` 副信息）+ 右侧时间 `time`。
- **参数**：Aviation `.risk-card { grid-template-columns: 42px minmax(0,1fr) 52px; gap: 12px; padding: 14px; border-left: 3px solid rgba(110,215,232,.48) }`，按 tone 改 `border-left-color`（`#ef476f` / `#ffd166`）；Scenic `.dispatch-card { grid-template-columns: 46px minmax(0,1fr); gap: 12px; padding: 14px; border-left: 3px solid #36d8c6 }`，tone 改 `border-left-color` + 徽标色。
- **栅格位置假设**：右列面板内容区（"处置/队列"面板），纵向堆叠。
- **注意事项**：这是两套 Demo 中**结构最接近的手写模式**（左边框色 + 徽标 + 两行文本），建议直接抽成规范级模式。等级徽标/时间列宽（42/46px、52px）是场景值。

### P12 · 分时节奏柱（Rhythm Bars，竖向填充）

- **用途**：按时间片展示强度/节奏（未来 N 小时、全天客流）。
- **组件构成**：`div`（grid，N 等分）→ `article` ×N（`grid-template-rows: auto minmax(0,1fr) auto`）→ 顶部 `time` / 柱槽 `div > i` / 底部标签。
- **参数**：Aviation `.timeline-track { repeat(5, minmax(0,1fr)); gap: 12px }`，柱槽 `min-height: 72px`，填充 `height: var(--bar-value); background: linear-gradient(180deg, rgba(255,209,102,.86), rgba(82,240,181,.72))`；Scenic `.scenic-rhythm { repeat(7, minmax(0,1fr)); gap: 12px; height: 110px }`，填充 `linear-gradient(180deg, #f2c76e, #36d8c6)`。
- **栅格位置假设**：中列底部一行（Aviation，190px）或整屏页脚（Scenic，110px）。
- **注意事项**：两套实现一致（`--bar-value` + 竖向填充），可视为**已验证的共享模式**；列数（5 / 7）与渐变方向由场景决定。柱槽必须有 `min-height`，否则 `minmax(0,1fr)` 下会塌陷。

### P13 · 环形仪表（Ring Gauge）

- **用途**：单一百分比指标（同步率、健康度）的环形表达。
- **组件构成**：`<dvk-decoration-8>` 内嵌 `<dvk-count-to>`（`dvk-decoration-8` 有默认 slot 与 `content` part，文档明确用于框住指标/图标）。
- **参数**：`colors="#52f0b5,#2b7cff"`、`dur="6"`；宿主 `width: 128px; height: 128px`（需接近正方形）；内嵌 `dvk-count-to end-val="98.4" decimals="1" suffix="%"` + `--dvk-count-to-font-size: 18px`、`-font-weight: 800`、`-affix-font-size: 0.58em`。外层 `grid-template-columns: 128px minmax(0,1fr); gap: 18px`，右侧放说明文字。
- **栅格位置假设**：右列底部窄面板（Aviation 190px 行）。
- **注意事项**：`dvk-decoration-8` 的 slot 内容尺寸需自控（Demo 用 18px 数字）；`dur` 建议 4–6s。**⚠️ 只出现一次**，属于"单点用法"，规范采用前应再验证一次。`dvk-decoration-10/11` 同类圆环在 Demo 中未出现。

### P14 · 大数字英雄指标（Hero Metric）

- **用途**：整块面板只放一个核心数字（当前承载指数）。
- **组件构成**：`dvk-border-box-10` + `.hero-metric`（`span` 标签 + `dvk-count-to` + `p` 说明）。
- **参数**：`dvk-count-to end-val="71" suffix="%" duration="1500"`；`--dvk-count-to-font-size: 52px`、`-font-weight: 820`、`-affix-font-size: 0.42em`、`-affix-color: #f2c76e`；面板 `--dvk-border-box-10-padding: 26px`。
- **栅格位置假设**：左列顶部固定高度行（Scenic 180px）。
- **注意事项**：数字字号（52px）与普通 KPI（32px / 25px）形成三级字阶，可提炼为字阶规则；⚠️ 但三级字阶来自单套 Demo，需与设计令牌轮次对齐。

### P15 · 双列指标卡组（Metric Stack / Service Grid）

- **用途**：2 个次级指标并排/堆叠。
- **组件构成**：`section.metric-stack`（或 `.service-grid`）→ `article` ×2 → `dvk-count-to`。
- **参数**：`grid-template-rows: repeat(2, minmax(0,1fr)); gap: 10px`；卡片 `padding: 14px 16px`、1px 描边；`dvk-count-to` `--dvk-count-to-font-size: 25px`、`-font-weight: 800`、`-affix-font-size: 0.55em`、`-affix-color: rgba(205,229,232,.74)`。
- **栅格位置假设**：左列/右列中间行（172px / 150px）。
- **注意事项**：卡组本身没有外框（裸 `section`），与上下相邻的 `border-box` 面板形成"有框 / 无框"交替；这是 Scenic 的排布手法，规范需决定是否允许无框卡组。

### P16 · 数值展示（`dvk-count-to` 通用用法）

- **用途**：所有会动起来的数字。
- **组件构成**：`<dvk-count-to>`。
- **参数**（文档全量）：`start-val`(0)、`end-val`(0)、`duration`(2000 ms)、`delay`(0)、`decimals`(0)、`decimal`(".")、`separator`(",")、`prefix`("")、`suffix`("")、`disabled`(false)、`transition`(`easeOutExpo` | `linear` | `easeOutCubic` | `easeInOutCubic`)；slots `prefix` / `suffix`（**slot 优先于同名 prop**）；CSS 变量 `--dvk-count-to-color/font-family/font-size/font-weight/gap/affix-color/affix-font-size/decimal-color/decimal-font-size/decimal-font-weight`。
- **栅格位置假设**：任意指标位；建议统一通过宿主选择器设置 `--dvk-count-to-font-size`，而不是逐处 `style`。
- **注意事项**：**⚠️ 两套 Demo 把数值型 attribute 写成字符串**（`duration="1600"`、`decimals="1"`、`end-val="71"`）。HTML attribute 会被 coerce，能跑，但规范应统一写法（推荐 `:end-val` / `:duration` 绑定或全部 attribute 化，二选一）。Demo 用到的 duration 有 1300/1400/1500/1600 四种，无规律 ⚠️。

---

## 5. 地图 / 主视图模式（Map Stage）

### P17 · 态势主视图（Map Stage）

- **用途**：整屏视觉主角，占中列，通常占 2/3 屏高以上。
- **组件构成**：`dvk-border-box-*`（Aviation `-11`，Scenic `-10`）+ `.map-panel`/`.map-shell`（`grid-template-rows: auto minmax(0,1fr); gap: 16–18px`）+ 地图容器 `div`（`position: relative; overflow: hidden`，1px 描边 + 网格底纹）+ 内嵌 `<svg viewBox="0 0 980 610|620">` + 绝对定位标记 + 叠加卡。
- **参数**：SVG 用 `position: absolute; inset: 28px 28px 24px`（Aviation）/ `32px 38px 28px`（Scenic），`width/height: calc(100% - …)`；底纹 `background-size: 42px 42px`；路径用 `<linearGradient>` 做航路/动线（主路径加粗、告警路径换色），`stroke-dasharray` 表示流动；同心圆环用 `stroke-dasharray` 做虚线圈。
- **栅格位置假设**：中列主行（`minmax(0,1fr)`），面板头在上、地图占满剩余。
- **注意事项**：**⚠️ 两套 Demo 给地图用了不同变体**（`-11` vs `-10`）；`-11` 无 `background-color`，`-10` 有 —— 变体差异是能力差异，不是风格差异。SVG 尺寸与 inset 两套不同（28/24 vs 32/38/28），属偶然值。

### P18 · 地图标记（Map Marker）

- **用途**：在地图上标点位（枢纽/节点/航班）。
- **组件构成**：绝对定位 `div`（`left/top` 百分比）+ 菱形点 `i`（`transform: rotate(45deg)`）+ `strong` 代号 + `span` 名称（+ `em` 数值）。
- **参数**：`.hub-marker { position: absolute; transform: translate(-50%,-50%); display: grid; justify-items: center; gap: 4px; min-width: 88px; pointer-events: none }`；点 `width/height: 16px`（Scenic 14px）、`border: 2px solid <accent>`、`box-shadow: 0 0 18px <accent>`；按 tone 改点色（`#f2c76e` / `#ff6b6b` / 半透明灰）。航班图标用 `clip-path: polygon(...)` + `transform: rotate(var(--plane-rotate))`。
- **栅格位置假设**：地图容器内，坐标由数据给出（百分比，与 SVG viewBox 解耦）。
- **注意事项**：**⚠️ 同一模式两套手写、类名与尺寸都不同**（`.hub-marker` 88px / `.map-node` 94px）。规范应把它抽成一个统一模式（标记尺寸、标签层级、tone 语义）。`pointer-events: none` 必须保留，否则遮挡地图交互。

### P19 · 地图叠加卡（Map Overlay Card）

- **用途**：在地图上压一张结论/说明卡，不打断地图。
- **组件构成**：绝对定位 `section`（`right`/`bottom`）+ `span` 眉标 + `strong` 结论 + `p` 说明。
- **参数**：Scenic `.map-summary { right: 30px; bottom: 28px; width: 360px; padding: 16px 18px; border: 1px solid rgba(242,199,110,.24); background: rgba(6,20,30,.82) }`；Aviation `.weather-zone { right: 118px; bottom: 86px; width: 132px; height: 92px }`（更小的"区域标签"）。
- **栅格位置假设**：地图容器内右下角。
- **注意事项**：两种尺度（结论卡 / 区域标签）都合法，但**位置偏移值全是场景值**；卡片必须有足够不透明度（≥.8）保证压图可读。

---

## 6. 装饰使用模式（Decoration Usage）

| 角色 | 用到的组件 | Demo 中的参数 | 为什么 | 备注 |
| --- | --- | --- | --- | --- |
| 标题两侧镜像轨 | `dvk-decoration-9`（Aviation）/ `dvk-decoration-6`（Scenic） | `colors` 三色 + 左实例 `reverse`；高度 64 / 58px；`opacity: .82 / .78` | 两者文档定位都是"极简 HUD 轨道、几何不闭合"，`reverse` 文档写明用于对称标题/分割布局 | 两个组件功能高度重叠，规范需选一个作为标题轨标准件 |
| 圆形指标环 | `dvk-decoration-8` | `colors="#52f0b5,#2b7cff"` `dur="6"`；宿主 128×128 | 唯一带默认 slot 的圆环，可框住数字 | 未在 Scenic 出现 |
| 面板/主视图外框 | `dvk-border-box-13`（Aviation，6 处）/ `-11`（地图）/ `-10`（Scenic 主视觉）/ `-15`（Scenic 其余） | 见 §1 | —— | **⚠️ 两套不重叠** |
| 面板分割线 / 页面分割线 | **未使用** | —— | —— | 11 个 decoration 里 `-1/-2/-3/-5` 都适合做分割线，但两套 Demo 都没用；"分割线"用法只能从文档页取 |
| 页面边角装饰 | **未使用** | —— | —— | `dvk-decoration-4`（角饰 + slot）在 Demo 中未出现 |
| 背景动效 | 无组件，全部手写 CSS（网格线、径向光晕、`::before` 竖线） | —— | —— | 大屏背景不是 datav-kit 的职责 |

**颜色观察（重要）**：两套 Demo 各自硬编码一整套色板 —— Aviation `#6ed7e8` / `#2f8cff` / `#52f0b5` / `#168cff` / `#3d7fb8` / `#ffd166` / `#ef476f`；Scenic `#36d8c6` / `#8edfe5` / `#f2c76e` / `#ff6b6b`。**都不使用 `dvk-theme-cyber-blue` 等主题类**，而 `docs/guide/theming.md` 与 5 个主题包（cyber-blue / ice-white / matrix-green / neon-magenta / solar-gold）正是为此存在。各组件文档页的 demo 又各用第三套色（如 `#235fa7,#4fd2dd`）。**结论：颜色是场景变量，任何"从 Demo 提取的配色"都不可作为规范。**

---

## 7. 组件放置速查（35 条，一行一个）

### Borders（16）

| 组件 | 放哪 |
| --- | --- |
| `dvk-border-box-1` | 通用卡片/面板单线框；也可撑满做整屏矩形外框。默认 `height:100%`，内容自适应需加 `auto-height` |
| `dvk-border-box-2` | 大屏主视图 / 全屏外框 / 大型主图表容器（1600×900 大屏语法，角与中央模块固定） |
| `dvk-border-box-3` | 大屏主视图 / 密集数据面板外框（1672×941 语法，边条单轴延伸） |
| `dvk-border-box-4` | 视觉主角位：主视图 / 主图表容器外框（细节密度最高） |
| `dvk-border-box-5` | 大屏主视图 / 全屏外框；文档专设 "Free Border"（内容撑开 / 固定 / 百分比均可），组件不画背景 |
| `dvk-border-box-6` | 大屏主视图 / 主图表面板框（工程感最强，角与斜纹固定） |
| `dvk-border-box-7` | 面板 / 卡片（斜切角发光面板，有 `background-color`） |
| `dvk-border-box-8` | 面板 / 卡片 / 仪表盘容器（动态多边形 + 动画角饰，有 `background-color`） |
| `dvk-border-box-9` | 面板 / 卡片（普通信息块；边框色/宽用 `--dvk-border-box-9-border-color/-width` 覆盖） |
| `dvk-border-box-10` | 面板 / 卡片 / 仪表盘块（圆角轮廓 + 四角动画辉光，有 `background-color`）—— Scenic 的主视觉与地图用它 |
| `dvk-border-box-11` | 大屏主视图 / 指挥中心主面板外框（企业状态轨条）—— Aviation 的地图用它 |
| `dvk-border-box-12` | 最接近"全屏边框"的一个（自带顶部 title rail **装饰**，但明确无标题栏/标题框） |
| `dvk-border-box-13` | 大屏主视图 / 命令中心面板外框（底部承载脊，适合整屏底部收边）—— Aviation 的主力面板 |
| `dvk-border-box-14` | 大屏主视图 / 精密科技感面板框（浅边框、弱存在感） |
| `dvk-border-box-15` | 最通用的卡片/小面板框（最轻量，适合大量重复排布）—— Scenic 的次级面板 |
| `dvk-border-box-16` | 紧凑 KPI / 拓扑 / 设备健康面板框（默认 `glow-intensity=0.7`，无 `background-color`） |

### Decorations（11）

| 组件 | 放哪 |
| --- | --- |
| `dvk-decoration-1` | 标题栏下方横向装饰条 / 面板分割线（竖向柱条纹理，呼吸动画） |
| `dvk-decoration-2` | 面板标题左缀 / 点阵分割线（两行光点） |
| `dvk-decoration-3` | 响应式分割线 / 标题两侧斜角线（虚线流动） |
| `dvk-decoration-4` | 小型 KPI 卡片 / 指标块的菱形外框（**唯一带默认 slot 的边框类装饰**，可居中放内容） |
| `dvk-decoration-5` | 标题栏横向装饰条 / 面板分割线（静态三段斜折线，`reverse` 成对） |
| `dvk-decoration-6` | 标题栏左右对称装饰轨 / 面板标题左缀（不闭合 HUD 轨道）—— Scenic 标题轨 |
| `dvk-decoration-7` | 大标题栏主装饰带 / 模块分隔带（视觉重量最大，86–92px 厚，需深色背景衬托） |
| `dvk-decoration-8` | 圆形仪表 / 指标环（带 slot，中空处放数字）—— Aviation 同步率环 |
| `dvk-decoration-9` | 标题栏左右横向轨道（`reverse` 成对）/ 面板标题左缀 —— Aviation 标题轨 |
| `dvk-decoration-10` | 圆形雷达主视觉 / 图表背景（自带深色径向底，可当一块独立视觉区） |
| `dvk-decoration-11` | 圆形光环主视觉 / 大屏中心悬浮状态环（**无 slot**，纯装饰） |

### Titles（3）

| 组件 | 放哪 |
| --- | --- |
| `dvk-title-1` | 顶部整屏大标题横幅（细长企业级，demo 高 68–76px、宽 900–1080px） |
| `dvk-title-2` | 顶部大标题（指挥中心类，深色玻璃 + 对称机械翼，demo 高 58–64px，三者中最矮） |
| `dvk-title-3` | 顶部大标题（极光弧线，demo 高 78–88px，三者中最高） |

> 三个 Title 的 props 完全同构：`color` / `secondary-color` / `accent-color` / `colors` / `title-text`；内容走默认 slot 且与 `title-text` 互斥；内容层 parts 恒为 `content` / `title` / `title-text`。
> **⚠️ 两套 Demo 都没有使用它们**（见 §0-2）。规范必须先裁决"Title 家族 vs 自建标题栏"。

### Other（5）

| 组件 | 放哪 |
| --- | --- |
| `dvk-count-to` | 任何需要动效的数字位：KPI、hero 指标、进度行数值、环内数字 |
| `dvk-fit-screen` | 最外层适配壳（整屏唯一负责缩放的元素） |
| `dvk-loading-energy` | 加载态（面板/卡片/对话框/表格空态；`size` 默认 72） |
| `dvk-loading-orbit` | 更轻量的全局/局部 loading（`size` 默认 50，唯一持续动画的 Other 组件） |
| `dvk-performance-monitor` | **开发期诊断浮层**（FPS + 0–100 压力分），不是大屏区域组件；文档站把它全局挂在 `layout-bottom` |

---

## 8. 不一致与偶然做法（规范不得直接采用）

按严重度排序。

1. **⚠️ 两套 Demo 都没用 Title 家族**（最严重）。两者都用"成对 `dvk-decoration-*` + 手写 `h1`"自建顶栏，而 `docs/architecture.md` 明确「Title 系列用于大屏顶部标题栏、标题横幅和系统名称承载，不应退化成普通装饰线条，也不应做成厚重边框容器」。**规范必须裁决**：Title 家族是唯一实现，还是自建标题栏也合法；若两者并存，需给出判据。
2. **⚠️ 设计画布不一致**：1920×1280（Aviation）vs 1920×1080（Scenic）；`dvk-fit-screen` 默认值与 map 已定基准均为 1920×1080。1280 是 Aviation 的偶然选择。
3. **⚠️ 面板变体选择不重叠**：同一语义"面板"在 Demo 中映射到 `-13` / `-11` / `-10` / `-15` 四个变体，且分工方式是"每套 Demo 一个家族"。文档只给出视觉描述（全屏语法 vs 面板语法）与能力差异（`background-color`、`glow-intensity`、`accent-color` 有无），**没有给出选型规则**。规范需要补这条规则。
4. **⚠️ 面板底色机制不一致**：Aviation 的 `-13` 无 `background-color`，面板靠屏幕背景透出；Scenic 的 `-10/-15` 显式传 `background-color`。规范需明确"面板是否必须有独立底色层"。
5. **⚠️ 面板头不同构**：Aviation 恒定 `<p>` 眉标 + `<h3>` 标题 + 右侧 `<span>` chip；Scenic 只有 `<span>` 眉标 + `<strong>` 标题、无右侧 chip。**标题层级元素（`h3` vs `strong`）与右侧区是否必选必须统一。**
6. **⚠️ 数值型 attribute 一律写成字符串**（`duration="1600"` / `decimals="1"` / `end-val="71"`），依赖组件 coerce；且 duration 取值 1300/1400/1500/1600 无规律。规范应统一绑定写法与动效时长档位。
7. **⚠️ Scenic 用固定像素行高，在 1080 画布上溢出被裁**：`.scenic-screen` 是 `box-sizing: border-box`（VitePress 全局 reset `*,:before,:after{box-sizing:border-box}`），`padding: 44px 50px 42px`，可用内容高 994px；子元素 `header 104 + body(margin 24 + 758) + footer(margin 24 + 110) = 1020px`，**溢出 26px**，被 `.scenic-screen { overflow: hidden }` 裁掉。Aviation 用 `minmax(0,1fr)` 流式行高则不会。**规范必须采用流式（`minmax(0,1fr)`）而非固定 px 行高。**
8. **⚠️ 进度条两套实现**：同文件内混用 `--bar-value` 与内联 `width`。规范应统一为 CSS 变量。
9. **⚠️ 地图标记两套手写**：`.hub-marker`（88px）与 `.map-node`（94px），命名与尺寸都不同，但结构与视觉一致（绝对定位 + 45° 菱形 + 两级文字）。应抽成一个模式。
10. **⚠️ 配色完全硬编码且互相不同**，且都不使用 `dvk-theme-*` 主题类（见 §6 末）。组件文档页的 demo 又是第三套色。**任何"从 Demo 提取的配色"都不是规范。**
11. **⚠️ 内距覆盖未经默认值验证**：两套 Demo 都显式覆盖 `--dvk-border-box-N-padding`，因此从未验证过 `contentRect` 计算出的默认安全区在真实面板尺寸下是否合适。规范若要依赖安全区默认值，需要单独验证。
12. **⚠️ KPI 卡片全部手写**（无组件），且两套写法不同（Aviation 有 tone 分档改 `border-color`，Scenic 无 tone）。规范需给出 KPI 卡片的推荐实现。
13. **⚠️ 顶栏信息盒两种强调手法**：`border-left: 4px solid <accent>`（Scenic）vs 整圈 1px 描边（Aviation）。二选一。
14. **⚠️ 文档页 demo 外壳不是组件能力**：`.datav-demo`（`min-height: 360px`）、`.datav-panel`（`720×320` / `--wide` 16:9）、`.datav-decoration-shell`（默认 300×40）、`.datav-chart-shell`（`--datav-chart-height` 默认 430px）都是 `docs/.vitepress/theme/styles.css` 里的文档站样式。写规范时不要把它们的尺寸当成组件默认尺寸。
15. **⚠️ `dvk-performance-monitor` 不是大屏组件**：文档定位为"local and development-time tool"，但文档站在 `theme/index.ts` 的 `layout-bottom` 全局渲染它。不要把它写进大屏骨架。
16. **⚠️ Title 数量口径**：仓库内 `docs/components/titles/` 只有 3 页（title-1/2/3），而 map 记录线上 `llms.txt` 列了 Title 4 —— 这是已记录的容忍约束，规范不要引用 title-4。

---

## 9. 可直接复用的"结构骨架"（去掉业务后的最小形态）

```html
<dvk-fit-screen fit-target="host" width="1920" height="1080" mode="contain" align="center center">
  <div class="screen">                              <!-- padding + 背景网格 -->
    <div class="screen-layout">                     <!-- grid-template-rows: 132px 106px minmax(0,1fr); gap -->
      <header class="screen-header">                <!-- grid-template-columns: L minmax(0,1fr) R -->
        <div class="header-status">…</div>
        <div class="screen-title">                  <!-- P3 -->
          <dvk-decoration-9 class="title-ribbon" colors="…" reverse></dvk-decoration-9>
          <div class="title-copy"><span>EN eyebrow</span><h1>中文标题</h1></div>
          <dvk-decoration-9 class="title-ribbon" colors="…"></dvk-decoration-9>
        </div>
        <div class="header-status">…</div>
      </header>

      <section class="kpi-strip">                   <!-- repeat(N, minmax(0,1fr)) -->
        <article class="kpi-card">
          <span>label</span>
          <strong><dvk-count-to :end-val="…" :decimals="…" :suffix="…" separator="," :duration="…"></dvk-count-to></strong>
          <em>meta</em>
        </article>
      </section>

      <main class="dashboard-grid">                 <!-- L minmax(0,1fr) R -->
        <aside class="left-column">                 <!-- grid-template-rows: minmax(0,1fr) 320px; gap -->
          <dvk-border-box-13 colors="…" glow-intensity="…">
            <section class="panel-inner">           <!-- grid-template-rows: auto minmax(0,1fr); gap: 16px -->
              <header class="panel-heading"><div><p>EN eyebrow</p><h3>中文标题</h3></div><span>STATUS</span></header>
              <div class="list">…</div>
            </section>
          </dvk-border-box-13>
        </aside>

        <section class="center-column">             <!-- grid-template-rows: minmax(0,1fr) 190px -->
          <dvk-border-box-11 colors="…" glow-intensity="…"> <!-- 地图主视图 P17 -->
          <dvk-border-box-13 colors="…">                    <!-- 分时节奏柱 P12 -->
        </section>

        <aside class="right-column">…</aside>
      </main>
    </div>
  </div>
</dvk-fit-screen>
```

**骨架层可提炼的常量（来自两套 Demo 的交集）**：屏幕内距 44–54px；顶栏高 104–132px；KPI 条高 106px；栏间距 24–44px；面板间距 16–18px；面板内距 22–28px；眉标 15–16px、面板标题 22–24px、KPI 数字 25–32px、hero 数字 52px。**区间两端分别来自两套 Demo，规范应各取一个值而不是照抄区间。**
