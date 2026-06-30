import type { DatavElementMetadata } from '@datav-kit/core'

export const borderBox6Metadata = {
  tagName: 'dvk-border-box-6',
  className: 'BorderBox6Element',
  description: 'High-precision cyan HUD border recreated from the supplied 1672 x 941 SVG, rendered as fixed source details plus clipped edge extensions.',
  props: {
    color: {
      type: 'string',
      default: '',
      attribute: true,
      cssVariable: '--dvk-color-primary',
      description: 'Primary cyan glow and body color.',
    },
    secondaryColor: {
      type: 'string',
      default: '',
      attribute: 'secondary-color',
      cssVariable: '--dvk-color-secondary',
      description: 'Dark structural frame and shadow color.',
    },
    accentColor: {
      type: 'string',
      default: '',
      attribute: 'accent-color',
      cssVariable: '--dvk-color-accent',
      description: 'Bright cyan highlight color used by the solid trace layer.',
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
      description: 'Multiplier for SVG blur filters that create the layered glow.',
    },
  },
  events: [
    {
      name: 'dvk-ready',
      detail: '{ tagName }',
      description: 'Fired after the element first renders.',
    },
  ],
  parts: ['frame', 'graphic', 'content'],
} satisfies DatavElementMetadata
