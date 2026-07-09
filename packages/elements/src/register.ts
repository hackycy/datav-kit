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
import { BorderBox12Element } from './border-box-12/element'
import { BorderBox13Element } from './border-box-13/element'
import { BorderBox14Element } from './border-box-14/element'
import { BorderBox15Element } from './border-box-15/element'
import { BorderBox16Element } from './border-box-16/element'
import { CountToElement } from './count-to/element'
import { Decoration1Element } from './decoration-1/element'
import { Decoration2Element } from './decoration-2/element'
import { Decoration3Element } from './decoration-3/element'
import { Decoration4Element } from './decoration-4/element'
import { Decoration5Element } from './decoration-5/element'
import { Decoration6Element } from './decoration-6/element'
import { Decoration7Element } from './decoration-7/element'
import { Decoration8Element } from './decoration-8/element'
import { Decoration9Element } from './decoration-9/element'
import { Decoration10Element } from './decoration-10/element'
import { Decoration11Element } from './decoration-11/element'
import { FitScreenElement } from './fit-screen/element'
import { LoadingEnergyElement } from './loading-energy/element'
import { LoadingOrbitElement } from './loading-orbit/element'
import { PerformanceMonitorElement } from './performance-monitor/element'
import { Title1Element } from './title-1/element'
import { Title2Element } from './title-2/element'
import { Title3Element } from './title-3/element'

export const datavElementRegistrations: DatavElementRegistration[] = [
  {
    tagName: 'dvk-fit-screen',
    element: FitScreenElement,
  },
  {
    tagName: 'dvk-border-box-1',
    element: BorderBox1Element,
  },
  {
    tagName: 'dvk-border-box-2',
    element: BorderBox2Element,
  },
  {
    tagName: 'dvk-border-box-3',
    element: BorderBox3Element,
  },
  {
    tagName: 'dvk-border-box-4',
    element: BorderBox4Element,
  },
  {
    tagName: 'dvk-border-box-5',
    element: BorderBox5Element,
  },
  {
    tagName: 'dvk-border-box-6',
    element: BorderBox6Element,
  },
  {
    tagName: 'dvk-border-box-7',
    element: BorderBox7Element,
  },
  {
    tagName: 'dvk-border-box-8',
    element: BorderBox8Element,
  },
  {
    tagName: 'dvk-border-box-9',
    element: BorderBox9Element,
  },
  {
    tagName: 'dvk-border-box-10',
    element: BorderBox10Element,
  },
  {
    tagName: 'dvk-border-box-11',
    element: BorderBox11Element,
  },
  {
    tagName: 'dvk-border-box-12',
    element: BorderBox12Element,
  },
  {
    tagName: 'dvk-border-box-13',
    element: BorderBox13Element,
  },
  {
    tagName: 'dvk-border-box-14',
    element: BorderBox14Element,
  },
  {
    tagName: 'dvk-border-box-15',
    element: BorderBox15Element,
  },
  {
    tagName: 'dvk-border-box-16',
    element: BorderBox16Element,
  },
  {
    tagName: 'dvk-decoration-1',
    element: Decoration1Element,
  },
  {
    tagName: 'dvk-decoration-2',
    element: Decoration2Element,
  },
  {
    tagName: 'dvk-decoration-3',
    element: Decoration3Element,
  },
  {
    tagName: 'dvk-decoration-4',
    element: Decoration4Element,
  },
  {
    tagName: 'dvk-decoration-5',
    element: Decoration5Element,
  },
  {
    tagName: 'dvk-decoration-6',
    element: Decoration6Element,
  },
  {
    tagName: 'dvk-decoration-7',
    element: Decoration7Element,
  },
  {
    tagName: 'dvk-decoration-8',
    element: Decoration8Element,
  },
  {
    tagName: 'dvk-decoration-9',
    element: Decoration9Element,
  },
  {
    tagName: 'dvk-decoration-10',
    element: Decoration10Element,
  },
  {
    tagName: 'dvk-decoration-11',
    element: Decoration11Element,
  },
  {
    tagName: 'dvk-title-1',
    element: Title1Element,
  },
  {
    tagName: 'dvk-title-2',
    element: Title2Element,
  },
  {
    tagName: 'dvk-title-3',
    element: Title3Element,
  },
  {
    tagName: 'dvk-count-to',
    element: CountToElement,
  },
  {
    tagName: 'dvk-loading-orbit',
    element: LoadingOrbitElement,
  },
  {
    tagName: 'dvk-loading-energy',
    element: LoadingEnergyElement,
  },
  {
    tagName: 'dvk-performance-monitor',
    element: PerformanceMonitorElement,
  },
]

export function register(): ReturnType<typeof registerDatavElements> {
  return registerDatavElements(datavElementRegistrations)
}
