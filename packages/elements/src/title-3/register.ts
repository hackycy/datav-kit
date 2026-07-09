import { defineDatavElement } from '@datav-kit/core'
import { Title3Element } from './element'

export function defineTitle3(): boolean {
  return defineDatavElement('dvk-title-3', Title3Element)
}
