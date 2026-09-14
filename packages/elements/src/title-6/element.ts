import { DatavElement, ResizeController, resolveThemeValue } from '@datav-kit/core'
import { css, html, svg } from 'lit'
import { property, state } from 'lit/decorators.js'
import { observeElementSize } from '../internal/element-size-observer'
import { resolveTitleCenterHalf } from '../internal/title-center'

const VIEW_BOX_WIDTH = 2048
const VIEW_BOX_HEIGHT = 150
const CENTER = VIEW_BOX_WIDTH / 2

// Vertical design levels, in viewBox units. The prototype's reference canvas is
// 2048 x 682 and its band sits at y 196..346, so these are the prototype's own y
// values minus 196 — except that the ground has been raised and the title lowered,
// because the prototype leaves a dead middle under the text twice the text's depth.
// The upper rail sits well above the support rail so the wing between them reads open;
// the support rail cannot drop far because the horizon is only 22 units below it, so
// the separation is bought by lifting the rail rather than lowering the ground.
const RIBBON_TOP = 33
const RAIL_TOP = 40
const RIBBON_BOTTOM = 117
const SUPPORT_Y = 117
const HORIZON_Y = 139

// The shoulder's rise is pinned by the rails it joins, so only its run is solved
// against the host aspect. 88 across 99 down holds the prototype's 48.3 degrees.
const RAIL_RISE = HORIZON_Y - RAIL_TOP
const SHOULDER_RUN = 88

const RIBBON_WIDTH = 44
const SUPPORT_OVERRUN = 114
const EDGE_TICK_START = 37
const TICK_JUNCTION = 72
const TICK_END = 97
const BOTTOM_GLOW_HALF = 234
const CORE_HALF = 16
const CORE_RADIUS_X = 54
const CORE_RADIUS_Y = 5.6

// The design's title box half-width: the prototype's 528-unit text half plus the
// default gap (80 units, which is what 1.11em comes to at the 72px design font). Keep
// this in step with the `--dvk-title-6-title-gap` default — it is the value a measured
// render would produce, so an unmeasurable one must not disagree with it.
const DEFAULT_HALF = 608

// How far the bend must stay clear of the edge furniture: the ticks end at 97 and
// the ribbon's top-left corner trails roughly a tenth of the run outside the bend.
const RAIL_CLEARANCE = 60

// The prototype's title em box: 72px at a 2048-wide canvas, line-height 1.
const TITLE_SIZE = 72

export function resolveShoulderRun(hostWidth: number, hostHeight: number): number {
  if (!(hostWidth > 0) || !(hostHeight > 0))
    return SHOULDER_RUN

  return SHOULDER_RUN * VIEW_BOX_WIDTH * hostHeight / (VIEW_BOX_HEIGHT * hostWidth)
}

export function resolveFrameHalf(titleWidth: number, hostWidth: number, shoulderRun = SHOULDER_RUN): number {
  return resolveTitleCenterHalf({
    titleWidth,
    hostWidth,
    viewBoxWidth: VIEW_BOX_WIDTH,
    fallback: DEFAULT_HALF,
    // `upperRailPath` bends at `CENTER - half - shoulderRun`, so a title wide enough to
    // push the bend past the ticks would invert the frame.
    limit: CENTER - TICK_END - RAIL_CLEARANCE - shoulderRun,
  })
}

// The band's proportions come from the host height, but a host narrower than the
// design's 12:1 would let a height-sized font overrun the frame sideways.
export function resolveTitleSize(hostWidth: number, hostHeight: number): number {
  if (!(hostWidth > 0) || !(hostHeight > 0))
    return 0

  return TITLE_SIZE * Math.min(hostHeight / VIEW_BOX_HEIGHT, hostWidth / VIEW_BOX_WIDTH)
}

let title6Id = 0

