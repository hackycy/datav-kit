import type { DatavElementMetadata } from '@datav-kit/core'

export const borderBox12Metadata = {
  tagName: 'dvk-border-box-12',
  className: 'BorderBox12Element',
  description: 'Minimal electric-blue chamfered HUD border with a clean title rail, soft glow, subtle top slant blocks, and symmetric side folds.',
  props: {
    color: {
      type: 'string',
      default: '',
      attribute: true,
      cssVariable: '--dvk-color-primary',
      description: 'Primary electric-blue frame color.',
    },
    secondaryColor: {
      type: 'string',
      default: '',
      attribute: 'secondary-color',
      cssVariable: '--dvk-color-secondary',
      description: 'Secondary cyan inner rail and side-fold color.',
    },
    accentColor: {
      type: 'string',
      default: '',
      attribute: 'accent-color',
      cssVariable: '--dvk-color-accent',
      description: 'Accent color for the top slant blocks.',
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
      description: 'Multiplier for the rail and slant-block glow strength.',
    },
    animated: {
      type: 'boolean',
      default: true,
      attribute: true,
      description: 'Whether the top slant blocks render subtle blink animations.',
    },
    paused: {
      type: 'boolean',
      default: false,
      attribute: true,
      description: 'Disables motion while keeping the static chamfer frame visible.',
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
