<script setup>
import { ref, computed } from 'vue'
import { HEROES, ROLE_COLORS } from '../data/heroes.js'

const ROLE_FR = {
  All: 'Tous', Fighter: 'Combattant', Tank: 'Tank', Mage: 'Mage',
  Assassin: 'Assassin', Marksman: 'Tireur', Support: 'Support',
}

const props = defineProps({
  selected: Array,
  side: String,
  banned: { type: Array, default: () => [] },
  metaData: { type: Map, default: () => new Map() },
})

const emit = defineEmits(['toggle'])

const search = ref('')
const roleFilter = ref('All')
const sortByWr = ref(false)
const roles = ['All', ...Object.keys(ROLE_COLORS)]

const filtered = computed(() => {
  let list = HEROES.filter(h =>
    (roleFilter.value === 'All' || h.roles.includes(roleFilter.value)) &&
    h.name.toLowerCase().includes(search.value.toLowerCase()) &&
    !props.selected.find(s => s.name === h.name) &&
    !props.banned.find(b => b.name === h.name)
  )
  if (sortByWr.value && props.metaData.size > 0) {
    list = [...list].sort((a, b) => {
      const wrA = props.metaData.get(a.name)?.winrate || 50
      const wrB = props.metaData.get(b.name)?.winrate || 50
      return wrB - wrA
    })
  }
  return list
})

function getMeta(name) { return props.metaData.get(name) || null }
function wrColor(wr) {
  if (wr > 52) return '#4cd964'
  if (wr < 48) return '#ff6b6b'
  return '#ffcc00'
}
function roleFr(r) { return ROLE_FR[r] || r }
</script>

<template>
  <div>
    <!-- Search -->
    <div class="hs-search-wrap">
      <input v-model="search" placeholder="Rechercher un héros..." class="hs-search" />
      <span class="hs-search-icon">Q</span>
    </div>

    <!-- Filters -->
    <div class="hs-filters">
      <button v-for="r in roles" :key="r" @click="roleFilter = r"
        class="hs-filter-btn" :class="{ active: roleFilter === r }">
        {{ roleFr(r) }}
      </button>
      <button v-if="metaData.size > 0" @click="sortByWr = !sortByWr"
        class="hs-filter-btn hs-wr-sort" :class="{ active: sortByWr }">
        WR ↓
      </button>
    </div>

    <!-- Hero grid -->
    <div class="hs-grid">
      <button v-for="h in filtered" :key="h.name"
        @click="selected.length < 5 && emit('toggle', h)"
        class="hs-hero-card" :class="{ disabled: selected.length >= 5 }">
        <!-- + overlay -->
        <div v-if="selected.length < 5" class="hs-plus">+</div>
        <!-- Portrait - SQUARE frame -->
        <div class="hs-portrait">
          <img v-if="getMeta(h.name)?.icon" :src="getMeta(h.name).icon" />
          <div v-else class="hs-portrait-placeholder"
            :style="{ background: (ROLE_COLORS[h.roles[0]] || '#888') + '18' }">
            <span :style="{ color: (ROLE_COLORS[h.roles[0]] || '#888') + '60' }">{{ h.name[0] }}</span>
          </div>
        </div>
        <!-- Info -->
        <div class="hs-name">{{ h.name }}</div>
        <div class="hs-role">{{ h.roles.map(r => roleFr(r)).join('/') }}</div>
        <div v-if="getMeta(h.name)" class="hs-wr" :style="{ color: wrColor(getMeta(h.name).winrate) }">
          {{ getMeta(h.name).winrate.toFixed(1) }}% WR
        </div>
      </button>
    </div>
  </div>
</template>