export class Title6Element extends DatavElement {
  static override styles = css`
    :host {
      position: relative;
      display: block;
      width: 100%;
      height: 100%;
      min-width: 0;
      min-height: 0;
      color: var(--dvk-title-6-title-color, #f4fbff);
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
    ellipse {
      vector-effect: non-scaling-stroke;
    }

    .content {
      position: absolute;
      /* y=56 of 150: the title em box centre, dropped below the incoming rails so the
         gap to the horizon stays close to the text's own depth. */
      top: var(--dvk-title-6-title-top, 37.33%);
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
      width: var(--dvk-title-6-title-width, max-content);
      max-width: 100%;
      /* Twice the prototype's 40-unit clearance: at 40 the shoulders crowded the text. */
      padding: 0 var(--dvk-title-6-title-gap, 1.11em);
      overflow: hidden;
      color: var(--dvk-title-6-title-color, #f4fbff);
      font: var(--dvk-title-6-title-font, 700 var(--dvk-title-6-title-size, 42px)/1 'Microsoft YaHei', 'PingFang SC', 'Noto Sans CJK SC', Arial, sans-serif);
      letter-spacing: var(--dvk-title-6-title-letter-spacing, 0.2222em);
      text-align: center;
      white-space: nowrap;
      text-overflow: ellipsis;
      /* Crisp, not neon: the prototype only asks for a restrained cool lower edge
         and a dark depth, so these stay flat instead of taking a palette glow. */
      text-shadow:
        0 0.014em 0 var(--dvk-title-6-title-stroke, rgba(227, 245, 255, 0.28)),
        0 0.042em 0.069em var(--dvk-title-6-title-glow, rgba(0, 7, 15, 0.42));
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
  private frameHalf = DEFAULT_HALF

  @state()
  private shoulderRun = SHOULDER_RUN

  @state()
  private titleSize = 0

  private readonly instanceId = ++title6Id
  private readonly upperRailLeftId = `dvk-title-6-upper-rail-left-${this.instanceId}`
  private readonly upperRailRightId = `dvk-title-6-upper-rail-right-${this.instanceId}`
  private readonly ribbonLeftId = `dvk-title-6-ribbon-left-${this.instanceId}`
  private readonly ribbonRightId = `dvk-title-6-ribbon-right-${this.instanceId}`
  private readonly supportLeftId = `dvk-title-6-support-left-${this.instanceId}`
  private readonly supportRightId = `dvk-title-6-support-right-${this.instanceId}`
  private readonly horizonId = `dvk-title-6-horizon-${this.instanceId}`
  private readonly horizonHaloId = `dvk-title-6-horizon-halo-${this.instanceId}`
  private readonly hotCoreId = `dvk-title-6-hot-core-${this.instanceId}`
  private readonly railGlowId = `dvk-title-6-rail-glow-${this.instanceId}`
  private readonly haloBlurId = `dvk-title-6-halo-blur-${this.instanceId}`
  private readonly coreBlurId = `dvk-title-6-core-blur-${this.instanceId}`

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
    this.emit('dvk-ready', { tagName: 'dvk-title-6' })
    this.observeTitle()
  }

  override updated(): void {
    this.syncGeometry()
  }

  // The host ResizeController only fires when the host box changes, so a width or font
  // variable set at runtime would otherwise leave the frame on its previous width.
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
    const half = this.frameHalf
    const run = this.shoulderRun
    const footX = CENTER - half
    const bendX = footX - run
    const glowOpacity = this.resolveOpacity('--dvk-title-6-glow-opacity', 1)
    const sizeVar = this.resolveTitleSizeVar()

    return html`
      <svg
        part="graphic"
        viewBox="0 0 ${VIEW_BOX_WIDTH} ${VIEW_BOX_HEIGHT}"
        preserveAspectRatio="none"
        aria-hidden="true"
        shape-rendering="geometricPrecision"
      >
        <defs>${this.renderDefs(primary, secondary, accent, footX, bendX)}</defs>

