import type { SvgVideoRasterFrame } from './svg-video-rasterizer'

export interface SvgPngSpriteRasterizeOptions {
  width: number
  height: number
  frameCount: number
  columns: number
  rows: number
  frameDelay: number
  prepareFrame?: (svg: SVGSVGElement, frame: SvgVideoRasterFrame) => void
  strokeWidthScale?: number
}

export interface SvgPngSpriteRasterizeResult {
  url: string
  frameCount: number
  columns: number
  rows: number
  frameDelay: number
}

export async function rasterizeSvgToPngSprite(
  sourceSvg: SVGSVGElement,
  options: SvgPngSpriteRasterizeOptions,
): Promise<SvgPngSpriteRasterizeResult> {
  if (typeof document === 'undefined' || typeof XMLSerializer === 'undefined')
    throw new Error('SVG PNG sprite rasterization requires a browser DOM.')

  const atlas = document.createElement('canvas')
  atlas.width = options.width * options.columns
  atlas.height = options.height * options.rows

  const atlasContext = atlas.getContext('2d')
  if (!atlasContext)
    throw new Error('Canvas 2D context is unavailable.')

  const frameCanvas = document.createElement('canvas')
  frameCanvas.width = options.width
  frameCanvas.height = options.height

  const frameContext = frameCanvas.getContext('2d')
  if (!frameContext)
    throw new Error('Canvas 2D context is unavailable.')

  atlasContext.clearRect(0, 0, atlas.width, atlas.height)

  for (let index = 0; index < options.frameCount; index += 1) {
    const frame = {
      index,
      elapsed: index * options.frameDelay / 1000,
      progress: index / options.frameCount,
    }
    const svg = prepareSvgClone(sourceSvg, options, frame)

    await drawSvgFrame(frameContext, svg, options.width, options.height)

    const column = index % options.columns
    const row = Math.floor(index / options.columns)
    atlasContext.drawImage(frameCanvas, column * options.width, row * options.height)
    await delay(0)
  }

  return {
    url: await canvasToPngUrl(atlas),
    frameCount: options.frameCount,
    columns: options.columns,
    rows: options.rows,
    frameDelay: options.frameDelay,
  }
}

function prepareSvgClone(
  sourceSvg: SVGSVGElement,
  options: SvgPngSpriteRasterizeOptions,
  frame: SvgVideoRasterFrame,
): SVGSVGElement {
  const svg = sourceSvg.cloneNode(true) as SVGSVGElement

  svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg')
  svg.setAttribute('width', String(options.width))
  svg.setAttribute('height', String(options.height))
  svg.setAttribute('viewBox', sourceSvg.getAttribute('viewBox') || `0 0 ${options.width} ${options.height}`)
  svg.setAttribute('preserveAspectRatio', sourceSvg.getAttribute('preserveAspectRatio') || 'xMidYMid meet')

  injectStandaloneStyle(svg)
  options.prepareFrame?.(svg, frame)
  scaleStrokeWidths(svg, options.strokeWidthScale ?? 1)

  return svg
}

function injectStandaloneStyle(svg: SVGSVGElement): void {
  const style = document.createElementNS('http://www.w3.org/2000/svg', 'style')
  style.textContent = `
    path, circle, line, rect, ellipse, polygon {
      vector-effect: non-scaling-stroke;
    }
  `
  svg.prepend(style)
}

function scaleStrokeWidths(svg: SVGSVGElement, scale: number): void {
  if (scale === 1)
    return

  svg.querySelectorAll('[stroke-width]').forEach((node) => {
    const width = Number.parseFloat(node.getAttribute('stroke-width') || '')

    if (Number.isFinite(width))
      node.setAttribute('stroke-width', String(roundTo(width * scale, 4)))
  })
}

async function drawSvgFrame(
  context: CanvasRenderingContext2D,
  svg: SVGSVGElement,
  width: number,
  height: number,
): Promise<void> {
  const image = await loadSvgImage(svg)

  context.clearRect(0, 0, width, height)
  context.drawImage(image, 0, 0, width, height)
}

async function loadSvgImage(svg: SVGSVGElement): Promise<HTMLImageElement> {
  const serializer = new XMLSerializer()
  const source = serializer.serializeToString(svg)
  const url = URL.createObjectURL(new Blob([source], { type: 'image/svg+xml;charset=utf-8' }))

  try {
    return await loadImage(url)
  }
  finally {
    URL.revokeObjectURL(url)
  }
}

function loadImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image()

    image.onload = () => resolve(image)
    image.onerror = () => reject(new Error('Unable to decode rasterized SVG frame.'))
    image.src = url
  })
}

function canvasToPngUrl(canvas: HTMLCanvasElement): Promise<string> {
  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (!blob) {
        reject(new Error('Unable to encode PNG sprite.'))
        return
      }

      resolve(URL.createObjectURL(blob))
    }, 'image/png')
  })
}

function delay(ms: number): Promise<void> {
  return new Promise(resolve => window.setTimeout(resolve, ms))
}

function roundTo(value: number, precision: number): number {
  const multiplier = 10 ** precision

  return Math.round(value * multiplier) / multiplier
}
