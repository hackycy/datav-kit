import type { DatavElementRegistration } from '@datav-kit/core'
import { registerDatavElements } from '@datav-kit/core'
import { BorderBox1Element } from './border-box-1/element'
import { FitScreenElement } from './fit-screen/element'

export const datavElementRegistrations: DatavElementRegistration[] = [
  {
    tagName: 'dv-fit-screen',
    element: FitScreenElement,
  },
  {
    tagName: 'dv-border-box-1',
    element: BorderBox1Element,
  },
]

export function register(): ReturnType<typeof registerDatavElements> {
  return registerDatavElements(datavElementRegistrations)
}
