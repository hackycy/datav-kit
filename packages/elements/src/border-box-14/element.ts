import { DatavElement, ResizeController, resolveNumberValue, resolveThemeValue } from '@datav-kit/core'
import { css, html, svg } from 'lit'
import { property, state } from 'lit/decorators.js'
import { createBorderBoxContentPadding } from '../border-box-content-padding'

interface BorderBox14Size {
  width: number
  height: number
}

interface BorderBox14Geometry {
  width: number
  height: number
  paths: string[]
  nodes: BorderBox14Node[]
  pads: BorderBox14Pad[]
}

interface BorderBox14Node {
  x: number
  y: number
  begin: string
  duration: string
}

interface BorderBox14Pad {
  x: number
  y: number
}

type BorderBox14Corner = 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'
type BorderBox14Point = [number, number]
type BorderBox14Segment = [number, number, number, number]

const defaultSize: BorderBox14Size = {
  width: 0,
  height: 0,
}
const edgeInset = 8
const innerTraceInset = 12
const maxCornerReach = 138
const contentSafeInset = 14
let borderBox14Id = 0

export class BorderBox14Element extends DatavElement {
  static override styles = css`
    :host {
      display: block;
      position: relative;
      width: 100%;
      height: 100%;
      min-width: 0;
      min-height: 0;
      box-sizing: border-box;
      color: var(--dvk-color-primary, #1ed6ff);
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
      padding: var(--dvk-border-box-14-padding, var(--dvk-border-box-padding, var(--dvk-border-box-auto-padding)));
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

  private readonly instanceId = ++borderBox14Id
  private readonly railGradientId = `dvk-border-box-14-rail-${this.instanceId}`
  private readonly nodeGradientId = `dvk-border-box-14-node-${this.instanceId}`
  private readonly glowId = `dvk-border-box-14-glow-${this.instanceId}`

  private readonly resizeController = new ResizeController(this, (state) => {
    this.size = {
      width: Math.max(state.width, 0),
      height: Math.max(state.height, 0),
    }
  })

  override firstUpdated(): void {
    this.emit('dvk-ready', { tagName: 'dvk-border-box-14' })
  }

  override render(): unknown {
    const [primary, secondary, accent] = this.resolveColors()
    const glowIntensity = Math.max(resolveNumberValue(this.glowIntensity, 1), 0)
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
          ${this.renderRailLayer(geometry, filter)}
          ${this.renderNodeLayer(geometry, filter)}
        </svg>
      </div>
      <div part="content" class="content" style=${`--dvk-border-box-auto-padding: ${contentPadding}`}>
        <slot></slot>
      </div>
    `
  }

  private renderRailLayer(geometry: BorderBox14Geometry, filter: string): unknown {
    return svg`
      <g
        data-layer="signal-port-rails"
        class="glowed"
        fill="none"
        stroke=${`url(#${this.railGradientId})`}
        stroke-width="2.6"
        stroke-linecap="square"
        stroke-linejoin="miter"
        filter=${filter}
      >
        ${geometry.paths.map((path, index) => svg`<path data-corner-rail=${String(index + 1)} d=${path}></path>`)}
      </g>
    `
  }

  private renderNodeLayer(geometry: BorderBox14Geometry, filter: string): unknown {
    return svg`
      <g
        data-layer="signal-port-nodes"
        class="glowed"
        fill=${`url(#${this.nodeGradientId})`}
        filter=${filter}
      >
        ${geometry.nodes.map((node, index) => this.renderNode(node, index))}
        ${geometry.pads.map((pad, index) => this.renderPad(pad, index))}
      </g>
    `
  }

  private renderDefs(primary: string, secondary: string, accent: string, glowIntensity: number): unknown {
    const blur = Number((3.2 * glowIntensity).toFixed(2))

    return svg`
      <filter id=${this.glowId} height="180%" width="180%" x="-40%" y="-40%" color-interpolation-filters="sRGB">
        <feGaussianBlur in="SourceGraphic" stdDeviation=${String(blur)} result="blur"></feGaussianBlur>
        <feMerge>
          <feMergeNode in="blur"></feMergeNode>
          <feMergeNode in="SourceGraphic"></feMergeNode>
        </feMerge>
      </filter>
      <linearGradient id=${this.railGradientId} x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stop-color=${withAlpha(primary, 0.96)}></stop>
        <stop offset="0.48" stop-color=${secondary}></stop>
        <stop offset="1" stop-color=${withAlpha(primary, 0.96)}></stop>
      </linearGradient>
      <radialGradient id=${this.nodeGradientId} cx="0.5" cy="0.5" r="0.72">
        <stop offset="0" stop-color=${accent}></stop>
        <stop offset="0.64" stop-color=${withAlpha(accent, 0.66)}></stop>
        <stop offset="1" stop-color=${withAlpha(accent, 0.1)}></stop>
      </radialGradient>
    `
  }

  private renderNode(node: BorderBox14Node, index: number): unknown {
    return svg`
      <circle
        data-signal-node=${String(index + 1)}
        data-motion="signal-port-pulse"
        cx=${String(node.x)}
        cy=${String(node.y)}
        r="2.2"
        opacity="0.38"
      >
        ${this.animated && !this.paused
          ? svg`
              <animate attributeName="opacity" values="0.28;0.78;0.38;0.58;0.28" keyTimes="0;0.18;0.48;0.72;1" dur=${node.duration} begin=${node.begin} repeatCount="indefinite"></animate>
              <animate attributeName="r" values="2.1;3.2;2.2;2.7;2.1" keyTimes="0;0.18;0.48;0.72;1" dur=${node.duration} begin=${node.begin} repeatCount="indefinite"></animate>
            `
          : null}
      </circle>
    `
  }

  private renderPad(pad: BorderBox14Pad, index: number): unknown {
    return svg`
      <circle
        data-contact-pad=${String(index + 1)}
        cx=${String(pad.x)}
        cy=${String(pad.y)}
        r="1.7"
        opacity="0.62"
      ></circle>
    `
  }

  private createGeometry(): BorderBox14Geometry {
    const width = Math.max(this.size.width, 1)
    const height = Math.max(this.size.height, 1)
    const horizontalReach = createReach(width)
    const verticalReach = createReach(height)
    const nodeX = createNodeOffset(horizontalReach)
    const nodeY = createNodeOffset(verticalReach)
    const corners: BorderBox14Corner[] = ['top-left', 'top-right', 'bottom-left', 'bottom-right']
    const localSegments = createLocalSegments(horizontalReach, verticalReach, nodeX, nodeY)
    const localNodes: BorderBox14Point[] = [
      [nodeX, edgeInset],
      [edgeInset, nodeY],
    ]
    const localPads = createLocalPads(horizontalReach, verticalReach)

    return {
      width,
      height,
      paths: corners.flatMap(corner => localSegments.map(segment => segmentToPath(width, height, corner, segment))),
      nodes: corners.flatMap((corner, cornerIndex) => {
        return localNodes.map((point, pointIndex) => {
          const [x, y] = transformPoint(width, height, corner, point)

          return createNode(x, y, cornerIndex * localNodes.length + pointIndex)
        })
      }),
      pads: corners.flatMap(corner => localPads.map((point) => {
        const [x, y] = transformPoint(width, height, corner, point)

        return {
          x: round(x),
          y: round(y),
        }
      })),
    }
  }

  private resolveColors(): [string, string, string] {
    const colors = this.colors.split(',').map(color => color.trim()).filter(Boolean)
    const primary = colors[0] ?? resolveThemeValue({
      explicit: this.color,
      cssVariable: '--dvk-color-primary',
      host: this,
      fallback: '#1ed6ff',
    })
    const secondary = colors[1] ?? resolveThemeValue({
      explicit: this.secondaryColor,
      cssVariable: '--dvk-color-secondary',
      host: this,
      fallback: '#55f0c8',
    })
    const accent = colors[2] ?? resolveThemeValue({
      explicit: this.accentColor,
      cssVariable: '--dvk-color-accent',
      host: this,
      fallback: '#f7fbff',
    })

    return [primary, secondary, accent]
  }
}

function round(value: number): number {
  return Number(value.toFixed(2))
}

function line(fromX: number, fromY: number, toX: number, toY: number): string {
  return `M ${round(fromX)} ${round(fromY)} L ${round(toX)} ${round(toY)}`
}

function segmentToPath(width: number, height: number, corner: BorderBox14Corner, segment: BorderBox14Segment): string {
  const [fromX, fromY] = transformPoint(width, height, corner, [segment[0], segment[1]])
  const [toX, toY] = transformPoint(width, height, corner, [segment[2], segment[3]])

  return line(fromX, fromY, toX, toY)
}

function transformPoint(width: number, height: number, corner: BorderBox14Corner, point: BorderBox14Point): BorderBox14Point {
  const [x, y] = point

  if (corner === 'top-right')
    return [width - x, y]

  if (corner === 'bottom-left')
    return [x, height - y]

  if (corner === 'bottom-right')
    return [width - x, height - y]

  return [x, y]
}

function createLocalSegments(horizontalReach: number, verticalReach: number, nodeX: number, nodeY: number): BorderBox14Segment[] {
  const nodeGap = 8
  const [nearPin, farPin] = createPinOffsets(Math.min(horizontalReach, verticalReach))
  const sideOuterPath: BorderBox14Segment = [edgeInset, verticalReach, edgeInset, nodeY + nodeGap]
  const sideNodePath: BorderBox14Segment = [edgeInset, nodeY + nodeGap, edgeInset, nodeY - nodeGap]
  const sideInnerPath: BorderBox14Segment = [edgeInset, nodeY - nodeGap, edgeInset, innerTraceInset]
  const elbowHorizontalPath: BorderBox14Segment = [edgeInset, innerTraceInset, innerTraceInset, innerTraceInset]
  const elbowVerticalPath: BorderBox14Segment = [innerTraceInset, innerTraceInset, innerTraceInset, edgeInset]
  const topInnerPath: BorderBox14Segment = [innerTraceInset, edgeInset, nodeX - nodeGap, edgeInset]
  const topNodePath: BorderBox14Segment = [nodeX - nodeGap, edgeInset, nodeX + nodeGap, edgeInset]
  const topOuterPath: BorderBox14Segment = [nodeX + nodeGap, edgeInset, horizontalReach, edgeInset]
  const nearSidePinPath: BorderBox14Segment = [edgeInset, nearPin, innerTraceInset, nearPin]
  const farSidePinPath: BorderBox14Segment = [edgeInset, farPin, innerTraceInset, farPin]
  const nearTopPinPath: BorderBox14Segment = [nearPin, edgeInset, nearPin, innerTraceInset]
  const farTopPinPath: BorderBox14Segment = [farPin, edgeInset, farPin, innerTraceInset]

  return [
    sideOuterPath,
    sideNodePath,
    sideInnerPath,
    elbowHorizontalPath,
    elbowVerticalPath,
    topInnerPath,
    topNodePath,
    topOuterPath,
    nearSidePinPath,
    farSidePinPath,
    nearTopPinPath,
    farTopPinPath,
  ]
}

function createLocalPads(horizontalReach: number, verticalReach: number): BorderBox14Point[] {
  const [nearPin, farPin] = createPinOffsets(Math.min(horizontalReach, verticalReach))

  return [
    [innerTraceInset, nearPin],
    [innerTraceInset, farPin],
    [nearPin, innerTraceInset],
    [farPin, innerTraceInset],
  ]
}

function createPinOffsets(reach: number): [number, number] {
  const near = round(Math.min(reach - 22, Math.max(innerTraceInset + 20, reach * 0.34)))
  const far = round(Math.min(reach - 12, Math.max(near + 20, reach * 0.78)))

  return [near, far]
}

function createReach(size: number): number {
  return round(Math.min(maxCornerReach, Math.max(innerTraceInset + 28, size / 2 - 10)))
}

function createNodeOffset(reach: number): number {
  return round(Math.min(reach - 18, Math.max(innerTraceInset + 32, reach * 0.64)))
}

function createNode(x: number, y: number, index: number): BorderBox14Node {
  return {
    x: round(x),
    y: round(y),
    begin: `${Number((index * 0.43).toFixed(2))}s`,
    duration: `${Number((4.8 + (index % 4) * 0.36).toFixed(2))}s`,
  }
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
