import { defineDatavElement } from '@datav-kit/core'
import { Title4Element } from './element'

export function defineTitle4(): boolean {
  return defineDatavElement('dvk-title-4', Title4Element)
}
