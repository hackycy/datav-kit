import { DatavElement, ResizeController, resolveThemeValue } from '@datav-kit/core'
import { css, html, svg } from 'lit'
import { property, state } from 'lit/decorators.js'
import { observeElementSize } from '../internal/element-size-observer'

const VIEW_BOX_WIDTH = 1600
const VIEW_BOX_HEIGHT = 64
const CENTER = 800
const RAIL_TOP = 10.5
const RAIL_BOTTOM = 51.5
const SHOULDER_RUN = 26.7
const MAX_SHOULDER_RUN = 74.7
const DEFAULT_HALF = 265
const INNER_INSET_X = 4
const INNER_INSET_Y = 4.5
const SLASH_COUNT = 6
const SLASH_STEP = 12
const SLASH_GAP = 6
const SLASH_SPAN = (SLASH_COUNT - 1) * SLASH_STEP + 9
const SLASH_INDICES = Array.from({ length: SLASH_COUNT }, (_, index) => index)

export function resolveRecessHalf(titleWidth: number, hostWidth: number, shoulderRun = SHOULDER_RUN): number {
  if (!(titleWidth > 0) || !(hostWidth > 0))
    return DEFAULT_HALF

  const half = titleWidth / 2 * VIEW_BOX_WIDTH / hostWidth
  // The left slash group starts at `CENTER - half - shoulderRun - SLASH_GAP - SLASH_SPAN`,
  // so it leaves the viewBox 75 units before the shoulder, recess or rail would.
  const maxHalf = CENTER - shoulderRun - SLASH_GAP - SLASH_SPAN

  return Math.min(Math.max(half, 0), maxHalf)
}

// `preserveAspectRatio="none"` shears the shoulder slant, so the run is solved back
// from the host aspect to keep the rendered angle at the prototype's 57 degrees.
export function resolveShoulderRun(hostWidth: number, hostHeight: number): number {
  if (!(hostWidth > 0) || !(hostHeight > 0))
    return SHOULDER_RUN

  const run = SHOULDER_RUN * hostHeight * VIEW_BOX_WIDTH / (VIEW_BOX_HEIGHT * hostWidth)

  return Math.min(run, MAX_SHOULDER_RUN)
}

let title5Id = 0

export class Title5Element extends DatavElement {
  static override styles = css`
    :host {
      position: relative;
      display: block;
      width: 100%;
      height: 100%;
      min-width: 0;
      min-height: 0;
      color: var(--dvk-title-5-title-color, #f3fbff);
    }

    svg {
      position: absolute;
      inset: 0;
      display: block;
      width: 100%;
      height: 100%;
      overflow: visible;
      pointer-events: none;
    }

    path,
    rect {
      vector-effect: non-scaling-stroke;
    }

    .top-edge {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 1px;
      pointer-events: none;
    }

    .content {
      position: absolute;
      /* y=28.5 of 64, deliberately above the recess centre (y=31) so the bright
         bottom edge and its glow do not crowd the text. */
      top: var(--dvk-title-5-title-top, 44.53%);
      /* Both insets, so the box has a definite width for the title's percentage
         max-width to resolve against instead of a shrink-to-fit parent. */
      left: 0;
      right: 0;
      display: flex;
      justify-content: center;
      z-index: 1;
      pointer-events: none;
      transform: translateY(-50%);
    }

    .title {
      box-sizing: border-box;
      width: var(--dvk-title-5-title-width, max-content);
      max-width: 100%;
      padding: 0 var(--dvk-title-5-title-gap, 2em);
      overflow: hidden;
      color: var(--dvk-title-5-title-color, #f3fbff);
      font: var(--dvk-title-5-title-font, 700 19px/1 'Microsoft YaHei', 'PingFang SC', 'Noto Sans CJK SC', Arial, sans-serif);
      letter-spacing: var(--dvk-title-5-title-letter-spacing, 0.16em);
      text-align: center;
      white-space: nowrap;
      text-overflow: ellipsis;
      text-shadow:
        0 0 5px var(--dvk-title-5-title-stroke, rgba(142, 226, 255, 0.66)),
        0 0 12px var(--dvk-title-5-title-glow, rgba(40, 137, 255, 0.34));
    }

    slot::slotted(*) {
      color: inherit;
      font: inherit;
      letter-spacing: inherit;
      text-align: inherit;
      text-shadow: inherit;
    }
  `

