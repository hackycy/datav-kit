import { DatavElement, ResizeController, resolveThemeValue } from '@datav-kit/core'
import { css, html } from 'lit'
import { property, state } from 'lit/decorators.js'

interface Decoration4Size {
  width: number
  height: number
}

const defaultSize: Decoration4Size = {
  width: 0,
  height: 0,
}

export class Decoration4Element extends DatavElement {
  static override styles = css`
    :host {
      display: block;
      position: relative;
      width: 100%;
      height: 100%;
      min-width: 0;
      min-height: 0;
      box-sizing: border-box;
      color: var(--dv-color-primary, #18f0ff);
      overflow: hidden;
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

    polygon,
    polyline {
      vector-effect: non-scaling-stroke;
    }

    .content {
      position: absolute;
      inset: 0;
      z-index: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      box-sizing: border-box;
      width: 100%;
      height: 100%;
      min-height: 0;
      padding: var(--dv-decoration-4-padding, 0);
    }
  `

  @property()
  color = ''

  @property({ attribute: 'secondary-color' })
  secondaryColor = ''

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
    this.emit('dv-ready', { tagName: 'dv-decoration-4' })
  }

  override render(): unknown {
    const [primary, secondary] = this.resolveColors()
    const width = Math.max(this.size.width, 1)
    const height = Math.max(this.size.height, 1)
    const middleY = height / 2

    return html`
      <svg part="graphic" width=${String(width)} height=${String(height)} aria-hidden="true">
        <polygon
          part="corner top-left-corner"
          fill=${withAlpha(secondary, 0.1)}
          stroke=${secondary}
          points="20 10, 25 4, 55 4, 60 10"
        ></polygon>
        <polygon
          part="corner bottom-left-corner"
          fill=${withAlpha(secondary, 0.1)}
          stroke=${secondary}
          points=${`20 ${height - 10}, 25 ${height - 4}, 55 ${height - 4}, 60 ${height - 10}`}
        ></polygon>
        <polygon
          part="corner top-right-corner"
          fill=${withAlpha(secondary, 0.1)}
          stroke=${secondary}
          points=${`${width - 20} 10, ${width - 25} 4, ${width - 55} 4, ${width - 60} 10`}
        ></polygon>
        <polygon
          part="corner bottom-right-corner"
          fill=${withAlpha(secondary, 0.1)}
          stroke=${secondary}
          points=${`${width - 20} ${height - 10}, ${width - 25} ${height - 4}, ${width - 55} ${height - 4}, ${width - 60} ${height - 10}`}
        ></polygon>
        <polygon
          part="frame"
          fill=${withAlpha(primary, 0.2)}
          stroke=${primary}
          points=${`20 10, 5 ${middleY}, 20 ${height - 10}, ${width - 20} ${height - 10}, ${width - 5} ${middleY}, ${width - 20} 10`}
        ></polygon>
        <polyline
          part="side-line left-line"
          fill="transparent"
          stroke=${withAlpha(primary, 0.7)}
          points=${`25 18, 15 ${middleY}, 25 ${height - 18}`}
        ></polyline>
        <polyline
          part="side-line right-line"
          fill="transparent"
          stroke=${withAlpha(primary, 0.7)}
          points=${`${width - 25} 18, ${width - 15} ${middleY}, ${width - 25} ${height - 18}`}
        ></polyline>
      </svg>
      <div part="content" class="content">
        <slot></slot>
      </div>
    `
  }

  private resolveColors(): [string, string] {
    const colors = this.colors.split(',').map(color => color.trim()).filter(Boolean)
    const primary = colors[0] ?? resolveThemeValue({
      explicit: this.color,
      cssVariable: '--dv-color-primary',
      host: this,
      fallback: '#18f0ff',
    })
    const secondary = colors[1] ?? resolveThemeValue({
      explicit: this.secondaryColor,
      cssVariable: '--dv-color-secondary',
      host: this,
      fallback: '#2b7cff',
    })

    return [primary, secondary]
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
    const parts = rgb[1].split(',').map(part => part.trim()).filter(Boolean)
    if (parts.length >= 3)
      return `rgba(${parts.slice(0, 3).join(', ')}, ${clampedAlpha})`
  }

  return trimmed
}
