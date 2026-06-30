import type { DatavElementMetadata } from '@datav-kit/core'

export const decoration6Metadata = {
  tagName: 'dv-decoration-6',
  className: 'Decoration6Element',
  description: 'Minimal cyber HUD rail decoration with reversible symmetric layout.',
  props: {
    color: {
      type: 'string',
      default: '',
      attribute: true,
      cssVariable: '--dv-color-primary',
      description: 'Primary cyan rail color. Also accepts a DataV-compatible color array when set as a property.',
    },
    secondaryColor: {
      type: 'string',
      default: '',
      attribute: 'secondary-color',
      cssVariable: '--dv-color-secondary',
      description: 'Secondary electric-blue rail and halo color.',
    },
    accentColor: {
      type: 'string',
      default: '',
      attribute: 'accent-color',
      cssVariable: '--dv-decoration-6-accent-color',
      description: 'Bright node core color.',
    },
    colors: {
      type: 'string',
      default: '',
      attribute: true,
      description: 'Comma-separated primary, secondary, and accent colors.',
    },
    reverse: {
      type: 'boolean',
      default: false,
      attribute: true,
      description: 'Mirrors the decoration horizontally for symmetric title or divider layouts.',
    },
  },
  events: [
    {
      name: 'dv-ready',
      detail: '{ tagName }',
      description: 'Fired after the element first renders.',
    },
  ],
  parts: [
    'graphic',
    'halo',
    'line',
    'main-line',
    'head-line',
    'tail-line',
    'support-line',
    'upper-line',
    'upper-tail-line',
    'lower-line',
    'lower-tail-line',
    'segment',
    'cut',
    'node',
  ],
} satisfies DatavElementMetadata
