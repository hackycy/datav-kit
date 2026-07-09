import type { DatavElementMetadata } from '@datav-kit/core'

export const title3Metadata = {
  tagName: 'dvk-title-3',
  className: 'Title3Element',
  description: 'Aurora arc large-screen title header with an open curved light-track silhouette, central translucent lens, soft orbit rails, and restrained light-bead terminals.',
  props: {
    color: {
      type: 'string',
      default: '',
      attribute: true,
      cssVariable: '--dvk-color-primary',
      description: 'Primary aurora green color for the main curved rails, lens glow, and title emphasis. Also accepts a DataV-compatible color array when set as a property.',
    },
    secondaryColor: {
      type: 'string',
      default: '',
      attribute: 'secondary-color',
      cssVariable: '--dvk-color-secondary',
      description: 'Secondary cool blue color for the outer arc, lens tint, and quiet terminal marks.',
    },
    accentColor: {
      type: 'string',
      default: '',
      attribute: 'accent-color',
      cssVariable: '--dvk-title-3-accent',
      description: 'Accent aurora pink color for the small central arcs and right-side color drift.',
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
    'aurora-halo',
    'lens-glow',
    'title-lens',
    'title-lens-inner',
    'orbit-rail',
    'outer-rail',
    'inner-rail',
    'base-rail',
    'accent-arc',
    'terminal',
    'left-terminal',
    'right-terminal',
    'light-bead',
    'terminal-mark',
    'content',
    'title',
    'title-text',
  ],
} satisfies DatavElementMetadata
