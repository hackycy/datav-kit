import type { DatavElementMetadata } from '@datav-kit/core'

export const borderBox9Metadata = {
  tagName: 'dvk-border-box-9',
  className: 'BorderBox9Element',
  description: 'DataV Vue3 BorderBox7-style panel with an inset glow, host border, and two-layer rounded corner linework.',
  props: {
    color: {
      type: 'string',
      default: '',
      attribute: true,
      cssVariable: '--dvk-color-primary',
      description: 'Primary border, outer corner, and inset glow color.',
    },
    secondaryColor: {
      type: 'string',
      default: '',
      attribute: 'secondary-color',
      cssVariable: '--dvk-color-secondary',
      description: 'Secondary inner corner line color.',
    },
    backgroundColor: {
      type: 'string',
      default: 'transparent',
      attribute: 'background-color',
      cssVariable: '--dvk-border-box-9-background',
      description: 'Panel background color.',
    },
    colors: {
      type: 'string',
      default: '',
      attribute: true,
      description: 'Comma-separated primary and secondary colors. Use background-color for an optional panel fill.',
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
