import type { Page } from '@playwright/test'
import { Buffer } from 'node:buffer'
import { mkdir, readdir, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import process from 'node:process'
import { pathToFileURL } from 'node:url'
import { expect, test } from '@playwright/test'
import { PNG } from 'pngjs'

const directory = path.resolve('skills/datav-kit/assets/examples')
const examples = (await readdir(directory)).filter(name => name.endsWith('.html'))
const base = process.env.VITEPRESS_BASE || '/'
const previewBase = `http://127.0.0.1:4173${base}examples/`

async function openExample(page: Page, url: string) {
  const errors: string[] = []
  page.on('pageerror', error => errors.push(error.message))
  page.on('console', (message) => {
    if (message.type() === 'error')
      errors.push(message.text())
  })
  await page.goto(url)
  await expect(page.locator('#screen')).toHaveAttribute('data-ready', 'true', { timeout: 75_000 })
  await page.evaluate(() => document.fonts.ready)
  // Allow the explicitly bounded chart transition to complete before inspecting pixels.
  await page.waitForTimeout(1200)
  expect(errors).toEqual([])
  return errors
}

async function expectRegistered(page: Page) {
  const missing = await page.evaluate(() => [...document.querySelectorAll('*')]
    .filter(element => element.localName.startsWith('dvk-') && !customElements.get(element.localName))
    .map(element => element.localName))
  expect(missing).toEqual([])
  const invalid = await page.evaluate(async () => {
    const imports = JSON.parse(document.querySelector('script[type="importmap"]')!.textContent!).imports
    const { elementMetadata } = await import(imports['@datav-kit/elements'])
    const result: string[] = []
    for (const element of document.querySelectorAll('*')) {
      if (!element.localName.startsWith('dvk-'))
        continue
      const meta = elementMetadata.find((item: { tagName: string }) => item.tagName === element.localName)
      const allowed = Object.entries(meta.props).flatMap(([key, property]) => {
        const attribute = (property as { attribute?: boolean | string }).attribute
        return attribute === false ? [] : [typeof attribute === 'string' ? attribute : key.replace(/[A-Z]/g, char => `-${char.toLowerCase()}`)]
      })
      for (const attribute of element.getAttributeNames()) {
        if (!allowed.includes(attribute) && !['class', 'id', 'style', 'title', 'role', 'tabindex', 'hidden', 'slot'].includes(attribute) && !/^(?:data|aria)-/.test(attribute))
          result.push(`${element.localName}[${attribute}]`)
      }
    }
    return result
  })
  expect(invalid).toEqual([])
}

async function expectCharts(page: Page) {
  const chartResults = await page.evaluate(async () => {
    const imports = JSON.parse(document.querySelector('script[type="importmap"]')!.textContent!).imports
    const echarts = await import(imports.echarts)
    return [...document.querySelectorAll<HTMLElement>('[data-chart]')].map((element) => {
      const chart = echarts.getInstanceByDom(element)
      const options = chart.getOption()
      const roles = [...getComputedStyle(document.querySelector('#screen')!)]
        .filter(name => name.startsWith('--app-'))
        .map(name => getComputedStyle(document.querySelector('#screen')!).getPropertyValue(name).trim().toLowerCase())
      const marks = [...element.querySelectorAll('path,rect')].filter(mark => ['fill', 'stroke']
        .some(attribute => roles.includes((mark.getAttribute(attribute) || '').toLowerCase())))
      return { id: element.id, width: chart.getWidth(), height: chart.getHeight(), series: options.series.length, coloredMarks: marks.length }
    })
  })
  for (const result of chartResults) {
    expect(result.width, result.id).toBeGreaterThan(100)
    expect(result.height, result.id).toBeGreaterThan(80)
    expect(result.series, result.id).toBeGreaterThan(0)
    expect(result.coloredMarks, `Visible theme-colored marks in ${result.id}`).toBeGreaterThan(2)
  }
}

async function expectCanvasFits(page: Page) {
  const geometry = await page.locator('#screen').evaluate((element) => {
    const rect = element.getBoundingClientRect()
    return { x: rect.x, y: rect.y, right: rect.right, bottom: rect.bottom, ratio: rect.width / rect.height, viewport: [innerWidth, innerHeight] }
  })
  expect(geometry.ratio).toBeCloseTo(16 / 9, 3)
  expect(geometry.x).toBeGreaterThanOrEqual(-1)
  expect(geometry.y).toBeGreaterThanOrEqual(-1)
  expect(geometry.right).toBeLessThanOrEqual(geometry.viewport[0] + 1)
  expect(geometry.bottom).toBeLessThanOrEqual(geometry.viewport[1] + 1)
  const overflow = await page.locator('#screen').evaluate((screen) => {
    const result: string[] = []
    for (const element of screen.querySelectorAll<HTMLElement>('main,aside,section,.channels,.equipment-list,.metrics')) {
      if (element.scrollHeight > element.clientHeight + 3 || element.scrollWidth > element.clientWidth + 3)
        result.push(element.id || element.className || element.tagName)
    }
    return result
  })
  expect(overflow).toEqual([])
}

for (const name of examples) {
  for (const delivery of ['file', 'preview']) {
    test(`${name}: ${delivery} registration, pixels, interaction and data`, async ({ page }) => {
      const url = delivery === 'file' ? pathToFileURL(path.join(directory, name)).href : `${previewBase}${name}`
      const errors = await openExample(page, url)
      await expectRegistered(page)
      await expectCharts(page)
      await expectCanvasFits(page)
      const screen = page.locator('#screen')
      if (name === 'business.html') {
        await page.getByRole('button', { name: '近 7 天' }).click()
        await expect(screen).toHaveAttribute('data-period', 'week')
        await expect(screen).toHaveAttribute('data-total', '603.00')
        await expect(page.locator('#completion')).toHaveText('102.6')
        await expect(page.locator('#channel-list')).not.toContainText('000000000')
      }
      else if (name === 'city.html') {
        await page.getByRole('button', { name: '金融城', exact: true }).click()
        await expect(page.locator('#area-name')).toHaveText('金融城')
        await expect(page.locator('#open-events')).toHaveText('2')
        await expect(screen).toHaveAttribute('data-total', '17010')
        expect(await page.locator('#city-map path.road').count()).toBeGreaterThan(100)
        await expect(page.getByRole('link', { name: /OpenStreetMap/ })).toBeVisible()
      }
      else if (name === 'energy.html') {
        await page.getByRole('button', { name: '储能', exact: true }).click()
        await expect(page.locator('#node-name')).toHaveText('储能充电')
        await expect(page.locator('#node-power')).toHaveText('8.0')
        await expect(page.locator('#deviation')).toHaveText('0.0')
      }
      else if (name === 'industrial.html') {
        await expect(screen).toHaveAttribute('data-renderer', 'webgl')
        await page.getByRole('button', { name: /精加工/ }).click()
        await expect(page.locator('#asset-temperature')).toHaveText('58 °C')
        await expect(page.locator('#asset-name')).toHaveText('精加工')
      }
      expect(errors).toEqual([])
    })
  }

  test(`${name}: all data states and retry`, async ({ page }) => {
    for (const state of ['loading', 'empty', 'failed', 'stale']) {
      await openExample(page, `${previewBase}${name}?state=${state}`)
      await expect(page.locator('#screen')).toHaveAttribute('data-state', state)
      if (state === 'stale') {
        await expect(page.locator('main')).toBeVisible()
        await expect(page.locator('#status')).toContainText('过期')
      }
      else {
        await expect(page.locator('.state-layer')).toBeVisible()
        await expect(page.locator('main')).toBeHidden()
      }
      if (state === 'failed' || state === 'empty') {
        await page.getByRole('button', { name: '重新加载' }).click()
        await expect(page.locator('#screen')).toHaveAttribute('data-state', 'ready')
      }
    }
  })

  test(`${name}: target and preview sizes, reduced motion`, async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' })
    await openExample(page, `${previewBase}${name}`)
    for (const viewport of [{ width: 1920, height: 1080 }, { width: 3840, height: 2160 }, { width: 1366, height: 768 }, { width: 390, height: 844 }]) {
      await page.setViewportSize(viewport)
      await page.waitForTimeout(150)
      await expectCanvasFits(page)
      await expectCharts(page)
      const target = path.resolve('.cache/example-screenshots', `${name.replace('.html', '')}-${viewport.width}.png`)
      await mkdir(path.dirname(target), { recursive: true })
      await page.screenshot({ path: target })
      if (process.env.UPDATE_EXAMPLE_PREVIEWS && viewport.width === 1920) {
        await mkdir(path.join(directory, 'previews'), { recursive: true })
        await page.screenshot({ path: path.join(directory, 'previews', name.replace('.html', '.png')) })
      }
    }
    const animation = await page.evaluate(async () => {
      const imports = JSON.parse(document.querySelector('script[type="importmap"]')!.textContent!).imports
      const echarts = await import(imports.echarts)
      return [...document.querySelectorAll('[data-chart]')].map(element => echarts.getInstanceByDom(element).getOption().animation)
    })
    expect(animation.every(value => value === false)).toBe(true)
    if (name === 'industrial.html') {
      await expect(page.locator('#screen')).toHaveAttribute('data-paused', 'true')
      const frames = await page.locator('#screen').getAttribute('data-frames')
      await page.waitForTimeout(300)
      await expect(page.locator('#screen')).toHaveAttribute('data-frames', frames!)
    }
  })
}

