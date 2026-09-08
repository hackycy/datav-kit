# r1 · 大屏设计规范事实基线

> **Ticket**：`.scratch/datav-kit-skill/issues/01-design-conventions-baseline.md`
> **性质**：事实收集与出处核对。**不含取舍决策**（取舍在 ticket 04）。
> **调研日期**：2026-09-08
> **上游约定**（来自 map.md，本文件不推翻）：固定 1920×1080 画布 + `dvk-fit-screen` 缩放；颜色一律走 `--dvk-*`，禁止第二套颜色源。

## 0. 阅读约定

每条结论后标注可信度级别，并附出处链接：

| 标记 | 含义 |
| --- | --- |
| **[规范]** | Normative，有约束力（W3C / SMPTE / ISO / ANSI-HFES） |
| **[官方指南]** | 官方设计系统或官方文档的非规范性建议 |
| **[学术]** | 已发表的论文或专著 |
| **[实践观点]** | 团队博客 / 经验文章，**仅供参照，不是标准** |
| **[本仓库事实]** | 来自 datav-kit 源码或文档的实测 |
| **[本文件计算]** | 由已引用的常量推导，标注推导过程 |

无法回溯到一手出处的说法，一律进 §6，不混进正文。

---

## 1. 通用设计规范覆盖哪些维度（Q1）

把 Material Design、IBM Carbon、Ant Design、WCAG 2.2 与 OpenAI 的 `build-web-data-visualization` 插件并排看，一份"完整"的数据可视化设计规范通常覆盖 10 个维度。**注意第 7 项（装饰预算）在主流设计系统里是空白**，见 §1.7。

### 1.1 画布与栅格

- Material Design 用 4dp/8dp 基线网格 + 12 列响应式栅格，并按窗口宽度划分断点 [官方指南] — https://m2.material.io/design/layout/spacing-methods.html
- IBM Carbon 的 **2x Grid**："The basic unit of 2x Grid geometry is the **8-pixel square mini unit**. Multiples of mini units compose the dimensions of columns, rows, boxes, along with their margins and padding." 栅格通过"除以 2 / 乘以 2"形成节奏；同一断点内列数恒定 [官方指南] — https://carbondesignsystem.com/elements/2x-grid/overview/
- Carbon 的固定值：**padding 16px（所有标准断点）**，网格盒 margin 等于 padding，**总 gutter 32px** [官方指南] — 同上
- Ant Design：蚂蚁中台**统一画板尺寸 1440**；**24 栅格体系**；"网格的基数为 **8**"；Gutter 固定、Column 宽度随屏幕缩放；主流分辨率 **1920 / 1440 / 1366**，个别 1280 [官方指南] — https://raw.githubusercontent.com/ant-design/ant-design/master/docs/spec/layout.zh-CN.md
- Ant Design 提出两种适配方案：① 左右布局——左侧导航固定，右侧工作区动态缩放；② 上下布局——先定义两侧留白的最小值，留白到达限定值后再缩放中间主内容区 [官方指南] — 同上
- OpenAI 插件把"布局与层级"列为一等基础文档，强调**先定阅读路径（reading path）再定渲染器**：insight title → 立即证据 → 按需细节 → 标注/图例/控件 → 注意事项 [官方指南] — https://github.com/openai/plugins/blob/main/plugins/build-web-data-visualization/skills/data-visualization/SKILL.md

### 1.2 间距刻度

- IBM Carbon 的 spacing token 是离散刻度，共 13 级 [官方指南] — https://carbondesignsystem.com/elements/spacing/overview/
- Ant Design 的 size / padding / margin token 系列 [官方指南] — https://ant.design/docs/react/customize-theme
- **"8pt 网格"是惯例而非标准。** 一手文档里：Carbon 说 8-pixel mini unit，Ant Design 说"网格的基数为 8"，Material 说 8dp 基线网格。**没有任何 ISO/W3C 文件规定"间距必须是 8 的倍数"**——这条在本仓库只能作为约定，不能声称是标准。

### 1.3 字阶与层级

- Material Design 3 用 5 个角色 × 3 个尺寸（display / headline / title / body / label × large / medium / small）共 15 个样式 [官方指南] — https://m3.material.io/styles/typography/type-scale-tokens
- IBM Carbon 区分 **productive**（密集、操作型，基准 14px）与 **expressive**（编辑型，基准 16px）两套 type set；命名后缀 `-01` / `-02` [官方指南] — https://carbondesignsystem.com/elements/typography/type-sets/
- Ant Design：主字体 **14**，对应行高 **22**；基于"电脑显示器阅读距离 **50 cm** 以及最佳阅读角度 **0.3**"把主字体从 12 升到 14；**一个系统内字阶控制在 3–5 种**（展示型页面除外）；字重多数情况只用 regular(400) 与 medium(500) [官方指南] — https://raw.githubusercontent.com/ant-design/ant-design/master/docs/spec/font.zh-CN.md
- Ant Design 的字阶由官方算法生成：`size = floor(round(14 × e^((i-1)/5)) / 2) × 2`，`lineHeight = (fontSize + 8) / fontSize`，得到 **12, 14, 16, 20, 24, 30, 38, 46, 56, 68** [官方指南 + 本文件复核] — https://raw.githubusercontent.com/ant-design/ant-design/master/components/theme/themes/shared/genFontSizes.ts
- OpenAI 插件给出图表内部**可直接引用的数值**：轴刻度 10–12px、直接标注 11–13.5px、注释正文 12.5px、来源注释 10px；非数据描边 0.5–1px、普通数据线 1.5–2.25px、强调线 2.5–3px；并明确"**宁可减少刻度/缩短标签/换版式，也不要把有意义的文字缩到 10px 以下**" [官方指南] — https://github.com/openai/plugins/blob/main/plugins/build-web-data-visualization/references/foundations/editorial-infographic-system.md

### 1.4 颜色角色

- Material Design 3 用**颜色角色**（role）而非色值组织色彩：primary / on-primary / primary-container / surface / surface-variant / outline / error 等 [官方指南] — https://m3.material.io/styles/color/roles
- IBM Carbon 的 color token 同样按角色分层，内置 White / Gray 10 / Gray 90 / Gray 100 四套主题 [官方指南] — https://carbondesignsystem.com/elements/color/overview/
- Ant Design：基础色板共 **120 个颜色**（12 主色 + 衍生色），中性色 **13 个**；品牌色建议取"从浅至深的**第六个**颜色"；中性色按透明度实现，并参考 WCAG 2.0；态度是"克制的" [官方指南] — https://raw.githubusercontent.com/ant-design/ant-design/master/docs/spec/colors.zh-CN.md
- OpenAI 插件把它提升成**质量门**："使用**颜色角色账本**（color-role ledger）：中性背景、主焦点强调色、可选对比强调色，以及**单独处理**的选中/聚焦/告警状态"，并要求检查对比度、灰度、色觉缺陷下的可读性 [官方指南] — https://github.com/openai/plugins/blob/main/plugins/build-web-data-visualization/skills/data-visualization/SKILL.md
- 账本的展开条目（十项）：neutral context / primary focus / secondary comparison / ordered magnitude / positive-negative change / warning-error / selection / hover-focus / missing-uncertain / disabled-stale；并明确"**不要让同一个色相承担互不相关的语义**"（如果蓝色表示选中，它就不该同时表示预测、A 组、安全、当前周期、超标）[官方指南] — https://github.com/openai/plugins/blob/main/plugins/build-web-data-visualization/references/foundations/perception-color-and-encoding.md

### 1.5 信息密度

- Material Design 有 density 概念（组件密度刻度，以 4dp 为步进调整行高与内边距）[官方指南] — https://m3.material.io/foundations/layout/applying-layout/density
- OpenAI 插件对操作型界面的表述是"**密集但安静**（dense but calm）：紧凑排版、克制的边框、稳定的尺寸、对选中/关键证据给强对比" [官方指南] — https://github.com/openai/plugins/blob/main/plugins/build-web-data-visualization/references/foundations/operational-visualization-workspaces.md
- 同一文档给出结构性约束："**避免嵌套卡片与重复的浮层容器**；改用导轨、色带、分隔线、表格、大纲、视口 chrome" [官方指南] — 同上
- Ant Design 可视化页规范给出**模块数量上限**："尽量在一屏中突出核心指示，**将总模块数量控制在 5-9 个**，避免信息过载"、"一张卡片放置一个主题内容" [官方指南] — https://ant.design/docs/spec/visualization-page-cn

### 1.6 动效预算

- Material Design 3 把动效拆成 **duration token + easing token**，并给出"时长随距离/尺寸缩放"的原则（M3 页面为 JS 渲染，本项由官方 `material-web` token 文件核实）[官方指南] — https://raw.githubusercontent.com/material-components/material-web/main/tokens/versions/v0_192/_md-sys-motion.scss
- IBM Carbon 区分 productive（快速、克制）与 expressive（较慢、表现性）两套动效，并给出 6 个静态时长 token [官方指南] — https://carbondesignsystem.com/elements/motion/overview/
- Ant Design 动效三原则：**自然 / 高效 / 克制**；"做有意义的动效，不去做太多的修饰而干扰用户"；衡量标准是"是否带有明确的目的性"与"不能出现大幅度波动丢帧或者卡顿" [官方指南] — https://raw.githubusercontent.com/ant-design/ant-design/master/docs/spec/motion.zh-CN.md
- WCAG 侧三条硬约束（见 §2）：2.2.2、2.3.1、2.3.3 [规范]
- OpenAI 插件的判据是**"每个动画都要有一个动词"**：reveal / move / accumulate / compare / transform / zoom / rotate / highlight；第一帧与最后一帧都必须能作为静图成立；必须提供 reduced-motion 的静态回退 [官方指南] — https://github.com/openai/plugins/blob/main/plugins/build-web-data-visualization/references/foundations/art-directed-interactive-visual-stories.md
- 对"光晕/脉冲/粒子"的硬判据：**"每一个 glow、pulse、halo、blur、particle、stroke thickness、ring count、shimmer 或 animation 都必须有一个具名的数据或交互映射。如果这个效果只是'好看'，就删掉它，或把它降级到不会被误读成数据的位置。"** [官方指南] — https://github.com/openai/plugins/blob/main/plugins/build-web-data-visualization/references/foundations/perception-color-and-encoding.md

### 1.7 装饰预算 —— **主流设计系统的空白**

- 我逐一核对了 Material Design、IBM Carbon、Ant Design 的公开文档，**三者都没有"每屏装饰元素数量上限"这类条目**。装饰预算不是设计系统的标准维度。
- 唯一给出可操作判据的一手来源是 OpenAI 插件：
  - "**上下文意象、氛围性标记与动效必须承载证据**（evidence-bearing）。不要用大面积半透明笔刷、飘带、bokeh/光球、电影感壁纸、图库式雾霭或装饰性渐变去替代数据图层。" [官方指南] — https://github.com/openai/plugins/blob/main/plugins/build-web-data-visualization/skills/data-visualization/SKILL.md
  - "**拒绝**那些把数据主张变得更不清楚、把关键数值藏在风格后面、把事实性标签烤进位图、暗示不支持的精度/尺度/因果/地理、看起来像通用仪表盘或壁纸、或依赖通用 AI 氛围（broad translucent brush strokes、wispy ribbons、bokeh/orbs、cinematic wallpaper、stock-photo haze、decorative gradients）的概念稿。" [官方指南] — https://github.com/openai/plugins/blob/main/plugins/build-web-data-visualization/references/foundations/meaning-preserving-visual-design-workflow.md
  - 领域背景板（地图/球场/平面图/原理图）只有在"**承载领域含义、约束布局或解释位置**"时才用；否则就是壁纸 [官方指南] — https://github.com/openai/plugins/blob/main/plugins/build-web-data-visualization/references/foundations/domain-contextual-surfaces.md
