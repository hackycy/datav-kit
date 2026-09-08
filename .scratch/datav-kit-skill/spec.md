# datav-kit skill 设计规格（锁定）

> **状态：锁定。** 本规格由 `.scratch/datav-kit-skill/` 的 17 张 wayfinder ticket 汇编而成（见 `map.md` 的 Decisions so far）。
> 实现方按本规格写 `skills/datav-kit/`，**无需回读 ticket**；ticket 只作决策留痕。
> 本规格只规划，不含实现代码。

---

## 0. 交付物与完成定义

**交付物**：仓库根 `skills/datav-kit/` 目录，16 个文件，通过 `npx skills add hackycy/datav-kit` 可安装。

**完成定义**：

1. 目录树与 §2 一致，每个文件按 §3 的规格写。
2. `SKILL.md` 的 `description` 与 §3.1 一致（或语义等价的英文表述）。
3. 四套原型模板（`assets/prototypes/t*.html`）**双击即可打开**，控制台无报错。
4. `assets/minimal-example.html` 双击即可打开，5 分钟内能看到完整效果。
5. 七个图表模板（`assets/charts/*.js`）能在原型里跑起来。
6. `assets/tools/contrast-check.js` 对四组对象输出 PASS/FAIL。
7. 中文 `README.md` 写清覆盖范围声明。

**不在本规格范围内**：修改组件、修复线上文档站、CI 校验、多语言版本。见 `map.md` 的 Out of scope。

---

## 1. 定位与边界

**做什么**：用 datav-kit 的 `dvk-*` Web Components 做**大屏**——从 brief 澄清到原型选型到实现与评审的完整流程，外加一套可执行的设计规范与知识库。

**不做什么**：

- 不管**大屏之外**的组件用法（常规后台页面）——`SKILL.md` 的"不适用"章节要写明。
- 不封装组件、不内置图表库。
- 不承诺离线：知识库的详情层从线上取（回退源见 §3.5）。

**两条硬约束**：

- 颜色只有一个来源：`--dvk-color-*`（主题包）。**禁止第二套颜色源。**
- 主题只管颜色与光效；屏幕设计令牌（`--dvk-screen-*`）**不属于主题**。

---

## 2. 目录树（16 个文件）

```
skills/datav-kit/
├── SKILL.md                        # 路由 + 六步工作流 + 五条硬闸门 + 红线速查
├── README.md                       # 中文，给人读
├── references/
│   ├── design-rules.md             # 6 组规范条目（档位 + 阈值 + 出处）
│   ├── patterns.md                 # 19 个组合模式（路由主表）
│   ├── components.md               # 可用性清单 + 特性检测方法
│   ├── tokens.md                   # 令牌文档
│   └── charts.md                   # 选型矩阵 + 反模式 + 照抄 vs 调整
└── assets/
    ├── tokens.css                  # 令牌参考实现
    ├── minimal-example.html        # 最小可运行示例
    ├── charts/
    │   ├── line-area.js   bar-rank.js   pie-doughnut.js   scatter.js
    │   └── gauge.js   radar.js   heatmap.js
    ├── prototypes/
    │   ├── t1-three-column.html    t2-two-column.html
    │   └── t3-single-column.html   t4-kpi-led.html
    ├── themes/theme-template.css
    └── tools/contrast-check.js
```

**渐进披露**：常驻 = `SKILL.md` + `references/design-rules.md` + `references/patterns.md` + `references/tokens.md` + `references/components.md` + `assets/tokens.css`；其余按需。

---

## 3. 逐文件规格

### 3.1 `SKILL.md`（≤ 250 行）

章节顺序：

1. **何时用 / 不适用**——适用：数据大屏、仪表盘、`dvk-*` 组件选型与组合、设计评审。不适用：普通后台页面、非 datav-kit 项目。
2. **覆盖范围与前置检查**——可用性清单摘要 + `customElements.get(tag)` 运行时检测（见 §3.5）。
3. **六步工作流**——见 §4.1。
4. **五条硬闸门**——见 §4.2。
5. **brief 七问**——见 §4.3。
6. **红线速查**——四类（可读性 / 几何 / 语义 / 无障碍），见 §3.3。
7. **参考索引**——指向 `references/*`。

