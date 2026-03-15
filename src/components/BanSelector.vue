<script setup>
import { ref, computed } from 'vue'
import { HEROES, ROLE_COLORS } from '../data/heroes.js'

const ROLE_FR = {
  All: 'Tous', Fighter: 'Combattant', Tank: 'Tank', Mage: 'Mage',
  Assassin: 'Assassin', Marksman: 'Tireur', Support: 'Support',
}

const props = defineProps({
  bansA: Array, bansB: Array, side: String,
  metaData: { type: Map, default: () => new Map() },
})

const emit = defineEmits(['ban'])
const search = ref('')
const roleFilter = ref('All')
const roles = ['All', ...Object.keys(ROLE_COLORS)]

const allBanned = computed(() => [...props.bansA, ...props.bansB])
const maxBans = 5
const currentBans = computed(() => props.side === 'A' ? props.bansA : props.bansB)

const filtered = computed(() =>
  HEROES.filter(h =>
    (roleFilter.value === 'All' || h.roles.includes(roleFilter.value)) &&
    h.name.toLowerCase().includes(search.value.toLowerCase()) &&
    !allBanned.value.find(b => b.name === h.name)
  )
)

function getIcon(name) {
  const meta = props.metaData.get(name)
  return meta ? meta.icon : ''
}
</script>

<template>
  <div>
    <input v-model="search" placeholder="Rechercher un héros à bannir..." class="bs-search" />
    <div class="bs-filters">
      <button v-for="r in roles" :key="r" @click="roleFilter = r"
        class="bs-filter-btn" :class="{ active: roleFilter === r }">
        {{ ROLE_FR[r] || r }}
      </button>
    </div>
    <div class="bs-grid">
      <button v-for="h in filtered" :key="h.name"
        @click="currentBans.length < maxBans && emit('ban', h)"
        class="bs-hero-card" :class="{ disabled: currentBans.length >= maxBans }">
        <div class="bs-portrait">
          <img v-if="getIcon(h.name)" :src="getIcon(h.name)" />
        </div>
        <span class="bs-name">{{ h.name }}</span>
      </button>
    </div>
  </div>
</template>

<style>
.bs-search {
  width: 100%; background: rgba(12, 24, 40, 0.9);
  border: 1px solid rgba(58, 26, 26, 0.5);
  color: #c8dae8; padding: 8px 12px; border-radius: 6px;
  font-size: 12px; font-family: 'Rajdhani', sans-serif;
  font-weight: 600; box-sizing: border-box;
  margin-bottom: 8px; outline: none;
  backdrop-filter: blur(4px);
}
.bs-search:focus {
  border-color: rgba(120, 40, 40, 0.4);
  box-shadow: 0 0 8px rgba(120, 40, 40, 0.1);
}

.bs-filters {
  display: flex; gap: 4px; flex-wrap: wrap; margin-bottom: 8px;
}
.bs-filter-btn {
  padding: 3px 10px; border-radius: 12px; font-size: 10px;
  cursor: pointer; font-family: 'Rajdhani', sans-serif; font-weight: 700;
  background: rgba(12, 24, 40, 0.8);
  border: 1px solid rgba(26, 46, 68, 0.4);
  color: #5a7a96; transition: all 0.15s;
}
.bs-filter-btn.active {
  background: rgba(58, 26, 26, 0.5);
  border-color: rgba(90, 32, 32, 0.5);
  color: #ff8888;
}
.bs-filter-btn:hover { filter: brightness(1.2); }

.bs-grid {
  max-height: 180px; overflow-y: auto;
  display: grid; grid-template-columns: repeat(auto-fill, minmax(80px, 1fr));
  gap: 4px;
}
.bs-hero-card {
  display: flex; flex-direction: column; align-items: center;
  padding: 6px 4px; border-radius: 6px; font-size: 10px;
  cursor: pointer; font-family: 'Rajdhani', sans-serif; font-weight: 600;
  background: rgba(18, 12, 12, 0.7);
  border: 1px solid rgba(42, 21, 21, 0.5);
  color: #c08888; text-align: center;
  transition: all 0.2s;
}
.bs-hero-card:hover {
  border-color: rgba(120, 40, 40, 0.4);
  background: rgba(30, 15, 15, 0.8);
  transform: translateY(-1px);
}
.bs-hero-card.disabled {
  opacity: 0.25; cursor: not-allowed; pointer-events: none;
}

.bs-portrait {
  width: 36px; height: 36px; border-radius: 6px;
  background: rgba(10, 8, 8, 0.8); overflow: hidden;
  margin-bottom: 3px; border: 1px solid rgba(42, 21, 21, 0.5);
}
.bs-portrait img {
  width: 100%; height: 100%; object-fit: cover; opacity: 0.7;
}
.bs-name {
  white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
  width: 100%;
}
</style>