- 传统依据：Tufte 的 **data-ink ratio** 与 **chartjunk**，是"装饰预算"最原始的理论出处 [学术] — https://www.edwardtufte.com/book/the-visual-display-of-quantitative-information/
- **结论（事实层面）**：如果要写"装饰预算"这一条，**没有现成标准可引**，只能自定阈值并声明为本规范自定义。

### 1.8 留白

- Material Design 把留白（spacing/padding/margin）作为布局的一等概念 [官方指南] — https://m2.material.io/design/layout/spacing-methods.html
- OpenAI 插件的表述："**留白就是结构**（whitespace is structure）"，用来分隔阅读阶段，而不是随机漂浮 [官方指南] — https://github.com/openai/plugins/blob/main/plugins/build-web-data-visualization/references/foundations/editorial-infographic-system.md

### 1.9 对比度

- WCAG 2.2 的 SC 1.4.3 / 1.4.6 / 1.4.11 是唯一有约束力的对比度数字来源 [规范] — https://www.w3.org/TR/WCAG22/
- OpenAI 插件把图表专用门槛写成："**对有意义的非文字标记与 UI 状态指示器，目标至少 3:1**（相对相邻颜色）；文字走 WCAG AA：普通文字 ≥ 4.5:1，大字 ≥ 3:1"；并补充"当**边界本身承载含义**时，要检查**相邻数据标记之间**的对比度，而不只是标记对背景的对比度" [官方指南] — https://github.com/openai/plugins/blob/main/plugins/build-web-data-visualization/references/foundations/perception-color-and-encoding.md
- 注意：WCAG 对比度是**阈值，不允许四舍五入**——"**4.499:1 不满足 4.5:1**" [规范] — https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html

### 1.10 可访问性

- WCAG 2.2 全量（含 2.2 新增的 2.4.11 焦点不被遮挡、2.4.13 焦点外观、2.5.7 拖拽替代、2.5.8 目标尺寸）[规范] — https://www.w3.org/TR/WCAG22/
- 无障碍数据可视化的关键补充：**SC 1.4.1 Use of Color** ——"不能只用颜色传达信息"；色相差只有在同时具备明度差、且**对比 ≥ 3:1** 时才可算作额外的视觉区分；"如果内容依赖用户准确感知或区分某个特定颜色，则无论对比度多高，都必须提供额外的视觉指示" [规范] — https://www.w3.org/WAI/WCAG22/Understanding/use-of-color.html
- OpenAI 插件把可访问性列为**设计输入而非收尾工作**，要求"每张重要图表都应有一条非视觉路径通向核心结论" [官方指南] — https://github.com/openai/plugins/blob/main/plugins/build-web-data-visualization/skills/accessibility-and-inclusive-visualization/SKILL.md

---

## 2. 可验证的量化阈值（Q2）

下表只收录**能追到规范/官方文档原文**的数字。带 ★ 的为 ticket 点名要求的项。

### 2.1 对比度与可读性

| 条目 | 数值 | 出处 | 性质 |
| --- | --- | --- | --- |
| 正文对比度（AA） | ≥ **4.5:1** | WCAG 2.2 SC 1.4.3 | [规范] |
| 大字对比度（AA） | ≥ **3:1** | WCAG 2.2 SC 1.4.3 | [规范] |
| "大字"定义 | ≥ **18pt**，或 **14pt 粗体**，或对 CJK 字体产生等效尺寸（Understanding 文档给出 pt→px：**1pt = 1.333px**，即 ≈ **24px / 18.5px**） | WCAG 2.2 术语表 `large scale (text)` + Understanding 文档 | [规范] |
| 正文对比度（AAA） | ≥ **7:1**；大字 ≥ **4.5:1** | WCAG 2.2 SC 1.4.6 | [规范] |
| 非文字对比度（UI 组件 / 理解内容所必需的图形） | ≥ **3:1**（相对相邻颜色） | WCAG 2.2 SC 1.4.11 | [规范] |
| 图表标记与 UI 状态指示器 | 目标 ≥ **3:1** | OpenAI perception-color-and-encoding.md | [官方指南] |
| 对比度取值 | **不可四舍五入**（4.499:1 ≠ 4.5:1） | WCAG Understanding 1.4.3 | [规范] |
| 暗色主题：表面色 + 100% 白正文 | ≥ **15.8:1**（以保证最高 elevation 表面上的正文仍达 4.5:1） | Material Design Dark theme | [官方指南] |
| Ant Design 正文/标题与背景 | **7:1 以上**（AAA） | Ant Design 字体规范 | [官方指南] |
| **对比度上限（可引用）** | 字符对比 **6:1–10:1 为最佳**；**超过 15:1 可能引起视觉不适** | FAA/NATS 1999，经 NUREG-0700 汇编 | [规范] |
| MIL-STD 字符对比 | **6:1 以上，10:1 更佳**；直视大屏亮度对比 ≥ **1.5:1**；环境照度 < 0.1 lx 时用**亮字暗底** | MIL-STD-1472H §5.2.2.7 / §5.2.2.12.8 / §5.2.2.6 | [规范] |
| 暗色最大对比度（防 halation） | 初步建议 "Dark Mode Maximum: **Lc −90**（大字号）" | APCA（WCAG 3 候选） | [规范草案] |
| 彩色字符最小视角 | **≥21 弧分，30 弧分推荐**（黑白字符为 16/20） | ISO 9241-3:1992 §6.4 | [规范] |
| 最大观看距离（速算） | **215 × 拉丁字符高度** | ISO 11064-4:2013 | [规范] |
| 屏幕亮度（控制室） | 500 lx 环境照度下 **100–150 cd/m²**；作业区平均亮度为屏幕的 **0.1L–10L** | ISO 9241-303:2008 | [规范] |
| 大屏标称亮度 | **250 cd/m² 足够**；**超过 500 cd/m² 可能过亮** | Christie 控制室白皮书 | [厂商] |

### 2.2 尺寸与间距

| 条目 | 数值 | 出处 | 性质 |
| --- | --- | --- | --- |
| 指针目标最小尺寸（AA） | ≥ **24 × 24** CSS px | WCAG 2.2 SC 2.5.8 | [规范] |
| 指针目标增强尺寸（AAA） | ≥ **44 × 44** CSS px | WCAG 2.2 SC 2.5.5 | [规范] |
| 移动端主控推荐命中区 | **44–48** CSS px（空间允许时） | OpenAI mobile-first-responsive-visualization.md | [官方指南] |
| 文字缩放 | 无辅助技术下可放大至 **200%** 不丢失内容/功能 | WCAG 2.2 SC 1.4.4 | [规范] |
| 文本间距（用户可调机制） | 行高 ≥ **1.5×**字号；段后距 ≥ **2×**；字距 ≥ **0.12×**；词距 ≥ **0.16×** | WCAG 2.2 SC 1.4.12 | [规范] |
| 行长 | ≤ **80 字符**（CJK 为 **40**）；两端不对齐；行距 ≥ 1.5 | WCAG 2.2 SC 1.4.8（AAA） | [规范] |
| 重排（Reflow） | 纵向滚动内容在 **320 CSS px** 宽度等效下无信息/功能损失 | WCAG 2.2 SC 1.4.10 | [规范] |
| 焦点外观（AAA） | 面积 ≥ 未聚焦组件 **2 CSS px 厚周长**，聚焦/未聚焦对比 ≥ **3:1** | WCAG 2.2 SC 2.4.13 | [规范] |
| Carbon 间距刻度 | 2 / 4 / 8 / 12 / 16 / 24 / 32 / 40 / 48 / 64 / 80 / 96 / 160 px | Carbon spacing tokens | [官方指南] |
| Carbon 网格 | mini unit **8px**；padding **16px**；总 gutter **32px** | Carbon 2x Grid | [官方指南] |
| Ant Design 尺寸刻度 | sizeXXS **4** / XS **8** / SM **12** / **16** / MD **20** / LG **24** / XL **32** / XXL **48**；`sizeUnit = sizeStep = 4` | Ant Design design tokens | [官方指南] |
| Ant Design 控件高度 | controlHeight **32** / SM **24** / LG **40** | 同上 | [官方指南] |
| Ant Design 圆角 | borderRadius **6** | 同上 | [官方指南] |
| 移动端窄版测试宽度 | **360–430 px** | OpenAI editorial-infographic-system.md | [官方指南] |

**图表内部留白与字号（供参考，非标准）**

- **AntV 官方图表规范**：主标题 **bold #666 16px**；副标题 **bold #999 14px**；正文 **#666 12px**；辅助文字 **#999 12px**；坐标轴/刻度线 **#ccc 1px**；刻度标签 **#3c3c3c 12px**；Y 轴 **≤5 条**、Y 轴刻度 **≤10 个** [官方指南] — https://antv.vision/old-site/vis/doc/design/rule/base/title.html 、https://antv.vision/old-site/vis/doc/design/rule/base/axis.html
- **DataV 默认画布 = 1920×1080**（Page Setting 可调）[官方指南] — https://www.alibabacloud.com/help/en/datav/datav-6-0/getting-started/build-a-visual-application-on-a-blank-canvas
- **第三方开源规范（anyviz）**：图表边距标准 **48/36/56/56 px**（上/右/下/左），紧凑版 **32/24/40/48 px**；多图间距 **28 px**；绘图区 **65–75%**、标题与标签 **15–20%**、图例 **5–10%**；间距落在 **4/8 px 网格**，常用 24/28/32/40；字阶 H1 16px/600 … H6 9px，行高 1.3；"核心标签 ≥11px，任何关键标签 ≥9px" [实践观点/开源仓库] — https://github.com/TseringYuu/anyviz/blob/main/aesthetics/layout.md 、https://github.com/TseringYuu/anyviz/blob/main/aesthetics/typography.md

### 2.3 字号与字阶

| 条目 | 数值 | 出处 | 性质 |
| --- | --- | --- | --- |
| 图表内文字下限 | 有意义的文字**不低于 10px** | OpenAI editorial-infographic-system.md | [官方指南] |
| 一图内的文字尺寸数量 | **不超过 4 种** | 同上 | [官方指南] |
| Carbon 字阶（productive） | body-01 **14/20**、heading-03 **20/28**、heading-04 **28/36**、heading-05 **32/40**、heading-06 **42/50**、heading-07 **54/64** | Carbon type sets | [官方指南] |
| Carbon 字阶（expressive） | body-02 **16/24**、fluid-heading-03 **20/28**、fluid-display-01 **54/64** | 同上 | [官方指南] |
| Carbon 字距 | 16px 及以上 **0**；14px **0.16px**；12px **0.32px** | 同上 | [官方指南] |
| Ant Design 主字体/行高 | **14 / 22** | Ant Design 字体规范 | [官方指南] |
| Ant Design 字阶 | **12, 14, 16, 20, 24, 30, 38, 46, 56, 68** | antd 源码算法 | [官方指南 + 本文件复核] |
| 一个系统内的字阶数量 | **3–5 种** | Ant Design 字体规范 | [官方指南] |
| Ant Design 字重 | 多数情况只用 **400 / 500**（英文加粗用 600） | 同上 | [官方指南] |

### 2.4 动效

