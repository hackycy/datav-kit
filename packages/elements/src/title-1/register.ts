import { defineDatavElement } from '@datav-kit/core'
import { Title1Element } from './element'

export function defineTitle1(): boolean {
  return defineDatavElement('dvk-title-1', Title1Element)
}
