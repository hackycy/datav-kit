import type { DatavElementMetadata } from '@datav-kit/core'

export const borderBox8Metadata = {
  tagName: 'dvk-border-box-8',
  className: 'BorderBox8Element',
  description: 'DataV BorderBox1-style panel with a dynamic polygon background and four fixed mirrored animated corner ornaments.',
  props: {
    color: {
      type: 'string',
      default: '',
      attribute: true,
      cssVariable: '--dvk-color-primary',
      description: 'Primary corner ornament color.',
    },
    secondaryColor: {
      type: 'string',
      default: '',
      attribute: 'secondary-color',
      cssVariable: '--dvk-color-secondary',
      description: 'Secondary corner ornament color used by the animated fill swap.',
    },
    backgroundColor: {
      type: 'string',
      default: 'transparent',
      attribute: 'background-color',
      cssVariable: '--dvk-border-box-8-background',
      description: 'Panel background fill color.',
    },
    colors: {
      type: 'string',
      default: '',
      attribute: true,
      description: 'Comma-separated primary and secondary colors. Use background-color for an optional panel fill.',
    },
    animated: {
      type: 'boolean',
      default: true,
      attribute: true,
      description: 'Whether corner fill animations are rendered.',
    },
    paused: {
      type: 'boolean',
      default: false,
      attribute: true,
      description: 'Disables corner fill animations while keeping the static frame visible.',
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
