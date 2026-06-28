import { defineDatavElement } from '@datav-kit/core'
import { BorderBox7Element } from './element'

export function defineBorderBox7(): boolean {
  return defineDatavElement('dv-border-box-7', BorderBox7Element)
}
