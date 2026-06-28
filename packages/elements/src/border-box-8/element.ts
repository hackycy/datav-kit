import { DatavElement, ResizeController, resolveThemeValue } from '@datav-kit/core'
import { css, html, svg } from 'lit'
import { property, state } from 'lit/decorators.js'
import { createBorderBoxContentPadding } from '../border-box-content-padding'

interface BorderBox8Size {
  width: number
  height: number
}

const defaultSize: BorderBox8Size = {
  width: 0,
  height: 0,
}
const cornerSize = 150
const contentSafeInset = 18
const cornerPoints = {
  primary: '6,66 6,18 12,12 18,12 24,6 27,6 30,9 36,9 39,6 84,6 81,9 75,9 73.2,7 40.8,7 37.8,10.2 24,10.2 12,21 12,24 9,27 9,51 7.8,54 7.8,63',
  highlight: '27.599999999999998,4.8 38.4,4.8 35.4,7.8 30.599999999999998,7.8',
  vertical: '9,54 9,63 7.199999999999999,66 7.199999999999999,75 7.8,78 7.8,110 8.4,110 8.4,66 9.6,66 9.6,54',
}
const panelGeometry = {
  left: 10,
  topInset: 27,
  stepInset: 13,
  bottomStepInner: 21,
  bottomStepOuter: 24,
  bottomNotchStart: 38,
  bottomNotchInner: 41,
  topLongNotch: 73,
  topShortNotch: 75,
  centerNotchInner: 81,
  centerNotchOuter: 85,
  outerBottom: 6,
  notchOuter: 8,
  notchInner: 10,
  lowerDiagonal: 11,
}

