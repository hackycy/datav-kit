import type { DatavElementMetadata } from '@datav-kit/core'

export const borderBox4Metadata = {
  tagName: 'dv-border-box-4',
  className: 'BorderBox4Element',
  description: 'Dense neon HUD frame adapted from the provided 1672 x 941 vector SVG material.',
  props: {
    color: {
      type: 'string',
      default: '',
      attribute: true,
      cssVariable: '--dv-color-primary',
      description: 'Primary cyan line and glint color.',
    },
    secondaryColor: {
      type: 'string',
      default: '',
      attribute: 'secondary-color',
      cssVariable: '--dv-color-secondary',
      description: 'Secondary glow and fine frame color.',
    },
    accentColor: {
      type: 'string',
      default: '',
      attribute: 'accent-color',
      cssVariable: '--dv-color-accent',
      description: 'Hot highlight color used by nodes, strokes, and HUD ticks.',
    },
    colors: {
      type: 'string',
      default: '',
      attribute: true,
      description: 'Comma-separated primary, secondary, and accent colors.',
    },
    glowIntensity: {
      type: 'number',
      default: 1,
      attribute: 'glow-intensity',
      description: 'Multiplier for SVG blur filters that create the layered neon glow.',
    },
  },
  events: [
    {
      name: 'dv-ready',
      detail: '{ tagName }',
      description: 'Fired after the element first renders.',
    },
  ],
  parts: ['frame', 'graphic', 'content'],
} satisfies DatavElementMetadata