        <path part="ribbon ribbon-left" d=${ribbonPath(bendX, run, false)} fill=${`url(#${this.ribbonLeftId})`}></path>
        <path part="ribbon ribbon-right" d=${ribbonPath(bendX, run, true)} fill=${`url(#${this.ribbonRightId})`}></path>

        <path part="rail rail-left rail-glow" d=${upperRailPath(footX, bendX, false)} fill="none" stroke=${withAlpha(primary, 0.18)} stroke-width="5" opacity=${glowOpacity} filter=${`url(#${this.railGlowId})`}></path>
        <path part="rail rail-right rail-glow" d=${upperRailPath(footX, bendX, true)} fill="none" stroke=${withAlpha(primary, 0.18)} stroke-width="5" opacity=${glowOpacity} filter=${`url(#${this.railGlowId})`}></path>

        <path part="rail rail-left rail-core" d=${upperRailPath(footX, bendX, false)} fill="none" stroke=${`url(#${this.upperRailLeftId})`} stroke-width="2.1"></path>
        <path part="rail rail-right rail-core" d=${upperRailPath(footX, bendX, true)} fill="none" stroke=${`url(#${this.upperRailRightId})`} stroke-width="2.1"></path>

        <path part="support-rail support-rail-left" d=${supportRailPath(footX, false)} fill="none" stroke=${`url(#${this.supportLeftId})`} stroke-width="1.35"></path>
        <path part="support-rail support-rail-right" d=${supportRailPath(footX, true)} fill="none" stroke=${`url(#${this.supportRightId})`} stroke-width="1.35"></path>

        <g part="tick tick-bright" fill="none" stroke=${primary} stroke-width="3.1">
          <path d=${tickPath(EDGE_TICK_START, TICK_JUNCTION, false)}></path>
          <path d=${tickPath(EDGE_TICK_START, TICK_JUNCTION, true)}></path>
        </g>
        <g part="tick tick-dim" fill="none" stroke=${withAlpha(secondary, 0.78)} stroke-width="2">
          <path d=${tickPath(TICK_JUNCTION, TICK_END, false)}></path>
          <path d=${tickPath(TICK_JUNCTION, TICK_END, true)}></path>
        </g>

        <path part="horizon horizon-glow" d=${horizonPath(footX)} fill="none" stroke=${withAlpha(secondary, 0.22)} stroke-width="3" opacity=${glowOpacity} filter=${`url(#${this.railGlowId})`}></path>
        <path part="horizon horizon-core" d=${horizonPath(footX)} fill="none" stroke=${`url(#${this.horizonId})`} stroke-width="1.25"></path>

        <path part="horizon horizon-halo" d=${bottomGlowPath()} fill="none" stroke=${`url(#${this.horizonHaloId})`} stroke-width="4.8" opacity=${0.34 * glowOpacity} filter=${`url(#${this.haloBlurId})`}></path>
        <ellipse part="core core-blur" cx=${CENTER} cy=${HORIZON_Y} rx=${CORE_RADIUS_X} ry=${CORE_RADIUS_Y} fill=${`url(#${this.hotCoreId})`} opacity=${0.3 * glowOpacity} filter=${`url(#${this.coreBlurId})`}></ellipse>
        <path part="core core-line" d=${coreLinePath()} fill="none" stroke=${withAlpha(accent, 0.88)} stroke-width="1.35"></path>
      </svg>
      <div part="content" class="content">
        <div part="title" class="title" style=${sizeVar}>
          ${this.titleText ? html`<span part="title-text">${this.titleText}</span>` : html`<slot></slot>`}
        </div>
      </div>
    `
  }

  private renderDefs(primary: string, secondary: string, accent: string, footX: number, bendX: number): unknown {
    const outer = formatUnit(CENTER - BOTTOM_GLOW_HALF)
    const inner = formatUnit(CENTER + BOTTOM_GLOW_HALF)
    const supportInner = footX + SUPPORT_OVERRUN
    const ribbonTopOuter = ribbonLineAt(bendX, this.shoulderRun, RIBBON_TOP)
    const ribbonBottomOuter = ribbonLineAt(bendX, this.shoulderRun, RIBBON_BOTTOM)

    return svg`
      <linearGradient id=${this.upperRailLeftId} gradientUnits="userSpaceOnUse" x1="0" y1=${RAIL_TOP} x2=${bendX + 32} y2=${RAIL_TOP}>
        <stop offset="0" stop-color=${secondary} stop-opacity="0.55"></stop>
        <stop offset="0.40" stop-color=${secondary} stop-opacity="0.70"></stop>
        <stop offset="0.78" stop-color=${primary} stop-opacity="0.95"></stop>
        <stop offset="1" stop-color=${primary} stop-opacity="1"></stop>
      </linearGradient>

