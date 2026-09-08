# R2 · ECharts 主题化与 datav-kit 令牌映射

> 对应票据：`.scratch/datav-kit-skill/issues/02-echarts-theming.md`
> 事实基线版本：**echarts 6.1.0 / zrender 6.1.0**。本仓库 `docs/package.json` 声明 `echarts: ^6.1.0`（`pnpm-workspace.yaml` catalog `docs`），实装 `node_modules/.pnpm/echarts@6.1.0`、`zrender@6.1.0`。
> 阅读约定：
> - **✅ 实测** = 在真实浏览器引擎里跑过（Chrome 152.0.7977.76 `--headless=new`，CDP 驱动，echarts 6.1.0 dist，`window.devicePixelRatio = 1`）。
> - **📄 官方** = 官方文档原文 / 官方源码。
> - **⚠️ 存疑** = 文档与实装不一致，或只能从源码推断。
> - **❓ 未证实** = 没有找到一手来源。

---

## 0. 结论速览

| 问题 | 结论 |
| --- | --- |
| 主题化机制 | `echarts.init(dom, theme, opts)` 的 `theme` **可以直接传主题对象**，不必先 `registerTheme`；`registerTheme(name, obj)` 只做「注册到全局表」；v6 新增实例方法 `chart.setTheme(theme, opts)`。📄 |
| 能否读 CSS 变量 | **不能**。官方明确拒绝该特性，并给出官方绕行建议：先 `getComputedStyle(dom).getPropertyValue('--x')` 取真实值再 `setOption`。📄 |
| 运行时切换 | v6：`chart.setTheme(themeObject)` —— 保留 option、直接重绘，不需要重新 `init`（**实测**）；v5 只能 `dispose()` + `init()`。⚠️ 官方文档另有一条 caveat：`setTheme` 后不支持多次 merge 的 `setOption`。 |
| 容器 resize | `ResizeObserver` + `requestAnimationFrame` 节流 + `chart.resize()`（**实测**通过）。官方只保证「容器变化要手动 `resize()`」，`ResizeObserver` 只在 handbook 里作为一句 Tip 出现，且**没有任何官方 debounce/throttle 建议**。📄 |
| `dvk-fit-screen` 的 `transform: scale()` | canvas 位图按布局尺寸 × DPR 生成，再被 CSS 放大 → 模糊（**实测** k=2 时每个视觉像素只有 0.5 个位图像素）；用 `init` 的 `devicePixelRatio: dpr × scale` 补偿（**实测**有效）；**`resize()` 改不了 DPR**（**实测**），scale 变化必须 `dispose()` + 重新 `init`，或改用 SVG 渲染器。 |
| 命中测试 | **实测**：祖先 `transform: scale(2)` 下，鼠标与触摸事件经 zrender 拿到的 `zrX` 都是**正确的本地坐标**（`offsetX` 会被浏览器映射回未变换的本地空间）。只有「拿不到 `offsetX` 的回退路径」不支持 CSS transform，源码里明确写了。⚠️ |
| 数据状态 | 加载用 `showLoading/hideLoading`（**必须覆盖默认的浅色遮罩**，否则在深色大屏上是白色蒙版）；空态用 `graphic` 元素（**实测**可渲染、可用 `replaceMerge` 清除）；缺失点用 `null` / `'-'`；无障碍用 `aria.enabled`（默认 `false`）。📄 |
| 面板边距 | 图表填满 `::part(content)`（面板已经算好安全内边距 8–44px，随面板尺寸变化）；ECharts `grid` 默认 `left/right: '10%'`、`top/bottom: 60` 在大屏小面板里太大，**必须显式覆盖**，并优先用 v6 的 `outerBoundsMode: 'same'` 替代已废弃的 `containLabel`。📄 |

---

## 1. 主题化机制：官方 API 全貌

### 1.1 三种机制

