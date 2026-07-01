<script setup lang="ts">
const kpis = [
  { label: '今日计划航班', value: 2184, suffix: ' 架次', meta: '已执行 1,426', tone: 'blue' },
  { label: '放行正常率', value: 96.8, decimals: 1, suffix: '%', meta: '同比 +1.6%', tone: 'green' },
  { label: '在途航班', value: 732, suffix: ' 架', meta: '高密度航路 18', tone: 'cyan' },
  { label: '重点保障', value: 46, suffix: ' 班', meta: 'VIP / 中转 / 医疗', tone: 'amber' },
  { label: '旅客流量', value: 238500, suffix: ' 人', meta: '值机完成 91.4%', tone: 'violet' },
]

const operationWaves = [
  { time: '06:00-10:00', name: '早高峰离港', planned: 482, finished: 456, rate: 94 },
  { time: '10:00-14:00', name: '午间中转', planned: 528, finished: 503, rate: 95 },
  { time: '14:00-18:00', name: '雷雨绕飞窗口', planned: 614, finished: 566, rate: 92 },
  { time: '18:00-22:00', name: '晚高峰进港', planned: 560, finished: 412, rate: 74 },
]

const airportPressure = [
  { code: 'PVG', city: '上海浦东', value: 86, status: '机位紧平衡' },
  { code: 'PEK', city: '北京首都', value: 78, status: '放行稳定' },
]

const riskEvents = [
  { level: 'P1', title: '华南雷暴影响 23 条航路', owner: '运控 / 签派', eta: '14:40', tone: 'danger' },
  { level: 'P2', title: '浦东 T2 近机位周转承压', owner: '地服 / 机场', eta: '15:10', tone: 'warning' },
  { level: 'P3', title: '京津冀低云区持续监控', owner: '气象 / AOC', eta: '16:00', tone: 'normal' },
]

const resourceHealth = [
  { label: '机务放行', value: 94.3 },
  { label: '廊桥可用', value: 76.0 },
  { label: '行李追踪', value: 99.1 },
]

const timeline = [
  { time: '12:00', label: '离港波峰', value: 72 },
  { time: '13:00', label: '航路放行', value: 88 },
  { time: '14:00', label: '天气绕飞', value: 64 },
  { time: '15:00', label: '到港压降', value: 79 },
  { time: '16:00', label: '机位回收', value: 91 },
]

const hubs = [
  { code: 'PEK', name: '北京', x: 65, y: 28 },
  { code: 'PVG', name: '上海', x: 72, y: 54 },
  { code: 'CAN', name: '广州', x: 54, y: 75 },
  { code: 'CTU', name: '成都', x: 32, y: 62 },
  { code: 'URC', name: '乌鲁木齐', x: 17, y: 28 },
]

const flights = [
  { id: 'MU583', x: 58, y: 45, rotate: 32, tone: 'green' },
  { id: 'CA981', x: 44, y: 36, rotate: -18, tone: 'cyan' },
  { id: 'CZ327', x: 63, y: 66, rotate: 74, tone: 'amber' },
  { id: 'HO1295', x: 35, y: 55, rotate: 12, tone: 'blue' },
]
</script>

