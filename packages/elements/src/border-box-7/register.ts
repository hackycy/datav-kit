import { defineDatavElement } from '@datav-kit/core'
import { BorderBox7Element } from './element'

export function defineBorderBox7(): boolean {
  return defineDatavElement('dvk-border-box-7', BorderBox7Element)
}
