# review — 智慧园区能耗与碳排驾驶舱

> 步骤 ⑥ 产物。退出条件：评审记录 + skill 修订项已列出（否则评审不算完成）。
> **本文件是人工验收入口。** 项目负责人按 `self-check.md` + 实际打开 `../index.html` 评审，逐条给结论。

## 评审依据

| 依据 | 路径 |
| --- | --- |
| 澄清 | `brief.md` |
| 候选原型 | `prototype-t4-energy.html`（选定）、`prototype-t2-energy.html` |
| 选定与偏离登记 | `decision.md` |
| 自检清单（1:1 派生自 `references/design-rules.md`） | `self-check.md` |
| 交付实现 | `../index.html` |

评分规则：红线二值（任一条不过即不合格）；建议值三档（符合 / 已登记偏离 / 未登记偏离）；**不打总分**。

## 评审记录

| 项 | 结论 | 证据 |
| --- | --- | --- |
| 红线 9 条 + 一屏一套主题 | 待项目负责人填写 | `self-check.md` §1–§6 已给出 PASS 证据 |
| 建议值 32 条 | 待项目负责人填写 | 31 符合 / 1 已登记偏离 / 0 未登记 |
| 硬编码值 | 待项目负责人填写 | `self-check.md` §0：0 处未登记硬编码值 |
| 实际打开 `../index.html` | 待项目负责人填写 | 1920×1080 双击可开，0 控制台报错；四态演示控件在画布外 |

**项目负责人结论**：待填写（`通过` / `未通过：<case/path> <item> <evidence>`）。

## 构建期发现的 skill 修订项

| # | 文件 | 问题 | 建议修订 |
| --- | --- | --- | --- |
| R7 | `references/patterns.md` T4 | 区块清单只写「下 P6+P7 面板 ×2（P9/P10）」，没给行数下限；内容稀疏时两块面板会留出大半空白 | 补一句：底部两块面板的行数需能填满 `1fr`（P9 建议 ≥6 行、P10 建议 ≥5 行） |
| R8 | `references/charts.md` §7 / `design-rules.md` 6.6 | 四态契约只写在图表槽语境里；不含图表的屏幕（T4）没有说四态落在哪一层 | 明确：无图表屏幕把四态作用在区块容器上（本例作用在 `main` 上），失败态仍须 `role="alert"` |
| R9 | `references/patterns.md` P14 | P14 只说 hero 56px 每屏一个，没说放大 KPI 卡（T4 的 6 卡条）该用哪一级 | 补一句：T4 放大卡用 `--dvk-screen-font-size-xl`（44px），hero 尺寸留给每屏唯一的那个数 |
| R10 | `references/tokens.md` / `assets/tokens.css` | T4 的 KPI 条是 208px，令牌集只有 104px 的 `--dvk-screen-kpi-height` | 要么加一个 `--dvk-screen-kpi-height-2x`，要么在 tokens.md 写明用 `calc(var(--dvk-screen-kpi-height) * 2)`（本例采用后者） |

## 下一步

项目负责人回复后：

- `通过` → 本案例验收完成，Gate 的 Exit condition 5 取得人工证据。
- `未通过：<case/path> <item> <evidence>` → 按证据修复或回原型重选（硬闸门 3 / 4），并把该条追加到上表。