  @property()
  color: string | readonly string[] = ''

  @property({ attribute: 'secondary-color' })
  secondaryColor = ''

  @property({ attribute: 'accent-color' })
  accentColor = ''

  @property()
  colors = ''

  @property({ attribute: 'title-text' })
  titleText = ''

  @state()
  private recessHalf = DEFAULT_HALF

  @state()
  private shoulderRun = SHOULDER_RUN

  private readonly instanceId = ++title5Id
  private readonly fadeRailId = `dvk-title-5-fade-rail-${this.instanceId}`
  private readonly panelFillId = `dvk-title-5-panel-fill-${this.instanceId}`
  private readonly centerLineId = `dvk-title-5-center-line-${this.instanceId}`
  private readonly railGlowId = `dvk-title-5-rail-glow-${this.instanceId}`
  private readonly centerGlowId = `dvk-title-5-center-glow-${this.instanceId}`

  private readonly resizeController = new ResizeController(this, (size) => {
    this.syncGeometry(size.width, size.height)
  })

  private stopObservingTitle: (() => void) | null = null

  override connectedCallback(): void {
    super.connectedCallback()
    this.observeTitle()
  }

  override disconnectedCallback(): void {
    this.stopObservingTitle?.()
    this.stopObservingTitle = null
    super.disconnectedCallback()
  }

  override firstUpdated(): void {
    this.emit('dvk-ready', { tagName: 'dvk-title-5' })
    this.observeTitle()
  }

  override updated(): void {
    this.syncGeometry()
  }

  // The host ResizeController only fires when the host box changes, so a width or font
  // variable set at runtime would otherwise leave the recess on its previous width.
  private observeTitle(): void {
    if (this.stopObservingTitle)
      return

    const title = this.renderRoot.querySelector<HTMLElement>('.title')

    if (!title)
      return

    this.stopObservingTitle = observeElementSize(title, () => this.syncGeometry())
  }

