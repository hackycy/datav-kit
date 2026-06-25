import type { DatavElementMetadata } from '@datav-kit/core'
import { borderBox8Metadata } from './border-box-8/metadata'
import { fitScreenMetadata } from './fit-screen/metadata'

export type ElementMetadata = DatavElementMetadata

export const elementMetadata: ElementMetadata[] = [
  fitScreenMetadata,
  borderBox8Metadata,
]
