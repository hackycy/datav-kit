import { defineDatavElement } from '@datav-kit/core'
import { Title6Element } from './element'

export function defineTitle6(): boolean {
  return defineDatavElement('dvk-title-6', Title6Element)
}
