import type { DatavElementMetadata } from '@datav-kit/core'

export const decoration9Metadata = {
  tagName: 'dvk-decoration-9',
  className: 'Decoration9Element',
  description: 'Minimal enterprise HUD rail with separated horizontal guide lines, short angled corner guides, and independent parallelogram modules for symmetric reverse layouts.',
  props: {
    color: {
      type: 'string',
      default: '',
      attribute: true,
      cssVariable: '--dvk-color-primary',
      description: 'Primary cool cyan line color. Also accepts a DataV-compatible color array when set as a property.',
    },
    secondaryColor: {
      type: 'string',
      default: '',
      attribute: 'secondary-color',
      cssVariable: '--dvk-color-secondary',
      description: 'Secondary blue glow and module color.',
    },
    accentColor: {
      type: 'string',
      default: '',
      attribute: 'accent-color',
      cssVariable: '--dvk-decoration-9-accent',
      description: 'Accent highlight color for a small independent module and tick.',
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
      description: 'Mirrors the full rail horizontally for paired symmetric decoration.',
    },
  },
  events: [
    {
      name: 'dvk-ready',
      detail: '{ tagName }',
      description: 'Fired after the element first renders.',
    },
  ],
  parts: [
    'graphic',
    'line-glow',
    'glow-line',
    'line-layer',
    'line',
    'primary-line',
    'secondary-line',
    'dim-line',
    'corner-line',
    'primary-corner-line',
    'secondary-corner-line',
    'dim-corner-line',
    'tick',
    'block-layer',
    'block',
    'secondary-block',
    'accent-block',
  ],
} satisfies DatavElementMetadata