test('industrial: nonempty scene, animation, picking, reset and frame timing', async ({ page }, testInfo) => {
  await openExample(page, `${previewBase}industrial.html`)
  const canvas = page.locator('#scene canvas')
  const extent = await canvas.evaluate((element: HTMLCanvasElement) => {
    const gl = element.getContext('webgl2')!
    const pixels = new Uint8Array(element.width * element.height * 4)
    gl.readPixels(0, 0, element.width, element.height, gl.RGBA, gl.UNSIGNED_BYTE, pixels)
    let count = 0
    let minX = element.width
    let minY = element.height
    let maxX = 0
    let maxY = 0
    for (let y = 0; y < element.height; y++) {
      for (let x = 0; x < element.width; x++) {
        if (pixels[(y * element.width + x) * 4 + 3] > 20) {
          count++
          minX = Math.min(minX, x)
          minY = Math.min(minY, y)
          maxX = Math.max(maxX, x)
          maxY = Math.max(maxY, y)
        }
      }
    }
    return { minX, minY, maxX, maxY, width: element.width, height: element.height, coverage: count / (element.width * element.height) }
  })
  expect(extent.coverage).toBeGreaterThan(0.12)
  expect(extent.minX).toBeGreaterThan(3)
  expect(extent.minY).toBeGreaterThan(3)
  expect(extent.maxX).toBeLessThan(extent.width - 3)
  expect(extent.maxY).toBeLessThan(extent.height - 3)
  const initial = PNG.sync.read(await canvas.screenshot())
  let pixels = 0
  for (let i = 3; i < initial.data.length; i += 4) {
    if (initial.data[i] > 0)
      pixels++
  }
  // Canvas screenshot has an opaque page background: count varied RGB values as well.
  const colors = new Set<string>()
  for (let i = 0; i < initial.data.length; i += 64)
    colors.add(`${initial.data[i]},${initial.data[i + 1]},${initial.data[i + 2]}`)
  expect(pixels).toBeGreaterThan(1000)
  expect(colors.size).toBeGreaterThan(100)
  const before = await canvas.screenshot()
  await page.waitForTimeout(350)
  expect(Buffer.compare(before, await canvas.screenshot())).not.toBe(0)
  await page.getByRole('button', { name: '暂停动态' }).click()
  await expect(page.locator('#screen')).toHaveAttribute('data-paused', 'true')
  const paused = await canvas.screenshot()
  await page.waitForTimeout(200)
  expect(Buffer.compare(paused, await canvas.screenshot())).toBe(0)
  await page.getByRole('button', { name: /精加工/ }).click()
  const bounds = await canvas.boundingBox()
  expect(bounds).not.toBeNull()
  // The assembly roof is visibly located near this point in the initial fitted camera.
  await page.mouse.click(bounds!.x + bounds!.width * 0.46, bounds!.y + bounds!.height * 0.32)
  await expect(page.locator('#screen')).toHaveAttribute('data-asset', 'assembly')
  await page.mouse.move(bounds!.x + bounds!.width / 2, bounds!.y + bounds!.height / 2)
  await page.mouse.down()
  await page.mouse.move(bounds!.x + bounds!.width / 2 + 100, bounds!.y + bounds!.height / 2 + 35, { steps: 8 })
  await page.mouse.up()
  const rotated = await canvas.screenshot()
  await page.getByRole('button', { name: '复位视角' }).click()
  expect(Buffer.compare(rotated, await canvas.screenshot())).not.toBe(0)
  const frameMs = Number(await page.locator('#screen').getAttribute('data-frame-ms'))
  expect(frameMs).toBeGreaterThan(0)
  const timing = { browser: await page.evaluate(() => navigator.userAgent), viewport: page.viewportSize(), meanFrameMs: frameMs, sceneCoverage: extent.coverage }
  await testInfo.attach('frame-timing', { body: JSON.stringify(timing), contentType: 'application/json' })
  await writeFile('.cache/industrial-frame-timing.json', JSON.stringify(timing, null, 2))
  await canvas.evaluate((element: HTMLCanvasElement) => element.getContext('webgl2')!.getExtension('WEBGL_lose_context')!.loseContext())
  await expect(page.locator('#screen')).toHaveAttribute('data-renderer', '2d')
  await page.locator('#fallback').getByRole('button', { name: /能源站/ }).click()
  await expect(page.locator('#asset-online')).toHaveText('8 / 8 台')
})

