/**
 * datav-kit contrast check — zero-dependency, pure functions.
 *
 * Four object groups (spec.md 3.13 / issue 15): text / surface, graphic /
 * surface, decorative line / surface, and adjacent data marks. Each group is
 * checked against its non-rounded lower threshold (design-rules 4.1, a redline)
 * and against the advisory comfort band 7:1-15:1 (design-rules 4.5). The floor
 * decides PASS / FAIL; the band only adds an advisory note and never fails.
 *
 * Never rounds. WCAG 2.2 SC 1.4.3 is explicit that 4.499:1 is not 4.5:1, so a
 * pair at 4.4951:1 must FAIL the body-text floor even though a two-decimal
 * display reads 4.50. `ratio` is returned raw and compared raw.
 *
 * Reading a FAIL: the text / graphic / decorative-line floors are design-rules
 * 4.1 redlines. The adjacent-marks floor comes from 4.8, which is advisory and
 * conditional ("when a boundary itself carries meaning"), so a FAIL there means
 * the two marks are not told apart by colour alone — fix it by assigning colour
 * roles so adjacent series differ, or by adding a direct label / shape cue, not
 * necessarily by changing the palette. On a dark surface (`--dvk-color-surface`
 * is a 5-10% lightness of the brand colour) at most two marks can be mutually
 * 3:1 apart, so "every pair passes" is not a reachable target for a three-colour
 * theme.
 *
 * No palette lives here. Every colour is an input; in a project they come only
 * from the active theme's `--dvk-color-*` values (one colour source). A
 * translucent colour is composited over its background first — `--dvk-color-surface`
 * is rgba with alpha 0.72, so pass the screen ground as `ground`.
 *
 * Node-only, standard library only, no dependencies:
 *   node assets/tools/contrast-check.js
 * runs the four groups with representative passing and failing inputs.
 */

import process from 'node:process'
import { pathToFileURL } from 'node:url'

const HEX_RE = /^#([\da-f]{3,8})$/i
const RGB_FN_RE = /^rgba?\(([^)]+)\)$/i

/* ---------- colour parsing and compositing ---------- */

function channel(raw, scale) {
  const text = String(raw).trim()
  const value = Number.parseFloat(text)
  if (Number.isNaN(value))
    throw new TypeError(`not a number: "${text}"`)
  return Math.min(scale, Math.max(0, text.endsWith('%') ? (value / 100) * scale : value))
}

export function parseColor(input) {
  if (input && typeof input === 'object' && 'r' in input) {
    return {
      r: channel(input.r, 255),
      g: channel(input.g, 255),
      b: channel(input.b, 255),
      a: input.a === undefined ? 1 : Math.min(1, Math.max(0, Number(input.a))),
    }
  }
  const value = String(input).trim()

  const hex = value.match(HEX_RE)
  if (hex) {
    const digits = hex[1]
    const wide = digits.length <= 4 ? [...digits].map(d => d + d).join('') : digits
    if (wide.length !== 6 && wide.length !== 8)
      throw new TypeError(`unsupported hex colour: "${value}" (use #rgb, #rgba, #rrggbb or #rrggbbaa)`)
    const [r, g, b, a = 'ff'] = wide.match(/../g)
    return {
      r: Number.parseInt(r, 16),
      g: Number.parseInt(g, 16),
      b: Number.parseInt(b, 16),
      a: Number.parseInt(a, 16) / 255,
    }
  }

  const fn = value.match(RGB_FN_RE)
  if (fn) {
    const parts = fn[1].split(/[\s,/]+/).filter(Boolean)
    if (parts.length < 3 || parts.length > 4)
      throw new TypeError(`unsupported colour: "${value}" (use rgb(r, g, b) or rgba(r, g, b, a))`)
    const [r, g, b] = parts.slice(0, 3)
    return {
      r: channel(r, 255),
      g: channel(g, 255),
      b: channel(b, 255),
      a: parts.length === 4 ? channel(parts[3], 1) : 1,
    }
  }

  throw new TypeError(`unsupported colour: "${value}" (hex, rgb() and rgba() only)`)
}

/** Composite `top` over an opaque `bottom`; both may be any parseable colour. */
function composite(top, bottom) {
  const t = parseColor(top)
  const b = parseColor(bottom)
  if (b.a < 1)
    throw new TypeError('cannot composite over a translucent colour; resolve it to an opaque one first')
  return {
    r: t.r * t.a + b.r * (1 - t.a),
    g: t.g * t.a + b.g * (1 - t.a),
    b: t.b * t.a + b.b * (1 - t.a),
    a: 1,
  }
}

/** WCAG 2.2 relative luminance. Alpha is ignored — composite before calling. */
export function relativeLuminance(input) {
  const { r, g, b } = parseColor(input)
  const linear = (v) => {
    const c = v / 255
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4
  }
  return 0.2126 * linear(r) + 0.7152 * linear(g) + 0.0722 * linear(b)
}

/**
 * WCAG 2.2 contrast ratio, raw and unrounded.
 * `options.ground` is required when the background is translucent.
 */
export function contrastRatio(foreground, background, options = {}) {
  let bg = parseColor(background)
  if (bg.a < 1) {
    if (options.ground === undefined)
      throw new TypeError('a translucent background needs an opaque `ground` colour to composite over')
    bg = composite(bg, options.ground)
  }
  const fg = parseColor(foreground)
  const solid = fg.a < 1 ? composite(fg, bg) : fg
  const [hi, lo] = [relativeLuminance(solid), relativeLuminance(bg)].sort((x, y) => y - x)
  return (hi + 0.05) / (lo + 0.05)
}

