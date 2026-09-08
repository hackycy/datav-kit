# Components — Availability, Capabilities, and Detail Routing

The component layer of the datav-kit knowledge base. It answers **"is this component here, what
can it do, and where is its detail page"**.

**This file owns**

- the publication status list and the runtime availability check;
- border-box capability fields (which variant supports what);
- the online-first fetch protocol and the `main`-branch fallback.

**This file does not own**

- the border-box **role** matrix — that lives in `patterns.md` §3 (P6) and must not be duplicated
  here;
- generic redlines and thresholds → `design-rules.md`;
- token values → `tokens.md` / `assets/tokens.css`.

## 1. Runtime availability is the authority

The status list below is a planning aid. At runtime, availability is decided by feature
detection **after** the element package has finished registering:

```js
await import('@datav-kit/elements@0.0.5') // or the CDN import map entry
customElements.get('dvk-border-box-10') // truthy → registered
```

- Never pass a prop to a component that is not registered.
- Never decide availability from the static list when the runtime check is possible.
- If every candidate in a fallback chain is unavailable, **stop and report the missing package**
  — do not substitute an arbitrary element.

The static list exists because the planning phase has no runtime: before the screen is running,
an agent cannot call `customElements.get`, yet it still has to pick components.

## 2. Publication status

| Status | Count | Components |
| --- | --- | --- |
| Published (`@datav-kit/elements@0.0.5`) | 30 | `dvk-border-box-1` … `dvk-border-box-15`, `dvk-decoration-1` … `dvk-decoration-11`, `dvk-count-to`, `dvk-fit-screen`, `dvk-loading-energy`, `dvk-loading-orbit` |
| `main` branch only | 5 | `dvk-title-1`, `dvk-title-2`, `dvk-title-3`, `dvk-border-box-16`, `dvk-performance-monitor` |
| Nonexistent | — | `dvk-title-4` — an empty directory in the source tree; it does not exist and must never be referenced |

`main`-only components are absent from the published package and from the live documentation
site. The live `llms.txt` index does not list them either.

`dvk-performance-monitor` is a development-time diagnostics overlay (FPS plus a 0–100 pressure
score). It is not a screen-region component; do not place it in a large-screen layout.

## 3. Border-box capability fields

All 16 variants share the same content-area contract (§4) and expose **only the default slot** —
`frame`, `graphic`, and `content` are parts, not slots. Role selection is in `patterns.md` §3.

| Variant | `background-color` | `animated` / `paused` | `auto-height` | `glow-intensity` default | Content-area source | Publication |
| --- | --- | --- | --- | --- | --- | --- |
| `dvk-border-box-1` | no | yes / yes | **yes** (only variant) | — | `contentRect` | published |
| `dvk-border-box-2` | no | no | no | `1` | `contentRect` | published |
| `dvk-border-box-3` | no | no | no | `1` | `contentRect` | published |
| `dvk-border-box-4` | no | no | no | `1` | `contentRect` | published |
| `dvk-border-box-5` | no | no | no | `1` | `contentRect` | published |
| `dvk-border-box-6` | no | no | no | `1` | `contentRect` | published |
| `dvk-border-box-7` | yes (default `transparent`) | no | no | — | `contentRect` | published |
| `dvk-border-box-8` | yes (default `transparent`) | yes / yes | no | — | `contentRect` | published |
| `dvk-border-box-9` | yes (default `transparent`) | no | no | — | `contentRect` | published |
| `dvk-border-box-10` | yes (default `transparent`) | yes / yes | no | — | `contentRect` | published |
| `dvk-border-box-11` | no | yes / yes | no | `1` | `contentRect` | published |
| `dvk-border-box-12` | no | yes / yes | no | `1` | `contentRect` | published |
| `dvk-border-box-13` | no | yes / yes | no | `1` | `contentRect` | published |
| `dvk-border-box-14` | no | yes / yes | no | `1` | `contentRect` | published |
| `dvk-border-box-15` | yes (default `transparent`) | no | no | — | `contentRect` | published |
| `dvk-border-box-16` | no | yes / yes | no | `0.7` | `contentRect` | `main` only |

Reading the table:

- **`background-color`** — the surface capability. Only `7/8/9/10/15` expose it; the rest are
  transparent HUD, status, or compact frames that take their background from the host or screen.
- **`animated` / `paused`** — motion control. `1/8/10/11/12/13/14/16` support both; `2/3/4/5/6/7/9/15`
  are static. `border-box-1` also takes `animated=false`.
- **`auto-height`** — `border-box-1` only. Every other variant stretches to its parent height.
- **`glow-intensity`** — a multiplier on the glow, default `1` where present and `0.7` on
  `border-box-16`. Keep the default unless a visual-hierarchy deviation is registered.
- **`accent-color`** — present on `2/3/4/5/6/11/12/13/14/16` (and as the third entry of
  `colors`). Not a selection criterion on its own.
- **Publication** — `border-box-16` is a `main`-only optional enhancement; the chain in
  `patterns.md` §3 already accounts for it.

`colors` is a comma-separated string in the order primary, secondary[, accent] — the same for all
16 variants.

## 4. Content-area source

Every border box derives its content inset from its `contentRect` — the safe rectangle declared
in the component's own SVG coordinate system, mapped to the measured host size. This is the
default model; fixed padding values are not.

Precedence for the content inset:

```txt
--dvk-border-box-N-padding
> --dvk-border-box-padding
> computed contentRect padding
```

- The computed value is an internal implementation detail, not an authoring contract.
- An override is justified only by an observed obstruction, overflow, or readability problem,
  and is recorded as a deviation.
- Padding numbers must never be used to infer which variant is in play.

## 5. Detail routing — online first

The knowledge base is online-first; there is no offline bundle.

| Need | Action |
| --- | --- |
| "Should I use this component", its tag name, its doc URL | the index is enough |
| Writing `props` / `events` / CSS variables / `::part()` | **fetch the detail page — mandatory** |
| The same component again in the same session | do not re-fetch |
| The index lacks the component, or the page 404s | use the fallback source (§6) and label it |

Sources:

```txt
index:   https://hackycy.github.io/datav-kit/llms.txt
detail:  https://hackycy.github.io/datav-kit/components/<group>/<name>.md
fallback: https://raw.githubusercontent.com/hackycy/datav-kit/main/docs/components/<group>/<name>.md
```

`<group>` is `borders`, `decorations`, `titles`, or `other`.

The index carries the tag, a one-line purpose, and the doc URL. It does **not** carry prop names —
never write a prop from memory or from a pattern's example; fetch the detail page.

## 6. `main`-branch fallback

Trigger: the component is absent from `llms.txt`, or its detail page returns 404.

```txt
https://raw.githubusercontent.com/hackycy/datav-kit/main/docs/<path>
```

The fetched content comes from the `main` branch and may not be published. When a skill or
project uses it, the source must be stated explicitly:

> from `main` — the published npm package may not include this component yet

Apply the label wherever the component is recommended, so nobody is guided to a component they
cannot install. This is the documented route for `dvk-title-1/2/3`, `dvk-border-box-16`, and
`dvk-performance-monitor`.

## 7. Capability notes for non-border-box components

These are capability facts, not placement rules.

- **`dvk-title-1/2/3`** (`main` only): isomorphic props — `color`, `secondary-color`,
  `accent-color`, `colors`, `title-text`. The default slot and `title-text` are mutually
  exclusive; parts are always `content` / `title` / `title-text`. Absent from 0.0.5, so a screen
  must feature-detect and fall back (see `patterns.md` P3).
- **`dvk-decoration-4`** and **`dvk-decoration-8`**: the only slot-bearing decorations — they can
  frame compact content.
- **`dvk-decoration-5/6/7/9`**: support `reverse`, documented for symmetric title or divider
  pairings.
- **`dvk-count-to`**: the only count-up primitive. Numeric props are attributes and are coerced
  from strings; `prefix` / `suffix` slots win over the same-named props.
- **`dvk-fit-screen`**: the only scaling element. Defaults `width=1920 height=1080
  mode=contain align=center center fit-target=viewport`.
- **`dvk-loading-energy`** / **`dvk-loading-orbit`**: loading states for panels and empty
  regions (`size` defaults 72 and 50).