`description`（决定触发率）：

> Design and build large-screen data dashboards with datav-kit Web Components (`dvk-*`). Use when the user wants a 数据大屏 / dashboard screen, needs to choose or compose datav-kit elements, or wants dashboard output reviewed against a design spec.

### 3.2 `README.md`（中文，给人读）

内容：覆盖范围声明（已发布 30 / 仅 main 5 / `title-4` 不存在）、安装命令（`npx skills add hackycy/datav-kit`）、设计取舍摘要、`assets/minimal-example.html` 入口、给团队的阅读指引。

### 3.3 `references/design-rules.md`（常驻）

**6 组**，可访问性作为跨组约束（组内以 🅰 标注）。每条带**档位**（`[红线]` 不可偏离 / `[建议值]` 可偏离须登记）**+ 阈值 + 出处**。

| 组 | 条目要点 |
| --- | --- |
| **1 画布与栅格** | 红线：等比缩放、内容安全区、**不得内容溢出或裁切**。建议值：安全边距 48（拼接屏加密到 5%）、12 列 / 沟槽 24、行高流式 `minmax(0,1fr)`、缩放场景用 `vector-effect: non-scaling-stroke` |
| **2 间距与节奏** | 8pt 刻度 4/8/12/16/24/32/48/64/96；单屏模块数 5–9 |
| **3 字体与层级** | 红线：最小字号 = 视距/200（彩色字符 ≥21 弧分）、关键数据不依赖 hover。建议值：同屏字体 ≤2 种、字阶 3–5 种、字重 400/500/600、行长 ≤40 CJK、行高 ≥1.5 |
| **4 颜色角色** | 红线：对比度下限（正文 ≥4.5:1、大字 ≥3:1、非文字 ≥3:1，**不可四舍五入**）、同一色相不得承担互不语义。建议值：颜色角色账本 10 项、分类色 ≤5 / 强调色 ≤2、对比度上限 7:1–15:1、禁彩虹色阶、白色面积 ≤40%、相邻标记对比 |
| **5 装饰与动效预算** | 红线：每个光效/动效/装饰必须有具名的数据或交互映射、动效可控（>5s 可暂停、闪烁 ≤3/s、`prefers-reduced-motion`）。建议值：交互动效 150–300ms / 装饰沿用 `--dvk-motion-duration` / 图表 200–400ms、每区块 ≤1 装饰容器 + 1 装饰轨、反 AI 氛围清单 |
| **6 数据呈现与异常态** | 建议值：直接标注优先、折线 ≤4 / 饼图 ≤5 / 仪表指针 ≤3、图例高 ≤30% 图表高、柱状 y 轴从 0、禁 3D 饼柱 / 双轴 / 彩虹 / 过度平滑、**异常态四态**（无数据 / loading / 失败 / 陈旧）、实时数据优先"陈旧但可见" |

**可访问性跨组红线**：4 组对比度 · 3 组最小字号 · 3 组不依赖 hover · 5 组动效可控 · 键盘可达 + 焦点外观 ≥2 CSS px 周长且 ≥3:1 · 文字可放大 200%。

**另含**：**一屏一套主题**（不允许混用多套主题类；强调某区域用强调色）。

**量化阈值只收"能机械校验"的**；纯风格描述降级为文字建议。

### 3.4 `references/patterns.md`（常驻）

19 个组合模式，每条记六项：**用途 / 组件构成（tag + 关键属性）/ 参数 / 栅格位置 / 可替换项 / 注意事项**。

模式清单（来自 r3 提取）：

- 骨架：P1 全屏适配壳 · P2 三段式顶栏 · P3 标题栏 · P4 KPI 指标条 · P5 三栏主栅格
- 面板：P6 面板容器 · P7 面板头 · P8 面板头右侧
- 指标：P9 水平进度行 · P10 排行/压力行 · P11 处置队列卡 · P12 分时节奏柱 · P13 环形仪表 · P14 hero 大数字 · P15 双列指标卡组 · P16 `dvk-count-to` 用法
- 地图：P17 态势主视图 · P18 地图标记 · P19 地图叠加卡

