<script setup lang="ts">
const coreMetrics = [
  { label: '实时在园', value: 42860, suffix: ' 人', meta: '舒适承载 71%' },
  { label: '今日入园', value: 86520, suffix: ' 人次', meta: '预约入园 72%' },
]

const sceneNodes = [
  { id: 'A1', name: '北游客中心', value: '7.8k', x: 20, y: 40, tone: 'calm' },
  { id: 'B4', name: '云顶索道', value: '8.4k', x: 42, y: 24, tone: 'warn' },
  { id: 'C2', name: '湖畔栈道', value: '5.1k', x: 72, y: 42, tone: 'calm' },
  { id: 'D6', name: '古镇街区', value: '12.3k', x: 58, y: 70, tone: 'hot' },
  { id: 'E3', name: '峡谷营地', value: '3.7k', x: 30, y: 70, tone: 'quiet' },
]

const capacityBands = [
  { label: '北入口', value: 64, tone: 'calm' },
  { label: '索道', value: 88, tone: 'warn' },
  { label: '古镇', value: 92, tone: 'hot' },
  { label: '湖区', value: 54, tone: 'calm' },
]

const dispatchItems = [
  { title: '古镇南门客流超阈值', meta: '安保 2 组已到位', tag: 'P1', tone: 'hot' },
  { title: '索道上站增派引导员', meta: '预计 14:25 压降', tag: 'P2', tone: 'warn' },
  { title: '湖区投诉工单暂无超时', meta: '近 30 分钟 0 起', tag: 'OK', tone: 'calm' },
]

const serviceCards = [
  { label: '摆渡车周转', value: 86.2, decimals: 1, suffix: '%' },
  { label: '停车余位', value: 1240, suffix: ' 位' },
]

const rhythm = [
  { time: '10:00', value: 44 },
  { time: '11:00', value: 68 },
  { time: '12:00', value: 56 },
  { time: '13:00', value: 61 },
  { time: '14:00', value: 92 },
  { time: '15:00', value: 73 },
  { time: '16:00', value: 81 },
]
</script>

