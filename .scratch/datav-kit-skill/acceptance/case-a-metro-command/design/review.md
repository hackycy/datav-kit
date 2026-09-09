# review — 城市轨道交通线网运营指挥大屏

> 步骤 ⑥ 产物。退出条件：评审记录 + skill 修订项已列出（否则评审不算完成）。
> **本文件是人工验收入口。** 项目负责人按 `self-check.md` + 实际打开 `../index.html` 评审，逐条给结论。

## 评审依据

| 依据 | 路径 |
| --- | --- |
| 澄清 | `brief.md` |
| 候选原型 | `prototype-t1-metro.html`（选定）、`prototype-t3-metro.html` |
| 选定与偏离登记 | `decision.md` |
| 自检清单（1:1 派生自 `references/design-rules.md`） | `self-check.md` |
| 交付实现 | `../index.html` |

评分规则：红线二值（任一条不过即不合格）；建议值三档（符合 / 已登记偏离 / 未登记偏离）；**不打总分**。

## 评审记录

| 项 | 结论 | 证据 |
| --- | --- | --- |
| 红线 9 条 + 一屏一套主题 | 待项目负责人填写 | `self-check.md` §1–§6 已给出 PASS 证据 |
| 建议值 32 条 | 待项目负责人填写 | 28 符合 / 4 已登记偏离 / 0 未登记 |
| 硬编码值 | 待项目负责人填写 | `self-check.md` §0：0 处未登记硬编码值 |
| 实际打开 `../index.html` | 待项目负责人填写 | 1920×1080 双击可开，0 控制台报错 |

**项目负责人结论**：待填写（`通过` / `未通过：<case/path> <item> <evidence>`）。

## 构建期发现的 skill 修订项

以下 6 条是构建本案例时发现的 skill 自身问题，逐条回写（评审发现同样按此格式追加）。

| # | 文件 | 问题 | 建议修订 |
| --- | --- | --- | --- |
| R1 | `references/patterns.md` P10 | 名称列写死 120px，中文站名（「人民广场」）会截断 | 标注该列是场景值，按最长名称定宽；给出 120–150px 的参考区间 |
| R2 | `design-rules.md` 2.2 与 `patterns.md` P5 | 2.2 说面板间距 16，P5 说 column-gap 32，而 `assets/prototypes/t1–t4` 实际用 24 | 三者对齐：明确「区块间距（列间）24 / 面板间距（同列内）16」，并修原型 |
| R3 | `references/patterns.md` T1/T3 区块清单 | 区块清单写 P17，但无地理数据时按 P17 的替换项改图表 | 区块清单写成「P17 或图表型主视图」，避免读者以为必须画地图 |
| R4 | `references/components.md` §7 | `dvk-loading-energy` 内置回退色 `#1677ff` / `#8a99ad` 与 `dvk-loading-orbit` / `dvk-decoration-*` 的 `#18f0ff` / `#2b7cff` 不一致 | 统一回退色，或把差异写进能力表 |
| R5 | `assets/prototypes/t3-single-column.html` | 底部节奏条标签与柱体实测重叠约 1px（柱槽下限 56px 超过流式行高给出的 51px） | 把底部变体的柱槽下限降到 52px |
| R6 | `references/charts.md` | 排名类柱状图用窄域轴（`min ≠ 0`）与 `design-rules` 6.4「柱状 y 轴从 0」冲突 | 明确：排名 / 窄域数据允许非 0 起点，但必须直接标注数值；或禁止该形式 |

## 下一步

项目负责人回复后：

- `通过` → 本案例验收完成，Gate 的 Exit condition 5 取得人工证据。
- `未通过：<case/path> <item> <evidence>` → 按证据修复或回原型重选（硬闸门 3 / 4），并把该条追加到上表。
