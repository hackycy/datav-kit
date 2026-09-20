import { DatavElement, ResizeController, resolveThemeValue } from '@datav-kit/core'
import { css, html, svg } from 'lit'
import { property, state } from 'lit/decorators.js'
import { observeElementSize } from '../internal/element-size-observer'
import { resolveTitleCenterHalf } from '../internal/title-center'

const VIEW_BOX_WIDTH = 2048
const VIEW_BOX_HEIGHT = 180
const CENTER = VIEW_BOX_WIDTH / 2

// The prototype's canvas is 2048 x 320, but its artwork and text stop at y 178 — rows
// 184..319 are byte-identical to the page backdrop — so the band is cropped there and
// every y below is the prototype's own value, unshifted.
//
// Vertical design levels. The upper rail runs in from each edge at RAIL_Y, bends down
// through the shoulder, and lands on the luminous spine at HORIZON_Y; the band fill and
// the dark recess sit under the rail between BAND_TOP and SHELF_BOTTOM. The band's
// diagonal is NOT parallel to the rail: the rail falls 87 units to the horizon while the
// band falls 84 to the shelf's bottom edge, both arriving at the same x. Do not project
// one slope onto the other.
const RAIL_Y = 83
const BAND_TOP = 84
const SHELF_TOP = 123
const SHELF_BOTTOM = 168
const SLASH_TOP = 138
const SLASH_BOTTOM = 165
const LOWER_RAIL_Y = 166
const HORIZON_Y = 170
const RAIL_RISE = HORIZON_Y - RAIL_Y

// The spine: a broad glowing bar with a crisp core inside it, plus the soft aura pooled
// under it. The prototype's glow rect overhangs the core by one unit on each side, which
// is what makes the glow read as a halo rather than a thicker line.
const SPINE_GLOW_TOP = 170.2
const SPINE_GLOW_HEIGHT = 2.15
const SPINE_GLOW_RADIUS = 1.1
const SPINE_OVERHANG = 1
const SPINE_CORE_TOP = 170.55
const SPINE_CORE_HEIGHT = 0.8
const SPINE_CORE_RADIUS = 0.4
const AURA_CY = 174
const AURA_RY = 15
const AURA_HALF = 315

// Horizontal design geometry, as insets from the shoulder's bend and foot. Everything
// inboard of the edge furniture is a function of the measured frame; only the dot
// matrices are pinned to the host edge.
const SHOULDER_RUN = 70
const SHELF_TOP_INSET = 14
const SHELF_TOE_INSET = 49
const LOWER_RAIL_INSET = 94
const SLASH_SETBACK = 82

// The prototype's three blades, as offsets from the bend. They are not interchangeable:
// the top edges step 22/22 apart with widths 13/13/14, and each carries its own rightward
// skew to the bottom edge (20/19/20) with a slightly narrower bottom.
const SLASH_BLADES = [
  { topLeft: -82, topRight: -69, bottomLeft: -62, bottomRight: -51 },
  { topLeft: -60, topRight: -47, bottomLeft: -41, bottomRight: -28 },
  { topLeft: -38, topRight: -24, bottomLeft: -18, bottomRight: -6 },
]

// The terminal dot matrices: an 8 x 3 grid pinned to each edge. The prototype's right
// group is hand-drifted (inset ~8 units further, raised 5, a different per-column width
// pattern and different row opacities); the component mirrors the left group instead, as
// the rest of the title family does.
const DOT_COLUMNS = [36, 51, 65, 79, 94, 108, 123, 138]
const DOT_WIDTHS = [5, 5, 6, 6, 6, 5, 5, 5]
const DOT_ROWS = [
  { y: 123, height: 5, opacity: 0.17 },
  { y: 138, height: 5, opacity: 0.27 },
  { y: 153, height: 5, opacity: 0.18 },
]
const DOT_RADIUS = 1
// A fixed decoration, not a palette role: the dots are a dim stamp on whatever surface is
// behind them, so they keep the prototype's own colour rather than taking a theme colour.
const DOT_COLOR = '#214968'
const DOT_END = DOT_COLUMNS[DOT_COLUMNS.length - 1] + DOT_WIDTHS[DOT_WIDTHS.length - 1]

