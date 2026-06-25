import { defineDatavElement } from '@datav-kit/core'
import { BorderBox8Element } from './element'

export function defineBorderBox8(): boolean {
  return defineDatavElement('dv-border-box-8', BorderBox8Element)
}
