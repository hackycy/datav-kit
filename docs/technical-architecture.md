# datav-kit 技术架构文档

## 1. 背景与定位

`datav-kit` 目标是复刻 DataV 类大屏组件库的核心价值，但不再以某个前端框架作为底座，而是以 Web Components 作为组件内核，再向 Vue、React 等框架提供轻量包装。

参考项目 [vaemusic/datav-vue3](https://github.com/vaemusic/datav-vue3) 是 DataV 的 Vue3 + TypeScript + Vite 移植版本，README 中提供了全局注册和局部引入 Vue 组件的使用方式，例如 `dv-decoration-1`、`decoration-1`、`decoration-2`。该项目当前 GitHub 页面显示 latest release 为 `v1.7.4`，发布日期为 2024-10-21。

本项目的差异化方向：

- 框架无关：组件主体为标准 Custom Elements，可直接在 HTML、Vue、React、Svelte、Angular 中使用。
- 装饰优先：不做复杂图表、坐标系、数据分析类能力，聚焦边框、扫描线、流光、标题栏、动态背景、粒子纹理、HUD 面板等大屏视觉装饰。
- 大屏适配优先：提供比例缩放、全屏容器、设计稿坐标系、高清屏渲染优化等能力。
- 视觉升级：相比传统 DataV 装饰组件，强化科幻感、动态质感、可主题化和可组合性。
- 可维护：使用 monorepo 拆分核心、元素、主题、框架包装和文档站，避免单包不断膨胀。

## 2. 目标与非目标

### 2.1 目标

- 提供一套可直接用于数据大屏的 Web Components 装饰组件。
- 提供 Vue 和 React 包装层，让框架用户获得自然的类型提示、属性传递和事件绑定体验。
- 支持按需引入、自动注册和完整包注册三种使用方式。
- 默认不要求用户额外引入 CSS，组件自带必要结构样式。
- 支持 attribute/property、CSS 变量和可选主题包共同控制视觉效果。
- SVG 作为装饰组件主渲染方案，Canvas 只用于粒子、噪声等 SVG 不适合的动态背景。
- 支持响应式尺寸、`ResizeObserver` 自动重绘、`devicePixelRatio` 高清适配。
- 支持 VitePress 文档站，并在文档中直接提供组件演示和代码示例。

### 2.2 非目标

- 不内置 ECharts、G2、D3 等复杂图表封装。
- 不实现数据源编排、低代码画布、拖拽搭建器。
- 不把 Vue/React 作为核心运行时依赖。
- 不为兼容非常旧的浏览器牺牲现代 Web Components 能力。
- 不在首版追求所有 DataV 旧组件的 1:1 复刻。

## 3. 技术选型

### 3.1 基础栈

- 语言：TypeScript
- 包管理：pnpm workspace
- 构建编排：Turborepo
- 单包构建：tsdown
- 文档站：VitePress
- 测试：Vitest
- 代码规范：ESLint

当前仓库已经具备 `pnpm-workspace.yaml`、`turbo.json`、`tsdown`、`vitest`、`typescript` 等基础，可以在现有 starter 上逐步扩展。

### 3.2 Web Components 实现策略

推荐首选 Lit 作为组件基类，而不是完全手写 HTMLElement。

原因：

- Lit 对属性反射、模板更新、Shadow DOM、样式封装、生命周期有成熟封装。
- 生成物仍是标准 Custom Elements，框架无关目标不受影响。
- 对装饰类组件来说，Lit 的运行时成本可控，能换来更稳定的开发体验。
- Vue/React 包装层可以围绕 Custom Elements 做，不需要把 Lit 暴露给用户。

保留一层内部抽象 `DatavElement`，降低未来切换实现方式的成本：

```ts
export abstract class DatavElement extends LitElement {
  protected resizeController?: ResizeController
  protected motionController?: MotionController
}
```

### 3.3 SVG-first 渲染策略

装饰类组件默认走 SVG-first。边框、角标、线条、环形装饰、扫描、流光等组件都应该优先在组件内部生成 inline SVG，并通过 attribute/property 控制颜色、速度、密度、反转、透明度等视觉参数。

这样做的好处：

- 用户无需引入额外 CSS，安装后注册组件即可使用。
- SVG 天然矢量缩放，适合 1080p、2K、4K 等大屏分辨率。
- `path`、`polyline`、`rect`、`circle`、`linearGradient`、`filter`、`mask` 能覆盖绝大多数科幻装饰形态。
- SVG 内置动画元素和 CSS animation 都可使用，简单流光不必进入 Canvas。
- 属性驱动生成 SVG，比维护大量静态 CSS class 更直观。

组件内部仍可以有 Shadow DOM 样式，但这些样式随 JS 一起打包，不要求用户手动 import。

### 3.4 渲染技术选择

组件内部根据效果选择实现：

| 类型 | 推荐技术 | 适用场景 |
| --- | --- | --- |
| 静态边框、标题栏、角标 | Inline SVG | 清晰、可缩放、免外部 CSS |
| 扫描线、流光、脉冲、呼吸 | SVG animate / CSS animation | 轻量动画 |
| 粒子、星云、噪声、复杂背景 | Canvas 2D | 大量动态点线面 |
| 3D 透视、空间网格、能量场 | 可选 Three.js 子包 | 非首版，避免核心包变重 |
| 布局适配容器 | DOM + CSS transform | 设计稿缩放、全屏适配 |

首版不建议把 Three.js 放进核心包。可以后续拆成 `@datav-kit/effects-3d`。

## 4. Monorepo 包结构

建议目录：

```txt
datav-kit/
  packages/
    core/
    elements/
    themes/
    vue/
    react/
    shared/
    cli/
  docs/
```

### 4.1 `@datav-kit/core`

Web Components 核心基础能力，不包含具体业务组件。

职责：

- `DatavElement` 基类。
- Custom Element 注册工具。
- 通用生命周期 controller。
- 尺寸监听、DPR 监听、可见性监听。
- 动画调度器。
- SVG path、渐变、颜色工具。
- Canvas 渲染基类。
- 事件派发工具。
- 属性转换器。

示例 API：

```ts
defineDatavElement('dv-border-box-8', BorderBox8Element)
registerDatavElements([BorderBox8Element, DigitalRainElement])
```

### 4.2 `@datav-kit/elements`

组件主包，导出所有 Web Components。

职责：

- 导出每个元素类。
- 导出每个元素的注册函数。
- 提供 `register()` 一次性注册全部组件。
- 提供组件 metadata，供文档、Vue、React 包装生成类型。

建议组件命名：

```txt
dv-fit-screen
dv-border-box-8
dv-border-circuit
dv-decoration-line
dv-decoration-ring
dv-scan-line
dv-energy-grid
dv-digital-rain
dv-hud-panel
dv-title-bar
dv-corner-marker
```

包导出：

```json
{
  "exports": {
    ".": "./dist/index.mjs",
    "./border-box-8": "./dist/border-box-8.mjs",
    "./digital-rain": "./dist/digital-rain.mjs",
    "./register": "./dist/register.mjs",
    "./package.json": "./package.json"
  }
}
```

### 4.3 `@datav-kit/themes`

主题令牌与预设视觉风格。该包是可选增强包，不是组件运行的必需依赖。

职责：

- CSS 变量预设。
- 主题 CSS 文件，可选引入。
- 主题 metadata。
- 颜色、光效、动画曲线、阴影、线宽、透明度等设计令牌。

预设主题：

- `cyber-blue`：蓝青色科技大屏。
- `neon-magenta`：紫粉霓虹视觉。
- `matrix-green`：绿色代码流和扫描风格。
- `solar-gold`：金色政企、指挥中心风格。
- `ice-white`：浅色透明玻璃风格。

主题示例：

```css
:root,
.dv-theme-cyber-blue {
  --dv-color-primary: #18f0ff;
  --dv-color-secondary: #2b7cff;
  --dv-color-accent: #f3ff5c;
  --dv-box-8-soft: 0 0 12px rgba(24, 240, 255, 0.55);
  --dv-box-8-strong: 0 0 24px rgba(24, 240, 255, 0.85);
  --dv-line-width: 1px;
  --dv-motion-duration: 2400ms;
}
```

### 4.4 `@datav-kit/vue`

Vue 适配包。

职责：

- 安装插件 `app.use(DatavKit)`。
- 导出 Vue 组件包装，例如 `DvBorderBox8`。
- 处理对象/数组属性传递。
- 提供 Vue 类型提示。
- 支持局部注册和全局注册。

使用示例：

```vue
<script setup lang="ts">
import { DvBorderBox8, DvFitScreen } from '@datav-kit/vue'
</script>

<template>
  <DvFitScreen :width="1920" :height="1080">
    <DvBorderBox8 color="#18f0ff" />
  </DvFitScreen>
</template>
```

### 4.5 `@datav-kit/react`

React 适配包。

职责：

- 导出 React 组件包装，例如 `BorderBox8`、`FitScreen`。
- 处理 Custom Element 属性、ref、事件绑定。
- 提供完整 TypeScript 类型。
- 避免 React 对自定义元素复杂属性支持差异导致的体验问题。

使用示例：

```tsx
import { BorderBox8, FitScreen } from '@datav-kit/react'

export function Screen() {
  return (
    <FitScreen width={1920} height={1080}>
      <BorderBox8 colors="#235fa7,#4fd2dd" duration={3} />
    </FitScreen>
  )
}
```

### 4.6 `@datav-kit/shared`

跨包共享但不绑定 Web Components 的纯工具。

职责：

- 类型定义。
- 颜色解析。
- 数学工具。
- clamp、lerp、random、seeded random。
- throttle、raf loop。
- DOM 安全工具。

### 4.7 `@datav-kit/cli`

非首版必需，可以第二阶段加入。

职责：

- 新建组件模板。
- 从组件 metadata 生成 Vue/React 包装代码。
- 从 metadata 生成文档表格。
- 检查组件命名、导出和注册一致性。

## 5. 分层架构

```txt
Application
  Vue / React / Vanilla / Other frameworks

Adapters
  @datav-kit/vue
  @datav-kit/react

Web Components
  @datav-kit/elements

Foundation
  @datav-kit/core
  @datav-kit/themes
  @datav-kit/shared

Platform
  Custom Elements
  Shadow DOM
  ResizeObserver
  CSS Variables
  Canvas / SVG
```

依赖方向必须单向：

```txt
vue/react -> elements -> core -> shared
elements -> themes only through CSS variables or theme metadata
docs -> all public packages
```

禁止：

- `core` 依赖 `elements`。
- `elements` 依赖 Vue 或 React。
- 组件之间直接互相 import 具体实现，通用能力应下沉到 `core` 或 `shared`。

## 6. 组件设计规范

### 6.1 命名规范

Custom Element 使用 `dv-` 前缀：

```txt
dv-border-box-8
dv-fit-screen
dv-scan-line
```

TypeScript 类名：

```txt
BorderBox8Element
FitScreenElement
ScanLineElement
```

Vue 组件名：

```txt
DvBorderBox8
DvFitScreen
DvScanLine
```

React 组件名：

```txt
BorderBox8
FitScreen
ScanLine
```

### 6.2 属性设计

属性分三类：

- 基础视觉：`color`、`secondaryColor`、`background`、`opacity`、`radius`。
- 动画控制：`animated`、`speed`、`duration`、`delay`、`reverse`。
- 渲染控制：`renderer`、`dpr`、`paused`、`quality`。

原则：

- 简单值用 attribute，例如 `color="#18f0ff"`。
- 复杂值优先用 property，例如 `palette = ['#18f0ff', '#2b7cff']`。
- 需要兼容纯 HTML 时，复杂值提供字符串 attribute 兜底，例如 `colors="#18f0ff,#2b7cff"`。
- 布尔属性要兼容 HTML 写法，例如 `<dv-scan-line animated />`。
- 尺寸默认读取宿主元素实际尺寸，避免强制用户传 `width`、`height`。
- 大部分视觉差异通过属性表达，避免要求用户覆盖内部样式。

Web Component attribute 示例：

```html
<dv-decoration-line
  colors="#18f0ff,#2b7cff"
  speed="1.2"
  density="0.7"
  animated
></dv-decoration-line>
```

JavaScript property 示例：

```ts
const el = document.querySelector('dv-decoration-line')

el.colors = ['#18f0ff', '#2b7cff']
el.speed = 1.2
el.animated = true
```

### 6.3 样式设计

组件必须自带基础样式，使用者不引入 CSS 也能得到完整视觉效果。所有可主题化值优先有属性默认值，并允许 CSS 变量覆盖：

```css
:host {
  --dv-border-color: var(--dv-color-primary);
  --dv-border-highlight-color: var(--dv-color-secondary);
  display: block;
  position: relative;
  box-sizing: border-box;
}
```

属性优先级建议：

```txt
显式 attribute/property > CSS 变量 > 组件默认值
```

Shadow DOM 内部使用 `part` 暴露关键节点：

```html
<div part="frame"></div>
<svg part="graphic"></svg>
```

用户可通过：

```css
dv-border-box-8::part(frame) {
  filter: brightness(1.2);
}
```

### 6.4 事件设计

事件统一以 `dv-` 前缀：

```txt
dv-ready
dv-resize
dv-animation-start
dv-animation-end
```

事件 detail 保持结构化：

```ts
dispatchDatavEvent(this, 'dv-resize', {
  width,
  height,
  dpr,
})
```

## 7. 大屏适配能力

### 7.1 `dv-fit-screen`

核心适配容器，负责把设计稿尺寸映射到实际屏幕。

属性：

| 属性 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `width` | number | `1920` | 设计稿宽度 |
| `height` | number | `1080` | 设计稿高度 |
| `mode` | `'contain' \| 'cover' \| 'fill' \| 'scroll'` | `'contain'` | 缩放模式 |
| `align` | string | `'center center'` | 对齐方式 |
| `fit-target` | `'viewport' \| 'host'` | `'viewport'` | 适配目标，默认作为整页大屏壳，也可嵌入宿主容器 |
| `auto-fullscreen` | boolean | `false` | 兼容字段；全屏必须由用户手势触发 |

实现要点：

- 默认使用 `fit-target="viewport"` 作为整页大屏壳，组件尺寸为 `100vw / 100vh`。
- 使用 `fit-target="host"` 时作为嵌入式适配容器，尺寸跟随宿主布局。
- 使用 `ResizeObserver` 监听当前组件盒模型。
- 计算 scale、offset、viewport。
- 使用 CSS transform 缩放内部画布。
- 暴露 CSS 变量 `--dv-scale`、`--dv-viewport-width`、`--dv-viewport-height`。
- 派发 `dv-resize` 事件。

### 7.2 高清屏适配

Canvas 组件必须处理 DPR：

```ts
const ratio = Math.min(window.devicePixelRatio || 1, maxDpr)
canvas.width = rect.width * ratio
canvas.height = rect.height * ratio
ctx.scale(ratio, ratio)
```

默认 `maxDpr` 建议为 `2`，避免 4K 大屏上 Canvas 内存暴涨。

### 7.3 动画降级

支持以下暂停策略：

- 页面不可见时暂停 requestAnimationFrame。
- 组件离开视口时暂停 Canvas 动画。
- `prefers-reduced-motion` 时关闭复杂动画或降低速度。
- 用户传入 `paused` 时强制暂停。

## 8. 装饰组件规划

### 8.1 MVP 组件

首版建议控制在 8 到 10 个组件，做精而不是堆数量。

| 组件 | 渲染 | 说明 |
| --- | --- | --- |
| `dv-fit-screen` | DOM | 大屏适配容器 |
| `dv-border-box-8` | SVG | 编号边框 |
| `dv-border-circuit` | SVG | 电路线框边框 |
| `dv-corner-marker` | SVG | 四角装饰 |
| `dv-decoration-line` | SVG | 流光线条 |
| `dv-decoration-ring` | SVG | 旋转环形装饰 |
| `dv-scan-line` | SVG | 横向/纵向扫描线 |
| `dv-energy-grid` | SVG | 科技网格背景 |
| `dv-digital-rain` | Canvas | 数字雨背景 |
| `dv-hud-panel` | DOM + SVG | HUD 信息面板容器 |

### 8.2 二期组件

- `dv-particle-field`
- `dv-orbit-system`
- `dv-radar-sweep`
- `dv-wave-grid`
- `dv-data-tunnel`
- `dv-light-beam`
- `dv-glass-panel`
- `dv-path-flow`

### 8.3 视觉方向

组件要明显区别于旧 DataV 装饰：

- 多层细线 + 辉光，而不是单层线框。
- 使用渐变描边和运动光点增强质感。
- 允许局部随机，但提供 seed 保持可复现。
- 鼓励组件组合，例如 `border + corner + scan + background`。
- 色彩不要单一绑定蓝色，主题层提供多套风格。

## 9. 注册与使用方式

### 9.1 Vanilla

```ts
import { register } from '@datav-kit/elements'

register()
```

```html
<dv-fit-screen width="1920" height="1080">
  <dv-border-box-8 colors="#18f0ff,#2b7cff"></dv-border-box-8>
</dv-fit-screen>
```

如果需要全局主题，再额外引入主题 CSS：

```ts
import '@datav-kit/themes/cyber-blue.css'
```

### 9.2 按需注册

```ts
import { defineBorderBox8 } from '@datav-kit/elements/border-box-8'

defineBorderBox8()
```

### 9.3 Vue

```ts
import DatavKit from '@datav-kit/vue'
import { createApp } from 'vue'

createApp(App).use(DatavKit).mount('#app')
```

### 9.4 React

```tsx
import { BorderBox8 } from '@datav-kit/react'

export function App() {
  return <BorderBox8 color="#18f0ff" />
}
```

## 10. 构建与发布

### 10.1 构建产物

每个包发布 ESM：

```txt
dist/
  index.mjs
  index.d.mts
```

CSS 主题包额外发布：

```txt
dist/
  cyber-blue.css
  neon-magenta.css
  matrix-green.css
```

### 10.2 Tree Shaking

原则：

- 单组件独立入口。
- 注册函数无隐式全量副作用。
- 包级 `sideEffects` 需要谨慎设置。

建议：

- `@datav-kit/core`、`@datav-kit/shared` 可以 `sideEffects: false`。
- `@datav-kit/elements` 的组件内部样式随 JS 打包，不要求外部 CSS。
- `@datav-kit/elements` 如果存在自动注册入口，需要用 `sideEffects` 白名单保护：

```json
{
  "sideEffects": [
    "./dist/auto-register.mjs"
  ]
}
```

- `@datav-kit/themes` 作为可选 CSS 包，需要保留 CSS side effects：

```json
{
  "sideEffects": [
    "*.css"
  ]
}
```

### 10.3 发布策略

首选 Changesets 或当前仓库已有的 `bumpp` 简化发布。

如果多包版本强关联，采用 fixed version：

```txt
@datav-kit/core@0.1.0
@datav-kit/elements@0.1.0
@datav-kit/vue@0.1.0
@datav-kit/react@0.1.0
```

早期建议 fixed version，减少使用者理解成本。

## 11. 测试策略

### 11.1 单元测试

覆盖：

- 工具函数。
- 尺寸计算。
- 颜色解析。
- 属性转换。
- 注册函数重复调用。
- 动画调度器暂停/恢复。

### 11.2 组件测试

使用 Vitest + DOM 环境测试：

- Custom Element 定义成功。
- attribute/property 同步。
- resize 后重新渲染。
- 事件 detail 正确。

### 11.3 性能测试

关键指标：

- 首屏注册成本。
- 单组件渲染耗时。
- Canvas 动画 FPS。
- 大屏 4K 下内存占用。
- 多组件同时动画时的主线程占用。

## 12. 文档与示例

VitePress 文档站结构：

```txt
docs/
  index.md
  guide/
    introduction.md
    installation.md
    theming.md
    screen-fit.md
    component-authoring.md
  components/
    borders/
      border-box-8.md
    tools/
      fit-screen.md
    buttons/
  reference/
    architecture-contracts.md
```

每个组件文档包含：

- 基础用法。
- 文档内实时演示。
- 属性表。
- CSS 变量表。
- `::part` 表。
- 事件表。
- 性能注意事项。

文档演示要求：

- 切换主题。
- 展示核心属性组合。
- 提供可复制的 HTML / TypeScript 代码块。
- 演示代码直接来自当前 Web Components 包，不维护额外演示应用。

## 13. 开发工作流

### 13.1 新增组件流程

1. 在 `packages/elements/src/<component>/` 创建组件。
2. 定义元素类、样式、metadata、注册函数。
3. 导出单组件入口。
4. 增加 VitePress 组件文档和文档内 demo。
5. 按需补充 Vue/React wrapper。
6. 增加单元测试。
7. 更新组件索引。

建议目录：

```txt
packages/elements/src/border-box-8/
  border-box-8.element.ts
  border-box-8.styles.ts
  border-box-8.metadata.ts
  define.ts
  index.ts
```

### 13.2 组件 metadata

metadata 是文档、包装层、类型生成的核心。

```ts
export const borderBox8Meta = {
  tagName: 'dv-border-box-8',
  className: 'BorderBox8Element',
  vueName: 'DvBorderBox8',
  reactName: 'BorderBox8',
  props: {
    color: {
      type: 'string',
      default: 'var(--dv-color-primary)',
      attribute: true,
    },
    duration: {
      type: 'number',
      default: 3,
      attribute: true,
    },
  },
  events: ['dv-ready', 'dv-resize'],
  parts: ['frame', 'graphic'],
}
```

## 14. SSR 与框架兼容

Web Components 注册只能在浏览器端执行。

要求：

- 所有 `customElements.define` 调用必须包裹浏览器环境判断。
- Vue/React wrapper 在 SSR 中只输出自定义标签，不访问 `window`。
- 文档明确 Nuxt、Next.js 的使用方式。

示例：

```ts
export function canUseDOM() {
  return typeof window !== 'undefined' && typeof customElements !== 'undefined'
}
```

## 15. 可访问性与可控动画

装饰组件虽然不是主要交互控件，也要避免干扰用户。

规则：

- 默认 `aria-hidden="true"`，除非组件承载内容。
- 容器组件不能吞掉子元素语义。
- 高频闪烁动画必须限制频率。
- 尊重 `prefers-reduced-motion`。
- 提供 `paused` 属性。
- 颜色不只依赖低对比发光，关键内容由业务层负责。

## 16. 风险与对策

| 风险 | 影响 | 对策 |
| --- | --- | --- |
| Web Components 在 React 中复杂属性体验不一致 | 使用门槛高 | React wrapper 负责 property 和事件桥接 |
| Shadow DOM 样式不易覆盖 | 用户自定义受限 | CSS variables + `::part` |
| Canvas 动画在 4K 大屏性能差 | 掉帧、发热 | DPR 上限、可见性暂停、质量参数 |
| 组件数量扩张导致维护困难 | 文档和测试跟不上 | metadata 驱动、MVP 控制数量 |
| 视觉同质化 | 缺少差异化 | 主题系统、动效规范、视觉评审 |
| 自动注册影响 tree shaking | 包体变大 | 单组件入口 + 显式注册 |

## 17. 里程碑

### M0：仓库初始化

- 重命名占位包。
- 建立 `core`、`elements`、`themes`、`vue`、`react` 包。
- 建立 VitePress docs。
- 配置统一 build、lint、typecheck。

### M1：Web Components 核心闭环

- 完成 `DatavElement`。
- 完成注册工具。
- 完成 ResizeController。
- 完成 MotionController。
- 完成 `dv-fit-screen`。
- 完成 2 个 SVG 装饰组件。

### M2：视觉组件 MVP

- 完成 8 到 10 个首版组件。
- 完成主题包。
- 完成文档站基础页面。

### M3：框架适配

- 完成 Vue plugin 和按需组件。
- 完成 React wrapper。
- 完成 Vue/React 文档用法页面。
- 补充 Nuxt/Next 使用文档。

### M4：发布准备

- 补齐 README。
- 补齐 API 文档。
- 完成包导出检查。
- 完成 npm 发布配置。
- 发布 `0.1.0`。

## 18. 推荐首版包清单

```txt
@datav-kit/core
@datav-kit/shared
@datav-kit/elements
@datav-kit/themes
@datav-kit/vue
@datav-kit/react
```

首版暂缓：

```txt
@datav-kit/cli
@datav-kit/effects-3d
@datav-kit/icons
```

## 19. 首个技术决策记录

### ADR-001：以 Web Components 作为核心组件模型

结论：采用 Web Components 作为核心组件模型，Vue/React 只作为适配层。

理由：

- 装饰类组件天然适合封装成独立 DOM 单元。
- 可以跨框架复用，避免重复维护 Vue 和 React 两套实现。
- 组件生命周期、样式封装、属性系统可以沉到统一底座。
- 大屏项目经常混合技术栈，Web Components 的接入边界更稳定。

代价：

- React 复杂属性和事件需要 wrapper 改善体验。
- SSR 下注册时机需要额外处理。
- Shadow DOM 样式覆盖需要提前设计 CSS 变量和 `::part`。

### ADR-002：首版不做复杂图表

结论：不封装复杂图表库，只提供装饰、容器和适配能力。

理由：

- 图表能力已有 ECharts、AntV 等成熟生态。
- 项目的差异化在大屏视觉装饰，而不是数据可视化算法。
- 减少依赖体积和维护负担。

### ADR-003：首版使用 Lit，保留内部基类隔离

结论：首版用 Lit 实现 Web Components，同时通过 `DatavElement` 隔离项目内部基类。

理由：

- 开发效率更高。
- 类型和属性反射更稳定。
- 后续仍可对少量性能敏感组件手写 HTMLElement 或 Canvas renderer。

### ADR-004：装饰组件采用 SVG-first，主题 CSS 可选

结论：装饰组件默认使用 inline SVG 生成视觉结构，必要样式内置在组件中，不要求用户引入全局 CSS；主题 CSS 只作为全局视觉预设。

理由：

- DataV 类装饰组件主要是矢量线框、点阵、渐变、发光、扫描和路径动画，SVG 表达力足够。
- SVG 对大屏缩放友好，不依赖位图资源。
- 属性驱动 SVG 生成更适合 Web Components，可直接从 attribute/property 映射到图形参数。
- 免 CSS 引入能降低使用门槛，更接近原 DataV 使用体验。

代价：

- 每个组件需要认真设计属性模型，避免把所有视觉细节都塞进单一配置对象。
- 高复杂度动态背景仍需 Canvas，否则 SVG DOM 节点过多会影响性能。
- 主题系统需要保持“可选”，不能让组件依赖主题 CSS 才能正常显示。

## 20. 下一步建议

建议按以下顺序落地：

1. 先完成 monorepo 包重命名和基础包创建。
2. 实现 `@datav-kit/core` 的 `DatavElement`、注册工具、ResizeController。
3. 实现 `dv-fit-screen`，把大屏适配能力打通。
4. 实现 `dv-border-box-8` 和 `dv-decoration-line`，先验证 SVG-first 和属性驱动模型。
5. 再生成 Vue/React wrapper，验证跨框架使用体验。
6. 最后实现 `dv-digital-rain`，验证 Canvas 动态背景路径。
