import { DatavElement, ResizeController, resolveNumberValue, resolveThemeValue } from '@datav-kit/core'
import { css, html, svg } from 'lit'
import { property, state } from 'lit/decorators.js'
import { createBorderBoxContentPadding } from '../border-box-content-padding'

interface BorderBox16Size {
  width: number
  height: number
}

interface BorderBox16Pin {
  x1: number
  y1: number
  x2: number
  y2: number
  active: boolean
  begin: string
}

interface BorderBox16Pad {
  x: number
  y: number
  active: boolean
  begin: string
}

interface BorderBox16Geometry {
  width: number
  height: number
  pins: BorderBox16Pin[]
  pads: BorderBox16Pad[]
}

const defaultSize: BorderBox16Size = {
  width: 0,
  height: 0,
}
const outerInset = 5
const innerInset = 14
const pinInset = 17
const contentSafeInset = 20
const cornerClear = 36
const innerCornerRetreat = 30
let borderBox16Id = 0

export class BorderBox16Element extends DatavElement {
  static override styles = css`
    :host {
      display: block;
      position: relative;
      width: 100%;
      height: 100%;
      min-width: 0;
      min-height: 0;
      box-sizing: border-box;
      color: var(--dvk-color-primary, #38d8ff);
      overflow: hidden;
    }

    .frame {
      position: absolute;
      inset: 0;
      pointer-events: none;
    }

    .panel {
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
      display: block;
      overflow: visible;
    }

    path,
    line,
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
      padding: var(--dvk-border-box-16-padding, var(--dvk-border-box-padding, var(--dvk-border-box-auto-padding)));
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
  glowIntensity = 0.7

  @property({ type: Boolean })
  animated = true

  @property({ type: Boolean })
  paused = false

  @state()
  private size = defaultSize

  private readonly instanceId = ++borderBox16Id
  private readonly railGradientId = `dvk-border-box-16-rail-${this.instanceId}`
  private readonly pinGradientId = `dvk-border-box-16-pin-${this.instanceId}`
  private readonly glowId = `dvk-border-box-16-glow-${this.instanceId}`

  private readonly resizeController = new ResizeController(this, (state) => {
    this.size = {
      width: Math.max(state.width, 0),
      height: Math.max(state.height, 0),
    }
  })

  override firstUpdated(): void {
    this.emit('dvk-ready', { tagName: 'dvk-border-box-16' })
  }

  override render(): unknown {
    const [primary, secondary, accent] = this.resolveColors()
    const glowIntensity = Math.max(resolveNumberValue(this.glowIntensity, 0.7), 0)
    const geometry = this.createGeometry()
    const { width, height } = geometry
    const contentPadding = createBorderBoxContentPadding({
      hostWidth: width,
      hostHeight: height,
      viewBox: {
        x: 0,
        y: 0,
        width,
        height,
      },
      contentRect: {
        x: contentSafeInset,
        y: contentSafeInset,
        width: Math.max(width - contentSafeInset * 2, 0),
        height: Math.max(height - contentSafeInset * 2, 0),
      },
      minBlock: 12,
      minInline: 12,
    })
    const filter = glowIntensity > 0 ? `url(#${this.glowId})` : ''

    return html`
      <div part="frame" class="frame">
        <svg part="graphic" class="panel" width=${String(width)} height=${String(height)} viewBox=${`0 0 ${width} ${height}`} aria-hidden="true">
          <defs>${this.renderDefs(primary, secondary, accent, glowIntensity)}</defs>
          ${this.renderRailLayer(geometry, secondary)}
          ${this.renderMicroBusLayer(geometry, secondary)}
          ${this.renderPinLayer(geometry, filter)}
          ${this.renderPadLayer(geometry, accent, filter)}
        </svg>
      </div>
      <div part="content" class="content" style=${`--dvk-border-box-auto-padding: ${contentPadding}`}>
        <slot></slot>
      </div>
    `
  }

