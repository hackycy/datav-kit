import { defineDatavElement } from '@datav-kit/core'
import { BorderBox11Element } from './element'

export function defineBorderBox11(): boolean {
  return defineDatavElement('dvk-border-box-11', BorderBox11Element)
}