| 条目 | 数值 | 出处 | 性质 |
| --- | --- | --- | --- |
| 自动播放的动效/滚动 | 持续 **> 5 秒**即须提供暂停/停止/隐藏机制 | WCAG 2.2 SC 2.2.2 | [规范] |
| 自动更新信息 | 须能暂停/停止/隐藏**或控制更新频率**（无 5 秒豁免） | WCAG 2.2 SC 2.2.2 | [规范] |
| 闪烁频率 | 任何 1 秒内**不超过 3 次** | WCAG 2.2 SC 2.3.1 | [规范] |
| 交互动效可关闭 | 必须可关闭，除非对功能或信息是必需的 | WCAG 2.2 SC 2.3.3（AAA） | [规范] |
| 时间限制 | **> 20 小时**可豁免；可调节时至少为默认值的 **10 倍** | WCAG 2.2 SC 2.2.1 | [规范] |
| UI 动效时长（通用） | 多数动画 **100–500 ms**；简单反馈 ≈ **100 ms**；模态 ≈ **200–300 ms**；**400 ms** 是很慢的上限；进场 **300 ms** / 出场 **200–250 ms** | NN/g《Executing UX Animations》 | [官方指南] |
| Carbon 时长 token | fast-01 **70ms** / fast-02 **110ms** / moderate-01 **150ms** / moderate-02 **240ms** / slow-01 **400ms** / slow-02 **700ms** | Carbon Motion | [官方指南] |
| Carbon 微交互自检 | 微交互应落在 **90–120 ms** 的静态时长区间 | 同上 | [官方指南] |
| Ant Design 时长 token | motionDurationFast **0.1s** / Mid **0.2s** / Slow **0.3s**；`motionUnit = 0.1` | Ant Design tokens | [官方指南] |
| Material M3 时长 token | short1 **50ms** … short4 **200ms** / medium1 **250ms** … medium4 **400ms** / long1 **450ms** … long4 **600ms** / extra-long1 **700ms** … extra-long4 **1000ms** | Google material-web 官方 token 文件 | [官方指南] |
| Material 传统时长 | 常规 **300ms**；大型全屏 **375ms**；进场 **225ms**；出场 **195ms**；**超过 400ms 会显得太慢**；平板 ≈ +30%，可穿戴 ≈ −30%，桌面 **150–200ms** | Material Design 1 Duration & Easing | [官方指南] |
| 帧预算 | 仅在真正需要时按 **16ms/帧** 预算 | OpenAI dashboards-and-real-time-visualization.md | [官方指南] |
| 响应时间阈值 | **0.1s / 1.0s / 10s** 三档；> 10s 需百分比进度指示 | NN/g《Response Times: The 3 Important Limits》 | [官方指南] |

### 2.5 颜色数量与数据标记数量 ★

| 条目 | 数值 | 出处 | 性质 |
| --- | --- | --- | --- |
| 分类色建议上限 | "**try to avoid using more than seven**"（超过 7 个颜色就考虑换图表类型或合并分类） | Datawrapper Academy | [官方指南] |
| 色盲友好 | "**Blue is the safest hue**"；超过 **3–4** 个颜色时读者会"tune out" | Datawrapper | [官方指南] |
| Carbon 分类色板 | **14 色**，必须按给定顺序使用 | Carbon dataviz color palettes | [官方指南] |
| Carbon 告警色板 | **4 色**（Red 60 / Orange 40 / Yellow 30 / Green 60） | 同上 | [官方指南] |
| Carbon 顺序色板 | 4 套单色系，各 **10 级**（10→100） | 同上 | [官方指南] |
| ColorBrewer 分类色板 | 3–**12** 类（仅 Paired 与 Set3 达到 12；多数止于 8–9） | ColorBrewer 2.0 官方导出 | [官方指南] |
| ECharts 默认色板 | **9 色**（超出后循环） | ECharts 5.5.1 官方构建 | [官方指南] |
| Ant Design 基础色板 | **12 主色** + 衍生 = **120 色**；中性色 **13 色**；每色相 10 级 | Ant Design 色彩规范 | [官方指南] |
| 折线图线条数 | "**Do not draw more than 4 lines in a chart**" | ECharts Handbook | [官方指南] |
| 仪表盘指针数 | "**Do not include more than 3 pointers in one dashboard**" | ECharts Handbook | [官方指南] |
| 饼图分类数 | Datawrapper："**four max**"；ECharts："控制在 **5 个以内**"；网易："**5~7 项**" | 三者 | [官方指南] / [实践观点] |
| 单屏模块数 | "将总模块数量控制在 **5-9 个**" | Ant Design 可视化页规范 | [官方指南] |
| 图例高度 | "A legend should not be taller than **30 percent** of the chart's height" | Carbon Data-viz Legends | [官方指南] |
| **每屏主色数量上限** | **无任何标准给出该数字**；最接近的官方建议是"≤7"（Datawrapper）与"一主一辅强调色"（OpenAI） | —— | 见 §6 |
| **单屏装饰元素上限** | **无任何标准或官方设计系统给出该数字** | —— | 见 §6 |

**关键事实**：ticket 点名的"每屏主色数量上限""单屏装饰元素上限"**在一手标准与官方设计系统中不存在**。能引用的只有：Datawrapper ≤7 色、ColorBrewer 分类色板 ≤12、Carbon 14 色、ECharts 默认 9 色、OpenAI"一主一辅强调色"。**任何具体数字都必须由本规范自定，并标注为自定义阈值。**

### 2.6 大屏专属的量化阈值（本次调研的额外收获）

| 条目 | 数值 | 出处 | 性质 |
| --- | --- | --- | --- |
| 视距 | 宜 **≥ 150 cm**；固定视野直径 ≥ 250 cm | T/CIDADS 00011-2022 | [规范/团体标准] |
| 垂直视域 | **20°–28°** | 同上 | [规范/团体标准] |
| 水平视域 | **36°–48°** | 同上 | [规范/团体标准] |
| 最佳观看距离 | `S1 = 2.005h`（最小）～ `S2 = 2.835h`（最大） | 同上 | [规范/团体标准] |
| 最小字号物理高度 | **视距 / 200**；`最小字号 = (S/200) × (R/H)` | 同上 | [规范/团体标准] |
| 最小字号示例 | 3840×2160、屏高 2.25m、视距 5m → **24 px** | 同上 | [规范/团体标准] |
| 同屏字体种类 | **不宜超过 2 种** | 同上 | [规范/团体标准] |
| 白色面积占比 | **建议 ≤ 40%** | 同上 | [规范/团体标准] |
| 动效时长 | **200–600 ms** | 同上 | [规范/团体标准] |
| 文字对比度 | 符合 WCAG **AA 级** | 同上 | [规范/团体标准] |
| 拼接屏物理拼缝 | **0.5–3.5 mm**；精细元素绕开接缝 | 同上 | [规范/团体标准] |
| 拼接屏设计尺寸 | 建议 16:9，高度 **1080 px**；3×5 = **1080 × 3200 px** | 同上 | [规范/团体标准] |
| 广播 action safe | 四边内缩 **3.5%** | EBU R95 / ITU-R BT.1848 | [规范] |
| 广播 graphics safe | 四边内缩 **5%** | 同上 | [规范] |
| 过扫描上限 | 单边 **≤ 4%**（且 ITU 明言数字电视不需要过扫描） | ITU-R BT.1848 | [规范] |
| 字符张角 | 最小 **16 弧分**；推荐 **20–22 弧分** | ANSI/HFES 100 草案 §4.9.1 | [规范] |
| 控制室照度 | **200–750 lx**；VDT 处 ≤ **500 lx**；UGR ≤ **19**；Ra > **80** | ISO 11064-6（采标文本） | [规范，转述] |

**注意**：T/CIDADS 00011-2022 的条款本次是**经第三方文档站转述**取得的，官方原文未获得（见 §6.2）。引用时建议标注来源等级，或由人工核对原文后再升格为硬规则。

---

## 3. OpenAI `data-visualization` 质量门原文（Q3）

**来源**：`openai/plugins` 仓库，commit `1e285826e604f66f7208f7ac4dba0fe8341d1f57`（main，该文件最近更新 2026-05-28）。
原始文件：https://raw.githubusercontent.com/openai/plugins/main/plugins/build-web-data-visualization/skills/data-visualization/SKILL.md

### 3.1 质量门（Quality Gates）逐条原文

> - The answer must name the analytical job, chart or artifact family, primary route, and fallback when reasonable alternatives exist.
> - Explanatory work needs an insight title, takeaway, artifact mode, annotation plan, source/caveat placement, and mobile reading path.
> - **Prefer direct labels, embedded keys, small multiples, in-cell graphics, and annotation over detached legends, equal-weight dashboards, or hover-only discovery.**
> - **Use a color-role ledger: neutral context, primary focal accent, optional comparison accent, and separate treatment for selected/focused/alert states. Check contrast, grayscale, and color-deficiency resilience.**
> - Treat accessibility, mobile, export, URL state, persistence, and QA as design inputs, not cleanup.
> - Keep essential values visible without hover. On mobile, replace hover with tap/focus, enlarge hit regions, provide drag/pinch alternatives, and avoid control stacks that hide the main evidence.
> - For live or remote data, prefer stale-but-visible views with last-updated, live/stale/offline/partial states, reconnect behavior, and low-bandwidth degradation.
> - Prefer declarative grammars before D3, D3/SVG before Canvas when labels/axes dominate, Canvas before WebGL for simple dense flat marks, and WebGL/3D only when scale, picking, shaders, particles, flow, geospatial layers, or depth justify it.
> - **Motion, particles, generated imagery, domain substrates, and 3D must have a stated analytical purpose plus static/reduced-motion fallback.**
> - Use editorial hero and background substrates only when they improve orientation, scale, place, mechanism, or label-safe context. Quiet basemaps, terrain, thin cartographic linework, real/generated textures, or clear photographic crops are preferable to generic atmosphere.
> - **Include an art-direction QA pass for generic AI atmosphere: broad brush strokes, wispy ribbons, bokeh/orbs, one-hue drama, cinematic wallpaper, and background visuals that look polished but do not carry evidence or orientation.**
> - For sensitive geopolitical, conflict, disaster, displacement, or humanitarian work, use `../../references/foundations/sensitive-geopolitical-and-humanitarian-stories.md`; distinguish measured, estimated, disputed, dated, and schematic layers.
> - For fictional or illustrative stories, use `../../references/foundations/fictional-data-story-simulation.md`; require enough deterministic simulated data to support the visual density.
> - Treat visual references as principle studies. Transform the idea so the output cannot be mistaken for the reference layout, palette, type system, scene, or pacing.

### 3.2 颜色角色账本（color-role ledger）——展开原文

SKILL.md 只给了四项；其基础文档把账本展开成十项，并给出六条硬判据：

> - Define color roles before choosing exact colors: neutral context, primary focus, secondary comparison, ordered magnitude, positive/negative change, warning/error, selection, hover/focus, missing/uncertain, and disabled or stale state.
> - Do not overload the same hue with unrelated meanings. If blue means selected, it should not also mean forecast, team A, safe, current period, and above target in the same view.
> - Use contrast to direct attention. The most important data marks, selected state, insight annotation, and critical threshold should have stronger contrast than gridlines, basemaps, inactive series, and secondary context.
> - For meaningful non-text marks and UI state indicators, target at least 3:1 contrast against adjacent colors. For text, target WCAG AA text contrast: at least 4.5:1 for normal text and 3:1 for large text.
> - Check contrast between adjacent data marks when the boundary itself carries meaning, not just mark-to-background contrast.
> - Prefer perceptually ordered sequential or diverging ramps for magnitude. Avoid rainbow ramps unless the data and audience have a domain-specific convention that justifies them.

