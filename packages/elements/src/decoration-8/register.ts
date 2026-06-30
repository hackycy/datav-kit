import { defineDatavElement } from '@datav-kit/core'
import { Decoration8Element } from './element'

export function defineDecoration8(): boolean {
  return defineDatavElement('dvk-decoration-8', Decoration8Element)
}