// The design's own foot half-span: the prototype's rails, band, recess and blades all
// land on x 579, so 1024 - 579 = 445. (The spine's glow rect sits one unit outboard of
// that at 578 — see SPINE_OVERHANG.) Taking 445 rather than 445.5 is what makes the
// unmeasurable fallback reproduce every one of the prototype's own coordinates verbatim,
// which is what the middle-span contract asks of `fallback`.
//
// The matching clearance is `--dvk-title-5-title-gap`: the design's title box is 8 CJK
// glyphs at 1.105em advance (1em glyph + .105em tracking) = 8.84em, plus two gaps, and it
// has to come to 11.71em — 889.96 units at the 76px design font — for the foot to land on
// 579. So the gap is (445 - 8.84em / 2) / 76 = 1.435em, and the two together close the
// identity `box + 2 * gap = spine length`. Keep this in step with that default: it is the
// value a measured render produces, so an unmeasurable one must not disagree with it.
//
// The component drops the prototype's `scaleX(1.035)` on the text, so its box is 11.8
// units narrower per side than the rendered reference and its ink clears the spine by 109
// units where the reference's clears it by 98. That is the price of reproducing the frame
// exactly — the same kind of trade title-4 documents for its doubled gap.
const DEFAULT_HALF = 445

// How far the slash group must stay clear of the dot matrices. The blades (y 138..165)
// overlap the matrices' lower two rows (y 138..158), and the blades' outer edge is
// `bendX - SLASH_SETBACK`, so that — not the bend itself — is what the ceiling protects.
// The band, recess and lower rail all start at x=0 and cross the matrices' columns by
// design (the prototype paints the dots after them, so the dots sit on the dark recess),
// and the lower rail runs at y=166, below the matrices' last row.
const DOT_CLEARANCE = 40

// The prototype's title em box: 76px at a 2048-wide canvas, line-height 1.
const TITLE_SIZE = 76

// Where the title box's own bottom sits, in viewBox units — the prototype's box top
// (70.08) plus the 76px em box. Pinning the box *bottom* rather than its centre is what
// keeps the title in a fixed relationship to the spine it is designed around:
// `preserveAspectRatio="none"` stretches the artwork to any box the host is given, but the
// text tracks the host width alone, so a fixed centre lets a stretched band carry the
// title up and open the gap beneath it. The percent fallback for an unmeasurable host is
// `(146.1 - 76 / 2) / 180`.
const TITLE_BOX_BOTTOM = 146.1

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
    // At the ceiling the blades' outer edge sits `DOT_CLEARANCE` inboard of the matrices,
    // so a title wide enough to push them further would print the blades over the dots.
    limit: CENTER - DOT_END - DOT_CLEARANCE - SLASH_SETBACK - shoulderRun,
  })
}

