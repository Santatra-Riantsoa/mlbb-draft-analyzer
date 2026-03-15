<script setup>
import { ref, computed, onMounted } from 'vue'
import { METRICS } from './data/heroes.js'
import { calcTeamWithMeta } from './data/calcTeam.js'
import { fetchMetaData } from './data/metaApi.js'

import V2MetricBar from './components/V2MetricBar.vue'
import V2HeroSlot from './components/V2HeroSlot.vue'
import V2BanSlot from './components/V2BanSlot.vue'
import V2HeroSelector from './components/V2HeroSelector.vue'

const teamA = ref([])
const teamB = ref([])
const bansA = ref([])
const bansB = ref([])
const metaData = ref(new Map())
const metaLoading = ref(true)

onMounted(async () => {
  metaData.value = await fetchMetaData()
  metaLoading.value = false
})

const statsA = computed(() => calcTeamWithMeta(teamA.value, metaData.value))
const statsB = computed(() => calcTeamWithMeta(teamB.value, metaData.value))

function addHero(side, hero) {
  const team = side === 'A' ? teamA : teamB
  if (team.value.length < 5) team.value.push(hero)
}

function removeHero(side, name) {
  const team = side === 'A' ? teamA : teamB
  team.value = team.value.filter(h => h.name !== name)
}

function addBan(side, hero) {
  const bans = side === 'A' ? bansA : bansB
  if (bans.value.length < 5) bans.value.push(hero)
}

function removeBan(side, name) {
  const bans = side === 'A' ? bansA : bansB
  bans.value = bans.value.filter(h => h.name !== name)
}

function resetDraft() {
  teamA.value = []
  teamB.value = []
  bansA.value = []
  bansB.value = []
}

function getIcon(name) {
  return metaData.value.get(name)?.icon || ''
}
</script>

<template>
  <div class="draft-analyzer-v2">
    <!-- Top Bar -->
    <div class="top-nav">
      <div class="analyzer-title-frame">
        <h1 class="main-title">DRAFT ANALYZER</h1>
      </div>
      <button class="reset-btn" @click="resetDraft">RESET</button>
    </div>

    <!-- Center Logo & Status -->
    <div class="logo-area">
      <div class="mlbb-logo">
        <img src="https://img.mobilelegends.com/group1/M00/00/8C/Cq6Ixl4j9E-AE9YpAAAL_5x6w6U682.png" />
      </div>
      <div class="live-status">
        <span class="live-dot"></span>
        LIVE - {{ metaData.size }} HEROES
      </div>
    </div>

    <main class="content-grid">
      <!-- Team A (Burgundy) -->
      <section class="team-panel team-a">
        <div class="team-header">
          <h2 class="team-name">TEAM A</h2>
          <div class="team-count">5/5</div>
        </div>

        <div class="bans-box">
          <div class="label-row">BANS</div>
          <div class="ban-row">
            <div class="ban-slots">
              <V2BanSlot v-for="i in 5" :key="i" :hero="bansA[i-1]" :icon="bansA[i-1] ? getIcon(bansA[i-1].name) : ''" @remove="n => removeBan('A', n)" />
            </div>
            <button class="ban-btn">BAN</button>
          </div>
        </div>

        <div class="picks-box">
          <div class="label-row">Picks</div>
          <div class="pick-slots">
            <V2HeroSlot v-for="i in 5" :key="i" :hero="teamA[i-1]" side="A" :icon="teamA[i-1] ? getIcon(teamA[i-1].name) : ''" @remove="n => removeHero('A', n)" />
          </div>
        </div>

        <div class="selector-box">
          <V2HeroSelector side="A" :selected="teamA" :banned="[...bansA, ...bansB, ...teamB]" :metaData="metaData" @toggle="h => addHero('A', h)" />
        </div>
      </section>

      <!-- Analysis (Center) -->
      <section class="analysis-panel">
        <div class="analysis-header">Analyse</div>
        
        <div class="metrics-list">
          <V2MetricBar 
            v-for="m in METRICS" 
            :key="m.key"
            :label="m.label"
            :a="statsA ? statsA[m.key] : null"
            :b="statsB ? statsB[m.key] : null"
          />
        </div>

        <div class="verdict-box">
          <div class="verdict-label">VERDICT DE DRAFT : MATCH ÉQUILIBRÉ</div>
          <div class="gem-frame">
            <div class="hexagon-gem">
              <div class="hex-inner">
                <div class="hex-glow"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Team B (Navy) -->
      <section class="team-panel team-b">
        <div class="team-header">
          <h2 class="team-name">TEAM B</h2>
          <div class="team-count">5/5</div>
        </div>

        <div class="bans-box">
          <div class="label-row">BANS</div>
          <div class="ban-row">
            <div class="ban-slots">
              <V2BanSlot v-for="i in 5" :key="i" :hero="bansB[i-1]" :icon="bansB[i-1] ? getIcon(bansB[i-1].name) : ''" @remove="n => removeBan('B', n)" />
            </div>
            <button class="ban-btn">BAN</button>
          </div>
        </div>

        <div class="picks-box">
          <div class="label-row">Picks</div>
          <div class="pick-slots">
            <V2HeroSlot v-for="i in 5" :key="i" :hero="teamB[i-1]" side="B" :icon="teamB[i-1] ? getIcon(teamB[i-1].name) : ''" @remove="n => removeHero('B', n)" />
          </div>
        </div>

        <div class="selector-box">
          <V2HeroSelector side="B" :selected="teamB" :banned="[...bansA, ...bansB, ...teamA]" :metaData="metaData" @toggle="h => addHero('B', h)" />
        </div>
      </section>
    </main>
  </div>
