import { DatavElement, ResizeController, resolveThemeValue } from '@datav-kit/core'
import { css, html, svg } from 'lit'
import { property, state } from 'lit/decorators.js'
import { observeElementSize } from '../internal/element-size-observer'
import { resolveTitleCenterHalf } from '../internal/title-center'

const VIEW_BOX_WIDTH = 1672
const VIEW_BOX_HEIGHT = 84
const CENTER = VIEW_BOX_WIDTH / 2

// Vertical design levels, in viewBox units. The prototype's canvas is 1672 x 941 and its
// artwork runs from the title's glyph top (its `titleFill` gradient declares y 44..92) to
// the tail of the blurred centre beam at y 128, so these are the prototype's own y values
// minus 44. The band is 84 tall: the ribbon's top edge is the topmost SVG ink, and the
// beam's Gaussian tail reaches the bottom edge — the last ~4 units are tail alone, which
// is what makes the bottom read as a glow rather than a cut. The tail spills through
// `overflow: visible` rather than buying it 6 more units of canvas, which would open a
// dead band above the ribbon.
const RIBBON_TOP = 19
const RIBBON_INNER_TOP = 28
const SLASH_TOP = 50
const NODE_TOP = 52
const RAIL_TOP_Y = 56.5
const RAIL_CORE_Y = 57.5
const RAIL_DIM_Y = 58.5
const SLASH_BOTTOM = 63
const SLASH_UNDERLINE_Y = 65
const RIBBON_BOTTOM = 67
const BEAM_GLOW_Y = 69.8
const BEAM_CORE_Y = 74
const HORIZON_Y = 74.5
const HORIZON_RISE = HORIZON_Y - RIBBON_TOP

// Edge furniture. The slash group and the side rail's outer end are pinned to the host
// edge, so they keep the prototype's x values verbatim; everything inboard of them is a
// function of the measured frame.
const RAIL_START = 143
const SLASH_ORIGINS = [55, 75, 90, 104]
const SLASH_WIDTHS = [14, 9, 8, 14]
const SLASH_SKEW = 10
const SLASH_UNDERLINE_FROM = 58
const SLASH_UNDERLINE_TO = 130

// The prototype draws two near-parallel diagonals: the ribbon's outer edge from
// (354, 63) to (405, 111), and a thin outer hairline from (368, 67) to (421, 118.5).
// They differ by 0.91 degrees. Extrapolating the ribbon's edge to the horizon gives
// 412.97, and the hairline's landing point 421 is exactly that plus 8 — which is also
// where the leftmost horizon segment starts. So the whole discrepancy is one constant
// x-offset, and the component draws a single bend-to-foot line at the ribbon's angle.
// 59 across the 55.5 rise holds 43.25 degrees and reproduces the ribbon's three corners
// to within 0.1 unit.
const SHOULDER_RUN = 59
const HAIRLINE_OFFSET = 8
const RIBBON_WIDTH = 48.5

// The prototype's node sits about 28.6 units clear of the fold's inner edge at the node's
// own top height, so the node tracks the shoulder while keeping the design's own gap
// rather than closing it. Anchoring the node (and the side rail terminating into it) on
// `ribbonLineAt(NODE_TOP) - NODE_SETBACK` reproduces the prototype's 312 / 298 exactly at
// the design aspect, and moves both inward as a title pushes the fold inward.
const NODE_FOLD_GAP = 28.6
const NODE_SETBACK = RIBBON_WIDTH + NODE_FOLD_GAP
const NODE_RAIL_INSET = 14
// How much of the run the node itself travels: it is anchored at NODE_TOP, so it only
// tracks the fraction of the descent that lies between the ribbon and that level.
const NODE_TRACK = (NODE_TOP - RIBBON_TOP) / HORIZON_RISE

const BEAM_GLOW_HALF = 266
const BEAM_CORE_HALF = 216
const BEAM_GRADIENT_HALF = 196
const BEAM_GLOW_HEIGHT = 10.5
const BEAM_CORE_HEIGHT = 4
const BEAM_RADIUS = 5.25

