# 设计令牌集的定义

Status: resolved
Type: grilling
Blocked by: 01

## Question

定义 skill 新增的设计令牌集：

1. 新增哪些维度的令牌？（候选：间距 8pt 刻度、字阶、层级 z-index、动效预算——还有别的吗？）
2. 具体取值与命名（前缀？如 `--dvk-screen-*`）。
3. 与 `--dvk-*` 主题变量的关系：只读 / 可覆盖 / 桥接？作用域怎么写（`:root` / `.dvk-theme-*` / 宿主元素）？
4. 令牌落在哪：`references/design/tokens.css` 作为参考实现，还是只写成文档？原型模板怎么引？
5. 硬约束：**不得引入第二套颜色源**。

**注意 1**：map 的 Notes 已定"必须支持深度定制"，令牌设计要为此留出口（与 06 对齐）。
**注意 2（01 查证）**：`--dvk-motion-duration` 为 2200–2600ms，与主流 UI 动效刻度差一个数量级。新增的动效预算令牌是**覆盖**它、**并存**（装饰动画 vs 交互动效两档），还是**桥接**？必须与 04 的动效条目给出一致答案。


## Answer

### 1. 五组令牌，前缀 `--dvk-screen-*`

前缀理由：区分"库的令牌"（`--dvk-color-*` 等，主题包提供）与"skill 的屏幕设计令牌"，不污染 `--dvk-` 命名空间。

| 组 | 令牌 |
| --- | --- |
| 间距 | `--dvk-screen-space-{xs,sm,md,lg,xl,2xl,3xl,4xl,5xl}` |
| 字体 | `--dvk-screen-font-family`、`-size-{xs,sm,md,lg,xl}`、`-weight-{regular,medium,bold}`、`-line-height-{tight,base}` |
| 层级 | `--dvk-screen-z-{base,panel,overlay,tooltip}` |
| 动效 | `--dvk-screen-duration-{fast,base,slow}`、`-ease-{standard,decelerate,accelerate}` |
| 布局 | `--dvk-screen-{safe-margin,grid-columns,grid-gutter,header-height,kpi-height,panel-padding}` |

**不设**：圆角令牌（库的装饰语言是硬边 + 描边）、描边宽度令牌（归「ECharts 配置模板规格」）、独立密度令牌（密度是间距与字号的组合结果，单独设层会打架）。

### 2. 取值

| 组 | 值 |
| --- | --- |
| 间距 | `xs 4 / sm 8 / md 12 / lg 16 / xl 24 / 2xl 32 / 3xl 48 / 4xl 64 / 5xl 96` |
| 字号 | `xs 14 / sm 18 / md 24 / lg 32 / xl 44`；hero 数字单独 **56**（属于指标，不占文本层级） |
| 字重 | `regular 400 / medium 500 / bold 600` |
| 行高 | `tight 1.25 / base 1.5` |
| 层级 | `base 0 / panel 10 / overlay 100 / tooltip 1000` |
| 动效时长 | `fast 150ms / base 250ms / slow 300ms`（对应 04 的"交互动效 150–300ms"） |
| 布局 | `safe-margin 48 / grid-columns 12 / grid-gutter 24 / header-height 104 / kpi-height 104 / panel-padding 24`（对应 07） |

5 级字号 + hero 例外，符合 04 的"字阶 3–5 种"。

### 3. 字号必须按项目校准（关键）

按 T/CIDADS 公式 `最小字号 = (视距/200) × (垂直分辨率/屏高)`，**同一个 14px 在大屏与显示器上的物理高度差别极大**：4m×2.25m 的屏在 6m 视距下最小字号只要 14px；55″ 显示器在 3m 视距下要 22px。

规则：

- 默认值按 **"大屏 4m×2.25m、视距 6m"** 标定。
- 项目**必须**用公式校准 `--dvk-screen-font-size-xs`；算出的值大于 14px 时按算出的值上浮。
- **目标屏是显示器 / 笔记本时，整组字号必须上调**。

### 4. 与主题令牌的关系、作用域、落盘

- **颜色只读**：不新增任何颜色令牌，一律引用 `--dvk-color-*`。
- **作用域**：新令牌声明在**大屏根容器 `.dvk-screen`** 上，不用 `:root`，避免污染宿主页面其它部分。
- **落盘**：提供 `assets/tokens.css` 参考实现（可直接复制），文档同步列出全部令牌与取值。
- **优先级**：项目覆盖 > skill 默认值 > 组件 fallback。
