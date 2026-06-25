import type { DatavElementMetadata } from '@datav-kit/core'

export const borderGlowMetadata = {
  tagName: 'dv-border-glow',
  className: 'BorderGlowElement',
  description: 'A glowing SVG border container for dashboard panels.',
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
      description: 'Secondary gradient color.',
    },
    colors: {
      type: 'string',
      default: '',
      attribute: true,
      description: 'Comma-separated primary and secondary colors.',
    },
    intensity: {
      type: 'number',
      default: 0.8,
      attribute: true,
      description: 'Glow intensity from 0 to 1.',
    },
    radius: {
      type: 'number',
      default: 16,
      attribute: true,
      description: 'Corner radius in pixels.',
    },
    animated: {
      type: 'boolean',
      default: true,
      attribute: true,
      description: 'Whether the border dash animation is enabled.',
    },
    paused: {
      type: 'boolean',
      default: false,
      attribute: true,
      description: 'Whether animation is paused even when animated is enabled.',
    },
    duration: {
      type: 'number',
      default: 2400,
      attribute: true,
      cssVariable: '--dv-motion-duration',
      description: 'Animation duration in milliseconds.',
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
