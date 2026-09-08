# 图表指导与 ECharts 参考实现

Status: resolved
Type: grilling
Blocked by: 02

## Question

1. 模板覆盖哪些图表类型（结合 02 的选型矩阵）？
2. 每个模板包含什么：option 骨架、令牌注入、resize、主题切换响应、loading / 空态 / 错误态、tooltip 与标签规范。
3. 放在 `assets/templates/` 还是 `references/`？以什么形式给（`.js` 文件 / `.md` 代码块）？
4. 哪些是"照抄即可"、哪些必须按数据调整——写清楚，避免 agent 无脑复制。
   **04 已定异常态四态**（无数据 / loading / 加载失败 / 数据陈旧），模板必须覆盖这四态；实时数据优先"陈旧但可见"。
5. 与 `dvk-border-box-*` 内容安全区的边距约定。
6. **描边宽度与图表内字号**归本票定（05 不设这两组令牌）；字号引用 `--dvk-screen-font-size-*`，描边参考 OpenAI 的 0.5–1 / 1.5–2.25 / 2.5–3 三档。

**已验证的技术约束（02 实测，不得再猜）**：

- `echarts.init(dom, themeObject, opts)` **可直接传主题对象**，不需要 `registerTheme`（字符串分支才查 `themeStorage`）。
- 令牌读取：`getComputedStyle(host).getPropertyValue('--dvk-color-primary').trim()`，`host` 取**最近的 `.dvk-theme-*` 载体**（不一定是 `documentElement`）。
- ECharts **没有 alpha 语法**，需自备 `withAlpha()`；`--dvk-glow-soft` 解析成 `shadowBlur`/`shadowColor` 时注意计算后的 box-shadow 偏移会被归一成无单位 `0`。
- **不要把 `--dvk-motion-duration` 映射进图表**（2200–2600ms 会让图表爬）。
- 主题切换用 `chart.setTheme(obj)`（v6），**不要 dispose 后重新 init**。
- **07 已定：图表优先 SVG renderer**（缩放不模糊）；Canvas 只留给大数据量。本仓库 `echarts@6.1.0` 的 **`resize()` 不会刷新 DPR**（master/v6.2.0 才修）；`transform: scale(2)` 下每个视觉像素只剩 0.5 个后备像素。
- 命中测试在祖先缩放**正常**（mouse 与 touch 的 `offsetX` 映射正确）——不必额外补偿。
- 官方**没有** resize 防抖/节流指南，需自定。


## Answer

**票名说明**：本票覆盖两件事——**与图表库无关的图表指导**（进设计规范）与 **ECharts 参考实现**（服务原型、可选）。ECharts **不是项目实现的强制路径**。

### 1. 分层：规范 vs 参考实现

| 层 | 内容 | 身份 |
| --- | --- | --- |
| **库无关** | 选型矩阵、颜色角色、四态、内边距、字号、描边分档、反模式、性能护栏 | **设计规范**（对任何图表库成立） |
| **ECharts 特有** | 令牌注入、`setTheme`、resize、DPR 补偿、`grid` 覆盖 | **参考实现**（原型用 + 可选默认） |

### 2. 七个模板

`line-area`（时序）/ `bar-rank`（横向条形排名）/ `pie-doughnut`（占比）/ `scatter`（分布相关性）/ `gauge`（单值进度）/ `radar`（多维画像）/ `heatmap`（二维密度）。

**不给 `map` 模板**：ECharts v5 起移除内置 geoJSON，地图需自备数据 + `registerMap` + 自行核对授权，依赖过重，改为文档写接入步骤。`themeRiver` / `candlestick` / `tree` 系列同理。

### 3. 落点与形态

- `assets/charts/*.js` —— 可直接复制运行的模板，每个导出 `createXxx(el, data, tokens)`。
- `references/charts.md` —— 选型矩阵 + 反模式 + "照抄 vs 调整"说明。

### 4. 每个模板内置六件套

| 件 | 内容 | 照抄？ |
| --- | --- | --- |
| 令牌注入 | `getComputedStyle` 读 `--dvk-*` → 主题对象；`init(dom, themeObject)` 直接传，不用 `registerTheme` | **照抄** |
| option 骨架 | 含显式 `grid` 覆盖（默认 `10%`/`60` 太浪费）+ `outerBoundsMode: 'same'` | 骨架照抄 |
| resize | `ResizeObserver` + `rAF` 节流 + `chart.resize()` | **照抄** |
| 主题切换 | `chart.setTheme(obj)`（v6，不重新 init） | **照抄** |
| 四态 | loading（**必须覆盖默认浅色遮罩**）/ 无数据（`graphic`）/ 失败 / 陈旧 | **照抄** |
| 性能护栏 | `sampling: 'lttb'`、`large`、`animationThreshold` | **照抄** |

**必须按数据调整**：series 数据、轴类目、颜色角色分配、**图表类型本身的选择**——模板显式标注，防止无脑复制。

### 5. 内边距、最小尺寸、字号、描边

- **图表容器填满 `::part(content)`，不加 DOM 内边距**（面板已按 `contentRect` 算出 8–44px 且随尺寸等比变化）。要改就覆盖 `--dvk-border-box-N-padding`，不给图表加 margin。
- **`grid` 必须显式覆盖**：`left/right: '10%'` + `top/bottom: 60` 在大屏小面板里吃掉大半绘图区。
- **最小尺寸护栏**：内容区 < **160×100** → 降级为 `dvk-count-to` KPI 或迷你 sparkline（无轴无标签）。
- **字号**（引用 05）：轴标签 / 图例 = `--dvk-screen-font-size-xs`(14)；数据标注 / tooltip = `-sm`(18)。**面板标题不进图表**，走 DOM 的 `.panel-heading`。
- **描边**：非数据 0.5–1px / 数据线 1.5–2.25px / 强调线 2.5–3px。

### 6. 令牌桥接契约（库无关）

非 ECharts 项目按这张表把 `--dvk-*` 映射到任意图表库：

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

有了这张表，颜色角色账本、对比度红线、描边分档才能在非 ECharts 项目里被验证。
