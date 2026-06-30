import { defineDatavElement } from '@datav-kit/core'
import { CountToElement } from './element'

export function defineCountTo(): boolean {
  return defineDatavElement('dvk-count-to', CountToElement)
}