// The design's title box half-width: 12 CJK glyphs at 1.013542em advance (tracking
// included), plus the default gap on each side, comes to 15.3625em, so the half is
// 7.68125em — 460.9 units at the 60px design font. Keep this in step with the
// `--dvk-title-7-title-gap` default — it is the value a measured render would produce, so
// an unmeasurable one must not disagree with it.
const DEFAULT_HALF = 460.9

// The title em box at a 1672-wide canvas, line-height 1. The prototype draws 48, but a font
// only tracks the host *width*, so on any band taller than the design's 19.9:1 the text
// shrinks relative to the band and the space under it grows. 60 brings the demo back to the
// proportion title-6 shows at its own demo size (about a third of the band either side).
const TITLE_SIZE = 60

// Where the title box's own bottom sits, in viewBox units. Pinning the box *bottom* rather
// than its centre is what keeps the title in a fixed relationship to the horizon it is
// designed around: `preserveAspectRatio="none"` grows the artwork to any box the host is
// given, but the text tracks the host width alone, so a fixed centre lets a stretched band
// carry the title up and open the gap beneath it.
//
// The design's own value is 59.4 (the line-height-1 box of 60 is placed so its glyph tops
// land exactly on the canvas top, i.e. 29.36 + 60/2). It is raised to 51.6 here, which at
// the design aspect lifts the glyph tops ~6 units — 7% of the band — above the canvas top.
// `svg { overflow: visible }` lets them through, but this is the one thing in the component
// that reaches outside its own box: a host inside a clipping ancestor would cut the tops off.
const TITLE_BOX_BOTTOM = 51.6

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
    // The slash group is pinned at the host edge and the side rail's outer end is fixed at
    // RAIL_START, so the rail's inner end — which tracks the fold through the node — must
    // stay outboard of it or the rail reverses on itself. The rail's inner end is
    // `bendX + NODE_TRACK * run - NODE_SETBACK - NODE_RAIL_INSET`, and `bendX` is
    // `CENTER - half - run`, so requiring it to reach RAIL_START solves to this ceiling.
    // Charging the whole run here instead would bind at a 14-character title.
    limit: CENTER - RAIL_START - NODE_SETBACK - NODE_RAIL_INSET - shoulderRun * (1 - NODE_TRACK),
  })
}

// The band's proportions come from the host height, but a host narrower than the design's
// 19.9:1 would let a height-sized font overrun the frame sideways.
export function resolveTitleSize(hostWidth: number, hostHeight: number): number {
  if (!(hostWidth > 0) || !(hostHeight > 0))
    return 0

  return TITLE_SIZE * Math.min(hostHeight / VIEW_BOX_HEIGHT, hostWidth / VIEW_BOX_WIDTH)
}

let title7Id = 0

