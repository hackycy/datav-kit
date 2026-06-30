import { defineDatavElement } from '@datav-kit/core'
import { Decoration7Element } from './element'

export function defineDecoration7(): boolean {
  return defineDatavElement('dvk-decoration-7', Decoration7Element)
}
