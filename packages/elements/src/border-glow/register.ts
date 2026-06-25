import { defineDatavElement } from '@datav-kit/core'
import { BorderGlowElement } from './element'

export function defineBorderGlow(): boolean {
  return defineDatavElement('dv-border-glow', BorderGlowElement)
}