export class Title7Element extends DatavElement {
  static override styles = css`
    :host {
      position: relative;
      display: block;
      width: 100%;
      height: 100%;
      min-width: 0;
      min-height: 0;
      color: var(--dvk-title-7-title-color, #f4fbff);
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
      /* Set from the host's aspect below; 25.71% is TITLE_BOX_BOTTOM minus half the design
         font, which is what an environment that cannot measure the host gets. */
      top: var(--dvk-title-7-title-top, 25.71%);
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
      width: var(--dvk-title-7-title-width, max-content);
      max-width: 100%;
      /* Tighter than the prototype's own 2.73em: the larger design font widens the box, and
         the fold is measured from it, so some of that width is bought back here to keep the
         wings — and the length of title the frame can take — close to the prototype's. */
      padding: 0 var(--dvk-title-7-title-gap, 1.6em);
      overflow: hidden;
      color: var(--dvk-title-7-title-color, #f4fbff);
      font: var(--dvk-title-7-title-font, 700 var(--dvk-title-7-title-size, 34px)/1 'Microsoft YaHei', 'PingFang SC', 'Noto Sans CJK SC', Arial, sans-serif);
      /* 0.65px at the prototype's 48px design font. */
      letter-spacing: var(--dvk-title-7-title-letter-spacing, 0.013542em);
      text-align: center;
      white-space: nowrap;
      text-overflow: ellipsis;
      /* The prototype stacks a cool halo, a near-white edge and a dark copy four units
         below the baseline. DOM text takes one node, so the edge (0.0046em at the design
         font — sub-pixel at every realistic size) folds into the colour and the other two
         become shadows. The vertical white-to-blue glyph ramp is lost; title-5 and title-6
         made the same trade. */
      text-shadow:
        0 0 0.046em var(--dvk-title-7-title-stroke, rgba(168, 228, 255, 0.22)),
        0 0.0833em 0 var(--dvk-title-7-title-glow, rgba(36, 95, 139, 0.16));
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

  @state()
  private hostHeight = 0

  private readonly instanceId = ++title7Id
  private readonly ribbonLeftId = `dvk-title-7-ribbon-left-${this.instanceId}`
  private readonly ribbonRightId = `dvk-title-7-ribbon-right-${this.instanceId}`
  private readonly diagLeftId = `dvk-title-7-diag-left-${this.instanceId}`
  private readonly diagRightId = `dvk-title-7-diag-right-${this.instanceId}`
  private readonly sideRailLeftId = `dvk-title-7-side-rail-left-${this.instanceId}`
  private readonly sideRailRightId = `dvk-title-7-side-rail-right-${this.instanceId}`
  private readonly nodeLeftId = `dvk-title-7-node-left-${this.instanceId}`
  private readonly nodeRightId = `dvk-title-7-node-right-${this.instanceId}`
  private readonly horizonId = `dvk-title-7-horizon-${this.instanceId}`
  private readonly beamTopId = `dvk-title-7-beam-top-${this.instanceId}`
  private readonly beamCoreId = `dvk-title-7-beam-core-${this.instanceId}`
  private readonly beamGlowId = `dvk-title-7-beam-glow-${this.instanceId}`
  private readonly lineGlowId = `dvk-title-7-line-glow-${this.instanceId}`
  private readonly beamBlurId = `dvk-title-7-beam-blur-${this.instanceId}`

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
    this.emit('dvk-ready', { tagName: 'dvk-title-7' })
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
    const nodeRightX = ribbonLineAt(bendX, run, NODE_TOP) - NODE_SETBACK
    const railInnerX = nodeRightX - NODE_RAIL_INSET
    // The horizon's own extents. A one- or two-character title closes the frame inside the
    // beam, which would run a segment backwards across the whole canvas, so the three
    // break points are clamped into a monotonic chain of the shared endpoints.
    const left = footX + HAIRLINE_OFFSET
    const right = Math.max(VIEW_BOX_WIDTH - left, left)
    const beamLeft = Math.min(Math.max(CENTER - BEAM_CORE_HALF, left), right)
    const beamRight = Math.max(Math.min(CENTER + BEAM_CORE_HALF, right), beamLeft)
    const glowOpacity = this.resolveOpacity('--dvk-title-7-glow-opacity', 1)
    const sizeVar = this.resolveTitleSizeVar()
    const topVar = this.resolveTitleTopVar()

    return html`
      <svg
        part="graphic"
        viewBox="0 0 ${VIEW_BOX_WIDTH} ${VIEW_BOX_HEIGHT}"
        preserveAspectRatio="none"
        aria-hidden="true"
        shape-rendering="geometricPrecision"
      >
        <defs>${this.renderDefs(primary, secondary, accent, bendX, run, left, right, nodeRightX, railInnerX)}</defs>

        <path part="ribbon ribbon-left" d=${ribbonPath(bendX, run, false)} fill=${`url(#${this.ribbonLeftId})`}></path>
        <path part="ribbon ribbon-right" d=${ribbonPath(bendX, run, true)} fill=${`url(#${this.ribbonRightId})`}></path>

        <path part="diagonal diagonal-glow" d=${`${hairlinePath(bendX, footX, false)} ${hairlinePath(bendX, footX, true)}`} fill="none" stroke="#1acfff" stroke-width="2.2" opacity=${0.035 * glowOpacity} filter=${`url(#${this.lineGlowId})`}></path>
        <path part="diagonal diagonal-left" d=${hairlinePath(bendX, footX, false)} fill="none" stroke=${`url(#${this.diagLeftId})`} stroke-width="1"></path>
        <path part="diagonal diagonal-right" d=${hairlinePath(bendX, footX, true)} fill="none" stroke=${`url(#${this.diagRightId})`} stroke-width="1"></path>