<template>
  <section class="aviation-command-demo" aria-label="航空数据监控中台产品级演示">
    <div class="aviation-command-demo__intro">
      <span>Product Scenario</span>
      <h2>航空运行数据中台完整大屏</h2>
      <p>以航空 AOC 为业务场景，使用少量 DataV Kit 组件搭建 1920 x 1280 固定设计画布，展示企业级数据中台的整体表达能力。</p>
    </div>

    <div class="aviation-command-demo__stage">
      <dvk-fit-screen class="aviation-command-demo__fit" fit-target="host" width="1920" height="1280" mode="contain" align="center center">
        <div class="aviation-screen">
          <div class="screen-shell">
            <div class="screen-layout">
              <header class="screen-header">
                <div class="header-status">
                  <span>运行日 D20260630</span>
                  <strong>华东主控 / AOC 联席</strong>
                </div>

                <div class="screen-title">
                  <dvk-decoration-9 class="title-ribbon title-ribbon--left" colors="#6ed7e8,#2f8cff,#52f0b5" reverse></dvk-decoration-9>
                  <dvk-decoration-9 class="title-ribbon title-ribbon--right" colors="#6ed7e8,#2f8cff,#52f0b5"></dvk-decoration-9>
                  <div class="title-copy">
                    <span>AERO OPERATIONS COMMAND CENTER</span>
                    <h1>航空运行数据中台</h1>
                  </div>
                </div>

                <div class="header-status header-status--right">
                  <span>北京时间 14:28:36</span>
                  <strong>全域协同状态 NORMAL</strong>
                </div>
              </header>

              <section class="kpi-strip" aria-label="核心运行指标">
                <article v-for="item in kpis" :key="item.label" class="kpi-card" :class="`kpi-card--${item.tone}`">
                  <span>{{ item.label }}</span>
                  <strong>
                    <dvk-count-to
                      :end-val="item.value"
                      :decimals="item.decimals || 0"
                      :suffix="item.suffix"
                      separator=","
                      duration="1600"
                    ></dvk-count-to>
                  </strong>
                  <em>{{ item.meta }}</em>
                </article>
              </section>

              <main class="dashboard-grid">
                <aside class="left-column">
                  <dvk-border-box-13 class="product-panel aviation-border-panel" colors="#168cff,#6ed7e8,#52f0b5" glow-intensity="0.82">
                    <section class="panel-inner">
                      <header class="panel-heading">
                        <div>
                          <p>Flight Waves</p>
                          <h3>运行波次执行</h3>
                        </div>
                        <span>4 WINDOWS</span>
                      </header>

                      <div class="wave-list">
                        <article v-for="wave in operationWaves" :key="wave.time" class="wave-row">
                          <div class="wave-row__main">
                            <time>{{ wave.time }}</time>
                            <strong>{{ wave.name }}</strong>
                          </div>
                          <div class="wave-row__numbers">
                            <span>计划 {{ wave.planned }}</span>
                            <span>完成 {{ wave.finished }}</span>
                          </div>
                          <div class="progress-line" :style="{ '--bar-value': `${wave.rate}%` }">
                            <i></i>
                          </div>
                        </article>
                      </div>
                    </section>
                  </dvk-border-box-13>

                  <dvk-border-box-13 class="product-panel aviation-border-panel" colors="#168cff,#6ed7e8,#52f0b5" glow-intensity="0.82">
                    <section class="panel-inner">
                      <header class="panel-heading">
                        <div>
                          <p>Hub Load</p>
                          <h3>枢纽压力指数</h3>
                        </div>
                        <span>LIVE</span>
                      </header>

                      <div class="airport-list">
                        <article v-for="airport in airportPressure" :key="airport.code" class="airport-row">
                          <div>
                            <strong>{{ airport.code }}</strong>
                            <span>{{ airport.city }}</span>
                          </div>
                          <em>{{ airport.status }}</em>
                          <div class="progress-line" :style="{ '--bar-value': `${airport.value}%` }">
                            <i></i>
                          </div>
                        </article>
                      </div>
                    </section>
                  </dvk-border-box-13>
                </aside>

                <section class="center-column">
                  <dvk-border-box-11 class="product-panel product-panel--map" colors="#3d7fb8,#6ed7e8,#52f0b5" glow-intensity="0.9">
                    <section class="map-panel">
                      <header class="panel-heading panel-heading--map">
                        <div>
                          <p>Airspace Situation</p>
                          <h3>全国空域态势总览</h3>
                        </div>
                        <div class="map-tags">
                          <span>航路 286</span>
                          <span>扇区 74</span>
                          <span>流控 12</span>
                        </div>
                      </header>

                      <div class="airspace-map">
                        <svg viewBox="0 0 980 610" role="img" aria-label="主要航空枢纽与航路">
                          <defs>
                            <linearGradient id="aero-route" x1="0" y1="0" x2="1" y2="0">
                              <stop offset="0%" stop-color="#52f0b5" stop-opacity="0.18" />
                              <stop offset="48%" stop-color="#6ed7e8" stop-opacity="0.82" />
                              <stop offset="100%" stop-color="#7c4dff" stop-opacity="0.22" />
                            </linearGradient>
                            <linearGradient id="aero-warning" x1="0" y1="0" x2="1" y2="0">
                              <stop offset="0%" stop-color="#ffd166" stop-opacity="0.12" />
                              <stop offset="54%" stop-color="#ffd166" stop-opacity="0.78" />
                              <stop offset="100%" stop-color="#ef476f" stop-opacity="0.2" />
                            </linearGradient>
                          </defs>
                          <path class="map-zone" d="M128 166 L326 78 L554 104 L816 226 L762 424 L512 520 L216 432 Z" />
                          <path class="route route--main" d="M128 166 C286 142 392 194 554 272 C666 326 744 374 816 226" />
                          <path class="route" d="M216 432 C336 348 442 328 554 272 C638 230 704 182 816 226" />
                          <path class="route" d="M326 78 C366 212 410 338 512 520" />
                          <path class="route route--warning" d="M128 166 C260 264 342 374 216 432" />
                          <path class="route route--warning" d="M554 104 C586 222 650 328 762 424" />
                          <circle class="map-ring" cx="554" cy="272" r="122" />
                          <circle class="map-ring map-ring--wide" cx="554" cy="272" r="214" />
                        </svg>

                        <div v-for="hub in hubs" :key="hub.code" class="hub-marker" :style="{ left: `${hub.x}%`, top: `${hub.y}%` }">
                          <i></i>
                          <strong>{{ hub.code }}</strong>
                          <span>{{ hub.name }}</span>
                        </div>

                        <div
                          v-for="flight in flights"
                          :key="flight.id"
                          class="flight-marker"
                          :class="`flight-marker--${flight.tone}`"
                          :style="{ left: `${flight.x}%`, top: `${flight.y}%`, '--plane-rotate': `${flight.rotate}deg` }"
                        >
                          <i></i>
                          <span>{{ flight.id }}</span>
                        </div>

                        <div class="weather-zone">
                          <strong>WX-17</strong>
                          <span>绕飞评估</span>
                        </div>
                      </div>
                    </section>
                  </dvk-border-box-11>

                  <dvk-border-box-13 class="product-panel aviation-border-panel" colors="#168cff,#6ed7e8,#52f0b5" glow-intensity="0.82">
                    <section class="panel-inner">
                      <header class="panel-heading">
                        <div>
                          <p>Operational Timeline</p>
                          <h3>未来四小时运行节奏</h3>
                        </div>
                        <span>12:00 - 16:00</span>
                      </header>

                      <div class="timeline-track">
                        <article v-for="item in timeline" :key="item.time" :style="{ '--bar-value': `${item.value}%` }">
                          <strong>{{ item.time }}</strong>
                          <div><i></i></div>
                          <span>{{ item.label }}</span>
                        </article>
                      </div>
                    </section>
                  </dvk-border-box-13>
                </section>

                <aside class="right-column">
                  <dvk-border-box-13 class="product-panel aviation-border-panel" colors="#168cff,#6ed7e8,#52f0b5" glow-intensity="0.82">
                    <section class="panel-inner">
                      <header class="panel-heading">
                        <div>
                          <p>Risk Command</p>
                          <h3>风险协同处置</h3>
                        </div>
                        <span>3 ACTIVE</span>
                      </header>

                      <div class="risk-list">
                        <article v-for="risk in riskEvents" :key="risk.title" class="risk-card" :class="`risk-card--${risk.tone}`">
                          <b>{{ risk.level }}</b>
                          <div>
                            <strong>{{ risk.title }}</strong>
                            <span>{{ risk.owner }}</span>
                          </div>
                          <time>{{ risk.eta }}</time>
                        </article>
                      </div>
                    </section>
                  </dvk-border-box-13>

                  <dvk-border-box-13 class="product-panel aviation-border-panel" colors="#168cff,#6ed7e8,#52f0b5" glow-intensity="0.82">
                    <section class="panel-inner">
                      <header class="panel-heading">
                        <div>
                          <p>Service Health</p>
                          <h3>保障链路健康度</h3>
                        </div>
                        <span>SLA</span>
                      </header>

                      <div class="health-list">
                        <article v-for="item in resourceHealth" :key="item.label" class="health-row">
                          <span>{{ item.label }}</span>
                          <strong>
                            <dvk-count-to :end-val="item.value" decimals="1" suffix="%" duration="1500"></dvk-count-to>
                          </strong>
                          <div class="progress-line" :style="{ '--bar-value': `${item.value}%` }">
                            <i></i>
                          </div>
                        </article>
                      </div>
                    </section>
                  </dvk-border-box-13>

                  <dvk-border-box-13 class="product-panel aviation-border-panel" colors="#168cff,#6ed7e8,#52f0b5" glow-intensity="0.82">
                    <section class="sync-panel">
                      <dvk-decoration-8 class="sync-ring" colors="#52f0b5,#2b7cff" dur="6">
                        <dvk-count-to class="sync-meter" end-val="98.4" decimals="1" suffix="%"></dvk-count-to>
                      </dvk-decoration-8>
                      <div class="sync-copy">
                        <p>Cross-Airport Coordination</p>
                        <h3>跨场协同一致性</h3>
                      </div>
                    </section>
                  </dvk-border-box-13>
                </aside>
              </main>
            </div>
          </div>
        </div>
      </dvk-fit-screen>
    </div>
  </section>
