import type { DatavElementRegistration } from '@datav-kit/core'
import { registerDatavElements } from '@datav-kit/core'
import { BorderBox8Element } from './border-box-8/element'
import { FitScreenElement } from './fit-screen/element'

export const datavElementRegistrations: DatavElementRegistration[] = [
  {
    tagName: 'dv-fit-screen',
    element: FitScreenElement,
  },
  {
    tagName: 'dv-border-box-8',
    element: BorderBox8Element,
  },
]

export function register(): ReturnType<typeof registerDatavElements> {
  return registerDatavElements(datavElementRegistrations)
}
