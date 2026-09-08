# 面板容器 border-box 变体的场景选型规则

Status: resolved
Type: grilling
Blocked by: —

## Question

为 datav-kit 大屏 skill 定义 16 个 `dvk-border-box-*` 变体的可执行场景选型规则，避免现有 Demo 将同一语义“面板”偶然映射到不同变体。

需要决定：

1. 是否按视觉/能力建立变体分组，以及每组的首选场景、禁用场景和回退顺序。
2. 如何处理 `background-color` 能力、`glow-intensity`、内容安全区/内距差异、主视图与紧凑 KPI 的尺寸语义。
3. npm `@datav-kit/elements@0.0.5` 只发布 border-box 1–15、border-box-16 仅在 main 分支时，规则如何结合 `customElements.get(tag)` 做运行时选择与回退。
4. 规则应落在 `references/patterns.md`、`references/components.md`、`references/design-rules.md` 和 `spec.md` 的哪些位置，如何避免重复维护。

约束：不得新增或修改组件；保留 `contentRect` 内容安全区契约；不把 Demo 的配色或单一变体偏好提升为规范；`title-4` 不得引用。

## Answer

### 1. Canonical selection model

P6 uses a capability-first, role-second selection algorithm. `surface` means that the component exposes a `background-color` capability; omitting that attribute still permits a transparent panel. `HUD` means a transparent decorative frame whose background is supplied by the host or screen. `场景角色` is the semantic job of the container after the capability branch; it is not a color theme.

The capability groups are:

| Group | Variants | Capability boundary |
| --- | --- | --- |
| Generic rectangle | `1` | Animated rectangular frame; the only `auto-height` variant. |
| Large HUD | `2/3/4/5/6` | Transparent, large-format sliced/tiled HUD frames; no `background-color`. |
| Surface panel | `7/8/9/10/15` | Optional independent surface through `background-color`. |
| Status/precision frame | `11/12/13/14` | Transparent operational or technical rails; no `background-color`. |
| Compact enhancement | `16` | Compact CPU-like KPI/topology/health frame; main-only, no `background-color`. |

The role entry points are fixed as follows:

| Scene role | Preferred variant |
| --- | --- |
| Focal primary view | `4` |
| Dense-data primary view | `3` |
| Transparent free-size HUD | `5` |
| Precision technology primary view | `6` |
| Cyber/HUD primary view | `2` |
| Generic rectangle or content-sized box | `1` |
| Chamfered surface panel | `7` |
| Animated polygon surface panel | `8` |
| Restrained static surface panel | `9` |
| Rounded glow surface panel | `10` |
| Repeated lightweight card | `15` |
| Operational status rail | `11` |
| Top rail structural frame | `12` |
| Bottom carrier-spine frame | `13` |
| Signal-port technical area | `14` |
| Compact KPI, topology, or device health | `16` |

### 2. Fixed fallback chains

After the preferred tag, choose the first registered tag in the same capability family and role chain. Import and registration must complete before calling `customElements.get(tag)`. Unsupported props must not be passed to a fallback.

| Scene role | Fallback chain |
| --- | --- |
| Focal primary view | `4 → 2 → 6 → 3 → 5 → 1` |
| Dense-data primary view | `3 → 6 → 5 → 2 → 1` |
| Transparent free-size HUD | `5 → 3 → 6 → 2 → 1` |
| Precision technology primary view | `6 → 3 → 5 → 2 → 1` |
| Cyber/HUD primary view | `2 → 4 → 3 → 5 → 1` |
| Generic rectangle or content-sized box | `1 → 15` |
| Chamfered surface panel | `7 → 10 → 9 → 15` |
| Animated polygon surface panel | `8 → 10 → 7 → 15` |
| Restrained static surface panel | `9 → 15 → 7 → 10` |
| Rounded glow surface panel | `10 → 9 → 15 → 7` |
| Repeated lightweight card | `15 → 9 → 10 → 7` |
| Operational status rail | `11 → 13 → 12 → 14 → 1` |
| Top rail structural frame | `12 → 13 → 14 → 11 → 1` |
| Bottom carrier-spine frame | `13 → 12 → 14 → 11 → 1` |
| Signal-port technical area | `14 → 13 → 12 → 11 → 1` |
| Compact KPI, topology, or device health | `16 → 15 → 9` |

Surface and HUD families must not silently cross during fallback. The `1 → 15` chain is the explicit generic-rectangle fallback; omit `background-color` when the original role did not require a surface and record any resulting visual change. The `16 → 15 → 9` chain is the explicit compact-role exception: omit `background-color` on the fallback so the visual remains transparent, and record the loss of CPU-like geometry as a visual-contract degradation. If a chain has no registered candidate, stop with a missing dependency instead of inventing a new component or silently using an arbitrary border.

The published package currently provides `1–15`; `16` remains a main-only optional enhancement. `title-4` is never a candidate.

### 3. Surface, motion, and content boundaries

- When an independent surface is required, select only `7/8/9/10/15`; use the theme surface value through the supported `background-color` prop. Transparent HUD/status variants use the host or screen background instead.
- Motion is not a default selection reason. Enable it only for a named data or interaction mapping. With `prefers-reduced-motion: reduce`, use `paused` where supported and `animated=false` for `border-box-1`; otherwise prefer a static role variant. Keep the component default `glow-intensity` unless a documented visual-hierarchy deviation is registered.
- Every variant keeps the `contentRect` contract. Automatic padding is the default; only an observed obstruction, overflow, or readability problem justifies `--dvk-border-box-N-padding`, and that override is recorded as a deviation. Padding numbers are never used to infer the variant.
- All border boxes expose only the default slot. `frame`, `graphic`, and `content` are parts, not title slots. P7 headings therefore stay inside the default slot's `.panel-inner`.

### 4. Documentation ownership

- `references/patterns.md` owns the single P6 selection matrix, role entries, and fallback chains.
- `references/components.md` owns capability fields, publication status, and the `customElements.get(tag)` availability check; it does not duplicate the role matrix.
- `references/design-rules.md` owns only the redlines that affect any border box, especially content safety and no clipping; it does not choose variants.
- `spec.md` records that P6 is the normative matrix and carries the handoff requirements; it does not create a second independently maintained matrix.
