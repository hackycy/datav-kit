import { defineDatavElement } from '@datav-kit/core'
import { LoadingPulseElement } from './element'

export function defineLoadingPulse(): boolean {
  return defineDatavElement('dvk-loading-pulse', LoadingPulseElement)
}
