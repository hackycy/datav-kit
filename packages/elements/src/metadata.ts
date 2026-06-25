export interface ElementMetadata {
  tagName: string
  className: string
  props: Record<string, unknown>
  events: string[]
  parts: string[]
}

export const elementMetadata: ElementMetadata[] = []
