---
description: Integrate datav-kit Web Components with Vue, React, Vite, and webpack frameworks using custom element configuration.
---

# Framework Integration

`datav-kit` ships standard Web Components. Framework integration usually has two parts:

1. Register the custom elements once in browser code.
2. Tell the framework compiler that `dvk-*` tags are native custom elements.

Install the packages first:

```bash
pnpm add @datav-kit/elements @datav-kit/themes
```

## Vite

For plain Vite apps, register elements in the browser entry and import one optional theme file:

```ts
// src/main.ts
import { register } from '@datav-kit/elements'
import '@datav-kit/themes/cyber-blue.css'

register()
```

Then use the custom elements directly in HTML:

```html
<section class="dvk-theme-cyber-blue">
  <dvk-fit-screen width="1920" height="1080" mode="contain">
    <dvk-border-box-1 style="display:block;height:180px">
      <dvk-count-to end-val="1280" separator=","></dvk-count-to>
    </dvk-border-box-1>
  </dvk-fit-screen>
</section>
```

When a Vite project has a separate server entry, keep `register()` in the client entry. The package can be imported during SSR, but custom elements are only defined when browser APIs exist.

## Vue

Vue templates need `dvk-*` tags to be treated as custom elements instead of Vue components.

With Vue 3 and Vite, configure the Vue plugin:

```ts
// vite.config.ts
import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [
    vue({
      template: {
        compilerOptions: {
          isCustomElement: tag => tag.startsWith('dvk-'),
        },
      },
    }),
  ],
})
```

Register `datav-kit` in the app entry:

```ts
import { register } from '@datav-kit/elements'
// src/main.ts
import { createApp } from 'vue'
import App from './App.vue'
import '@datav-kit/themes/cyber-blue.css'

register()

createApp(App).mount('#app')
```

Use attributes for static values and Vue bindings for dynamic values:

```vue
<script setup lang="ts">
import { ref } from 'vue'

const total = ref(98520)
</script>

<template>
  <section class="dvk-theme-cyber-blue">
    <dvk-border-box-8 style="display:block;height:220px">
      <dvk-count-to :end-val="total" separator="," suffix=" visits" />
    </dvk-border-box-8>
  </section>
</template>
```

`datav-kit` events are native DOM events. Listen with Vue event syntax and read `event.detail`:

```vue
<script setup lang="ts">
function handleResize(event: Event) {
  const detail = (event as CustomEvent).detail
  console.log(detail.scale)
}
</script>

<template>
  <dvk-fit-screen @dvk-resize="handleResize">
    <main>Dashboard content</main>
  </dvk-fit-screen>
</template>
```

For Vue CLI or webpack-based Vue builds, apply the same `isCustomElement` rule through the Vue loader compiler options.

## React

React can render custom elements directly. Register `datav-kit` before rendering the app:

```tsx
// src/main.tsx
import { register } from '@datav-kit/elements'
import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import '@datav-kit/themes/cyber-blue.css'

register()

createRoot(document.getElementById('root')!).render(<App />)
```

Use kebab-case attribute names for custom element attributes:

```tsx
export function MetricsPanel() {
  return (
    <section className="dvk-theme-cyber-blue">
      <dvk-border-box-3 style={{ display: 'block', height: 220 }}>
        <dvk-count-to end-val="76320" separator="," suffix=" events" />
      </dvk-border-box-3>
    </section>
  )
}
```

For TypeScript projects, add JSX declarations for the custom tags you use:

```ts
// src/datav-kit.d.ts
import type { HTMLAttributes } from 'react'

declare module 'react/jsx-runtime' {
  namespace JSX {
    interface IntrinsicElements {
      'dvk-border-box-3': HTMLAttributes<HTMLElement> & {
        colors?: string
        animated?: boolean | string
      }
      'dvk-count-to': HTMLAttributes<HTMLElement> & {
        'end-val'?: number | string
        'separator'?: string
        'suffix'?: string
      }
    }
  }
}
```

React event props only cover React's synthetic event names. For `dvk-*` custom events, attach a native listener with a ref:

```tsx
import { useEffect, useRef } from 'react'

export function ResponsiveScreen() {
  const screenRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const screen = screenRef.current
    if (!screen)
      return

    const handleResize = (event: Event) => {
      const detail = (event as CustomEvent).detail
      console.log(detail.scale)
    }

    screen.addEventListener('dvk-resize', handleResize)
    return () => screen.removeEventListener('dvk-resize', handleResize)
  }, [])

  return (
    <dvk-fit-screen ref={screenRef} width="1920" height="1080">
      <main>Dashboard content</main>
    </dvk-fit-screen>
  )
}
```

## webpack

`datav-kit` packages are ESM-first packages. In webpack projects, make sure the application can consume ESM dependencies and CSS imports from packages.

Register elements in the browser entry:

```ts
// src/main.ts
import { register } from '@datav-kit/elements'
import '@datav-kit/themes/cyber-blue.css'

register()
```

A typical webpack rule set needs CSS handling for the theme file:

```js
// webpack.config.js
export default {
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
}
```

If the app performs server rendering, call `register()` from the client bundle only. When framework loaders parse templates, also configure them to preserve `dvk-*` tags as custom elements.

## Integration Checklist

- Install `@datav-kit/elements` and optionally `@datav-kit/themes`.
- Import one theme CSS file or provide your own CSS variables.
- Call `register()` once from the browser entry.
- Configure framework template compilers to accept `dvk-*` custom elements.
- Pass simple values with attributes; use properties or framework bindings when values are dynamic.
- Listen to `dvk-*` events as native `CustomEvent` events and read `event.detail`.
