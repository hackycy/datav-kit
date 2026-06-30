import { DatavElement, requestDatavFullscreen, ResizeController, resolveNumberValue } from '@datav-kit/core'
import { css, html } from 'lit'
import { property, state } from 'lit/decorators.js'

export type FitScreenMode = 'contain' | 'cover' | 'fill' | 'scroll'
export type FitScreenTarget = 'viewport' | 'host'

interface ViewportState {
  width: number
  height: number
  dpr: number
  scaleX: number
  scaleY: number
  offsetX: number
  offsetY: number
}

const defaultViewport: ViewportState = {
  width: 0,
  height: 0,
  dpr: 1,
  scaleX: 1,
  scaleY: 1,
  offsetX: 0,
  offsetY: 0,
}

export class FitScreenElement extends DatavElement {
  static override styles = css`
    :host {
      display: block;
      position: relative;
      width: 100%;
      height: 100%;
      min-width: 0;
      min-height: 0;
      overflow: hidden;
      box-sizing: border-box;
      --dvk-scale: 1;
      --dvk-scale-x: 1;
      --dvk-scale-y: 1;
      --dvk-viewport-width: 0px;
      --dvk-viewport-height: 0px;
    }

    :host(:not([fit-target])),
    :host([fit-target="viewport"]) {
      width: 100vw;
      height: 100vh;
    }

    .viewport {
      position: absolute;
      inset: 0;
      overflow: hidden;
    }

    .viewport[data-mode="scroll"] {
      overflow: auto;
    }

    .canvas {
      position: absolute;
      inset: 0 auto auto 0;
      box-sizing: border-box;
      transform-origin: 0 0;
    }
  `

  @property({ type: Number })
  width = 1920

  @property({ type: Number })
  height = 1080

  @property()
  mode: FitScreenMode = 'contain'

  @property()
  align = 'center center'

  @property({ attribute: 'fit-target', reflect: true })
  fitTarget: FitScreenTarget = 'viewport'

  @property({ type: Boolean, attribute: 'auto-fullscreen' })
  autoFullscreen = false

  @state()
  private viewport = defaultViewport

  private readonly resizeController = new ResizeController(this, (state) => {
    this.applyResize(state.width, state.height, state.dpr)
  })

  override connectedCallback(): void {
    if (!this.hasAttribute('role'))
      this.setAttribute('role', 'group')

    super.connectedCallback()
  }

  override willUpdate(changed: Map<PropertyKey, unknown>): void {
    if (
      (changed.has('width') || changed.has('height') || changed.has('mode') || changed.has('align') || changed.has('fitTarget'))
      && this.viewport.width > 0
      && this.viewport.height > 0
    ) {
      this.applyResize(this.viewport.width, this.viewport.height, this.viewport.dpr)
    }
  }

  measure(): void {
    const rect = this.getBoundingClientRect()
    this.applyResize(rect.width, rect.height, window.devicePixelRatio || 1)
  }

  async requestFullscreenMode(): Promise<void> {
    const result = await requestDatavFullscreen(this)
    this.emit('dvk-fullscreen-request', result)
  }

  override render(): unknown {
    const width = Math.max(resolveNumberValue(this.width, 1920), 1)
    const height = Math.max(resolveNumberValue(this.height, 1080), 1)
    const transform = `translate(${this.viewport.offsetX}px, ${this.viewport.offsetY}px) scale(${this.viewport.scaleX}, ${this.viewport.scaleY})`

    return html`
      <div part="viewport" class="viewport" data-mode=${this.mode}>
        <div
          part="canvas"
          class="canvas"
          style=${[
            `width: ${width}px`,
            `height: ${height}px`,
            `transform: ${transform}`,
          ].join(';')}
        >
          <slot></slot>
        </div>
      </div>
    `
  }

  private applyResize(viewportWidth: number, viewportHeight: number, dpr: number): void {
    const designWidth = Math.max(resolveNumberValue(this.width, 1920), 1)
    const designHeight = Math.max(resolveNumberValue(this.height, 1080), 1)
    const next = this.computeViewport(viewportWidth, viewportHeight, designWidth, designHeight, dpr)

    this.viewport = next
    this.style.setProperty('--dvk-scale', String(Math.min(next.scaleX, next.scaleY)))
    this.style.setProperty('--dvk-scale-x', String(next.scaleX))
    this.style.setProperty('--dvk-scale-y', String(next.scaleY))
    this.style.setProperty('--dvk-viewport-width', `${next.width}px`)
    this.style.setProperty('--dvk-viewport-height', `${next.height}px`)
    this.emit('dvk-resize', {
      width: next.width,
      height: next.height,
      dpr: next.dpr,
      scale: Math.min(next.scaleX, next.scaleY),
      scaleX: next.scaleX,
      scaleY: next.scaleY,
      offsetX: next.offsetX,
      offsetY: next.offsetY,
    })
  }

  private computeViewport(viewportWidth: number, viewportHeight: number, designWidth: number, designHeight: number, dpr: number): ViewportState {
    const safeViewportWidth = Math.max(viewportWidth, 0)
    const safeViewportHeight = Math.max(viewportHeight, 0)

    if (safeViewportWidth === 0 || safeViewportHeight === 0) {
      return {
        width: safeViewportWidth,
        height: safeViewportHeight,
        dpr,
        scaleX: 1,
        scaleY: 1,
        offsetX: 0,
        offsetY: 0,
      }
    }

    if (this.mode === 'scroll') {
      return {
        width: safeViewportWidth,
        height: safeViewportHeight,
        dpr,
        scaleX: 1,
        scaleY: 1,
        offsetX: 0,
        offsetY: 0,
      }
    }

    const scaleX = safeViewportWidth / designWidth
    const scaleY = safeViewportHeight / designHeight
    const scale = this.mode === 'cover' ? Math.max(scaleX, scaleY) : Math.min(scaleX, scaleY)
    const nextScaleX = this.mode === 'fill' ? scaleX : scale
    const nextScaleY = this.mode === 'fill' ? scaleY : scale
    const renderedWidth = designWidth * nextScaleX
    const renderedHeight = designHeight * nextScaleY
    const { horizontal, vertical } = this.parseAlign()

    return {
      width: safeViewportWidth,
      height: safeViewportHeight,
      dpr,
      scaleX: nextScaleX,
      scaleY: nextScaleY,
      offsetX: this.resolveOffset(safeViewportWidth, renderedWidth, horizontal),
      offsetY: this.resolveOffset(safeViewportHeight, renderedHeight, vertical),
    }
  }

  private parseAlign(): { horizontal: string, vertical: string } {
    const [horizontal = 'center', vertical = 'center'] = this.align.split(/\s+/)
    return { horizontal, vertical }
  }

  private resolveOffset(viewportSize: number, renderedSize: number, align: string): number {
    if (align === 'start' || align === 'left' || align === 'top')
      return 0

    if (align === 'end' || align === 'right' || align === 'bottom')
      return viewportSize - renderedSize

    return (viewportSize - renderedSize) / 2
  }
}
