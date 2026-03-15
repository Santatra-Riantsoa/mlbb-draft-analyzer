<script setup>
import { ref, computed, onMounted } from 'vue'
import { HEROES, ROLE_COLORS, METRICS } from './data/heroes.js'
import { calcTeamWithMeta } from './data/calcTeam.js'
import { fetchMetaData } from './data/metaApi.js'
import MetricBar from './components/MetricBar.vue'
import HeroSelector from './components/HeroSelector.vue'
import BanSelector from './components/BanSelector.vue'

const ROLE_FR = {
  Fighter: 'Combattant', Tank: 'Tank', Mage: 'Mage',
  Assassin: 'Assassin', Marksman: 'Tireur', Support: 'Support',
}
const METRIC_FR = {
  earlyMid: 'POTENTIEL DÉBUT/MI-PARTIE',
  late: 'POTENTIEL FIN DE PARTIE',
  damage: 'POTENTIEL DE DÉGÂTS',
  survive: 'SURVIVABILITÉ',
  control: 'CAPACITÉ DE CONTRÔLE',
  push: 'POTENTIEL DE POUSSÉE',
  coord: "COORDINATION D'ÉQUIPE",
}

const teamA = ref([])
const teamB = ref([])
const bansA = ref([])
const bansB = ref([])
const metaData = ref(new Map())
const metaLoading = ref(true)
const teamAName = ref('TEAM A')
const teamBName = ref('TEAM B')
const editingA = ref(false)
const editingB = ref(false)
const showBansA = ref(false)
const showBansB = ref(false)

onMounted(async () => {
  metaData.value = await fetchMetaData()
  metaLoading.value = false
})

const allBans = computed(() => [...bansA.value, ...bansB.value])
const statsA = computed(() => calcTeamWithMeta(teamA.value, metaData.value))
const statsB = computed(() => calcTeamWithMeta(teamB.value, metaData.value))
const counterIndex = computed(() => {
  if (statsA.value && statsB.value)
    return parseFloat((statsA.value.lineup - statsB.value.lineup).toFixed(1))
  return null
})

function addHero(team, hero) {
  if (team === 'A' && teamA.value.length < 5) teamA.value = [...teamA.value, hero]
  else if (team === 'B' && teamB.value.length < 5) teamB.value = [...teamB.value, hero]
}
function removeHero(team, name) {
  if (team === 'A') teamA.value = teamA.value.filter(h => h.name !== name)
  else teamB.value = teamB.value.filter(h => h.name !== name)
}
function addBan(team, hero) {
  if (team === 'A' && bansA.value.length < 5) bansA.value = [...bansA.value, hero]
  else if (team === 'B' && bansB.value.length < 5) bansB.value = [...bansB.value, hero]
}
function removeBan(team, name) {
  if (team === 'A') bansA.value = bansA.value.filter(h => h.name !== name)
  else bansB.value = bansB.value.filter(h => h.name !== name)
}
function resetDraft() {
  teamA.value = []; teamB.value = []
  bansA.value = []; bansB.value = []
  showBansA.value = false; showBansB.value = false
}
function getIcon(name) {
  const meta = metaData.value.get(name)
  return meta ? meta.icon : ''
}
function startEdit(side) {
  if (side === 'A') editingA.value = true; else editingB.value = true
}
function finishEdit(side) {
  if (side === 'A') { if (!teamAName.value.trim()) teamAName.value = 'TEAM A'; editingA.value = false }
  else { if (!teamBName.value.trim()) teamBName.value = 'TEAM B'; editingB.value = false }
}
function roleFr(r) { return ROLE_FR[r] || r }
</script>

