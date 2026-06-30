import type { Theme } from 'vitepress'
import { register } from '@datav-kit/elements'
import DefaultTheme from 'vitepress/theme'
import AviationCommandScreen from './components/AviationCommandScreen.vue'
import BorderChartDemo from './components/BorderChartDemo.vue'
import '@datav-kit/themes/cyber-blue.css'
import '@datav-kit/themes/ice-white.css'
import '@datav-kit/themes/matrix-green.css'
import '@datav-kit/themes/neon-magenta.css'
import '@datav-kit/themes/solar-gold.css'
import './styles.css'

if (typeof window !== 'undefined')
  register()

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    app.component('AviationCommandScreen', AviationCommandScreen)
    app.component('BorderChartDemo', BorderChartDemo)
  },
} satisfies Theme
