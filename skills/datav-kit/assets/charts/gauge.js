/**
 * datav-kit chart template — gauge (单值 / single value).
 *
 * Copy this file as-is, then change only what the data demands: series data, axis
 * categories, colour-role assignment, and the chart type itself. See
 * `references/charts.md` §4 for the full copy/adjust contract.
 *
 * Six pieces are built in:
 *   1. token injection   readDatavTokens() -> buildTheme() -> init(el, themeObject)
 *   2. option skeleton   explicit geometry, no library default padding
 *   3. resize            ResizeObserver + rAF -> chart.resize()
 *   4. theme switching   chart.setTheme(); never dispose() + init()
 *   5. four states       loading / empty / failed / stale, via setState()
 *   6. performance guard one pointer + animationThreshold + the min-size guard
 *
 * Tokens must be self-contained values (hex / rgb / rgba / px); the bridge cannot
 * convert rem or evaluate color-mix(). Chart motion is fixed at 300ms — the
 * 200-400ms band — and never reads `--dvk-motion-duration` (2200-2600ms).
 */

import * as echarts from 'echarts'

const CHART_MOTION = 300
const MIN_WIDTH = 160 // Starter size guard: below this, render a value card
const MIN_HEIGHT = 100

/* ---------- 1. token injection: --dvk-* -> ECharts theme object ---------- */

const TOKEN_FALLBACKS = {
  primary: ['--dvk-color-primary', '#18f0ff'],
  secondary: ['--dvk-color-secondary', '#2b7cff'],
  accent: ['--dvk-color-accent', '#f3ff5c'],
  surface: ['--dvk-color-surface', 'rgba(4, 15, 28, 0.72)'],
  glowSoft: ['--dvk-glow-soft', '0 0 12px rgba(24, 240, 255, 0.55)'],
  lineWidth: ['--dvk-line-width', '1px'],
  fontFamily: ['--dvk-screen-font-family', 'Inter, "PingFang SC", "Microsoft YaHei", sans-serif'],
  fontXs: ['--dvk-screen-font-size-xs', '14px'],
  fontSm: ['--dvk-screen-font-size-sm', '18px'],
}

export function readDatavTokens(host = document.documentElement) {
  const css = getComputedStyle(host)
  const raw = {}
  for (const [key, [name, fallback]] of Object.entries(TOKEN_FALLBACKS))
    raw[key] = css.getPropertyValue(name).trim() || fallback
  const glow = parseGlow(raw.glowSoft)
  return {
    ...raw,
    lineWidth: Number.parseFloat(raw.lineWidth) || 1,
    fontXs: Number.parseFloat(raw.fontXs) || 14,
    fontSm: Number.parseFloat(raw.fontSm) || 18,
    ...glow,
  }
}

export function withAlpha(color, alpha) {
  const value = String(color).trim()
  const rgb = value.match(/^rgba?\(([^)]+)\)$/i)
  if (rgb) {
    const [r, g, b] = rgb[1].split(',').map(Number)
    return `rgba(${r}, ${g}, ${b}, ${alpha})`
  }
  let hex = value.replace('#', '')
  if (hex.length === 3)
    hex = hex.split('').map(c => c + c).join('')
  const n = Number.parseInt(hex, 16)
  return `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, ${alpha})`
}

/* Computed box-shadow normalises offsets to unitless 0 and may serialise the colour
   first ("rgba(...) 0px 0px 12px 0px") or last ("0 0 12px rgba(...)"); the px-suffixed
   tokens are the lengths in either form. */
function parseGlow(value) {
  const parts = String(value).trim().split(' ')
  const lengths = parts.filter(part => part.endsWith('px')).map(part => Number.parseFloat(part))
  const color = parts.filter(part => !part.endsWith('px') && part !== 'inset').join(' ')
  const blur = lengths.length >= 3 ? lengths[2] : lengths[0] || 0
  return { glowBlur: Number.isFinite(blur) ? blur : 0, glowColor: color || 'transparent' }
}

/* Type-specific theme defaults; the shared roles below are identical across templates. */
function typeTheme(t) {
  return {
    gauge: {
      axisLine: { lineStyle: { color: [[1, withAlpha(t.primary, 0.18)]] } },
      splitLine: { lineStyle: { color: withAlpha(t.primary, 0.35), width: t.lineWidth } },
      axisLabel: { color: withAlpha(t.primary, 0.72), fontSize: t.fontXs, fontFamily: t.fontFamily },
      title: { color: withAlpha(t.primary, 0.72), fontFamily: t.fontFamily },
      detail: { color: t.primary, fontFamily: t.fontFamily },
    },
  }
}

