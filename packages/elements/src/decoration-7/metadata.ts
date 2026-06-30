import type { DatavElementMetadata } from '@datav-kit/core'

export const decoration7Metadata = {
  tagName: 'dvk-decoration-7',
  className: 'Decoration7Element',
  description: 'Minimal sci-fi crystal glass ribbon decoration with reversible symmetric layout.',
  props: {
    color: {
      type: 'string',
      default: '',
      attribute: true,
      cssVariable: '--dvk-color-primary',
      description: 'Primary ice-blue glass highlight. Also accepts a DataV-compatible color array when set as a property.',
    },
    secondaryColor: {
      type: 'string',
      default: '',
      attribute: 'secondary-color',
      cssVariable: '--dvk-color-secondary',
      description: 'Secondary cyan glass glow color.',
    },
    accentColor: {
      type: 'string',
      default: '',
      attribute: 'accent-color',
      cssVariable: '--dvk-decoration-7-accent-color',
      description: 'Purple-blue refraction and energy trail accent color.',
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
      description: 'Mirrors the glass ribbon horizontally for symmetric title or divider layouts.',
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
    'shadow',
    'ribbon',
    'refraction',
    'slice',
    'edge',
    'upper-edge',
    'lower-edge',
    'energy',
    'particle',
  ],
} satisfies DatavElementMetadata
