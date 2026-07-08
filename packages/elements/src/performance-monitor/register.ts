import { defineDatavElement } from '@datav-kit/core'
import { PerformanceMonitorElement } from './element'

export function definePerformanceMonitor(): boolean {
  return defineDatavElement('dvk-performance-monitor', PerformanceMonitorElement)
}
