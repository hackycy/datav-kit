import { defineDatavElement } from '@datav-kit/core'
import { Decoration1Element } from './element'

export function defineDecoration1(): boolean {
  return defineDatavElement('dv-decoration-1', Decoration1Element)
}
