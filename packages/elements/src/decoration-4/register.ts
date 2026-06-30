import { defineDatavElement } from '@datav-kit/core'
import { Decoration4Element } from './element'

export function defineDecoration4(): boolean {
  return defineDatavElement('dvk-decoration-4', Decoration4Element)
}