出处：https://github.com/openai/plugins/blob/main/plugins/build-web-data-visualization/references/foundations/perception-color-and-encoding.md

### 3.3 "直接标注优先于分离图例"——原文

> - **Direct labels usually beat legend lookup when the number of series is manageable.**
> - **If a key is required, keep it inside the visualization or immediately adjacent to the marks it explains.**
> - For compact views such as in-cell charts and sparklines, use surrounding row or column context plus inline labels instead of detached legends.
> - When a chart needs many categories, look for grouping, direct labeling, small multiples, ordering, or interaction before adding more hues.

反面清单（同文件 Common Mistakes）：

> - Letting labels, legends, and tooltips fight for the same job.
> - **Parking a legend far from the chart and forcing repeated eye travel to decode the view.**
> - Using color variety as a substitute for hierarchy.
> - Letting decorative glow, particles, or size compete with the encoded value.
> - Reusing the same visual channel for both data and selection state.
> - Passing text contrast while leaving meaningful marks, focus rings, selected states, or map boundaries too faint to understand.

出处：同上。布局侧的同义表述：

> - Put labels, keys, filters, and summaries next to the evidence they explain so the eye does not bounce around the page.
> - Prefer direct labels, concise framing text, and chart-adjacent cues over detached legends and explanatory sidebars.
> - **Separating the chart, legend, filters, and explanation so far apart that repeated eye travel becomes part of the task.**（Common Mistakes）

出处：https://github.com/openai/plugins/blob/main/plugins/build-web-data-visualization/references/foundations/layout-hierarchy-and-self-explanatory-ux.md

### 3.4 反"通用 AI 氛围"艺术指导 QA 清单——汇总

散落在四份文档里，合并后是：

**必须拒绝的氛围元素（原文）**：broad translucent brush strokes / wispy ribbons / bokeh / orbs / cinematic wallpaper / stock-photo haze / decorative gradients / one-hue drama / broad brush strokes。

> - Reject or iterate on concepts that ... rely on generic AI atmosphere such as broad translucent brush strokes, wispy ribbons, bokeh/orbs, cinematic wallpaper, stock-photo haze, or decorative gradients that do not carry evidence

出处：https://github.com/openai/plugins/blob/main/plugins/build-web-data-visualization/references/foundations/meaning-preserving-visual-design-workflow.md

**判定原则（原文）**：

> - Contextual imagery, atmospheric marks, and motion must be evidence-bearing. Do not use broad translucent brush strokes, wispy ribbons, bokeh/orbs, cinematic wallpaper, stock-photo haze, or decorative gradients as substitutes for data layers.

出处：SKILL.md

**人类视觉评审问题（原文）**：

> - Does the imagery earn its place analytically, or is it just attractive?
> - Is any element visually impressive but analytically idle?
> - Would a screenshot be intelligible in a social preview, slide, or print clipping?

出处：https://github.com/openai/plugins/blob/main/plugins/build-web-data-visualization/references/foundations/art-directed-interactive-visual-stories.md

**评估表（原文，7 项各 1–5 分）**：Clarity / Storytelling strength / Hierarchy / **Restraint**（颜色、装饰、网格线、控件只承担有意义角色）/ Annotation quality / Accessibility / Originality。
出处：https://github.com/openai/plugins/blob/main/plugins/build-web-data-visualization/references/foundations/editorial-infographic-system.md

### 3.5 其余基础文档的可操作规则摘要

**`task-abstraction-and-chart-selection.md`**
- 从问题出发：compare / rank / trend / distribute / relate / monitor / map / explain。
- 先分类数据形态：table / time series / matrix / hierarchy / graph / geography / stream。
- 选"**能最容易做出关键比较的最小真实视觉形式**"。
- 重复能改善比较时用 small multiples，而不是堆叠/颜色/交互。
- 常见错误：按图表流行度而非任务契合度选型；用地图做非空间比较；真正需要的是聚焦报告却做了仪表盘。
出处：https://github.com/openai/plugins/blob/main/plugins/build-web-data-visualization/references/foundations/task-abstraction-and-chart-selection.md

**`layout-hierarchy-and-self-explanatory-ux.md`**
- 让**一个问题/状态在画面上占主导**，不要让每个 tile、图例、控件同等重要。
- 若初次观看者需要一段话才能理解默认状态，**先简化构图，再加文字**。
- 常见错误：给每个 KPI tile、图表、控件相同视觉权重；把图表/图例/筛选/说明放得远到"往返扫视"变成任务的一部分；把桌面端图表硬塞进移动端。
- **大屏与移动端是"兄弟构图"（sibling compositions），要保留同一主张、注意事项与来源语境**，不是同一 DOM 顺序变窄。
出处：https://github.com/openai/plugins/blob/main/plugins/build-web-data-visualization/references/foundations/layout-hierarchy-and-self-explanatory-ux.md

**`mobile-first-responsive-visualization.md`**
- "不要依赖桌面 `viewBox` 缩小到文字不可读"；"**按实测容器尺寸重算 scales / ticks / labels / annotations**"。
- 降低密度的手段顺序是：**优先/聚合/分面/分步/渐进披露，而不是缩小标签**。
- 保留稳定的宽高比与显式绘图高度；不要让标题/图例/注释/控件吃掉整个视口。
出处：https://github.com/openai/plugins/blob/main/plugins/build-web-data-visualization/references/foundations/mobile-first-responsive-visualization.md

**`operational-visualization-workspaces.md`**
- 大屏用**三栏 shell**（左大纲/控件、中可视化视口、右检查器），中央视口必须占主导且"内在地定尺寸（intrinsically sized）"。
- **对密集图表/地图/时间线，宁可给可滚动 pan/zoom 表面，也不要把文字缩到可读性以下**。
- 顶部只用一个紧凑的命令/状态栏；**操作型界面不要营销式 hero**。
- "避免嵌套卡片与重复的浮层容器"。
- 视觉系统："密集但安静：紧凑排版、克制边框、稳定尺寸、对选中/关键证据强对比"。
- QA："大屏 shell 的 大纲/控件、可视化、检查器 对齐且无嵌套卡片杂乱"；"密集标签在滚动、平移、缩放、聚焦或横屏回退时仍可读，而不是被缩放掉"。
出处：https://github.com/openai/plugins/blob/main/plugins/build-web-data-visualization/references/foundations/operational-visualization-workspaces.md

**`meaning-preserving-visual-design-workflow.md`**
- 概念稿是**语义契约**，不是 moodboard；必须成对给出**大屏概念 + 移动竖屏概念**（必要时加横屏）。
- 契约锁定项：构图、阅读路径、主导焦点区、主要区域的相对尺度与位置、视觉层级、**颜色角色**、标签安全区、来源/注意事项位置、可编辑数据绑定层、交互动效状态、reduced-motion/静态回退。
- 灵活项：精确像素间距、最终排版 token、渲染器几何、断点机制、次要裁切——但只能在保留锁定项的前提下调整。
出处：https://github.com/openai/plugins/blob/main/plugins/build-web-data-visualization/references/foundations/meaning-preserving-visual-design-workflow.md

**`visualization-strategy-and-critique/SKILL.md` 的 Critique Checklist（22 问，摘要）**
关键几问：标题是否陈述主张？关键比较是否拿到最强视觉编码？尺度/基线/单位是否可信？聚合、平滑、不确定性、缺失是否披露？颜色是语义还是装饰？阅读顺序是否无需大段解释？**能否不追着分离图例就能解码？** 直接标注/内嵌键/small multiples 是否更好？**静图截图是否仍然成立？** 移动端阅读顺序是否保留同一主张？
出处：https://github.com/openai/plugins/blob/main/plugins/build-web-data-visualization/skills/visualization-strategy-and-critique/SKILL.md

---

## 4. 大屏特有约束（Q4）

### 4.1 画布与安全边距

#### 4.1.1 本仓库事实（一手，来自源码）

- `dvk-fit-screen` 的默认设计画布是 **1920 × 1080**（`width` / `height` 属性默认值）[本仓库事实] — `packages/elements/src/fit-screen/element.ts`
- 缩放实现是**在固定尺寸画布上做 `transform: translate(x, y) scale(sx, sy)`，`transform-origin: 0 0`**；画布 `position: absolute`、尺寸固定为设计宽高 [本仓库事实] — 同上
- 四种 `mode` 的语义（源码）[本仓库事实] — 同上：
  - `contain`：`scale = min(sx, sy)`，等比、完整可见、可能留白
  - `cover`：`scale = max(sx, sy)`，等比、铺满、**裁切**
  - `fill`：`scaleX = sx, scaleY = sy`，**非等比拉伸**（同时拉伸线宽与字形）
  - `scroll`：不缩放，`overflow: auto`
- 缩放结果通过 CSS 变量暴露：`--dvk-scale`（= min(sx, sy)）、`--dvk-scale-x`、`--dvk-scale-y`、`--dvk-viewport-width`、`--dvk-viewport-height`；并派发 `dvk-resize` 事件，detail 含 `{ width, height, dpr, scale, scaleX, scaleY, offsetX, offsetY }` [本仓库事实] — 同上
- 对齐：`align` 支持 `start/left/top`、`end/right/bottom`，其余按居中处理 [本仓库事实] — 同上
- 边框/容器已有内容安全区契约：每个 SVG 装饰容器必须声明 `viewBox` 与 **`contentRect`（同一 SVG 坐标系内的安全矩形）**，默认内容内边距由 `contentRect` 映射到宿主实测尺寸得出，**不允许用固定大 padding 或通用宽高比当默认模型**；CSS 变量优先级 `--dvk-border-box-N-padding` > `--dvk-border-box-padding` > 计算出的安全区内边距 [本仓库事实] — `docs/reference/architecture-contracts.md`

#### 4.1.2 广播安全区标准（SMPTE ST 2046-1:2009）[规范]

原文（§5.1 1080 Line Formats）：

> "The Safe Action Area for **1920 x 1080** formats shall be **93% of the width and 93% of the height** of the Production Aperture **1786 x 1004**. The Safe Title Area for 1920 x 1080 formats shall be **90% of the width and 90% of the height** of the Production Aperture **1728 x 972**."

> "The Safe Action Area for **1280 x 720** formats shall be 93% … **1190 x 670**. The Safe Title Area for 1280 x 720 formats shall be 90% … **1152 x 648**."

> （480 行 4:3 传统格式）"the Safe Action Area shall be **90%** of the width and 90% of the height … **648 x 432**. The Safe Title Area shall be **80%** of the width and 80% of the height … **576 x 384**."（即 SMPTE RP 218）

出处：SMPTE ST 2046-1:2009《Specifications for Safe Action and Safe Title Areas for Television》，https://pub.smpte.org/pub/st2046-1/st2046-1-2009.pdf （原文为 "shall"，属规范性）

**换算到 1920×1080 设计画布** [本文件计算]：
- Safe Action 93% → 内容边界距上下左右各 **≈ 67px / 38px**（宽 1786、高 1004）
- Safe Title 90% → 距上下左右各 **≈ 96px / 54px**（宽 1728、高 972）

#### 4.1.3 另外两份广播安全区标准（原文已核实）[规范]

**EBU R95 v1.1（2017-06）第 5 条原文**：

> "The **action safe area is 3.5%** and the **graphics safe area is 5%**, at the top, bottom and lateral parts of the image."

出处：https://tech.ebu.ch/docs/r/r095.pdf

**ITU-R BT.1848（2009-05）Table 1 原文**：

