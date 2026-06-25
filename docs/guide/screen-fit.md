# Screen Fit

`dv-fit-screen` maps a fixed design canvas into the viewport by default. Use `fit-target="host"` when the component is embedded inside another layout, such as this documentation site.

```html
<dv-fit-screen width="1920" height="1080" mode="contain">
  <main>dashboard content</main>
</dv-fit-screen>
```

```html
<dv-fit-screen fit-target="host" width="1280" height="720" mode="contain">
  <section>embedded dashboard preview</section>
</dv-fit-screen>
```

Supported modes:

| Mode | Behavior |
| --- | --- |
| `contain` | Preserve aspect ratio and keep the full design visible. |
| `cover` | Preserve aspect ratio and fill the viewport, allowing overflow. |
| `fill` | Stretch independently on X/Y. |
| `scroll` | Disable scaling and allow scrolling. |

Alignment accepts two tokens such as `center center`, `left top`, or `right bottom`.

Fullscreen is exposed as a method and must be called from a user gesture:

```ts
const el = document.querySelector('dv-fit-screen')

button.addEventListener('click', () => {
  el?.requestFullscreenMode()
})
```

The component does not automatically request fullscreen when mounted.
