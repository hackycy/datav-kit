import type { DatavElementRegistration } from '@datav-kit/core'
import { registerDatavElements } from '@datav-kit/core'
import { BorderBox1Element } from './border-box-1/element'
import { BorderBox2Element } from './border-box-2/element'
import { BorderBox3Element } from './border-box-3/element'
import { BorderBox4Element } from './border-box-4/element'
import { BorderBox5Element } from './border-box-5/element'
import { BorderBox6Element } from './border-box-6/element'
import { BorderBox7Element } from './border-box-7/element'
import { BorderBox8Element } from './border-box-8/element'
import { BorderBox9Element } from './border-box-9/element'
import { BorderBox10Element } from './border-box-10/element'
import { BorderBox11Element } from './border-box-11/element'
import { CountToElement } from './count-to/element'
import { Decoration1Element } from './decoration-1/element'
import { Decoration2Element } from './decoration-2/element'
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
  {
    tagName: 'dv-border-box-2',
    element: BorderBox2Element,
  },
  {
    tagName: 'dv-border-box-3',
    element: BorderBox3Element,
  },
  {
    tagName: 'dv-border-box-4',
    element: BorderBox4Element,
  },
  {
    tagName: 'dv-border-box-5',
    element: BorderBox5Element,
  },
  {
    tagName: 'dv-border-box-6',
    element: BorderBox6Element,
  },
  {
    tagName: 'dv-border-box-7',
    element: BorderBox7Element,
  },
  {
    tagName: 'dv-border-box-8',
    element: BorderBox8Element,
  },
  {
    tagName: 'dv-border-box-9',
    element: BorderBox9Element,
  },
  {
    tagName: 'dv-border-box-10',
    element: BorderBox10Element,
  },
  {
    tagName: 'dv-border-box-11',
    element: BorderBox11Element,
  },
  {
    tagName: 'dv-decoration-1',
    element: Decoration1Element,
  },
  {
    tagName: 'dv-decoration-2',
    element: Decoration2Element,
  },
  {
    tagName: 'dv-count-to',
    element: CountToElement,
  },
]

export function register(): ReturnType<typeof registerDatavElements> {
  return registerDatavElements(datavElementRegistrations)
}