> "Action safe margin % — Vertical **3.5** / Horizontal **3.5**；Graphics safe margin % — Vertical **5** / Horizontal **5**"
> "The action safe margin is 3.5% at the top, bottom and lateral parts of the original image. The graphics safe margin is 5% at the top, bottom and lateral parts of the original image."

> "the overscan on modern domestic television receiver displays will normally be in the range **7.0 ± 1%** of overall picture width or height. But for any one picture edge, the **overscan should not exceed 4%** of total picture width or height."

> 关键判断（Recommendation 的 considering 段）："**display overscan is both unnecessary and undesirable for digital television**"；"consumers now watch television on their computer monitors which typically use displays **without overscan**"

出处：https://www.itu.int/dms_pubrec/itu-r/rec/bt/R-REC-BT.1848-0-200905-S!!PDF-E.pdf

**三套标准的换算对比** [本文件计算]（按 1920×1080 设计画布）：

| 标准 | Action safe | Graphics / Title safe | 1920×1080 下四边内缩 |
| --- | --- | --- | --- |
| SMPTE ST 2046-1:2009 | 93%（1786×1004） | 90%（1728×972） | Action 左右 67px / 上下 38px；Title 左右 96px / 上下 54px |
| EBU R95 / ITU-R BT.1848 | 3.5% 内缩（≈1853×1004） | 5% 内缩（≈1824×972） | Action 左右 34px / 上下 38px；Graphics 左右 48px / 上下 54px |

**重要限定**：这两套都是**广播安全区**，用于兼容老式 CRT 的过扫描。**ITU 自己在 BT.1848 里明确说"数字电视的过扫描既无必要也不可取"**，并指出用户已多在无过扫描的显示器上观看。因此它们只能当作"保守的边距参照"，不是大屏设计的硬性要求——**取舍留给 ticket 04/07**。

#### 4.1.4 拼接屏（video wall）

- **T/CIDADS 00011-2022《数字大屏可视化设计指南》（中国工业设计协会团体标准，2022-06-14 发布 / 2022-09-08 实施，15 页，起草单位含阿里云计算有限公司）原文**："拼接屏幕的物理拼缝一般在 **0.5mm 到 3.5mm** 之间"；"设计过程中，建议**将较精细的元素绕开边框和接缝处**" [规范/团体标准，经第三方文档站转述] — https://www.renrendoc.com/paper/498555606.html
- 同标准：拼接屏建议比例 **16:9**，设计尺寸宜把**上下高度设定为 1080px**；示例"纵向 3 块、横向 5 块，设计稿尺寸为 **1080px × 3200px**" [规范/团体标准，经第三方转述] — 同上
- 市面常见缝宽规格 **3.5mm / 1.8mm / 0.88mm**，标称值通常指 **bezel-to-bezel gap**，实际可见缝宽受安装精度影响 [实践观点/厂商] — https://www.qtenboardglobal.com/fra/lcd-video-wall-news-737.html
- 拼接补偿（bezel compensation）的两种做法：**edge offsetting**（把本会被缝切开的元素向内平移进可见区）与 **content cropping**（从源图裁掉/压缩少量竖条或横条，避免关键内容被缝打断）；两者都"require accurate measurements of bezel width and must respect the native resolution of each panel" [实践观点/厂商] — https://www.fugo.ai/digital-signage-tools/wiki/bezel-compensation-digital-signage/
- 设计侧的对策（同源）："place key elements away from bezel zones, reserving margin space to tolerate slight mismatches"，并避免"placing small text or thin gridlines directly across joins" [实践观点/厂商] — 同上
- 厂商给出的经验判据："**Viewing distance (meters) × detail coefficient ≥ bezel width (mm)**"，标准高清取系数 1.2–1.5，4K 细粒度取 1.8–2.0 [实践观点/厂商] — https://www.qtenboardglobal.com/fra/lcd-video-wall-news-737.html
- **没有找到关于拼接屏的公开标准（ISO/IEC/ITU）规定"安全区"或缝宽补偿公式**；以上均为厂商与集成商实践。见 §6。

#### 4.1.5 超宽屏（21:9 / 2560×1080 / 3440×1440 / 3840×1080）

- **未找到任何标准或官方设计系统针对 21:9 的适配规范。** 搜索到的结果全部是显示器营销页或玩家论坛 [实践观点]。见 §6。
- 可用的机制性事实只有本仓库的四种 `mode`（§4.1.1）：在 21:9 视口下，1920×1080 画布若用 `contain` 会在左右留下大面积空白，若用 `cover` 会裁掉上下内容，若用 `fill` 会非等比拉伸（字形与线宽都会变形）。**具体选哪种是 ticket 07 的决策，本文件只提供机制事实。**
- 唯一相关的标准线索（间接）：**T/CIDADS 00011-2022 固定的是设计稿"高度"为 1080px，宽度随拼接规模变化**（3×5 → 1080×3200），即"定高不定宽"的思路，而非固定 16:9 加信箱。[规范/团体标准] — https://www.renrendoc.com/paper/498555606.html

#### 4.1.6 控制室人因标准（ISO 11064 系列）

- **部件与年份**（已核实）：-1 原则 (2000)、-2 控制套间布置 (2000)、-3 控制室布局 (1999)、-4 工作站布局与尺寸 (2004，2013 第 2 版)、-5 显示与控制 (2008)、-6 环境要求 (2005)、-7 评估 (2006)、TR-10 导论 (2020) [规范] — https://www.antpedia.com/standard/sp/en/41604.html
- **ISO 11064-3 §4.3**（经俄文采标文本读取）：**每个工作站 9–15 m²**；"in control rooms where **large shared overview displays** play an important role, the area per workstation may be increased up to **50 m²**"；§4.5.2 对共享大屏只给定性要求（不得与窗户处于同一视野；照明不得干扰；出入口不得与主屏同视野；关键信息须对**第 5–95 百分位**身高的人群可见）[规范] — https://meganorm.ru/mega_doc/norm/gost-r_gosudarstvennyj-standart/15/gost_r_iso_11064-3-2015_natsionalnyy_standart_rossiyskoy.html
- **ISO 11064-4:2013** 的视距规则见 §4.2.1 [规范]
- **ISO 11064-6 Annex A.4** 的照明数值见 §4.4.2 [规范]
- **重要限定**：以上均经**俄文采标文本**（ГОСТ Р ИСО 11064-x）读取，与 ISO 英文版"textually identical"是通用做法但**未经官方确认**；ISO 正版需付费。见 §6.2。

### 4.2 观看距离与字号

#### 4.2.1 字符高度与视角的一手依据

ANSI/HFES 100（草案，2026 版）第 4.9.1 条 NOTE 2 原文：

> "The maximum viewing distance is one that allows alphanumeric characters rendered on the screen in their primary or default font to **subtend at least 16 arc minutes of visual angle**; for example, **2.3 mm at 500 mm** (0.1 in. at 19.7 in.) viewing distance. This character size facilitates legibility; **many individuals find that a character height of 20 to 22 arc minutes improves readability**."

出处：https://www.hfes.org/Portals/0/Uploads/BSR%20HFES%20100-2026%20Draft%20%28003%29.pdf （本项内容直接提取自该 PDF 文本流）

- 该数值与 ISO 家族一致，且 **ISO 9241-303:2008 §5.5.4 的原文数值本次已核实**：拉丁字符 **≥16 弧分**，**20–22 弧分推荐**；日文字符 ≥20 弧分，25–35 弧分推荐 [规范] — https://www.sis.se/api/document/preview/910450/ （出版商预览 PDF；与 ГОСТ Р ИСО 9241-303-2013 交叉核对）
- **ISO 9241-3:1992 §6.4 原文**（经 NUREG-0700 逐字引用）："the visual angle subtended by height of **black-and-white characters** should be **not less than 4.6 mrad (16 min) with 5.8 mrad (20 min) preferred**; the visual angle subtended by height of **coloured characters** should be **not less than 6.1 mrad (21 min) with 8.7 mrad (30 min) preferred**." [规范] — https://inis.iaea.org/records/7r0vt-2mn56/files/37122422.pdf
  - **对本项目极重要**：**彩色字符（大屏默认就是彩色字符）的最小视角要求比黑白字符高一档——21 弧分起，30 弧分推荐**。
- **ISO 11064-4:2013 §6.2.1 + Annex A**（经俄文采标文本读取）：字符高度最小 **15′**（ISO 9355-2）/ **16′**（ISO 9355-3），**推荐 18–20′**（ISO 9241-3）；速算规则 **最大观看距离 = 215 × 拉丁字符高度**（215 = 3437.75/16，正是 16′ 关系）；符号识别视距 **> 500 mm**，**≥ 700 mm** 可减少眼疲劳，识别任务推荐 **70–80 cm** [规范] — https://meganorm.ru/mega_doc/norm/gost-r_gosudarstvennyj-standart/15/gost_r_iso_11064-4-2015_natsionalnyy_standart_rossiyskoy.html
- **ANSI 1988 / NUREG-0700**：最大易读性 **20–22′**；重要可读场合最小 **16′**；一般可读 **24′**；时间不敏感 **10′**；NUREG-0700 §1.3.1-4 给出速算"字符高度 ≥ 视距 × 0.004（15′）/ 视距 × 0.006（20′ 推荐）" [规范] — 同上 NUREG 链接
- Ant Design 的自述：主字体 14px 是基于"电脑显示器**阅读距离 50 cm** 以及最佳阅读角度 **0.3**"定出的 [官方指南] — https://raw.githubusercontent.com/ant-design/ant-design/master/docs/spec/font.zh-CN.md
  - [本文件计算] 14 CSS px 在 96dpi 下 = 14 × 25.4/96 = **3.70 mm**；在 500 mm 处张角 = 3.70/500 = 0.00741 rad = **25.5 弧分**，高于 20–22 弧分推荐值。

#### 4.2.2 中文团体标准 T/CIDADS 00011-2022 的字号与视距规则 [规范/团体标准]

这是本次调研找到的**唯一一份专门针对"数字大屏"的中文标准**（中国工业设计协会发布，阿里云等起草）。原文条款：

> "视距宜在 **150cm 以上**，固定视野直径 **250cm 以上**"
> "宜将大屏放置于观看者垂直方向视域 **20°-28°**，水平方向视域 **36°-48°** 的位置"
> 最小观看距离 `S1 = cot14° × (h/2) = 2.005h`；最大观看距离 `S2 = cot10° × (h/2) = 2.835h`（h 为屏幕高度）
> 示例：屏幕高度 2.25 m，最佳观看距离为"**4.51 米至 6.38 米之间**"
> "**最小字号的物理高度宜为视距的 1/200**，字号的选用应以一般人眼可视为原则"
> 公式（3）：`最小字号 = (S/200) × (R/H)`（S=视距，R=视频信号垂直分辨率，H=屏幕高度）
> 示例：高 2.25m、3840×2160 屏幕，观看距离 5m 时——最小字号物理高度 = 500cm/200 = **2.5cm**；像素密度 = 2160px/225cm = **9.6px/cm**；最小字号像素高度 = 9.6 × 2.5 = **24px**
> "同一大屏上的字体**不宜超过 2 种**。同等级的标题、正文字体类型保持一致"
> "数据和地图可放置在白色面板上，但**白色面积不宜过大，建议占 40% 以下**"
> "动效不宜过长，时长建议控制在 **200ms-600ms** 范围内"
> "文字颜色应符合 WCAG 关于字体与背景的 **AA 级标准**"