        <path part="side-rail side-rail-left" d=${`M${formatUnit(RAIL_START)} ${RAIL_TOP_Y} H${formatUnit(railInnerX)}`} fill="none" stroke=${`url(#${this.sideRailLeftId})`} stroke-width="1" opacity=".45"></path>
        <path part="side-rail side-rail-left" d=${`M${formatUnit(RAIL_START)} ${RAIL_CORE_Y} H${formatUnit(railInnerX)}`} fill="none" stroke=${`url(#${this.sideRailLeftId})`} stroke-width="1"></path>
        <path part="side-rail side-rail-dim side-rail-left" d=${`M${formatUnit(RAIL_START)} ${RAIL_DIM_Y} H${formatUnit(railInnerX - 1)}`} fill="none" stroke=${withAlpha(secondary, 0.24)} stroke-width="1"></path>
        <path part="side-rail side-rail-right" d=${`M${formatUnit(VIEW_BOX_WIDTH - RAIL_START)} ${RAIL_TOP_Y} H${formatUnit(VIEW_BOX_WIDTH - railInnerX)}`} fill="none" stroke=${`url(#${this.sideRailRightId})`} stroke-width="1" opacity=".45"></path>
        <path part="side-rail side-rail-right" d=${`M${formatUnit(VIEW_BOX_WIDTH - RAIL_START)} ${RAIL_CORE_Y} H${formatUnit(VIEW_BOX_WIDTH - railInnerX)}`} fill="none" stroke=${`url(#${this.sideRailRightId})`} stroke-width="1"></path>
        <path part="side-rail side-rail-dim side-rail-right" d=${`M${formatUnit(VIEW_BOX_WIDTH - RAIL_START)} ${RAIL_DIM_Y} H${formatUnit(VIEW_BOX_WIDTH - railInnerX + 1)}`} fill="none" stroke=${withAlpha(secondary, 0.24)} stroke-width="1"></path>

        <g part="slash slash-left">
          ${SLASH_ORIGINS.map((origin, index) => svg`<polygon points=${slashPoints(origin, SLASH_WIDTHS[index], false)} fill=${slashFill(primary, secondary, index)}></polygon>`)}
          <path part="slash-underline" d=${`M${SLASH_UNDERLINE_FROM} ${SLASH_UNDERLINE_Y} H${SLASH_UNDERLINE_TO}`} fill="none" stroke=${withAlpha(secondary, 0.38)} stroke-width="1"></path>
        </g>
        <g part="slash slash-right">
          ${SLASH_ORIGINS.map((origin, index) => svg`<polygon points=${slashPoints(origin, SLASH_WIDTHS[index], true)} fill=${slashFill(primary, secondary, index)}></polygon>`)}
          <path part="slash-underline" d=${`M${VIEW_BOX_WIDTH - SLASH_UNDERLINE_FROM} ${SLASH_UNDERLINE_Y} H${VIEW_BOX_WIDTH - SLASH_UNDERLINE_TO}`} fill="none" stroke=${withAlpha(secondary, 0.38)} stroke-width="1"></path>
        </g>

        <polygon part="node node-left" points=${nodePoints(nodeRightX, false)} fill=${`url(#${this.nodeLeftId})`}></polygon>
        <polygon part="node node-right" points=${nodePoints(nodeRightX, true)} fill=${`url(#${this.nodeRightId})`}></polygon>
        <path part="node node-highlight" d=${`${nodeHighlightPath(nodeRightX, false)} ${nodeHighlightPath(nodeRightX, true)}`} fill="none" stroke="#77e8ff" stroke-width=".7" opacity=".48"></path>

        <path part="horizon horizon-flank horizon-flank-left" d=${`M${formatUnit(left)} ${HORIZON_Y} H${formatUnit(beamLeft)}`} fill="none" stroke=${`url(#${this.horizonId})`} stroke-width="1"></path>
        <path part="horizon horizon-beam" d=${`M${formatUnit(beamLeft)} ${HORIZON_Y} H${formatUnit(beamRight)}`} fill="none" stroke=${`url(#${this.beamTopId})`} stroke-width="1"></path>
        <path part="horizon horizon-flank horizon-flank-right" d=${`M${formatUnit(beamRight)} ${HORIZON_Y} H${formatUnit(right)}`} fill="none" stroke=${`url(#${this.horizonId})`} stroke-width="1"></path>

