import { defineDatavElement } from '@datav-kit/core'
import { BorderBox12Element } from './element'

export function defineBorderBox12(): boolean {
  return defineDatavElement('dv-border-box-12', BorderBox12Element)
}