function buildTheme(t) {
  const axisLabel = { color: withAlpha(t.primary, 0.72), fontSize: t.fontXs, fontFamily: t.fontFamily }
  return {
    color: [t.primary, t.secondary, t.accent],
    backgroundColor: 'transparent',
    textStyle: { color: withAlpha(t.primary, 0.72), fontFamily: t.fontFamily, fontSize: t.fontXs },
    categoryAxis: {
      axisLine: { lineStyle: { color: withAlpha(t.primary, 0.32), width: t.lineWidth } },
      axisTick: { show: false },
      axisLabel,
      splitLine: { show: false },
    },
    valueAxis: {
      axisLine: { show: false },
      axisTick: { show: false },
      axisLabel,
      splitLine: { lineStyle: { color: withAlpha(t.primary, 0.12), width: t.lineWidth } },
    },
    legend: { textStyle: { color: withAlpha(t.primary, 0.72), fontFamily: t.fontFamily, fontSize: t.fontXs } },
    tooltip: {
      backgroundColor: t.surface,
      borderColor: withAlpha(t.primary, 0.4),
      borderWidth: t.lineWidth,
      textStyle: { color: t.primary, fontSize: t.fontSm, fontFamily: t.fontFamily },
    },
    ...typeTheme(t),
  }
}

/* ---------- 2. option skeleton ---------- */

function prefersReducedMotion() {
  return typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches
}

function buildOption(data, t) {
  const unit = data.unit || ''
  return {
    animation: !prefersReducedMotion(),
    animationDuration: CHART_MOTION,
    animationThreshold: 2000,
    tooltip: { show: false },
    series: [{
      type: 'gauge',
      // Explicit geometry replaces grid for a non-cartesian chart.
      center: ['50%', '58%'],
      radius: '78%',
      min: data.min ?? 0,
      max: data.max ?? 100,
      startAngle: 210,
      endAngle: -30,
      splitNumber: 4,
      // One pointer only; this starter uses one pointer.
      progress: {
        show: true,
        width: 8,
        roundCap: true,
        itemStyle: { color: t.primary, shadowBlur: t.glowBlur, shadowColor: t.glowColor },
      },
      axisLine: { lineStyle: { width: 8 } },
      axisTick: { show: false },
      splitLine: { length: 6 },
      pointer: { width: 4, length: '62%', itemStyle: { color: t.accent } },
      anchor: { show: false },
      title: { show: Boolean(data.label), offsetCenter: [0, '32%'], fontSize: t.fontXs },
      detail: {
        valueAnimation: !prefersReducedMotion(),
        offsetCenter: [0, '-4%'],
        fontSize: t.fontSm,
        formatter: value => `${value}${unit}`,
      },
      data: [{ value: data.value ?? 0, name: data.label || '' }],
    }],
  }
}

/* ---------- 3. resize: ResizeObserver + rAF, never window.resize ---------- */

function observeResize(el, run) {
  let frame = 0
  const observer = new ResizeObserver(() => {
    if (frame)
      return
    frame = requestAnimationFrame(() => {
      frame = 0
      run()
    })
  })
  observer.observe(el)
  return () => {
    observer.disconnect()
    if (frame)
      cancelAnimationFrame(frame)
  }
}

/* ---------- 5. four exception states ---------- */

function showEmpty(chart, t, message) {
  chart.setOption({
    graphic: {
      type: 'group',
      left: 'center',
      top: 'middle',
      silent: true,
      children: [
        {
          type: 'circle',
          shape: { cx: 0, cy: -14, r: 8 },
          style: { fill: 'none', stroke: withAlpha(t.primary, 0.35), lineWidth: t.lineWidth },
        },
        {
          type: 'text',
          style: {
            text: message,
            x: 0,
            y: 12,
            textAlign: 'center',
            fill: withAlpha(t.primary, 0.6),
            font: `${t.fontXs}px ${t.fontFamily}`,
          },
        },
      ],
    },
  })
}

function mountOverlay(el) {
  if (getComputedStyle(el).position === 'static')
    el.style.position = 'relative'
  const node = document.createElement('div')
  node.style.cssText = 'position:absolute;inset:0;display:none;place-items:center;pointer-events:none;text-align:center;'
  el.append(node)
  return node
}