      <linearGradient id=${this.upperRailRightId} gradientUnits="userSpaceOnUse" x1=${VIEW_BOX_WIDTH} y1=${RAIL_TOP} x2=${VIEW_BOX_WIDTH - bendX - 32} y2=${RAIL_TOP}>
        <stop offset="0" stop-color=${secondary} stop-opacity="0.55"></stop>
        <stop offset="0.40" stop-color=${secondary} stop-opacity="0.70"></stop>
        <stop offset="0.78" stop-color=${primary} stop-opacity="0.95"></stop>
        <stop offset="1" stop-color=${primary} stop-opacity="1"></stop>
      </linearGradient>

      <linearGradient id=${this.ribbonLeftId} gradientUnits="userSpaceOnUse" x1=${ribbonTopOuter + 4} y1=${RIBBON_TOP + 4} x2=${ribbonBottomOuter + RIBBON_WIDTH + 1} y2=${RIBBON_BOTTOM - 1}>
        <stop offset="0" stop-color=${secondary} stop-opacity="0.26"></stop>
        <stop offset="0.56" stop-color=${secondary} stop-opacity="0.18"></stop>
        <stop offset="1" stop-color=${secondary} stop-opacity="0.07"></stop>
      </linearGradient>

      <linearGradient id=${this.ribbonRightId} gradientUnits="userSpaceOnUse" x1=${VIEW_BOX_WIDTH - ribbonTopOuter - 4} y1=${RIBBON_TOP + 4} x2=${VIEW_BOX_WIDTH - ribbonBottomOuter - RIBBON_WIDTH - 1} y2=${RIBBON_BOTTOM - 1}>
        <stop offset="0" stop-color=${secondary} stop-opacity="0.26"></stop>
        <stop offset="0.56" stop-color=${secondary} stop-opacity="0.18"></stop>
        <stop offset="1" stop-color=${secondary} stop-opacity="0.07"></stop>
      </linearGradient>

      <linearGradient id=${this.supportLeftId} gradientUnits="userSpaceOnUse" x1=${EDGE_TICK_START} y1=${SUPPORT_Y} x2=${supportInner} y2=${SUPPORT_Y}>
        <stop offset="0" stop-color=${secondary} stop-opacity="0.68"></stop>
        <stop offset="0.16" stop-color=${secondary} stop-opacity="0.63"></stop>
        <stop offset="0.72" stop-color=${secondary} stop-opacity="0.58"></stop>
        <stop offset="0.92" stop-color=${secondary} stop-opacity="0.28"></stop>
        <stop offset="1" stop-color=${secondary} stop-opacity="0"></stop>
      </linearGradient>

