# 知识库索引与路由规格

Status: resolved
Type: grilling
Blocked by: 03

## Question

定知识库的取用与路由协议：

1. `llms.txt` 常驻后，索引每条要记什么字段？（tag / 用途一句话 / 关键 props / 事件 / CSS 变量 / 文档 URL）
2. 检索路径：从"用户要做一个航空监控大屏"如何路由到具体组件页？是否需要一份"任务 → 组件"的映射？
3. 组合模式层（03 的产出）以什么形式进入 `references/`？每条模式记什么？
4. 令牌层怎么挂（与 05 对齐）。
5. 何时**必须** fetch 详情页、何时用索引就够——给出判据，避免过度取数。
6. **回退源协议（14 已定）**：线上 404 或 `llms.txt` 缺该组件时，回退 `https://raw.githubusercontent.com/hackycy/datav-kit/main/docs/<path>`；回退内容必须标注"来自 main，可能尚未发布"。
7. **可用性清单**：KB 必须能回答"这个组件在当前 npm 包里吗"——已发布 0.0.5 缺 Title 1–3 / Border Box 16 / Performance Monitor。


## Answer

### 1. 知识库的三层结构（沿用 charting 轮次已定的模型）

| 层 | 落点 | 常驻？ | 职责 |
| --- | --- | --- | --- |
| **组件层** | 线上 `llms.txt`（索引）+ 组件文档页（详情） | 索引常驻，详情按需 | "这组件是干嘛的、详情在哪" |
| **模式层** | `references/patterns.md` | **常驻** | "怎么搭"——路由主表 |
| **令牌层** | `references/tokens.md` + `assets/tokens.css` | 常驻 | "用什么值" |

两类边：`模式 → 组件`（每个模式由哪些组件构成）、`令牌 → 组件`（哪些变量影响它）。

### 2. 路由机制：模式层当主路由

```
用户 brief
  → 选模板（T1 三栏运维 / T2 两栏分析 / T3 单栏叙事 / T4 KPI 主导）
  → 每个区块查模式层（P1–P19）拿组件构成与参数
  → 组件层的 llms.txt 兜底（模式未覆盖的组件、或只需要"这组件是干嘛的"）
```

**不加"任务 → 组件"映射表**——它与模式层重复维护，且模式层已经承载了"任务 → 结构 → 组件"的完整链路。

### 3. 模式层的字段

`references/patterns.md` 常驻，每条模式记六项：

1. **用途** —— 一句话。
2. **组件构成** —— tag + 关键属性。
3. **参数** —— 具体值（引用令牌）。
4. **栅格位置** —— 在 12 列里的位置假设。
5. **可替换项** —— 这个区块还能换成哪些 pattern（供 06 的自由区使用）。
6. **注意事项** —— 已知坑。

19 条约 8KB，常驻可接受。

### 4. 取数判据

| 情形 | 动作 |
| --- | --- |
| 判断"要不要用这个组件"、拿 tag 名、拿文档 URL | 用索引就够 |
| 写具体 **props / events / CSS 变量 / `::part()`** | **必须 fetch 详情页** |
| 同一 session 内重复遇到同一组件 | 不重复 fetch |
| 线上 404 或索引缺该组件 | 回退 `https://raw.githubusercontent.com/hackycy/datav-kit/main/docs/<path>`，**标注"来自 main，可能未发布"** |

### 5. 可用性清单

`references/components.md` 带"发布状态"列，**以 `customElements.get(tag)` 运行时检测为准**，清单只作提示：

| 状态 | 数量 | 组件 |
| --- | --- | --- |
| 已发布（0.0.5） | **30** | border-box 1–15、decoration 1–11、count-to、fit-screen、loading-energy、loading-orbit |
| 仅 main 分支 | **5** | title 1–3、border-box-16、performance-monitor |
| 不存在 | — | **title-4**（源码里是空目录，禁止引用） |

理由：静态清单会随版本腐坏，但完全不给清单又会让 agent 在**规划阶段**（还没跑起来、检测不了）就用错组件。