<template>
  <div class="app-root">
    <!-- Star particles background -->
    <div class="starfield">
      <div class="star" v-for="n in 60" :key="n" :style="{
        left: ((n * 37 + n * n * 13) % 100) + '%',
        top: ((n * 53 + n * n * 7) % 100) + '%',
        width: (n % 3 === 0 ? 2 : 1) + 'px',
        height: (n % 3 === 0 ? 2 : 1) + 'px',
        animationDelay: (n * 0.3 % 5) + 's',
        animationDuration: (2 + n % 4) + 's',
      }" />
    </div>

    <!-- ════════ HEADER ════════ -->
    <header class="header">
      <div class="header-deco-left"></div>
      <div class="header-deco-right"></div>

      <h1 class="gold-title">DRAFT ANALYZER</h1>
      <div class="subtitle">MOBILE LEGENDS : BANG BANG</div>

      <!-- Live status -->
      <div class="live-pill">
        <span class="live-dot" :class="{ loading: metaLoading, offline: !metaLoading && metaData.size === 0 }"></span>
        <span class="live-text" :class="{ loading: metaLoading, offline: !metaLoading && metaData.size === 0 }">
          {{ metaLoading ? 'LOADING...' : (metaData.size > 0 ? 'LIVE - ' + metaData.size + ' HEROES' : 'OFFLINE') }}
        </span>
      </div>

      <button class="reset-btn gold-btn" @click="resetDraft">RESET</button>
    </header>

    <!-- ════════ MAIN GRID ════════ -->
    <div class="main-grid">

      <!-- ═══ TEAM A ═══ -->
      <div class="crystal-panel gold-corners team-panel team-panel-a">
        <div class="team-header">
          <input v-if="editingA" v-model="teamAName" @blur="finishEdit('A')" @keydown.enter="finishEdit('A')"
            class="team-name-input" autofocus />
          <span v-else @dblclick="startEdit('A')" class="team-name" title="Double-click to rename">{{ teamAName }}</span>
          <span class="team-counter gold">{{ teamA.length }}/5</span>
        </div>

        <!-- Bans -->
        <div class="section">
          <div class="section-label">BANS</div>
          <div class="ban-row">
            <div v-for="i in 5" :key="'bA'+i" class="ban-slot" :class="{ filled: bansA[i-1] }">
              <template v-if="bansA[i-1]">
                <img v-if="getIcon(bansA[i-1].name)" :src="getIcon(bansA[i-1].name)" class="ban-img" />
                <div class="ban-x">✕</div>
                <button class="ban-remove" @click="removeBan('A', bansA[i-1].name)">×</button>
              </template>
            </div>
            <div style="flex:1"></div>
            <button class="ban-btn" :class="{ active: showBansA }" @click="showBansA = !showBansA">BAN</button>
          </div>
          <div v-if="showBansA" style="margin-top:10px">
            <BanSelector :bansA="bansA" :bansB="bansB" side="A" :metaData="metaData" @ban="h => addBan('A', h)" />
          </div>
        </div>

        <!-- Picks -->
        <div class="section">
          <div class="section-label">Picks</div>
          <div class="pick-grid">
            <div v-for="i in 5" :key="'pA'+i" class="pick-card" :class="{ filled: teamA[i-1] }">
              <template v-if="teamA[i-1]">
                <div class="pick-portrait">
                  <img v-if="getIcon(teamA[i-1].name)" :src="getIcon(teamA[i-1].name)" />
                  <span v-else class="pick-letter">{{ teamA[i-1].name[0] }}</span>
                  <div class="pick-roles">
                    <span v-for="role in teamA[i-1].roles" :key="role" class="role-dot"
                      :style="{ background: ROLE_COLORS[role], boxShadow: '0 0 4px ' + ROLE_COLORS[role] + '80' }" />
                  </div>
                  <button class="pick-remove" @click="removeHero('A', teamA[i-1].name)">×</button>
                </div>
                <div class="pick-name">{{ teamA[i-1].name }}</div>
                <div class="pick-role-text">{{ teamA[i-1].roles.map(r => roleFr(r).toUpperCase()).join('/') }}</div>
              </template>
              <template v-else>
                <div class="pick-empty"><div class="pick-empty-icon"></div></div>
              </template>
            </div>
          </div>
        </div>

        <!-- Selector -->
        <HeroSelector :selected="teamA" side="A" :banned="allBans" :metaData="metaData" @toggle="h => addHero('A', h)" />
      </div>

      <!-- ═══ CENTER ANALYSIS ═══ -->
      <div class="crystal-panel center-panel">
        <div class="analysis-title">
          <span class="analysis-title-text">Analyse</span>
          <div class="analysis-title-line"></div>
        </div>

        <div class="metrics-container">
          <MetricBar v-for="m in METRICS" :key="m.key"
            :label="METRIC_FR[m.key] || m.label"
            :a="statsA ? statsA[m.key] : null"
            :b="statsB ? statsB[m.key] : null"
          />
        </div>

        <div v-if="!statsA && !statsB" class="empty-state">
          SÉLECTIONNEZ DES HÉROS<br />POUR COMMENCER L'ANALYSE
        </div>

        <!-- Verdict -->
        <div v-if="statsA && statsB" class="verdict-section">
          <div class="verdict-text" :class="{
            even: Math.abs(counterIndex) < 0.3,
            'team-a': counterIndex >= 0.3,
            'team-b': counterIndex <= -0.3,
          }">
            <template v-if="Math.abs(counterIndex) < 0.3">VERDICT DE DRAFT : MATCH ÉQUILIBRÉ</template>
            <template v-else-if="counterIndex > 0">VERDICT : {{ teamAName }} +{{ counterIndex }}</template>
            <template v-else>VERDICT : {{ teamBName }} +{{ Math.abs(counterIndex) }}</template>
          </div>

          <div class="hex-container">
            <div class="hex-outer">
              <div class="hex-inner">
                <span class="hex-value">
                  {{ Math.abs(counterIndex) < 0.3 ? '=' : (counterIndex > 0 ? '+' + counterIndex : '+' + Math.abs(counterIndex)) }}
                </span>
              </div>
            </div>
          </div>

          <div class="lineup-row">
            <div class="lineup-item">
              <div class="lineup-label">LINEUP A</div>
              <div class="lineup-value gold">{{ statsA.lineup }}</div>
            </div>
            <div class="lineup-item">
              <div class="lineup-label">LINEUP B</div>
              <div class="lineup-value cyan">{{ statsB.lineup }}</div>
            </div>
          </div>
        </div>
      </div>

      <!-- ═══ TEAM B ═══ -->
      <div class="crystal-panel gold-corners team-panel team-panel-b">
        <div class="team-header">
          <input v-if="editingB" v-model="teamBName" @blur="finishEdit('B')" @keydown.enter="finishEdit('B')"
            class="team-name-input" autofocus />
          <span v-else @dblclick="startEdit('B')" class="team-name" title="Double-click to rename">{{ teamBName }}</span>
          <span class="team-counter">{{ teamB.length }}/5</span>
        </div>

        <div class="section">
          <div class="section-label">BANS</div>
          <div class="ban-row">
            <div v-for="i in 5" :key="'bB'+i" class="ban-slot" :class="{ filled: bansB[i-1] }">
              <template v-if="bansB[i-1]">
                <img v-if="getIcon(bansB[i-1].name)" :src="getIcon(bansB[i-1].name)" class="ban-img" />
                <div class="ban-x">✕</div>
                <button class="ban-remove" @click="removeBan('B', bansB[i-1].name)">×</button>
              </template>
            </div>
            <div style="flex:1"></div>
            <button class="ban-btn" :class="{ active: showBansB }" @click="showBansB = !showBansB">BAN</button>
          </div>
          <div v-if="showBansB" style="margin-top:10px">
            <BanSelector :bansA="bansA" :bansB="bansB" side="B" :metaData="metaData" @ban="h => addBan('B', h)" />
          </div>
        </div>

        <div class="section">
          <div class="section-label">Picks</div>
          <div class="pick-grid">
            <div v-for="i in 5" :key="'pB'+i" class="pick-card" :class="{ filled: teamB[i-1] }">
              <template v-if="teamB[i-1]">
                <div class="pick-portrait">
                  <img v-if="getIcon(teamB[i-1].name)" :src="getIcon(teamB[i-1].name)" />
                  <span v-else class="pick-letter">{{ teamB[i-1].name[0] }}</span>
                  <div class="pick-roles">
                    <span v-for="role in teamB[i-1].roles" :key="role" class="role-dot"
                      :style="{ background: ROLE_COLORS[role], boxShadow: '0 0 4px ' + ROLE_COLORS[role] + '80' }" />
                  </div>
                  <button class="pick-remove" @click="removeHero('B', teamB[i-1].name)">×</button>
                </div>
                <div class="pick-name">{{ teamB[i-1].name }}</div>
                <div class="pick-role-text">{{ teamB[i-1].roles.map(r => roleFr(r).toUpperCase()).join('/') }}</div>
              </template>
              <template v-else>
                <div class="pick-empty"><div class="pick-empty-icon"></div></div>
              </template>
            </div>
          </div>
        </div>

        <HeroSelector :selected="teamB" side="B" :banned="allBans" :metaData="metaData" @toggle="h => addHero('B', h)" />
      </div>
    </div>
  </div>