</template>

<style scoped>
.aviation-command-demo {
  margin: 52px 0 8px;
}

.aviation-command-demo__intro {
  max-width: 820px;
  margin-bottom: 18px;
}

.aviation-command-demo__intro span {
  display: block;
  color: #52f0b5;
  font-size: 13px;
  font-weight: 780;
  letter-spacing: 0;
}

.aviation-command-demo__intro h2 {
  margin: 8px 0 0;
  color: var(--vp-c-text-1);
  font-size: 32px;
  line-height: 1.18;
  letter-spacing: 0;
}

.aviation-command-demo__intro p {
  margin: 10px 0 0;
  color: var(--vp-c-text-2);
  font-size: 15px;
  line-height: 1.7;
}

.aviation-command-demo__stage {
  position: relative;
  overflow: hidden;
  width: 100%;
  height: clamp(360px, 66vw, 780px);
  background: transparent;
}

.aviation-command-demo__fit {
  width: 100%;
  height: 100%;
}

.aviation-screen {
  position: relative;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  padding: 46px 54px 52px;
  overflow: hidden;
  color: #effbff;
  font-family: Inter, "PingFang SC", "Microsoft YaHei", sans-serif;
  letter-spacing: 0;
  background:
    linear-gradient(rgba(110, 215, 232, 0.08) 1px, transparent 1px),
    linear-gradient(90deg, rgba(110, 215, 232, 0.06) 1px, transparent 1px),
    linear-gradient(135deg, #020712 0%, #061524 50%, #081019 100%);
  background-size: 64px 64px, 64px 64px, auto;
}

.aviation-screen *,
.aviation-screen *::before,
.aviation-screen *::after {
  box-sizing: border-box;
}

.aviation-screen::before {
  position: absolute;
  inset: 0;
  content: "";
  pointer-events: none;
  background:
    linear-gradient(90deg, transparent 0 12%, rgba(82, 240, 181, 0.1) 12% 12.12%, transparent 12.12% 88%, rgba(255, 209, 102, 0.08) 88% 88.1%, transparent 88.1%),
    linear-gradient(180deg, rgba(255, 255, 255, 0.03), transparent 22%, rgba(82, 240, 181, 0.035) 70%, transparent);
}

.screen-shell {
  display: block;
  position: relative;
  z-index: 1;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
}

.screen-layout {
  display: grid;
  grid-template-rows: 132px 106px minmax(0, 1fr);
  gap: 28px;
  height: 100%;
  min-height: 0;
}

.screen-header,
.kpi-strip,
.dashboard-grid {
  min-width: 0;
  min-height: 0;
}

.screen-header {
  display: grid;
  grid-template-columns: 390px minmax(0, 1fr) 390px;
  gap: 22px;
  align-items: center;
}

.header-status {
  display: grid;
  align-content: center;
  gap: 8px;
  min-width: 0;
  height: 100%;
  padding: 18px 20px;
  border: 1px solid rgba(110, 215, 232, 0.2);
  background: rgba(2, 13, 27, 0.62);
}

.header-status--right {
  text-align: right;
}

.header-status span {
  color: rgba(223, 244, 248, 0.62);
  font-size: 19px;
  line-height: 1.1;
}

.header-status strong {
  color: #f4fdff;
  font-size: 24px;
  line-height: 1.1;
}

.screen-title {
  position: relative;
  display: grid;
  min-width: 0;
  height: 100%;
  place-items: center;
}

.title-ribbon {
  position: absolute;
  top: 31px;
  display: block;
  width: 430px;
  height: 64px;
  opacity: 0.82;
}

.title-ribbon--left {
  left: 0;
}

.title-ribbon--right {
  right: 0;
}

.title-copy {
  position: relative;
  z-index: 1;
  display: grid;
  place-items: center;
  width: min(660px, 100%);
  padding: 18px 42px;
  border-top: 1px solid rgba(110, 215, 232, 0.34);
  border-bottom: 1px solid rgba(82, 240, 181, 0.28);
  background: linear-gradient(90deg, transparent, rgba(8, 28, 44, 0.78) 18%, rgba(8, 28, 44, 0.78) 82%, transparent);
}

.title-copy span {
  color: rgba(223, 244, 248, 0.68);
  font-size: 18px;
  line-height: 1;
}

.title-copy h1 {
  margin: 8px 0 0;
  color: #ffffff;
  font-size: 46px;
  line-height: 1;
  font-weight: 800;
  letter-spacing: 0;
  text-shadow: 0 0 20px rgba(110, 215, 232, 0.48);
}

.kpi-strip {
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  column-gap: 32px;
  row-gap: 0;
}

.kpi-card {
  display: grid;
  align-content: center;
  min-width: 0;
  padding: 14px 18px;
  border: 1px solid rgba(110, 215, 232, 0.2);
  background: rgba(4, 18, 31, 0.66);
  background-clip: padding-box;
  box-shadow: inset 0 0 18px rgba(24, 240, 255, 0.04);
}

.kpi-card span,
.kpi-card em {
  display: block;
  min-width: 0;
  color: rgba(223, 244, 248, 0.62);
  font-size: 18px;
  font-style: normal;
  line-height: 1.2;
}

.kpi-card strong {
  display: block;
  margin: 8px 0;
  color: #f8feff;
  font-size: 30px;
  line-height: 1;
}

.kpi-card dvk-count-to {
  --dvk-count-to-font-size: 32px;
  --dvk-count-to-font-weight: 800;
  --dvk-count-to-affix-font-size: 0.58em;
  --dvk-count-to-affix-color: rgba(223, 244, 248, 0.76);
}

.kpi-card--green {
  border-color: rgba(82, 240, 181, 0.28);
}

.kpi-card--amber {
  border-color: rgba(255, 209, 102, 0.32);
}

.kpi-card--violet {
  border-color: rgba(124, 77, 255, 0.3);
}

.dashboard-grid {
  display: grid;
  grid-template-columns: 430px minmax(0, 1fr) 430px;
  column-gap: 44px;
  row-gap: 0;
}

.left-column,
.right-column,
.center-column {
  display: grid;
  min-width: 0;
  min-height: 0;
  gap: 18px;
}

.left-column,
.right-column {
  grid-template-rows: minmax(0, 1fr) 320px;
}

.right-column {
  grid-template-rows: minmax(0, 1fr) 300px 190px;
}

.center-column {
  grid-template-rows: minmax(0, 1fr) 190px;
}

.product-panel {
  display: block;
  width: 100%;
  height: 100%;
  min-width: 0;
  min-height: 0;
  color: #effbff;
  background-clip: padding-box;
}

.aviation-border-panel {
  --dvk-border-box-13-padding: 24px 26px;
}

.panel-inner,
.map-panel,
.sync-panel {
  display: grid;
  grid-template-rows: auto minmax(0, 1fr);
  gap: 16px;
  min-width: 0;
  min-height: 0;
  height: 100%;
  box-sizing: border-box;
  overflow: hidden;
}

.panel-heading {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 14px;
  min-width: 0;
}

.panel-heading p,
.sync-copy p {
  margin: 0 0 6px;
  color: rgba(110, 215, 232, 0.76);
  font-size: 16px;
  line-height: 1.1;
}

.panel-heading h3,
.sync-copy h3 {
  margin: 0;
  color: #ffffff;
  font-size: 24px;
  line-height: 1.12;
  font-weight: 760;
}

.panel-heading > span {
  flex: 0 0 auto;
  padding: 5px 9px;
  border: 1px solid rgba(82, 240, 181, 0.32);
  color: #c7fff0;
  font-size: 14px;
  line-height: 1;
  background: rgba(82, 240, 181, 0.08);
}

.wave-list,
.airport-list,
.risk-list,
.health-list {
  display: grid;
  gap: 12px;
  min-height: 0;
  overflow: hidden;
}

.wave-row,
.airport-row,
.health-row {
  display: grid;
  gap: 9px;
  min-width: 0;
  padding: 13px 14px;
  border: 1px solid rgba(110, 215, 232, 0.13);
  background: rgba(2, 13, 27, 0.52);
}

.wave-row__main,
.wave-row__numbers,
.airport-row,
.health-row {
  min-width: 0;
}

.wave-row__main,
.wave-row__numbers {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.wave-row time,
.wave-row span,
.airport-row span,
.airport-row em,
.health-row span,
.timeline-track span {
  color: rgba(223, 244, 248, 0.62);
  font-size: 14px;
  font-style: normal;
  line-height: 1.2;
}

.wave-row strong,
.airport-row strong,
.risk-card strong {
  color: #f4fdff;
  font-size: 17px;
  line-height: 1.15;
}

.progress-line {
  position: relative;
  height: 8px;
  overflow: hidden;
  background: rgba(110, 215, 232, 0.12);
}

.progress-line i {
  display: block;
  width: var(--bar-value);
  height: 100%;
  background: linear-gradient(90deg, #168cff, #52f0b5);
  box-shadow: 0 0 12px rgba(82, 240, 181, 0.42);
}

.airport-row {
  display: grid;
  grid-template-columns: minmax(0, 120px) minmax(0, 1fr);
}

.airport-row .progress-line {
  grid-column: 1 / -1;
  width: 100%;
}

.airport-row strong {
  display: block;
  color: #52f0b5;
  font-size: 25px;
}

.panel-heading--map {
  align-items: center;
}

.map-tags {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-end;
  gap: 8px;
}

.map-tags span {
  padding: 7px 10px;
  border: 1px solid rgba(110, 215, 232, 0.18);
  color: rgba(223, 244, 248, 0.78);
  font-size: 15px;
  background: rgba(2, 13, 27, 0.58);
}

.airspace-map {
  position: relative;
  min-height: 0;
  overflow: hidden;
  border: 1px solid rgba(110, 215, 232, 0.16);
  background:
    linear-gradient(rgba(110, 215, 232, 0.08) 1px, transparent 1px),
    linear-gradient(90deg, rgba(110, 215, 232, 0.07) 1px, transparent 1px),
    linear-gradient(135deg, rgba(3, 13, 27, 0.92), rgba(6, 23, 35, 0.92));
  background-size: 42px 42px, 42px 42px, auto;
}

.airspace-map svg {
  position: absolute;
  inset: 28px 28px 24px;
  width: calc(100% - 56px);
  height: calc(100% - 52px);
}

.map-zone {
  fill: rgba(61, 127, 184, 0.08);
  stroke: rgba(110, 215, 232, 0.28);
  stroke-width: 2;
}

.route {
  fill: none;
  stroke: url("#aero-route");
  stroke-width: 4;
  stroke-linecap: round;
  stroke-dasharray: 10 12;
}

.route--main {
  stroke-width: 6;
  stroke-dasharray: none;
}

.route--warning {
  stroke: url("#aero-warning");
  stroke-width: 5;
}

.map-ring {
  fill: none;
  stroke: rgba(82, 240, 181, 0.2);
  stroke-width: 2;
  stroke-dasharray: 7 10;
}

.map-ring--wide {
  stroke: rgba(124, 77, 255, 0.2);
}

.hub-marker {
  position: absolute;
  display: grid;
  min-width: 88px;
  transform: translate(-50%, -50%);
  justify-items: center;
  gap: 4px;
  pointer-events: none;
}

.hub-marker i {
  display: block;
  width: 16px;
  height: 16px;
  border: 2px solid #52f0b5;
  background: rgba(82, 240, 181, 0.16);
  box-shadow: 0 0 18px rgba(82, 240, 181, 0.58);
  transform: rotate(45deg);
}

.hub-marker strong {
  color: #ffffff;
  font-size: 18px;
  line-height: 1;
}

.hub-marker span {
  color: rgba(223, 244, 248, 0.7);
  font-size: 13px;
  line-height: 1;
}

.flight-marker {
  position: absolute;
  display: flex;
  align-items: center;
  gap: 8px;
  transform: translate(-50%, -50%);
  color: #f8feff;
  font-size: 13px;
  pointer-events: none;
}

.flight-marker i {
  display: block;
  width: 24px;
  height: 20px;
  background: #6ed7e8;
  clip-path: polygon(50% 0, 62% 38%, 100% 48%, 64% 60%, 58% 100%, 50% 78%, 42% 100%, 36% 60%, 0 48%, 38% 38%);
  filter: drop-shadow(0 0 10px rgba(110, 215, 232, 0.64));
  transform: rotate(var(--plane-rotate));
}

.flight-marker--green i {
  background: #52f0b5;
}

.flight-marker--amber i {
  background: #ffd166;
}

.flight-marker--blue i {
  background: #57b9ff;
}

.weather-zone {
  position: absolute;
  right: 118px;
  bottom: 86px;
  display: grid;
  place-items: center;
  width: 132px;
  height: 92px;
  border: 1px solid rgba(255, 209, 102, 0.38);
  color: #ffd166;
  background: repeating-linear-gradient(135deg, rgba(255, 209, 102, 0.12) 0 8px, rgba(255, 209, 102, 0.03) 8px 16px);
}

.weather-zone strong {
  font-size: 22px;
}

.weather-zone span {
  color: rgba(255, 231, 166, 0.82);
  font-size: 14px;
}

.timeline-track {
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  align-items: end;
  gap: 12px;
  min-height: 0;
}

.timeline-track article {
  display: grid;
  grid-template-rows: auto minmax(0, 1fr) auto;
  gap: 8px;
  height: 100%;
  min-height: 0;
}

.timeline-track strong {
  color: #ffffff;
  font-size: 17px;
}

.timeline-track div {
  position: relative;
  overflow: hidden;
  min-height: 72px;
  border: 1px solid rgba(110, 215, 232, 0.14);
  background: rgba(2, 13, 27, 0.54);
}

.timeline-track i {
  position: absolute;
  right: 0;
  bottom: 0;
  left: 0;
  display: block;
  height: var(--bar-value);
  background: linear-gradient(180deg, rgba(255, 209, 102, 0.86), rgba(82, 240, 181, 0.72));
}

.risk-list {
  align-content: start;
}

.risk-card {
  display: grid;
  grid-template-columns: 42px minmax(0, 1fr) 52px;
  gap: 12px;
  align-items: center;
  min-width: 0;
  padding: 14px;
  border-left: 3px solid rgba(110, 215, 232, 0.48);
  background: rgba(2, 13, 27, 0.54);
}

.risk-card b {
  color: #6ed7e8;
  font-size: 18px;
  line-height: 1;
}

.risk-card span,
.risk-card time {
  display: block;
  color: rgba(223, 244, 248, 0.62);
  font-size: 14px;
  line-height: 1.2;
}

.risk-card strong {
  display: block;
  margin-bottom: 5px;
}

.risk-card time {
  justify-self: end;
  color: #ffd166;
}

.risk-card--danger {
  border-left-color: #ef476f;
}

.risk-card--warning {
  border-left-color: #ffd166;
}

.health-row {
  grid-template-columns: minmax(0, 1fr) 90px;
  align-items: center;
}

.health-row .progress-line {
  grid-column: 1 / -1;
}

.health-row strong {
  justify-self: end;
  color: #ffffff;
  font-size: 18px;
  line-height: 1;
}

.health-row dvk-count-to {
  --dvk-count-to-font-size: 18px;
  --dvk-count-to-font-weight: 760;
  --dvk-count-to-affix-font-size: 0.62em;
}

.sync-panel {
  grid-template-columns: 128px minmax(0, 1fr);
  grid-template-rows: minmax(0, 1fr);
  align-items: center;
  gap: 18px;
}

.sync-ring {
  width: 128px;
  height: 128px;
}

.sync-meter {
  color: #52f0b5;
  --dvk-count-to-font-size: 18px;
  --dvk-count-to-font-weight: 800;
  --dvk-count-to-affix-font-size: 0.58em;
}

.sync-copy {
  min-width: 0;
}

@media (max-width: 960px) {
  .aviation-command-demo__intro h2 {
    font-size: 28px;
  }

  .aviation-command-demo__stage {
    height: clamp(360px, 72vw, 680px);
  }
}

@media (max-width: 640px) {
  .aviation-command-demo {
    margin-top: 40px;
  }

  .aviation-command-demo__stage {
    height: 360px;
  }
}
</style>
