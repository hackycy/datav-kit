import { defineDatavElement } from '@datav-kit/core'
import { BorderBox16Element } from './element'

export function defineBorderBox16(): boolean {
  return defineDatavElement('dvk-border-box-16', BorderBox16Element)
}
