import { defineDatavElement } from '@datav-kit/core'
import { FitScreenElement } from './element'

export function defineFitScreen(): boolean {
  return defineDatavElement('dv-fit-screen', FitScreenElement)
}