出处：https://www.renrendoc.com/paper/498555606.html （标准正文经第三方文档站转述；**官方原文未取得**，见 §6.2）
标准登记信息（发布机构、日期、页数、起草单位）已核实：https://www.antpedia.com/standard/1195419249-9.html

**两条规则的交叉验证** [本文件计算]：`1/200 = 0.005 rad = 0.2865° = **17.2 弧分**`——正好落在 ANSI/HFES 100 的 16 弧分（下限）与 20–22 弧分（推荐）之间。即中文标准的 1/200 规则与美标/ISO 的弧分规则**在数值上互相印证**。

#### 4.2.3 LED 屏的观看距离经验法则（**互相冲突，无统一标准**）

- 厂商公开的经验值彼此不一致：Christie **8 ft/mm**、LG **3.5 ft/mm**、Absen **1mm = 1m**、PixelFLEX **3 ft/mm**、NanoLumens **4 ft/mm**、某荷兰经销商 **1.5 × 点间距（米）** [实践观点/厂商] — https://invidis.com/sixteen-nine/2017/09/29/the-rule-of-thumb-for-direct-view-led-viewing-distances-is-all-over-the-place/
- **结论**：LED 屏"点间距 × N = 最小观看距离"的规则**没有统一标准**，各厂商取值相差 2 倍以上。若要写进规范，必须标注为厂商经验值。

#### 4.2.4 公式与换算表 [本文件计算]

小角度下 `字符高度 h ≈ 视距 d × 视角 θ（弧度）`；`1 弧分 = 0.000290888 rad`。

| 视角 | 3 m | 5 m | 10 m | 20 m |
| --- | --- | --- | --- | --- |
| **16 弧分**（最小） | 13.96 mm | 23.27 mm | 46.54 mm | 93.08 mm |
| **20 弧分**（推荐下限） | 17.45 mm | 29.09 mm | 58.18 mm | 116.36 mm |
| **22 弧分**（推荐上限） | 19.20 mm | 32.00 mm | 63.99 mm | 127.99 mm |

把毫米换算成**设计画布像素**，需要知道屏幕物理尺寸。对 1920×1080 画布、对角线 D 英寸的屏幕：
`每毫米设计像素 = 1080 / (D × 25.4 × 0.49026) = 86.68 / D`

| 屏幕对角线 | 每毫米设计像素 | 16 弧分 @3m | 16 弧分 @5m | 20 弧分 @5m | 20 弧分 @10m |
| --- | --- | --- | --- | --- | --- |
| 55″ | 1.576 | **22 px** | **37 px** | **46 px** | **92 px** |
| 65″ | 1.334 | 19 px | 31 px | 39 px | 78 px |
| 75″ | 1.156 | 16 px | 27 px | 34 px | 67 px |
| 100″ | 0.867 | 12 px | 20 px | 25 px | 50 px |
| 110″ | 0.788 | 11 px | 18 px | 23 px | 46 px |

**用法**：给定屏幕尺寸与观看距离，查表得到"正文最小字号"；反过来说，给定字号即可反推最大可读距离（`d_max = h / 0.004654`）。

**重要限定**：以上是**按字符物理高度**推导的**可读性下限**，不含大屏场景下的信息层级、留白与情绪因素。大屏的"标题/数字/正文"层级通常远大于此下限。

### 4.3 等比缩放对线宽与字号的影响

#### 4.3.1 规范层面（CSS Transforms）[规范]

CSS Transforms Level 1 原文：

> "This module defines a set of CSS properties that affect the **visual rendering** of elements to which those properties are applied; **these effects are applied after elements have been sized and positioned** according to the visual formatting model from [CSS2]."

> "For elements whose layout is governed by the CSS box model, the transform property **does not affect the flow of the content** surrounding the transformed element."

> "any value other than none for the transform property results in the creation of a **stacking context**."

出处：https://drafts.csswg.org/css-transforms/

**推论（事实层面）**：`transform: scale()` 是**布局之后**的视觉变换。因此 1px 描边、1px 分隔线、字形轮廓在缩放后都会按比例变化——`scale = 0.5` 时 1px 变成 **0.5 设备像素**（被抗锯齿抹成灰边），`scale = 2` 时变成 2px。**这是本仓库 `--dvk-line-width: 1px` 在非 1920×1080 视口下的既有风险。**

#### 4.3.2 本仓库事实

- `--dvk-line-width` 在全部 5 套主题中都是 **1px** [本仓库事实] — `packages/themes/src/*.css`
- `--dvk-motion-duration` 在 5 套主题中为 **2200 / 2400 / 2400 / 2500 / 2600 ms** [本仓库事实] — 同上。注意：这是**装饰动画的单周期时长**，量级为秒，远高于 UI 动效通常的百毫秒级（§2.4）；若设计规范要写"动效预算"，必须处理这个既有的秒级基线。
- `--dvk-color-surface` 的 alpha 为 **0.18 / 0.72**（ice-white 为 0.18，其余为 0.72）[本仓库事实] — 同上
- 主题 token 全集只有 8 个：`--dvk-color-primary` / `-secondary` / `-accent` / `-surface`、`--dvk-glow-soft` / `-strong`、`--dvk-line-width`、`--dvk-motion-duration` [本仓库事实] — 同上

#### 4.3.3 抗缩放描边的标准解法

- SVG 提供 **`vector-effect: non-scaling-stroke`**，使描边宽度不随变换缩放 [规范] — https://www.w3.org/TR/SVG2/ （OpenAI 插件亦推荐："Use `vector-effect: non-scaling-stroke` for zoomable maps, outlines, annotation connectors, and icons whose stroke weight should remain stable on screen." [官方指南] — https://github.com/openai/plugins/blob/main/plugins/build-web-data-visualization/references/foundations/editorial-infographic-system.md）
- OpenAI 插件另有两条与缩放相关的规则："按**实测容器尺寸**重算 scales / ticks / labels / annotations，不要依赖桌面 `viewBox` 缩小到文字不可读"；"密集标签在滚动、平移、缩放、聚焦或横屏回退时仍可读，而不是被缩放掉" [官方指南] — https://github.com/openai/plugins/blob/main/plugins/build-web-data-visualization/references/foundations/mobile-first-responsive-visualization.md 与 operational-visualization-workspaces.md
- **Canvas 渲染器（ECharts）在 CSS 缩放下的清晰度**：ECharts 官方只在 canvas-vs-svg 页说明"SVG … **won't be blurry when zooming in**"，并建议 >1k 数据量用 canvas [官方指南] — https://echarts.apache.org/handbook/en/best-practices/canvas-vs-svg/ 。ECharts 的 `devicePixelRatio` 配置页为 JS 渲染，本次**未能取回原文**，见 §6。
  - 可核实的机制事实：`devicePixelRatio` 选项默认取 `window.devicePixelRatio`（https://echarts.apache.org/en/api.html#echarts.init ）；zrender 的 Painter 按 `canvas.width = width × dpr` 设置位图尺寸（https://github.com/ecomfe/zrender/blob/master/src/canvas/Painter.ts ）；ECharts PR #21489 已合并"**Auto update devicePixelRatio on resize() to fix blurry chart after browser zoom**"（https://github.com/apache/echarts/pull/21489 ）[本仓库外事实]
  - **注意**：ECharts 官方**从未解释过"CSS transform 缩放导致 canvas 模糊"的机制**，因此不要把它写成 ECharts 的官方结论。已知的可靠表述只有"SVG 放大不会模糊"与上面的 DPR 机制。

#### 4.3.4 不用 transform 的替代方案：rem 缩放

- 社区常用的另一种大屏适配写法（**不依赖 transform**，因此不会缩放描边与字形）：按视口与设计稿的比值改根字号——
  `scaleRatio = clientWidth/clientHeight > 1920/1080 ? clientHeight/1080 : clientWidth/1920`，
  `document.documentElement.style.fontSize = scaleRatio × 16 + "px"` [实践观点] — https://juejin.cn/post/7480157532038512677
- **机制对比（事实层面）**：`transform: scale()` 缩放的是**已光栅化的视觉结果**（描边、字形一起缩放）；`rem` 缩放改的是**布局尺寸**（字体按新尺寸重新排版与光栅化，因此字形更清晰），但**描边/边框若写成 px 就不会跟着变**。两种方案各有取舍，**取舍留给 ticket 07**。
- 本仓库采用的是前者（`dvk-fit-screen` 的 transform 方案），见 §4.1.1。

#### 4.3.5 真实大屏适配实现的已知取舍（一手仓库事实）

| 方案 | 缩放算法 | 已记录的取舍 / 已知缺陷 |
| --- | --- | --- |
| **DataV `dv-full-screen-container`** | `transform: scale(document.body.clientWidth / window.screen.width)`，`transform-origin: left top`，防抖 100ms；**只按宽度缩放**，画布 = 物理屏分辨率（不是固定 1920×1080） | ECharts/高德地图在缩放下**鼠标交互错位**（issue #60）；`window.screen.width` 在系统 DPI 缩放下取值错误导致变形（#229 / #152 / #215）；溢出裁切（#147）。**均未获维护者回复** [仓库事实] — https://github.com/DataV-Team/DataV/blob/master/src/components/fullScreenContainer/src/main.vue |
| **v-scale-screen** | `scale = Math.min(clientWidth/1920, clientHeight/1080)`，`transform-origin: left top`，居中靠 margin，默认防抖 **500ms**；`fullScreen` 模式为拉伸，README 自述「会存在拉伸问题…非必要情况下不建议开启」 | 8+ 个未关闭 issue 关于地图标记/点击偏移（百度、高德、bimface 3D）与 canvas 选中问题 [仓库事实] — https://github.com/Alfred-Skyblue/v-scale-screen |
| **autofit.js** | `S = min(clientWidth/1920, clientHeight/1080)`，`transform-origin: 0 0`，`translateZ(0) scale(S)`；再把容器尺寸改为 `round(clientWidth/S) × round(clientHeight/S)`，**在非受限轴上溢出 1920×1080 的盒子**；`limit` 默认 0.1（接近 1 时吸附）；`cssMode: "zoom"` 为替代方案；`ignore` 列表可反向缩放 | — [仓库事实] — https://github.com/Auto-Plugin/autofit.js/blob/master/src/strategy.ts （**注意：任务书里的 `gaoshiyu/autofit.js` 是 404，真实仓库是 `Auto-Plugin/autofit.js`**） |
| **rem 缩放** | 见 §4.3.4 | 作者自述：比例小于 16:9 时**底部留白**；并明确拒绝把高度换算成百分比（"会增加开发难度，降低效率"）[实践观点] — https://juejin.cn/post/7480157532038512677 |
| **`screenfull` / `lib-flexible` / `postcss-pxtorem`** | **都不是缩放方案**：`screenfull` 只是 Fullscreen API 封装（vue-element-admin 的 Screenfull 组件里没有任何 transform/scale/resize 数学）；`lib-flexible` + `postcss-pxtorem` 只是**构建期 px→rem 转换**（`postcss-pxtorem` 默认 `rootValue: 16`） [仓库事实] — https://github.com/sindresorhus/screenfull.js 、https://github.com/cuth/postcss-pxtorem |

#### 4.3.6 与缩放相关的三条规范/工程事实（补充）

