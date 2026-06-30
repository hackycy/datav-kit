import { defineDatavElement } from '@datav-kit/core'
import { BorderBox8Element } from './element'

export function defineBorderBox8(): boolean {
  return defineDatavElement('dvk-border-box-8', BorderBox8Element)
}
