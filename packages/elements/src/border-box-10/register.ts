import { defineDatavElement } from '@datav-kit/core'
import { BorderBox10Element } from './element'

export function defineBorderBox10(): boolean {
  return defineDatavElement('dvk-border-box-10', BorderBox10Element)
}
