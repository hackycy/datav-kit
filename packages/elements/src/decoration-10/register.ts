import { defineDatavElement } from '@datav-kit/core'
import { Decoration10Element } from './element'

export function defineDecoration10(): boolean {
  return defineDatavElement('dvk-decoration-10', Decoration10Element)
}