        <rect part="beam beam-glow" x=${CENTER - BEAM_GLOW_HALF} y=${BEAM_GLOW_Y} width=${BEAM_GLOW_HALF * 2} height=${BEAM_GLOW_HEIGHT} rx=${BEAM_RADIUS} fill=${`url(#${this.beamGlowId})`} opacity=${0.62 * glowOpacity} filter=${`url(#${this.beamBlurId})`}></rect>
        <rect part="beam beam-core" x=${CENTER - BEAM_CORE_HALF} y=${BEAM_CORE_Y} width=${BEAM_CORE_HALF * 2} height=${BEAM_CORE_HEIGHT} fill=${`url(#${this.beamCoreId})`}></rect>
      </svg>
      <div part="content" class="content" style=${topVar}>
        <div part="title" class="title" style=${sizeVar}>
          ${this.titleText ? html`<span part="title-text">${this.titleText}</span>` : html`<slot></slot>`}
        </div>
      </div>
    `
  }

  private renderDefs(
    primary: string,
    secondary: string,
    accent: string,
    bendX: number,
    run: number,
    left: number,
    right: number,
    nodeRightX: number,
    railInnerX: number,
  ): unknown {
    const ribbonOuterBottom = ribbonLineAt(bendX, run, RIBBON_BOTTOM)
    const diagInner = bendX + HAIRLINE_OFFSET

    return svg`
      <linearGradient id=${this.ribbonLeftId} gradientUnits="userSpaceOnUse" x1="0" y1=${RIBBON_TOP} x2=${ribbonOuterBottom} y2=${RIBBON_BOTTOM}>
        <stop offset="0" stop-color=${secondary} stop-opacity="0.11"></stop>
        <stop offset="0.25" stop-color=${secondary} stop-opacity="0.24"></stop>
        <stop offset="0.50" stop-color=${secondary} stop-opacity="0.55"></stop>
        <stop offset="0.625" stop-color=${secondary} stop-opacity="0.73"></stop>
        <stop offset="0.80" stop-color=${secondary} stop-opacity="0.95"></stop>
        <stop offset="0.92" stop-color=${primary} stop-opacity="0.70"></stop>
        <stop offset="1" stop-color=${primary} stop-opacity="0.92"></stop>
      </linearGradient>

      <linearGradient id=${this.ribbonRightId} gradientUnits="userSpaceOnUse" x1=${VIEW_BOX_WIDTH} y1=${RIBBON_TOP} x2=${VIEW_BOX_WIDTH - ribbonOuterBottom} y2=${RIBBON_BOTTOM}>
        <stop offset="0" stop-color=${secondary} stop-opacity="0.11"></stop>
        <stop offset="0.25" stop-color=${secondary} stop-opacity="0.24"></stop>
        <stop offset="0.50" stop-color=${secondary} stop-opacity="0.55"></stop>
        <stop offset="0.625" stop-color=${secondary} stop-opacity="0.73"></stop>
        <stop offset="0.80" stop-color=${secondary} stop-opacity="0.95"></stop>
        <stop offset="0.92" stop-color=${primary} stop-opacity="0.70"></stop>
        <stop offset="1" stop-color=${primary} stop-opacity="0.92"></stop>
      </linearGradient>

      <linearGradient id=${this.diagLeftId} gradientUnits="userSpaceOnUse" x1=${diagInner} y1=${RIBBON_TOP} x2=${left} y2=${HORIZON_Y}>
        <stop offset="0" stop-color=${secondary} stop-opacity="0.60"></stop>
        <stop offset="0.25" stop-color=${secondary} stop-opacity="0.78"></stop>
        <stop offset="0.50" stop-color=${primary} stop-opacity="0.55"></stop>
        <stop offset="0.75" stop-color=${primary} stop-opacity="0.78"></stop>
        <stop offset="1" stop-color=${primary} stop-opacity="0.95"></stop>
      </linearGradient>


