import { defineDatavElement } from '@datav-kit/core'
import { Decoration5Element } from './element'

export function defineDecoration5(): boolean {
  return defineDatavElement('dvk-decoration-5', Decoration5Element)
}
