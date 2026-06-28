import type { DatavElementMetadata } from '@datav-kit/core'

export const borderBox10Metadata = {
  tagName: 'dv-border-box-10',
  className: 'BorderBox10Element',
  description: 'DataV Vue3 BorderBox12-style rounded panel with a primary outline and four animated secondary corner glows.',
  props: {
    color: {
      type: 'string',
      default: '',
      attribute: true,
      cssVariable: '--dv-color-primary',
      description: 'Primary rounded outline color.',
    },
    secondaryColor: {
      type: 'string',
      default: '',
      attribute: 'secondary-color',
      cssVariable: '--dv-color-secondary',
      description: 'Secondary corner glow color.',
    },
    backgroundColor: {
      type: 'string',
      default: 'transparent',
      attribute: 'background-color',
      cssVariable: '--dv-border-box-10-background',
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
      description: 'Whether the corner glow color animation is rendered.',
    },
    paused: {
      type: 'boolean',
      default: false,
      attribute: true,
      description: 'Disables the corner glow animation while keeping the static frame visible.',
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