/* ---------- the four object groups ---------- */

/** design-rules 4.5, advisory only: body text sits in this comfort band. */
const ADVISORY_BAND = Object.freeze([7, 15])

export const GROUPS = Object.freeze({
  'text': Object.freeze({
    label: 'text / surface',
    floor: 4.5,
    floorSource: 'design-rules 4.1 body text (WCAG 2.2 SC 1.4.3)',
  }),
  'graphic': Object.freeze({
    label: 'graphic / surface',
    floor: 3,
    floorSource: 'design-rules 4.1 non-text and state indicators (WCAG 2.2 SC 1.4.11)',
  }),
  'decorative-line': Object.freeze({
    label: 'decorative line / surface',
    floor: 3,
    floorSource: 'design-rules 4.1 non-text',
  }),
  'adjacent-marks': Object.freeze({
    label: 'adjacent data marks',
    floor: 3,
    floorSource: 'design-rules 4.1 non-text applied to 4.8 (advisory, only when the boundary carries meaning)',
  }),
})

/** design-rules 4.1 also floors large text at 3:1 — same text group, lower floor. */
const LARGE_TEXT_FLOOR = 3
const LARGE_TEXT_SOURCE = 'design-rules 4.1 large text (>= 18pt / 14pt bold / ~24px)'

function advisoryFor(ratio) {
  const [low, high] = ADVISORY_BAND
  if (ratio < low)
    return `below the ${low}:1-${high}:1 comfort band`
  if (ratio > high)
    return `above the ${low}:1-${high}:1 comfort band`
  return null
}

/**
 * Check one object group. `options.ground` composites a translucent background;
 * `options.largeText` applies the 3:1 large-text floor instead of 4.5:1.
 */
export function check(group, foreground, background, options = {}) {
  const spec = GROUPS[group]
  if (!spec)
    throw new RangeError(`unknown object group "${group}"; use one of ${Object.keys(GROUPS).join(', ')}`)

  const largeText = group === 'text' && options.largeText === true
  const floor = largeText ? LARGE_TEXT_FLOOR : spec.floor
  const ratio = contrastRatio(foreground, background, options)

  return {
    group,
    label: spec.label,
    foreground: String(foreground),
    background: String(background),
    ground: options.ground === undefined ? null : String(options.ground),
    ratio,
    floor,
    floorSource: largeText ? LARGE_TEXT_SOURCE : spec.floorSource,
    pass: ratio >= floor,
    advisory: advisoryFor(ratio),
  }
}

/** Run a list of `{ group, fg, bg, ground?, largeText?, name? }` pairs. */
export function checkAll(pairs) {
  return pairs.map(({ group, fg, bg, ground, largeText, name }) => ({
    name: name ?? GROUPS[group]?.label ?? group,
    ...check(group, fg, bg, { ground, largeText }),
  }))
}

/** One line per result. Ratios print raw — no rounding, not even for display. */
export function formatReport(results) {
  const named = results.map(r => ({ ...r, name: r.name ?? r.label ?? r.group }))
  const width = Math.max(...named.map(r => r.name.length), 0)
  return named
    .map((r) => {
      const verdict = r.pass ? 'PASS' : 'FAIL'
      const note = r.advisory ? `  [advisory: ${r.advisory}]` : ''
      return `${verdict}  ${r.name.padEnd(width)}  ratio ${String(r.ratio)}  floor ${r.floor}  (${r.floorSource})${note}`
    })
    .join('\n')
}

/* ---------- representative run: one passing and one failing pair per group ---------- */

// Inputs only, not a palette: taken from the library theme cyber-blue and the
// screen ground, plus deliberately weak pairs so every group shows a failure.
const GROUND = '#040f1c'
const SURFACE = 'rgba(4, 15, 28, 0.72)' // --dvk-color-surface (alpha 0.72)

const DEMO = [
  { group: 'text', name: 'text: primary on surface', fg: '#18f0ff', bg: SURFACE, ground: GROUND },
  { group: 'text', name: 'text: dark brand blue on ground', fg: '#1d4f8a', bg: GROUND },
  {
    group: 'text',
    name: 'text: boundary 4.4951 (rounds to 4.50)',
    fg: 'rgba(255, 255, 255, 0.90014)',
    bg: '#6e6e6e',
  },
  { group: 'graphic', name: 'graphic: accent on surface', fg: '#f3ff5c', bg: SURFACE, ground: GROUND },
  { group: 'graphic', name: 'graphic: dim teal on ground', fg: '#0f3a4a', bg: GROUND },
  { group: 'decorative-line', name: 'line: secondary on surface', fg: '#2b7cff', bg: SURFACE, ground: GROUND },
  { group: 'decorative-line', name: 'line: surface colour on surface', fg: SURFACE, bg: SURFACE, ground: GROUND },
  { group: 'adjacent-marks', name: 'marks: accent vs secondary', fg: '#f3ff5c', bg: '#2b7cff' },
  { group: 'adjacent-marks', name: 'marks: primary vs accent', fg: '#18f0ff', bg: '#f3ff5c' },
]

function main() {
  const results = checkAll(DEMO)
  const failed = results.filter(r => !r.pass).length
  process.stdout.write([
    'datav-kit contrast check — four object groups, raw ratios, no rounding',
    formatReport(results),
    '',
    `${results.length - failed} pass / ${failed} fail`,
    'The failures are deliberate: each group shows one passing and one failing pair.',
    '',
  ].join('\n'))
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href)
  main()