- **`zoom` 已进入标准轨道（CSS Viewport L1）且与 `transform` 语义不同**："Unlike transform, scaling the **zoom** property **affects layout**"；Baseline 2024 [规范] — https://drafts.csswg.org/css-viewport/#zoom-property
- **非整数缩放下浏览器会关闭次像素抗锯齿**：Chromium 的 Philip Rogers 在 W3C 邮件列表中指出，"blink is unable to use subpixel antialiasing in a lot of cases, such as for content that is not known to be opaque or is not known to have an **integer to-screen transform**"；WebKit 的 `LayoutUnit` 文档亦说明"most modern graphics libraries support painting with subpixel precision, this results in **unwanted anti-aliasing**" [规范讨论] — https://lists.w3.org/Archives/Public/public-css-archive/2019Dec/0289.html 、https://trac.webkit.org/wiki/LayoutUnit
- **`will-change` 不宜滥用**：MDN 明确"Use the will-change property as a last resort… applying a non-auto value on a large section, such as the `<body>`, can actually be **bad for a page's performance**" [官方指南] — https://developer.mozilla.org/en-US/docs/Web/CSS/will-change

### 4.4 暗色场景下的对比度

#### 4.4.1 Material Design 暗色主题（官方原文，经归档页取得）[官方指南]

> "Material Design dark themes are defined by the following properties: **Contrast: Dark surfaces and 100% white body text have a contrast level of at least 15.8:1**"

> "The recommended dark theme surface color is **#121212**."

> "Dark gray surfaces also **reduce eye strain**, as light text on a dark gray surface has **less contrast** than light text on a black surface."

> "Dark theme surfaces must be dark enough to display white text. They should use a contrast level of **at least 15.8:1** between text and the background. This ensures that body text passes WCAG's AA standard of at least 4.5:1 when applied to surfaces at the highest (and lightest) elevation."

> "**Ensure that the background color is dark enough so that body text meets a contrast level of at least 4.5:1 (AA) on the highest elevated surface (24dp).**"

> 白色叠加层（elevation overlay）透明度：**00dp 0% / 01dp 5% / 02dp 7% / 03dp 8% / 04dp 9% / 06dp 11% / 08dp 12% / 12dp 14% / 16dp 15% / 24dp 16%**

> 浅色文字在深色背景上的不透明度：**高强调 87% / 中强调与提示 60% / 禁用 38%**；禁用态容器 12% 白、内容 38% 白。

> "**Don't use light glows in place of dark shadows to express elevation.**"

> "Apply **limited color accents** in dark theme UIs, so the majority of space is dedicated to dark surfaces."

> 颜色应"desaturated so they pass WCAG's AA standard of at least 4.5:1 (when used with body text) at all elevation levels"

> OLED 警告："turning pixels on and off can cause a delay when the screen is scrolled, making the pixels blur."

出处：Material Design《Dark theme》，https://material.io/design/color/dark-theme.html （归档可读版：https://web.archive.org/web/2019/https://material.io/design/color/dark-theme.html ）

#### 4.4.2 其他官方暗色指引

