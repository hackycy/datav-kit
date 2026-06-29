import { defineDatavElement } from '@datav-kit/core'
import { Decoration4Element } from './element'

export function defineDecoration4(): boolean {
  return defineDatavElement('dv-decoration-4', Decoration4Element)
}
