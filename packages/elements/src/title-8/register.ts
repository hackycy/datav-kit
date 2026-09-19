import { defineDatavElement } from '@datav-kit/core'
import { Title8Element } from './element'

export function defineTitle8(): boolean {
  return defineDatavElement('dvk-title-8', Title8Element)
}
