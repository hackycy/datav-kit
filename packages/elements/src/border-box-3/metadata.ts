import type { DatavElementMetadata } from '@datav-kit/core'

export const borderBox3Metadata = {
  tagName: 'dv-border-box-3',
  className: 'BorderBox3Element',
  description: 'Minimal futuristic blue border based on a cropped 1672 x 941 SVG reference.',
  props: {
    color: {
      type: 'string',
      default: '',
      attribute: true,
      cssVariable: '--dv-color-primary',
      description: 'Primary blue line and glint color.',
    },
    secondaryColor: {
      type: 'string',
      default: '',
      attribute: 'secondary-color',
      cssVariable: '--dv-color-secondary',
      description: 'Secondary dim blue frame color.',
    },
    accentColor: {
      type: 'string',
      default: '',
      attribute: 'accent-color',
      cssVariable: '--dv-color-accent',
      description: 'Accent highlight color used by nodes and fine hairlines.',
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
      description: 'Multiplier for SVG blur filters that create the restrained neon glow.',
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
