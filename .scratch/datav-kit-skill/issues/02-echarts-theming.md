# ECharts 主题化与 datav-kit 令牌映射

Status: resolved
Type: research
Blocked by: —

## Question

为"大屏图表指导"取事实基线：

1. ECharts 主题化的官方机制（`registerTheme` / theme object / `setOption`）——ECharts **不能直接读 CSS 变量**，如何把 `--dvk-color-primary` / `--dvk-color-secondary` / `--dvk-color-accent` / `--dvk-color-surface` / `--dvk-motion-duration` 注入 option？给出可运行的映射写法。
2. 主题切换时图表如何跟随（重新 register + setOption 的正确姿势，避免闪烁与状态丢失）。
3. 容器 resize → 图表尺寸同步的标准做法（`ResizeObserver` vs `window.resize`），以及 `dvk-fit-screen` 的 CSS transform 缩放对 canvas 渲染清晰度的影响与处理（是否要按 DPR 反向补偿）。
4. 无数据 / loading / 加载失败 / 部分数据缺失的标准呈现。
5. 大屏监控场景的图表选型矩阵：时序、占比、排名、分布、地理、关系——各自适用与反模式。
6. 图表与 `dvk-border-box-*` 内容安全区共处时的边距建议。

**产出**：`.scratch/datav-kit-skill/assets/r2-echarts.md`（中文，含可直接复用的最小 option 片段与出处）。

## Answer

事实基线：**echarts 6.1.0 / zrender 6.1.0**（本仓库 docs 依赖实装版本）。关键结论均在真实浏览器引擎（Chrome 152 headless + CDP）实测过，详情与出处见 `assets/r2-echarts.md`。

1. **主题注入**：`init(dom, theme, opts)` 的 `theme` **可直接传主题对象**（源码 `_updateTheme`：字符串才查全局表），所以不需要为每个主题 `registerTheme`。ECharts 官方明确拒绝 CSS 变量支持（[#19743](https://github.com/apache/echarts/issues/19743#issuecomment-2012376099) 维护者原话：建议先 `getComputedStyle(dom).getPropertyValue('--the-css-var')` 再 `setOption`）。推荐模式：`readDatavTokens(host)` 逐令牌 `getComputedStyle().getPropertyValue()` → `createDatavTheme()` 组装主题对象 → `init(el, theme)`。注意三点：① 必须传「离图表最近的带 `.dvk-theme-*` 的元素」作 host；② `getComputedStyle` 会替换 `var()` 但**不会**换算 `rem`（需探针元素）也**不解析** `color-mix()`；③ SSR 下无 `getComputedStyle`，只能用静态主题常量。
2. **运行时切换**：v6 用 `chart.setTheme(themeObject)` —— 实测保留 option（`getOption().series[0].data` 不变）、直接重绘、无需重新 `init`，这是唯一无闪烁路径；但源码上 `_resetOption('recreate')` 会重建组件模型，**交互态（dataZoom 窗口 / legend 选中）会重置**（对无交互大屏可忽略）。v5 只能 `dispose()` + `init()`，且**不 dispose 就 init 会拿回旧实例**（源码 `existInstance` 直接 return，生产版静默）。只 `setOption({color})` 只换调色板，不换坐标轴/文字/tooltip 样式。
3. **尺寸同步**：`ResizeObserver` + `requestAnimationFrame` 节流 + `chart.resize()`（实测通过）。官方只保证「容器变化手动 resize」，`ResizeObserver` 仅是一句 Tip，**没有任何 debounce/throttle 建议**（handbook 全库 0 命中）。`dvk-fit-screen` 的 `transform: scale(k)`：canvas 位图 = 布局尺寸 × DPR，再被 CSS 放大 → k=2 时每视觉像素只有 0.5 个位图像素（实测），**必须用 `devicePixelRatio: dpr × k` 补偿**；而 **`resize()` 改不了 DPR**（实测，6.1.0；上游 v6.2.0 才修），所以 scale 变化要 `dispose()` + 重新 `init`，或直接改用 SVG 渲染器（<1k 点）。命中测试实测**正常**（`offsetX` 会被浏览器映射回本地坐标，鼠标与触摸都对）；只有「拿不到 offsetX」的 `getBoundingClientRect` 回退路径不支持 transform。
4. **数据状态**：加载用 `showLoading('default', {maskColor:'transparent', color/textColor: 主色})` —— 默认 `maskColor` 是 `rgba(255,255,255,0.8)`，深色大屏必须覆盖；空态用 `graphic`（group + text，`replaceMerge:['graphic']` 清除）；失败态与陈旧态官方**无方案**，建议在面板 DOM 层做（可 aria-live、可统一染色）；缺失点用 `null`/`'-'`，`connectNulls` 默认 `false`；`aria.enabled` 默认 **false**。
5. **选型矩阵**：时序 line/area（≤4 条线、大数据用 `sampling`，line 无 `large`）；占比 pie（官方自己劝退小差异比较、类别 ≤5）；排名 bar（Y 轴必须从 0、禁 3D）；分布 scatter/heatmap（heatmap 矩形系必须两条类目轴）；地理 geo/map（v5 起**无内置地图**，需自备 geoJSON 并核对授权）；关系 graph（force 布局 >100 节点官方警告会卡死浏览器）；层级 treemap/sunburst/tree（tree 不支持森林）。性能护栏：>1k 点用 canvas、`progressiveThreshold` 默认 3000、`animationThreshold` 默认 2000。
6. **面板边距**：面板已按 `contentRect` 契约给出 **8–44px**（随面板尺寸变化）安全内边距，图表容器直接 `width/height:100%` 填满 `::part(content)`，**不要再加 DOM padding**。ECharts 侧必须显式覆盖 `grid`（默认 `left/right:'10%'`、`top/bottom:60` 太浪费）：`grid: {left:4, right:8, top:8, bottom:4, outerBoundsMode:'same', outerBoundsContain:'axisLabel'}`（v6 中 `containLabel` 已废弃）。要改边距就覆盖 `--dvk-border-box-<N>-padding`，与 docs 示例一致。

**未证实清单**（12 项，见资产文件 §7）：`setTheme` 重置交互态为源码推断；resize 的 DPR 刷新仅 master/v6.2.0；无官方 debounce 建议；无官方 transform-scale 模糊文档；「dpr × scale」系数无一手来源；移动端触控 + transform 命中无维护者结论；空/错/陈旧态无官方方案。

**产出**：`assets/r2-echarts.md`（中文，含 6 段可直接复用的最小代码，全部标注 📄 官方 / ✅ 实测 / ⚠️ 存疑 / ❓ 未证实）。