**必须写明**：16 个 border-box 一律没有 `#header`/`#title` slot，面板标题写进默认 slot。

**P6 border-box 选型合同（由“面板容器 border-box 变体的场景选型规则”锁定）**：先判断是否需要独立 `surface`，再按场景角色选择，随后按动效语义筛选，最后才按视觉接近度选择。`surface` 仅指组件支持 `background-color`；`HUD`/状态框保持透明，由宿主或屏幕提供底色。P6 必须维护下列角色入口与固定回退链：

| 场景角色 | 首选 | 固定回退链 |
| --- | --- | --- |
| 主视图焦点 | `4` | `4 → 2 → 6 → 3 → 5 → 1` |
| 密集数据主视图 | `3` | `3 → 6 → 5 → 2 → 1` |
| 透明自由尺寸 HUD | `5` | `5 → 3 → 6 → 2 → 1` |
| 精密技术主视图 | `6` | `6 → 3 → 5 → 2 → 1` |
| cyber/HUD 主视图 | `2` | `2 → 4 → 3 → 5 → 1` |
| 普通矩形/内容自适应 | `1` | `1 → 15` |
| 斜切 Surface 面板 | `7` | `7 → 10 → 9 → 15` |
| 动态多边形 Surface 面板 | `8` | `8 → 10 → 7 → 15` |
| 静态克制 Surface 面板 | `9` | `9 → 15 → 7 → 10` |
| 圆角辉光 Surface 面板 | `10` | `10 → 9 → 15 → 7` |
| 重复轻量卡 | `15` | `15 → 9 → 10 → 7` |
| 运营状态轨 | `11` | `11 → 13 → 12 → 14 → 1` |
| 顶部装饰轨结构框 | `12` | `12 → 13 → 14 → 11 → 1` |
| 底部承载脊结构框 | `13` | `13 → 12 → 14 → 11 → 1` |
| 信号端口技术区 | `14` | `14 → 13 → 12 → 11 → 1` |
| 紧凑 KPI/拓扑/设备健康 | `16` | `16 → 15 → 9` |

回退只在同一能力族内进行；`16 → 15 → 9` 是紧凑角色的明确降级例外，省略回退组件的 `background-color` 以保持透明，并登记视觉契约降级。运行时必须在元素包完成注册后用 `customElements.get(tag)` 检查可用性，不可用组件的 props 不得传递；若整条链均不可用则停止并报告缺包。`border-box-16` 标为 main-only 可选增强，`title-4` 永不引用。

动效不是默认选型理由：只有具名数据/交互映射才启用；`prefers-reduced-motion` 下优先 `paused`，`border-box-1` 使用 `animated=false`。所有变体保留 `contentRect` 自动内距，只有实际遮挡、溢出或可读性问题才允许覆盖 `--dvk-border-box-N-padding` 并登记；不得用内距数值反推变体。`references/patterns.md` 的 P6 是唯一运行时选型矩阵；本节表格是供实现交接的锁定快照，不构成第二套独立规则。`references/components.md` 只记录能力/发布状态/运行时检测，`references/design-rules.md` 只记录通用红线。

### 3.5 `references/components.md`（常驻）

- **可用性清单**（以 `customElements.get(tag)` 运行时检测为准，清单只作提示）：

| 状态 | 数量 | 组件 |
| --- | --- | --- |
| 已发布（0.0.5） | 30 | border-box 1–15、decoration 1–11、count-to、fit-screen、loading-energy、loading-orbit |
| 仅 main 分支 | 5 | title 1–3、border-box-16、performance-monitor |
| 不存在 | — | **title-4**（空目录，禁止引用） |

- **取数判据**：判断"要不要用"→ 用线上 `llms.txt` 索引；写 props / events / CSS 变量 / `::part()` → **必须 fetch 详情页**；同 session 不重复 fetch。
- **回退源**：线上 404 或索引缺该组件 → `https://raw.githubusercontent.com/hackycy/datav-kit/main/docs/<path>`，**必须标注“来自 main，可能尚未发布”**。
- **border-box 能力字段**：组件能力表至少标注 `background-color`、`animated/paused`、`auto-height`、默认 `glow-intensity` 与内容安全区来源；角色矩阵只在 `references/patterns.md` 的 P6 维护。

