import { defineDatavElement } from '@datav-kit/core'
import { BorderBox1Element } from './element'

export function defineBorderBox1(): boolean {
  return defineDatavElement('dv-border-box-1', BorderBox1Element)
}
