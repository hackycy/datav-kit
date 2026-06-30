import type { DatavElementMetadata } from '@datav-kit/core'

export const borderBox7Metadata = {
  tagName: 'dvk-border-box-7',
  className: 'BorderBox7Element',
  description: 'Chamfered glowing border recreated from DataV BorderBox10, with dynamic panel geometry and fixed mirrored corner ornaments.',
  props: {
    color: {
      type: 'string',
      default: '',
      attribute: true,
      cssVariable: '--dvk-color-primary',
      description: 'Primary inset glow color.',
    },
    secondaryColor: {
      type: 'string',
      default: '',
      attribute: 'secondary-color',
      cssVariable: '--dvk-color-secondary',
      description: 'Corner ornament fill color.',
    },
    backgroundColor: {
      type: 'string',
      default: 'transparent',
      attribute: 'background-color',
      cssVariable: '--dvk-border-box-7-background',
      description: 'Panel background fill color.',
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
