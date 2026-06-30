import { DatavElement, resolveNumberValue } from '@datav-kit/core'
import { css, html } from 'lit'
import { property, state } from 'lit/decorators.js'

export type CountToTransitionPreset = 'linear' | 'easeInOutCubic' | 'easeOutCubic' | 'easeOutExpo'
export type CountToTransition = CountToTransitionPreset | ((progress: number) => number)

const transitionPresets: Record<CountToTransitionPreset, (progress: number) => number> = {
  linear: progress => progress,
  easeInOutCubic: progress => progress < 0.5 ? 4 * progress ** 3 : 1 - (-2 * progress + 2) ** 3 / 2,
  easeOutCubic: progress => 1 - (1 - progress) ** 3,
  easeOutExpo: progress => progress === 1 ? 1 : 1 - 2 ** (-10 * progress),
}

const maxDecimalPlaces = 20

export class CountToElement extends DatavElement {
  static override styles = css`
    :host {
      display: inline-block;
      color: var(--dvk-count-to-color, currentColor);
      font-family: var(--dvk-count-to-font-family, "Segoe UI", Tahoma, Geneva, Verdana, sans-serif);
      line-height: 1;
    }

    .count-to {
      display: inline-flex;
      align-items: baseline;
      gap: var(--dvk-count-to-gap, 0.25em);
      white-space: nowrap;
    }

    .prefix,
    .suffix {
      color: var(--dvk-count-to-affix-color, currentColor);
      font-size: var(--dvk-count-to-affix-font-size, 0.75em);
      line-height: 1;
    }

    .main {
      font-size: var(--dvk-count-to-font-size, 1.5em);
      font-weight: var(--dvk-count-to-font-weight, 600);
      font-variant-numeric: tabular-nums;
      letter-spacing: 0;
      line-height: 1;
    }

    .decimal {
      color: var(--dvk-count-to-decimal-color, currentColor);
      font-size: var(--dvk-count-to-decimal-font-size, 0.75em);
      font-weight: var(--dvk-count-to-decimal-font-weight, inherit);
    }
  `

  @property({ type: Number, attribute: 'start-val' })
  startVal = 0

  @property({ type: Number, attribute: 'end-val' })
  endVal = 0

  @property({ type: Number })
  duration = 2000

  @property({ type: Number })
  delay = 0

  @property({ type: Number })
  decimals = 0

  @property()
  decimal = '.'

  @property()
  separator = ','

  @property()
  prefix = ''

  @property()
  suffix = ''

  @property({ type: Boolean })
  disabled = false

  @property()
  transition: CountToTransition = 'easeOutExpo'

  @state()
  private currentValue = 0

  private frameId = 0
  private delayId = 0
  private animationStart = 0
  private animationFrom = 0
  private animationTo = 0

  constructor() {
    super()
    this.currentValue = this.startVal
  }

  override connectedCallback(): void {
    if (!this.hasAttribute('role'))
      this.setAttribute('role', 'group')

    super.connectedCallback()
  }

  override disconnectedCallback(): void {
    this.cancelAnimation()
    super.disconnectedCallback()
  }

  override willUpdate(changed: Map<PropertyKey, unknown>): void {
    if (!this.hasUpdated) {
      this.currentValue = this.shouldRenderTargetImmediately()
        ? resolveNumberValue(this.endVal, 0)
        : resolveNumberValue(this.startVal, 0)
      return
    }

    if (
      changed.has('endVal')
      || changed.has('duration')
      || changed.has('delay')
      || changed.has('disabled')
      || changed.has('transition')
    ) {
      this.animateTo(this.endVal)
    }
  }

  override firstUpdated(): void {
    if (!this.shouldRenderTargetImmediately())
      this.animateTo(this.endVal)
  }

  override render(): unknown {
    const { main, decimal } = this.formatValue(this.currentValue)

    return html`
      <span part="root" class="count-to">
        <slot name="prefix">
          ${this.prefix
            ? html`<span part="prefix" class="prefix">${this.prefix}</span>`
            : null}
        </slot>
        <span part="main" class="main">
          <span part="integer">${main}</span>${decimal
            ? html`<span part="decimal" class="decimal">${decimal}</span>`
            : null}
        </span>
        <slot name="suffix">
          ${this.suffix
            ? html`<span part="suffix" class="suffix">${this.suffix}</span>`
            : null}
        </slot>
      </span>
    `
  }

  restart(): void {
    this.currentValue = resolveNumberValue(this.startVal, 0)
    this.animateTo(this.endVal)
  }

  private animateTo(value: number): void {
    const to = resolveNumberValue(value, 0)
    const duration = Math.max(resolveNumberValue(this.duration, 2000), 0)
    const delay = Math.max(resolveNumberValue(this.delay, 0), 0)

    this.cancelAnimation()

    if (this.shouldRenderTargetImmediately() || !this.isConnected) {
      this.currentValue = to
      return
    }

    this.animationFrom = this.currentValue
    this.animationTo = to

    this.delayId = window.setTimeout(() => {
      this.animationStart = window.performance.now()
      this.emit('dvk-started', {
        from: this.animationFrom,
        to: this.animationTo,
        duration,
        delay,
      })
      this.frameId = window.requestAnimationFrame(time => this.updateAnimation(time, duration))
    }, delay)
  }

  private updateAnimation(time: number, duration: number): void {
    const elapsed = Math.max(time - this.animationStart, 0)
    const progress = duration === 0 ? 1 : Math.min(elapsed / duration, 1)
    const eased = this.resolveTransition()(progress)

    this.currentValue = this.animationFrom + (this.animationTo - this.animationFrom) * eased

    if (progress < 1) {
      this.frameId = window.requestAnimationFrame(nextTime => this.updateAnimation(nextTime, duration))
      return
    }

    this.currentValue = this.animationTo
    this.frameId = 0
    this.emit('dvk-finished', { value: this.animationTo })
  }

  private cancelAnimation(): void {
    if (this.delayId) {
      window.clearTimeout(this.delayId)
      this.delayId = 0
    }

    if (this.frameId) {
      window.cancelAnimationFrame(this.frameId)
      this.frameId = 0
    }
  }

  private resolveTransition(): (progress: number) => number {
    if (typeof this.transition === 'function')
      return this.transition

    return transitionPresets[this.transition] ?? transitionPresets.easeOutExpo
  }

  private shouldRenderTargetImmediately(): boolean {
    return this.disabled || Math.max(resolveNumberValue(this.duration, 2000), 0) === 0 || this.prefersReducedMotion()
  }

  private prefersReducedMotion(): boolean {
    return typeof window !== 'undefined'
      && typeof window.matchMedia === 'function'
      && window.matchMedia('(prefers-reduced-motion: reduce)').matches
  }

  private formatValue(value: number): { main: string, decimal: string } {
    const decimals = Math.min(Math.max(Math.floor(resolveNumberValue(this.decimals, 0)), 0), maxDecimalPlaces)
    const fixed = resolveNumberValue(value, 0).toFixed(decimals)
    const [integer = '0', fraction = ''] = fixed.split('.')
    const main = this.formatInteger(integer)

    return {
      main,
      decimal: decimals > 0 ? `${this.decimal}${fraction}` : '',
    }
  }

  private formatInteger(value: string): string {
    if (!this.separator)
      return value

    const sign = value.startsWith('-') ? '-' : ''
    const digits = sign ? value.slice(1) : value

    return `${sign}${digits.replace(/\B(?=(\d{3})+(?!\d))/g, this.separator)}`
  }
}