### 3.6 `references/tokens.md`（常驻）

五组 `--dvk-screen-*` 令牌的完整取值表（见 §5）。**颜色只读**：不新增任何颜色令牌，一律引用 `--dvk-color-*`。作用域 `.dvk-screen`，不用 `:root`。优先级：项目覆盖 > skill 默认值 > 组件 fallback。

**字号必须按项目校准**：`最小字号 = (视距/200) × (1080/屏高)`；默认值按"大屏 4m×2.25m、视距 6m"标定；算出的值大于默认值时按算出的上浮；**目标屏是显示器/笔记本时整组字号上调**。

### 3.7 `references/charts.md`（按需）

- **库无关的选型矩阵**：时序 / 占比 / 排名 / 分布 / 密度 / 地理 / 关系 / 单值 / 多维 / 层级，各自首选与反模式。
- **令牌桥接契约**（让规范落到任意图表库）：

| 令牌 | 映射到 |
| --- | --- |
| `--dvk-color-primary` | 色板第 1 位 / 主焦点色 |
| `--dvk-color-secondary` | 色板第 2 位 / 对比色 |
| `--dvk-color-accent` | 强调色（选中 / 告警强调） |
| `--dvk-color-surface` | tooltip / 浮层底色 |
| `--dvk-glow-soft` | 阴影（模糊半径 + 颜色） |
| `--dvk-line-width` | 轴线 / 分割线宽 |
| `--dvk-motion-duration` | **不映射**（装饰动画周期，非图表过渡） |
| `--dvk-screen-font-size-*` | 图表内字号 |

- **照抄 vs 必须改**：六件套照抄（令牌注入 / option 骨架 / resize / 主题切换 / 四态 / 性能护栏）；series 数据、轴类目、颜色分配、**图表类型本身**必须按数据改。
- **内边距**：图表容器填满 `::part(content)`，不加 DOM 内边距；要改就覆盖 `--dvk-border-box-N-padding`。`grid` 必须显式覆盖（默认 `10%`/`60` 太浪费）。
- **最小尺寸护栏**：内容区 < 160×100 → 降级为 `dvk-count-to` 或迷你 sparkline。
- **字号 / 描边**：轴标签与图例 = `-size-xs`(14)；数据标注与 tooltip = `-sm`(18)；描边 0.5–1 / 1.5–2.25 / 2.5–3px 三档。**面板标题不进图表**，走 DOM 的 `.panel-heading`。

### 3.8 `assets/tokens.css`（常驻）

五组令牌的参考实现，见 §5 的取值。

### 3.9 `assets/charts/*.js`（按需）

七个模板，每个导出 `createXxx(el, data, tokens)`，内置六件套（见 §3.7）。文件：`line-area` / `bar-rank` / `pie-doughnut` / `scatter` / `gauge` / `radar` / `heatmap`。

**不给 `map` 模板**——ECharts v5 起移除内置 geoJSON，地图需自备数据 + `registerMap` + 自行核对授权，改为在 `charts.md` 写接入步骤。

### 3.10 `assets/prototypes/*.html`（按需）

四套骨架，每套一个纯 HTML 单文件（原生 JS，不用 Vue），双击可开。**每套声明四段**：骨架（行定义 + 12 列跨度 + 流式行高）/ 区块清单（引用 P 编号）/ 组件构成（tag + 关键属性）/ 占位数据形状（内联 JSON）。

| # | 版式 | 骨架行 | 主区 12 列 | 主区区块 | 适用 |
| --- | --- | --- | --- | --- | --- |
| T1 | 三栏运维 | 顶栏 104 / KPI 104 / 主区 1fr | 3 / 6 / 3 | 左 P6+P7+P9 或 P10 ×2；中 P6+P17 + P12；右 P11 / P15 / P13 ×2–3 | 监控、指挥、值班 |
| T2 | 两栏分析 | 顶栏 104 / KPI 104 / 主区 1fr | 8 / 4 | 主区 P6 + 图表槽 ×2；侧栏 P10 + P15 | 趋势、对比、归因 |
| T3 | 单栏叙事 | 顶栏 104 / 主区 1fr / 底部节奏条 104 | 满宽 | P6+P17 + 3 个并排小面板（P9/P14/P16） | 态势总览、汇报 |
| T4 | KPI 主导 | 顶栏 104 / KPI 208 / 主区 1fr | 6 / 6 | 上 P4 放大 KPI 卡 ×6（P14/P16）；下 P6+P7 面板 ×2（P9/P10） | 指标看板、经营驾驶舱 |