// The band's proportions come from the host height, but a host narrower than the design's
// 11.4:1 would let a height-sized font overrun the frame sideways.
export function resolveTitleSize(hostWidth: number, hostHeight: number): number {
  if (!(hostWidth > 0) || !(hostHeight > 0))
    return 0

  return TITLE_SIZE * Math.min(hostHeight / VIEW_BOX_HEIGHT, hostWidth / VIEW_BOX_WIDTH)
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
      color: var(--dvk-title-5-title-color, #f4fbff);
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

    .content {
      position: absolute;
      /* Set from the host's aspect below; 60.06% is TITLE_BOX_BOTTOM minus half the design
         font, which is what an environment that cannot measure the host gets. */
      top: var(--dvk-title-5-title-top, 60.06%);
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
      /* The prototype's own clearance, so the frame lands on its design coordinates. */
      padding: 0 var(--dvk-title-5-title-gap, 1.435em);
      overflow: hidden;
      /* The prototype gives the glyphs a vertical white-to-blue ramp rather than a flat
         fill, which title-3 and title-4 both dropped. It survives here because it is pure
         CSS: the ramp is the background, clipped to the glyphs. The title-color variable
         is the flat fallback, used when the gradient variable is set to none. */
      color: var(--dvk-title-5-title-color, transparent);
      background-image: var(--dvk-title-5-title-gradient, linear-gradient(180deg, #fcfcfd 0%, #f8fbfd 25%, #edf7fd 43%, #cfe9fa 62%, #9ed1f2 79%, #63afe3 100%));
      -webkit-background-clip: text;
      background-clip: text;
      font: var(--dvk-title-5-title-font, 900 var(--dvk-title-5-title-size, 44px)/1 'Microsoft YaHei', 'PingFang SC', 'Noto Sans CJK SC', Arial, sans-serif);
      letter-spacing: var(--dvk-title-5-title-letter-spacing, 0.105em);
      text-align: center;
      white-space: nowrap;
      text-overflow: ellipsis;
      /* 0.717px at the prototype's 76px design font, which is what its viewport-relative
         max(0.35px, 0.035vw) resolves to at the full 2048 width. The px floor has no
         meaning once the value scales with the font. */
      -webkit-text-stroke: var(--dvk-title-5-title-stroke-width, .0094em) var(--dvk-title-5-title-stroke, rgba(238, 249, 255, 0.64));
      /* The prototype's three drop-shadows, in em so they track the font. A filter rather
         than text-shadow: the glyphs are painted by the background clip above, and
         text-shadow's behaviour under a transparent colour is not something to rely on. */
      filter: drop-shadow(0 .0132em 0 var(--dvk-title-5-title-glow, rgba(255, 255, 255, 0.2))) drop-shadow(0 .0263em .0263em var(--dvk-title-5-title-halo, rgba(61, 190, 249, 0.18))) drop-shadow(0 .0658em .0921em var(--dvk-title-5-title-shadow, rgba(36, 155, 229, 0.13)));
    }

    slot::slotted(*) {
      color: inherit;
      font: inherit;
      letter-spacing: inherit;
      text-align: inherit;
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

  @state()
  private hostHeight = 0

  private readonly instanceId = ++title5Id
  private readonly bloomId = `dvk-title-5-bloom-${this.instanceId}`
  private readonly bandLeftId = `dvk-title-5-band-left-${this.instanceId}`
  private readonly bandRightId = `dvk-title-5-band-right-${this.instanceId}`
  private readonly railLeftId = `dvk-title-5-upper-rail-left-${this.instanceId}`
  private readonly railRightId = `dvk-title-5-upper-rail-right-${this.instanceId}`
  private readonly lowerLeftId = `dvk-title-5-lower-rail-left-${this.instanceId}`
  private readonly lowerRightId = `dvk-title-5-lower-rail-right-${this.instanceId}`
  private readonly slashLeftId = `dvk-title-5-slash-left-${this.instanceId}`
  private readonly slashRightId = `dvk-title-5-slash-right-${this.instanceId}`
  private readonly auraId = `dvk-title-5-aura-${this.instanceId}`
  private readonly spineId = `dvk-title-5-spine-${this.instanceId}`
  private readonly railGlowId = `dvk-title-5-rail-glow-${this.instanceId}`
  private readonly lineGlowId = `dvk-title-5-line-glow-${this.instanceId}`

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
    const glowOpacity = this.resolveOpacity('--dvk-title-5-glow-opacity', 1)
    const sizeVar = this.resolveTitleSizeVar()
    const topVar = this.resolveTitleTopVar()

    // The spine's glow rect overhangs the core by one unit on each side; both are then
    // spread symmetrically about CENTER, which normalises the prototype's own half-unit
    // asymmetry (its glow spans 578..1469 and its core 579..1468, centring on 1023.5).
    const glowX = footX - SPINE_OVERHANG
    const glowWidth = VIEW_BOX_WIDTH - 2 * glowX
    const coreWidth = VIEW_BOX_WIDTH - 2 * footX
    const auraHalf = AURA_HALF * half / DEFAULT_HALF
    const recessFill = this.resolveRecess()

    return html`
      <svg
        part="graphic"
        viewBox="0 0 ${VIEW_BOX_WIDTH} ${VIEW_BOX_HEIGHT}"
        preserveAspectRatio="none"
        aria-hidden="true"
        shape-rendering="geometricPrecision"
      >
        <defs>${this.renderDefs(primary, secondary, accent, footX, bendX, glowX, glowWidth)}</defs>

        ${this.renderBlooms()}
        ${this.renderBand(footX, bendX)}
        ${this.renderRecess(footX, bendX, recessFill)}

        <path part="upper-rail upper-rail-left upper-rail-glow" d=${upperRailPath(footX, bendX, false)} fill="none" stroke=${`url(#${this.railLeftId})`} stroke-width="1.35" opacity=${glowOpacity} filter=${`url(#${this.railGlowId})`}></path>
        <path part="upper-rail upper-rail-right upper-rail-glow" d=${upperRailPath(footX, bendX, true)} fill="none" stroke=${`url(#${this.railRightId})`} stroke-width="1.35" opacity=${glowOpacity} filter=${`url(#${this.railGlowId})`}></path>
        <path part="upper-rail upper-rail-left upper-rail-core" d=${upperRailPath(footX, bendX, false)} fill="none" stroke=${`url(#${this.railLeftId})`} stroke-width="1.35"></path>
        <path part="upper-rail upper-rail-right upper-rail-core" d=${upperRailPath(footX, bendX, true)} fill="none" stroke=${`url(#${this.railRightId})`} stroke-width="1.35"></path>

        <path part="lower-rail lower-rail-left" d=${lowerRailPath(bendX, false)} fill="none" stroke=${`url(#${this.lowerLeftId})`} stroke-width="1.2"></path>
        <path part="lower-rail lower-rail-right" d=${lowerRailPath(bendX, true)} fill="none" stroke=${`url(#${this.lowerRightId})`} stroke-width="1.2"></path>

        ${this.renderSlashes(bendX)}
        ${this.renderDots()}

        <ellipse part="aura" cx=${CENTER} cy=${AURA_CY} rx=${formatUnit(auraHalf)} ry=${AURA_RY} fill=${`url(#${this.auraId})`}></ellipse>
        <rect part="spine spine-glow" x=${formatUnit(glowX)} y=${SPINE_GLOW_TOP} width=${formatUnit(glowWidth)} height=${SPINE_GLOW_HEIGHT} rx=${SPINE_GLOW_RADIUS} fill=${`url(#${this.spineId})`} opacity=${0.92 * glowOpacity} filter=${`url(#${this.lineGlowId})`}></rect>
        <rect part="spine spine-core" x=${formatUnit(footX)} y=${SPINE_CORE_TOP} width=${formatUnit(coreWidth)} height=${SPINE_CORE_HEIGHT} rx=${SPINE_CORE_RADIUS} fill=${`url(#${this.spineId})`} opacity=".86"></rect>
      </svg>
      <div part="content" class="content" style=${topVar}>
        <div part="title" class="title" style=${sizeVar}>
          ${this.titleText ? html`<span part="title-text">${this.titleText}</span>` : html`<slot></slot>`}
        </div>
      </div>
    `
  }

  // An ambient bloom pooled around the title and the recess, painted under everything. It
  // is load-bearing: the recess is a *darker* fill than the page, so without a lit field
  // around it the notch has nothing to be cut out of. Its stops are the prototype's own
  // hand-picked navies — a saturated theme colour at the same alpha reads two to three
  // times brighter and blows the wings past the spine, so they are not palette roles.
  //
  // The prototype also draws a second bloom entering from the top edge, brightest right at
  // y=0. It is dropped here: it put a hard lit boundary across the top of the band for no
  // gain over the page it sits on, and the notch reads off this one alone.
  private renderBlooms(): unknown {
    return svg`
      <rect part="bloom" width=${VIEW_BOX_WIDTH} height=${VIEW_BOX_HEIGHT} fill=${`url(#${this.bloomId})`}></rect>
    `
  }

  private renderBand(footX: number, bendX: number): unknown {
    return svg`
      <path part="band band-left" d=${bandPath(footX, bendX, false)} fill=${`url(#${this.bandLeftId})`}></path>
      <path part="band band-right" d=${bandPath(footX, bendX, true)} fill=${`url(#${this.bandRightId})`}></path>
    `
  }

  private renderRecess(footX: number, bendX: number, fill: string): unknown {
    return svg`
      <path part="recess recess-left" d=${recessPath(footX, bendX, false)} fill=${fill}></path>
      <path part="recess recess-right" d=${recessPath(footX, bendX, true)} fill=${fill}></path>
    `
  }

  private renderSlashes(bendX: number): unknown {
    return svg`
      <g part="slash slash-left" fill=${`url(#${this.slashLeftId})`}>
        ${SLASH_BLADES.map(blade => svg`<polygon points=${slashPoints(bendX, blade, false)}></polygon>`)}
      </g>
      <g part="slash slash-right" fill=${`url(#${this.slashRightId})`}>
        ${SLASH_BLADES.map(blade => svg`<polygon points=${slashPoints(bendX, blade, true)}></polygon>`)}
      </g>
    `
  }

  private renderDots(): unknown {
    return svg`
      <g part="dots dots-left" fill=${DOT_COLOR}>
        ${DOT_ROWS.map(row => svg`<g opacity=${row.opacity}>${DOT_COLUMNS.map((x, index) => svg`<rect x=${x} y=${row.y} width=${DOT_WIDTHS[index]} height=${row.height} rx=${DOT_RADIUS}></rect>`)}</g>`)}
      </g>
      <g part="dots dots-right" fill=${DOT_COLOR}>
        ${DOT_ROWS.map(row => svg`<g opacity=${row.opacity}>${DOT_COLUMNS.map((x, index) => svg`<rect x=${formatUnit(VIEW_BOX_WIDTH - x - DOT_WIDTHS[index])} y=${row.y} width=${DOT_WIDTHS[index]} height=${row.height} rx=${DOT_RADIUS}></rect>`)}</g>`)}
      </g>
    `
  }

  private renderDefs(primary: string, secondary: string, accent: string, footX: number, bendX: number, glowX: number, glowWidth: number): unknown {
    const lowerInner = formatUnit(bendX - LOWER_RAIL_INSET)

    return svg`
      <radialGradient id=${this.bloomId} gradientUnits="userSpaceOnUse" cx=${CENTER} cy="0" r="880.64" gradientTransform="translate(0 126.6) scale(1 0.0813)">
        <stop offset="0" stop-color="#175684" stop-opacity=".14"></stop>
        <stop offset=".42" stop-color="#0f3b60" stop-opacity=".1"></stop>
        <stop offset="1" stop-color="#06111f" stop-opacity="0"></stop>
      </radialGradient>

      <linearGradient id=${this.bandLeftId} gradientUnits="userSpaceOnUse" x1="0" y1="0" x2=${formatUnit(footX)} y2="0">
        <stop offset="0" stop-color=${secondary} stop-opacity=".002"></stop>
        <stop offset=".43" stop-color=${secondary} stop-opacity=".013"></stop>
        <stop offset=".72" stop-color=${secondary} stop-opacity=".062"></stop>
        <stop offset=".91" stop-color=${secondary} stop-opacity=".1"></stop>
        <stop offset="1" stop-color=${secondary} stop-opacity=".22"></stop>
      </linearGradient>

      <linearGradient id=${this.bandRightId} gradientUnits="userSpaceOnUse" x1=${VIEW_BOX_WIDTH} y1="0" x2=${formatUnit(VIEW_BOX_WIDTH - footX)} y2="0">
        <stop offset="0" stop-color=${secondary} stop-opacity=".002"></stop>
        <stop offset=".43" stop-color=${secondary} stop-opacity=".013"></stop>
        <stop offset=".72" stop-color=${secondary} stop-opacity=".062"></stop>
        <stop offset=".91" stop-color=${secondary} stop-opacity=".1"></stop>
        <stop offset="1" stop-color=${secondary} stop-opacity=".22"></stop>
      </linearGradient>

      <linearGradient id=${this.railLeftId} gradientUnits="userSpaceOnUse" x1="0" y1=${RAIL_Y} x2=${formatUnit(footX)} y2=${HORIZON_Y}>
        <stop offset="0" stop-color=${secondary} stop-opacity=".26"></stop>
        <stop offset=".64" stop-color=${secondary} stop-opacity=".59"></stop>
        <stop offset=".88" stop-color=${primary} stop-opacity=".67"></stop>
        <stop offset="1" stop-color=${primary} stop-opacity="1"></stop>
      </linearGradient>

      <linearGradient id=${this.railRightId} gradientUnits="userSpaceOnUse" x1=${VIEW_BOX_WIDTH} y1=${RAIL_Y} x2=${formatUnit(VIEW_BOX_WIDTH - footX)} y2=${HORIZON_Y}>
        <stop offset="0" stop-color=${secondary} stop-opacity=".26"></stop>
        <stop offset=".64" stop-color=${secondary} stop-opacity=".59"></stop>
        <stop offset=".88" stop-color=${primary} stop-opacity=".67"></stop>
        <stop offset="1" stop-color=${primary} stop-opacity="1"></stop>
      </linearGradient>

      <linearGradient id=${this.lowerLeftId} gradientUnits="userSpaceOnUse" x1="0" y1="0" x2=${lowerInner} y2="0">
        <stop offset="0" stop-color=${secondary} stop-opacity=".11"></stop>
        <stop offset=".62" stop-color=${secondary} stop-opacity=".29"></stop>
        <stop offset="1" stop-color=${secondary} stop-opacity=".63"></stop>
      </linearGradient>

      <linearGradient id=${this.lowerRightId} gradientUnits="userSpaceOnUse" x1=${VIEW_BOX_WIDTH} y1="0" x2=${formatUnit(VIEW_BOX_WIDTH - (bendX - LOWER_RAIL_INSET))} y2="0">
        <stop offset="0" stop-color=${secondary} stop-opacity=".11"></stop>
        <stop offset=".62" stop-color=${secondary} stop-opacity=".29"></stop>
        <stop offset="1" stop-color=${secondary} stop-opacity=".63"></stop>
      </linearGradient>

      <linearGradient id=${this.slashLeftId} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color=${primary} stop-opacity=".44"></stop>
        <stop offset="1" stop-color=${secondary} stop-opacity=".45"></stop>
      </linearGradient>

      <linearGradient id=${this.slashRightId} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color=${primary} stop-opacity=".44"></stop>
        <stop offset="1" stop-color=${secondary} stop-opacity=".45"></stop>
      </linearGradient>

      <radialGradient id=${this.auraId} cx="50%" cy="50%" r="50%" gradientTransform="translate(0 .2) scale(1 .22)">
        <stop offset="0" stop-color="#70ddff" stop-opacity=".43"></stop>
        <stop offset=".28" stop-color="#35b6ed" stop-opacity=".18"></stop>
        <stop offset="1" stop-color="#1e7fbb" stop-opacity="0"></stop>
      </radialGradient>

      <linearGradient id=${this.spineId} gradientUnits="userSpaceOnUse" x1=${formatUnit(footX)} y1="0" x2=${formatUnit(VIEW_BOX_WIDTH - footX)} y2="0">
        <stop offset="0" stop-color=${secondary} stop-opacity=".4"></stop>
        <stop offset=".12" stop-color=${secondary} stop-opacity=".91"></stop>
        <stop offset=".34" stop-color=${primary} stop-opacity=".7"></stop>
        <stop offset=".445" stop-color=${primary} stop-opacity=".96"></stop>
        <stop offset=".487" stop-color=${accent} stop-opacity=".89"></stop>
        <stop offset=".5" stop-color=${accent} stop-opacity="1"></stop>
        <stop offset=".513" stop-color=${accent} stop-opacity=".89"></stop>
        <stop offset=".555" stop-color=${primary} stop-opacity=".96"></stop>
        <stop offset=".66" stop-color=${primary} stop-opacity=".7"></stop>
        <stop offset=".88" stop-color=${secondary} stop-opacity=".91"></stop>
        <stop offset="1" stop-color=${secondary} stop-opacity=".4"></stop>
      </linearGradient>

      <filter id=${this.railGlowId} filterUnits="userSpaceOnUse" x="-24" y=${RAIL_Y - 20} width=${VIEW_BOX_WIDTH + 48} height=${RAIL_RISE + 40}>
        <feGaussianBlur stdDeviation="1.1"></feGaussianBlur>
      </filter>

      <filter id=${this.lineGlowId} filterUnits="userSpaceOnUse" x=${formatUnit(glowX - 24)} y=${SPINE_GLOW_TOP - 22} width=${formatUnit(glowWidth + 48)} height=${SPINE_GLOW_HEIGHT + 44}>
        <feGaussianBlur stdDeviation="1.9" result="blur"></feGaussianBlur>
        <feMerge>
          <feMergeNode in="blur"></feMergeNode>
          <feMergeNode in="SourceGraphic"></feMergeNode>
        </feMerge>
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
    this.hostHeight = height
  }

  // An explicit variable wins unconditionally; otherwise the size tracks the host.
  private resolveTitleSizeVar(): string {
    const explicit = resolveThemeValue<string>({
      cssVariable: '--dvk-title-5-title-size',
      host: this,
      fallback: '',
    })

    if (explicit)
      return `--dvk-title-5-title-size: ${explicit}`

    return this.titleSize > 0 ? `--dvk-title-5-title-size: ${Math.round(this.titleSize * 100) / 100}px` : ''
  }

  // An explicit variable wins unconditionally; otherwise the title box is anchored to the
  // spine rather than to the top of the band. `preserveAspectRatio="none"` stretches the
  // artwork to whatever box the host is given, so a band taller than the design's 11.4:1
  // has more room than the text — which tracks the width alone — can fill. Anchoring the
  // box's bottom keeps the design's clearance to the spine at every aspect instead of
  // letting the gap grow with the stretch.
  private resolveTitleTopVar(): string {
    const explicit = resolveThemeValue<string>({
      cssVariable: '--dvk-title-5-title-top',
      host: this,
      fallback: '',
    })

    if (explicit)
      return `--dvk-title-5-title-top: ${explicit}`

    if (!(this.hostHeight > 0) || !(this.titleSize > 0))
      return ''

    const top = TITLE_BOX_BOTTOM * this.hostHeight / VIEW_BOX_HEIGHT - this.titleSize / 2

    return `--dvk-title-5-title-top: ${Math.round(top * 100) / 100}px`
  }

  private resolveRecess(): string {
    return resolveThemeValue<string>({
      cssVariable: '--dvk-title-5-recess',
      host: this,
      fallback: 'rgba(4, 16, 30, 0.72)',
    })
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
    // The prototype's own colours are hand-picked navies picked against a #06111f page, so
    // these fallbacks are taken from it rather than from the family — a saturated brand
    // colour at the same alpha reads two to three times brighter across the wings.
    const primary = colorList[0] ?? resolveThemeValue({
      explicit: explicitPrimary,
      cssVariable: '--dvk-color-primary',
      host: this,
      fallback: '#5ecdf0',
    })
    const secondary = colorList[1] ?? resolveThemeValue({
      explicit: this.secondaryColor,
      cssVariable: '--dvk-color-secondary',
      host: this,
      fallback: '#2a78b5',
    })
    const accent = colorList[2] ?? resolveThemeValue({
      explicit: this.accentColor,
      cssVariable: '--dvk-title-5-accent',
      host: this,
      fallback: '#effcff',
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

function bandPath(footX: number, bendX: number, mirrored: boolean): string {
  const x = (value: number): number => formatUnit(mirrored ? VIEW_BOX_WIDTH - value : value)

  return `M${x(0)} ${BAND_TOP} H${x(bendX)} L${x(footX)} ${SHELF_BOTTOM} H${x(footX - SHELF_TOE_INSET)} L${x(bendX - SHELF_TOP_INSET)} ${SHELF_TOP} H${x(0)} Z`
}

function recessPath(footX: number, bendX: number, mirrored: boolean): string {
  const x = (value: number): number => formatUnit(mirrored ? VIEW_BOX_WIDTH - value : value)

  return `M${x(0)} ${SHELF_TOP} H${x(bendX - SHELF_TOP_INSET)} L${x(footX - SHELF_TOE_INSET)} ${SHELF_BOTTOM} H${x(0)} Z`
}

function upperRailPath(footX: number, bendX: number, mirrored: boolean): string {
  const x = (value: number): number => formatUnit(mirrored ? VIEW_BOX_WIDTH - value : value)

  return `M${x(0)} ${RAIL_Y} H${x(bendX)} L${x(footX)} ${HORIZON_Y}`
}

function lowerRailPath(bendX: number, mirrored: boolean): string {
  const x = (value: number): number => formatUnit(mirrored ? VIEW_BOX_WIDTH - value : value)

  return `M${x(0)} ${LOWER_RAIL_Y} H${x(bendX - LOWER_RAIL_INSET)}`
}

function slashPoints(bendX: number, blade: typeof SLASH_BLADES[number], mirrored: boolean): string {
  const x = (value: number): number => formatUnit(mirrored ? VIEW_BOX_WIDTH - value : value)

  return `${x(bendX + blade.topLeft)},${SLASH_TOP} ${x(bendX + blade.topRight)},${SLASH_TOP} ${x(bendX + blade.bottomRight)},${SLASH_BOTTOM} ${x(bendX + blade.bottomLeft)},${SLASH_BOTTOM}`
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
