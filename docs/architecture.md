# datav-kit 技术架构

## 1. 文档边界

本文只记录 `datav-kit` 的长期架构边界和关键技术决策，不承担路线图、组件规划、开发流程或发布计划的职责。

- 组件 API、事件、metadata、SSR 等实现契约见 [Architecture Contracts](./reference/architecture-contracts.md)。
- 安装、主题、适配容器和组件编写说明放在 `guide/`。
- 具体组件的属性和示例放在 `components/`。

这份文档应该回答：

- 项目的核心抽象是什么。
- 包之间如何依赖。
- 渲染、主题、注册和框架适配遵循什么边界。
- 哪些能力应放在核心，哪些能力应留给扩展包或使用者。

## 2. 架构定位

`datav-kit` 是面向数据大屏场景的 Web Components 组件库。组件主体以标准 Custom Elements 暴露，Vue、React 等框架只作为适配层接入。

核心定位：

- 框架无关：组件运行时不绑定 Vue、React 或其他应用框架。
- 大屏友好：关注全屏适配、设计稿缩放、高清屏渲染和可控动画。
- 视觉组件内聚：组件自带必要结构和基础样式，开箱即用。
- 主题可选：主题包提供 CSS 变量预设，但组件不能依赖主题 CSS 才能正常显示。
- 可维护：共享能力下沉到稳定基础包，具体元素保持独立注册和独立导出。

非目标：

- 不内置 ECharts、G2、D3 等复杂图表封装。
- 不实现数据源编排、低代码画布或拖拽搭建器。
- 不把 Vue/React 作为核心运行时依赖。
- 不为非常旧的浏览器牺牲现代 Web Components 能力。

## 3. 分层模型

```txt
Application
  Vanilla / Vue / React / Svelte / Angular / Other frameworks

Adapters
  framework wrappers

Elements
  @datav-kit/elements

Foundation
  @datav-kit/core
  @datav-kit/themes
  @datav-kit/shared

Platform
  Custom Elements
  Shadow DOM
  CSS Variables
  ResizeObserver
  SVG / Canvas
```

依赖方向必须保持单向：

```txt
adapters -> elements -> core -> shared
elements -> shared
themes -> shared only when pure metadata helpers are needed
docs -> public packages
```

禁止的依赖：

- `core` 依赖 `elements`。
- `elements` 依赖 Vue、React 或文档站。
- `shared` 依赖 DOM、Lit 或组件实现。
- 组件之间直接 import 彼此的具体实现。

如果多个组件需要共享行为，应优先沉淀到 `core` 或 `shared`，而不是在组件之间横向耦合。

## 4. 包职责

### 4.1 `@datav-kit/shared`

纯工具包，不绑定 DOM、Lit 或 Web Components。

适合放入：

- 类型无关的数学工具。
- 颜色解析、数值转换、字符串转换。
- clamp、lerp、random、throttle 等通用函数。
- 不访问浏览器全局对象的安全工具。

不适合放入：

- Custom Element 注册逻辑。
- ResizeObserver、requestAnimationFrame 等浏览器生命周期逻辑。
- 组件 metadata 或主题运行时逻辑。

### 4.2 `@datav-kit/core`

Web Components 基础设施包，不包含具体业务元素。

职责：

- `DatavElement` 基类。
- Custom Element 注册工具。
- SSR/DOM 环境判断。
- 事件派发工具。
- 属性、主题值和基础类型定义。
- 尺寸监听、动画调度等通用 controller。
- Fullscreen 等平台能力的安全封装。

`core` 可以依赖 Lit，但 Lit 不应该泄漏成用户必须直接理解的公共心智模型。对外主语仍然是 Custom Elements。

### 4.3 `@datav-kit/elements`

组件主包，负责导出具体 Web Components。

职责：

- 导出元素类。
- 导出单元素注册函数。
- 导出 `register()` 批量注册函数。
- 导出统一的 `elementMetadata`，供文档和适配层消费。
- 保持组件内部样式和渲染实现自包含。

`elements` 不负责框架语法糖，也不负责主题预设的全局引入。

### 4.4 `@datav-kit/themes`

可选主题包，提供 CSS 变量预设和主题 metadata。

职责：

- 发布可直接引入的主题 CSS。
- 定义颜色、光效、线宽、透明度、动画曲线等视觉令牌。
- 保持主题对组件是增强关系，而不是运行前提。

主题包可以影响视觉默认值，但不能改变组件结构和公共行为。

### 4.5 框架适配包

Vue、React 等适配包只包装 Custom Elements，不重写组件实现。

职责边界：

- 提供符合框架习惯的组件名和类型提示。
- 桥接复杂 property、ref 和事件绑定。
- 在 SSR 中只输出自定义元素标签，不触发浏览器注册副作用。

适配包不得复制 `elements` 的渲染逻辑。

## 5. 组件内核

组件内核采用 Lit 实现，并通过 `DatavElement` 隔离项目内部基类。

这个选择的架构含义：

- 属性反射、模板更新、Shadow DOM 和生命周期由成熟基础设施承接。
- 对外产物仍然是标准 Custom Elements。
- 性能敏感组件仍可在内部使用 Canvas 或更底层的 DOM 控制。
- 未来如果局部组件需要脱离 Lit，应通过 `core` 保持公共契约稳定。

组件注册必须显式发生，模块导入本身不应产生 `customElements.define()` 副作用。

## 6. 渲染模型

组件根据效果选择渲染技术，但公共 API 不应暴露实现细节。

| 渲染技术 | 适用边界 |
| --- | --- |
| Inline SVG | 线框、边框、角标、渐变、流光、扫描、路径动画 |
| DOM + CSS transform | 适配容器、布局缩放、内容承载 |
| Canvas 2D | 大量粒子、噪声、数字雨等高频动态背景 |
| 独立 3D 扩展 | 透视场景、空间网格、复杂三维效果 |

