import type { DatavElementMetadata } from '@datav-kit/core'

export const loadingOrbitMetadata = {
  tagName: 'dvk-loading-orbit',
  className: 'LoadingOrbitElement',
  description: 'Two counter-rotating loading rings with datav-kit color cycling and an optional status slot.',
  props: {
    color: {
      type: 'string',
      default: '',
      attribute: true,
      cssVariable: '--dvk-color-primary',
      description: 'Outer ring initial color.',
    },
    secondaryColor: {
      type: 'string',
      default: '',
      attribute: 'secondary-color',
      cssVariable: '--dvk-color-secondary',
      description: 'Inner ring initial color.',
    },
    colors: {
      type: 'string',
      default: '',
      attribute: true,
      description: 'Comma-separated outer and inner ring colors.',
    },
    size: {
      type: 'number',
      default: 50,
      attribute: true,
      description: 'Rendered SVG size in CSS pixels.',
    },
    strokeWidth: {
      type: 'number',
      default: 3,
      attribute: 'stroke-width',
      description: 'Ring stroke width in SVG units.',
    },
    dur: {
      type: 'number',
      default: 1.5,
      attribute: true,
      description: 'Rotation duration in seconds. Color cycling uses twice this duration.',
    },
    animated: {
      type: 'boolean',
      default: true,
      attribute: true,
      description: 'Enables ring rotation and color animation.',
    },
    paused: {
      type: 'boolean',
      default: false,
      attribute: true,
      description: 'Stops animation while keeping the static rings visible.',
    },
  },
  events: [
    {
      name: 'dvk-ready',
      detail: '{ tagName }',
      description: 'Fired after the element first renders.',
    },
  ],
  parts: ['root', 'graphic', 'ring', 'outer-ring', 'inner-ring', 'tip'],
} satisfies DatavElementMetadata