<style>
.hs-search-wrap {
  position: relative;
  margin-bottom: 10px;
}
.hs-search {
  width: 100%;
  background: rgba(6, 14, 28, 0.95);
  border: 1px solid rgba(30, 56, 88, 0.45);
  color: #c0d4e4;
  padding: 9px 38px 9px 14px;
  border-radius: 6px;
  font-size: 13px;
  font-family: 'Rajdhani', sans-serif;
  font-weight: 600;
  box-sizing: border-box;
  outline: none;
  transition: border-color 0.2s;
}
.hs-search:focus {
  border-color: rgba(77, 166, 255, 0.3);
}
.hs-search-icon {
  position: absolute; right: 12px; top: 50%; transform: translateY(-50%);
  color: #3a5a78; font-size: 14px; pointer-events: none;
  font-family: 'Rajdhani', sans-serif; font-weight: 700;
}

.hs-filters {
  display: flex; gap: 5px; flex-wrap: wrap;
  margin-bottom: 10px; align-items: center;
}
.hs-filter-btn {
  padding: 4px 12px; border-radius: 14px; font-size: 11px;
  cursor: pointer; font-family: 'Rajdhani', sans-serif;
  font-weight: 700; letter-spacing: 0.3px;
  background: rgba(8, 18, 32, 0.9);
  border: 1px solid rgba(24, 44, 68, 0.5);
  color: #4a6a88;
  transition: all 0.15s;
}
.hs-filter-btn.active {
  background: rgba(20, 48, 80, 0.7);
  border-color: rgba(40, 90, 140, 0.5);
  color: #c0daee;
}
.hs-filter-btn:hover { filter: brightness(1.15); }

.hs-wr-sort { margin-left: auto; }
.hs-wr-sort.active {
  background: rgba(10, 36, 20, 0.7);
  border-color: rgba(20, 80, 50, 0.5);
  color: #34d399;
}

.hs-grid {
  max-height: 280px; overflow-y: auto; overflow-x: hidden;
  display: grid; grid-template-columns: repeat(4, 1fr);
  gap: 6px; padding: 1px;
}

.hs-hero-card {
  display: flex; flex-direction: column; align-items: center;
  padding: 6px 4px 5px; border-radius: 6px;
  cursor: pointer; font-family: 'Rajdhani', sans-serif;
  background: rgba(8, 18, 32, 0.85);
  border: 1px solid rgba(24, 44, 68, 0.4);
  text-align: center; position: relative;
  overflow: hidden; transition: all 0.2s ease;
}
.hs-hero-card:hover {
  border-color: rgba(77, 166, 255, 0.3);
  background: rgba(12, 26, 48, 0.95);
  box-shadow: 0 3px 12px rgba(77, 166, 255, 0.06);
  transform: translateY(-1px);
}
.hs-hero-card.disabled {
  opacity: 0.25; cursor: not-allowed;
  pointer-events: none;
}

.hs-plus {
  position: absolute; top: 3px; right: 3px;
  width: 16px; height: 16px; border-radius: 50%;
  background: rgba(77, 166, 255, 0.15);
  color: #4da6ff; font-size: 12px; font-weight: 700;
  display: flex; align-items: center; justify-content: center;
  z-index: 1; opacity: 0;
  transition: opacity 0.15s;
}
.hs-hero-card:hover .hs-plus { opacity: 1; }

/* SQUARE portrait frame - matches reference */
.hs-portrait {
  width: 58px; height: 58px; border-radius: 6px;
  background: rgba(4, 10, 20, 0.95);
  overflow: hidden; margin-bottom: 4px;
  border: 2px solid rgba(24, 44, 72, 0.55);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.5);
  transition: border-color 0.2s;
}
.hs-hero-card:hover .hs-portrait {
  border-color: rgba(77, 166, 255, 0.3);
}
.hs-portrait img {
  width: 100%; height: 100%; object-fit: cover;
}
.hs-portrait-placeholder {
  width: 100%; height: 100%;
  display: flex; align-items: center; justify-content: center;
  font-size: 20px; font-weight: 700;
  font-family: 'Orbitron', sans-serif;
}

.hs-name {
  font-size: 11px; font-weight: 700; color: #c0d4e4;
  white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
  width: 100%; line-height: 1.3;
}
.hs-role {
  font-size: 9px; color: #4a6a88; font-weight: 600;
  white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
  width: 100%;
}
.hs-wr {
  font-size: 10px; font-weight: 700; margin-top: 1px;
}
</style>
