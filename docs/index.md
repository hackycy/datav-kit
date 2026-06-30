---
title: DataV Kit
---

<div class="datav-home-hero">
  <section class="datav-home-copy">
    <p class="datav-home-eyebrow">Web Components for data screens</p>
    <h1>DataV Kit</h1>
    <p class="datav-home-headline">Precision visual primitives for data dashboard surfaces.</p>
    <p class="datav-home-lede"><code>datav-kit</code> ships SSR-safe Custom Elements for large-screen dashboard decoration. Components live under Components; Guide pages stay focused on setup, themes, and authoring.</p>
    <div class="datav-home-actions">
      <a class="datav-home-action datav-home-action--primary" href="/guide/installation">Install</a>
      <a class="datav-home-action" href="/components/decorations/decoration-1">Components</a>
      <a class="datav-home-action" href="/guide/theming">Themes</a>
    </div>
  </section>

  <section class="datav-home-preview" aria-label="DataV Kit component preview">
    <div class="datav-home-preview__bar">
      <span>LIVE ELEMENT</span>
      <strong>dvk-border-box-11</strong>
    </div>
    <dvk-border-box-11 class="datav-home-console" colors="#3d7fb8,#6ed7e8,#52f0b5" glow-intensity="1.05">
      <div class="datav-home-console__content">
        <div>
          <p class="datav-home-console__label">Command Center</p>
          <h3>Operations Surface</h3>
        </div>
        <div class="datav-home-metrics">
          <div>
            <span>Throughput</span>
            <strong><dvk-count-to end-val="98.7" decimals="1" suffix="%"></dvk-count-to></strong>
          </div>
          <div>
            <span>Nodes</span>
            <strong><dvk-count-to end-val="1284" separator=","></dvk-count-to></strong>
          </div>
          <div>
            <span>Latency</span>
            <strong><dvk-count-to end-val="24" suffix="ms"></dvk-count-to></strong>
          </div>
        </div>
      </div>
    </dvk-border-box-11>
  </section>
</div>

<div class="datav-home-capabilities">
  <section>
    <span>01</span>
    <h3>Decorative Containers</h3>
    <p>Numbered border boxes and HUD rails that adapt to real host sizes.</p>
  </section>
  <section>
    <span>02</span>
    <h3>Motion Metrics</h3>
    <p>Animated numeric display with formatting, slots, and reduced-motion support.</p>
  </section>
  <section>
    <span>03</span>
    <h3>Theme Tokens</h3>
    <p>Optional CSS variable presets for cyber blue, ice white, neon, matrix, and solar palettes.</p>
  </section>
</div>

```html
<dvk-border-box-11 colors="#3d7fb8,#6ed7e8,#52f0b5">
  <section>Command Center</section>
</dvk-border-box-11>
```
