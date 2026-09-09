# Screen Tokens and Calibration

`assets/tokens.css` is the single maintained source of default screen-token values.
Copy it when useful and override defaults to fit the composition.

Declare `--dvk-screen-*` on `.dvk-screen`, not the surrounding page. They cover spacing,
typography, layering, interaction duration and layout. Project overrides win over starter
defaults. These are application conventions, not datav-kit component API.

Colors belong to the scoped project theme. Official theming documentation explains how
application colors coordinate with `--dvk-color-*`. See `charts.md` for the computed-value bridge.

## Viewing-distance calibration

Starter values are preview defaults, not a claim of suitability for every display. Estimate
required character height, convert it to design pixels, then verify representative text at
the expected viewing distance:

```text
minimum design pixels = required physical character height
                      * design canvas height / physical display height
```

Use the same physical unit throughout. A preliminary character-height estimate of viewing
distance / 200 can inform a draft; it does not replace legibility testing or the installation's
applicable specification. Use the actual canvas height for non-1080p designs.

Raise the smallest labels and revise hierarchy and spacing together. A monitor preview
cannot establish readability on a distant wall display.

## Layout and motion

Use fluid main tracks and explicit visual dimensions. Safe margins depend on hardware,
overscan and wall seams; the starter grid is adjustable. Ultra-wide delivery may need a
different composition. Smaller devices can show a proportional contained preview.

Interaction transitions, chart updates and decorative loops serve different purposes.
Use short data transitions and reduced-motion support. Do not drive chart transitions with
a decorative loop duration.
