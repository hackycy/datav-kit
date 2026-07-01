import { defineDatavElement } from '@datav-kit/core'
import { BorderBox14Element } from './element'

export function defineBorderBox14(): boolean {
  return defineDatavElement('dvk-border-box-14', BorderBox14Element)
}
