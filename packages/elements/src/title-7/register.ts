import { defineDatavElement } from '@datav-kit/core'
import { Title7Element } from './element'

export function defineTitle7(): boolean {
  return defineDatavElement('dvk-title-7', Title7Element)
}
