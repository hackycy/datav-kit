import { defineDatavElement } from '@datav-kit/core'
import { Decoration9Element } from './element'

export function defineDecoration9(): boolean {
  return defineDatavElement('dvk-decoration-9', Decoration9Element)
}
