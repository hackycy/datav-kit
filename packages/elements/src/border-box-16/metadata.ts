import type { DatavElementMetadata } from '@datav-kit/core'

export const borderBox16Metadata = {
  tagName: 'dvk-border-box-16',
  className: 'BorderBox16Element',
  description: 'Floating CPU-like thin border with broken outer rails, open corner-retreat hairlines, shallow edge pins, sparse chip pads, and subtle pin pulse motion.',
  props: {
    color: {
      type: 'string',
      default: '',
      attribute: true,
      cssVariable: '--dvk-color-primary',
      description: 'Primary chip perimeter rail color.',
    },
    secondaryColor: {
      type: 'string',
      default: '',
      attribute: 'secondary-color',
      cssVariable: '--dvk-color-secondary',
      description: 'Secondary hairline and pin color.',
    },
    accentColor: {
      type: 'string',
      default: '',
      attribute: 'accent-color',
      cssVariable: '--dvk-color-accent',
      description: 'Accent color for active chip pads and pulsing pins.',
    },
    colors: {
      type: 'string',
      default: '',
      attribute: true,
      description: 'Comma-separated primary, secondary, and accent colors.',
    },
    glowIntensity: {
      type: 'number',
      default: 0.7,
      attribute: 'glow-intensity',
      description: 'Multiplier for the active pin and pad glow strength.',
    },
    animated: {
      type: 'boolean',
      default: true,
      attribute: true,
      description: 'Whether the border renders subtle chip pin pulse animations.',
    },
    paused: {
      type: 'boolean',
      default: false,
      attribute: true,
      description: 'Disables chip pin motion while keeping the static frame visible.',
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
