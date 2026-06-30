import type { DatavElementMetadata } from '@datav-kit/core'

export const countToMetadata = {
  tagName: 'dvk-count-to',
  className: 'CountToElement',
  description: 'Animated numeric value that counts from a start value to an end value.',
  props: {
    startVal: {
      type: 'number',
      default: 0,
      attribute: 'start-val',
      description: 'Initial value used when the counter starts or restarts.',
    },
    endVal: {
      type: 'number',
      default: 0,
      attribute: 'end-val',
      description: 'Target value displayed after the count animation finishes.',
    },
    duration: {
      type: 'number',
      default: 2000,
      attribute: true,
      description: 'Animation duration in milliseconds.',
    },
    delay: {
      type: 'number',
      default: 0,
      attribute: true,
      description: 'Delay before the animation starts, in milliseconds.',
    },
    decimals: {
      type: 'number',
      default: 0,
      attribute: true,
      description: 'Number of decimal places to render.',
    },
    decimal: {
      type: 'string',
      default: '.',
      attribute: true,
      description: 'Decimal separator.',
    },
    separator: {
      type: 'string',
      default: ',',
      attribute: true,
      description: 'Thousands separator.',
    },
    prefix: {
      type: 'string',
      default: '',
      attribute: true,
      description: 'Text rendered before the number when no prefix slot is provided.',
    },
    suffix: {
      type: 'string',
      default: '',
      attribute: true,
      description: 'Text rendered after the number when no suffix slot is provided.',
    },
    disabled: {
      type: 'boolean',
      default: false,
      attribute: true,
      description: 'Disables animation and immediately renders the target value.',
    },
    transition: {
      type: 'string',
      default: 'easeOutExpo',
      attribute: true,
      description: 'Transition preset: linear, easeOutCubic, easeInOutCubic, or easeOutExpo.',
    },
  },
  events: [
    {
      name: 'dvk-started',
      detail: '{ from, to, duration, delay }',
      description: 'Fired when the count animation starts.',
    },
    {
      name: 'dvk-finished',
      detail: '{ value }',
      description: 'Fired when the count animation reaches the target value.',
    },
  ],
  parts: ['root', 'prefix', 'main', 'integer', 'decimal', 'suffix'],
} satisfies DatavElementMetadata
