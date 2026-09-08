# skill 文件树与 SKILL.md 大纲

Status: resolved
Type: grilling
Blocked by: 08, 09, 10, 11

## Question

1. `skills/datav-kit/` 的完整目录树，每个文件的职责（**含 08 的四套原型模板、05 的 `tokens.css`、10 的 `assets/charts/*.js` 与 `references/charts.md`、15 的 `assets/themes/theme-template.css` 与 `assets/tools/contrast-check.js`**）。
2. `SKILL.md` 的章节结构、字数预算、`description` 措辞（决定触发率）——**须容纳 11 的六步流程与五条硬闸门**。
3. 渐进披露层级：什么常驻、什么按需读——**09 已定常驻项：`references/patterns.md`、`references/tokens.md`、`assets/tokens.css`、`references/components.md`；按需项：组件详情页。**
4. 中文 `README.md` 的内容，以及 skill 的**覆盖范围声明**（哪些组件可用、哪些只在 main 分支）。
5. **与库版本的同步机制**（库发新版后，索引 / 模板 / 规范如何跟上）。


## Answer

### 1. 目录树（15 个文件）

```
skills/datav-kit/
├── SKILL.md                        # 路由 + 六步工作流 + 五条硬闸门 + 红线速查
├── README.md                       # 中文，给人读
├── references/
│   ├── design-rules.md             # 04：6 组规范条目（档位 + 阈值 + 出处）
│   ├── patterns.md                 # 09：19 个组合模式（路由主表）
│   ├── components.md               # 09：可用性清单 + 特性检测方法
│   ├── tokens.md                   # 05：令牌文档
│   └── charts.md                   # 10：选型矩阵 + 反模式 + 照抄 vs 调整
└── assets/
    ├── tokens.css                  # 05：令牌参考实现
    ├── charts/                     # 10：7 个 ECharts 模板
    │   ├── line-area.js  bar-rank.js  pie-doughnut.js  scatter.js
    │   └── gauge.js  radar.js  heatmap.js
    ├── prototypes/                 # 08：四套原型骨架
    │   ├── t1-three-column.html    t2-two-column.html
    │   └── t3-single-column.html   t4-kpi-led.html
    ├── minimal-example.html        # 17：最小可运行示例
    ├── themes/theme-template.css   # 15
    └── tools/contrast-check.js     # 15
```

**不单独建 `workflow.md`**——六步流程是 skill 的脊梁，留在 `SKILL.md`。

### 2. SKILL.md

**章节（≤ 250 行）**：

1. 何时用 / 不适用
2. 覆盖范围与前置检查（可用性清单摘要 + `customElements.get()` 特性检测）
3. **六步工作流**（每步的产物与退出条件）
4. **五条硬闸门**
5. brief 七问清单
6. 红线速查（四类）
7. 参考索引（指向 `references/*`）

**`description`**：

> Design and build large-screen data dashboards with datav-kit Web Components (`dvk-*`). Use when the user wants a 数据大屏 / dashboard screen, needs to choose or compose datav-kit elements, or wants dashboard output reviewed against a design spec.

**中文 `README.md`**：覆盖范围声明（已发布 30 / 仅 main 5 / title-4 不存在）、安装命令、设计取舍摘要、给团队的阅读指引。

### 3. 渐进披露

| 层级 | 内容 |
| --- | --- |
| **常驻** | `SKILL.md`、`references/design-rules.md`、`references/patterns.md`、`references/tokens.md`、`references/components.md`、`assets/tokens.css` |
| **按需** | 组件详情页（线上取）、`references/charts.md`、`assets/charts/*.js`、`assets/prototypes/*.html`、`assets/themes/theme-template.css`、`assets/tools/contrast-check.js` |

`design-rules.md` 转常驻：它是自检与实现时的判据来源，按需加载会导致每次自检都要先读一遍，反而更贵。

### 4. 与库版本的同步机制

| 类别 | 内容 | 机制 |
| --- | --- | --- |
| **不易腐坏** | 组件清单、组件详情、可用性判断 | 运行时 `customElements.get()` + 线上取数，天然跟随 |
| **会腐坏** | `assets/prototypes/*.html`、`assets/charts/*.js`、`references/patterns.md` 里的组件参数 | 每次库发版后按 **6 项 checklist** 核对 |

**发版后 checklist 六项**：① 新增组件是否要进 `components.md`；② 有组件改名 / 改属性吗；③ 主题令牌键名有变吗；④ 原型模板是否还跑得起来；⑤ 图表模板是否还跑得起来；⑥ 空目录（如 `title-4`）有没有变成真组件。
