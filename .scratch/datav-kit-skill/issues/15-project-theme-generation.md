# 项目专属主题的生成与校验

Status: resolved
Type: grilling
Blocked by: —

## Question

06 已定"自定义主题是深度定制的顶层入口"，本票定它的具体形态：

1. skill 是否提供一份主题模板（`.dvk-theme-<name>` CSS 骨架）？包含哪些变量（至少 `--dvk-color-primary/secondary/accent/surface`、`--dvk-glow-soft/strong`、`--dvk-line-width`、`--dvk-motion-duration`）？
2. 生成流程：从用户给的品牌色 / 参考图出发，如何推导出上面这组值？是否需要一套推导规则（主色 → 辅色 → 强调色 → 表面色 → 光效）？
3. **对比度校验怎么落**：自动计算？清单核对？校验对象是哪些组合（文字/背景、图形/背景、装饰线/背景）？
4. 主题如何与 ECharts 主题（10）、原型模板（08）联动？
5. 与库自带 5 套主题的关系：替换还是并存？项目主题可否继承某套主题再覆盖？
6. 主题的命名与文件落点（`skills/datav-kit/assets/themes/`？项目里的哪个路径？）。

**约束（06 已定）**：只声明 `--dvk-*` 变量，不得引入第二套颜色源；必须过对比度红线。
**约束（05 已定）**：屏幕设计令牌（`--dvk-screen-*`）**不属于主题**——主题只管颜色与光效，两者不混。


## Answer

### 1. 主题模板

`assets/themes/theme-template.css` —— 8 个变量 + 注释的骨架，可直接复制。骨架本身就是"只准声明 `--dvk-*`"这条硬约束的物理体现。

### 2. 推导规则（起点，不是终点）

| 变量 | 推导 |
| --- | --- |
| `--dvk-color-primary` | 品牌色；对比度不达标则提亮或降饱和至满足 AA |
| `--dvk-color-secondary` | primary 色相 ±30–40°，或明度 −20% |
| `--dvk-color-accent` | primary 互补色（色相 +180°）或高饱和对比色；**暗色场景必须降饱和** |
| `--dvk-color-surface` | primary 的极暗版本（明度 5–10%）+ alpha 0.72；**不用纯黑** |
| `--dvk-glow-soft` / `-strong` | primary + alpha 0.55 / 0.85，模糊半径 12 / 24px |
| `--dvk-line-width` | 1px |
| `--dvk-motion-duration` | 2200–2600ms |

每个值都要过对比度校验，不达标就调。

### 3. 对比度校验

`assets/tools/contrast-check.js` —— 纯函数、零依赖，输出比值 + PASS/FAIL。

校验对象四组：**文字 / 表面、图形 / 表面、装饰线 / 表面、相邻数据标记之间**。理由：WCAG 明确对比度**不可四舍五入**（4.499:1 ≠ 4.5:1），手工算不可靠。

阈值引用 04：正文 ≥4.5:1、大字 ≥3:1、非文字 ≥3:1；上限 7:1–15:1（建议值）。

### 4. 与库主题、图表、原型模板的关系

- **与库主题并存，不做部分继承**：项目主题是一份**完整的 8 变量声明**，作用域 `.dvk-theme-<project>`。不做"继承某套再覆盖"——那会让人分不清哪些变量来自哪里，调试时最费劲。
- **主题不写任何图表或模板特有代码**：ECharts 通过 10 的令牌桥接契约自动跟随，原型模板通过根容器类自动跟随。
- **落点**：模板放 `assets/themes/theme-template.css`；项目产物落 `design/theme.css`（与 11 的 `design/` 约定一致）。
