import type { DatavElementMetadata } from '@datav-kit/core'

export const borderBox12Metadata = {
  tagName: 'dv-border-box-12',
  className: 'BorderBox12Element',
  description: 'Minimal split-bus trace frame for enterprise dashboards with left/top command rails, an offset status dock, sparse terminals, and subtle rail-charge animation.',
  props: {
    color: {
      type: 'string',
      default: '',
      attribute: true,
      cssVariable: '--dv-color-primary',
      description: 'Primary cyan rail and command bus color.',
    },
    secondaryColor: {
      type: 'string',
      default: '',
      attribute: 'secondary-color',
      cssVariable: '--dv-color-secondary',
      description: 'Secondary blue structural line and quiet return rail color.',
    },
    accentColor: {
      type: 'string',
      default: '',
      attribute: 'accent-color',
      cssVariable: '--dv-color-accent',
      description: 'Accent color for live status nodes, checksum marks, and rail-charge glints.',
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
      description: 'Multiplier for SVG blur filters that create the restrained frame halo.',
    },
    animated: {
      type: 'boolean',
      default: true,
      attribute: true,
      description: 'Whether rail-charge glints and the status pulse are rendered.',
    },
    paused: {
      type: 'boolean',
      default: false,
      attribute: true,
      description: 'Disables rail-charge animation while keeping the static split-bus frame visible.',
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
