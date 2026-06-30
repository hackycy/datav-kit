import { defineDatavElement } from '@datav-kit/core'
import { BorderBox3Element } from './element'

export function defineBorderBox3(): boolean {
  return defineDatavElement('dvk-border-box-3', BorderBox3Element)
}