</template>

<style>
@import url('https://fonts.googleapis.com/css2?family=Rajdhani:wght@400;600;700&family=Orbitron:wght@400;700;900&display=swap');

/* ═══ RESETS ═══ */
* { margin: 0; padding: 0; box-sizing: border-box; }
body { background: #0a1525; overflow-x: hidden; }
::-webkit-scrollbar { width: 5px; }
::-webkit-scrollbar-track { background: transparent; }
::-webkit-scrollbar-thumb { background: #1a3050; border-radius: 4px; }
::selection { background: rgba(77, 166, 255, 0.3); color: #fff; }
input::placeholder { color: #2a4a68 !important; }

/* ═══ ANIMATIONS ═══ */
@keyframes goldShimmer {
  0% { background-position: -200% center; }
  100% { background-position: 200% center; }
}
@keyframes twinkle {
  0%, 100% { opacity: 0.1; }
  50% { opacity: 0.7; }
}
@keyframes hexRotate {
  0%, 100% { filter: drop-shadow(0 0 8px rgba(77, 166, 255, 0.4)); }
  50% { filter: drop-shadow(0 0 20px rgba(77, 166, 255, 0.7)); }
}
@keyframes sweep {
  0% { left: -100%; }
  100% { left: 200%; }
}
@keyframes borderGlow {
  0%, 100% { border-color: rgba(200, 144, 48, 0.2); }
  50% { border-color: rgba(200, 144, 48, 0.35); }
}

/* ═══ APP ROOT ═══ */
.app-root {
  min-height: 100vh;
  font-family: 'Rajdhani', sans-serif;
  background: #0a1525;
  background-image:
    radial-gradient(ellipse at 50% 0%, rgba(25, 50, 85, 0.7) 0%, transparent 50%),
    radial-gradient(ellipse at 15% 50%, rgba(15, 30, 55, 0.5) 0%, transparent 40%),
    radial-gradient(ellipse at 85% 50%, rgba(12, 25, 50, 0.5) 0%, transparent 40%);
  position: relative;
  overflow-y: auto;
  overflow-x: hidden;
}

/* ═══ STARFIELD ═══ */
.starfield {
  position: fixed; inset: 0;
  pointer-events: none; z-index: 0;
}
.star {
  position: absolute;
  background: #c0d8f0;
  border-radius: 50%;
  animation: twinkle 3s ease-in-out infinite;
}

/* ═══ GOLD TITLE ═══ */
.gold-title {
  font-family: 'Orbitron', sans-serif;
  font-weight: 900;
  font-size: clamp(28px, 4vw, 44px);
  letter-spacing: 8px;
  background: linear-gradient(
    90deg,
    #7a5510, #b88020, #e8c050, #fff0a0, #e8c050, #b88020, #7a5510,
    #b88020, #e8c050, #fff0a0, #e8c050, #b88020
  );
  background-size: 200% 100%;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  animation: goldShimmer 5s linear infinite;
  filter: drop-shadow(0 0 24px rgba(232, 192, 80, 0.3))
          drop-shadow(0 3px 6px rgba(0, 0, 0, 0.6));
  position: relative;
  z-index: 1;
  font-style: italic;
}

/* ═══ PANEL BASE ═══ */
.crystal-panel {
  background: linear-gradient(
    160deg,
    rgba(10, 22, 40, 0.95) 0%,
    rgba(8, 18, 34, 0.98) 50%,
    rgba(10, 22, 40, 0.95) 100%
  );
  border: 1px solid rgba(40, 70, 110, 0.45);
  border-radius: 10px;
  box-shadow:
    0 8px 40px rgba(0, 0, 0, 0.6),
    inset 0 1px 0 rgba(255, 255, 255, 0.05);
  position: relative;
  overflow: hidden;
  z-index: 1;
}
.crystal-panel::before {
  content: '';
  position: absolute;
  top: 0; left: 10%; right: 10%;
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(200, 180, 120, 0.15), transparent);
  pointer-events: none; z-index: 2;
}

/* ═══ GOLD CORNERS ═══ */
.gold-corners::after {
  content: '';
  position: absolute; inset: 0;
  pointer-events: none; z-index: 3;
  border-radius: 10px;
  border: 1px solid rgba(200, 144, 48, 0.25);
  animation: borderGlow 3s ease-in-out infinite;
  /* Corner L-shapes via box-shadow - thicker & brighter */
  box-shadow:
    /* top-left */
    inset 35px 0 0 -33px rgba(200, 144, 48, 0.65),
    inset 0 35px 0 -33px rgba(200, 144, 48, 0.65),
    /* top-right */
    inset -35px 0 0 -33px rgba(200, 144, 48, 0.65),
    inset 0 35px 0 -33px rgba(200, 144, 48, 0.65),
    /* bottom-left */
    inset 35px 0 0 -33px rgba(200, 144, 48, 0.45),
    inset 0 -35px 0 -33px rgba(200, 144, 48, 0.45),
    /* bottom-right */
    inset -35px 0 0 -33px rgba(200, 144, 48, 0.45),
    inset 0 -35px 0 -33px rgba(200, 144, 48, 0.45),
    /* outer glow */
    0 0 30px rgba(200, 144, 48, 0.08);
}

/* ═══ GOLD BUTTON ═══ */
.gold-btn {
  background: linear-gradient(145deg, #d4a440, #9a6820, #c89030);
  border: 2px solid #d8b040;
  color: #1a0800;
  font-family: 'Orbitron', sans-serif;
  font-weight: 900; font-size: 14px;
  letter-spacing: 4px;
  padding: 10px 32px;
  border-radius: 5px;
  cursor: pointer;
  position: relative; overflow: hidden;
  box-shadow:
    0 0 20px rgba(212, 164, 64, 0.2),
    inset 0 1px 0 rgba(255, 255, 255, 0.3),
    inset 0 -1px 2px rgba(0, 0, 0, 0.2);
  text-shadow: 0 1px 0 rgba(255, 255, 255, 0.15);
  transition: all 0.2s; z-index: 1;
}
.gold-btn::before {
  content: '';
  position: absolute; top: 0; left: -100%;
  width: 50%; height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.25), transparent);
  animation: sweep 3.5s ease-in-out infinite;
}
.gold-btn:hover {
  box-shadow: 0 0 36px rgba(212, 164, 64, 0.4);
  transform: translateY(-1px);
}

/* ═══ HEADER ═══ */
.header {
  text-align: center;
  padding: 28px 20px 20px;
  position: relative; z-index: 1;
  border-bottom: 1px solid rgba(200, 144, 48, 0.12);
  background: linear-gradient(180deg, rgba(14, 28, 50, 0.5) 0%, transparent 100%);
}
.header-deco-left, .header-deco-right {
  position: absolute; top: 48px;
  width: 160px; height: 1px;
  background: linear-gradient(90deg, transparent, rgba(200, 144, 48, 0.35));
}
.header-deco-left { left: 4%; }
.header-deco-right {
  right: 4%;
  background: linear-gradient(270deg, transparent, rgba(200, 144, 48, 0.35));
}
.subtitle {
  font-size: 12px; letter-spacing: 7px;
  color: #4a6880; margin-top: 4px;
  font-weight: 700;
  font-family: 'Orbitron', sans-serif;
  position: relative; z-index: 1;
}
.live-pill {
  display: inline-flex; align-items: center; gap: 8px;
  margin-top: 14px; padding: 5px 20px;
  border-radius: 20px;
  background: rgba(8, 18, 32, 0.85);
  border: 1px solid rgba(52, 211, 153, 0.2);
  position: relative; z-index: 1;
}
.live-dot {
  width: 8px; height: 8px; border-radius: 50%;
  background: #34d399;
  box-shadow: 0 0 8px #34d399, 0 0 20px rgba(52, 211, 153, 0.25);
}
.live-dot.loading { background: #fbbf24; box-shadow: 0 0 8px #fbbf24; }
.live-dot.offline { background: #f87171; box-shadow: 0 0 8px #f87171; }
.live-text {
  font-size: 12px; letter-spacing: 2px; font-weight: 700;
  color: #34d399; font-family: 'Orbitron', sans-serif;
}
.live-text.loading { color: #fbbf24; }
.live-text.offline { color: #f87171; }
.reset-btn {
  position: absolute; right: 24px;
  top: 50%; transform: translateY(-50%);
}

/* ═══ MAIN GRID ═══ */
.main-grid {
  display: grid;
  grid-template-columns: 1fr 380px 1fr;
  gap: 14px;
  max-width: 1420px;
  margin: 0 auto;
  padding: 18px 16px 24px;
  position: relative; z-index: 1;
}

/* ═══ TEAM PANEL ═══ */
.team-panel { padding: 18px 16px; }
.team-panel-a {
  background: linear-gradient(160deg,
    rgba(60, 16, 20, 0.93) 0%,
    rgba(45, 12, 16, 0.95) 50%,
    rgba(35, 14, 22, 0.95) 100%
  );
  border-color: rgba(140, 50, 40, 0.35);
}
.team-panel-b {
  background: linear-gradient(160deg,
    rgba(10, 32, 60, 0.93) 0%,
    rgba(8, 26, 52, 0.95) 50%,
    rgba(12, 30, 56, 0.95) 100%
  );
  border-color: rgba(40, 90, 150, 0.4);
}
.team-header {
  display: flex; align-items: center;
  justify-content: space-between;
  margin-bottom: 14px;
  padding-bottom: 10px;
  border-bottom: 1px solid rgba(200, 144, 48, 0.1);
}
.team-name {
  font-family: 'Orbitron', sans-serif;
  font-weight: 900; font-size: 20px;
  color: #e8f0f8; letter-spacing: 3px;
  cursor: pointer;
  text-shadow: 0 0 12px rgba(232, 240, 248, 0.1);
}
.team-name-input {
  font-family: 'Orbitron', sans-serif;
  font-weight: 900; font-size: 20px;
  color: #e8f0f8; background: #0a1628;
  border: 1px solid #1e3858; border-radius: 4px;
  padding: 2px 8px; outline: none; width: 180px;
}
.team-counter {
  font-family: 'Orbitron', sans-serif;
  font-weight: 900; font-size: 16px;
  color: #4da6ff;
  text-shadow: 0 0 10px rgba(77, 166, 255, 0.25);
}
.team-counter.gold {
  color: #f0c040;
  text-shadow: 0 0 10px rgba(240, 192, 64, 0.25);
}
.section { margin-bottom: 14px; }
.section-label {
  font-size: 14px; font-weight: 700;
  letter-spacing: 2px; color: #e0e8f0;
  margin-bottom: 8px;
}

/* ═══ BAN SLOTS ═══ */
.ban-row { display: flex; align-items: center; gap: 6px; }
.ban-slot {
  width: 50px; height: 50px; border-radius: 4px;
  border: 1px solid rgba(40, 70, 100, 0.5);
  background: rgba(8, 18, 32, 0.9);
  overflow: hidden; position: relative;
  flex-shrink: 0; transition: all 0.2s;
}
.ban-slot.filled {
  border-color: rgba(200, 50, 50, 0.45);
  box-shadow: inset 0 0 12px rgba(200, 50, 50, 0.1);
}
.ban-img {
  width: 100%; height: 100%; object-fit: cover;
  opacity: 0.3; filter: grayscale(80%) brightness(0.6);
}
.ban-x {
  position: absolute; inset: 0;
  display: flex; align-items: center; justify-content: center;
  color: #ff3838; font-size: 28px; font-weight: 900;
  text-shadow: 0 0 12px rgba(255, 56, 56, 0.6);
}
.ban-remove {
  position: absolute; top: 1px; right: 1px;
  background: rgba(0, 0, 0, 0.75); border: none;
  color: #ff8888; cursor: pointer;
  font-size: 10px; width: 14px; height: 14px;
  border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  padding: 0; opacity: 0; transition: opacity 0.15s;
}
.ban-slot:hover .ban-remove { opacity: 1; }
.ban-btn {
  background: linear-gradient(180deg, rgba(30, 50, 76, 0.9), rgba(16, 30, 52, 0.9));
  border: 1px solid rgba(50, 80, 120, 0.5);
  border-radius: 5px; padding: 10px 24px;
  cursor: pointer;
  font-family: 'Orbitron', sans-serif;
  font-weight: 700; font-size: 13px; letter-spacing: 2px;
  color: #7a98b4; transition: all 0.2s;
}
.ban-btn.active {
  background: linear-gradient(180deg, rgba(100, 30, 30, 0.6), rgba(60, 15, 15, 0.7));
  border-color: rgba(160, 50, 50, 0.5);
  color: #ff7070;
  box-shadow: 0 0 12px rgba(160, 50, 50, 0.15);
}
.ban-btn:hover { filter: brightness(1.15); }

/* ═══ PICK CARDS ═══ */
.pick-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 6px;
}
.pick-card {
  border-radius: 6px; overflow: hidden;
  border: 1px solid rgba(40, 70, 100, 0.5);
  background: rgba(6, 14, 26, 0.85);
  text-align: center; position: relative;
  display: flex; flex-direction: column; align-items: center;
  transition: all 0.25s ease;
}
.pick-card.filled {
  border-color: rgba(77, 166, 255, 0.25);
  box-shadow: 0 0 14px rgba(77, 166, 255, 0.08), 0 2px 10px rgba(0, 0, 0, 0.5);
  border-top: 2px solid rgba(200, 144, 48, 0.4);
}
.pick-card.filled:hover {
  border-color: rgba(77, 166, 255, 0.4);
  box-shadow: 0 4px 20px rgba(77, 166, 255, 0.12);
  transform: translateY(-2px);
}
.pick-portrait {
  width: 100%; aspect-ratio: 3 / 4;
  overflow: hidden; background: #040a14;
  position: relative;
}
/* Gradient overlay at bottom of portrait for text readability */
.pick-portrait::after {
  content: '';
  position: absolute; bottom: 0; left: 0; right: 0;
  height: 40%;
  background: linear-gradient(transparent, rgba(4, 10, 20, 0.8));
  pointer-events: none;
}
.pick-portrait img {
  width: 100%; height: 100%; object-fit: cover;
  transition: transform 0.3s;
}
.pick-card:hover .pick-portrait img { transform: scale(1.06); }
.pick-letter {
  display: flex; width: 100%; height: 100%;
  align-items: center; justify-content: center;
  font-size: 24px; font-weight: 900;
  color: rgba(77, 166, 255, 0.2);
  font-family: 'Orbitron', sans-serif;
}
/* Gold ornament decorations at top of filled pick cards */
.pick-card.filled::after {
  content: '';
  position: absolute; top: 0; left: 0; right: 0;
  height: 16px;
  background:
    radial-gradient(circle at 20% 0%, rgba(200, 144, 48, 0.5) 0%, transparent 40%),
    radial-gradient(circle at 80% 0%, rgba(200, 144, 48, 0.5) 0%, transparent 40%),
    radial-gradient(circle at 50% 0%, rgba(200, 144, 48, 0.3) 0%, transparent 50%);
  pointer-events: none; z-index: 2;
}
.pick-roles {
  position: absolute; bottom: 4px; left: 50%;
  transform: translateX(-50%);
  display: flex; gap: 3px; z-index: 3;
}
.role-dot {
  width: 10px; height: 10px; border-radius: 3px;
  border: 1px solid rgba(0, 0, 0, 0.6);
  box-shadow: 0 0 4px currentColor;
}
.pick-remove {
  position: absolute; top: 2px; right: 2px;
  background: rgba(0, 0, 0, 0.7); border: none;
  color: #7898b0; cursor: pointer;
  font-size: 14px; width: 18px; height: 18px;
  border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  padding: 0; opacity: 0;
  transition: opacity 0.15s; z-index: 4;
}
.pick-card:hover .pick-remove { opacity: 1; }
.pick-remove:hover { color: #ff7070; }
.pick-name {
  padding: 4px 3px 1px;
  font-size: 11px; font-weight: 700; color: #d0e0f0;
  white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
  width: 100%;
}
.pick-role-text {
  font-size: 8px; color: #4a6a86;
  font-weight: 700; letter-spacing: 0.5px;
  padding: 0 3px 5px;
  white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
  width: 100%;
}
.pick-empty {
  width: 100%; aspect-ratio: 3 / 4;
  display: flex; align-items: center; justify-content: center;
  background: rgba(6, 14, 28, 0.6);
}
.pick-empty-icon {
  width: 28px; height: 28px; border-radius: 4px;
  border: 1px solid rgba(40, 70, 100, 0.3);
  background: rgba(20, 40, 60, 0.3);
}

/* ═══ CENTER ANALYSIS ═══ */
.center-panel {
  padding: 20px;
  display: flex; flex-direction: column;
  background: linear-gradient(180deg,
    rgba(30, 60, 95, 0.9) 0%,
    rgba(20, 45, 75, 0.92) 30%,
    rgba(14, 35, 60, 0.95) 100%
  );
  border-color: rgba(60, 110, 160, 0.4);
}
.analysis-title {
  text-align: center; margin-bottom: 18px;
  padding: 8px 0;
  border: 1px solid rgba(100, 160, 200, 0.25);
  border-radius: 6px;
  background: linear-gradient(180deg, rgba(30, 55, 85, 0.5), rgba(20, 40, 65, 0.3));
}
.analysis-title-text {
  font-family: 'Orbitron', sans-serif;
  font-weight: 700; font-size: 22px;
  letter-spacing: 5px; color: #e8f0f8;
  text-shadow: 0 0 16px rgba(232, 240, 248, 0.2);
}
.analysis-title-line { display: none; }
.metrics-container { flex: 1; }
.empty-state {
  text-align: center; padding: 40px 0;
  color: #1a3050; font-size: 12px;
  letter-spacing: 3px;
  font-family: 'Orbitron', sans-serif;
  font-weight: 600; line-height: 2.2;
}

/* ═══ VERDICT ═══ */
.verdict-section {
  margin-top: 16px; padding: 16px 14px;
  border: 2px solid rgba(180, 140, 60, 0.35);
  border-radius: 8px;
  background: linear-gradient(180deg, rgba(8, 16, 30, 0.92), rgba(4, 10, 22, 0.96));
  text-align: center;
  position: relative;
  overflow: hidden;
}
/* Decorative hex pattern at bottom of verdict */
.verdict-section::after {
  content: '';
  position: absolute; bottom: 0; left: 0; right: 0;
  height: 30px;
  background:
    repeating-linear-gradient(60deg,
      transparent, transparent 14px,
      rgba(180, 140, 60, 0.08) 14px, rgba(180, 140, 60, 0.08) 15px
    ),
    repeating-linear-gradient(-60deg,
      transparent, transparent 14px,
      rgba(60, 180, 220, 0.06) 14px, rgba(60, 180, 220, 0.06) 15px
    );
  pointer-events: none;
}
.verdict-text {
  font-family: 'Orbitron', sans-serif;
  font-weight: 700; font-size: 13px;
  letter-spacing: 2px;
  margin-bottom: 14px; padding-bottom: 12px;
  border-bottom: 1px solid rgba(180, 140, 60, 0.15);
}
.verdict-text.even { color: #d0dce8; }
.verdict-text.team-a { color: #f0c040; text-shadow: 0 0 16px rgba(240, 192, 64, 0.35); }
.verdict-text.team-b { color: #4da6ff; text-shadow: 0 0 16px rgba(77, 166, 255, 0.35); }

/* Hex badge - gold outer frame + cyan inner glow */
.hex-container {
  margin: 6px auto 14px;
  width: 110px; height: 110px;
  animation: hexRotate 3s ease-in-out infinite;
}
.hex-outer {
  width: 100%; height: 100%;
  clip-path: polygon(50% 0%, 93% 25%, 93% 75%, 50% 100%, 7% 75%, 7% 25%);
  background: linear-gradient(150deg, #c89030, #8a6020, #c89030);
  display: flex; align-items: center; justify-content: center;
}
.hex-inner {
  width: 100px; height: 100px;
  clip-path: polygon(50% 0%, 93% 25%, 93% 75%, 50% 100%, 7% 75%, 7% 25%);
  background: linear-gradient(150deg, #10253e, #081828, #10253e);
  display: flex; align-items: center; justify-content: center;
  position: relative;
}
/* Inner cyan hexagon glow */
.hex-inner::before {
  content: '';
  position: absolute;
  width: 65px; height: 65px;
  clip-path: polygon(50% 0%, 93% 25%, 93% 75%, 50% 100%, 7% 75%, 7% 25%);
  background: linear-gradient(150deg, rgba(60, 200, 240, 0.15), rgba(40, 160, 200, 0.08));
  border: 1px solid rgba(60, 200, 240, 0.2);
  box-shadow: 0 0 20px rgba(60, 200, 240, 0.15);
}
.hex-value {
  font-family: 'Orbitron', sans-serif;
  font-weight: 900; font-size: 18px;
  color: #50d0f0;
  text-shadow: 0 0 20px rgba(80, 208, 240, 0.7);
  position: relative; z-index: 1;
}
.lineup-row {
  display: flex; justify-content: space-around;
  margin-top: 12px; padding-top: 12px;
  border-top: 1px solid rgba(77, 166, 255, 0.08);
}
.lineup-item { text-align: center; }
.lineup-label {
  font-size: 10px; color: #4a6a86;
  letter-spacing: 2px; margin-bottom: 3px;
  font-weight: 700;
}
.lineup-value {
  font-family: 'Orbitron', sans-serif;
  font-weight: 900; font-size: 20px;
}
.lineup-value.gold { color: #f0c040; text-shadow: 0 0 14px rgba(240, 192, 64, 0.3); }
.lineup-value.cyan { color: #4da6ff; text-shadow: 0 0 14px rgba(77, 166, 255, 0.3); }
</style>
