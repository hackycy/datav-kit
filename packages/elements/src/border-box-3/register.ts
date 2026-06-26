import { defineDatavElement } from '@datav-kit/core'
import { BorderBox3Element } from './element'

export function defineBorderBox3(): boolean {
  return defineDatavElement('dv-border-box-3', BorderBox3Element)
}
