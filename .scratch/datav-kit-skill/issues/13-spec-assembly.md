# 规格汇编与锁定

Status: resolved
Type: task
Blocked by: 04, 05, 06, 07, 08, 09, 10, 11, 12, 14, 16, 17

## Question

把前面所有 ticket 的结论汇编成 `.scratch/datav-kit-skill/spec.md`：

1. 章节骨架（按 `skills/datav-kit/` 的文件树组织）。
2. 每章引用来源 ticket。
3. 明确"可交付给实现"的完成定义。
4. 实现 effort 的交接清单（先做什么、验收怎么走）。


## Answer

`spec.md` 已汇编完成（约 240 行），结构：

0. 交付物与完成定义 · 1. 定位与边界 · 2. 目录树（16 文件）· 3. 逐文件规格（13 个小节）· 4. 流程与闸门（六步 / 五闸门 / 七问 / 顶栏契约）· 5. 关键数值速查 · 6. 实现顺序与验收 · 7. 交接清单。

**关键性质**：实现方按 `spec.md` 写 `skills/datav-kit/`，**无需回读 ticket**；ticket 只作决策留痕。本规格不含实现代码。
