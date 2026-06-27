import type { DatavElementMetadata } from '@datav-kit/core'
import { borderBox1Metadata } from './border-box-1/metadata'
import { borderBox2Metadata } from './border-box-2/metadata'
import { borderBox3Metadata } from './border-box-3/metadata'
import { borderBox4Metadata } from './border-box-4/metadata'
import { borderBox5Metadata } from './border-box-5/metadata'
import { countToMetadata } from './count-to/metadata'
import { decoration1Metadata } from './decoration-1/metadata'
import { fitScreenMetadata } from './fit-screen/metadata'

export type ElementMetadata = DatavElementMetadata

export const elementMetadata: ElementMetadata[] = [
  fitScreenMetadata,
  borderBox1Metadata,
  borderBox2Metadata,
  borderBox3Metadata,
  borderBox4Metadata,
  borderBox5Metadata,
  decoration1Metadata,
  countToMetadata,
]
