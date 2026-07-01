import { DatavElement, ResizeController, resolveThemeValue } from '@datav-kit/core'
import { css, html } from 'lit'
import { property, state } from 'lit/decorators.js'
import { createBorderBoxContentPadding } from '../border-box-content-padding'

interface BorderBox15Size {
  width: number
  height: number
}

const defaultSize: BorderBox15Size = {
  width: 0,
  height: 0,
}

export class BorderBox15Element extends DatavElement {
  static override styles = css`
    :host {
      display: block;
      position: relative;
      width: 100%;
      height: 100%;
      min-width: 0;
      min-height: 0;
      box-sizing: border-box;
      color: var(--dvk-color-primary, rgba(255, 255, 255, 0.35));
    }

    .frame {
      position: absolute;
      inset: 0;
      pointer-events: none;
    }

    svg {
      display: block;
      width: 100%;
      height: 100%;
      overflow: visible;
    }

    polyline {
      fill: none;
      stroke-width: 1;
    }

    .content {
      position: relative;
      z-index: 1;
      box-sizing: border-box;
      width: 100%;
      height: 100%;
      min-height: 0;
      padding: var(--dvk-border-box-15-padding, var(--dvk-border-box-padding, var(--dvk-border-box-auto-padding)));
    }
  `

  @property()
  color = ''

  @property({ attribute: 'secondary-color' })
  secondaryColor = ''

  @property({ attribute: 'background-color' })
  backgroundColor = ''

  @property()
  colors = ''

  @state()
  private size = defaultSize

  private readonly resizeController = new ResizeController(this, (state) => {
    this.size = {
      width: Math.max(state.width, 0),
      height: Math.max(state.height, 0),
    }
  })

  override firstUpdated(): void {
    this.emit('dvk-ready', { tagName: 'dvk-border-box-15' })
  }

  override render(): unknown {
    const [primary, secondary, background] = this.resolveColors()
    const width = Math.max(this.size.width, 1)
    const height = Math.max(this.size.height, 1)
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
        x: 10,
        y: 10,
        width: Math.max(width - 20, 0),
        height: Math.max(height - 20, 0),
      },
      minBlock: 10,
      minInline: 10,
    })

    return html`
      <div part="frame" class="frame">
        <svg part="graphic" width=${String(width)} height=${String(height)} aria-hidden="true">
          <polygon fill=${background} points=${this.createPanelPoints(width, height)}></polygon>

          <circle fill=${secondary} cx="5" cy="5" r="2"></circle>
          <circle fill=${secondary} cx=${String(width - 5)} cy="5" r="2"></circle>
          <circle fill=${secondary} cx=${String(width - 5)} cy=${String(height - 5)} r="2"></circle>
          <circle fill=${secondary} cx="5" cy=${String(height - 5)} r="2"></circle>

          <polyline stroke=${primary} points=${`10,4 ${width - 10},4`}></polyline>
          <polyline stroke=${primary} points=${`10,${height - 4} ${width - 10},${height - 4}`}></polyline>
          <polyline stroke=${primary} points=${`5,70 5,${height - 70}`}></polyline>
          <polyline stroke=${primary} points=${`${width - 5},70 ${width - 5},${height - 70}`}></polyline>
          <polyline stroke=${primary} points="3,10 3,50"></polyline>
          <polyline stroke=${primary} points="7,30 7,80"></polyline>
          <polyline stroke=${primary} points=${`${width - 3},10 ${width - 3},50`}></polyline>
          <polyline stroke=${primary} points=${`${width - 7},30 ${width - 7},80`}></polyline>
          <polyline stroke=${primary} points=${`3,${height - 10} 3,${height - 50}`}></polyline>
          <polyline stroke=${primary} points=${`7,${height - 30} 7,${height - 80}`}></polyline>
          <polyline stroke=${primary} points=${`${width - 3},${height - 10} ${width - 3},${height - 50}`}></polyline>
          <polyline stroke=${primary} points=${`${width - 7},${height - 30} ${width - 7},${height - 80}`}></polyline>
        </svg>
      </div>
      <div part="content" class="content" style=${`--dvk-border-box-auto-padding: ${contentPadding}`}>
        <slot></slot>
      </div>
    `
  }

  private createPanelPoints(width: number, height: number): string {
    return `9,7 ${width - 9},7 ${width - 9},${height - 7} 9,${height - 7}`
  }

  private resolveColors(): [string, string, string] {
    const colors = splitColorList(this.colors)
    const primary = colors[0] ?? resolveThemeValue({
      explicit: this.color,
      cssVariable: '--dvk-color-primary',
      host: this,
      fallback: 'rgba(255, 255, 255, 0.35)',
    })
    const secondary = colors[1] ?? resolveThemeValue({
      explicit: this.secondaryColor,
      cssVariable: '--dvk-color-secondary',
      host: this,
      fallback: 'gray',
    })
    const background = resolveThemeValue({
      explicit: this.backgroundColor,
      cssVariable: '--dvk-border-box-15-background',
      host: this,
      fallback: 'transparent',
    })

    return [primary, secondary, background]
  }
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
