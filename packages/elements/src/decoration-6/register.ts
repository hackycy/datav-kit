import { defineDatavElement } from '@datav-kit/core'
import { Decoration6Element } from './element'

export function defineDecoration6(): boolean {
  return defineDatavElement('dvk-decoration-6', Decoration6Element)
}
