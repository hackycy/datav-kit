import { defineDatavElement } from '@datav-kit/core'
import { BorderBox5Element } from './element'

export function defineBorderBox5(): boolean {
  return defineDatavElement('dv-border-box-5', BorderBox5Element)
}
