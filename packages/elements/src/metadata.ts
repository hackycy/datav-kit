import type { DatavElementMetadata } from '@datav-kit/core'
import { borderBox1Metadata } from './border-box-1/metadata'
import { fitScreenMetadata } from './fit-screen/metadata'

export type ElementMetadata = DatavElementMetadata

export const elementMetadata: ElementMetadata[] = [
  fitScreenMetadata,
  borderBox1Metadata,
]
