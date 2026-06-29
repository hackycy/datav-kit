import type { DatavElementMetadata } from '@datav-kit/core'
import { borderBox1Metadata } from './border-box-1/metadata'
import { borderBox2Metadata } from './border-box-2/metadata'
import { borderBox3Metadata } from './border-box-3/metadata'
import { borderBox4Metadata } from './border-box-4/metadata'
import { borderBox5Metadata } from './border-box-5/metadata'
import { borderBox6Metadata } from './border-box-6/metadata'
import { borderBox7Metadata } from './border-box-7/metadata'
import { borderBox8Metadata } from './border-box-8/metadata'
import { borderBox9Metadata } from './border-box-9/metadata'
import { borderBox10Metadata } from './border-box-10/metadata'
import { borderBox11Metadata } from './border-box-11/metadata'
import { countToMetadata } from './count-to/metadata'
import { decoration1Metadata } from './decoration-1/metadata'
import { decoration2Metadata } from './decoration-2/metadata'
import { decoration3Metadata } from './decoration-3/metadata'
import { fitScreenMetadata } from './fit-screen/metadata'

export type ElementMetadata = DatavElementMetadata

export const elementMetadata: ElementMetadata[] = [
  fitScreenMetadata,
  borderBox1Metadata,
  borderBox2Metadata,
  borderBox3Metadata,
  borderBox4Metadata,
  borderBox5Metadata,
  borderBox6Metadata,
  borderBox7Metadata,
  borderBox8Metadata,
  borderBox9Metadata,
  borderBox10Metadata,
  borderBox11Metadata,
  decoration1Metadata,
  decoration2Metadata,
  decoration3Metadata,
  countToMetadata,
]
