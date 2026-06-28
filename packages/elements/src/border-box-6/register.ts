import { defineDatavElement } from '@datav-kit/core'
import { BorderBox6Element } from './element'

export function defineBorderBox6(): boolean {
  return defineDatavElement('dv-border-box-6', BorderBox6Element)
}
