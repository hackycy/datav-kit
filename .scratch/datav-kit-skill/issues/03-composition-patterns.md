# 组合模式提取（组件文档 + 两套 Demo）

Status: resolved
Type: research
Blocked by: —

## Question

为知识库的"组合模式层"取事实基线。从两个来源提取**可复用的版式 / 组合模式**：

1. `docs/.vitepress/theme/components/AviationCommandScreen.vue`（1051 行）与 `ScenicSpotCommandScreen.vue`（868 行）——它们如何用 datav-kit 组件拼出大屏？提取：大屏骨架（标题栏 / KPI 条 / 分栏 / 主视图）、面板头、指标行、进度条、时间轴、地图区、列表区等模式，以及每个模式用了哪些组件、什么参数。
2. `docs/components/**/*.md`（35 个组件页）——每个组件"适合放在哪"。

要求：

- 只提取**可复用的结构**，不要抄业务内容。
- 每个模式给出：用途、组件构成（tag + 关键属性）、在栅格中的位置假设、注意事项。
- **明确指出两套 Demo 中互相不一致、或可判定为偶然做法**的地方——设计规范要重新写，这些不能当规范。

**产出**：`.scratch/datav-kit-skill/assets/r3-composition-patterns.md`（中文）。

## Answer

已从两套 Demo + 35 个组件页 + `architecture.md` / `architecture-contracts.md` 提取模式目录，全文见 `.scratch/datav-kit-skill/assets/r3-composition-patterns.md`（每个模式含 用途 / 组件构成 / 参数 / 栅格位置假设 / 注意事项，tag 与 props 保留英文）。

**提取到的模式（19 个）**

- 骨架：P1 全屏适配壳（`dvk-fit-screen`）、P2 三段式顶栏、P3 标题栏=成对镜像装饰轨+居中标题块、P4 KPI 指标条、P5 三栏主栅格
- 面板：P6 面板容器（`dvk-border-box-*` 选型 + 内容内距）、P7 面板头（eyebrow + 主标题 + 右侧区）、P8 面板头右侧（状态 chip / 标签组）
- 指标：P9 水平进度行、P10 排行/压力行、P11 处置队列卡、P12 分时节奏柱、P13 环形仪表、P14 hero 大数字、P15 双列指标卡组、P16 `dvk-count-to` 通用用法
- 地图：P17 态势主视图、P18 地图标记、P19 地图叠加卡
- 另有 §6 装饰使用表、§7 35 个组件逐条放置速查、§9 去业务后的最小结构骨架

**关键事实**：两套 Demo 只覆盖 35 个组件中的 8 个（`dvk-fit-screen` / `dvk-count-to` / `dvk-border-box-10/11/13/15` / `dvk-decoration-6/8/9`）；其余 27 个组件的"放哪"只能从组件页取。16 个 border-box **一律没有 `#header`/`#title` slot**（`frame`/`graphic`/`content` 是 Parts），面板标题必须自己写进默认 slot。

**主要不一致 / 偶然做法（规范不得直接采用）**

1. 两套 Demo **都没用 `dvk-title-1/2/3`**，标题栏是"成对 `dvk-decoration-*` + 手写 `h1`"自建的，与 `architecture.md` 的 Title 家族定位冲突 —— 规范必须先裁决。
2. 设计画布不一致：1920×1280 vs 1920×1080（默认与已定基准均为 1080）。
3. "面板"映射到 4 个不同 border-box 变体且两套不重叠（Aviation `-13`/`-11`，Scenic `-10`/`-15`），选型目前是"每套一个家族"的偶然。
4. 面板底色机制不一致（`-13` 无 `background-color`，`-10/-15` 有）。
5. 面板头不同构：`<h3>`+右侧 chip vs `<strong>`+无 chip。
6. Scenic 用固定 px 行高，在 1080 画布上总高溢出 26px 被 `overflow:hidden` 裁掉（流式 `minmax(0,1fr)` 才正确）。
7. 进度条两套实现混用（`--bar-value` vs 内联 `width`）；地图标记两套手写（88px vs 94px）。
8. 配色全部硬编码、互不相同、且都不用 `dvk-theme-*` 主题类 —— 任何"从 Demo 提取的配色"都不是规范。
9. 两套 Demo 都覆盖了 `--dvk-border-box-N-padding`，因此从未验证过 `contentRect` 默认安全区。
10. 数值型 attribute 全写成字符串（`duration="1600"`），时长取值无规律。
