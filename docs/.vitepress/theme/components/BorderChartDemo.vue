<script setup lang="ts">
import type { ECharts, EChartsOption } from 'echarts'
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'

const props = withDefaults(defineProps<{
  border: string
  colors?: string
  title?: string
  subtitle?: string
  accent?: string
  height?: string
  glowIntensity?: number
}>(), {
  colors: '#36d9ff,#1ecfff,#c9fbff',
  title: 'Realtime Throughput',
  subtitle: 'edge telemetry / last 12 hours',
  accent: '#36d9ff',
  height: '430px',
  glowIntensity: 1,
})

const chartRef = ref<HTMLDivElement>()
let chart: ECharts | undefined
let resizeObserver: ResizeObserver | undefined

const metrics = [
  { label: 'Requests', value: '2.84M', delta: '+18.6%' },
  { label: 'Latency', value: '38ms', delta: '-9.2%' },
  { label: 'Uptime', value: '99.98%', delta: '+0.3%' },
]

const borderProps = computed(() => ({
  class: 'datav-chart-shell',
  colors: props.colors,
  'glow-intensity': props.glowIntensity,
}))

function createOption(): EChartsOption {
  const axisColor = 'rgba(204, 246, 255, 0.52)'
  const splitColor = 'rgba(54, 217, 255, 0.12)'

  return {
    animationDuration: 900,
    grid: {
      top: 34,
      right: 18,
      bottom: 26,
      left: 38,
      containLabel: true,
    },
    tooltip: {
      trigger: 'axis',
      backgroundColor: 'rgba(5, 13, 26, 0.92)',
      borderColor: props.accent,
      textStyle: { color: '#eafcff' },
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: ['00:00', '02:00', '04:00', '06:00', '08:00', '10:00', '12:00', '14:00', '16:00', '18:00', '20:00', '22:00'],
      axisLine: { lineStyle: { color: axisColor } },
      axisTick: { show: false },
      axisLabel: { color: axisColor, fontSize: 11 },
    },
    yAxis: {
      type: 'value',
      min: 0,
      max: 100,
      splitLine: { lineStyle: { color: splitColor } },
      axisLabel: { color: axisColor, fontSize: 11 },
    },
    series: [
      {
        name: 'Ingress',
        type: 'line',
        smooth: true,
        symbol: 'circle',
        symbolSize: 5,
        data: [24, 32, 31, 46, 51, 63, 58, 72, 69, 84, 79, 92],
        lineStyle: { width: 2, color: props.accent },
        itemStyle: { color: props.accent },
        areaStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              { offset: 0, color: 'rgba(54, 217, 255, 0.34)' },
              { offset: 1, color: 'rgba(54, 217, 255, 0.02)' },
            ],
          },
        },
      },
      {
        name: 'Processed',
        type: 'bar',
        barWidth: 8,
        data: [18, 25, 28, 39, 43, 52, 49, 61, 64, 73, 70, 81],
        itemStyle: {
          color: 'rgba(126, 243, 255, 0.42)',
          borderRadius: [3, 3, 0, 0],
        },
      },
    ],
  }
}

onMounted(async () => {
  const echarts = await import('echarts/core')
  const { BarChart, LineChart } = await import('echarts/charts')
  const { GridComponent, TooltipComponent } = await import('echarts/components')
  const { CanvasRenderer } = await import('echarts/renderers')

  echarts.use([BarChart, LineChart, GridComponent, TooltipComponent, CanvasRenderer])

  await nextTick()

  if (!chartRef.value)
    return

  chart = echarts.init(chartRef.value, undefined, { renderer: 'canvas' })
  chart.setOption(createOption())

  resizeObserver = new ResizeObserver(() => chart?.resize())
  resizeObserver.observe(chartRef.value)
})

watch(
  () => [props.accent, props.colors],
  () => chart?.setOption(createOption(), true),
)

onBeforeUnmount(() => {
  resizeObserver?.disconnect()
  chart?.dispose()
})
</script>

<template>
  <div class="datav-chart-demo" :style="{ '--datav-chart-height': height }">
    <component :is="border" v-bind="borderProps">
      <section class="datav-chart-content">
        <header class="datav-chart-header">
          <div>
            <h3>{{ title }}</h3>
            <p>{{ subtitle }}</p>
          </div>
          <div class="datav-chart-status">LIVE</div>
        </header>
        <div class="datav-chart-metrics">
          <div v-for="metric in metrics" :key="metric.label" class="datav-chart-metric">
            <span>{{ metric.label }}</span>
            <strong>{{ metric.value }}</strong>
            <em>{{ metric.delta }}</em>
          </div>
        </div>
        <div ref="chartRef" class="datav-chart"></div>
      </section>
    </component>
  </div>
</template>
