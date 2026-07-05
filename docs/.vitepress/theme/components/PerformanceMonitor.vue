<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'

interface MemoryInfo {
  jsHeapSizeLimit: number
  totalJSHeapSize: number
  usedJSHeapSize: number
}

interface PerformanceWithMemory extends Performance {
  memory?: MemoryInfo
}

interface RenderCounts {
  animations: number
  canvas: number
  datav: number
  nodes: number
  playingVideos: number
  svg: number
  videos: number
  visibleVideos: number
}

const storageKey = 'datav-kit-performance-monitor-collapsed'
const sampleWindow = 1000
const frameBudget = 1000 / 60

const collapsed = ref(false)
const fps = ref(0)
const pressure = ref(0)
const longTaskCount = ref(0)
const longTaskMs = ref(0)
const heapLabel = ref('n/a')
const heapPercent = ref<number | null>(null)
const counts = ref<RenderCounts>({
  animations: 0,
  canvas: 0,
  datav: 0,
  nodes: 0,
  playingVideos: 0,
  svg: 0,
  videos: 0,
  visibleVideos: 0,
})

let animationFrame = 0
let frameCount = 0
let longTasksInWindow = 0
let longTaskTimeInWindow = 0
let observer: PerformanceObserver | undefined
let sampleStartedAt = 0

const pressureTone = computed(() => {
  if (pressure.value >= 70)
    return 'danger'

  if (pressure.value >= 38)
    return 'warn'

  return 'ok'
})

function toggleCollapsed(): void {
  collapsed.value = !collapsed.value

  try {
    window.localStorage.setItem(storageKey, String(collapsed.value))
  }
  catch {
    // Ignore storage failures; the monitor should keep running.
  }
}

function formatBytes(value: number): string {
  if (!Number.isFinite(value))
    return 'n/a'

  const mib = value / 1024 / 1024

  if (mib >= 1024)
    return `${(mib / 1024).toFixed(1)} GiB`

  return `${mib.toFixed(0)} MiB`
}

function resolveHeap(): void {
  const memory = (performance as PerformanceWithMemory).memory

  if (!memory) {
    heapLabel.value = 'n/a'
    heapPercent.value = null
    return
  }

  heapLabel.value = `${formatBytes(memory.usedJSHeapSize)} / ${formatBytes(memory.jsHeapSizeLimit)}`
  heapPercent.value = Math.round(memory.usedJSHeapSize / memory.jsHeapSizeLimit * 100)
}

function isVideoVisible(video: HTMLVideoElement): boolean {
  const rect = video.getBoundingClientRect()

  return rect.width > 0
    && rect.height > 0
    && rect.bottom >= 0
    && rect.right >= 0
    && rect.top <= window.innerHeight
    && rect.left <= window.innerWidth
}

function collectTreeElements(root: ParentNode): Element[] {
  const elements: Element[] = []
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_ELEMENT)
  let node = walker.nextNode()

  while (node) {
    elements.push(node as Element)
    node = walker.nextNode()
  }

  return elements
}

function collectElements(): Element[] {
  const roots: ParentNode[] = [document.body]
  const elements: Element[] = []

  for (let index = 0; index < roots.length; index += 1) {
    const rootElements = collectTreeElements(roots[index])

    elements.push(...rootElements)

    rootElements.forEach((element) => {
      if (element.shadowRoot)
        roots.push(element.shadowRoot)
    })
  }

  return elements
}

function collectRenderCounts(): void {
  const elements = collectElements()
  let animations = 0
  let canvas = 0
  let datav = 0
  let svg = 0
  let videos = 0
  let visibleVideos = 0
  let playingVideos = 0

  elements.forEach((element) => {
    const tagName = element.localName.toLowerCase()

    if (tagName === 'animate' || tagName === 'animatetransform')
      animations += 1
    else if (tagName === 'canvas')
      canvas += 1
    else if (tagName === 'svg')
      svg += 1
    else if (tagName === 'video') {
      videos += 1

      const video = element as HTMLVideoElement
      if (isVideoVisible(video))
        visibleVideos += 1

      if (!video.paused && !video.ended)
        playingVideos += 1
    }

    if (tagName.startsWith('dvk-'))
      datav += 1
  })

  counts.value = {
    animations,
    canvas,
    datav,
    nodes: elements.length,
    playingVideos,
    svg,
    videos,
    visibleVideos,
  }
}

function collectSample(now: number): void {
  const elapsed = Math.max(now - sampleStartedAt, 1)
  const expectedFrames = elapsed / frameBudget
  const droppedRatio = Math.max((expectedFrames - frameCount) / expectedFrames, 0)
  const framePressure = droppedRatio * 100
  const longTaskPressure = longTaskTimeInWindow / elapsed * 100

  fps.value = Math.round(frameCount / elapsed * 1000)
  pressure.value = Math.round(Math.min(Math.max(framePressure + longTaskPressure, 0), 100))
  longTaskCount.value = longTasksInWindow
  longTaskMs.value = Math.round(longTaskTimeInWindow)

  resolveHeap()
  collectRenderCounts()

  frameCount = 0
  longTasksInWindow = 0
  longTaskTimeInWindow = 0
  sampleStartedAt = now
}

function tick(now: number): void {
  frameCount += 1

  if (sampleStartedAt === 0)
    sampleStartedAt = now

  if (now - sampleStartedAt >= sampleWindow)
    collectSample(now)

  animationFrame = window.requestAnimationFrame(tick)
}

