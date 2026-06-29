import type { DatavElementMetadata } from '@datav-kit/core'

export const borderBox11Metadata = {
  tagName: 'dv-border-box-11',
  className: 'BorderBox11Element',
  description: 'High-density cyber command-console frame with fixed corner armor, center docks, side sensor racks, stretch-safe rails, and configurable neon glow.',
  props: {
    color: {
      type: 'string',
      default: '',
      attribute: true,
      cssVariable: '--dv-color-primary',
      description: 'Primary cyan rail, armor, and node color.',
    },
    secondaryColor: {
      type: 'string',
      default: '',
      attribute: 'secondary-color',
      cssVariable: '--dv-color-secondary',
      description: 'Secondary blue glow and dim structural line color.',
    },
    accentColor: {
      type: 'string',
      default: '',
      attribute: 'accent-color',
      cssVariable: '--dv-color-accent',
      description: 'Accent color for glints, moving scan lights, and fine hatches.',
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
      description: 'Multiplier for SVG blur filters that create the neon halo.',
    },
    animated: {
      type: 'boolean',
      default: true,
      attribute: true,
      description: 'Whether scan lights and pulse glints are rendered.',
    },
    paused: {
      type: 'boolean',
      default: false,
      attribute: true,
      description: 'Disables scan light animation while keeping the static frame visible.',
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