      <linearGradient id=${this.diagRightId} gradientUnits="userSpaceOnUse" x1=${VIEW_BOX_WIDTH - diagInner} y1=${RIBBON_TOP} x2=${VIEW_BOX_WIDTH - left} y2=${HORIZON_Y}>
        <stop offset="0" stop-color=${secondary} stop-opacity="0.60"></stop>
        <stop offset="0.25" stop-color=${secondary} stop-opacity="0.78"></stop>
        <stop offset="0.50" stop-color=${primary} stop-opacity="0.55"></stop>
        <stop offset="0.75" stop-color=${primary} stop-opacity="0.78"></stop>
        <stop offset="1" stop-color=${primary} stop-opacity="0.95"></stop>
      </linearGradient>


      <linearGradient id=${this.sideRailLeftId} gradientUnits="userSpaceOnUse" x1=${RAIL_START} y1=${RAIL_CORE_Y} x2=${railInnerX} y2=${RAIL_CORE_Y}>
        <stop offset="0" stop-color=${secondary} stop-opacity="0.68"></stop>
        <stop offset="0.15" stop-color=${secondary} stop-opacity="0.82"></stop>
        <stop offset="0.48" stop-color=${primary} stop-opacity="0.56"></stop>
        <stop offset="1" stop-color=${primary} stop-opacity="0.78"></stop>
      </linearGradient>

      <linearGradient id=${this.sideRailRightId} gradientUnits="userSpaceOnUse" x1=${VIEW_BOX_WIDTH - RAIL_START} y1=${RAIL_CORE_Y} x2=${VIEW_BOX_WIDTH - railInnerX} y2=${RAIL_CORE_Y}>
        <stop offset="0" stop-color=${secondary} stop-opacity="0.68"></stop>
        <stop offset="0.15" stop-color=${secondary} stop-opacity="0.82"></stop>
        <stop offset="0.48" stop-color=${primary} stop-opacity="0.56"></stop>
        <stop offset="1" stop-color=${primary} stop-opacity="0.78"></stop>
      </linearGradient>

      <linearGradient id=${this.nodeLeftId} x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stop-color=${primary} stop-opacity="0.92"></stop>
        <stop offset="0.55" stop-color=${primary} stop-opacity="0.97"></stop>
        <stop offset="1" stop-color=${accent} stop-opacity="1"></stop>
      </linearGradient>

      <linearGradient id=${this.nodeRightId} x1="1" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color=${primary} stop-opacity="0.92"></stop>
        <stop offset="0.55" stop-color=${primary} stop-opacity="0.97"></stop>
        <stop offset="1" stop-color=${accent} stop-opacity="1"></stop>
      </linearGradient>

      <linearGradient id=${this.horizonId} gradientUnits="userSpaceOnUse" x1=${left} y1=${HORIZON_Y} x2=${right} y2=${HORIZON_Y}>
        <stop offset="0" stop-color=${primary} stop-opacity="0.80"></stop>
        <stop offset="0.18" stop-color=${primary} stop-opacity="0.74"></stop>
        <stop offset="0.38" stop-color=${primary} stop-opacity="0.66"></stop>
        <stop offset="0.50" stop-color=${accent} stop-opacity="0.95"></stop>
        <stop offset="0.62" stop-color=${primary} stop-opacity="0.66"></stop>
        <stop offset="0.82" stop-color=${primary} stop-opacity="0.74"></stop>
        <stop offset="1" stop-color=${primary} stop-opacity="0.80"></stop>
      </linearGradient>

      <linearGradient id=${this.beamTopId} gradientUnits="userSpaceOnUse" x1=${CENTER - BEAM_CORE_HALF} y1=${HORIZON_Y} x2=${CENTER + BEAM_CORE_HALF} y2=${HORIZON_Y}>
        <stop offset="0" stop-color=${secondary} stop-opacity="0.62"></stop>
        <stop offset="0.185" stop-color=${secondary} stop-opacity="0.78"></stop>
        <stop offset="0.30" stop-color=${primary} stop-opacity="0.66"></stop>
        <stop offset="0.417" stop-color=${primary} stop-opacity="0.88"></stop>
        <stop offset="0.50" stop-color=${accent} stop-opacity="1"></stop>
        <stop offset="0.583" stop-color=${primary} stop-opacity="0.88"></stop>
        <stop offset="0.70" stop-color=${primary} stop-opacity="0.66"></stop>
        <stop offset="0.815" stop-color=${secondary} stop-opacity="0.78"></stop>
        <stop offset="1" stop-color=${secondary} stop-opacity="0.62"></stop>
      </linearGradient>

