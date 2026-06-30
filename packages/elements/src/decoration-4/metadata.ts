import type { DatavElementMetadata } from '@datav-kit/core'

export const decoration4Metadata = {
  tagName: 'dvk-decoration-4',
  className: 'Decoration4Element',
  description: 'Responsive diamond panel decoration inspired by DataV Vue3 Decoration11.',
  props: {
    color: {
      type: 'string',
      default: '',
      attribute: true,
      cssVariable: '--dvk-color-primary',
      description: 'Primary frame color.',
    },
    secondaryColor: {
      type: 'string',
      default: '',
      attribute: 'secondary-color',
      cssVariable: '--dvk-color-secondary',
      description: 'Corner ornament color.',
    },
    colors: {
      type: 'string',
      default: '',
      attribute: true,
      description: 'Comma-separated primary and secondary colors.',
    },
  },
  events: [
    {
      name: 'dvk-ready',
      detail: '{ tagName }',
      description: 'Fired after the element first renders.',
    },
  ],
  parts: ['graphic', 'corner', 'top-left-corner', 'bottom-left-corner', 'top-right-corner', 'bottom-right-corner', 'frame', 'side-line', 'left-line', 'right-line', 'content'],
} satisfies DatavElementMetadata