**技术形态**：`import map` 映射 `@datav-kit/elements@0.0.5` 到 CDN（**jsDelivr `+esm` 为主、esm.sh 为备**）；引 `assets/tokens.css`；根容器挂 `.dvk-theme-<name>` 切主题；**顶栏按 §4.4 做特性检测二选一**；**图表槽位填最小 ECharts 实例**，不放空槽。

**权限三档**：

| 档位 | 内容 |
| --- | --- |
| 骨架红线（改则回原型） | 行数、列数、主视图位置、顶栏形态、区块增删 |
| 建议值（可改需登记） | 区块比例、间距、密度、装饰强度、主题 |
| 自由区 | 区块内的 pattern 替换、业务文案、图表类型与 option、占位数据 |

### 3.11 `assets/minimal-example.html`（按需）

一个屏 + 2–3 个面板 + 1 个图表，双击可开。用于 5 分钟看到效果；**不替代**四套原型模板。

### 3.12 `assets/themes/theme-template.css`（按需）

八个 `--dvk-*` 变量的骨架 + 注释。推导规则（起点，不是终点）：

| 变量 | 推导 |
| --- | --- |
| `--dvk-color-primary` | 品牌色；对比度不达标则提亮或降饱和至满足 AA |
| `--dvk-color-secondary` | primary 色相 ±30–40°，或明度 −20% |
| `--dvk-color-accent` | primary 互补色（色相 +180°）或高饱和对比色；**暗色必须降饱和** |
| `--dvk-color-surface` | primary 极暗版本（明度 5–10%）+ alpha 0.72；**不用纯黑** |
| `--dvk-glow-soft` / `-strong` | primary + alpha 0.55 / 0.85，模糊半径 12 / 24px |
| `--dvk-line-width` | 1px |
| `--dvk-motion-duration` | 2200–2600ms |

**与库主题并存，不做部分继承**：项目主题是一份完整的八变量声明（作用域 `.dvk-theme-<project>`）。主题不写任何图表或模板特有代码。项目产物落 `design/theme.css`。

### 3.13 `assets/tools/contrast-check.js`（按需）

纯函数、零依赖，输出比值 + PASS/FAIL。校验四组：**文字 / 表面、图形 / 表面、装饰线 / 表面、相邻数据标记之间**。阈值见 §3.3 的颜色角色组（下限与上限都查，**不可四舍五入**）。

---

## 4. 流程与闸门

### 4.1 六步工作流

产物落在项目的 `design/` 目录。

| 步 | 产物 | 退出条件 |
| --- | --- | --- |
| ① 澄清 | `design/brief.md` | 七问全部有答案 |
| ② 原型 | `design/prototype-*.html`（2–3 个） | 每个能双击打开、控制台无报错 |
| ③ 选定 | `design/decision.md` | 用户明确选定一个 + 偏离登记（如有） |
| ④ 实现 | 项目代码 | 大屏在目标分辨率下可运行 |
| ⑤ 自检 | `design/self-check.md` | **全部红线项通过** |
| ⑥ 评审 | `design/review.md` | 评审记录 + skill 修订项已列出 |

②的原型从 T1–T4 里**选 2–3 套改写**。⑤的自检清单从 §3.3 的条目 **1:1 派生**（红线二值 / 建议值三档），**必须能查出硬编码值**。⑥的评审发现逐条转成 skill 修订项，**否则评审不算完成**。

### 4.2 五条硬闸门

1. **未选定原型前，不得进入实现。**
2. **不得跳过 brief 澄清直接出原型。**
3. **红线未全过，不得进入评审**；过不了先修复或回原型。
4. **碰红线或改骨架 → 回原型重选。**
5. **未登记的建议值偏离视为缺陷。**

