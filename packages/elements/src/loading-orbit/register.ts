import { defineDatavElement } from '@datav-kit/core'
import { LoadingOrbitElement } from './element'

export function defineLoadingOrbit(): boolean {
  return defineDatavElement('dvk-loading-orbit', LoadingOrbitElement)
}