function paintOverlay(el, node, t, kind, text) {
  el.style.outline = kind === 'stale' ? `1px dashed ${withAlpha(t.primary, 0.45)}` : ''
  if (!kind) {
    node.style.display = 'none'
    node.removeAttribute('role')
    node.replaceChildren()
    return
  }
  node.style.display = 'grid'
  node.setAttribute('role', kind === 'failed' ? 'alert' : 'status')
  node.style.font = `${t.fontXs}px ${t.fontFamily}`
  if (kind === 'failed') {
    node.style.background = t.surface
    node.style.color = withAlpha(t.primary, 0.85)
  }
  else {
    node.style.placeItems = 'start center'
    node.style.paddingTop = '4px'
    node.style.color = withAlpha(t.primary, 0.7)
  }
  node.replaceChildren(document.createTextNode(text))
}

/* ---------- 6. factory ---------- */

export function createGauge(el, data, tokens = readDatavTokens(el)) {
  let chart = null
  let overlay = null
  let state = { kind: 'ready', detail: {} }
  let degraded = false
  let cleared = false // set when empty/failed called chart.clear()
  const stopResize = observeResize(el, sync)

  function applyState() {
    if (!chart)
      return
    chart.hideLoading()
    if (state.kind === 'loading') {
      chart.showLoading('default', {
        text: state.detail.message || '加载中',
        color: tokens.primary,
        textColor: withAlpha(tokens.primary, 0.85),
        maskColor: 'transparent', // the default rgba(255,255,255,0.8) paints a white sheet
        fontSize: tokens.fontXs,
        spinnerRadius: 10,
        lineWidth: 3,
      })
      paintOverlay(el, overlay, tokens, null)
      return
    }
    if (state.kind === 'empty') {
      chart.clear()
      cleared = true
      showEmpty(chart, tokens, state.detail.message || '暂无数据')
      paintOverlay(el, overlay, tokens, null)
      return
    }
    chart.setOption({ graphic: [] }, { replaceMerge: ['graphic'] })
    if (state.kind === 'failed') {
      chart.clear()
      cleared = true
      paintOverlay(el, overlay, tokens, 'failed', state.detail.message || '数据获取失败')
      return
    }
    // clear() drops the option, so a chart returning from empty/failed redraws here.
    if (cleared) {
      chart.setOption(buildOption(data, tokens))
      cleared = false
    }
    if (state.kind === 'stale') {
      paintOverlay(el, overlay, tokens, 'stale', state.detail.message || `数据已过期 · 最后更新 ${state.detail.updatedAt || '—'}`)
      return
    }
    paintOverlay(el, overlay, tokens, null)
  }

  function mount() {
    degraded = false
    el.replaceChildren()
    chart = echarts.init(el, buildTheme(tokens), { renderer: 'svg' })
    overlay = mountOverlay(el)
    chart.setOption(buildOption(data, tokens))
    applyState()
  }

  /* Below the guard the chart is replaced by a value card. */
  function degrade() {
    if (degraded)
      return
    degraded = true
    chart?.dispose()
    chart = null
    overlay = null
    const value = data.value ?? 0
    const useCountTo = typeof customElements !== 'undefined' && customElements.get('dvk-count-to') !== undefined
    const node = document.createElement(useCountTo ? 'dvk-count-to' : 'span')
    if (useCountTo) {
      node.setAttribute('end-val', String(value))
      node.setAttribute('duration', '1400')
    }
    else {
      node.textContent = String(value)
    }
    el.replaceChildren(node)
  }

  function sync() {
    if (el.clientWidth < MIN_WIDTH || el.clientHeight < MIN_HEIGHT) {
      degrade()
      return
    }
    if (chart)
      chart.resize()
    else
      mount()
  }

  sync()

  return {
    get chart() {
      return chart
    },
    update(next) {
      data = next
      if (chart)
        chart.setOption(buildOption(data, tokens))
      state = { kind: 'ready', detail: {} }
      applyState()
      if (degraded) {
        degraded = false
        sync()
      }
    },
    setState(kind, detail = {}) {
      state = { kind, detail }
      applyState()
    },
    // 4. theme switching: setTheme(), never dispose() + init().
    setTheme(next) {
      if (next)
        tokens = next
      else
        tokens = readDatavTokens(el)
      if (chart) {
        chart.setTheme(buildTheme(tokens))
        // setTheme replays the option backup, so rebuild with notMerge: a chart that
        // returned from empty/failed would otherwise stay blank (ECharts setTheme caveat).
        chart.setOption(buildOption(data, tokens), { notMerge: true })
      }
      applyState()
    },
    dispose() {
      stopResize()
      chart?.dispose()
      chart = null
    },
  }
}
