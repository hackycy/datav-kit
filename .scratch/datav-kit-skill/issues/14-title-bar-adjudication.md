# 标题栏实现路径：dvk-title-* 还是手搭

Status: resolved
Type: grilling
Blocked by: —

## Question

03 发现两套 Demo **都没有使用 `dvk-title-1/2/3`**，而是用"成对 `dvk-decoration-*` + 手写 `h1`"自建顶栏——这与 `docs/architecture.md` 对 Title 家族的定位（"用于大屏顶部标题栏、标题横幅和系统名称承载"）直接冲突。规范必须先裁决：

1. 大屏顶栏用 `dvk-title-*`，还是用成对装饰轨手搭，还是两条路径都允许（按场景选）？
2. 若用 `dvk-title-*`：4 个变体（Title 1–4）各自适配什么场景？注意 `llms.txt` 有 Title 4，站点侧栏只有 1–3。
3. 若手搭：把 P3（成对镜像装饰轨 + 居中标题块）写成规范时，允许用哪些 `dvk-decoration-*`、什么参数？
4. 该裁决同时约束：设计规范（04）、原型模板（08）、知识库模式层（09）。

**范围**：只裁决"skill 该怎么指导"，不改组件、不改架构文档。


## Answer

### 0. 事实纠正（开票前提有误）

原票写"`llms.txt` 有 Title 4、站点侧栏只有 1–3"。查证后真实情况是**三层分叉**：

| 层 | Title 1–3 | Border Box 16 | Performance Monitor |
| --- | --- | --- | --- |
| 仓库源码 | ✅ 完整实现 + metadata | ✅ | ✅ |
| npm `@datav-kit/elements@0.0.5` | ❌ 完全没有 | ❌ | ❌ |
| 线上文档站 | ❌ 404 | ❌ 404 | ❌ 404 |

- `title-4` 在源码里是**空目录**（无文件、无 git 历史）——**不存在这个组件**，规范与 skill 都不得引用。
- 本地 `docs/.vitepress/dist/` 是 2026-07-10 的陈旧构建产物（含 title-4 文档），**不可作为事实来源**。
- 影响：原型模板从 CDN 加载的 0.0.5 **没有 Title 组件**；线上 `llms.txt` **没有 Title 段**。

### 1. 顶栏裁决：规范写契约，实现按可用性二选一

**规范只定义"顶栏视觉契约"（组件无关）**：

| 条目 | 要求 | 来源 |
| --- | --- | --- |
| 高度 | 104px（`--dvk-screen-header-height`） | 07 |
| 视觉层级 | 标题 > KPI 条 > 面板内容 | 04 |
| 焦点 | 居中的标题块，是全屏最亮/对比最强的文本区 | 04 |
| 装饰强度 | ≤ 1 个装饰容器 + 1 条装饰轨；权重低于标题文本 | 04 条目 5.4 |
| 与 KPI 条的关系 | 顶栏与 KPI 条间距 = 区块间距（24px） | 07 |

**实现路径两条，用 `customElements.get('dvk-title-1')` 特性检测二选一**：

- **路径 1（组件可用时）**：用 `dvk-title-*`。三个变体的场景——Title 1 简约横向光板（企业/工业监控）、Title 2 深色玻璃机械翼（指挥中心）、Title 3 极光弧（城市运行/云指挥）。**没有 Title 4。**
- **路径 2（组件不可用时，即当前 0.0.5）**：P3 手搭——成对镜像 `dvk-decoration-*` + 居中标题块，装饰轨建议 `dvk-decoration-6/9`。

这样 Title 一发布，skill 自动用上，规范不用改。

### 2. 知识库回退源

线上缺失时回退到仓库 raw 文档：

```
线上：https://hackycy.github.io/datav-kit/<path>
回退：https://raw.githubusercontent.com/hackycy/datav-kit/main/docs/<path>
```

- 触发条件：`llms.txt` 中不存在该组件，或文档页返回 404。
- **必须标注来源**：回退内容来自 `main` 分支，**可能尚未发布**；skill 引用时必须声明"来自 main，当前 npm 包可能不含此组件"，避免指导用户使用装不到的组件。
- 此协议并入「知识库索引与路由规格」。