      <linearGradient id=${this.beamCoreId} gradientUnits="userSpaceOnUse" x1=${CENTER - BEAM_CORE_HALF} y1=${BEAM_CORE_Y} x2=${CENTER + BEAM_CORE_HALF} y2=${BEAM_CORE_Y}>
        <stop offset="0" stop-color=${primary} stop-opacity="0"></stop>
        <stop offset="0.30" stop-color=${primary} stop-opacity="0.30"></stop>
        <stop offset="0.417" stop-color=${accent} stop-opacity="0.62"></stop>
        <stop offset="0.50" stop-color=${accent} stop-opacity="0.92"></stop>
        <stop offset="0.583" stop-color=${accent} stop-opacity="0.62"></stop>
        <stop offset="0.70" stop-color=${primary} stop-opacity="0.30"></stop>
        <stop offset="1" stop-color=${primary} stop-opacity="0"></stop>
      </linearGradient>

      <linearGradient id=${this.beamGlowId} gradientUnits="userSpaceOnUse" x1=${CENTER - BEAM_GRADIENT_HALF} y1=${BEAM_GLOW_Y} x2=${CENTER + BEAM_GRADIENT_HALF} y2=${BEAM_GLOW_Y}>
        <stop offset="0" stop-color=${primary} stop-opacity="0"></stop>
        <stop offset="0.20" stop-color=${primary} stop-opacity="0.18"></stop>
        <stop offset="0.39" stop-color=${primary} stop-opacity="0.75"></stop>
        <stop offset="0.50" stop-color=${accent} stop-opacity="1"></stop>
        <stop offset="0.61" stop-color=${primary} stop-opacity="0.75"></stop>
        <stop offset="0.80" stop-color=${primary} stop-opacity="0.18"></stop>
        <stop offset="1" stop-color=${primary} stop-opacity="0"></stop>
      </linearGradient>

      <filter id=${this.lineGlowId} filterUnits="userSpaceOnUse" x="-20" y="${RIBBON_TOP - 20}" width="${VIEW_BOX_WIDTH + 40}" height="${HORIZON_RISE + 40}">
        <feGaussianBlur stdDeviation="1.25"></feGaussianBlur>
      </filter>

