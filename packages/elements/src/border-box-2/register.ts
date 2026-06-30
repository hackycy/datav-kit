import { defineDatavElement } from '@datav-kit/core'
import { BorderBox2Element } from './element'

export function defineBorderBox2(): boolean {
  return defineDatavElement('dvk-border-box-2', BorderBox2Element)
}