默认策略是 SVG-first：

- SVG 对大屏缩放友好，适合矢量装饰。
- Inline SVG 可随组件封装，不要求使用者额外维护资源。
- 简单动画优先使用 SVG 或 CSS，避免过早引入 Canvas。
- 当节点数量、绘制频率或像素级效果明显不适合 SVG 时，再使用 Canvas。

3D 能力不进入核心包；如果需要，应作为独立扩展包存在。

## 7. 样式与主题

组件必须自带可用的基础样式。使用者只注册组件、不引入主题 CSS 时，也应得到完整视觉。

视觉值解析顺序：

```txt
显式 attribute/property > CSS 变量 > 组件默认值
```

样式边界：

- 可主题化值通过 CSS 变量表达。
- 关键 Shadow DOM 节点通过 `::part()` 暴露。
- 组件内部结构样式随组件打包。
- 主题包只提供变量预设，不覆盖组件私有结构。

组件不应要求使用者通过深层选择器理解内部 DOM。

## 8. 公共接口

公共接口由三部分组成：

- attribute/property：表达输入状态。
- `dv-*` 事件：表达组件生命周期和可观察变化。
- metadata：让文档、类型和适配层共享同一份描述。

设计原则：

- 简单值优先支持 attribute。
- 复杂值通过 property 传递，并在必要时提供字符串 attribute 兜底。
- 布尔属性兼容 HTML 写法。
- 事件 detail 保持结构化。
- 公共事件统一使用 `dv-` 前缀。

详细字段约定见 [Architecture Contracts](./reference/architecture-contracts.md)。

## 9. 大屏适配与动画

大屏适配能力属于基础架构的一部分，因为它影响组件尺寸、渲染精度和动画资源管理。

架构要求：

- 尺寸变化通过 `ResizeObserver` 驱动。
- 组件默认读取宿主元素实际尺寸，避免强制传入宽高。
- Canvas 组件必须处理 `devicePixelRatio`，并设置合理 DPR 上限。
- 动画应能在页面不可见、组件断开连接或用户显式暂停时停止。
- 复杂动画必须尊重 `prefers-reduced-motion`。

适配容器可以使用 CSS transform 映射设计稿尺寸到实际视口，但不能吞掉子内容的语义和交互能力。

## 10. SSR 与运行时副作用

包模块可以在 SSR 环境被 import，但浏览器副作用必须延迟到客户端。

要求：

- 不在模块顶层访问 `window`、`document`、`customElements` 等浏览器对象。
- 不在模块顶层注册 Custom Elements。
- 注册函数在非浏览器环境中安全返回。
- 框架 wrapper 在 SSR 中只渲染自定义标签。

这条边界优先级高于使用便利性。需要自动注册时，应通过独立入口或显式客户端代码实现。

## 11. 包产物与导出边界

包产物以 ESM 为主，并提供类型声明：

```txt
dist/
  index.mjs
  index.d.mts
```

导出原则：

- 根入口导出稳定公共 API。
- 单组件能力通过根入口 re-export，而不是无限增加 package subpath。
- CSS 主题文件可以作为明确 subpath 暴露。
- 自动注册入口如果存在，必须在 `sideEffects` 中明确标注。

`@datav-kit/core`、`@datav-kit/shared` 等纯模块应保持 tree-shaking 友好。

## 12. 架构决策

### 12.1 Web Components 是核心组件模型

采用 Web Components 作为组件内核，框架包只做适配。

理由：

- 大屏装饰组件适合封装成独立 DOM 单元。
- 跨框架复用成本低。
- 生命周期、样式封装和属性系统可以沉到统一底座。
- 大屏项目经常混合技术栈，Custom Elements 的接入边界更稳定。

代价：

- React 等框架中的复杂属性和事件需要 wrapper 改善体验。
- SSR 下注册时机必须明确控制。
- Shadow DOM 可定制性需要通过 CSS 变量和 `::part()` 设计。

### 12.2 Lit 是内部实现基础，不是产品边界

首选 Lit 实现组件，以获得稳定的属性、模板和生命周期能力。

理由：

- 能减少手写 HTMLElement 的重复代码。
- 与 Shadow DOM 和响应式更新模型匹配。
- 生成物仍然是标准 Custom Elements。

边界：

- 用户不需要直接依赖 Lit API。
- 公共契约以 Custom Elements、attributes、properties 和 events 为准。

### 12.3 SVG-first，Canvas 按需

装饰组件优先使用 inline SVG，Canvas 只用于 SVG 不适合的高频动态效果。

理由：

- SVG 缩放质量稳定，适合 1080p、2K、4K 大屏。
- 线框、渐变、遮罩、路径动画等装饰形态表达力充足。
- 组件可以自包含渲染结构和必要样式。

代价：

- 复杂动态背景需要避免 SVG 节点过多。
- 组件属性模型需要克制，不能把所有视觉细节塞进单个配置对象。

### 12.4 主题是增强层

主题通过 CSS 变量预设影响视觉，而不是改变组件行为。

理由：

- 使用者可以不引入主题包也能正常使用组件。
- 主题可以跨组件统一视觉语言。
- CSS 变量与 Shadow DOM 边界兼容。

边界：

- 主题不应依赖组件内部 DOM 结构。
- 组件不应依赖某个主题才能渲染完整。

### 12.5 不封装复杂图表

项目不把复杂图表库作为内置能力。

理由：

- 图表生态已有成熟方案。
- 项目核心价值在大屏装饰、容器和适配能力。
- 避免依赖体积和维护边界失控。
