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
