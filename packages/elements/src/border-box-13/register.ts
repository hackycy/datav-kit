import { defineDatavElement } from '@datav-kit/core'
import { BorderBox13Element } from './element'

export function defineBorderBox13(): boolean {
  return defineDatavElement('dvk-border-box-13', BorderBox13Element)
}
