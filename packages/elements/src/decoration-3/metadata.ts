import type { DatavElementMetadata } from '@datav-kit/core'

export const decoration3Metadata = {
  tagName: 'dvk-decoration-3',
  className: 'Decoration3Element',
  description: 'Animated angular line decoration inspired by DataV Vue3 Decoration5.',
  props: {
    color: {
      type: 'string',
      default: '',
      attribute: true,
      cssVariable: '--dvk-color-primary',
      description: 'Primary line color.',
    },
    secondaryColor: {
      type: 'string',
      default: '',
      attribute: 'secondary-color',
      cssVariable: '--dvk-color-secondary',
      description: 'Secondary line color.',
    },
    colors: {
      type: 'string',
      default: '',
      attribute: true,
      description: 'Comma-separated primary and secondary line colors.',
    },
    duration: {
      type: 'number',
      default: 1.2,
      attribute: true,
      description: 'Stroke dash animation duration in seconds.',
    },
    dur: {
      type: 'number',
      default: 1.2,
      attribute: true,
      description: 'DataV-compatible alias for stroke dash animation duration in seconds.',
    },
    animated: {
      type: 'boolean',
      default: true,
      attribute: true,
      description: 'Enables stroke dash animation.',
    },
    paused: {
      type: 'boolean',
      default: false,
      attribute: true,
      description: 'Pauses the stroke dash animation.',
    },
  },
  events: [
    {
      name: 'dvk-ready',
      detail: '{ tagName }',
      description: 'Fired after the element first renders.',
    },
  ],
  parts: ['graphic', 'line', 'main-line', 'sub-line'],
} satisfies DatavElementMetadata
