import { defineDatavElement } from '@datav-kit/core'
import { BorderBox9Element } from './element'

export function defineBorderBox9(): boolean {
  return defineDatavElement('dv-border-box-9', BorderBox9Element)
}