export class BorderBox8Element extends DatavElement {
  static override styles = css`
    :host {
      display: block;
      position: relative;
      width: 100%;
      height: 100%;
      min-width: 0;
      min-height: 0;
      box-sizing: border-box;
      color: var(--dv-color-primary, #4fd2dd);
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

    .corner {
      position: absolute;
      width: ${cornerSize}px;
      height: ${cornerSize}px;
    }

    .corner--left-top {
      left: 0;
      top: 0;
    }

    .corner--right-top {
      right: 0;
      top: 0;
      transform: rotateY(180deg);
    }

    .corner--left-bottom {
      left: 0;
      bottom: 0;
      transform: rotateX(180deg);
    }

    .corner--right-bottom {
      right: 0;
      bottom: 0;
      transform: rotateX(180deg) rotateY(180deg);
    }

    .content {
      position: relative;
      z-index: 1;
      box-sizing: border-box;
      width: 100%;
      height: 100%;
      min-height: 0;
      padding: var(--dv-border-box-8-padding, var(--dv-border-box-padding, var(--dv-border-box-auto-padding)));
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

  @property({ attribute: 'background-color' })
  backgroundColor = ''

  @property()
  colors = ''

  @property({ type: Boolean })
  animated = true

  @property({ type: Boolean })
  paused = false

  @state()
  private size = defaultSize

  private readonly resizeController = new ResizeController(this, (state) => {
    this.size = {
      width: Math.max(state.width, 0),
      height: Math.max(state.height, 0),
    }
  })

  override firstUpdated(): void {
    this.emit('dv-ready', { tagName: 'dv-border-box-8' })
  }

  override render(): unknown {
    const [primary, secondary, background] = this.resolveColors()
    const width = Math.max(this.size.width, 1)
    const height = Math.max(this.size.height, 1)
    const showAnimation = this.animated && !this.paused
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

    return html`
      <div part="frame" class="frame">
        <svg part="graphic" class="panel" width=${String(width)} height=${String(height)} aria-hidden="true">
          <polygon fill=${background} points=${this.createPanelPoints(width, height)}></polygon>
        </svg>
        ${this.renderCorner('left-top', primary, secondary, showAnimation)}
        ${this.renderCorner('right-top', primary, secondary, showAnimation)}
        ${this.renderCorner('left-bottom', primary, secondary, showAnimation)}
        ${this.renderCorner('right-bottom', primary, secondary, showAnimation)}
      </div>
      <div part="content" class="content" style=${`--dv-border-box-auto-padding: ${contentPadding}`}>
        <slot></slot>
      </div>
    `
  }

  private renderCorner(
    position: 'left-top' | 'right-top' | 'left-bottom' | 'right-bottom',
    primary: string,
    secondary: string,
    showAnimation: boolean,
  ): unknown {
    return svg`
      <svg
        part="graphic"
        class=${`corner corner--${position}`}
        width=${String(cornerSize)}
        height=${String(cornerSize)}
        viewBox="0 0 150 150"
        aria-hidden="true"
      >
        <polygon
          fill=${primary}
          points=${cornerPoints.primary}
        >
          ${showAnimation
            ? svg`<animate attributeName="fill" values=${`${primary};${secondary};${primary}`} dur="0.5s" begin="0s" repeatCount="indefinite"></animate>`
            : null}
        </polygon>
        <polygon
          fill=${secondary}
          points=${cornerPoints.highlight}
        >
          ${showAnimation
            ? svg`<animate attributeName="fill" values=${`${secondary};${primary};${secondary}`} dur="0.5s" begin="0s" repeatCount="indefinite"></animate>`
            : null}
        </polygon>
        <polygon
          fill=${primary}
          points=${cornerPoints.vertical}
        >
          ${showAnimation
            ? svg`<animate attributeName="fill" values=${`${primary};${secondary};transparent`} dur="1s" begin="0s" repeatCount="indefinite"></animate>`
            : null}
        </polygon>
      </svg>
    `
  }

  private createPanelPoints(width: number, height: number): string {
    const {
      left,
      topInset,
      stepInset,
      bottomStepInner,
      bottomStepOuter,
      bottomNotchStart,
      bottomNotchInner,
      topLongNotch,
      topShortNotch,
      centerNotchInner,
      centerNotchOuter,
      outerBottom,
      notchOuter,
      notchInner,
      lowerDiagonal,
    } = panelGeometry

    return [
      `${left},${topInset}`,
      `${left},${height - topInset}`,
      `${stepInset},${height - bottomStepOuter}`,
      `${stepInset},${height - bottomStepInner}`,
      `${bottomStepOuter},${height - lowerDiagonal}`,
      `${bottomNotchStart},${height - lowerDiagonal}`,
      `${bottomNotchInner},${height - notchOuter}`,
      `${topLongNotch},${height - notchOuter}`,
      `${topShortNotch},${height - notchInner}`,
      `${centerNotchInner},${height - notchInner}`,
      `${centerNotchOuter},${height - outerBottom}`,
      `${width - centerNotchOuter},${height - outerBottom}`,
      `${width - centerNotchInner},${height - notchInner}`,
      `${width - topShortNotch},${height - notchInner}`,
      `${width - topLongNotch},${height - notchOuter}`,
      `${width - bottomNotchInner},${height - notchOuter}`,
      `${width - bottomNotchStart},${height - lowerDiagonal}`,
      `${width - left},${height - topInset}`,
      `${width - left},${topInset}`,
      `${width - stepInset},25`,
      `${width - stepInset},${bottomStepInner}`,
      `${width - bottomStepOuter},${lowerDiagonal}`,
      `${width - bottomNotchStart},${lowerDiagonal}`,
      `${width - bottomNotchInner},${notchOuter}`,
      `${width - topLongNotch},${notchOuter}`,
      `${width - topShortNotch},${notchInner}`,
      `${width - centerNotchInner},${notchInner}`,
      `${width - centerNotchOuter},${outerBottom}`,
      `${centerNotchOuter},${outerBottom}`,
      `${centerNotchInner},${notchInner}`,
      `${topShortNotch},${notchInner}`,
      `${topLongNotch},${notchOuter}`,
      `${bottomNotchInner},${notchOuter}`,
      `${bottomNotchStart},${lowerDiagonal}`,
      `${bottomStepOuter},${lowerDiagonal}`,
      `${stepInset},${bottomStepInner}`,
      `${stepInset},${bottomStepOuter}`,
    ].join(' ')
  }

  private resolveColors(): [string, string, string] {
    const colors = this.colors.split(',').map(color => color.trim()).filter(Boolean)
    const primary = colors[0] ?? resolveThemeValue({
      explicit: this.color,
      cssVariable: '--dv-color-primary',
      host: this,
      fallback: '#4fd2dd',
    })
    const secondary = colors[1] ?? resolveThemeValue({
      explicit: this.secondaryColor,
      cssVariable: '--dv-color-secondary',
      host: this,
      fallback: '#235fa7',
    })
    const background = resolveThemeValue({
      explicit: this.backgroundColor,
      cssVariable: '--dv-border-box-8-background',
      host: this,
      fallback: 'transparent',
    })

    return [primary, secondary, background]
  }
}