test('industrial: unavailable WebGL keeps the same equipment data', async ({ page }) => {
  await page.addInitScript(() => {
    const original = HTMLCanvasElement.prototype.getContext
    HTMLCanvasElement.prototype.getContext = function (...args) {
      if (String(args[0]).includes('webgl'))
        return null
      return Reflect.apply(original, this, args)
    }
  })
  // Three.js emits a console diagnostic for an unavailable graphics context.
  await page.goto(`${previewBase}industrial.html`)
  await expect(page.locator('#screen')).toHaveAttribute('data-ready', 'true', { timeout: 75_000 })
  await expect(page.locator('#screen')).toHaveAttribute('data-renderer', '2d')
  await expect(page.locator('#fallback')).toBeVisible()
  await page.locator('#fallback').getByRole('button', { name: /能源站/ }).click()
  await expect(page.locator('#asset-online')).toHaveText('8 / 8 台')
  await expect(page.locator('#asset-temperature')).toHaveText('36 °C')
})

test('minimal starter registers and scales', async ({ page }) => {
  await page.goto(`${previewBase}minimal.html`)
  await expect(page.locator('#screen')).toHaveAttribute('data-ready', 'true')
  await expectRegistered(page)
  await expectCanvasFits(page)
  await page.route('https://cdn.jsdelivr.net/**', route => route.abort())
  await page.reload()
  await expect(page.locator('#screen')).toHaveAttribute('data-ready', 'error')
  await expect(page.getByRole('status')).toContainText('依赖加载失败')
})

test('gallery serves screenshots and downloads the maintained HTML', async ({ page }) => {
  await page.goto(`http://127.0.0.1:4173${base}guide/dashboard-examples`)
  for (const name of examples) {
    const image = page.locator(`.vp-doc img[src$="/${name.replace('.html', '.png')}"]`)
    await expect(image).toBeVisible()
    await expect.poll(() => image.evaluate((element: HTMLImageElement) => element.naturalWidth)).toBe(1920)
    const downloadEvent = page.waitForEvent('download')
    await page.locator(`a[download="${name}"]`).click()
    const download = await downloadEvent
    expect(await readFile((await download.path())!, 'utf8')).toBe(await readFile(path.join(directory, name), 'utf8'))
  }
})
