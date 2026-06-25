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
import { defineBorderBox8 } from '@datav-kit/elements/border-box-8'
import { defineFitScreen } from '@datav-kit/elements/fit-screen'

defineFitScreen()
defineBorderBox8()
```

Registration is guarded for SSR. Importing modules is allowed on the server, but defining custom elements only happens when browser APIs are available.