  override render(): unknown {
    const [primary, secondary, accent] = this.resolveColors()
    const half = this.recessHalf
    const shoulderX = CENTER - half - this.shoulderRun
    const slashStart = shoulderX - SLASH_GAP - SLASH_SPAN
    const glowOpacity = this.resolveOpacity('--dvk-title-5-glow-opacity', 0.3)
    const railPath = mainRailPath(half, shoulderX)
    const accentPath = centerAccentPath(half)

    return html`
      <svg
        part="graphic"
        viewBox="0 0 ${VIEW_BOX_WIDTH} ${VIEW_BOX_HEIGHT}"
        preserveAspectRatio="none"
        aria-hidden="true"
        shape-rendering="geometricPrecision"
      >
        <defs>${this.renderDefs(primary, secondary, accent)}</defs>

        <path part="guide-rail guide-rail-left" d=${guideRailPath(shoulderX, false)} fill="none" stroke=${withAlpha(primary, 0.16)} stroke-width="1"></path>
        <path part="guide-rail guide-rail-right" d=${guideRailPath(shoulderX, true)} fill="none" stroke=${withAlpha(primary, 0.16)} stroke-width="1"></path>

        <path part="recess" d=${recessPath(half, shoulderX)} fill=${`url(#${this.panelFillId})`}></path>

        <path part="inner-rail" d=${innerRailPath(half, shoulderX)} fill="none" stroke=${withAlpha(secondary, 0.18)} stroke-width="1"></path>

        <path part="rail rail-glow" d=${railPath} fill="none" stroke=${`url(#${this.fadeRailId})`} stroke-width="4.8" opacity=${glowOpacity} filter=${`url(#${this.railGlowId})`}></path>
        <path part="rail rail-core" d=${railPath} fill="none" stroke=${`url(#${this.fadeRailId})`} stroke-width="1.35" stroke-linejoin="miter" stroke-miterlimit="2"></path>

        <path part="accent accent-glow" d=${accentPath} fill="none" stroke=${primary} stroke-width="4.2" opacity=${glowOpacity} filter=${`url(#${this.centerGlowId})`}></path>
        <path part="accent accent-core" d=${accentPath} fill="none" stroke=${`url(#${this.centerLineId})`} stroke-width="1.55"></path>

        <g part="slash slash-left" fill="none" stroke=${withAlpha(secondary, 0.42)} stroke-width="2">
          ${SLASH_INDICES.map(index => svg`<path d=${slashPath(slashStart, index, false)}></path>`)}
        </g>
        <g part="slash slash-right" fill="none" stroke=${withAlpha(secondary, 0.42)} stroke-width="2">
          ${SLASH_INDICES.map(index => svg`<path d=${slashPath(slashStart, index, true)}></path>`)}
        </g>

        <g part="tick" fill="none" stroke=${withAlpha(primary, 0.28)} stroke-width="1.2">
          <path d="M110 27.5 H182"></path>
          <path d="M1418 27.5 H1490"></path>
          <path d="M92 32 H150"></path>
          <path d="M1450 32 H1508"></path>
        </g>
      </svg>
      <div
        part="top-edge"
        class="top-edge"
        style=${`background: linear-gradient(90deg, transparent, ${withAlpha(secondary, 0.24)} 12%, ${withAlpha(primary, 0.3)} 50%, ${withAlpha(secondary, 0.24)} 88%, transparent)`}
      ></div>
      <div part="content" class="content">
        <div
          part="title"
          class="title"
          style=${`--dvk-title-5-title-stroke: ${withAlpha(primary, 0.66)}; --dvk-title-5-title-glow: ${withAlpha(secondary, 0.34)}`}
        >
          ${this.titleText ? html`<span part="title-text">${this.titleText}</span>` : html`<slot></slot>`}
        </div>
      </div>
    `
  }

  private renderDefs(primary: string, secondary: string, accent: string): unknown {
    return svg`
      <linearGradient id=${this.fadeRailId} x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stop-color=${secondary} stop-opacity="0"></stop>
        <stop offset="0.13" stop-color=${primary} stop-opacity="0.34"></stop>
        <stop offset="0.4" stop-color=${primary} stop-opacity="0.7"></stop>
        <stop offset="0.6" stop-color=${primary} stop-opacity="0.7"></stop>
        <stop offset="0.87" stop-color=${primary} stop-opacity="0.34"></stop>
        <stop offset="1" stop-color=${secondary} stop-opacity="0"></stop>
      </linearGradient>

      <linearGradient id=${this.panelFillId} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color=${secondary} stop-opacity="0.01"></stop>
        <stop offset="1" stop-color=${secondary} stop-opacity="0.04"></stop>
      </linearGradient>

      <linearGradient id=${this.centerLineId} x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stop-color=${secondary} stop-opacity="0.62"></stop>
        <stop offset="0.18" stop-color=${primary} stop-opacity="0.94"></stop>
        <stop offset="0.5" stop-color=${accent} stop-opacity="1"></stop>
        <stop offset="0.82" stop-color=${primary} stop-opacity="0.94"></stop>
        <stop offset="1" stop-color=${secondary} stop-opacity="0.62"></stop>
      </linearGradient>

      <filter id=${this.railGlowId} filterUnits="userSpaceOnUse" x="-20" y="-18" width="1640" height="100">
        <feGaussianBlur stdDeviation="2.1"></feGaussianBlur>
      </filter>

      <filter id=${this.centerGlowId} filterUnits="userSpaceOnUse" x="310" y="30" width="980" height="44">
        <feGaussianBlur stdDeviation="3"></feGaussianBlur>
      </filter>
    `
  }

  private syncGeometry(hostWidth?: number, hostHeight?: number): void {
    const rect = hostWidth === undefined || hostHeight === undefined
      ? this.getBoundingClientRect()
      : undefined
    const width = hostWidth ?? rect?.width ?? 0
    const height = hostHeight ?? rect?.height ?? 0
    const title = this.renderRoot.querySelector<HTMLElement>('.title')
    const nextRun = resolveShoulderRun(width, height)
    const nextHalf = resolveRecessHalf(title?.getBoundingClientRect().width ?? 0, width, nextRun)

    if (Math.abs(nextHalf - this.recessHalf) < 0.5 && Math.abs(nextRun - this.shoulderRun) < 0.5)
      return

    this.recessHalf = nextHalf
    this.shoulderRun = nextRun
  }

  private resolveOpacity(cssVariable: string, fallback: number): number {
    const value = resolveThemeValue<number>({
      cssVariable,
      host: this,
      fallback,
      transform: input => Number.parseFloat(input),
    })

    return Number.isFinite(value) ? value : fallback
  }

  private resolveColors(): [string, string, string] {
    const colorList = this.resolveColorList()
    const explicitPrimary = typeof this.color === 'string' && !isJsonArrayString(this.color)
      ? this.color
      : ''
    const primary = colorList[0] ?? resolveThemeValue({
      explicit: explicitPrimary,
      cssVariable: '--dvk-color-primary',
      host: this,
      fallback: '#42ddff',
    })
    const secondary = colorList[1] ?? resolveThemeValue({
      explicit: this.secondaryColor,
      cssVariable: '--dvk-color-secondary',
      host: this,
      fallback: '#1399ff',
    })
    const accent = colorList[2] ?? resolveThemeValue({
      explicit: this.accentColor,
      cssVariable: '--dvk-title-5-accent',
      host: this,
      fallback: '#b8f7ff',
    })

    return [primary, secondary, accent]
  }

  private resolveColorList(): string[] {
    const colors = splitColors(this.colors)

    if (colors.length > 0)
      return colors

    if (Array.isArray(this.color))
      return this.color.map(color => String(color).trim()).filter(Boolean)

    if (typeof this.color === 'string' && isJsonArrayString(this.color)) {
      try {
        const parsed = JSON.parse(this.color)

        if (Array.isArray(parsed))
          return parsed.map(color => String(color).trim()).filter(Boolean)
      }
      catch {
        return []
      }
    }

    return []
  }
}

function guideRailPath(shoulderX: number, mirrored: boolean): string {
  const outer = formatUnit(VIEW_BOX_WIDTH - shoulderX)

  return mirrored
    ? `M${outer} 7 H${VIEW_BOX_WIDTH}`
    : `M0 7 H${formatUnit(shoulderX)}`
}

function recessPath(half: number, shoulderX: number): string {
  return `M${formatUnit(shoulderX)} ${RAIL_TOP} L${formatUnit(CENTER - half)} ${RAIL_BOTTOM} H${formatUnit(CENTER + half)} L${formatUnit(VIEW_BOX_WIDTH - shoulderX)} ${RAIL_TOP} Z`
}

function mainRailPath(half: number, shoulderX: number): string {
  return `M0 ${RAIL_TOP} H${formatUnit(shoulderX)} L${formatUnit(CENTER - half)} ${RAIL_BOTTOM} H${formatUnit(CENTER + half)} L${formatUnit(VIEW_BOX_WIDTH - shoulderX)} ${RAIL_TOP} H${VIEW_BOX_WIDTH}`
}

// Parallel to the main rail: corners inset 4 inward on x and 4.5 up on y. The H
// segments carry x only — an extra number after H would draw a line across the bar.
function innerRailPath(half: number, shoulderX: number): string {
  const near = CENTER - half + INNER_INSET_X
  const far = CENTER + half - INNER_INSET_X

  return `M0 ${RAIL_TOP - INNER_INSET_Y} H${formatUnit(shoulderX + INNER_INSET_X)} L${formatUnit(near)} ${RAIL_BOTTOM - INNER_INSET_Y} H${formatUnit(far)} L${formatUnit(VIEW_BOX_WIDTH - shoulderX - INNER_INSET_X)} ${RAIL_TOP - INNER_INSET_Y} H${VIEW_BOX_WIDTH}`
}

function centerAccentPath(half: number): string {
  return `M${formatUnit(CENTER - half)} ${RAIL_BOTTOM} H${formatUnit(CENTER + half)}`
}

function slashPath(start: number, index: number, mirrored: boolean): string {
  const offset = index * SLASH_STEP
  const x = mirrored ? VIEW_BOX_WIDTH - start - offset : start + offset

  return `M${formatUnit(x)} 21 ${mirrored ? 'l-9 9' : 'l9 9'}`
}

function formatUnit(value: number): number {
  return Math.round(value * 10) / 10
}

function splitColors(value: string): string[] {
  return value.split(',').map(color => color.trim()).filter(Boolean)
}

function isJsonArrayString(value: string): boolean {
  return value.trim().startsWith('[')
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
    const parts = rgb[1].split(',').map(part => part.trim()).filter(Boolean)
    if (parts.length >= 3)
      return `rgba(${parts.slice(0, 3).join(', ')}, ${clampedAlpha})`
  }

  return trimmed
}
