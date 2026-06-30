import { defineDatavElement } from '@datav-kit/core'
import { BorderBox1Element } from './element'

export function defineBorderBox1(): boolean {
  return defineDatavElement('dvk-border-box-1', BorderBox1Element)
}