</template>

<style scoped>
.draft-analyzer-v2 {
  min-height: 100vh;
  background: #02050a;
  color: #fff;
  font-family: 'Rajdhani', sans-serif;
  padding: 15px;
  position: relative;
  background-image: radial-gradient(circle at 50% 50%, #0a1525 0%, #02050a 100%);
}

.top-nav {
  display: flex;
  justify-content: center;
  position: relative;
  margin-bottom: 5px;
}

.analyzer-title-frame {
  border-top: 2px solid #f0c040;
  border-bottom: 2px solid #f0c040;
  padding: 4px 60px;
  position: relative;
}

.analyzer-title-frame::before, .analyzer-title-frame::after {
  content: '';
  position: absolute;
  top: -2px; width: 10px; height: calc(100% + 4px);
  border: 2px solid #f0c040;
}
.analyzer-title-frame::before { left: 0; border-right: none; }
.analyzer-title-frame::after { right: 0; border-left: none; }

.main-title {
  font-family: 'Orbitron', sans-serif;
  font-size: 32px;
  font-weight: 900;
  color: #f0c040;
  margin: 0;
  letter-spacing: 4px;
}

.reset-btn {
  position: absolute;
  right: 10px;
  top: 0;
  background: #c29530;
  border: 2px solid #f0c040;
  color: #fff;
  padding: 4px 20px;
  font-family: 'Orbitron', sans-serif;
  font-weight: 700;
  cursor: pointer;
  border-radius: 4px;
}

.logo-area {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 10px;
}

.mlbb-logo img { height: 40px; }

.live-status {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #34d399;
  font-weight: 700;
  font-size: 14px;
}

.live-dot {
  width: 10px; height: 10px;
  background: #34d399;
  border-radius: 50%;
  box-shadow: 0 0 10px #34d399;
}

.content-grid {
  display: grid;
  grid-template-columns: 1fr 380px 1fr;
  gap: 15px;
}

/* Panels */
.team-panel {
  border: 2px solid;
  padding: 15px;
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.team-a { background: rgba(50, 15, 10, 0.85); border-color: #5a1a1a; }
.team-b { background: rgba(10, 30, 50, 0.85); border-color: #1a3a5a; }

.team-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 2px solid rgba(255,255,255,0.1);
  padding-bottom: 5px;
}

.team-name {
  font-family: 'Orbitron', sans-serif;
  font-size: 24px;
  font-weight: 900;
}
.team-a .team-name { color: #f0c040; }
.team-b .team-name { color: #4da6ff; }

.label-row {
  font-weight: 700;
  font-size: 14px;
  text-transform: uppercase;
  margin-bottom: 8px;
}

.ban-row {
  display: flex;
  gap: 10px;
  align-items: center;
}

.ban-slots { display: flex; gap: 5px; }

.ban-btn {
  background: #c29530;
  border: 1px solid #f0c040;
  color: #fff;
  padding: 3px 12px;
  font-weight: 700;
  border-radius: 4px;
}

.pick-slots {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 6px;
}

.selector-box { flex: 1; overflow: hidden; }

/* Analysis Panel */
.analysis-panel {
  display: flex;
  flex-direction: column;
}

.analysis-header {
  background: #1e3a5a;
  color: #fff;
  text-align: center;
  font-family: 'Orbitron', sans-serif;
  font-size: 20px;
  padding: 4px;
  border-radius: 4px;
  margin-bottom: 15px;
  border: 1px solid rgba(255,255,255,0.2);
}

.metrics-list { flex: 1; }

.verdict-box {
  border: 2px solid #f0c040;
  background: linear-gradient(to bottom, #101a2a, #050a12);
  padding: 15px;
  text-align: center;
  border-radius: 8px;
}

.verdict-label {
  color: #f0c040;
  font-weight: 900;
  font-size: 14px;
  margin-bottom: 15px;
}

.hexagon-gem {
  width: 100px; height: 100px;
  background: #f0c040;
  margin: 0 auto;
  clip-path: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%);
  display: flex; align-items: center; justify-content: center;
  padding: 3px;
}

.hex-inner {
  width: 100%; height: 100%;
  background: #0a1525;
  clip-path: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%);
  position: relative;
}

.hex-glow {
  position: absolute;
  top: 50%; left: 50%;
  transform: translate(-50%, -50%);
  width: 60%; height: 60%;
  background: #4da6ff;
  clip-path: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%);
  box-shadow: 0 0 25px #4da6ff;
}
</style>
