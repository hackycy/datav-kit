import { DatavElement, ResizeController, resolveThemeValue } from '@datav-kit/core'
import { css, html } from 'lit'
import { property, state } from 'lit/decorators.js'

interface Decoration5Size {
  width: number
  height: number
}

const defaultSize: Decoration5Size = {
  width: 0,
  height: 0,
}

export class Decoration5Element extends DatavElement {
  static override styles = css`
    :host {
      display: flex;
      width: 100%;
      height: 100%;
      min-width: 0;
      min-height: 0;
      color: var(--dv-color-primary, #3f96a5);
    }

    svg {
      display: block;
      width: 100%;
      height: 100%;
      overflow: visible;
      pointer-events: none;
    }

    polyline {
      vector-effect: non-scaling-stroke;
    }
  `

  @property()
  color: string | readonly string[] = ''

  @property({ attribute: 'secondary-color' })
  secondaryColor = ''

  @property()
  colors = ''

  @property({ type: Boolean })
  reverse = false

  @state()
  private size = defaultSize

  private readonly resizeController = new ResizeController(this, (state) => {
    this.size = {
      width: Math.max(state.width, 0),
      height: Math.max(state.height, 0),
    }
  })

  override firstUpdated(): void {
    this.emit('dv-ready', { tagName: 'dv-decoration-5' })
  }

  override render(): unknown {
    const [primary, secondary] = this.resolveColors()
    const width = Math.max(this.size.width, 1)
    const height = Math.max(this.size.height, 1)
    const middleY = height / 2
    const bottomY = height - 3
    const xPos = (position: number): number => this.reverse ? width - position : position

    return html`
      <svg part="graphic" width=${String(width)} height=${String(height)} aria-hidden="true">
        <polyline
          part="line short-line"
          stroke=${primary}
          stroke-width="2"
          fill="transparent"
          points=${`${xPos(0)},0 ${xPos(30)},${middleY}`}
        ></polyline>
        <polyline
          part="line long-line"
          stroke=${primary}
          stroke-width="2"
          fill="transparent"
          points=${`${xPos(20)},0 ${xPos(50)},${middleY} ${xPos(width)},${middleY}`}
        ></polyline>
        <polyline
          part="line bottom-line"
          stroke=${secondary}
          stroke-width="3"
          fill="transparent"
          points=${`${xPos(0)},${bottomY} ${xPos(200)},${bottomY}`}
        ></polyline>
      </svg>
    `
  }

  private resolveColors(): [string, string] {
    const colorList = this.resolveColorList()
    const explicitPrimary = typeof this.color === 'string' && !isJsonArrayString(this.color)
      ? this.color
      : ''
    const primary = colorList[0] ?? resolveThemeValue({
      explicit: explicitPrimary,
      cssVariable: '--dv-color-primary',
      host: this,
      fallback: '#3f96a5',
    })
    const secondary = colorList[1] ?? resolveThemeValue({
      explicit: this.secondaryColor,
      cssVariable: '--dv-color-secondary',
      host: this,
      fallback: '#3f96a5',
    })

    return [primary, secondary]
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

function splitColors(value: string): string[] {
  return value.split(',').map(color => color.trim()).filter(Boolean)
}

function isJsonArrayString(value: string): boolean {
  return value.trim().startsWith('[')
}
