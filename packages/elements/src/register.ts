import type { DatavElementRegistration } from '@datav-kit/core'
import { registerDatavElements } from '@datav-kit/core'
import { BorderGlowElement } from './border-glow/element'
import { FitScreenElement } from './fit-screen/element'

export const datavElementRegistrations: DatavElementRegistration[] = [
  {
    tagName: 'dv-fit-screen',
    element: FitScreenElement,
  },
  {
    tagName: 'dv-border-glow',
    element: BorderGlowElement,
  },
]

export function register(): ReturnType<typeof registerDatavElements> {
  return registerDatavElements(datavElementRegistrations)
}
