import { DatavElement, ResizeController, resolveThemeValue } from '@datav-kit/core'
import { css, html, svg } from 'lit'
import { property, state } from 'lit/decorators.js'
import { createBorderBoxContentPadding } from '../border-box-content-padding'

interface BorderBox9Size {
  width: number
  height: number
}

const defaultSize: BorderBox9Size = {
  width: 0,
  height: 0,
}
const outerCornerLength = 25
const innerCornerLength = 10
const contentSafeInset = 10

export class BorderBox9Element extends DatavElement {
  static override styles = css`
    :host {
      display: block;
      position: relative;
      width: 100%;
      height: 100%;
      min-width: 0;
      min-height: 0;
      box-sizing: border-box;
      color: var(--dv-color-primary, #235fa7);
      overflow: hidden;
    }

    .frame {
      position: absolute;
      inset: 0;
      pointer-events: none;
    }

    .surface {
      position: absolute;
      inset: 0;
      box-sizing: border-box;
      border: var(--dv-border-box-9-border-width, 1px) solid var(--dv-border-box-9-border-color, var(--dv-border-box-9-primary));
      background-color: var(--dv-border-box-9-background);
      box-shadow: var(--dv-border-box-9-box-shadow);
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

    polyline {
      fill: none;
      stroke-linecap: round;
    }

    .content {
      position: relative;
      z-index: 1;
      box-sizing: border-box;
      width: 100%;
      height: 100%;
      min-height: 0;
      padding: var(--dv-border-box-9-padding, var(--dv-border-box-padding, var(--dv-border-box-auto-padding)));
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
    this.emit('dv-ready', { tagName: 'dv-border-box-9' })
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
        x: contentSafeInset,
        y: contentSafeInset,
        width: Math.max(width - contentSafeInset * 2, 0),
        height: Math.max(height - contentSafeInset * 2, 0),
      },
      minBlock: 6,
      minInline: 6,
    })

    return html`
      <div
        part="frame"
        class="frame"
        style=${`
          --dv-border-box-9-primary: ${primary};
          --dv-border-box-9-box-shadow: inset 0 0 40px ${primary};
          --dv-border-box-9-background: ${background};
        `}
      >
        <div class="surface"></div>
        <svg part="graphic" class="panel" width=${String(width)} height=${String(height)} aria-hidden="true">
          ${this.renderCornerLines(width, height, primary, secondary)}
        </svg>
      </div>
      <div part="content" class="content" style=${`--dv-border-box-auto-padding: ${contentPadding}`}>
        <slot></slot>
      </div>
    `
  }

  private renderCornerLines(width: number, height: number, primary: string, secondary: string): unknown {
    return svg`
      ${this.renderCornerGroup('left-top', 'translate(0, 0)', primary, secondary)}
      ${this.renderCornerGroup('right-top', `translate(${width}, 0) scale(-1, 1)`, primary, secondary)}
      ${this.renderCornerGroup('right-bottom', `translate(${width}, ${height}) scale(-1, -1)`, primary, secondary)}
      ${this.renderCornerGroup('left-bottom', `translate(0, ${height}) scale(1, -1)`, primary, secondary)}
    `
  }

  private renderCornerGroup(
    position: 'left-top' | 'right-top' | 'right-bottom' | 'left-bottom',
    transform: string,
    primary: string,
    secondary: string,
  ): unknown {
    return svg`
      <g data-corner=${position} transform=${transform}>
        <polyline stroke=${primary} stroke-width="2" points=${`0,${outerCornerLength} 0,0 ${outerCornerLength},0`}></polyline>
        <polyline stroke=${secondary} stroke-width="5" points=${`0,${innerCornerLength} 0,0 ${innerCornerLength},0`}></polyline>
      </g>
    `
  }

  private resolveColors(): [string, string, string] {
    const colors = this.colors.split(',').map(color => color.trim()).filter(Boolean)
    const primary = colors[0] ?? resolveThemeValue({
      explicit: this.color,
      cssVariable: '--dv-color-primary',
      host: this,
      fallback: '#235fa7',
    })
    const secondary = colors[1] ?? resolveThemeValue({
      explicit: this.secondaryColor,
      cssVariable: '--dv-color-secondary',
      host: this,
      fallback: '#4fd2dd',
    })
    const background = resolveThemeValue({
      explicit: this.backgroundColor,
      cssVariable: '--dv-border-box-9-background',
      host: this,
      fallback: 'transparent',
    })

    return [primary, secondary, background]
  }
}