onMounted(() => {
  try {
    collapsed.value = window.localStorage.getItem(storageKey) === 'true'
  }
  catch {
    collapsed.value = false
  }

  if (
    'PerformanceObserver' in window
    && PerformanceObserver.supportedEntryTypes?.includes('longtask')
  ) {
    observer = new PerformanceObserver((list) => {
      list.getEntries().forEach((entry) => {
        longTasksInWindow += 1
        longTaskTimeInWindow += entry.duration
      })
    })
    observer.observe({ entryTypes: ['longtask'] })
  }

  collectRenderCounts()

  animationFrame = window.requestAnimationFrame(tick)
})

onBeforeUnmount(() => {
  if (animationFrame)
    window.cancelAnimationFrame(animationFrame)

  observer?.disconnect()
})
</script>

<template>
  <aside class="performance-monitor" :class="{ 'performance-monitor--collapsed': collapsed }" aria-label="Runtime performance monitor">
    <header class="performance-monitor__header">
      <div>
        <span>Runtime</span>
        <strong>{{ fps }} FPS</strong>
      </div>
      <button type="button" :aria-label="collapsed ? 'Expand performance monitor' : 'Collapse performance monitor'" @click="toggleCollapsed">
        {{ collapsed ? '+' : '-' }}
      </button>
    </header>

    <div class="performance-monitor__pressure" :data-tone="pressureTone">
      <span>pressure</span>
      <strong>{{ pressure }}%</strong>
    </div>

    <dl v-if="!collapsed" class="performance-monitor__grid">
      <div>
        <dt>long tasks</dt>
        <dd>{{ longTaskCount }} / {{ longTaskMs }}ms</dd>
      </div>
      <div>
        <dt>heap</dt>
        <dd>{{ heapLabel }}<span v-if="heapPercent !== null"> · {{ heapPercent }}%</span></dd>
      </div>
      <div>
        <dt>nodes</dt>
        <dd>{{ counts.nodes }}</dd>
      </div>
      <div>
        <dt>dvk</dt>
        <dd>{{ counts.datav }}</dd>
      </div>
      <div>
        <dt>svg / anim</dt>
        <dd>{{ counts.svg }} / {{ counts.animations }}</dd>
      </div>
      <div>
        <dt>video</dt>
        <dd>{{ counts.playingVideos }} playing · {{ counts.visibleVideos }}/{{ counts.videos }} visible</dd>
      </div>
      <div>
        <dt>canvas</dt>
        <dd>{{ counts.canvas }}</dd>
      </div>
    </dl>
  </aside>
</template>

<style scoped>
.performance-monitor {
  position: fixed;
  right: 14px;
  bottom: 14px;
  z-index: 2147483000;
  width: min(260px, calc(100vw - 28px));
  padding: 10px;
  border: 1px solid rgba(110, 215, 232, 0.28);
  border-radius: 8px;
  color: #e9fbff;
  font-size: 12px;
  line-height: 1.35;
  background: rgba(2, 10, 20, 0.92);
  box-shadow: 0 18px 48px rgba(0, 0, 0, 0.32);
  backdrop-filter: blur(12px);
}

.performance-monitor--collapsed {
  width: 170px;
}

.performance-monitor__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
}

.performance-monitor__header span,
.performance-monitor__pressure span,
.performance-monitor dt {
  color: rgba(223, 244, 248, 0.58);
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
}

.performance-monitor__header strong {
  display: block;
  margin-top: 2px;
  color: #ffffff;
  font-size: 18px;
  line-height: 1;
}

.performance-monitor button {
  width: 28px;
  height: 28px;
  border: 1px solid rgba(110, 215, 232, 0.28);
  border-radius: 6px;
  color: #dff8ff;
  font-size: 16px;
  line-height: 1;
  background: rgba(14, 165, 183, 0.14);
  cursor: pointer;
}

.performance-monitor button:hover {
  border-color: rgba(110, 215, 232, 0.58);
  background: rgba(14, 165, 183, 0.24);
}

.performance-monitor__pressure {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  margin-top: 9px;
  padding: 8px;
  border: 1px solid rgba(82, 240, 181, 0.18);
  border-radius: 6px;
  background: rgba(82, 240, 181, 0.08);
}

.performance-monitor__pressure[data-tone="warn"] {
  border-color: rgba(255, 209, 102, 0.28);
  background: rgba(255, 209, 102, 0.1);
}

.performance-monitor__pressure[data-tone="danger"] {
  border-color: rgba(255, 102, 140, 0.34);
  background: rgba(255, 102, 140, 0.12);
}

.performance-monitor__pressure strong {
  color: #ffffff;
  font-size: 16px;
}

.performance-monitor__grid {
  display: grid;
  gap: 7px;
  margin: 10px 0 0;
}

.performance-monitor__grid div {
  display: grid;
  grid-template-columns: 74px minmax(0, 1fr);
  gap: 8px;
  min-width: 0;
}

.performance-monitor dt,
.performance-monitor dd {
  margin: 0;
}

.performance-monitor dd {
  min-width: 0;
  overflow: hidden;
  color: #f5fdff;
  text-align: right;
  text-overflow: ellipsis;
  white-space: nowrap;
}

@media (max-width: 640px) {
  .performance-monitor {
    right: 10px;
    bottom: 10px;
  }
}
</style>
