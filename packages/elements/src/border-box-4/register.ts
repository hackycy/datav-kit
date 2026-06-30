import { defineDatavElement } from '@datav-kit/core'
import { BorderBox4Element } from './element'

export function defineBorderBox4(): boolean {
  return defineDatavElement('dvk-border-box-4', BorderBox4Element)
}
