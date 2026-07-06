import { defineDatavElement } from '@datav-kit/core'
import { LoadingEnergyElement } from './element'

export function defineLoadingEnergy(): boolean {
  return defineDatavElement('dvk-loading-energy', LoadingEnergyElement)
}
