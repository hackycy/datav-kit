import { defineDatavElement } from '@datav-kit/core'
import { Decoration2Element } from './element'

export function defineDecoration2(): boolean {
  return defineDatavElement('dvk-decoration-2', Decoration2Element)
}
