import { defineDatavElement } from '@datav-kit/core'
import { Decoration11Element } from './element'

export function defineDecoration11(): boolean {
  return defineDatavElement('dvk-decoration-11', Decoration11Element)
}