      <linearGradient id=${this.supportRightId} gradientUnits="userSpaceOnUse" x1=${VIEW_BOX_WIDTH - EDGE_TICK_START} y1=${SUPPORT_Y} x2=${VIEW_BOX_WIDTH - supportInner} y2=${SUPPORT_Y}>
        <stop offset="0" stop-color=${secondary} stop-opacity="0.68"></stop>
        <stop offset="0.16" stop-color=${secondary} stop-opacity="0.63"></stop>
        <stop offset="0.72" stop-color=${secondary} stop-opacity="0.58"></stop>
        <stop offset="0.92" stop-color=${secondary} stop-opacity="0.28"></stop>
        <stop offset="1" stop-color=${secondary} stop-opacity="0"></stop>
      </linearGradient>

      <linearGradient id=${this.horizonId} gradientUnits="userSpaceOnUse" x1=${footX} y1=${HORIZON_Y} x2=${VIEW_BOX_WIDTH - footX} y2=${HORIZON_Y}>
        <stop offset="0" stop-color=${secondary} stop-opacity="0.52"></stop>
        <stop offset="0.34" stop-color=${secondary} stop-opacity="0.50"></stop>
        <stop offset="0.43" stop-color=${primary} stop-opacity="0.36"></stop>
        <stop offset="0.477" stop-color=${primary} stop-opacity="0.50"></stop>
        <stop offset="0.493" stop-color=${accent} stop-opacity="0.66"></stop>
        <stop offset="0.499" stop-color=${accent} stop-opacity="0.84"></stop>
        <stop offset="0.501" stop-color=${accent} stop-opacity="0.88"></stop>
        <stop offset="0.507" stop-color=${accent} stop-opacity="0.66"></stop>
        <stop offset="0.523" stop-color=${primary} stop-opacity="0.50"></stop>
        <stop offset="0.57" stop-color=${primary} stop-opacity="0.36"></stop>
        <stop offset="0.66" stop-color=${secondary} stop-opacity="0.50"></stop>
        <stop offset="1" stop-color=${secondary} stop-opacity="0.52"></stop>
      </linearGradient>

      <linearGradient id=${this.horizonHaloId} gradientUnits="userSpaceOnUse" x1=${outer} y1=${HORIZON_Y} x2=${inner} y2=${HORIZON_Y}>
        <stop offset="0" stop-color=${primary} stop-opacity="0"></stop>
        <stop offset="0.35" stop-color=${primary} stop-opacity="0.22"></stop>
        <stop offset="0.47" stop-color=${primary} stop-opacity="0.56"></stop>
        <stop offset="0.50" stop-color=${accent} stop-opacity="0.90"></stop>
        <stop offset="0.53" stop-color=${primary} stop-opacity="0.56"></stop>
        <stop offset="0.65" stop-color=${primary} stop-opacity="0.22"></stop>
        <stop offset="1" stop-color=${primary} stop-opacity="0"></stop>
      </linearGradient>

      <radialGradient id=${this.hotCoreId} cx="50%" cy="50%" r="50%">
        <stop offset="0" stop-color=${accent} stop-opacity="1"></stop>
        <stop offset="0.22" stop-color=${accent} stop-opacity="0.95"></stop>
        <stop offset="0.52" stop-color=${primary} stop-opacity="0.54"></stop>
        <stop offset="1" stop-color=${primary} stop-opacity="0"></stop>
      </radialGradient>

      <filter id=${this.railGlowId} filterUnits="userSpaceOnUse" x="-20" y="${RAIL_TOP - 20}" width="${VIEW_BOX_WIDTH + 40}" height="${RAIL_RISE + 40}">
        <feGaussianBlur stdDeviation="2.2"></feGaussianBlur>
      </filter>

      <filter id=${this.haloBlurId} filterUnits="userSpaceOnUse" x="${outer - 60}" y="${HORIZON_Y - 40}" width="${inner - outer + 120}" height="80">
        <feGaussianBlur stdDeviation="4.4"></feGaussianBlur>
      </filter>

      <filter id=${this.coreBlurId} filterUnits="userSpaceOnUse" x="${CENTER - CORE_RADIUS_X - 40}" y="${HORIZON_Y - 30}" width="${CORE_RADIUS_X * 2 + 80}" height="60">
        <feGaussianBlur stdDeviation="2"></feGaussianBlur>
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
    const nextHalf = resolveFrameHalf(title?.getBoundingClientRect().width ?? 0, width, nextRun)
    const nextSize = resolveTitleSize(width, height)

