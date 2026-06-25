import { register } from '@datav-kit/elements'
import DefaultTheme from 'vitepress/theme'
import '@datav-kit/themes/cyber-blue.css'
import '@datav-kit/themes/ice-white.css'
import '@datav-kit/themes/matrix-green.css'
import '@datav-kit/themes/neon-magenta.css'
import '@datav-kit/themes/solar-gold.css'
import './styles.css'

if (typeof window !== 'undefined')
  register()

export default DefaultTheme
