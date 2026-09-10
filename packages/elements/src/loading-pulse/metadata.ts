import type { DatavElementMetadata } from '@datav-kit/core'

export const loadingPulseMetadata = {
  tagName: 'dvk-loading-pulse',
  className: 'LoadingPulseElement',
  description: 'A compact five-bar loading pulse whose bars rise and fall out of phase from the centre outward, with a quiet track behind each bar and an optional status slot.',
  props: {
    color: {
      type: 'string',
      default: '',
      attribute: true,
      cssVariable: '--dvk-color-primary',
      description: 'Moving bar color.',
    },
    secondaryColor: {
      type: 'string',
      default: '',
      attribute: 'secondary-color',
      cssVariable: '--dvk-color-secondary',
      description: 'Static track color behind each bar.',
    },
    colors: {
      type: 'string',
      default: '',
      attribute: true,
      description: 'Comma-separated bar and track colors.',
    },
    size: {
      type: 'number',
      default: 52,
      attribute: true,
      description: 'Rendered SVG width in CSS pixels. The height follows the bar aspect ratio.',
    },
    dur: {
      type: 'number',
      default: 1.05,
      attribute: true,
      description: 'Pulse cycle duration in seconds. Each bar starts at its own fraction of this value.',
    },
    animated: {
      type: 'boolean',
      default: true,
      attribute: true,
      description: 'Enables the bar pulse.',
    },
    paused: {
      type: 'boolean',
      default: false,
      attribute: true,
      description: 'Stops animation while keeping the resting bar profile visible.',
    },
  },
  events: [
    {
      name: 'dvk-ready',
      detail: '{ tagName }',
      description: 'Fired after the element first renders.',
    },
  ],
  parts: ['root', 'graphic', 'bar', 'bar-track', 'bar-fill', 'tip'],
} satisfies DatavElementMetadata
