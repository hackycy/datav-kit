import type { DatavElementMetadata } from '@datav-kit/core'

export const borderBox13Metadata = {
  tagName: 'dvk-border-box-13',
  className: 'BorderBox13Element',
  description: 'Electric-blue split rail border with fixed source-proportioned corner modules, short side rails, a bottom-extending carrier spine, and subtle endpoint sparkles.',
  props: {
    color: {
      type: 'string',
      default: '',
      attribute: true,
      cssVariable: '--dvk-color-primary',
      description: 'Primary blue frame color.',
    },
    secondaryColor: {
      type: 'string',
      default: '',
      attribute: 'secondary-color',
      cssVariable: '--dvk-color-secondary',
      description: 'Secondary cyan core rail color.',
    },
    accentColor: {
      type: 'string',
      default: '',
      attribute: 'accent-color',
      cssVariable: '--dvk-color-accent',
      description: 'Accent color for the endpoint sparkle dots.',
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
      description: 'Multiplier for the rail and endpoint sparkle glow strength.',
    },
    animated: {
      type: 'boolean',
      default: true,
      attribute: true,
      description: 'Whether the border renders subtle fixed endpoint sparkle animations.',
    },
    paused: {
      type: 'boolean',
      default: false,
      attribute: true,
      description: 'Disables endpoint sparkle motion while keeping the static frame visible.',
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
