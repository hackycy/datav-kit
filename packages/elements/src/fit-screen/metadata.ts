import type { DatavElementMetadata } from '@datav-kit/core'

export const fitScreenMetadata = {
  tagName: 'dvk-fit-screen',
  className: 'FitScreenElement',
  description: 'Scales a fixed-size design canvas into the available viewport.',
  props: {
    width: {
      type: 'number',
      default: 1920,
      attribute: true,
      description: 'Design canvas width.',
    },
    height: {
      type: 'number',
      default: 1080,
      attribute: true,
      description: 'Design canvas height.',
    },
    mode: {
      type: 'string',
      default: 'contain',
      attribute: true,
      description: 'Scaling mode: contain, cover, fill, or scroll.',
    },
    align: {
      type: 'string',
      default: 'center center',
      attribute: true,
      description: 'Horizontal and vertical alignment.',
    },
    fitTarget: {
      type: 'string',
      default: 'viewport',
      attribute: 'fit-target',
      description: 'Sizing target: viewport for full-page dashboards, host for embedded layouts.',
    },
    autoFullscreen: {
      type: 'boolean',
      default: false,
      attribute: 'auto-fullscreen',
      description: 'Deprecated compatibility flag. Fullscreen must be requested from a user gesture.',
    },
  },
  events: [
    {
      name: 'dvk-resize',
      detail: '{ width, height, dpr, scale, offsetX, offsetY }',
      description: 'Fired after viewport measurements are recalculated.',
    },
    {
      name: 'dvk-fullscreen-request',
      detail: '{ ok, reason }',
      description: 'Fired after requestFullscreenMode() resolves.',
    },
  ],
  parts: ['viewport', 'canvas'],
} satisfies DatavElementMetadata