- IBM Carbon：暗色主题 **Gray 90 (#262626)** 与 **Gray 100 (#161616)**；"layers become one step lighter with each added layer"；"**Avoid use of midtones**"；文字与图标使用 White 到 Gray 50 的范围 [官方指南] — https://carbondesignsystem.com/elements/color/overview/
- Ant Design："暗黑模式下**避免使用对比很强的色彩或内容，长时间使用会带来疲劳感**"；"暗黑模式下的信息内容需要和浅色模式保持一致性，不应该打破原有的层级关系"；基于 12 套基础色板 + 透明度规则 [官方指南] — https://raw.githubusercontent.com/ant-design/ant-design/master/docs/spec/dark.zh-CN.md
- Carbon 数据可视化顺序色板的方向性：**浅色主题里最深色代表最大值；暗色主题里最浅色代表最大值** [官方指南] — https://carbondesignsystem.com/data-visualization/color-palettes/
- ECharts 内置 dark 主题背景色为 **#100C2A** [官方指南] — https://raw.githubusercontent.com/apache/echarts/5.5.1/src/theme/dark.ts
- WCAG 侧：对比度阈值**与主题无关**，暗色主题同样适用 4.5:1 / 3:1；同时 SC 1.4.3 的 "Incidental" 豁免**不覆盖**图表中的数据标记 [规范] — https://www.w3.org/TR/WCAG22/
- **控制室照明（ISO 11064-6 的俄罗斯采标全文，Annex A.4）**：照度 **200–750 lx**；使用 VDT 处上限 **500 lx**；调光最低 **200 lx**；纸面工作区 **500 lx**；不舒适眩光 **UGR ≤ 19**；显色指数 **> 80** [规范，经采标文本转述] — https://meganorm.ru/mega_doc/norm/gost-r_gosudarstvennyj-standart/14/gost_r_iso_11064-6-2016_natsionalnyy_standart_rossiyskoy.html
  - **注意**：ISO 11064 正版全文（Part 3 控制室布局 / Part 4 工作站尺寸 / Part 6 环境要求）**需付费**，本次只取得上述采标代理文本；ISO 11064 关于**显示屏布局与视距**的具体数值条款**未能核实**，见 §6.2。

#### 4.4.3 暗色场景下的既有事实汇总（供 ticket 04/05 取用）

1. **暗色 ≠ 纯黑。** Material 明确推荐 `#121212` 而非 `#000`，理由是深灰能承载更高的 elevation 表达，且降低眼疲劳；Carbon 用 `#161616` / `#262626`。
2. **暗色下的对比度目标更高，不是更低。** Material 要求"表面 + 白正文 ≥ 15.8:1"，以保证最高 elevation 表面上仍 ≥ 4.5:1。
3. **对比度不是越高越好——存在可引用的上限依据**（修正早前"无规范表述"的判断）：
   - **FAA / 英国 NATS（1999），经 NUREG-0700 汇编**："For optimum legibility, character contrast should be between **6:1 and 10:1**… Legibility may diminish with contrasts below 3:1, whereas **contrasts above 15:1 may cause visual discomfort**."（IEEE STD 1289-1998 推荐 10:1–18:1）[规范] — https://inis.iaea.org/records/7r0vt-2mn56/files/37122422.pdf
   - **MIL-STD-1472H §5.2.2.7**：字符/背景对比 **6:1 以上，10:1 更佳**；§5.2.2.12.8 直视大屏亮度对比 **≥1.5:1**；§5.2.2.6 **环境照度 < 0.1 lx 时用亮字符/暗背景**；§5.6.7.1.2 夜间显示亮度 **0.1–3.5 cd/m²** [规范] — https://everyspec.com/MIL-STD/MIL-STD-1400-1499/MIL-STD-1472H_57041/
   - **APCA（WCAG 3 候选对比度模型）是唯一明确提出"对比度上限"的模型**：其文档称 "Polarity awareness… is important for dark mode to facilitate a **maximum contrast value to prevent halation**"，并给出初步的 "Dark Mode Maximum: **Lc −90** for large fonts" [规范草案] — https://git.apcacontrast.com/documentation/APCAeasyIntro.html
   - **WCAG 本身既不禁止纯白配纯黑，也没有上限**——WCAG 2.2 全文**没有出现 "halation"**；21:1 只是公式的算术上限，不是需要规避的阈值 [规范] — https://www.w3.org/TR/WCAG22/
   - **Material 的 "15.8:1" 经复算不能复现** [本文件计算]：#FFF 在 **#121212** 上 = **18.73:1**；#FFF 在 02dp 表面 **#232323** 上 = **15.72:1**（最接近）。因此 Material 的 15.8:1 应理解为"对**较高 elevation 表面**的要求"，而非"对基础表面色 #121212 的要求"。**引用时不要写成"#121212 上必须 15.8:1"。**
   - **负极性（亮字暗底）在小字号下更差**：Piepenbrock, Mayr & Buchner (2014) 发现负极性劣势"linearly increased with decreasing character size"——**字号越小，亮字暗底越吃亏** [学术] — https://www.psychologie.hhu.de/fileadmin/redaktion/Oeffentliche_Medien/Fakultaeten/Mathematisch-Naturwissenschaftliche_Fakultaet/Psychologie/AAP/Publikationen/in_press/Piepenbrock_Mayr_Buchner_inpress_.pdf
   - **LED/控制室亮度实务**：Christie 控制室白皮书——"a nominal brightness of **250 cd/m²** is quite adequate… Above **500 cd/m²** may be too bright"；系统对比度需 >100:1 [厂商] — https://www.christiedigital.com/globalassets/help-center/whitepapers/documents/chri4212_choosing_video_wall_tech_for_control_room_whitepaper_jan-16_en.pdf
   - **ISO 9241-303 亮度平衡**：作业区平均亮度应处于屏幕平均亮度的 **0.1L–10L** 之间；500 lx 环境照度下屏幕亮度示例 **100–150 cd/m²**；最小对比度公式 `CRmin = 2.2 + 4.84 × L^−0.65`（在 L = 18.7 cd/m² 处跨过 3:1）[规范] — https://www.sis.se/api/document/preview/910450/
4. **暗色下的强调色需要降饱和**（Material 原文 "desaturated"；Ant Design 原文"避免使用对比很强的色彩"）。
5. **不要用光晕代替阴影表达层级**（Material 原文 Don't）。

---

## 5. 常见反模式清单（Q5）

### 5.1 按 ticket 的六个类别归档

| 类别 | 可引用的判据（含出处） |
| --- | --- |
| **碎片化拼贴** | "**dashboards made of equally weighted KPI tiles**"；"**every panel, card, metric, and control has equal visual weight**"；"**the page is a grid of bordered chart boxes** when the story needs a composed visual sequence"；"**chart galleries masquerading as editorial stories**"；"bordered chart cards arranged as a gallery"（OpenAI，https://github.com/openai/plugins/blob/main/plugins/build-web-data-visualization/skills/visualization-strategy-and-critique/SKILL.md ）· Ant Design："将总模块数量控制在 **5-9 个**"、"一张卡片放置一个主题内容"（https://ant.design/docs/spec/visualization-page-cn ）· Stephen Few：仪表盘是"consolidated and arranged on **a single screen** so the information can be monitored at a glance"（https://www.perceptualedge.com/articles/dmreview/dashboard_design.pdf ）· Carbon："Prioritize data by importance, then create a clear visual hierarchy"、"Limit the number of metrics"（https://v10.carbondesignsystem.com/data-visualization/dashboards/ ） |
| **装饰抢焦点** | "**decorative gradients, shadows, and animation that compete with the data**"；"contextual backgrounds used as wallpaper"；"generated backgrounds with ordinary charts pasted on top"；"gorgeous imagery that prevents data labels from being read"（OpenAI）· Tufte：chartjunk = "the interior decoration of graphics generates a lot of ink that does not tell the viewer anything new"，含"over-busy gridlines and excess ticks"（https://www.cs.rug.nl/svcg/uploads/VisualAnalytics/Few11.pdf ）· NN/g："Funky colors, fonts, 3D effects, gradients, shadows, and textures don't add informational value"（https://www.nngroup.com/articles/clutter-charts/ ）· Ant Design："不过度修饰"（https://ant.design/docs/spec/visual-cn ） |
| **按钮化 / 图标化装饰** | **未找到直接针对"仪表盘上的装饰性边框/图标"的一手规则。** 可用的相邻证据：Norman"what people need, and what design must provide, are **signifiers**"（https://jnd.org/signifiers-not-affordances/ ）· NN/g 眼动实验：弱 signifier 让用户多花 **22% 时间**、多 **25% 注视次数**（https://www.nngroup.com/articles/flat-ui-less-attention-cause-uncertainty/ ）· Gaver 1991 提出 "false affordance" 概念（https://dl.acm.org/doi/10.1145/108844.108856 ，全文付费）。**结论：这一条只能从"错误暗示可点击"的可用性原理推导，不能声称有标准。** |
| **动效疲劳** | "**ambient motion that attract attention without explaining evidence**"；"animation that loops without revealing evidence"；"decorative parallax, scrolljacking"（OpenAI）· WCAG 2.2.2 / 2.3.1 / 2.3.3 [规范] · NN/g：轮播里促销内容"**visible only 20% of the time**"，用户反馈"I didn't have time to read it"（https://www.nngroup.com/articles/auto-forwarding/ ）· WebAIM："**We discourage the use of carousels**"（https://webaim.org/techniques/carousels/ ）· **反证**：Heer & Robertson 证明**有目的的过渡动画**能维持对象恒常性，是合理用法（http://vis.stanford.edu/papers/animated-transitions ）——即"动效疲劳"针对的是**循环/装饰性**动效，不是所有动效 |
| **图例漂移** | "**Parking a legend far from the chart and forcing repeated eye travel to decode the view**"；"tooltips used as the primary key or as the only place important values appear"；"the legend is more colorful than the chart is informative"（OpenAI）· Carbon："**When possible, avoid using a legend and label data representations directly**"、"A legend should not be taller than **30 percent** of the chart's height"（https://v10.carbondesignsystem.com/data-visualization/legends/ ）· Datawrapper："**remove the color key and directly label your categories**"（https://www.datawrapper.de/blog/text-in-data-visualizations ）· vis4.net："**Forget about the separate legend**"（http://www.vis4.net/blog/doing-the-line-charts-right/ ）· 感知依据：格式塔**接近律**（https://ixdf.org/literature/topics/gestalt-principles ） |
| **无意义的渐变与光晕** | "decorative gradients … that compete with the data"；"particle effects, glows, fire, sparkles"；"**every glow, pulse, halo, blur, particle … must have a named data or interaction mapping**"（OpenAI）· Carbon：**"Never use a gradient in place of a sequential palette."** "**Multiple gradients are often inaccessible and are discouraged in our system.**"（https://carbondesignsystem.com/data-visualization/color-palettes/ ）· Material："**Don't use light glows in place of dark shadows to express elevation.**"（https://material.io/design/color/dark-theme.html ）· Datawrapper："Gradients with many variations in lightness (like rainbow scales) can confuse readers"、"Don't place more than two hues with the same lightness in your gradient"（https://www.datawrapper.de/academy/what-to-consider-when-choosing-colors-for-data-visualization ） |

### 5.2 其他高价值反模式（有量化依据）

| 反模式 | 判据 | 出处 |
| --- | --- | --- |
| 3D 饼图 / 3D 柱状图 | "a 3D pie chart is **not recommended**"（扭曲扇区比例）；3D 柱"data transmission is not accurate" | ECharts Handbook |
| 3D 泛用 | "Gratuitous 3D is **unequivocally bad** and should be erased from the visual vocabulary"；3D 饼的 25% 扇区"visually occupy more than 25% of the area" | Wilke《Fundamentals of Data Visualization》https://clauswilke.com/dataviz/no-3d.html |
| 双轴图 | "The scales of dual axis charts are **arbitrary** and can therefore (deliberately) mislead"；"They're just hard to read" | Datawrapper https://www.datawrapper.de/blog/dualaxis |
| 彩虹色阶用于顺序数据 | rainbow colormap is "famous for its ineffectiveness"、"well known for its ability to obscure data, introduce artifacts, and confuse users" | Moreland 2009, https://www.kennethmoreland.com/color-maps/ |
| 截断的 y 轴 | 柱状/条形图必须从 0 开始，否则"considered deceptive and misleading"；折线图**不需要**从 0 开始（规则依图表类型而定） | Datawrapper；ECharts Handbook |
| 过度绘制（over-plotting） | "plotting many points on top of each other" 会让子群体"impossible to discern"；大数据集下仅靠透明度"will not be sufficient" | Wilke https://clauswilke.com/dataviz/overlapping-points.html |
| 过度平滑的折线 | 不同样条"can result in widely different smoothing functions for the same data"；100 天均值把一次大幅下跌完全抹平 | Wilke https://clauswilke.com/dataviz/visualizing-trends.html |
| 仪表盘用仪表/表盘 | "a dashboard filled with gadgets that are just plain annoying and a poor use of valuable screen space"；量表刻度常常未标注 | Stephen Few, https://www.perceptualedge.com/articles/Whitepapers/Dashboard_Design.pdf |
| 网格线/坐标轴过重 | chartjunk 包含"over-busy gridlines and excess ticks" | Tufte（经 Few 转引） |

### 5.3 中文大屏实践来源（**均为实践观点，非标准**）

- **Ant Design 可视化规范** [官方指南，可引用]：设计原则"准确 / 有效 / 清晰 / 美"；明确点名 **Data-ink Ratio**——"用最适量的数据-油墨比（Data-ink Ratio）表达对用户最有用的信息"；"不过度修饰"。https://ant.design/docs/spec/visual-cn 、https://ant.design/docs/spec/visualization-page-cn
- **网易"真屏实据丨数据大屏设计实战"** [实践观点]：明确列出反模式——"只是一种图表的堆砌"、"把多个数据塞进一个大屏中…只能显示他们有很多数据"、"重点突出大于面面俱到"；建议"去除不必要的背景填充"、"去掉无意义的颜色变化"、"去掉不必要的外框"、坐标轴与网格线"淡色或隐藏"；饼图"5~7 项"；"尽量减少图例"。https://sq.sf.163.com/blog/article/193470872457953280
- **京东云"11.11 数据可视化大屏设计揭秘"** [实践观点]："3D 模型过于抓人眼球就会失去了制作数据大屏的初衷——展示数据，传达信息"；"让动效也能传达实际信息，而不是影响扰乱阅读"。https://developer.jdcloud.com/article/1318
- **未能核实的中文来源**：AntV 官方规范（antv.antfin.com 全站客户端渲染，抓取为空）、华为官方"数据可视化"设计指南（HTTP 502）、腾讯 CDC、百度 EUX（无可用 URL）。见 §6。

---

## 6. 未能验证 / 存疑项

### 6.1 确实不存在的一手依据（ticket 点名但无标准）

1. **"每屏主色数量上限"没有标准出处。** 已核查 WCAG 2.2、Material、Carbon、Ant Design 全部公开文档。可引用的只有**官方建议**：Datawrapper "≤7"、ColorBrewer 分类色板 ≤12、Carbon 14 色、ECharts 默认 9 色、AntD 12 主色、OpenAI "一主一辅强调色"。
2. **"单屏装饰元素上限"没有任何标准或官方设计系统给出。** 最接近的是 Ant Design 的"总模块数量 5-9 个"与 ECharts 的"折线 ≤4 条 / 仪表指针 ≤3 个"——这些是**图表元素**上限，不是装饰元素上限。
3. **"8pt 网格"不是标准。** Carbon 说 8px mini unit、Ant Design 说基数 8、Material 说 8dp 基线；**没有任何规范文件规定"间距必须是 8 的倍数"**。
4. **"dashboard spaghetti" 不是可引用的术语**，未在任何一手来源中出现。
5. **21:9 超宽屏适配无任何标准或官方规范。**
6. **"安全边距"的绝对像素值没有标准。** T/CIDADS 00011-2022 **未给出**安全边距数值条款（只有"关键信息和较精细元素绕开边框与拼接处"）；SMPTE/EBU/ITU 给的是百分比且属广播语境。**任何以 px 表述的安全边距都是自定义值。**
7. **"页头高度 60–100px""画布内边距 24/32/40px"这类常见说法没有任何可信出处**，本次未找到任何一手来源。见 §6.3。

### 6.2 本次未能取回原文的来源

| 来源 | 状态 |
| --- | --- |
| `m3.material.io` / `m2.material.io` | 全站 JS 渲染，HTTP 抓取为空（含 Wayback）。已用官方 `material-web` token 文件、Google Codelab、`m1.material.io` 静态页替代 |
| Apple HIG Dark Mode | JS 渲染，抓取为空 |
| Ant Design 站点（ant.design/docs/spec/*） | JS 渲染；已改用官方仓库 markdown 源（`raw.githubusercontent.com/ant-design/ant-design/master/docs/spec/*.zh-CN.md`）取得原文 |
| AntV 设计规范（antv.antgroup.com / antv.antfin.com） | 客户端渲染，抓取为空 |
| ISO 9241-303:2008 英文原文 | 正版付费；**已通过出版商预览 PDF（sis.se）取得 §5.5.4 的数值**，并与 ГОСТ Р ИСО 9241-303-2013 交叉核对 |
| ISO 11064 原文（Part 3 / 4 / 6） | **付费墙**；Part 3 / 4 / 6 的条款经**俄文采标文本**（ГОСТ Р ИСО 11064-x）读取，与 ISO 英文版"textually identical"是通行做法但**未经官方确认** |
| ANSI/HFES 100-2007 数值条款 | **付费墙**，未取得；本次使用其 **2026 草案**（可公开下载）作为替代 |
| T/CIDADS 00011-2022 官方原文 | 团体标准无公开免费全文；条款经第三方文档站（renrendoc）转述，标准登记信息经 antpedia 核实 |
| ETSI EG 202 116 | 官方 PDF 403；镜像 PDF 文本流无法解压 |
| SMPTE ST 2046-1 附录 D 的表格数值 | 正文 §5.1 已核实；附录表格因 PDF 编码未能完整提取 |
| ECharts `devicePixelRatio` 官方说明 | 页面 JS 渲染，未取回 |
| 华为官方"数据可视化"设计指南 | HTTP 502 |
| 腾讯 CDC / 百度 EUX 大屏文章 | 无可用 URL |

### 6.3 需要人工确认的存疑点

1. ~~暗色下的 halation 无规范表述~~ → **已找到可引用依据**：FAA/NATS（经 NUREG-0700）"对比度超过 15:1 可能引起视觉不适"、MIL-STD-1472H 的 6:1–10:1、APCA 的 "Dark Mode Maximum Lc −90"。**WCAG 本身不设上限**，所以"上限"只能引工程标准/草案，不能引 WCAG。详见 §4.4.3。
2. **Material 的 "15.8:1" 经复算不能复现**：#FFF 在 #121212 上是 **18.73:1**，在 #232323（02dp 表面）上是 **15.72:1**。引用时不要写成"#121212 上必须 15.8:1"，应理解为对较高 elevation 表面的要求。
3. **Tufte 原著的页码引用**（如 data-ink ratio 在第 93 页）被广泛转述但本次未能在原著中核实。
4. **FT Visual Vocabulary** 常被引用来支持"直接标注优于图例"，但其 README **并未包含该表述**，不要归因于它。
5. **"每屏主色数量"与"装饰元素数量"的具体取值**必须由本规范自定，并明确标注为**自定义阈值**，不能伪装成标准。
6. **拼接屏的缝宽与安全区**只有厂商实践与团体标准（T/CIDADS 给 0.5–3.5mm），**无 ISO/ITU 公开标准**；若要写进规范，需标注为实践/团体标准依据。
7. **"1 英寸 / 10 英尺"与"1 英寸 / 40–50 英尺"两条招牌可读性经验法则互相冲突**，且都不是标准；大屏字号应以 §4.2 的弧分规则或 T/CIDADS 的 1/200 规则为准。
8. **"正文 ≥14px / 标题 ≥24px"这类大屏最小字号说法**只出现在博客，**没有任何 AntV/ECharts/DataV 官方文档如此规定**；官方可引的只有 T/CIDADS 的公式与 §4.2 的弧分推导。
