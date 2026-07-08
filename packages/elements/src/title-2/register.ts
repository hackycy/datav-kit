import { defineDatavElement } from '@datav-kit/core'
import { Title2Element } from './element'

export function defineTitle2(): boolean {
  return defineDatavElement('dvk-title-2', Title2Element)
}
