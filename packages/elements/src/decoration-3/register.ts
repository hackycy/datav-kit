import { defineDatavElement } from '@datav-kit/core'
import { Decoration3Element } from './element'

export function defineDecoration3(): boolean {
  return defineDatavElement('dvk-decoration-3', Decoration3Element)
}
