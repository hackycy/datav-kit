import { DatavElement, ResizeController, resolveThemeValue } from '@datav-kit/core'
import { css, html } from 'lit'
import { property, state } from 'lit/decorators.js'
import { observeElementSize } from '../internal/element-size-observer'

const VIEW_BOX_WIDTH = 1200
const DEFAULT_GAP = 228
const SOFT_RAIL_INSET = 64
// `softRailPath` draws `M64 ${y} H(${536 - gap})`, so its left arm reverses once the
// gap passes 600 - 2 * SOFT_RAIL_INSET. That binds before the main rail's 576.
const MAX_RAIL_GAP = 600 - 2 * SOFT_RAIL_INSET

export function resolveRailGap(titleWidth: number, hostWidth: number): number {
  if (!(titleWidth > 0) || !(hostWidth > 0))
    return DEFAULT_GAP

  const gap = titleWidth / 2 * VIEW_BOX_WIDTH / hostWidth

  return Math.min(Math.max(gap, 0), MAX_RAIL_GAP)
}

export class Title4Element extends DatavElement {
  static override styles = css`
    :host {
      position: relative;
      display: block;
      width: 100%;
      height: 100%;
      min-width: 0;
      min-height: 0;
      color: var(--dvk-title-4-title-color, #effcff);
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
      inset: 0;
      /* Flex, not grid: an auto grid track sizes to the item's max-content, which
         makes the title's percentage max-width resolve against itself and overflow. */
      display: flex;
      align-items: center;
      justify-content: center;
      pointer-events: none;
    }

    .title {
      position: relative;
      z-index: 1;
      box-sizing: border-box;
      width: var(--dvk-title-4-title-width, max-content);
      max-width: 100%;
      padding: 0 var(--dvk-title-4-title-gap, 0.8em);
      overflow: hidden;
      color: var(--dvk-title-4-title-color, #effcff);
      font: var(--dvk-title-4-title-font, 700 22px/1 'Microsoft YaHei', 'PingFang SC', 'Noto Sans CJK SC', Arial, sans-serif);
      letter-spacing: var(--dvk-title-4-title-letter-spacing, 0.09em);
      text-align: center;
      white-space: nowrap;
      text-overflow: ellipsis;
      text-shadow: 0 0 6px var(--dvk-title-4-title-glow, rgba(87, 243, 255, 0.16));
    }

    .edge-dot {
      position: absolute;
      top: 50%;
      width: 3px;
      height: 3px;
      margin-top: -1px;
      background: var(--dvk-title-4-edge-dot, rgba(87, 243, 255, 0.72));
      box-shadow: 0 0 7px var(--dvk-title-4-edge-dot-glow, rgba(87, 243, 255, 0.18));
    }

    .edge-dot-left {
      left: 1px;
    }

    .edge-dot-right {
      right: 1px;
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
  private railGap = DEFAULT_GAP

  private readonly resizeController = new ResizeController(this, (size) => {
    this.syncRailGap(size.width)
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
    this.emit('dvk-ready', { tagName: 'dvk-title-4' })
    this.observeTitle()
  }

  override updated(): void {
    this.syncRailGap()
  }

  // The host ResizeController only fires when the host box changes, so a width or font
  // variable set at runtime would otherwise leave the rails on their previous opening.
  private observeTitle(): void {
    if (this.stopObservingTitle)
      return

    const title = this.renderRoot.querySelector<HTMLElement>('.title')

    if (!title)
      return

    this.stopObservingTitle = observeElementSize(title, () => this.syncRailGap())
  }

  override render(): unknown {
    const [primary, secondary, accent] = this.resolveColors()
    const gap = this.railGap
    const railOpacity = this.resolveOpacity('--dvk-title-4-rail-opacity', 0.36)
    const accentOpacity = this.resolveOpacity('--dvk-title-4-accent-opacity', 0.68)

    return html`
      <svg
        part="graphic"
        viewBox="0 0 ${VIEW_BOX_WIDTH} 56"
        preserveAspectRatio="none"
        aria-hidden="true"
        shape-rendering="geometricPrecision"
      >
        <path part="rail main-rail" d=${mainRailPath(gap, 10)} fill="none" stroke=${withAlpha(primary, railOpacity)} stroke-width="1"></path>
        <path part="rail main-rail" d=${mainRailPath(gap, 46)} fill="none" stroke=${withAlpha(primary, railOpacity)} stroke-width="1"></path>
        <path part="rail soft-rail" d=${softRailPath(gap, 18)} fill="none" stroke=${withAlpha(secondary, 0.18)} stroke-width="1"></path>
        <path part="rail soft-rail" d=${softRailPath(gap, 38)} fill="none" stroke=${withAlpha(secondary, 0.18)} stroke-width="1"></path>

        <rect part="accent accent-core" x="42" y="25" width="20" height="2" fill=${withAlpha(accent, accentOpacity)}></rect>
        <rect part="accent accent-core" x="1138" y="25" width="20" height="2" fill=${withAlpha(accent, accentOpacity)}></rect>
        <rect part="accent accent-tail" x="70" y="25" width="76" height="2" fill=${withAlpha(primary, 0.18)}></rect>
        <rect part="accent accent-tail" x="1054" y="25" width="76" height="2" fill=${withAlpha(primary, 0.18)}></rect>
      </svg>
      <div part="content" class="content">
        <div
          part="title"
          class="title"
          style=${`--dvk-title-4-edge-dot: ${withAlpha(primary, 0.72)}; --dvk-title-4-edge-dot-glow: ${withAlpha(primary, 0.18)}`}
        >
          <span part="edge-dot edge-dot-left" class="edge-dot edge-dot-left"></span>
          ${this.titleText ? html`<span part="title-text">${this.titleText}</span>` : html`<slot></slot>`}
          <span part="edge-dot edge-dot-right" class="edge-dot edge-dot-right"></span>
        </div>
      </div>
    `
  }

  private syncRailGap(hostWidth = this.getBoundingClientRect().width): void {
    const title = this.renderRoot.querySelector<HTMLElement>('.title')
    const next = resolveRailGap(title?.getBoundingClientRect().width ?? 0, hostWidth)

    if (Math.abs(next - this.railGap) < 0.5)
      return

    this.railGap = next
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
      fallback: '#57f3ff',
    })
    const secondary = colorList[1] ?? resolveThemeValue({
      explicit: this.secondaryColor,
      cssVariable: '--dvk-color-secondary',
      host: this,
      fallback: '#2f8cff',
    })
    const accent = colorList[2] ?? resolveThemeValue({
      explicit: this.accentColor,
      cssVariable: '--dvk-title-4-accent',
      host: this,
      fallback: '#8cecff',
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

function mainRailPath(gap: number, y: number): string {
  return `M24 ${y} H${formatUnit(600 - gap)} M${formatUnit(600 + gap)} ${y} H1176`
}

function softRailPath(gap: number, y: number): string {
  return `M64 ${y} H${formatUnit(600 - gap - SOFT_RAIL_INSET)} M${formatUnit(600 + gap + SOFT_RAIL_INSET)} ${y} H1136`
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
