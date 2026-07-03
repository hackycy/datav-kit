import { DatavElement, ResizeController, resolveNumberValue, resolveThemeValue } from '@datav-kit/core'
import { css, html, svg } from 'lit'
import { property, state } from 'lit/decorators.js'
import { createBorderBoxContentPadding } from '../border-box-content-padding'

interface BorderBox12Size {
  width: number
  height: number
}

interface BorderBox12Geometry {
  width: number
  height: number
  outerPath: string
  innerPath: string
  bottomReinforcementPath: string
  leftSideAccentPath: string
  rightSideAccentPath: string
  backgroundPanel: BorderBox12Rect
  leftBlocks: string[]
  rightBlocks: string[]
}

interface BorderBox12Rect {
  x: number
  y: number
  width: number
  height: number
}

const defaultSize: BorderBox12Size = {
  width: 0,
  height: 0,
}
const sourceViewBox: BorderBox12Rect = {
  x: 0,
  y: 0,
  width: 1672,
  height: 941,
}
const contentRect: BorderBox12Rect = {
  x: 77,
  y: 92,
  width: 1518,
  height: 760,
}
let borderBox12Id = 0

export class BorderBox12Element extends DatavElement {
  static override styles = css`
    :host {
      display: block;
      position: relative;
      width: 100%;
      height: 100%;
      min-width: 0;
      min-height: 0;
      box-sizing: border-box;
      color: var(--dvk-color-primary, #19d8ff);
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
    polygon,
    rect {
      vector-effect: non-scaling-stroke;
    }

    .content {
      position: relative;
      z-index: 1;
      box-sizing: border-box;
      width: 100%;
      height: 100%;
      min-height: 0;
      padding: var(--dvk-border-box-12-padding, var(--dvk-border-box-padding, var(--dvk-border-box-auto-padding)));
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

  private readonly instanceId = ++borderBox12Id
  private readonly glowId = `dvk-border-box-12-glow-${this.instanceId}`
  private readonly railGradientId = `dvk-border-box-12-rail-${this.instanceId}`
  private readonly blockGradientId = `dvk-border-box-12-block-${this.instanceId}`

  private readonly resizeController = new ResizeController(this, (state) => {
    this.size = {
      width: Math.max(state.width, 0),
      height: Math.max(state.height, 0),
    }
  })

  override firstUpdated(): void {
    this.emit('dvk-ready', { tagName: 'dvk-border-box-12' })
  }

  override render(): unknown {
    const [primary, secondary, accent] = this.resolveColors()
    const glowIntensity = Math.max(resolveNumberValue(this.glowIntensity, 1), 0)
    const geometry = this.createGeometry()
    const { width, height } = geometry
    const contentPadding = createBorderBoxContentPadding({
      hostWidth: width,
      hostHeight: height,
      viewBox: sourceViewBox,
      contentRect,
      minBlock: 14,
      minInline: 19,
    })

    return html`
      <div part="frame" class="frame">
        <svg part="graphic" class="panel" width=${String(width)} height=${String(height)} viewBox=${`0 0 ${width} ${height}`} aria-hidden="true">
          <defs>${this.renderDefs(primary, secondary, accent, glowIntensity)}</defs>
          ${this.renderBackgroundPanel(geometry)}
          ${this.renderRails(geometry, primary, secondary, glowIntensity)}
          ${this.renderTopBlocks(geometry)}
          ${this.renderSideFolds(geometry, secondary, glowIntensity)}
          ${this.renderBottomReinforcement(geometry, secondary, glowIntensity)}
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
        <stop offset="0" stop-color=${withAlpha(primary, 0.72)}></stop>
        <stop offset="0.5" stop-color=${secondary}></stop>
        <stop offset="1" stop-color=${withAlpha(primary, 0.72)}></stop>
      </linearGradient>
      <linearGradient id=${this.blockGradientId} x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stop-color=${accent}></stop>
        <stop offset="1" stop-color=${primary}></stop>
      </linearGradient>
    `
  }

  private renderGlowFilter(primary: string, glowIntensity: number): unknown {
    const blur = Number((2.2 * glowIntensity).toFixed(2))
    const floodOpacity = Number(Math.min(0.72 * glowIntensity, 0.95).toFixed(2))

    return svg`
      <filter id=${this.glowId} height="160%" width="160%" x="-30%" y="-30%" color-interpolation-filters="sRGB">
        <feGaussianBlur in="SourceGraphic" stdDeviation=${String(blur)} result="softGlow"></feGaussianBlur>
        <feFlood flood-color=${primary} flood-opacity=${String(floodOpacity)} result="glowColor"></feFlood>
        <feComposite in="glowColor" in2="softGlow" operator="in" result="coloredGlow"></feComposite>
        <feMerge>
          <feMergeNode in="coloredGlow"></feMergeNode>
          <feMergeNode in="SourceGraphic"></feMergeNode>
        </feMerge>
      </filter>
    `
  }

  private renderBackgroundPanel(geometry: BorderBox12Geometry): unknown {
    return svg`
      <rect
        data-panel="background"
        x=${String(geometry.backgroundPanel.x)}
        y=${String(geometry.backgroundPanel.y)}
        width=${String(geometry.backgroundPanel.width)}
        height=${String(geometry.backgroundPanel.height)}
        fill="#171717"
        opacity="0.24"
      ></rect>
    `
  }

  private renderRails(geometry: BorderBox12Geometry, primary: string, secondary: string, glowIntensity: number): unknown {
    const secondaryStroke = withAlpha(secondary, 0.58)
    const dimPrimary = withAlpha(primary, 0.28)
    const filter = glowIntensity > 0 ? `url(#${this.glowId})` : ''

    return svg`
      <path
        data-rail="outer-shadow"
        fill="none"
        stroke=${dimPrimary}
        stroke-width="2.35"
        stroke-linejoin="miter"
        d=${geometry.outerPath}
      ></path>
      <path
        data-rail="outer"
        fill="none"
        stroke=${`url(#${this.railGradientId})`}
        stroke-width="1"
        stroke-linecap="square"
        stroke-linejoin="miter"
        filter=${filter}
        d=${geometry.outerPath}
      ></path>
      <path
        data-rail="inner"
        fill="none"
        stroke=${secondaryStroke}
        stroke-width="0.7"
        stroke-linejoin="miter"
        d=${geometry.innerPath}
      ></path>
    `
  }

  private renderTopBlocks(geometry: BorderBox12Geometry): unknown {
    if (geometry.width < 260)
      return null

    return svg`
      <g data-block-group="left">
        ${this.renderTopBlock(geometry.leftBlocks[0], 0.78, '0s', 1)}
        ${this.renderTopBlock(geometry.leftBlocks[1], 0.86, '0.22s', 2)}
        ${this.renderTopBlock(geometry.leftBlocks[2], 0.94, '0.44s', 3)}
      </g>
      <g data-block-group="right">
        ${this.renderTopBlock(geometry.rightBlocks[0], 0.78, '0.35s', 1)}
        ${this.renderTopBlock(geometry.rightBlocks[1], 0.86, '0.57s', 2)}
        ${this.renderTopBlock(geometry.rightBlocks[2], 0.94, '0.79s', 3)}
      </g>
    `
  }

  private renderTopBlock(points: string, opacity: number, begin: string, index: number): unknown {
    return svg`
      <polygon
        data-top-block=${String(index)}
        points=${points}
        fill=${`url(#${this.blockGradientId})`}
        opacity=${String(opacity)}
        filter=${`url(#${this.glowId})`}
      >
        ${this.animated && !this.paused
          ? svg`<animate attributeName="opacity" values=${`${opacity};0.18;${opacity};0.66;${opacity}`} dur="3.2s" begin=${begin} repeatCount="indefinite"></animate>`
          : null}
      </polygon>
    `
  }

  private renderSideFolds(geometry: BorderBox12Geometry, secondary: string, glowIntensity: number): unknown {
    if (geometry.height < 140 || geometry.width < 100)
      return null

    const filter = glowIntensity > 0 ? `url(#${this.glowId})` : ''
    const stroke = withAlpha(secondary, 0.9)

    return svg`
      <path
        data-side-fold="left"
        fill="none"
        stroke=${stroke}
        stroke-width="4"
        stroke-linejoin="miter"
        filter=${filter}
        d=${geometry.leftSideAccentPath}
      ></path>
      <path
        data-side-fold="right"
        fill="none"
        stroke=${stroke}
        stroke-width="4"
        stroke-linejoin="miter"
        filter=${filter}
        d=${geometry.rightSideAccentPath}
      ></path>
    `
  }

  private renderBottomReinforcement(geometry: BorderBox12Geometry, secondary: string, glowIntensity: number): unknown {
    return svg`
      <path
        data-rail="bottom-reinforcement"
        fill="none"
        stroke=${withAlpha(secondary, 0.58)}
        stroke-width="0.7"
        opacity="0.55"
        filter=${glowIntensity > 0 ? `url(#${this.glowId})` : ''}
        d=${geometry.bottomReinforcementPath}
      ></path>
    `
  }

  private createGeometry(): BorderBox12Geometry {
    const width = Math.max(this.size.width, 1)
    const height = Math.max(this.size.height, 1)
    const moduleScale = Math.min(width / sourceViewBox.width, height / sourceViewBox.height)
    const sourceX = (value: number): number => round(value * moduleScale)
    const sourceY = (value: number): number => round(value * moduleScale)
    const sourceRightX = (value: number): number => round(width - (sourceViewBox.width - value) * moduleScale)
    const sourceBottomY = (value: number): number => round(height - (sourceViewBox.height - value) * moduleScale)
    const centeredY = (value: number): number => round(height / 2 + (value - 453.5) * moduleScale)
    const point = (x: number, y: number): string => {
      const mappedX = x <= sourceViewBox.width / 2 ? sourceX(x) : sourceRightX(x)
      const mappedY = y <= 150 ? sourceY(y) : y >= 800 ? sourceBottomY(y) : centeredY(y)

      return `${mappedX} ${mappedY}`
    }
    const path = (commands: Array<[string, number, number] | [string]>): string => {
      return commands.map((command) => {
        if (command.length === 1)
          return command[0]

        return `${command[0]} ${point(command[1], command[2])}`
      }).join(' ')
    }
    const polygon = (points: Array<[number, number]>): string => {
      return points.map(([x, y]) => {
        const mappedX = x <= sourceViewBox.width / 2 ? sourceX(x) : sourceRightX(x)

        return `${mappedX},${sourceY(y)}`
      }).join(' ')
    }
    const outerCommands: Array<[string, number, number] | [string]> = [
      ['M', 76, 40],
      ['L', 394, 40],
      ['L', 422, 68],
      ['L', 1250, 68],
      ['L', 1278, 40],
      ['L', 1596, 40],
      ['L', 1642, 86],
      ['L', 1642, 332],
      ['L', 1624, 350],
      ['L', 1624, 557],
      ['L', 1642, 575],
      ['L', 1642, 856],
      ['L', 1596, 902],
      ['L', 76, 902],
      ['L', 30, 856],
      ['L', 30, 575],
      ['L', 48, 557],
      ['L', 48, 350],
      ['L', 30, 332],
      ['L', 30, 86],
      ['Z'],
    ]
    const innerCommands: Array<[string, number, number] | [string]> = [
      ['M', 83, 52],
      ['L', 386, 52],
      ['L', 414, 79],
      ['L', 1258, 79],
      ['L', 1286, 52],
      ['L', 1589, 52],
      ['L', 1628, 91],
      ['L', 1628, 327],
      ['L', 1610, 345],
      ['L', 1610, 562],
      ['L', 1628, 580],
      ['L', 1628, 849],
      ['L', 1589, 889],
      ['L', 83, 889],
      ['L', 44, 849],
      ['L', 44, 580],
      ['L', 62, 562],
      ['L', 62, 345],
      ['L', 44, 327],
      ['L', 44, 91],
      ['Z'],
    ]

    return {
      width,
      height,
      outerPath: path(outerCommands),
      innerPath: path(innerCommands),
      bottomReinforcementPath: path([
        ['M', 76, 902],
        ['L', 1596, 902],
      ]),
      leftSideAccentPath: path([
        ['M', 30, 332],
        ['L', 48, 350],
        ['L', 48, 557],
        ['L', 30, 575],
      ]),
      rightSideAccentPath: path([
        ['M', 1642, 332],
        ['L', 1624, 350],
        ['L', 1624, 557],
        ['L', 1642, 575],
      ]),
      backgroundPanel: {
        x: sourceX(44),
        y: sourceY(68),
        width: round(Math.max(width - 88 * moduleScale, 0)),
        height: round(Math.max(height - (68 + 63) * moduleScale, 0)),
      },
      leftBlocks: [
        polygon([[220, 56], [254, 56], [274, 78], [240, 78]]),
        polygon([[268, 56], [302, 56], [322, 78], [288, 78]]),
        polygon([[316, 56], [350, 56], [370, 78], [336, 78]]),
      ],
      rightBlocks: [
        polygon([[1322, 56], [1356, 56], [1336, 78], [1302, 78]]),
        polygon([[1370, 56], [1404, 56], [1384, 78], [1350, 78]]),
        polygon([[1418, 56], [1452, 56], [1432, 78], [1398, 78]]),
      ],
    }
  }

  private resolveColors(): [string, string, string] {
    const colors = this.colors.split(',').map(color => color.trim()).filter(Boolean)
    const primary = colors[0] ?? resolveThemeValue({
      explicit: this.color,
      cssVariable: '--dvk-color-primary',
      host: this,
      fallback: '#19d8ff',
    })
    const secondary = colors[1] ?? resolveThemeValue({
      explicit: this.secondaryColor,
      cssVariable: '--dvk-color-secondary',
      host: this,
      fallback: '#56f0ff',
    })
    const accent = colors[2] ?? resolveThemeValue({
      explicit: this.accentColor,
      cssVariable: '--dvk-color-accent',
      host: this,
      fallback: '#b9f8ff',
    })

    return [primary, secondary, accent]
  }
}

function round(value: number): number {
  return Number(value.toFixed(2))
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