### 4.3 brief 七问

1. 业务域 / 场景（决定模板选型）
2. 核心指标（3–9 个）
3. 数据源与刷新频率（决定四态）
4. **目标屏：尺寸、分辨率、视距**（**决定字号校准**）
5. 主题（库主题之一 / 自定义）
6. 交互要求（有/无、点击/下钻）
7. 交付形态（静态 HTML / Vue / React / 其他）

### 4.4 顶栏：组件无关的视觉契约

规范只定义契约（高度 104 / 视觉层级标题 > KPI > 面板 / 居中标题块为焦点 / 装饰 ≤1 容器 + 1 轨 / 与 KPI 条间距 24），**实现路径用 `customElements.get('dvk-title-1')` 特性检测二选一**：

- 可用 → `dvk-title-*`（Title 1 企业/工业、Title 2 指挥中心、Title 3 城市运行）。
- 不可用（**当前 0.0.5**）→ P3 手搭，装饰轨建议 `dvk-decoration-6/9`。

**`title-4` 不存在，禁止引用。**

---

## 5. 关键数值速查

**设计画布**：1920×1080 · `contain` + 居中 · 留白用氛围层填充。

**栅格**：12 列 / 沟槽 24 / 外边距 48（8pt）；拼接屏或过扫描风险场景按 EBU R95 加密到 5%（96 / 54）。

**间距**：屏幕外边距 48 · 区块间距 24 · 面板间距 16 · 面板内距 24 · 顶栏 104 · KPI 条 104 · 主区行高 `minmax(0,1fr)`。

**令牌**（`--dvk-screen-*`，作用域 `.dvk-screen`）：

| 组 | 值 |
| --- | --- |
| 间距 | 4 / 8 / 12 / 16 / 24 / 32 / 48 / 64 / 96 |
| 字号 | 14 / 18 / 24 / 32 / 44 + hero 56 |
| 字重 / 行高 | 400 / 500 / 600；1.25 / 1.5 |
| 层级 | 0 / 10 / 100 / 1000 |
| 动效 | 150 / 250 / 300ms + 三条曲线 |
| 布局 | 48 / 12 / 24 / 104 / 104 / 24 |

**动效三档**：交互动效 150–300ms · 装饰动效沿用 `--dvk-motion-duration`（2200–2600ms）· 图表动效 200–400ms。

**对比度**：正文 ≥4.5:1 · 大字 ≥3:1 · 非文字 ≥3:1 · 上限 7:1–15:1（建议值）· **不可四舍五入**。

**三个自定义阈值**（无标准可引，已标注）：分类色 ≤5 / 装饰预算以**层级**定义（每区块 ≤1 容器 + 1 轨）/ 对比度上限。

---

## 6. 实现顺序与验收

**建议顺序**：`assets/tokens.css` → `references/tokens.md` → `references/design-rules.md` → `references/patterns.md` → `references/components.md` → `SKILL.md` → `assets/prototypes/*` → `assets/charts/*` → `assets/themes/` + `assets/tools/` → `assets/minimal-example.html` → `README.md`。

**验收**（按 04 的评分表规则）：

- 用 `assets/minimal-example.html` 与四套原型做冒烟测试（双击可开、无报错）。
- 新写 2 个真实大屏案例走完整六步流程，由项目负责人按"红线二值 + 建议值三档"评分；**任一条红线不过即不合格**。
- 评审发现逐条回写成 skill 修订项。

---

## 7. 交接清单

- [ ] 16 个文件按 §3 写完。
- [ ] `npx skills add hackycy/datav-kit --list` 能列出 `datav-kit`。
- [ ] 四套原型 + 最小示例双击可开。
- [ ] 七个图表模板跑得起来。
- [ ] `contrast-check.js` 对四组对象输出正确。
- [ ] 中文 README 的覆盖范围声明准确。
- [ ] P6 选型矩阵、固定回退链与 `customElements.get(tag)` 降级行为已写入 references 并与本 spec 一致。
- [ ] 发版后 checklist 六项写进 README（新增组件 / 改名改属性 / 令牌键名 / 原型可跑 / 图表可跑 / 空目录变真组件）。
