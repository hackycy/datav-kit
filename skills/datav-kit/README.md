# datav-kit skill

用 datav-kit 的 `dvk-*` Web Components 做**数据大屏**的完整工作流 skill：从 brief 澄清、原型选型，
到实现、自检与评审，外加一套可执行的设计规范与知识库。

本文件给人读；给模型读的入口是 [`SKILL.md`](./SKILL.md)。

## 覆盖范围声明

组件可用性**以运行时 `customElements.get(tag)` 检测为准**，下表只作选型前的提示
（详见 [`references/components.md`](./references/components.md)）。

| 状态 | 数量 | 组件 |
| --- | --- | --- |
| 已发布（`@datav-kit/elements@0.0.5`） | 30 | `dvk-border-box-1` … `dvk-border-box-15`、`dvk-decoration-1` … `dvk-decoration-11`、`dvk-count-to`、`dvk-fit-screen`、`dvk-loading-energy`、`dvk-loading-orbit` |
| 仅 `main` 分支 | 5 | `dvk-title-1`、`dvk-title-2`、`dvk-title-3`、`dvk-border-box-16`、`dvk-performance-monitor` |
| 不存在 | — | **`dvk-title-4`**（源码里是空目录，禁止引用） |

`main` 分支的组件不在已发布包里，也不在线上文档站与 `llms.txt` 索引中。要用它们必须走
`references/components.md` §6 的回退源，并标注「来自 main，可能尚未发布」。
`dvk-performance-monitor` 是开发期诊断浮层（FPS + 压力分），不是大屏区块组件。

**不适用范围**：普通后台页面、非 datav-kit 项目。

## 安装

```bash
npx skills add hackycy/datav-kit
```

只想看有哪些 skill、不安装：

```bash
npx skills add hackycy/datav-kit --list
```

> 该命令从仓库默认分支取 skill。如果技能还没合进默认分支，用 `--list` 指定分支：
> `npx skills add hackycy/datav-kit#<branch> --list`；本地目录同样可用：
> `npx skills add /path/to/datav-kit --list`。

## 先看这个

[`assets/minimal-example.html`](./assets/minimal-example.html) —— **双击就能打开**：一个屏 + 3 个面板 +
1 个图表，用来 5 分钟看到效果。它是最小示例，**不替代**四套原型模板。

四套原型在 [`assets/prototypes/`](./assets/prototypes/)：

| # | 版式 | 适用 |
| --- | --- | --- |
| T1 | 三栏运维 | 监控、指挥、值班 |
| T2 | 两栏分析 | 趋势、对比、归因 |
| T3 | 单栏叙事 | 态势总览、汇报 |
| T4 | KPI 主导 | 指标看板、经营驾驶舱 |

七个图表模板在 [`assets/charts/`](./assets/charts/)，每个导出 `createXxx(el, data, tokens)`，
六件套（令牌注入 / option 骨架 / resize / 主题切换 / 四态 / 性能护栏）内置，可整文件照抄。

## 设计取舍摘要

- **颜色只有一个来源**：`--dvk-color-*`（主题包）。不新增第二套颜色源，不另建图表色板。
- **主题只管颜色与光效**：屏幕设计令牌 `--dvk-screen-*` 不属于主题，作用域是 `.dvk-screen`，不用 `:root`。
- **一屏一套主题**：整屏只有一个 `.dvk-theme-*` 类；要强调某区域用强调色，不是第二套主题。
- **内容安全区用组件算出来的 `contentRect`**：不拿内距数值去反推变体；要更多留白，加在**内层 wrapper** 上，
  不是覆盖组件内距。
- **顶栏组件无关**：`customElements.get('dvk-title-1')` 特性检测二选一——可用用 `dvk-title-*`，
  不可用（当前 0.0.5）用 P3 手搭 + `dvk-decoration-9` 装饰轨。
- **面板标题写在默认 slot**：16 个 border-box 都只有默认 slot，没有 `#header` / `#title`。
- **不封装组件、不内置图表库**：图表走 ECharts 模板 + 令牌桥接，不做 datav-kit 图表组件。
- **知识库在线优先**：写 props / events / CSS 变量必须 fetch 详情页；索引缺页或 404 才走 `main` 回退源。

数值阈值与出处见 [`references/design-rules.md`](./references/design-rules.md)；令牌取值见
[`references/tokens.md`](./references/tokens.md) 与 [`assets/tokens.css`](./assets/tokens.css)。

## 给团队的阅读指引

**常驻**（每次都读，自检与实现的判据来源）：

| 文件 | 作用 |
| --- | --- |
| [`SKILL.md`](./SKILL.md) | 路由 + 六步工作流 + 五条硬闸门 + 红线速查 |
| [`references/design-rules.md`](./references/design-rules.md) | 6 组规范条目（档位 + 阈值 + 出处），自检清单 1:1 派生自这里 |
| [`references/patterns.md`](./references/patterns.md) | 19 个组合模式 + P6 选型矩阵（唯一运行时矩阵） |
| [`references/components.md`](./references/components.md) | 可用性清单 + 能力字段 + 取数/回退协议 |
| [`references/tokens.md`](./references/tokens.md) | 五组 `--dvk-screen-*` 令牌文档与校准公式 |
| [`assets/tokens.css`](./assets/tokens.css) | 令牌参考实现 |

**按需**（用到再读）：线上组件详情页、[`references/charts.md`](./references/charts.md)、
[`assets/charts/*.js`](./assets/charts/)、[`assets/prototypes/*.html`](./assets/prototypes/)、
[`assets/themes/theme-template.css`](./assets/themes/theme-template.css)、
[`assets/tools/contrast-check.js`](./assets/tools/contrast-check.js)。

推荐顺序：先读 `SKILL.md` 摸清流程 → 需要选型时读 `patterns.md` → 落组件时读 `components.md` →
配色与字号落到 `tokens.md` / `design-rules.md` → 上图表读 `charts.md` 并照抄 `assets/charts/` 里的模板。

做项目主题时用 `assets/themes/theme-template.css` 起手（八变量完整声明，不做部分继承），
用 `node assets/tools/contrast-check.js` 校验四组对比度（正文 / 图形 / 装饰线 / 相邻数据标记，
不可四舍五入）。

## 发版后 checklist（六项）

库发新版后，按顺序核对——前两类天然跟随运行时，后四类会腐坏：

1. **新增组件**是否要进 `references/components.md`。
2. 有组件**改名 / 改属性**吗（同步 `patterns.md` 里的组件参数）。
3. **主题令牌键名**有变吗（同步 `tokens.md` / `theme-template.css`）。
4. `assets/prototypes/*.html` 是否还跑得起来（双击打开、控制台无报错）。
5. `assets/charts/*.js` 是否还跑得起来（在原型或最小示例里挂一次）。
6. 空目录（如 `title-4`）有没有**变成真组件**（变了就更新覆盖范围声明与 P3 特性检测路径）。
