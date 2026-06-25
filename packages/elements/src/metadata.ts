import type { DatavElementMetadata } from '@datav-kit/core'
import { borderGlowMetadata } from './border-glow/metadata'
import { fitScreenMetadata } from './fit-screen/metadata'

export type ElementMetadata = DatavElementMetadata

export const elementMetadata: ElementMetadata[] = [
  fitScreenMetadata,
  borderGlowMetadata,
]