<template>
  <section class="scenic-command-demo" aria-label="景区数据运营大屏产品级演示">
    <div class="scenic-command-demo__intro">
      <span>Product Scenario</span>
      <h2>景区运营数据大屏</h2>
      <p>以中央景区沙盘作为第一视觉，左右两侧承载关键状态和处置队列，配色收敛为深墨蓝、湖青、暖金与少量告警红。</p>
    </div>

    <div class="scenic-command-demo__stage">
      <dvk-fit-screen class="scenic-command-demo__fit" fit-target="host" width="1920" height="1080" mode="contain" align="center center">
        <div class="scenic-screen">
          <header class="scenic-header">
            <section class="scenic-context">
              <span>SCENIC OPERATIONS</span>
              <strong>山海云谷景区 / 指挥调度</strong>
            </section>

            <div class="scenic-title-wrap">
              <dvk-decoration-6 class="scenic-title-rail scenic-title-rail--left" colors="#36d8c6,#8edfe5,#f2c76e" reverse></dvk-decoration-6>
              <section class="scenic-title">
                <span>SMART SCENIC COMMAND</span>
                <h1>山海云谷智慧景区运营总览</h1>
              </section>
              <dvk-decoration-6 class="scenic-title-rail scenic-title-rail--right" colors="#36d8c6,#8edfe5,#f2c76e"></dvk-decoration-6>
            </div>

            <section class="scenic-clock">
              <span>运行日 D20260705</span>
              <strong>14:08:19</strong>
              <em>综合承载 MODERATE</em>
            </section>
          </header>

          <main class="scenic-body">
            <aside class="scenic-left">
              <dvk-border-box-10 class="scenic-panel scenic-panel--hero" colors="#36d8c6,#f2c76e" background-color="rgba(8, 26, 37, 0.78)">
                <section class="hero-metric">
                  <span>当前承载指数</span>
                  <strong><dvk-count-to end-val="71" suffix="%" duration="1500"></dvk-count-to></strong>
                  <p>处于舒适承载区间，古镇片区需要持续分流。</p>
                </section>
              </dvk-border-box-10>

              <section class="metric-stack">
                <article v-for="item in coreMetrics" :key="item.label">
                  <span>{{ item.label }}</span>
                  <strong>
                    <dvk-count-to
                      :end-val="item.value"
                      :decimals="item.decimals || 0"
                      :suffix="item.suffix"
                      separator=","
                      duration="1400"
                    ></dvk-count-to>
                  </strong>
                  <em>{{ item.meta }}</em>
                </article>
              </section>

              <dvk-border-box-15 class="scenic-panel scenic-panel--compact" colors="rgba(210, 232, 235, 0.54),#36d8c6" background-color="rgba(8, 26, 37, 0.58)">
                <section class="capacity-list">
                  <header>
                    <span>Capacity Bands</span>
                    <strong>片区承载</strong>
                  </header>
                  <article v-for="band in capacityBands" :key="band.label" :class="`capacity-row capacity-row--${band.tone}`">
                    <span>{{ band.label }}</span>
                    <div><i :style="{ width: `${band.value}%` }"></i></div>
                    <em>{{ band.value }}%</em>
                  </article>
                </section>
              </dvk-border-box-15>
            </aside>

            <section class="scenic-center">
              <dvk-border-box-10 class="scenic-panel scenic-panel--map" colors="#36d8c6,#f2c76e" background-color="rgba(6, 20, 30, 0.7)">
                <section class="map-shell">
                  <header class="map-heading">
                    <div>
                      <span>Crowd Distribution</span>
                      <strong>景区沙盘与分流路线</strong>
                    </div>
                    <p>主路径：北游客中心 -> 湖畔栈道 -> 峡谷营地</p>
                  </header>

                  <div class="map-canvas">
                    <svg viewBox="0 0 980 620" role="img" aria-label="景区沙盘、湖区、游客动线与热点">
                      <defs>
                        <linearGradient id="scenicRouteSoft" x1="0" y1="0" x2="1" y2="0">
                          <stop offset="0%" stop-color="#36d8c6" stop-opacity="0.22" />
                          <stop offset="52%" stop-color="#d8f3dc" stop-opacity="0.86" />
                          <stop offset="100%" stop-color="#f2c76e" stop-opacity="0.34" />
                        </linearGradient>
                        <linearGradient id="scenicRouteHot" x1="0" y1="0" x2="1" y2="0">
                          <stop offset="0%" stop-color="#f2c76e" stop-opacity="0.2" />
                          <stop offset="62%" stop-color="#f2c76e" stop-opacity="0.9" />
                          <stop offset="100%" stop-color="#ff6b6b" stop-opacity="0.42" />
                        </linearGradient>
                      </defs>
                      <path class="island" d="M98 320 C142 166 326 92 496 132 C638 166 808 146 886 278 C974 428 818 550 596 566 C398 580 224 516 132 412 C94 370 82 344 98 320 Z" />
                      <path class="lake" d="M604 250 C700 220 782 278 774 370 C766 456 650 486 570 426 C504 376 520 278 604 250 Z" />
                      <path class="route route--main" d="M168 356 C284 276 408 248 520 262 C642 278 742 326 850 406" />
                      <path class="route" d="M168 356 C294 454 438 512 584 474 C696 444 754 408 850 406" />
                      <path class="route route--hot" d="M398 168 C448 284 492 392 562 512" />
                      <path class="route route--hot" d="M328 500 C430 428 552 402 694 466" />
                      <circle class="focus-ring" cx="562" cy="512" r="88" />
                      <circle class="focus-ring focus-ring--wide" cx="520" cy="262" r="170" />
                    </svg>

                    <div
                      v-for="node in sceneNodes"
                      :key="node.id"
                      class="map-node"
                      :class="`map-node--${node.tone}`"
                      :style="{ left: `${node.x}%`, top: `${node.y}%` }"
                    >
                      <i></i>
                      <strong>{{ node.id }}</strong>
                      <span>{{ node.name }}</span>
                      <em>{{ node.value }}</em>
                    </div>

                    <section class="map-summary">
                      <span>分流建议</span>
                      <strong>古镇街区向峡谷营地导流</strong>
                      <p>预计 28 分钟内压降 11%，保持索道排队不超过 20 分钟。</p>
                    </section>
                  </div>
                </section>
              </dvk-border-box-10>
            </section>

            <aside class="scenic-right">
              <dvk-border-box-15 class="scenic-panel scenic-panel--notice" colors="rgba(210, 232, 235, 0.54),#36d8c6" background-color="rgba(8, 26, 37, 0.5)">
                <section class="notice-state">
                  <span>Parking Overflow</span>
                  <strong>暂无告警</strong>
                  <p>P1 / P2 / P3 停车场均低于 82%，接驳车周转正常。</p>
                </section>
              </dvk-border-box-15>

              <section class="service-grid">
                <article v-for="item in serviceCards" :key="item.label">
                  <span>{{ item.label }}</span>
                  <strong>
                    <dvk-count-to
                      :end-val="item.value"
                      :decimals="item.decimals || 0"
                      :suffix="item.suffix"
                      separator=","
                      duration="1300"
                    ></dvk-count-to>
                  </strong>
                </article>
              </section>

              <dvk-border-box-15 class="scenic-panel scenic-panel--queue" colors="rgba(210, 232, 235, 0.54),#36d8c6" background-color="rgba(8, 26, 37, 0.62)">
                <section class="dispatch-list">
                  <header>
                    <span>Dispatch Queue</span>
                    <strong>现场联动任务</strong>
                  </header>
                  <article v-for="item in dispatchItems" :key="item.title" :class="`dispatch-card dispatch-card--${item.tone}`">
                    <b>{{ item.tag }}</b>
                    <div>
                      <strong>{{ item.title }}</strong>
                      <span>{{ item.meta }}</span>
                    </div>
                  </article>
                </section>
              </dvk-border-box-15>
            </aside>
          </main>

          <footer class="scenic-rhythm" aria-label="游客分时节奏">
            <article v-for="item in rhythm" :key="item.time" :style="{ '--bar-value': `${item.value}%` }">
              <time>{{ item.time }}</time>
              <div><i></i></div>
              <span>{{ item.value }}%</span>
            </article>
          </footer>
        </div>
      </dvk-fit-screen>
    </div>
  </section>
