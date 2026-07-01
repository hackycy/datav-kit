import { DatavElement, ResizeController, resolveNumberValue, resolveThemeValue } from '@datav-kit/core'
import { css, html, svg } from 'lit'
import { property, state } from 'lit/decorators.js'

interface BorderBox13Size {
  width: number
  height: number
}

interface BorderBox13Rect {
  x: number
  y: number
  width: number
  height: number
}

interface BorderBox13Geometry {
  width: number
  height: number
  backgroundPanel: BorderBox13Rect
  mainPaths: string[]
  corePaths: string[]
  signalSparks: BorderBox13SignalSpark[]
}

interface BorderBox13SignalSpark {
  x: number
  y: number
  radius: number
  begin: string
  duration: string
}

const defaultSize: BorderBox13Size = {
  width: 0,
  height: 0,
}
const sourceViewBox: BorderBox13Rect = {
  x: 66,
  y: 83,
  width: 1788,
  height: 901,
}
const contentRect: BorderBox13Rect = {
  x: 101,
  y: 118,
  width: 1718,
  height: 831,
}
let borderBox13Id = 0

export class BorderBox13Element extends DatavElement {
  static override styles = css`
    :host {
      display: block;
      position: relative;
      width: 100%;
      height: 100%;
      min-width: 0;
      min-height: 0;
      box-sizing: border-box;
      color: var(--dvk-color-primary, #1b8cff);
      overflow: hidden;
    }

    .frame {
      position: absolute;
      inset: 0;
      pointer-events: none;
    }

    svg {
      display: block;
      overflow: visible;
    }

    .panel {
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
    }

    path,
    rect,
    circle {
      vector-effect: non-scaling-stroke;
    }

    .content {
      position: relative;
      z-index: 1;
      box-sizing: border-box;
      width: 100%;
      height: 100%;
      min-height: 0;
      padding: var(--dvk-border-box-13-padding, var(--dvk-border-box-padding, var(--dvk-border-box-auto-padding)));
    }

    @media (prefers-reduced-motion: reduce) {
      animate {
        display: none;
      }
    }
  `

  @property()
  color = ''

  @property({ attribute: 'secondary-color' })
  secondaryColor = ''

  @property({ attribute: 'accent-color' })
  accentColor = ''

  @property()
  colors = ''

  @property({ type: Number, attribute: 'glow-intensity' })
  glowIntensity = 1

  @property({ type: Boolean })
  animated = true

  @property({ type: Boolean })
  paused = false

  @state()
  private size = defaultSize

  private readonly instanceId = ++borderBox13Id
  private readonly glowId = `dvk-border-box-13-glow-${this.instanceId}`
  private readonly railGradientId = `dvk-border-box-13-rail-${this.instanceId}`
  private readonly signalGradientId = `dvk-border-box-13-signal-${this.instanceId}`

  private readonly resizeController = new ResizeController(this, (state) => {
    this.size = {
      width: Math.max(state.width, 0),
      height: Math.max(state.height, 0),
    }
  })

  override firstUpdated(): void {
    this.emit('dvk-ready', { tagName: 'dvk-border-box-13' })
  }

  override render(): unknown {
    const [primary, secondary, accent] = this.resolveColors()
    const glowIntensity = Math.max(resolveNumberValue(this.glowIntensity, 1), 0)
    const geometry = this.createGeometry()
    const { width, height } = geometry
    const contentPadding = createContentPadding(height)

    return html`
      <div part="frame" class="frame">
        <svg part="graphic" class="panel" width=${String(width)} height=${String(height)} viewBox=${`0 0 ${width} ${height}`} aria-hidden="true">
          <defs>${this.renderDefs(primary, secondary, accent, glowIntensity)}</defs>
          ${this.renderBackgroundPanel(geometry)}
          ${this.renderMainRails(geometry, glowIntensity)}
          ${this.renderCoreRails(geometry, secondary)}
          ${this.renderSignalSparks(geometry, glowIntensity)}
        </svg>
      </div>
      <div part="content" class="content" style=${`--dvk-border-box-auto-padding: ${contentPadding}`}>
        <slot></slot>
      </div>
    `
  }

  private renderDefs(primary: string, secondary: string, accent: string, glowIntensity: number): unknown {
    return svg`
      ${this.renderGlowFilter(primary, glowIntensity)}
      <linearGradient id=${this.railGradientId} x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stop-color=${withAlpha(primary, 0.62)}></stop>
        <stop offset="0.46" stop-color=${secondary}></stop>
        <stop offset="1" stop-color=${withAlpha(primary, 0.62)}></stop>
      </linearGradient>
      <radialGradient id=${this.signalGradientId} cx="0.5" cy="0.5" r="0.72">
        <stop offset="0" stop-color=${accent}></stop>
        <stop offset="0.58" stop-color=${withAlpha(accent, 0.72)}></stop>
        <stop offset="1" stop-color=${withAlpha(accent, 0.08)}></stop>
      </radialGradient>
    `
  }

