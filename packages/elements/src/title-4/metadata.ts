import type { DatavElementMetadata } from '@datav-kit/core'

export const title4Metadata = {
  tagName: 'dvk-title-4',
  className: 'Title4Element',
  description: 'Flat rail large-screen title header built from straight horizontal rails, quiet inner guides, and short end ticks, with a title-first opening that widens or narrows to match the title box.',
  props: {
    color: {
      type: 'string',
      default: '',
      attribute: true,
      cssVariable: '--dvk-color-primary',
      description: 'Primary cyan color for the main rails, the long quiet ticks, and the title edge dots. Also accepts a DataV-compatible color array when set as a property.',
    },
    secondaryColor: {
      type: 'string',
      default: '',
      attribute: 'secondary-color',
      cssVariable: '--dvk-color-secondary',
      description: 'Secondary blue color for the inner soft rails.',
    },
    accentColor: {
      type: 'string',
      default: '',
      attribute: 'accent-color',
      cssVariable: '--dvk-title-4-accent',
      description: 'Accent cyan color for the short bright ticks at each end of the rail pair.',
    },
    colors: {
      type: 'string',
      default: '',
      attribute: true,
      description: 'Comma-separated primary, secondary, and accent colors.',
    },
    titleText: {
      type: 'string',
      default: '',
      attribute: 'title-text',
      description: 'Optional centered system name. When omitted, the default slot is rendered inside the title area.',
    },
  },
  events: [
    {
      name: 'dvk-ready',
      detail: '{ tagName }',
      description: 'Fired after the element first renders.',
    },
  ],
  parts: [
    'graphic',
    'rail',
    'main-rail',
    'soft-rail',
    'accent',
    'accent-core',
    'accent-tail',
    'edge-dot',
    'edge-dot-left',
    'edge-dot-right',
    'content',
    'title',
    'title-text',
  ],
} satisfies DatavElementMetadata