**（1）`registerTheme(name, theme)`** —— 📄 [`api.echarts.md#registerTheme`](https://echarts.apache.org/en/llms-documents/api-parts/api.echarts.md)

```
(themeName: string, theme: Object)
```

> "Registers a theme, should be specified when initialize the chart instance."

源码就是一个全局表赋值，**不做校验、不做克隆**：

```js
// node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/lib/core/echarts.js:2231
export function registerTheme(name, theme) {
  themeStorage[name] = theme;
}
```

⚠️ 文档页把 `registerTheme` 标注为 `Since v6.0.0`，这是**文档错误**：该函数在 v4.9.0 / v5.6.0 的源码里就已存在（[4.9.0 `src/echarts.js`](https://raw.githubusercontent.com/apache/echarts/4.9.0/src/echarts.js)、[5.6.0 `src/core/echarts.ts`](https://raw.githubusercontent.com/apache/echarts/5.6.0/src/core/echarts.ts)）。真正 v6 新增的是**实例方法 `setTheme`**。

**（2）`init(dom, theme, opts)` 直接传主题对象** —— 📄 [`api.echarts.md#init`](https://echarts.apache.org/en/llms-documents/api-parts/api.echarts.md)

> "`theme` — Theme to be applied. This can be a configuring object of a theme, or a theme name registered through `echarts.registerTheme`."

源码分派逻辑（`lib/core/echarts.js` `_updateTheme`）：

```js
ECharts.prototype._updateTheme = function (theme) {
  if (isString(theme)) { theme = themeStorage[theme]; }   // 字符串 → 查表
  if (theme) { theme = clone(theme); ...; this._theme = theme; }  // 对象 → 直接用
};
```

**这一条是本方案的关键**：既然对象可以直接传，就完全不需要「为了动态主题而 `registerTheme` 一堆名字」——**每次令牌变化重新构造一个对象即可**。

**（3）`chart.setTheme(theme, opts)`（v6 新增）** —— 📄 [`api.echartsInstance.md#setTheme`](https://echarts.apache.org/en/llms-documents/api-parts/api.echartsInstance.md)

```
(theme: string | Object, opts?: { silent?: boolean }) => void
```

> "Sets the theme for the chart instance."
> "`theme`: When `string`: Represents the `themeName` registered via `echarts.registerTheme`. When `Object`: An anonymous theme object that will be directly applied."

v6 特性页原文：📄 [`v6-feature`](https://echarts.apache.org/handbook/en/basics/release-note/v6-feature/)

> "In previous versions, changing a chart's theme required disposing of the chart instance and re-initializing, which could negatively impact user experience due to repeated animations. In the new version, we implemented dynamic theme switching."

### 1.2 主题对象能控制什么

⚠️ **没有正式 schema**：TS 类型是 `type ThemeOption = Dictionary<any>`（[`src/util/types.ts`](https://github.com/apache/echarts/blob/master/src/util/types.ts)）。事实标准是「内置主题文件 + 合并代码」。可用的主类型键：

- 全局键：`color`（调色板数组）、`backgroundColor`、`textStyle`、`darkMode`、`gradientColor`。
- **组件主类型**（`title`/`legend`/`tooltip`/`toolbox`/`grid`/`xAxis`/`yAxis`/`dataZoom`/`visualMap`/`geo`/`aria`/`graphic`/…）：由 `ComponentModel.mergeDefaultAndTheme` 用 `themeModel.get(this.mainType)` 合并（[`src/model/Component.ts`](https://github.com/apache/echarts/blob/master/src/model/Component.ts)）。
- **系列子类型**（`line`/`bar`/`pie`/`scatter`/`map`/`graph`/`treemap`/…）：由 `SeriesModel` 用 `themeModel.get(this.subType)` 合并（[`src/model/Series.ts`](https://github.com/apache/echarts/blob/master/src/model/Series.ts)）。
- **坐标轴**：键名是 `<axisType>Axis`，即 `categoryAxis` / `valueAxis` / `timeAxis` / `logAxis`（[`src/coord/axisModelCreator.ts`](https://github.com/apache/echarts/blob/master/src/coord/axisModelCreator.ts)）。

参考实现：仓库内置主题文件 `echarts/theme/*.js`（`dark.js` 最完整，`vintage.js` 最简：`{ color: [...], backgroundColor: '#fef8ef', graph: { color: [...] } }`）。

⚠️ **陷阱**：`https://echarts.apache.org/en/theme-builder/themes/*.json`（如 `default.json`）是**主题编辑器内部模型**（扁平键 `titleColor`、`datazoomHandleColor`、`axes[]`…），**不是**运行期主题对象的形状。别照抄。

### 1.3 为什么 ECharts 读不了 CSS 变量

📄 维护者原话（[apache/echarts#19743](https://github.com/apache/echarts/issues/19743#issuecomment-2012376099)，2024-03-21，plainheart）：

> "This feature won't be added since Canvas doesn't recognize the CSS variables currently. It's suggested to use `window.getComputedStyle(DOM).getPropertyValue('--the-css-var')` to get real color values before calling `setOption`."

📄 更早的拒绝（[#16044](https://github.com/apache/echarts/issues/16044#issuecomment-966830034)，pissang）：

> "I'm afraid we won't add this feature in the near future. We are trying to keep our API design independent from platforms so developers can have consistent experience cross different platforms."

📄 同一 thread 里关于**高亮色**的补充（[#19743](https://github.com/apache/echarts/issues/19743#issuecomment-2014844956)）：

> "the highlighted color is calculated from the color in normal state, if the color is a css variable, ECharts will not be able to parse it and get the highlighted color. To circumvent this, you may try to set the emphasis color explicitly."

源码层面：`apache/echarts` + `ecomfe/zrender` 的 `src/` 全库 grep `var(--` 命中 **0** 次；`getComputedStyle` 只出现在 zrender 的 canvas 尺寸计算（读 `width/height/padding`）和 tooltip 的 DOM 容器定位里，**没有任何颜色/主题解析路径**。

### 1.4 令牌映射表

datav-kit 只有 7 个令牌（`packages/themes/src/*.css`，5 个主题文件都用同一组键名，作用域 `:root, .dvk-theme-<name>`）：

| datav-kit 令牌 | cyber-blue 计算值 | ECharts 落点 | 说明 |
| --- | --- | --- | --- |
| `--dvk-color-primary` | `#18f0ff` | `color[0]`、`textStyle.color`、`title.textStyle.color`、`categoryAxis.axisLabel.color` | 主色 |
| `--dvk-color-secondary` | `#2b7cff` | `color[1]` | 副色 |
| `--dvk-color-accent` | `#f3ff5c` | `color[2]`、`itemStyle` 强调色 | 点缀色 |
| `--dvk-color-surface` | `rgba(4, 15, 28, 0.72)` | `tooltip.backgroundColor`（可选 `legend.backgroundColor`） | **不要**映射到 `backgroundColor`：面板本身已有底色，图表再铺一层会变浑浊 |
| `--dvk-glow-soft` | `0 0 12px rgba(24, 240, 255, 0.55)` | `lineStyle.shadowBlur / shadowColor`、`itemStyle.shadowBlur / shadowColor` | 需要从 box-shadow 串里取「模糊半径 + 颜色」 |
| `--dvk-line-width` | `1px` | 轴线 / 分割线 `width`（系列线宽建议单独定 2） | 1px 作系列线太细 |
| `--dvk-motion-duration` | `2400ms` | **不映射** | 它是装饰动画周期（2200–2600ms），拿来当 ECharts 过渡时长会让图表卡成幻灯片；图表动画建议固定 300–600ms |

**透明度派生**：主题里大量需要「主色 × 35%」这类值。ECharts 没有 alpha 语法，必须在 JS 里算。仓库可直接用 `echarts.color.modifyAlpha()`（📄 `echarts` 全量入口导出 `color`，见 `lib/export/api.js:60` → `zrender/lib/tool/color.js`），但它依赖 zrender 且 `parse()` 只认 hex/rgb/rgba/命名色；下面给一个零依赖版本。

### 1.5 可运行的最小实现（✅ 实测通过）

```js
// dvk-echarts.mjs — map datav-kit CSS variables into an ECharts theme object
const TOKEN_FALLBACKS = {
  primary:   ['--dvk-color-primary',   '#18f0ff'],
  secondary: ['--dvk-color-secondary', '#2b7cff'],
  accent:    ['--dvk-color-accent',    '#f3ff5c'],
  surface:   ['--dvk-color-surface',   'rgba(4, 15, 28, 0.72)'],
  glowSoft:  ['--dvk-glow-soft',       '0 0 12px rgba(24, 240, 255, 0.55)'],
  lineWidth: ['--dvk-line-width',      '1px'],
}

export function readDatavTokens(host = document.documentElement) {
  const css = getComputedStyle(host)
  const out = {}
  for (const [key, [name, fallback]] of Object.entries(TOKEN_FALLBACKS))
    out[key] = css.getPropertyValue(name).trim() || fallback
  return out
}

export function withAlpha(color, a) {
  const rgb = color.match(/^rgba?\(([^)]+)\)$/i)
  if (rgb) {
    const [r, g, b] = rgb[1].split(',').map(Number)
    return `rgba(${r}, ${g}, ${b}, ${a})`
  }
  let hex = color.replace('#', '')
  if (hex.length === 3) hex = hex.split('').map(c => c + c).join('')
  const n = Number.parseInt(hex, 16)
  return `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, ${a})`
}

export function parseGlow(value) {
  // computed box-shadow normalises lengths: "0 0 12px rgba(24,240,255,0.55)"
  const m = value.match(/^\s*(-?[\d.]+)(?:px)?\s+(-?[\d.]+)(?:px)?\s+([\d.]+)px\s+(.+?)\s*$/)
  return m ? { blur: Number(m[3]), color: m[4] } : { blur: 0, color: 'transparent' }
}

export function createDatavTheme(host = document.documentElement) {
  const t = readDatavTokens(host)
  const glow = parseGlow(t.glowSoft)
  const lineWidth = Number.parseFloat(t.lineWidth) || 1
  return {
    color: [t.primary, t.secondary, t.accent],
    backgroundColor: 'transparent',
    textStyle: { color: withAlpha(t.primary, 0.85) },
    title: {
      textStyle: { color: t.primary },
      subtextStyle: { color: withAlpha(t.primary, 0.55) },
    },
    legend: { textStyle: { color: withAlpha(t.primary, 0.75) } },
    tooltip: {
      backgroundColor: t.surface,
      borderColor: withAlpha(t.primary, 0.35),
      textStyle: { color: t.primary },
    },
    categoryAxis: {
      axisLine: { lineStyle: { color: withAlpha(t.primary, 0.35), width: lineWidth } },
      axisLabel: { color: withAlpha(t.primary, 0.75) },
      splitLine: { lineStyle: { color: withAlpha(t.primary, 0.12), width: lineWidth } },
    },
    valueAxis: {
      axisLine: { show: false },
      axisLabel: { color: withAlpha(t.primary, 0.75) },
      splitLine: { lineStyle: { color: withAlpha(t.primary, 0.12), width: lineWidth } },
    },
    line: { lineStyle: { width: 2, shadowBlur: glow.blur, shadowColor: glow.color } },
    bar: { itemStyle: { shadowBlur: glow.blur, shadowColor: glow.color } },
  }
}
```

用法（ESM，无框架）：

```js
import * as echarts from 'echarts'
import { createDatavTheme } from './dvk-echarts.mjs'

const chart = echarts.init(el, createDatavTheme(), { renderer: 'canvas' })
chart.setOption(option)
```

**实测结果**（`page3.html`，Chrome 152，真实 `getComputedStyle`）：

```
tokens      = { primary:'#18f0ff', secondary:'#2b7cff', accent:'#f3ff5c',
                surface:'rgba(4,15,28,0.72)', glowSoft:'0 0 12px rgba(24,240,255,0.55)',
                lineWidth:'1px', motion:'2400ms' }
withAlpha('#18f0ff', 0.35)              = 'rgba(24, 240, 255, 0.35)'
withAlpha('rgba(4,15,28,0.72)', 0.5)    = 'rgba(4, 15, 28, 0.5)'
parseGlow('0 0 12px rgba(24,240,255,0.55)') = { blur: 12, color: 'rgba(24, 240, 255, 0.55)' }
SVG 输出含主色 / 含 shadow 滤镜      = true / true
```

### 1.6 取值语义与坑（✅ 实测）

| 写法 | `getComputedStyle().getPropertyValue('--x')` 返回 | 能不能喂给 ECharts |
| --- | --- | --- |
| `--x: #18f0ff` | `"#18f0ff"` | ✅ |
| `--x: var(--brand)`（`--brand: #18f0ff`） | `"#18f0ff"`（**var() 会被替换**） | ✅ |
| `--x: 1.5rem` | `"1.5rem"`（**不会换算成 px**） | ❌ 需自行换算 |
| `--x: color-mix(in srgb, #18f0ff 50%, transparent)` | 原样返回，**不求值** | ❌ zrender 的 `parse()` 不认 |

所以：
1. **只用「自包含」的令牌值**（hex / rgb / rgba / px）。若主题被重定义成 `oklch()`、`color-mix()`，注入前必须先归一化。
2. **相对长度要探针换算**（`rem`/`em`/`%`）：

```js
const probe = document.createElement('div')
probe.style.cssText = 'position:absolute;visibility:hidden;pointer-events:none'
document.body.appendChild(probe)
function toPx(tokenValue) {
  probe.style.width = tokenValue
  const px = Number.parseFloat(getComputedStyle(probe).width)
  return Number.isFinite(px) ? px : 0
}
// 实测：--spacing: 1.5rem → toPx('1.5rem') === 24
```
3. **读哪个元素很关键**。`--dvk-*` 定义在 `:root, .dvk-theme-<name>` 上（`packages/themes/src/cyber-blue.css` 等）。如果主题是挂在某个 `<section class="dvk-theme-cyber-blue">` 上的（`docs/guide/theming.md` 的推荐用法），那么 `getComputedStyle(document.documentElement)` 读到的可能是**另一个**主题的值 —— 必须把图表容器（或它最近的带主题类的祖先）作为 `host` 传进去。`readDatavTokens(host)` 的第一个参数就是干这个的。

### 1.7 SSR / 未挂载

📄 [`api.echarts.md#init`](https://echarts.apache.org/en/llms-documents/api-parts/api.echarts.md) 的 **Note**：

> "If DIV is hidden, ECharts initialization tends to fail due to the lack of width and height information. In this case, you can explicitly specify `style.width` and `style.height` of DIV, or manually call `echartsInstance.resize` after showing DIV."

📄 开发版运行期警告（源码 `src/core/echarts.ts`，仅在 `__DEV__` 且**只 warn 不 throw**）：

> "Can't get DOM width or height. Please check dom.clientWidth and dom.clientHeight. They should not be 0. For example, you may need to call this in the callback of window.onload."

📄 SSR 是**官方支持**的（[handbook: Server-Side Rendering](https://echarts.apache.org/handbook/en/how-to/cross-platform/server/)，v5.3.0 引入），官方示例：

```js
const chart = echarts.init(null, null, {
  renderer: 'svg',   // must use SVG
  ssr: true,
  width: 400,        // width/height are mandatory in SSR
  height: 300,
})
chart.setOption({ /* ... */ })
const svgStr = chart.renderToSVGString()
```

📄 约束：`ssr` "Only available in SVG rendering mode"；"The height and width must be set via `opts.width` and `opts.height` in the server side rendering."

**对 datav-kit 的落地结论**（三条，按优先级）：

1. **浏览器端**：图表容器必须已经有非 0 尺寸再 `init`。若图表在 `<details>`/`display:none` 的 tab 里，要么先给容器显式 `width/height`，要么在显示后再 `init`（或 `chart.resize()`）。**不要**依赖 ECharts 自己等布局。
2. **主题注入在 SSR 下不可用**：`getComputedStyle` 需要真实 DOM + 已加载的 CSS。SSR 时要么传一份**静态主题对象常量**（与 `packages/themes/src/*.css` 同源的 JSON），要么只做结构、把颜色留给客户端 hydration。⚠️ 官方 SSR 文档只讲渲染管线，**没有**任何关于「SSR 下如何取 CSS 变量」的指引。
3. **Web Components 场景**：`dvk-*` 元素是 Shadow DOM，`getComputedStyle(shadowChild)` 能读到继承的 `--dvk-*`（自定义属性可继承），但**图表容器本身**通常由使用方放在 light DOM 里。若图表要放进 shadow root 内部，把 shadow root 的 host 传给 `readDatavTokens()` 更稳妥。

---

## 2. 运行时主题切换

### 2.1 v6 正确姿势（✅ 实测）

```js
import { createDatavTheme } from './dvk-echarts.mjs'

// 主题变了（用户切皮肤 / 系统主题变化 / .dvk-theme-* 类变化）
chart.setTheme(createDatavTheme(hostElement))
```

**实测**（`page3.html`）：`setTheme({...theme, color: ['#ff4fd8','#7c5cff','#31ffe6']})` 之后

- 新配色立即生效（SVG 输出含 `#ff4fd8`）；
- **option 完整保留**：`chart.getOption().series[0].data === [12,30,22,41]`；
- 没有 `dispose()`、没有重新 `init`、没有二次 `setOption`。

源码路径（`lib/core/echarts.js:513`）：`setTheme` → `_updateTheme` → `ecModel.setTheme(this._theme)` → `GlobalModel.setTheme` → `this._theme = new Model(theme); this._resetOption('recreate', null)`。`_resetOption('recreate')` 用 `optionManager.mountOption(true)` 拿回**原始 option 备份**重新 `initBase`，因此：

- ✅ 用户通过 `setOption` 写进去的 option（数据、系列、样式）会保留；
- ❌ **运行期交互状态会丢**：`initBase` 里 `ecModel.option = {}` 会重建所有组件模型，所以用户拖过的 `dataZoom` 窗口、点掉的 `legend` 选中项、tooltip 状态都会回到 option 里的初始值。⚠️（源码推断；官方文档没有正面描述这点。）

> 对「大屏监控」这类**默认无交互**的场景，这个代价可以忽略；如果屏幕上有 dataZoom/legend 交互，切主题后要么接受重置，要么把当前状态从 `chart.getOption()` 里读出来再合回新 option。

⚠️ **官方 caveat**（📄 `api.echartsInstance.md#setTheme`）：

> "In the current implementation, calling `setOption` multiple times in merge mode is not supported when using `setTheme`."

即：不要「先 `setOption(A)` 再 `setOption(B)`，然后 `setTheme`」，否则 A 会被丢掉；切主题后用 `setOption(option, { notMerge: true })` 重建。

### 2.2 v5 / 兜底姿势

v5 没有 `setTheme`，官方给的路线是 dispose + init。📄 [`chart-size` handbook](https://echarts.apache.org/handbook/en/concepts/chart-size/)：

> "call `echartsInstance.dispose` to dispose the instance after the container was disposed, and call `echarts.init` to initialize after the container was added again. … to avoid memory leaks."

📄 `dispose()`：**"Disposes instance. Once disposed, the instance can not be used again."**（`clear()` 只是「removes all components and series」，实例仍可用）。

⚠️ **重复 `init` 同一个 DOM 的坑**（📄 源码 `lib/core/echarts.js:2143`）：

```js
var existInstance = getInstanceByDom(dom);
if (existInstance) {
  warn('There is a chart instance already initialized on the dom.');
  return existInstance;      // ← 直接返回旧实例
}
```

也就是说：**不 `dispose()` 就重新 `init`，拿到的是旧实例，新主题/新 DPR 一律不生效**（只有 dev 版会 `console.warn`，生产版静默）。要换主题/DPR，必须先 `echarts.dispose(dom)` 或 `chart.dispose()`。

### 2.3 不重新 init，只换颜色行不行？

📄 `setOption` 的 `color`：**"The color list of palette. If no color is set in series, the colors would be adopted sequentially and circularly from this list…"**（[option 文档](https://echarts.apache.org/en/llms-documents/option.md)）

- 只 `setOption({ color: [...] })`：**只改系列调色板**，坐标轴/文字/tooltip/图例颜色**不变**。
- 主题对象包含的是整套组件默认值（§1.2），所以「换主题」≠「换调色板」。
- 结论：**能 `setTheme` 就用 `setTheme`**；不能用（v5）时，最小方案是把主题里那些组件默认值**也写进 option**，然后 `setOption(option, { notMerge: false })` 逐次覆盖 —— 但这会退化成「自己维护两套配色」，不如直接 dispose + init。

### 2.4 防闪烁清单

1. **不要在 `dispose()` 和 `init()` 之间让容器空白**：先 `init` 到同一个容器、`setOption` 后再 `dispose` 旧的？—— 不行，同一 DOM 只能有一个实例。可行做法：切主题时**只调 `setTheme`（v6）**，这是唯一无闪烁路径（不销毁实例、不重跑入场动画）。
2. **关掉切换动画**：`setTheme(theme, { silent: true })` 可阻止事件；若要彻底避免重绘动画，把 `animation` 在切换瞬间设小。
3. **CSS 变量变化本身不会触发重绘**：`getComputedStyle` 读的是快照，切 `.dvk-theme-*` 类之后**必须主动调 `setTheme` / 重新构造主题对象**，ECharts 不会自己感知。

---

## 3. 容器 resize → 图表尺寸同步

### 3.1 官方立场

📄 [`chart-size` handbook](https://echarts.apache.org/handbook/en/concepts/chart-size/)：

> "Resizes chart, which should be called manually when container size changes."（📄 `api.echartsInstance.md#resize`）

官方推荐的监听写法就是 `window.resize`：

```js
var myChart = echarts.init(document.getElementById('main'));
window.addEventListener('resize', function() { myChart.resize(); });
```

紧接着一句 **Tip**（全文唯一的 `ResizeObserver` 提及，**没有代码示例**）：

> "Sometimes we may adjust the container size by JS/CSS, but this doesn't change the page size so that the `resize` event won't be triggered. You can try the [`ResizeObserver`](https://developer.mozilla.org/en-US/docs/Web/API/ResizeObserver) API to cover this scenario."

⚠️ **没有任何官方 debounce/throttle 建议**：对 `apache/echarts-handbook` 全库 grep `debounce|throttle` → 0 命中；`echarts-doc` 里的命中全部属于 `dataZoom.throttle` / `axisPointer.throttle` / `brush.throttle*`，与 resize 无关。ECharts 内部的 `throttle` 工具只用于 `_throttledZrFlush`，**未导出**，不是公开 API。

### 3.2 推荐做法（✅ 实测）

`dvk-fit-screen` 自己已经用了 `ResizeController`（`packages/core/src/index.ts:188`，基于 `ResizeObserver` 观察 host 并回调 `contentRect`），整个 datav-kit 的布局层就是 ResizeObserver 驱动的 —— 图表跟随这个约定即可：

```js
export function mountChart(host, option) {
  const chart = echarts.init(host, createDatavTheme(host), { renderer: 'canvas' })
  chart.setOption(option)

  let frame = 0
  const sync = () => { frame = 0; chart.resize() }
  const ro = new ResizeObserver(() => {
    if (frame) return                 // 同一帧内多次触发只处理一次
    frame = requestAnimationFrame(sync)
  })
  ro.observe(host)

  return {
    chart,
    dispose() { ro.disconnect(); cancelAnimationFrame(frame); chart.dispose() },
  }
}
```

**实测**：容器 `400×200` → 改成 `800×300` 后，`chart.getWidth()/getHeight()` = `800/300`，canvas 位图 = `800×300`。

要点：
- **rAF 节流优于固定 ms 的 debounce**：`ResizeObserver` 在拖拽窗口时每帧都会回调，用 rAF 合并到「下一帧只 resize 一次」，既不会丢最后一次，也不会在一帧内重复 `resize()`。`resize()` 内部会重排并重绘（`updateMethods.update`，`resize` 的默认动画 `duration: 0`，📄 `ResizeOpts.animation` — "the default `duration` is 0, that is, no transition animation is applied"）。
- **`ResizeObserver` 回调里不要直接读 `chart.getWidth()` 再决定**——直接 `resize()` 更便宜。
- **别忘了 `disconnect()`**：`dvk-*` 元素是 Web Components，图表宿主被移除时要同步销毁，否则 observer 和 canvas 都会泄漏。
- **不要用 `window.resize` 单打**：`dvk-fit-screen` 的缩放、面板栅格变化、侧边栏折叠都**不触发** `window.resize`（官方 Tip 说的正是这件事）。
- **也不要两个都加**：`ResizeObserver` 已经覆盖窗口变化（窗口变化必然导致容器变化）。

### 3.3 `dvk-fit-screen` 的 `transform: scale()` 到底影响什么

`dvk-fit-screen` 的实现（`packages/elements/src/fit-screen/element.ts`）：内层 `.canvas` 固定为设计尺寸（默认 `1920×1080`），外层用

```js
const transform = `translate(${offsetX}px, ${offsetY}px) scale(${scaleX}, ${scaleY})`
```

把它缩放铺满视口/host；`scaleX = viewportWidth / designWidth`，`mode="contain"` 时取 `min(scaleX, scaleY)`。同时把 `--dvk-scale` / `--dvk-scale-x` / `--dvk-scale-y` 写到 host 上，并派发 `dvk-resize`，detail 为 `{ width, height, dpr, scale, scaleX, scaleY, offsetX, offsetY }`（📄 `docs/components/other/fit-screen.md`）。

#### （a）清晰度：**会模糊，必须补偿**（✅ 实测）

机制：ECharts/zrender 的 canvas 位图尺寸 = **布局尺寸 × DPR**，CSS 尺寸 = 布局尺寸（📄 `zrender/lib/canvas/Painter.js:135` `rootCanvas.width = width * this.dpr;`、`lib/canvas/Layer.js` `dom.width = width * dpr; domStyle.width = width + 'px'`）。而布局尺寸来自 `clientWidth` / `getComputedStyle().width`（📄 `zrender/lib/canvas/helper.js#getSize`），**完全不受祖先 transform 影响**。

实测（`.fit { transform: scale(2) }` 包裹 400×200 的图表容器，`dpr = 1`）：

```
布局尺寸 clientWidth×clientHeight = 400 × 200
canvas 位图属性                  = 400 × 200
canvas CSS 尺寸                  = 400px × 200px
getBoundingClientRect().width    = 800   ← 视觉尺寸
每视觉像素的位图像素数           = 400 / 800 = 0.5
```

即 k=2 时分辨率被腰斩，文字和细线会明显发虚。

**补偿方式**：`init` 的 `devicePixelRatio` 就是干这个的（📄 "Ratio of one physical pixel to the size of one device independent pixels"）。实测：

```
devicePixelRatio: 1  → canvas 位图 400×200，CSS 400×200
devicePixelRatio: 2  → canvas 位图 800×400，CSS 400×200
devicePixelRatio: 4  → canvas 位图 1600×800，CSS 400×200
```

```js
// inside a dvk-fit-screen: compensate the ancestor CSS scale
const scale = Number.parseFloat(
  getComputedStyle(fitScreenEl).getPropertyValue('--dvk-scale')
) || 1

const chart = echarts.init(el, createDatavTheme(el), {
  renderer: 'canvas',
  devicePixelRatio: (window.devicePixelRatio || 1) * scale,
})
```

> 📄 官方 issue 里维护者给的也是同一招：pissang 在 [#4292](https://github.com/apache/echarts/issues/4292#issuecomment-258735835) 回答「图表放大后会变得模糊，有 API 来调整 dpi 吗？」时答 **"可以设置更大的 devicePixelRatio"**；社区在 [#5899](https://github.com/apache/echarts/issues/5899#issuecomment-548243024) 明确说 `transform:scale(x,y)` 放大导致的模糊「就是这样解决的」。
> ⚠️ 但**没有任何一手来源**把「dpr × scale」这个系数写下来；它是我从「位图 = 布局 × dpr，视觉 = 布局 × scale」推出来的，实测有效。

#### （b）**`resize()` 改不了 DPR**（✅ 实测，这条最容易踩）

```
init({devicePixelRatio: 1}) → resize() → canvas 位图仍是 400×200（dpr 没有重读）
```

📄 源码：`Painter` 只在构造时 `this.dpr = opts.devicePixelRatio || devicePixelRatio`；`resize()` 不接受 dpr 参数（`zrender/lib/canvas/Painter.js:648`）。`ResizeOpts` 里**没有** `devicePixelRatio` 字段（`types/dist/echarts.d.ts` 的 `ResizeOpts`）。
⚠️ 上游已在 master 修复（[apache/echarts#21489](https://github.com/apache/echarts/pull/21489) + [zrender#1149](https://github.com/ecomfe/zrender/pull/1149)，文档 PR 标注 `Since v6.2.0`），但 **6.1.0 尚未包含**。

**因此：scale 变化时必须 `dispose()` + 重新 `init()`**（记得 `echarts.dispose(dom)`，否则会拿回旧实例，见 §2.2）。

#### （c）三种可选策略

| 策略 | 做法 | 适用 | 代价 |
| --- | --- | --- | --- |
| **A. SVG 渲染器（推荐给中小数据量）** | `init(el, theme, { renderer: 'svg' })`，完全不碰 DPR | 图表点多在千级以内；需要跨 scale 清晰 | 📄 官方："For larger amounts of data (>1k is an experience value), canvas renderer is always recommended."；SVG "won't be blurry when zooming in" |
| **B. canvas + `dpr × scale`** | 见上面的 snippet；scale 变化时 `dispose()` + 重新 `init()` | 大数据量、必须 canvas | 每次窗口缩放都要重建实例；scale 变化频繁时开销明显 |
| **C. 不补偿** | 直接用 `window.devicePixelRatio` | 大屏常年固定分辨率、scale≈1 | 一旦 scale>1 就发虚 |

**补充约束**：`mode="fill"` 时 `scaleX ≠ scaleY`，单一 `devicePixelRatio` **无法同时补偿两个方向**。图表场景请用 `contain` 或 `cover`（`dvk-fit-screen` 的 `--dvk-scale` 取的是 `min(scaleX, scaleY)`，也只是折中值）。

#### （d）命中测试：**实测没问题**（但回退路径有问题）

zrender 取指针坐标的主路径是 `offsetX/offsetY`（📄 `zrender/lib/core/event.js#clientToLocal`，注释写明 "CSS transform (2D & 3D) is supported"）；只有在 `offsetX == null` 时才走 `calculateZrXY()` → `getBoundingClientRect()` 回退。

实测（祖先 `transform: scale(2)`，画布 400×200，视觉中心在 `clientX = 400`）：

```
鼠标 mousemove   → offsetX = 200, offsetY = 100   ✅ 正确（= 视觉中心映射回本地坐标）
触摸 pointerdown → offsetX = 200, offsetY = 100   ✅ 正确（pointerType: 'touch'）
zrender 收到     → zrX = 200, zrByTouch = true    ✅ 命中正确
```

原因：Chromium 下 zrender 走 **PointerEvent**（📄 `HandlerProxy.js`：`if (env.pointerEventsSupported)` 就只挂 pointer 监听），而 `PointerEvent` 继承 `MouseEvent`，**带 `offsetX`**，且浏览器会把它映射回目标的未变换本地空间。

⚠️ 反例（源码明确写了）：`calculateZrXY()` 对 canvas 分支是

```js
if (isCanvasEl(el)) {
  var box = el.getBoundingClientRect();
  out.zrX = ex - box.left;   // ← 视觉像素，没有除以 scale
  out.zrY = ey - box.top;
  return;
}
```
📄 同文件注释："Original approach, which do not support CSS transform. marker can not be located in a canvas container"。这条路径只在**拿不到 offsetX**时命中（历史 TouchEvent-only 浏览器、以及全局事件 `normalizeGlobalEvent`）。相关的移动端错位 issue [#6083](https://github.com/apache/echarts/issues/6083)、[#9434](https://github.com/apache/echarts/issues/9434) 均被 stale bot 自动关闭，**没有维护者结论**。❓

**结论**：Chromium 内核的大屏/一体机（datav-kit 的主要目标环境）**不需要**为命中测试做额外补偿；但如果目标包含旧版 iOS Safari，请实测触控。

---

## 4. 数据状态的标准呈现

### 4.1 加载中：`showLoading` / `hideLoading`

📄 [`api.echartsInstance.md#showLoading`](https://echarts.apache.org/en/llms-documents/api-parts/api.echartsInstance.md)

```
(type?: string, opts?: Object)
```
> "Shows loading animation. You can call this interface manually before data is loaded, and call hideLoading to hide loading animation after data is loaded."
> "`type` — Optional; type of loading animation; **only `'default'` is supported by far**."

⚠️ **文档默认值已过时**。文档写 `color: '#c23531'` / `textColor: '#000'`，但 6.1.0 实装的默认值来自设计令牌（`lib/loading/default.js:53`）：

```js
zrUtil.defaults(opts, {
  text: 'loading',
  textColor: tokens.color.primary,      // = color.neutral80
  fontSize: 12,
  fontWeight: 'normal', fontStyle: 'normal', fontFamily: 'sans-serif',
  maskColor: 'rgba(255,255,255,0.8)',   // ← 浅色遮罩
  showSpinner: true,
  color: tokens.color.theme[0],         // = '#5070dd'
  spinnerRadius: 10,
  lineWidth: 5,
  zlevel: 0,
})
```

**深色大屏必须覆盖 `maskColor` / `textColor` / `color`**，否则会出现一块半透明白色蒙版（`rgba(255,255,255,0.8)`）。

```js
export function showLoading(chart, host) {
  const t = readDatavTokens(host)
  chart.showLoading('default', {
    text: '加载中',
    color: t.primary,                          // spinner
    textColor: withAlpha(t.primary, 0.85),
    maskColor: 'transparent',                  // let the panel background show through
    fontSize: 13,
    spinnerRadius: 10,
    lineWidth: 3,
  })
}

export function hideLoading(chart) { chart.hideLoading() }
```

**实测**：`showLoading('default', {...})` 后 `renderToSVGString()` 含 `加载中`；`hideLoading()` 后不含。✅

📄 自定义 loading 的官方途径：`echarts.registerLoading(name, creator)`（源码 `src/core/echarts.ts` 导出，`registerLoading('default', loadingDefault)`），但**未出现在官方 API 参考里**；官方 handbook 推荐的是用 `graphic` + 关键帧动画自己画（[v5.3.0 release note "Custom Loading Animations"](https://echarts.apache.org/handbook/en/basics/release-note/5-3-0)，官方示例 [graphic-loading](https://echarts.apache.org/examples/en/editor.html?c=graphic-loading)）。datav-kit 自己已经有 `dvk-loading-energy` / `dvk-loading-orbit` 两个 Web Component（`packages/elements/src/loading-*`），**在大屏里优先用它们做 DOM 层 loading**，比 canvas 内的 spinner 更容易和主题、层级、无障碍对齐。

### 4.2 无数据：`graphic`

⚠️ **官方只有一个内置空态，且只属于饼图**：`series-pie.showEmptyCircle`（默认 `true`，v5.2.0+）与 `emptyCircleStyle`（📄 [5.2.0 release note "Pie chart style for empty data"](https://echarts.apache.org/handbook/en/basics/release-note/5-2-0)：*"if there was no data in the pie chart, the screen might be completely blank. Because there was no visual element, users may wonder if there was a bug."*）。
**除此之外，ECharts 官方没有任何「无数据」的推荐实现**（对 handbook 68 个英文页 + option 文档全量检索 `no data` / `empty data`，只命中饼图占位圈与折线空值）。❓ 用 `graphic` 画空态是社区惯例，不是官方规定。

可用的官方积木：`graphic` 组件（📄 [option.graphic](https://echarts.apache.org/en/llms-documents/option-parts/option.graphic.md)）：`elements` 支持 `image / text / circle / sector / ring / polygon / polyline / rect / line / bezierCurve / arc / compoundPath / group`，`group` 是唯一能带 `children` 的类型。

```js
export function showEmpty(chart, host, message = '暂无数据') {
  const t = readDatavTokens(host)
  chart.setOption({
    graphic: {
      type: 'group',
      left: 'center',
      top: 'middle',
      silent: true,
      children: [
        {
          type: 'circle',
          shape: { cx: 0, cy: -16, r: 9 },
          style: { fill: 'none', stroke: withAlpha(t.primary, 0.35), lineWidth: 1 },
        },
        {
          type: 'text',
          style: {
            text: message,
            x: 0, y: 14,
            textAlign: 'center',
            fill: withAlpha(t.primary, 0.6),
            font: '13px sans-serif',
          },
        },
      ],
    },
  })
}

export function clearEmpty(chart) {
  chart.setOption({ graphic: [] }, { replaceMerge: ['graphic'] })
}
```

**实测**：空态文本进入渲染输出；`setOption({ graphic: [] }, { replaceMerge: ['graphic'] })` 之后文本消失。✅

要点：
- 用 `left: 'center' / top: 'middle'`（📄 `title.left`/`top` 支持 `'center'`/`'middle'` 与百分比；`graphic` 的 `left/right/top/bottom` 同理）。
- 清除必须用 `replaceMerge: ['graphic']`，普通 merge 只会**追加**图形。
- 空态文本要 `silent: true`，避免它拦截鼠标事件。
- 空态与「全是 0」要区分：`data: []` 与 `data: [0, 0, 0]` 是两种语义，后者应照常画图。

### 4.3 加载失败

⚠️ ECharts **没有**任何「加载失败」的 API 或文档。可行做法（非官方）：
- 复用 §4.2 的 `graphic` 空态，换文案（如「数据获取失败，重试中」）并配一个可点的重试按钮（DOM 层更合适）；
- 或者在**面板 DOM 层**渲染错误态（`dvk-border-box-*` 的 `::part(content)` 里放一个 `<div role="alert">`），图表保持清空（`chart.clear()`，📄 "removes all components and series"）。
- **建议 datav-kit 侧统一在 DOM 层做「空 / 错 / 加载」三态**，图表只管「有数据」的那一帧。理由：DOM 态可以被 `aria-live` 播报、可以被 CSS 变量统一染色、不受 canvas 分辨率影响。

### 4.4 部分 / 陈旧数据

📄 **没有「stale」或「partial」的官方概念**（全量检索无命中）。官方提供的相关原语只有：

- **缺失点**：`'-'` / `null` / `undefined` / `NaN` 表示「数据项不存在」，📄 `series-line.data`："…can be used to describe that a data item does not exist (ps：not exist does not means its value is 0)"；折线默认在缺失点**断开**，`connectNulls: false`（默认）→ `true` 会跨过空洞连线（📄 `series-line.connectNulls`）。
- **标注**：`markLine`（"Use a line in the chart to illustrate."）、`markArea`（"Used to mark an area in chart. For example, mark a time interval."）—— 官方定位是**注释**，不是「标记数据过期」。
- **视觉编码**：`visualMap`（把值映射到颜色/透明度）——可用于表达「置信度低」，但官方没有 stale 语义。
- 每个数据项的 `itemStyle.opacity` 是普通样式项，不是状态 API。

**建议的 datav-kit 约定**（非官方，供 skill 定调）：陈旧数据用「降透明度 + 虚线 + 角标」三者之一，且**在图表外用 DOM 标注**（如面板标题旁的 `已过期 3 分钟` 徽标），图表内只用 `null` 断开 + `markArea` 标出「无数据时段」。这样语义在 DOM 层可被读屏软件获取。

### 4.5 无障碍

📄 [`option.aria`](https://echarts.apache.org/en/llms-documents/option-parts/option.aria.md)：

- `aria.enabled` **默认 `false`**（⚠️ 注意：不是 `true`）——"Whether or not aria is turned on. If not, the `label` or `decal` effect is not applied."
- `aria.label.enabled` 默认 `true`（仅在 `aria.enabled: true` 后有意义），会生成 `aria-label`。
- `aria.label.description` 可自定义；`aria.label.general.withTitle` 默认 `'This is a chart about "{title}".'`
- `aria.decal.show` 默认 `false`；开启后给系列加贴图纹理，帮助**不依赖颜色**区分数据（`line`/`radar`/`boxplot` 需要配合 `areaStyle` 才生效）。
- ⚠️ handbook 的 aria 页**已过时**（仍在讲废弃的 `aria.show`；源码注释 `// aria.show is deprecated and should use aria.enabled instead`）。
- ⚠️ v5 起 `aria` 组件**不再默认引入**，按需打包时要 `echarts.use(AriaComponent)`（📄 [v5 upgrade guide](https://echarts.apache.org/handbook/en/basics/release-note/v5-upgrade-guide)）。

大屏场景建议：`aria: { enabled: true }` 至少给读屏留一条文本路径；但**不要把关键信息只放在 aria 里**（大屏是远距离观看，不是屏幕阅读器场景）。

---

## 5. 大屏监控图表选型矩阵

> 说明：ECharts 官方的「图表规范」散文页（`best-practices/specification/*`）**未发布到网站**（直接访问 404），只存在于 [`apache/echarts-handbook` 仓库](https://github.com/apache/echarts-handbook/tree/master/contents/en/best-practices/specification)。下表把「官方 option 文档原文」与「官方仓库规范页原文」分开标注。

| 场景 | 首选 | 适用 | 反模式（含出处） |
| --- | --- | --- | --- |
| **时序**（指标随时间变化） | `line` / `area` | 📄 "used to show the trend of data changing… When `areaStyle` is set, area chart will be drawn."（[series-line](https://echarts.apache.org/en/llms-documents/option-parts/option.series-line.md)）<br>📄 规范页："basically used to show the phase trend over time." | ⚠️ "**Do not draw more than 4 lines in a chart.** … lines are entangled together without obvious contrast that makes the whole chart confusing"；⚠️ "avoid deliberately distorting the trend… the height of the item be two-thirds of the height of the y-axis"（[line/basic-line.md](https://github.com/apache/echarts-handbook/blob/master/contents/en/best-practices/specification/line/basic-line.md)）<br>⚠️ 大数据量：`sampling: 'lttb'` 默认**关闭**（"Defaults to be turned off, indicating that all the data points will be drawn"）；`series-line` **没有** `large` / `progressive`（那两个只在 bar/scatter/candlestick 等文档里） |
| **占比**（构成） | `pie` / `doughnut` | 📄 "mainly used for showing proportion of different categories. Each arc length represents the proportion of data quantity." | ⚠️ 官方原文就劝退：**"If you just to present the numerical differences of various categories, the bar graph chart is more suggested. Because compared to tiny length difference, people is less sensitive to the minor radian difference."**（[series-pie](https://echarts.apache.org/en/llms-documents/option-parts/option.series-pie.md)）<br>⚠️ 规范页："**We suggest to controlling the number of categories under five.** … you should try a bar chart or stacked bar chart as an alternative."；"3D pie chart distorted the ratio between each sector … not recommended"<br>可用护栏：`avoidLabelOverlap`（默认 `true`）、`minAngle`、`percentPrecision`（默认 `2`）、`radius: [0,'75%']` 做环图 |
| **排名**（离散比较） | `bar`（横向条形更佳） | 📄 "shows different data through the height of a bar" | ⚠️ 规范页："**Data on Y-axis should be started from 0**, to reflect the value appropriately. If the y-axis is incomplete, it will mislead the user"；"Avoid using too many colors."；"A reasonable width should be not less than twice the gap between the bars."；"We don't recommend using a 3D bar chart"<br>大数据量：`large: true`（bar 默认 `false`，`largeThreshold` 默认 **400**；scatter 默认 `2000`；candlestick 默认 `true`/`600`）——但 📄 "when the optimization enabled, the style of single data item can't be customized any more" |
| **分布 / 相关性** | `scatter`（+`visualMap` 做气泡） | 📄 "could be used to present the relation between x and y. If data have multiple dimensions… becomes a bubble chart" | ⚠️ 规范页："If no correlation was shown in the scatter chart, then the scatter chart is not the best choice."；"it cannot strongly prove there exist causality"；"It is meaningless to draw a chart with very little and unrelated values."<br>`large: true` 有同样的「不能再自定义单项样式」限制 |
| **分布（二维密度）** | `heatmap` | 📄 "**must be used along with `visualMap` component**… Rectangular coordinate must have two categories to use it." | ⚠️ 强约束：矩形坐标系下必须两条**类目轴**；否则只能用 `geo`/`calendar` 坐标系。大屏里常被误用成「随便一个二维表」 |
| **地理** | `geo` / `map` | 📄 "Map is mainly used in the visualization of geographic area data, which can be used with `visualMap` component" | ⚠️ **v5 起移除了内置 geoJSON**（📄 [v5 upgrade guide "Built-in GeoJSON Removed"](https://echarts.apache.org/handbook/en/basics/release-note/v5-upgrade-guide)："These geoJSON files were always sourced from third parties."）——必须自备并 `registerMap`；📄 地图数据来源与授权见 [FAQ](https://echarts.apache.org/en/faq.html)（指向 `github.com/echarts-maps`，第三方，**需自行核对授权**）；📄 按需打包时 `registerMap` 必须先引入 `MapChart` 或 `GeoComponent`（v5.3.0+） |
| **关系** | `graph` | 📄 "Graph is a diagram to represent nodes and the links connecting nodes." | ⚠️ `layout: 'force'` 的官方警告："**It is not recommended to be closed on browser when there are a lot of node data (>100) as the layout process will cause browser to hang.**"（`force.layoutAnimation`）；`force.friction` "is still an **experimental option**"。大屏里力导布局每帧抖动 = 视觉噪音 + CPU 占用，建议 `layout: 'none'` 手工定坐标或 `'circular'` |
| **单值进度** | `gauge` | 📄 规范页："suitable for displaying single progress or measurement standard under quantitative conditions" | ⚠️ "**it is not suitable for carpeting different variables or trends**"；"**do not include more than 3 pointers in one dashboard**" |
| **多维画像** | `radar` | 📄 "mainly used to show multi-variable data, such as the analysis of a football player's varied attributes" | ⚠️ "**If there are more than 5 categories to be evaluated, both the outline and color block will be too confusing to read.**"；"**Because the radial distance is hard to judge, it is still difficult to read the specific value although there are grid lines. We recommend you use a line graph if you need to compare specific values.**" |
| **层级** | `treemap` / `sunburst` / `tree` | 📄 treemap："primarily highlights the important nodes at all hierarchies in 『Tree』with area"；sunburst："show the partial-overall relationship as Pie charts, and also level relation as Treemap charts" | ⚠️ `tree`："**Forests are not currently supported directly in a single series**"；`sunburst` 默认开启下钻（不需要时用 `nodeClick` 关闭）；`treemap` 的 `leafDepth` 默认 `null`（= 关闭下钻） |
| **流向/主题演变** | `themeRiver` | 📄 "mainly used to present the changes of an event or theme during a period… The width of river branches encode the value" | 大屏里易读性差（宽度即数值，起点不共享），慎用 |
| **金融 K 线** | `candlestick` | 📄 "a style of financial chart used to describe price movements" | ⚠️ 颜色语义有地区差异：📄 "Different countries or regions have different implications for the colors… By default, we use **red** to represent an increase and **green** to represent a decrease."——在中国大屏场景恰好是反的，务必显式设置 |

### 5.1 性能护栏（官方数字）

| 机制 | 官方说法 |
| --- | --- |
| 渲染器选择 | 📄 "**For larger amounts of data (>1k is an experience value), canvas renderer is always recommended.**"（[canvas-vs-svg](https://echarts.apache.org/handbook/en/best-practices/canvas-vs-svg/)） |
| `progressive` / `progressiveThreshold` | 📄 "When data amount is from thousand to more than 10 million… 'progressive rendering'… processes and renders data chunk by chunk… By default, progressive is auto-enabled when data amount is bigger than `progressiveThreshold`"（默认 `3000`） |
| `animationThreshold` | 📄 "ECharts is usually capable of rendering thousands of graphs in real time (our default value is also given as 2000)"（[transition 文档](https://echarts.apache.org/handbook/en/how-to/animation/transition)） |
| `sampling` | 📄 "The downsampling strategy used when the data size is much larger than pixel size… Defaults to be turned off"，`'lttb'` "will keep the trends and extremas" |
| bar `large` | 📄 v5.3.0 note："In the cases of a large amount of data (**> 2k**), we support bar charts to speed up rendering" |

⚠️ 注意 `series-line` **没有** `large`/`progressive` 文档项；折线的性能手段是 `sampling` + `dataZoom`。

---

## 6. 图表在 `dvk-border-box-*` 里的内边距建议

### 6.1 面板已经提供了多少内边距

契约（📄 `docs/reference/architecture-contracts.md` "Decorative Container Content Areas"）：每个边框容器用 SVG 坐标系的 `viewBox` + `contentRect` 定义安全区，再按比例映射成 CSS padding：

```txt
top    = (contentRect.y - viewBox.y) / viewBox.height * hostHeight
right  = (viewBox.right - contentRect.right) / viewBox.width * hostWidth
bottom = (viewBox.bottom - contentRect.bottom) / viewBox.height * hostHeight
left   = (contentRect.x - viewBox.x) / viewBox.width * hostWidth
```

优先级：`--dvk-border-box-N-padding` > `--dvk-border-box-padding` > 计算出的安全区（`packages/elements/src/border-box-content-padding.ts`）。

实测各容器的实际内边距（按上面公式代入，`minBlock/minInline` 为源码里的下限）：

| 容器 | 常量 | 480×320 面板上的内边距 | 640×360 上的内边距 |
| --- | --- | --- | --- |
| `dvk-border-box-1` | `contentRect` 固定 8px 内缩，`minBlock/minInline: 8` | 8 / 8 / 8 / 8 | 8 / 8 / 8 / 8 |
| `dvk-border-box-10/15` | `contentSafeInset`，`min: 10` | 10 / 10 / 10 / 10 | 10 / 10 / 10 / 10 |
| `dvk-border-box-14/16` | `contentSafeInset`，`min: 12` | 12 / 12 / 12 / 12 | 12 / 12 / 12 / 12 |
| `dvk-border-box-13` | `max(35 × moduleScale, 16)`，`moduleScale = min(w/1788, h/901)` | ≈16 / 16 / 16 / 16 | ≈16 / 16 / 16 / 16 |
| `dvk-border-box-2` | `viewBox {48,48,1504,804}` / `contentRect {158,145,1284,610}` | 38.6 / 35.1 / 38.6 / 35.1 | 43.4 / 46.8 / 43.4 / 46.8 |
| `dvk-border-box-5` | `viewBox {112,56,1448,804}` / `contentRect {174,122,1330,690}` | 26.3 / 20.6 / 26.3 / 20.6 | 29.5 / 27.4 / 29.5 / 27.4 |
| `dvk-border-box-11` | `viewBox {0,0,1200,640}` / `contentRect {74,78,1050,484}` | 39.0 / 29.6 / 39.0 / 29.6 | 43.9 / 39.5 / 43.9 / 39.5 |
| `dvk-border-box-12` | `viewBox {0,0,1672,941}` / `contentRect {77,84,1518,793}` | 28.6 / 22.1 / 28.6 / 22.1 | 32.1 / 29.5 / 32.1 / 29.5 |

**结论**：面板自身已经给了 8–44px 的呼吸空间，且**随面板尺寸等比变化**。所以：

> **图表容器直接填满 `::part(content)`，不要再加 DOM 内边距。**

```html
<dvk-border-box-11 style="display:block;height:100%">
  <div id="chart" style="width:100%;height:100%"></div>
</dvk-border-box-11>
```

`docs/.vitepress/theme/components/AviationCommandScreen.vue` 里就是这么做的（`.product-panel { width:100%; height:100%; }` + 面板内容区 `display:grid; grid-template-rows: auto minmax(0,1fr); overflow:hidden`），只是它用 SVG 手绘 + DOM 列表替代了图表。

### 6.2 图表的「内边距」= ECharts 的 `grid`

⚠️ ECharts 的默认值在大屏小面板里**非常浪费**：📄 `grid.left/right` 默认 `'10%'`，`grid.top/bottom` 默认 `60`。一个内容区 340×200 的图表，左右各吃掉 34px、上下各 60px，绘图区只剩 272×80。

**推荐写法**（v6，✅ 实测渲染正常）：

```js
{
  grid: {
    left: 4, right: 8, top: 8, bottom: 4,
    outerBoundsMode: 'same',          // v6: replaces containLabel
    outerBoundsContain: 'axisLabel',  // keep axis labels inside the box
  },
  xAxis: { type: 'category', data: [...] },
  yAxis: { type: 'value' },
  series: [{ type: 'line', data: [...] }],
}
```

- 📄 `containLabel` **自 v6.0.0 起废弃**："Deprecated since `v6.0.0`. See grid.outerBoundsMode."；官方等价式：`grid.containLabel: true` ≡ `grid: { outerBoundsMode: 'same', outerBoundsContain: 'axisLabel' }`（如需完全保持旧效果可引入 `LegacyGridContainLabel` feature）。
- 📄 官方还提示：**大多数情况下不必显式设置** `outerBoundsMode/outerBounds/outerBoundsContain/containLabel`，因为默认策略已能防止轴标签溢出画布（`outerBoundsMode` 默认 `'auto'`）。但**默认的 `left/right: '10%'` + `top/bottom: 60` 仍然生效**，所以在大屏里显式给 px 值是有意义的。
- **有图例时**：把图例放到面板标题行（DOM），或 `legend: { top: 0, right: 0, itemWidth: 10, itemHeight: 6, textStyle: {...} }` 并把 `grid.top` 提到 20–28。
- **无坐标轴时**（`pie`/`gauge`/`radar`）：不用 `grid`，改用 `center: ['50%','50%']` + `radius: '68%'`（饼图默认 `[0,'75%']`），让圆环与面板描边之间保留面板 padding 的间距。
- **标题不要塞进图表**：仓库约定是面板里放 `.panel-heading`（`AviationCommandScreen.vue`：`p` + `h3` + 右上角 `span` 徽标），图表只负责数据区。这样标题能用 CSS 变量、能被读屏、不占 canvas 像素。

### 6.3 想改内边距怎么办

按契约，**覆盖 CSS 变量**而不是给图表加 margin：

```css
.aviation-border-panel {
  --dvk-border-box-13-padding: 24px 26px;   /* docs 示例用的就是这个 */
}
```

`docs/.vitepress/theme/components/AviationCommandScreen.vue` 里正是这么写的（`.aviation-border-panel { --dvk-border-box-13-padding: 24px 26px; }`）。可用层级：`--dvk-border-box-<N>-padding` → `--dvk-border-box-padding` → 自动安全区。

### 6.4 最小尺寸护栏

面板 content 区小于约 `120×80` 时，坐标轴刻度+标签会吃掉大半绘图区。datav-kit 侧建议：
- 内容区 `width < 160` 或 `height < 100` 时，降级为 `dvk-count-to` KPI 或迷你 sparkline（无轴、无标签）；
- 用 `ResizeController` 已有的尺寸回调做判断，不要等图表画出来再发现。

---

## 7. 未证实 / 需注意

| # | 事项 | 状态 |
| --- | --- | --- |
| 1 | `registerTheme` 文档标注 `Since v6.0.0` | ⚠️ **文档错误**，v4.9.0/v5.6.0 已存在 |
| 2 | `showLoading` 默认 `color: '#c23531'` / `textColor: '#000'` | ⚠️ **文档过时**，6.1.0 实装取 `tokens.color.theme[0]` / `tokens.color.primary` |
| 3 | `resize()` 刷新 DPR | ⚠️ 仅 master / v6.2.0；**6.1.0 不支持**（实测 + 源码） |
| 4 | `setTheme` 会重置 dataZoom / legend 选中态 | ⚠️ 源码推断（`initBase` 清空 `ecModel.option`），官方文档无正面描述 |
| 5 | 官方 resize 的 debounce/throttle 建议 | ❓ **不存在**（handbook 全库 grep 0 命中） |
| 6 | 祖先 `transform: scale` 导致模糊的官方文档 | ❓ **不存在**；只有 issue 里的维护者/社区回复 |
| 7 | 「dpr × scale」补偿系数 | ⚠️ 无一手来源，本文由机制推导 + 实测验证 |
| 8 | 移动端触控 + 祖先 transform 的命中测试 | ❓ issue #6083/#9434 被 stale bot 关闭，无维护者结论；Chromium 下实测正常 |
| 9 | 空态 / 失败态 / 陈旧数据的官方方案 | ❓ **不存在**（除饼图 `showEmptyCircle`）；本文给的是社区惯例 + 官方积木组合 |
| 10 | `ellipse` 出现在 `graphic` 类型列表 | ⚠️ 官方文档列表里**没有**（源码 `registerShape('ellipse', …)` 有） |
| 11 | handbook aria 页 | ⚠️ **过时**（用废弃的 `aria.show`） |
| 12 | ECharts 官方「图表规范」散文页 | ⚠️ **未发布**（网站 404），只能引 GitHub 仓库 |

---

## 8. 参考来源

**仓库内**
- `packages/themes/src/{cyber-blue,ice-white,matrix-green,neon-magenta,solar-gold}.css` — 7 个 `--dvk-*` 令牌与作用域
- `packages/elements/src/fit-screen/element.ts` — `transform: translate(...) scale(...)`、`--dvk-scale*`、`dvk-resize` detail
- `packages/elements/src/border-box-content-padding.ts`、`packages/elements/src/border-box-*/element.ts` — 安全区映射与 `minBlock/minInline`
- `packages/core/src/index.ts` — `ResizeController`、`resolveThemeValue`
- `docs/reference/architecture-contracts.md` — 内容安全区契约
- `docs/components/other/fit-screen.md` — `dvk-resize` / `--dvk-scale`
- `docs/guide/theming.md`、`docs/guide/framework-integration.md` — 主题作用域与注册约定
- `docs/.vitepress/theme/components/AviationCommandScreen.vue`、`ScenicSpotCommandScreen.vue` — 面板/内容区约定（`.panel-inner` grid、`--dvk-border-box-13-padding` 覆盖、手绘 SVG 地图）

**ECharts 官方文档**（站点为 JS 渲染，纯 HTTP 抓取只得到导航壳；官方在同一站点发布了静态 Markdown 镜像，入口 `https://echarts.apache.org/en/llms.txt`）
- `https://echarts.apache.org/en/llms-documents/api-parts/api.echarts.md` — `init`（theme / devicePixelRatio / renderer / ssr / width / height / hidden DIV Note）、`registerTheme`、`registerMap`
- `https://echarts.apache.org/en/llms-documents/api-parts/api.echartsInstance.md` — `setOption`、`setTheme`、`resize`、`showLoading`、`hideLoading`、`clear`、`dispose`、`renderToSVGString`
- `https://echarts.apache.org/en/llms-documents/option-parts/option.grid.md` — `left/right/top/bottom` 默认值、`containLabel` 废弃、`outerBoundsMode`
- `https://echarts.apache.org/en/llms-documents/option-parts/option.graphic.md`、`option.aria.md`、`option.series-*.md`
- `https://echarts.apache.org/handbook/en/concepts/chart-size/` — resize 推荐写法 + ResizeObserver Tip
- `https://echarts.apache.org/handbook/en/how-to/cross-platform/server/` — SSR
- `https://echarts.apache.org/handbook/en/best-practices/canvas-vs-svg/` — >1k 用 canvas、SVG 缩放不模糊
- `https://echarts.apache.org/handbook/en/basics/release-note/{v5-upgrade-guide,v6-upgrade-guide,v6-feature,5-2-0,5-3-0}/`
- `https://echarts.apache.org/en/faq.html` — 地图数据来源

**ECharts / zrender 源码**（本仓库实装 6.1.0，路径为 `node_modules/.pnpm/echarts@6.1.0/node_modules/echarts/...`；GitHub 链接为同版本等价位置）
- `lib/core/echarts.js` — `registerTheme`(2231)、`init`(2135)、重复 init 警告(2143)、`setTheme`(513)、`_updateTheme`(554)、`resize`(964)
- `lib/model/Global.js` — `setTheme`(398)、`_resetOption`(173)、`initBase`(658)
- `lib/model/OptionManager.js` — `mountOption`(128)、`_optionBackup`
- `lib/loading/default.js` — loading 默认值(53)
- `lib/visual/tokens.js` — `color.theme`、`color.primary`
- `zrender/lib/canvas/Painter.js`(108/135/648)、`zrender/lib/canvas/Layer.js`、`zrender/lib/canvas/helper.js#getSize` — DPR 与布局尺寸
- `zrender/lib/core/event.js#clientToLocal / calculateZrXY`、`zrender/lib/dom/HandlerProxy.js`(189–214)、`zrender/lib/core/dom.js#transformCoordWithViewport` — 指针坐标
- GitHub issue/PR：[#16044](https://github.com/apache/echarts/issues/16044)、[#19743](https://github.com/apache/echarts/issues/19743)、[#4292](https://github.com/apache/echarts/issues/4292)、[#5899](https://github.com/apache/echarts/issues/5899)、[#6083](https://github.com/apache/echarts/issues/6083)、[#9434](https://github.com/apache/echarts/issues/9434)、[#21489](https://github.com/apache/echarts/pull/21489)、[zrender#1149](https://github.com/ecomfe/zrender/pull/1149)

**官方规范页（仅存在于 GitHub 仓库，网站 404）**
- `https://github.com/apache/echarts-handbook/tree/master/contents/en/best-practices/specification` — line / bar / pie / scatter / gauge / radar 的适用与反模式原文

**本文实测脚本**（临时文件，可复现）
- `/tmp/ec-verify/dvk-echarts.mjs` — 主题注入实现
- `/tmp/ec-verify/page3.html` — 真实浏览器下的令牌读取 / 主题应用 / 空态 / loading / setTheme
- `/tmp/ec-verify/page.html` + `cdp5.mjs` — `transform: scale(2)` 下的模糊与命中测试
- `/tmp/ec-verify/page2.html` + `cdp4.mjs` — `devicePixelRatio` 与 `resize()` 的实测
- `/tmp/ec-verify/page4.html` + `cdp9.mjs` — ResizeObserver + rAF 节流
- `/tmp/ec-verify/page5.html` — CSS 自定义属性计算值语义