</template>

<style scoped>
.scenic-command-demo {
  margin: 44px 0 8px;
}

@media (min-width: 1180px) and (max-width: 1520px) {
  .scenic-command-demo {
    max-width: calc(100vw - 380px);
  }
}

.scenic-command-demo__intro {
  max-width: 840px;
  margin-bottom: 18px;
}

.scenic-command-demo__intro span {
  display: block;
  color: #f2c76e;
  font-size: 13px;
  font-weight: 780;
  letter-spacing: 0;
}

.scenic-command-demo__intro h2 {
  margin: 8px 0 0;
  color: var(--vp-c-text-1);
  font-size: 32px;
  line-height: 1.18;
  letter-spacing: 0;
}

.scenic-command-demo__intro p {
  margin: 10px 0 0;
  color: var(--vp-c-text-2);
  font-size: 15px;
  line-height: 1.7;
}

.scenic-command-demo__stage {
  position: relative;
  overflow: hidden;
  width: 100%;
  height: clamp(360px, 62vw, 760px);
}

.scenic-command-demo__fit {
  width: 100%;
  height: 100%;
}

.scenic-screen {
  position: relative;
  width: 100%;
  height: 100%;
  padding: 44px 50px 42px;
  overflow: hidden;
  color: #f4fbfb;
  font-family: Inter, "PingFang SC", "Microsoft YaHei", sans-serif;
  letter-spacing: 0;
  background:
    radial-gradient(circle at 48% 42%, rgba(54, 216, 198, 0.14), transparent 34%),
    linear-gradient(rgba(112, 153, 160, 0.08) 1px, transparent 1px),
    linear-gradient(90deg, rgba(112, 153, 160, 0.06) 1px, transparent 1px),
    linear-gradient(135deg, #071018 0%, #0d1c27 54%, #07131c 100%);
  background-size: auto, 64px 64px, 64px 64px, auto;
}

.scenic-screen *,
.scenic-screen *::before,
.scenic-screen *::after {
  box-sizing: border-box;
}

.scenic-header {
  display: grid;
  grid-template-columns: 350px minmax(0, 1fr) 350px;
  gap: 24px;
  align-items: center;
  height: 104px;
}

.scenic-context,
.scenic-title,
.scenic-clock {
  min-width: 0;
}

.scenic-context {
  display: grid;
  align-content: center;
  gap: 9px;
  height: 100%;
  padding: 16px 18px;
  border-left: 4px solid #f2c76e;
  background: linear-gradient(90deg, rgba(8, 26, 37, 0.64), transparent);
}

.scenic-context strong {
  color: #ffffff;
  font-size: 21px;
  line-height: 1.1;
}

.scenic-title span,
.scenic-context span,
.scenic-clock span,
.map-heading span,
.dispatch-list header span,
.capacity-list header span,
.hero-metric span,
.metric-stack span,
.service-grid span,
.notice-state span {
  color: rgba(205, 229, 232, 0.68);
  font-size: 15px;
  line-height: 1.1;
}

.scenic-title-wrap {
  position: relative;
  display: grid;
  grid-template-columns: minmax(170px, 1fr) auto minmax(170px, 1fr);
  gap: 18px;
  align-items: center;
  min-width: 0;
  height: 100%;
}

.scenic-title {
  display: grid;
  place-items: center;
  min-width: 560px;
  padding: 12px 32px 14px;
  border-top: 1px solid rgba(54, 216, 198, 0.3);
  border-bottom: 1px solid rgba(242, 199, 110, 0.24);
  background: linear-gradient(90deg, transparent, rgba(8, 26, 37, 0.72) 18%, rgba(8, 26, 37, 0.72) 82%, transparent);
}

.scenic-title h1 {
  margin: 8px 0 0;
  color: #ffffff;
  font-size: 40px;
  line-height: 1;
  font-weight: 820;
  letter-spacing: 0;
  text-align: center;
}

.scenic-title-rail {
  width: 100%;
  height: 58px;
  opacity: 0.78;
}

.scenic-clock {
  display: grid;
  justify-items: end;
  gap: 7px;
  padding: 16px 18px;
  border: 1px solid rgba(54, 216, 198, 0.18);
  background: rgba(8, 26, 37, 0.6);
}

.scenic-clock strong {
  color: #f2c76e;
  font-size: 24px;
  line-height: 1;
}

.scenic-clock em {
  color: rgba(244, 251, 251, 0.78);
  font-size: 14px;
  font-style: normal;
}

.scenic-body {
  display: grid;
  grid-template-columns: 340px minmax(0, 1fr) 340px;
  gap: 24px;
  height: 758px;
  min-height: 0;
  margin-top: 24px;
}

.scenic-left,
.scenic-right {
  display: grid;
  min-width: 0;
  min-height: 0;
  gap: 16px;
}

.scenic-left {
  grid-template-rows: 180px 172px minmax(0, 1fr);
}

.scenic-right {
  grid-template-rows: 164px 150px minmax(0, 1fr);
}

.scenic-center,
.scenic-panel {
  min-width: 0;
  min-height: 0;
}

.scenic-panel {
  display: block;
  width: 100%;
  height: 100%;
  color: #f4fbfb;
}

.scenic-panel--hero {
  --dvk-border-box-10-padding: 26px;
}

.scenic-panel--compact,
.scenic-panel--queue,
.scenic-panel--notice {
  --dvk-border-box-15-padding: 22px;
}

.scenic-panel--map {
  --dvk-border-box-10-padding: 28px;
}

.hero-metric {
  display: grid;
  align-content: center;
  height: 100%;
}

.hero-metric strong {
  display: block;
  margin: 8px 0;
  color: #ffffff;
  font-size: 52px;
  line-height: 1;
}

.hero-metric dvk-count-to {
  --dvk-count-to-font-size: 52px;
  --dvk-count-to-font-weight: 820;
  --dvk-count-to-affix-font-size: 0.42em;
  --dvk-count-to-affix-color: #f2c76e;
}

.hero-metric p {
  margin: 0;
  color: rgba(205, 229, 232, 0.72);
  font-size: 15px;
  line-height: 1.45;
}

.metric-stack,
.service-grid {
  display: grid;
  gap: 10px;
  min-height: 0;
  overflow: hidden;
}

.metric-stack {
  grid-template-rows: repeat(2, minmax(0, 1fr));
}

.metric-stack article,
.service-grid article {
  display: grid;
  align-content: center;
  min-width: 0;
  min-height: 0;
  padding: 14px 16px;
  border: 1px solid rgba(54, 216, 198, 0.14);
  background: rgba(8, 26, 37, 0.54);
}

.metric-stack strong,
.service-grid strong {
  display: block;
  margin: 7px 0 5px;
  color: #ffffff;
  font-size: 25px;
  line-height: 1;
}

.metric-stack dvk-count-to,
.service-grid dvk-count-to {
  --dvk-count-to-font-size: 25px;
  --dvk-count-to-font-weight: 800;
  --dvk-count-to-affix-font-size: 0.55em;
  --dvk-count-to-affix-color: rgba(205, 229, 232, 0.74);
}

.metric-stack em {
  color: rgba(205, 229, 232, 0.62);
  font-size: 12px;
  font-style: normal;
  line-height: 1.15;
}

.capacity-list,
.dispatch-list,
.notice-state,
.map-shell {
  display: grid;
  height: 100%;
  min-height: 0;
}

.capacity-list {
  grid-template-rows: auto repeat(4, minmax(0, 1fr));
  gap: 10px;
}

.capacity-list header,
.dispatch-list header,
.map-heading {
  display: flex;
  justify-content: space-between;
  gap: 16px;
  min-width: 0;
}

.capacity-list header strong,
.dispatch-list header strong,
.map-heading strong {
  color: #ffffff;
  font-size: 22px;
  line-height: 1.1;
}

.capacity-row {
  display: grid;
  grid-template-columns: 58px minmax(0, 1fr) 42px;
  gap: 10px;
  align-items: center;
}

.capacity-row span,
.capacity-row em {
  color: rgba(205, 229, 232, 0.68);
  font-size: 13px;
  font-style: normal;
}

.capacity-row div {
  height: 8px;
  overflow: hidden;
  background: rgba(205, 229, 232, 0.13);
}

.capacity-row i {
  display: block;
  height: 100%;
  background: #36d8c6;
}

.capacity-row--warn i {
  background: #f2c76e;
}

.capacity-row--hot i {
  background: #ff6b6b;
}

.map-shell {
  grid-template-rows: auto minmax(0, 1fr);
  gap: 18px;
}

.map-heading p {
  margin: 0;
  align-self: end;
  color: rgba(205, 229, 232, 0.66);
  font-size: 14px;
}

.map-canvas {
  position: relative;
  min-height: 0;
  overflow: hidden;
  border: 1px solid rgba(54, 216, 198, 0.14);
  background:
    radial-gradient(circle at 58% 48%, rgba(54, 216, 198, 0.16), transparent 24%),
    linear-gradient(rgba(112, 153, 160, 0.08) 1px, transparent 1px),
    linear-gradient(90deg, rgba(112, 153, 160, 0.06) 1px, transparent 1px),
    #071923;
  background-size: auto, 42px 42px, 42px 42px, auto;
}

.map-canvas svg {
  position: absolute;
  inset: 32px 38px 28px;
  width: calc(100% - 76px);
  height: calc(100% - 60px);
}

.island {
  fill: rgba(54, 216, 198, 0.08);
  stroke: rgba(216, 243, 220, 0.3);
  stroke-width: 2;
}

.lake {
  fill: rgba(54, 216, 198, 0.12);
  stroke: rgba(54, 216, 198, 0.36);
  stroke-width: 2;
}

.route {
  fill: none;
  stroke: url("#scenicRouteSoft");
  stroke-width: 4;
  stroke-linecap: round;
  stroke-dasharray: 10 13;
}

.route--main {
  stroke-width: 7;
  stroke-dasharray: none;
}

.route--hot {
  stroke: url("#scenicRouteHot");
  stroke-width: 6;
}

.focus-ring {
  fill: none;
  stroke: rgba(242, 199, 110, 0.3);
  stroke-width: 2;
  stroke-dasharray: 7 10;
}

.focus-ring--wide {
  stroke: rgba(54, 216, 198, 0.22);
}

.map-node {
  position: absolute;
  display: grid;
  min-width: 94px;
  transform: translate(-50%, -50%);
  justify-items: center;
  gap: 4px;
  pointer-events: none;
}

.map-node i {
  display: block;
  width: 14px;
  height: 14px;
  border: 2px solid #36d8c6;
  background: rgba(54, 216, 198, 0.22);
  box-shadow: 0 0 16px rgba(54, 216, 198, 0.55);
  transform: rotate(45deg);
}

.map-node strong {
  color: #ffffff;
  font-size: 17px;
  line-height: 1;
}

.map-node span,
.map-node em {
  color: rgba(205, 229, 232, 0.72);
  font-size: 12px;
  font-style: normal;
  line-height: 1;
}

.map-node--warn i {
  border-color: #f2c76e;
  background: rgba(242, 199, 110, 0.24);
  box-shadow: 0 0 16px rgba(242, 199, 110, 0.52);
}

.map-node--hot i {
  border-color: #ff6b6b;
  background: rgba(255, 107, 107, 0.22);
  box-shadow: 0 0 16px rgba(255, 107, 107, 0.54);
}

.map-node--quiet i {
  border-color: rgba(205, 229, 232, 0.72);
}

.map-summary {
  position: absolute;
  right: 30px;
  bottom: 28px;
  width: 360px;
  padding: 16px 18px;
  border: 1px solid rgba(242, 199, 110, 0.24);
  background: rgba(6, 20, 30, 0.82);
}

.map-summary span {
  color: rgba(205, 229, 232, 0.68);
  font-size: 13px;
}

.map-summary strong {
  display: block;
  margin: 7px 0;
  color: #f2c76e;
  font-size: 20px;
}

.map-summary p,
.notice-state p {
  margin: 0;
  color: rgba(205, 229, 232, 0.66);
  font-size: 14px;
  line-height: 1.5;
}

.dispatch-list {
  grid-template-rows: auto repeat(3, minmax(0, 1fr));
  gap: 14px;
}

.dispatch-card {
  display: grid;
  grid-template-columns: 46px minmax(0, 1fr);
  gap: 12px;
  align-items: center;
  min-width: 0;
  padding: 14px;
  border-left: 3px solid #36d8c6;
  background: rgba(6, 20, 30, 0.56);
}

.dispatch-card b {
  color: #36d8c6;
  font-size: 18px;
}

.dispatch-card strong {
  display: block;
  color: #ffffff;
  font-size: 16px;
  line-height: 1.2;
}

.dispatch-card span {
  display: block;
  margin-top: 5px;
  color: rgba(205, 229, 232, 0.64);
  font-size: 13px;
}

.dispatch-card--warn {
  border-left-color: #f2c76e;
}

.dispatch-card--warn b {
  color: #f2c76e;
}

.dispatch-card--hot {
  border-left-color: #ff6b6b;
}

.dispatch-card--hot b {
  color: #ff6b6b;
}

.service-grid {
  grid-template-columns: 1fr;
  grid-template-rows: repeat(2, minmax(0, 1fr));
}

.notice-state {
  align-content: center;
  gap: 8px;
  padding: 2px 0;
}

.notice-state strong {
  color: #36d8c6;
  font-size: 28px;
  line-height: 1;
}

.scenic-rhythm {
  display: grid;
  grid-template-columns: repeat(7, minmax(0, 1fr));
  gap: 12px;
  height: 110px;
  margin-top: 24px;
}

.scenic-rhythm article {
  display: grid;
  grid-template-rows: auto minmax(0, 1fr) auto;
  gap: 8px;
  min-width: 0;
}

.scenic-rhythm time,
.scenic-rhythm span {
  color: rgba(205, 229, 232, 0.7);
  font-size: 14px;
  line-height: 1;
}

.scenic-rhythm div {
  position: relative;
  overflow: hidden;
  border: 1px solid rgba(54, 216, 198, 0.14);
  background: rgba(8, 26, 37, 0.6);
}

.scenic-rhythm i {
  position: absolute;
  right: 0;
  bottom: 0;
  left: 0;
  display: block;
  height: var(--bar-value);
  background: linear-gradient(180deg, #f2c76e, #36d8c6);
}

@media (max-width: 960px) {
  .scenic-command-demo__intro h2 {
    font-size: 28px;
  }

  .scenic-command-demo__stage {
    height: clamp(360px, 72vw, 680px);
  }
}
</style>
