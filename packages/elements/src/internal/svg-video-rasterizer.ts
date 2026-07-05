export interface SvgVideoRasterFrame {
  index: number
  elapsed: number
  progress: number
}

export interface SvgVideoRasterizeOptions {
  width: number
  height: number
  frameCount: number
  frameDelay: number
  prepareFrame?: (svg: SVGSVGElement, frame: SvgVideoRasterFrame) => void
  strokeWidthScale?: number
  videoBitsPerSecond?: number
}

const webmMimeTypes = [
  'video/webm;codecs=vp9',
  'video/webm;codecs=vp8',
  'video/webm',
]

export async function rasterizeSvgToVideo(sourceSvg: SVGSVGElement, options: SvgVideoRasterizeOptions): Promise<string> {
  if (typeof document === 'undefined' || typeof XMLSerializer === 'undefined')
    throw new Error('SVG video rasterization requires a browser DOM.')

  const mimeType = resolveMediaRecorderMimeType()
  if (!mimeType)
    throw new Error('MediaRecorder WebM encoding is unavailable.')

  const canvas = document.createElement('canvas')
  canvas.width = options.width
  canvas.height = options.height

  const context = canvas.getContext('2d')
  if (!context)
    throw new Error('Canvas 2D context is unavailable.')

  const stream = canvas.captureStream(0)
  const [track] = stream.getVideoTracks() as CanvasCaptureMediaStreamTrack[]
  const recorder = new MediaRecorder(stream, {
    mimeType,
    videoBitsPerSecond: options.videoBitsPerSecond,
  })
  const chunks: Blob[] = []

  recorder.ondataavailable = (event) => {
    if (event.data.size > 0)
      chunks.push(event.data)
  }

  const stopped = new Promise<void>((resolve, reject) => {
    recorder.onstop = () => resolve()
    recorder.onerror = () => reject(new Error('Unable to record rasterized SVG video.'))
  })

  recorder.start()

  try {
    for (let index = 0; index < options.frameCount; index += 1) {
      const frame = {
        index,
        elapsed: index * options.frameDelay / 1000,
        progress: index / options.frameCount,
      }
      const svg = prepareSvgClone(sourceSvg, options, frame)

      await drawSvgFrame(context, svg, options.width, options.height)

      track?.requestFrame()
      await delay(options.frameDelay)
    }
  }
  finally {
    recorder.stop()
    stream.getTracks().forEach(item => item.stop())
  }

  await stopped

  return URL.createObjectURL(new Blob(chunks, { type: mimeType }))
}

function resolveMediaRecorderMimeType(): string {
  if (typeof MediaRecorder === 'undefined')
    return ''

  return webmMimeTypes.find(type => MediaRecorder.isTypeSupported(type)) ?? ''
}

function prepareSvgClone(sourceSvg: SVGSVGElement, options: SvgVideoRasterizeOptions, frame: SvgVideoRasterFrame): SVGSVGElement {
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

function delay(ms: number): Promise<void> {
  return new Promise(resolve => window.setTimeout(resolve, ms))
}

function roundTo(value: number, precision: number): number {
  const multiplier = 10 ** precision

  return Math.round(value * multiplier) / multiplier
}