  private renderGlowFilter(_primary: string, glowIntensity: number): unknown {
    const tightBlur = Number((4 * glowIntensity).toFixed(2))
    const softBlur = Number((10 * glowIntensity).toFixed(2))

    return svg`
      <filter id=${this.glowId} height="190%" width="190%" x="-45%" y="-45%" color-interpolation-filters="sRGB">
        <feGaussianBlur in="SourceGraphic" stdDeviation=${String(tightBlur)} result="blur1"></feGaussianBlur>
        <feGaussianBlur in="SourceGraphic" stdDeviation=${String(softBlur)} result="blur2"></feGaussianBlur>
        <feMerge>
          <feMergeNode in="blur2"></feMergeNode>
          <feMergeNode in="blur1"></feMergeNode>
          <feMergeNode in="SourceGraphic"></feMergeNode>
        </feMerge>
      </filter>
    `
  }

  private renderBackgroundPanel(geometry: BorderBox13Geometry): unknown {
    return svg`
      <rect data-panel="background" x="0" y="0" width=${String(geometry.backgroundPanel.width)} height=${String(geometry.backgroundPanel.height)} fill="#020407"></rect>
    `
  }

  private renderMainRails(geometry: BorderBox13Geometry, glowIntensity: number): unknown {
    const filter = glowIntensity > 0 ? `url(#${this.glowId})` : ''

    return svg`
      <g
        data-layer="primary-rails"
        class="glowed"
        fill="none"
        stroke=${`url(#${this.railGradientId})`}
        stroke-width="3"
        stroke-linecap="square"
        stroke-linejoin="miter"
        filter=${filter}
      >
        ${geometry.mainPaths.map(path => svg`<path data-rail="primary" d=${path}></path>`)}
      </g>
    `
  }

  private renderCoreRails(geometry: BorderBox13Geometry, secondary: string): unknown {
    return svg`
      <g
        data-layer="core-rails"
        fill="none"
        stroke=${withAlpha(secondary, 0.94)}
        stroke-width="1.2"
        stroke-linecap="square"
        stroke-linejoin="miter"
      >
        ${geometry.corePaths.map(path => svg`<path data-rail="core" d=${path}></path>`)}
      </g>
    `
  }

  private renderSignalSparks(geometry: BorderBox13Geometry, glowIntensity: number): unknown {
    const filter = glowIntensity > 0 ? `url(#${this.glowId})` : ''

    return svg`
      <g
        data-layer="signal-sparks"
        class="glowed"
        fill=${`url(#${this.signalGradientId})`}
        filter=${filter}
      >
        ${geometry.signalSparks.map((spark, index) => this.renderSignalSpark(spark, index))}
      </g>
    `
  }

  private renderSignalSpark(spark: BorderBox13SignalSpark, index: number): unknown {
    return svg`
      <circle
        data-signal-spark=${String(index + 1)}
        data-motion="endpoint-sparkle"
        cx=${String(round(spark.x))}
        cy=${String(round(spark.y))}
        r=${String(spark.radius)}
        opacity="0.2"
      >
        ${this.animated && !this.paused
          ? svg`
              <animate attributeName="opacity" values="0.12;0.72;0.18;0.46;0.12" keyTimes="0;0.14;0.42;0.7;1" dur=${spark.duration} begin=${spark.begin} repeatCount="indefinite"></animate>
              <animate attributeName="r" values="1.6;3.4;1.9;2.7;1.6" keyTimes="0;0.14;0.42;0.7;1" dur=${spark.duration} begin=${spark.begin} repeatCount="indefinite"></animate>
            `
          : null}
      </circle>
    `
  }

  private createGeometry(): BorderBox13Geometry {
    const width = Math.max(this.size.width, 1)
    const height = Math.max(this.size.height, 1)
    const sourceX = (value: number): number => round((value - sourceViewBox.x) / sourceViewBox.width * width)
    const sourceY = (value: number): number => round((value - sourceViewBox.y) / sourceViewBox.height * height)
    const p = (x: number, y: number): string => `${round(x)} ${round(y)}`
    const line = (fromX: number, fromY: number, toX: number, toY: number): string => `M ${p(sourceX(fromX), sourceY(fromY))} L ${p(sourceX(toX), sourceY(toY))}`
    const signalTiming = (index: number): Pick<BorderBox13SignalSpark, 'begin' | 'duration'> => ({
      begin: `${Number((index * 0.61).toFixed(2))}s`,
      duration: `${Number((5.2 + (index % 3) * 0.48).toFixed(2))}s`,
    })
    const signalSpark = (x: number, y: number, index: number): BorderBox13SignalSpark => ({
      x: sourceX(x),
      y: sourceY(y),
      radius: 2.2,
      ...signalTiming(index),
    })

    const topLeftCapPath = line(78, 95, 135, 95)
    const topLeftLegPath = line(78, 95, 78, 160)
    const topLeftChamferPath = line(135, 95, 152, 108)
    const topLeftRailPath = line(152, 108, 585, 108)
    const topLeftTailPath = line(78, 160, 78, 170)
    const topRightCapPath = line(1785, 95, 1842, 95)
    const topRightLegPath = line(1842, 95, 1842, 160)
    const topRightChamferPath = line(1785, 95, 1768, 108)
    const topRightRailPath = line(1335, 108, 1768, 108)
    const topRightTailPath = line(1842, 160, 1842, 170)
    const leftSideRailPath = line(78, 455, 78, 605)
    const rightSideRailPath = line(1842, 455, 1842, 605)
    const bottomLeftLegPath = line(78, 885, 78, 965)
    const bottomLeftFootPath = line(78, 965, 138, 965)
    const bottomLeftInnerPath = line(84, 902, 84, 950)
    const bottomLeftChamferPath = line(138, 965, 158, 952)
    const bottomLeftRailPath = line(158, 952, 865, 952)
    const bottomLeftCenterPath = line(865, 952, 888, 972)
    const bottomCenterBreakPath = line(910, 972, 1010, 972)
    const bottomRightCenterPath = line(1032, 972, 1055, 952)
    const bottomRightRailPath = line(1055, 952, 1762, 952)
    const bottomRightChamferPath = line(1762, 952, 1782, 965)
    const bottomRightFootPath = line(1782, 965, 1842, 965)
    const bottomRightLegPath = line(1842, 965, 1842, 885)
    const bottomRightInnerPath = line(1836, 902, 1836, 950)
    const mainPaths = [
      topLeftCapPath,
      topLeftLegPath,
      topLeftChamferPath,
      topLeftRailPath,
      topLeftTailPath,
      topRightCapPath,
      topRightLegPath,
      topRightChamferPath,
      topRightRailPath,
      topRightTailPath,
      leftSideRailPath,
      rightSideRailPath,
      bottomLeftLegPath,
      bottomLeftFootPath,
      bottomLeftInnerPath,
      bottomLeftChamferPath,
      bottomLeftRailPath,
      bottomLeftCenterPath,
      bottomCenterBreakPath,
      bottomRightCenterPath,
      bottomRightRailPath,
      bottomRightChamferPath,
      bottomRightFootPath,
      bottomRightLegPath,
      bottomRightInnerPath,
    ]

    return {
      width,
      height,
      backgroundPanel: {
        x: 0,
        y: 0,
        width,
        height,
      },
      mainPaths,
      corePaths: mainPaths,
      signalSparks: [
        signalSpark(78, 95, 0),
        signalSpark(1842, 95, 1),
        signalSpark(78, 530, 2),
        signalSpark(1842, 530, 3),
        signalSpark(158, 952, 4),
        signalSpark(1762, 952, 5),
        signalSpark(888, 972, 6),
        signalSpark(1010, 972, 7),
      ],
    }
  }

  private resolveColors(): [string, string, string] {
    const colors = this.colors.split(',').map(color => color.trim()).filter(Boolean)
    const primary = colors[0] ?? resolveThemeValue({
      explicit: this.color,
      cssVariable: '--dvk-color-primary',
      host: this,
      fallback: '#1b8cff',
    })
    const secondary = colors[1] ?? resolveThemeValue({
      explicit: this.secondaryColor,
      cssVariable: '--dvk-color-secondary',
      host: this,
      fallback: '#62c8ff',
    })
    const accent = colors[2] ?? resolveThemeValue({
      explicit: this.accentColor,
      cssVariable: '--dvk-color-accent',
      host: this,
      fallback: '#d8f7ff',
    })

    return [primary, secondary, accent]
  }
}

function round(value: number): number {
  return Number(value.toFixed(2))
}

function createContentPadding(hostHeight: number): string {
  const sourcePadding = contentRect.y - sourceViewBox.y
  const value = Math.max(sourcePadding / sourceViewBox.height * hostHeight, 16)
  const padding = `${round(value)}px`

  return `${padding} ${padding} ${padding} ${padding}`
}

function withAlpha(color: string, alpha: number): string {
  const trimmed = color.trim()
  const clampedAlpha = Math.min(Math.max(alpha, 0), 1)
  const hex = trimmed.match(/^#([\da-f]{3}|[\da-f]{6})$/i)

  if (hex) {
    const value = hex[1].length === 3
      ? hex[1].split('').map(part => `${part}${part}`).join('')
      : hex[1]
    const red = Number.parseInt(value.slice(0, 2), 16)
    const green = Number.parseInt(value.slice(2, 4), 16)
    const blue = Number.parseInt(value.slice(4, 6), 16)

    return `rgba(${red}, ${green}, ${blue}, ${clampedAlpha})`
  }

  const rgb = trimmed.match(/^rgba?\((.+)\)$/i)

  if (rgb) {
    const parts = rgb[1].split(',').map(part => part.trim())

    return `rgba(${parts.slice(0, 3).join(', ')}, ${clampedAlpha})`
  }

  return trimmed
}
