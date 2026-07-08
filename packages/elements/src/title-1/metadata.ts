import type { DatavElementMetadata } from '@datav-kit/core'

export const title1Metadata = {
  tagName: 'dvk-title-1',
  className: 'Title1Element',
  description: 'Slim enterprise large-screen header banner redesigned as one equal-height horizontal light panel, using broad translucent surfaces with only a few guiding rails.',
  props: {
    color: {
      type: 'string',
      default: '',
      attribute: true,
      cssVariable: '--dvk-color-primary',
      description: 'Primary cyan color for the center surface, guiding rails, and soft title emphasis. Also accepts a DataV-compatible color array when set as a property.',
    },
    secondaryColor: {
      type: 'string',
      default: '',
      attribute: 'secondary-color',
      cssVariable: '--dvk-color-secondary',
      description: 'Secondary blue color for the side surfaces, rail gradients, and subtle background glow.',
    },
    accentColor: {
      type: 'string',
      default: '',
      attribute: 'accent-color',
      cssVariable: '--dvk-title-1-accent',
      description: 'Accent color for the restrained center highlight and side surface accents.',
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
    'ambient-glow',
    'side',
    'left-side',
    'right-side',
    'side-surface',
    'rail',
    'main-rail',
    'quiet-rail',
    'surface-accent',
    'center-panel',
    'title-panel',
    'center-edge',
    'accent-core',
    'center-notch',
    'content',
    'title',
    'title-text',
  ],
} satisfies DatavElementMetadata
