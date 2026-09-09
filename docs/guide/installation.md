---
description: Install datav-kit packages, register Web Components, and configure element imports for data screen projects.
---

# Installation

Install the element package and optional theme package:

```bash
pnpm add @datav-kit/elements @datav-kit/themes
```

Register all current elements in browser code:

```ts
import { register } from '@datav-kit/elements'
import '@datav-kit/themes/cyber-blue.css'

register()
```

Or register one element at a time:

```ts
import { defineBorderBox1, defineBorderBox2, defineBorderBox3, defineFitScreen } from '@datav-kit/elements'

defineFitScreen()
defineBorderBox1()
defineBorderBox2()
defineBorderBox3()
```

Registration is guarded for SSR. Importing modules is allowed on the server, but defining custom elements only happens when browser APIs are available.

## Documentation and Package Versions

Start component discovery with [llms.txt](/llms.txt), then read the returned detail links.
The documentation site describes the source revision used for its build. A page existing on
the site does not guarantee that an older installed package exports that component or API.
Inspect the project's dependency version and verify registration in the browser:

```ts
import { register } from '@datav-kit/elements'

register()
const available = customElements.get('dvk-border-box-15') !== undefined
```

Import alone does not register the elements. Perform feature detection after `register()`
or the selected `define*()` calls. Verify attributes and methods against that package version
as well; registration only proves that the tag exists.

When a chart reads inherited theme variables inside `dvk-fit-screen`, wait for the container's
first Lit update before measuring or reading computed styles. Its slotted content may not yet
participate in the rendered tree immediately after registration:

```js
await document.querySelector('dvk-fit-screen').updateComplete
await new Promise(requestAnimationFrame)
// Now measure the chart host and read its inherited project-theme values.
```

If a page is unavailable, use its `docs/` source at a verified GitHub tag or commit matching
the dependency. Material read from `main` may describe unreleased APIs. Offline, use matching
local docs and source. There is no separately maintained component availability list in the skill.

For Vue, React, Vite, and webpack setup examples, continue to [Framework Integration](/guide/framework-integration).
