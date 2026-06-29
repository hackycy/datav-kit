import type { DatavElementMetadata } from '@datav-kit/core'

export const decoration5Metadata = {
  tagName: 'dv-decoration-5',
  className: 'Decoration5Element',
  description: 'Responsive angled line decoration inspired by DataV Vue3 Decoration8.',
  props: {
    color: {
      type: 'string',
      default: '',
      attribute: true,
      cssVariable: '--dv-color-primary',
      description: 'Primary line color. Also accepts a DataV-compatible color array when set as a property.',
    },
    secondaryColor: {
      type: 'string',
      default: '',
      attribute: 'secondary-color',
      cssVariable: '--dv-color-secondary',
      description: 'Bottom line color.',
    },
    colors: {
      type: 'string',
      default: '',
      attribute: true,
      description: 'Comma-separated primary and secondary line colors.',
    },
    reverse: {
      type: 'boolean',
      default: false,
      attribute: true,
      description: 'Mirrors the decoration horizontally.',
    },
  },
  events: [
    {
      name: 'dv-ready',
      detail: '{ tagName }',
      description: 'Fired after the element first renders.',
    },
  ],
  parts: ['graphic', 'line', 'short-line', 'long-line', 'bottom-line'],
} satisfies DatavElementMetadata
