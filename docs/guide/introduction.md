# Introduction

`datav-kit` uses Web Components as the runtime boundary. Components can be used from plain HTML and, later, wrapped by framework adapters without rewriting the visual implementation.

The current milestone focuses on the smallest complete loop:

- `@datav-kit/core`: shared element base, registration, resize, motion, event, fullscreen, and theme/prop helpers.
- `@datav-kit/elements`: public Web Components and metadata.
- `@datav-kit/themes`: optional CSS variable presets.
- `@datav-kit/docs`: VitePress documentation with live component demos.

The project intentionally keeps demos inside the documentation site for now. Documentation pages carry both the live demo and the code used to create it.