    if (
      Math.abs(nextHalf - this.frameHalf) < 0.5
      && Math.abs(nextRun - this.shoulderRun) < 0.5
      && Math.abs(nextSize - this.titleSize) < 0.5
    ) {
      return
    }

    this.frameHalf = nextHalf
    this.shoulderRun = nextRun
    this.titleSize = nextSize
  }

  // An explicit variable wins unconditionally; otherwise the size tracks the host.
  private resolveTitleSizeVar(): string {
    const explicit = resolveThemeValue<string>({
      cssVariable: '--dvk-title-6-title-size',
      host: this,
      fallback: '',
    })

    if (explicit)
      return `--dvk-title-6-title-size: ${explicit}`

    return this.titleSize > 0 ? `--dvk-title-6-title-size: ${Math.round(this.titleSize * 100) / 100}px` : ''
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
      fallback: '#58b4ff',
    })
    const secondary = colorList[1] ?? resolveThemeValue({
      explicit: this.secondaryColor,
      cssVariable: '--dvk-color-secondary',
      host: this,
      fallback: '#256090',
    })
    const accent = colorList[2] ?? resolveThemeValue({
      explicit: this.accentColor,
      cssVariable: '--dvk-title-6-accent',
      host: this,
      fallback: '#dff6ff',
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

// The ribbon runs parallel to the shoulder, so it is the shoulder line offset inward.
function ribbonLineAt(bendX: number, run: number, y: number): number {
  return bendX + run * (y - RAIL_TOP) / RAIL_RISE
}

function ribbonPath(bendX: number, run: number, mirrored: boolean): string {
  const topOuter = ribbonLineAt(bendX, run, RIBBON_TOP)
  const bottomOuter = ribbonLineAt(bendX, run, RIBBON_BOTTOM)
  const x = (value: number): number => formatUnit(mirrored ? VIEW_BOX_WIDTH - value : value)

  return `M${x(topOuter)} ${RIBBON_TOP} H${x(topOuter + RIBBON_WIDTH)} L${x(bottomOuter + RIBBON_WIDTH)} ${RIBBON_BOTTOM} H${x(bottomOuter)} Z`
}

function upperRailPath(footX: number, bendX: number, mirrored: boolean): string {
  const x = (value: number): number => formatUnit(mirrored ? VIEW_BOX_WIDTH - value : value)

  return `M${x(0)} ${RAIL_TOP} H${x(bendX)} L${x(footX)} ${HORIZON_Y}`
}

function supportRailPath(footX: number, mirrored: boolean): string {
  const x = (value: number): number => formatUnit(mirrored ? VIEW_BOX_WIDTH - value : value)

  return `M${x(EDGE_TICK_START)} ${SUPPORT_Y} H${x(footX + SUPPORT_OVERRUN)}`
}

function tickPath(start: number, end: number, mirrored: boolean): string {
  const x = (value: number): number => formatUnit(mirrored ? VIEW_BOX_WIDTH - value : value)

  return `M${x(start)} ${SUPPORT_Y} H${x(end)}`
}

function horizonPath(footX: number): string {
  return `M${formatUnit(footX)} ${HORIZON_Y} H${formatUnit(VIEW_BOX_WIDTH - footX)}`
}

function bottomGlowPath(): string {
  return `M${formatUnit(CENTER - BOTTOM_GLOW_HALF)} ${HORIZON_Y} H${formatUnit(CENTER + BOTTOM_GLOW_HALF)}`
}

function coreLinePath(): string {
  return `M${formatUnit(CENTER - CORE_HALF)} ${HORIZON_Y} H${formatUnit(CENTER + CORE_HALF)}`
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
