import type { DatavElementMetadata } from '@datav-kit/core'

export const borderBox1Metadata = {
  tagName: 'dv-border-box-1',
  className: 'BorderBox1Element',
  description: 'Animated numbered border box inspired by DataV BorderBox1.',
  props: {
    color: {
      type: 'string',
      default: '',
      attribute: true,
      cssVariable: '--dv-color-primary',
      description: 'Primary border color.',
    },
    secondaryColor: {
      type: 'string',
      default: '',
      attribute: 'secondary-color',
      cssVariable: '--dv-color-secondary',
      description: 'Secondary border color.',
    },
    colors: {
      type: 'string',
      default: '',
      attribute: true,
      description: 'Comma-separated primary and secondary colors.',
    },
    reverse: {
      type: 'boolean',
      default: false,
      attribute: true,
      description: 'Reverses the path direction used by the moving highlight.',
    },
    duration: {
      type: 'number',
      default: 3,
      attribute: true,
      description: 'Animation duration in seconds.',
    },
    animated: {
      type: 'boolean',
      default: true,
      attribute: true,
      description: 'Enables the moving highlight.',
    },
    paused: {
      type: 'boolean',
      default: false,
      attribute: true,
      description: 'Pauses the moving highlight while retaining the border.',
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