      <filter id=${this.beamBlurId} filterUnits="userSpaceOnUse" x="${CENTER - BEAM_GLOW_HALF - 60}" y="${BEAM_GLOW_Y - 40}" width="${BEAM_GLOW_HALF * 2 + 120}" height="${BEAM_GLOW_HEIGHT + 80}">
        <feGaussianBlur stdDeviation="3.1"></feGaussianBlur>
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
      cssVariable: '--dvk-title-7-title-size',
      host: this,
      fallback: '',
    })

    if (explicit)
      return `--dvk-title-7-title-size: ${explicit}`

    return this.titleSize > 0 ? `--dvk-title-7-title-size: ${Math.round(this.titleSize * 100) / 100}px` : ''
  }

  // An explicit variable wins unconditionally; otherwise the title box is anchored to the
  // horizon rather than to the top of the band. `preserveAspectRatio="none"` stretches the
  // artwork to whatever box the host is given, so a band taller than the design's 19.9:1
  // has more room than the text — which tracks the width alone — can fill. Anchoring the
  // box's bottom keeps the design's 15.1-unit gap to the horizon at every aspect instead of
  // letting the gap grow with the stretch.
  private resolveTitleTopVar(): string {
    const explicit = resolveThemeValue<string>({
      cssVariable: '--dvk-title-7-title-top',
      host: this,
      fallback: '',
    })

    if (explicit)
      return `--dvk-title-7-title-top: ${explicit}`

    if (!(this.hostHeight > 0) || !(this.titleSize > 0))
      return ''

    const top = TITLE_BOX_BOTTOM * this.hostHeight / VIEW_BOX_HEIGHT - this.titleSize / 2

    return `--dvk-title-7-title-top: ${Math.round(top * 100) / 100}px`
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
    // The prototype's own wing colours are dark desaturated navies picked against a
    // #040d1b page, so these fallbacks are un-composited from it rather than taken from
    // the family — a saturated brand blue at the same alpha reads two to three times
    // brighter and blows the wings past the centre beam.
    const primary = colorList[0] ?? resolveThemeValue({
      explicit: explicitPrimary,
      cssVariable: '--dvk-color-primary',
      host: this,
      fallback: '#25a8ed',
    })
    const secondary = colorList[1] ?? resolveThemeValue({
      explicit: this.secondaryColor,
      cssVariable: '--dvk-color-secondary',
      host: this,
      fallback: '#164586',
    })
    const accent = colorList[2] ?? resolveThemeValue({
      explicit: this.accentColor,
      cssVariable: '--dvk-title-7-accent',
      host: this,
      fallback: '#5ff0ff',
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

// The ribbon runs parallel to the shoulder, so any level on it is the bend offset along
// the shoulder's own descent.
function ribbonLineAt(bendX: number, run: number, y: number): number {
  return bendX + run * (y - RIBBON_TOP) / HORIZON_RISE
}

function ribbonPath(bendX: number, run: number, mirrored: boolean): string {
  const outerBottom = ribbonLineAt(bendX, run, RIBBON_BOTTOM)
  const innerBottom = outerBottom - RIBBON_WIDTH
  const innerTop = ribbonLineAt(bendX, run, RIBBON_INNER_TOP) - RIBBON_WIDTH
  const x = (value: number): number => formatUnit(mirrored ? VIEW_BOX_WIDTH - value : value)

  return `M${x(0)} ${RIBBON_TOP} H${x(bendX)} L${x(outerBottom)} ${RIBBON_BOTTOM} H${x(innerBottom)} L${x(innerTop)} ${RIBBON_INNER_TOP} H${x(0)} Z`
}

function hairlinePath(bendX: number, footX: number, mirrored: boolean): string {
  const x = (value: number): number => formatUnit(mirrored ? VIEW_BOX_WIDTH - value : value)

  return `M${x(bendX + HAIRLINE_OFFSET)} ${RIBBON_TOP} L${x(footX + HAIRLINE_OFFSET)} ${HORIZON_Y}`
}

// The prototype's rail cap, as offsets from its top-right vertex. It is 18 wide and
// reaches 12 down (to y 64), and its left side carries a 2-unit step.
function nodePoints(nodeRightX: number, mirrored: boolean): string {
  const x = (value: number): number => formatUnit(mirrored ? VIEW_BOX_WIDTH - value : value)
  const at = (dx: number, dy: number): string => `${x(nodeRightX + dx)},${NODE_TOP + dy}`

  return `${at(-16, 0)} ${at(-6, 0)} ${at(0, 7)} ${at(-1, 12)} ${at(-11, 12)} ${at(-16, 6)} ${at(-18, 6)} ${at(-18, 2)}`
}

function nodeHighlightPath(nodeRightX: number, mirrored: boolean): string {
  const x = (value: number): number => formatUnit(mirrored ? VIEW_BOX_WIDTH - value : value)

  return `M${x(nodeRightX - 16)} ${NODE_TOP} H${x(nodeRightX - 6)}`
}

// The prototype's four blades are not the same width and not the same brightness; only the
// skew is uniform. The ramp runs from the deep secondary at the outer end to the primary.
function slashFill(primary: string, secondary: string, index: number): string {
  const ramp = [
    withAlpha(secondary, 0.80),
    withAlpha(primary, 0.52),
    withAlpha(primary, 0.71),
    withAlpha(primary, 0.82),
  ]

  return ramp[index] ?? ramp[0]
}

function slashPoints(origin: number, width: number, mirrored: boolean): string {
  const x = (value: number): number => formatUnit(mirrored ? VIEW_BOX_WIDTH - value : value)
  const top = SLASH_TOP
  const bottom = SLASH_BOTTOM

  return `${x(origin)},${top} ${x(origin + width)},${top} ${x(origin + width + SLASH_SKEW)},${bottom} ${x(origin + SLASH_SKEW)},${bottom}`
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