  private renderRailLayer(geometry: BorderBox16Geometry, secondary: string): unknown {
    const { width, height } = geometry
    const right = Math.max(width - outerInset, outerInset)
    const bottom = Math.max(height - outerInset, outerInset)
    const innerRight = Math.max(width - innerInset, innerInset)
    const innerBottom = Math.max(height - innerInset, innerInset)
    const innerRailRight = Math.max(width - innerCornerRetreat, innerCornerRetreat)
    const innerRailBottom = Math.max(height - innerCornerRetreat, innerCornerRetreat)
    const topSplitLeft = round(width * 0.39)
    const topSplitRight = round(width * 0.61)

    return svg`
      <path data-panel-wash d=${createChipPath(width, height, innerInset)} fill=${withAlpha(secondary, 0.045)} stroke="none"></path>
      <g data-layer="floating-underlay" stroke=${withAlpha(secondary, 0.24)} stroke-width="0.75" stroke-linecap="square">
        <line data-underlay-rail="top-left" x1="28" y1="9" x2=${String(Math.max(topSplitLeft - 8, 28))} y2="9"></line>
        <line data-underlay-rail="top-right" x1=${String(Math.min(topSplitRight + 8, right - 23))} y1="9" x2=${String(right - 23)} y2="9"></line>
        <line data-underlay-rail="bottom-left" x1="28" y1=${String(bottom - 4)} x2=${String(Math.max(topSplitLeft - 16, 28))} y2=${String(bottom - 4)}></line>
        <line data-underlay-rail="bottom-right" x1=${String(Math.min(topSplitRight + 16, right - 23))} y1=${String(bottom - 4)} x2=${String(right - 23)} y2=${String(bottom - 4)}></line>
        <line data-underlay-rail="left-upper" x1="9" y1="30" x2="9" y2=${String(Math.max(height * 0.38, 30))}></line>
        <line data-underlay-rail="left-lower" x1="9" y1=${String(Math.min(height * 0.62, bottom - 25))} x2="9" y2=${String(bottom - 25)}></line>
        <line data-underlay-rail="right-upper" x1=${String(right - 4)} y1="30" x2=${String(right - 4)} y2=${String(Math.max(height * 0.38, 30))}></line>
        <line data-underlay-rail="right-lower" x1=${String(right - 4)} y1=${String(Math.min(height * 0.62, bottom - 25))} x2=${String(right - 4)} y2=${String(bottom - 25)}></line>
      </g>
      <g data-layer="outer-broken-rails" data-outer-rail stroke=${`url(#${this.railGradientId})`} stroke-width="1.25" stroke-linecap="square" stroke-linejoin="miter" fill="none">
        <path data-outer-segment="top-left" d=${linePath(outerInset + 13, outerInset, topSplitLeft, outerInset)}></path>
        <path data-outer-segment="top-bridge" d=${linePath(round(width * 0.47), outerInset, round(width * 0.53), outerInset)}></path>
        <path data-outer-segment="top-right" d=${linePath(topSplitRight, outerInset, right - 13, outerInset)}></path>
        <path data-outer-segment="right-upper" d=${linePath(right, outerInset + 13, right, round(height * 0.42))}></path>
        <path data-outer-segment="right-lower" d=${linePath(right, round(height * 0.58), right, bottom - 13)}></path>
        <path data-outer-segment="bottom-right" d=${linePath(right - 13, bottom, topSplitRight, bottom)}></path>
        <path data-outer-segment="bottom-bridge" d=${linePath(round(width * 0.53), bottom, round(width * 0.47), bottom)}></path>
        <path data-outer-segment="bottom-left" d=${linePath(topSplitLeft, bottom, outerInset + 13, bottom)}></path>
        <path data-outer-segment="left-lower" d=${linePath(outerInset, bottom - 13, outerInset, round(height * 0.58))}></path>
        <path data-outer-segment="left-upper" d=${linePath(outerInset, round(height * 0.42), outerInset, outerInset + 13)}></path>
        <path data-outer-segment="corner-tr" d=${linePath(right - 13, outerInset, right, outerInset + 13)}></path>
        <path data-outer-segment="corner-br" d=${linePath(right, bottom - 13, right - 13, bottom)}></path>
        <path data-outer-segment="corner-bl" d=${linePath(outerInset + 13, bottom, outerInset, bottom - 13)}></path>
        <path data-outer-segment="corner-tl" d=${linePath(outerInset, outerInset + 13, outerInset + 13, outerInset)}></path>
      </g>
      <g data-layer="floating-inner-hairlines" data-inner-hairline stroke=${withAlpha(secondary, 0.66)} stroke-width="0.75" stroke-linecap="square">
        <line data-inner-rail="top" x1=${String(innerCornerRetreat)} y1=${String(innerInset)} x2=${String(innerRailRight)} y2=${String(innerInset)}></line>
        <line data-inner-rail="right" x1=${String(innerRight)} y1=${String(innerCornerRetreat)} x2=${String(innerRight)} y2=${String(innerRailBottom)}></line>
        <line data-inner-rail="bottom" x1=${String(innerRailRight)} y1=${String(innerBottom)} x2=${String(innerCornerRetreat)} y2=${String(innerBottom)}></line>
        <line data-inner-rail="left" x1=${String(innerInset)} y1=${String(innerRailBottom)} x2=${String(innerInset)} y2=${String(innerCornerRetreat)}></line>
      </g>
    `
  }

  private renderMicroBusLayer(geometry: BorderBox16Geometry, secondary: string): unknown {
    const { width, height } = geometry
    const right = Math.max(width - innerInset, innerInset)
    const bottom = Math.max(height - innerInset, innerInset)

    return svg`
      <g data-layer="micro-bus-hairlines" stroke=${withAlpha(secondary, 0.34)} stroke-width="0.7" stroke-linecap="square">
        <line data-micro-bus="top-1" x1=${String(round(width * 0.16))} y1=${String(innerInset)} x2=${String(round(width * 0.16))} y2=${String(pinInset)}></line>
        <line data-micro-bus="top-2" x1=${String(round(width * 0.24))} y1=${String(innerInset)} x2=${String(round(width * 0.24))} y2=${String(pinInset)}></line>
        <line data-micro-bus="top-3" x1=${String(round(width * 0.68))} y1=${String(innerInset)} x2=${String(round(width * 0.68))} y2=${String(pinInset)}></line>
        <line data-micro-bus="top-4" x1=${String(round(width * 0.76))} y1=${String(innerInset)} x2=${String(round(width * 0.76))} y2=${String(pinInset)}></line>
        <line data-micro-bus="bottom-1" x1=${String(round(width * 0.22))} y1=${String(bottom)} x2=${String(round(width * 0.22))} y2=${String(bottom - 3)}></line>
        <line data-micro-bus="bottom-2" x1=${String(round(width * 0.32))} y1=${String(bottom)} x2=${String(round(width * 0.32))} y2=${String(bottom - 3)}></line>
        <line data-micro-bus="bottom-3" x1=${String(round(width * 0.62))} y1=${String(bottom)} x2=${String(round(width * 0.62))} y2=${String(bottom - 3)}></line>
        <line data-micro-bus="bottom-4" x1=${String(round(width * 0.72))} y1=${String(bottom)} x2=${String(round(width * 0.72))} y2=${String(bottom - 3)}></line>
        <line data-micro-bus="left-1" x1=${String(innerInset)} y1=${String(round(height * 0.2))} x2=${String(pinInset)} y2=${String(round(height * 0.2))}></line>
        <line data-micro-bus="left-2" x1=${String(innerInset)} y1=${String(round(height * 0.34))} x2=${String(pinInset)} y2=${String(round(height * 0.34))}></line>
        <line data-micro-bus="left-3" x1=${String(innerInset)} y1=${String(round(height * 0.66))} x2=${String(pinInset)} y2=${String(round(height * 0.66))}></line>
        <line data-micro-bus="left-4" x1=${String(innerInset)} y1=${String(round(height * 0.8))} x2=${String(pinInset)} y2=${String(round(height * 0.8))}></line>
        <line data-micro-bus="right-1" x1=${String(right)} y1=${String(round(height * 0.2))} x2=${String(right - 3)} y2=${String(round(height * 0.2))}></line>
        <line data-micro-bus="right-2" x1=${String(right)} y1=${String(round(height * 0.34))} x2=${String(right - 3)} y2=${String(round(height * 0.34))}></line>
        <line data-micro-bus="right-3" x1=${String(right)} y1=${String(round(height * 0.66))} x2=${String(right - 3)} y2=${String(round(height * 0.66))}></line>
        <line data-micro-bus="right-4" x1=${String(right)} y1=${String(round(height * 0.8))} x2=${String(right - 3)} y2=${String(round(height * 0.8))}></line>
        <line data-micro-bus="top-center-gap-left" x1=${String(round(width * 0.42))} y1=${String(pinInset)} x2=${String(round(width * 0.46))} y2=${String(pinInset)}></line>
        <line data-micro-bus="top-center-gap-right" x1=${String(round(width * 0.54))} y1=${String(pinInset)} x2=${String(round(width * 0.58))} y2=${String(pinInset)}></line>
      </g>
    `
  }

  private renderPinLayer(geometry: BorderBox16Geometry, filter: string): unknown {
    return svg`
      <g data-layer="chip-pins" stroke=${`url(#${this.pinGradientId})`} stroke-width="1.15" stroke-linecap="square">
        ${geometry.pins.map((pin, index) => this.renderPin(pin, index, filter))}
      </g>
    `
  }

  private renderPadLayer(geometry: BorderBox16Geometry, accent: string, filter: string): unknown {
    return svg`
      <g data-layer="chip-pads" fill=${accent} filter=${filter}>
        ${geometry.pads.map((pad, index) => this.renderPad(pad, index))}
      </g>
    `
  }

  private renderDefs(primary: string, secondary: string, accent: string, glowIntensity: number): unknown {
    const blur = Number((2.4 * glowIntensity).toFixed(2))

    return svg`
      <filter id=${this.glowId} height="170%" width="170%" x="-35%" y="-35%" color-interpolation-filters="sRGB">
        <feGaussianBlur in="SourceGraphic" stdDeviation=${String(blur)} result="blur"></feGaussianBlur>
        <feMerge>
          <feMergeNode in="blur"></feMergeNode>
          <feMergeNode in="SourceGraphic"></feMergeNode>
        </feMerge>
      </filter>
      <linearGradient id=${this.railGradientId} x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stop-color=${withAlpha(primary, 0.94)}></stop>
        <stop offset="0.5" stop-color=${withAlpha(secondary, 0.72)}></stop>
        <stop offset="1" stop-color=${withAlpha(primary, 0.94)}></stop>
      </linearGradient>
      <linearGradient id=${this.pinGradientId} x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stop-color=${withAlpha(secondary, 0.5)}></stop>
        <stop offset="0.5" stop-color=${withAlpha(accent, 0.92)}></stop>
        <stop offset="1" stop-color=${withAlpha(secondary, 0.5)}></stop>
      </linearGradient>
    `
  }

  private renderPin(pin: BorderBox16Pin, index: number, filter: string): unknown {
    return svg`
      <line
        data-chip-pin=${String(index + 1)}
        data-active-pin=${pin.active ? 'true' : 'false'}
        x1=${String(pin.x1)}
        y1=${String(pin.y1)}
        x2=${String(pin.x2)}
        y2=${String(pin.y2)}
        opacity=${pin.active ? '0.82' : '0.42'}
        filter=${pin.active ? filter : ''}
      >
        ${this.animated && !this.paused && pin.active
          ? svg`<animate attributeName="opacity" values="0.38;0.92;0.54;0.82;0.38" keyTimes="0;0.22;0.5;0.74;1" dur="4.8s" begin=${pin.begin} repeatCount="indefinite"></animate>`
          : null}
      </line>
    `
  }

  private renderPad(pad: BorderBox16Pad, index: number): unknown {
    return svg`
      <rect
        data-chip-pad=${String(index + 1)}
        data-active-pad=${pad.active ? 'true' : 'false'}
        x=${String(round(pad.x - 1.8))}
        y=${String(round(pad.y - 1.8))}
        width="3.6"
        height="3.6"
        opacity=${pad.active ? '0.88' : '0.5'}
      >
        ${this.animated && !this.paused && pad.active
          ? svg`<animate attributeName="opacity" values="0.42;0.9;0.58;0.78;0.42" keyTimes="0;0.2;0.48;0.72;1" dur="5.4s" begin=${pad.begin} repeatCount="indefinite"></animate>`
          : null}
      </rect>
    `
  }

  private createGeometry(): BorderBox16Geometry {
    const width = Math.max(this.size.width, 1)
    const height = Math.max(this.size.height, 1)

    return {
      width,
      height,
      pins: createPins(width, height),
      pads: createPads(width, height),
    }
  }

  private resolveColors(): [string, string, string] {
    const colors = splitColorList(this.colors)
    const primary = colors[0] ?? resolveThemeValue({
      explicit: this.color,
      cssVariable: '--dvk-color-primary',
      host: this,
      fallback: '#38d8ff',
    })
    const secondary = colors[1] ?? resolveThemeValue({
      explicit: this.secondaryColor,
      cssVariable: '--dvk-color-secondary',
      host: this,
      fallback: '#69ffe1',
    })
    const accent = colors[2] ?? resolveThemeValue({
      explicit: this.accentColor,
      cssVariable: '--dvk-color-accent',
      host: this,
      fallback: '#f8fbff',
    })

    return [primary, secondary, accent]
  }
}

function createChipPath(width: number, height: number, inset: number): string {
  const notch = Math.min(13, Math.max(Math.min(width, height) / 6, 5))
  const right = Math.max(width - inset, inset)
  const bottom = Math.max(height - inset, inset)

  return [
    `M ${round(inset + notch)} ${round(inset)}`,
    `L ${round(right - notch)} ${round(inset)}`,
    `L ${round(right)} ${round(inset + notch)}`,
    `L ${round(right)} ${round(bottom - notch)}`,
    `L ${round(right - notch)} ${round(bottom)}`,
    `L ${round(inset + notch)} ${round(bottom)}`,
    `L ${round(inset)} ${round(bottom - notch)}`,
    `L ${round(inset)} ${round(inset + notch)}`,
    'Z',
  ].join(' ')
}

function createPins(width: number, height: number): BorderBox16Pin[] {
  const pins: BorderBox16Pin[] = []
  const horizontal = createLaminatePositions(width)
  const vertical = createLaminatePositions(height)

  horizontal.forEach((x, index) => {
    pins.push(createPin(x, outerInset, x, pinInset, index))
    pins.push(createPin(x, height - outerInset, x, height - pinInset, index + 1))
  })

  vertical.forEach((y, index) => {
    pins.push(createPin(outerInset, y, pinInset, y, index + 2))
    pins.push(createPin(width - outerInset, y, width - pinInset, y, index + 3))
  })

  return pins
}

function createPads(width: number, height: number): BorderBox16Pad[] {
  const right = Math.max(width - innerInset, innerInset)
  const bottom = Math.max(height - innerInset, innerInset)
  const candidates: Array<[number, number]> = [
    [innerCornerRetreat, innerInset],
    [right - innerCornerRetreat + innerInset, innerInset],
    [right, innerCornerRetreat],
    [right, bottom - innerCornerRetreat + innerInset],
    [right - innerCornerRetreat + innerInset, bottom],
    [innerCornerRetreat, bottom],
    [innerInset, bottom - innerCornerRetreat + innerInset],
    [innerInset, innerCornerRetreat],
    [width / 2, innerInset],
    [width / 2, bottom],
    [right, height / 2],
    [innerInset, height / 2],
  ]

  return candidates.map(([x, y], index) => ({
    x: round(x),
    y: round(y),
    active: index === 1 || index === 4 || index === 9,
    begin: `${Number((index * 0.37).toFixed(2))}s`,
  }))
}

function createLaminatePositions(length: number): number[] {
  if (length < cornerClear * 2 + 20)
    return []

  return [0.16, 0.24, 0.36, 0.64, 0.76, 0.84]
    .map(ratio => round(length * ratio))
    .filter(position => position >= cornerClear && position <= length - cornerClear)
}

function createPin(x1: number, y1: number, x2: number, y2: number, index: number): BorderBox16Pin {
  return {
    x1: round(x1),
    y1: round(y1),
    x2: round(x2),
    y2: round(y2),
    active: index % 4 === 0,
    begin: `${Number((index * 0.29).toFixed(2))}s`,
  }
}

function round(value: number): number {
  return Number(value.toFixed(2))
}

function linePath(fromX: number, fromY: number, toX: number, toY: number): string {
  return `M ${round(fromX)} ${round(fromY)} L ${round(toX)} ${round(toY)}`
}

function splitColorList(value: string): string[] {
  const colors: string[] = []
  let depth = 0
  let current = ''

  for (const char of value) {
    if (char === '(')
      depth += 1
    else if (char === ')')
      depth = Math.max(depth - 1, 0)

    if (char === ',' && depth === 0) {
      const color = current.trim()
      if (color)
        colors.push(color)
      current = ''
      continue
    }

    current += char
  }

  const color = current.trim()
  if (color)
    colors.push(color)

  return colors
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
