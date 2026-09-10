import { defineDatavElement } from '@datav-kit/core'
import { Title5Element } from './element'

export function defineTitle5(): boolean {
  return defineDatavElement('dvk-title-5', Title5Element)
}
