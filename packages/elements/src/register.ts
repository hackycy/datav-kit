import type { DatavElementRegistration } from '@datav-kit/core'
import { registerDatavElements } from '@datav-kit/core'

export const datavElementRegistrations: DatavElementRegistration[] = []

export function register(): ReturnType<typeof registerDatavElements> {
  return registerDatavElements(datavElementRegistrations)
}
