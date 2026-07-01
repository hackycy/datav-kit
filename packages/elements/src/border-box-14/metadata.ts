import type { DatavElementMetadata } from '@datav-kit/core'

export const borderBox14Metadata = {
  tagName: 'dvk-border-box-14',
  className: 'BorderBox14Element',
  description: 'Shallow orthogonal signal-port corner border with equal-weight circuit traces, pin contacts, generous content safety, and subtle node pulse motion.',
  props: {
    color: {
      type: 'string',
      default: '',
      attribute: true,
      cssVariable: '--dvk-color-primary',
      description: 'Primary signal rail color.',
    },
    secondaryColor: {
      type: 'string',
      default: '',
      attribute: 'secondary-color',
      cssVariable: '--dvk-color-secondary',
      description: 'Secondary rail gradient color.',
    },
    accentColor: {
      type: 'string',
      default: '',
      attribute: 'accent-color',
      cssVariable: '--dvk-color-accent',
      description: 'Accent color for the signal-port nodes and contact pads.',
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
      description: 'Multiplier for the signal rail and node glow strength.',
    },
    animated: {
      type: 'boolean',
      default: true,
      attribute: true,
      description: 'Whether the border renders subtle signal node pulse animations.',
    },
    paused: {
      type: 'boolean',
      default: false,
      attribute: true,
      description: 'Disables signal node motion while keeping the static frame visible.',
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
