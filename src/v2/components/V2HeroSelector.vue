<script setup>
import { ref, computed } from 'vue'
import { HEROES, ROLE_COLORS } from '../data/heroes.js'

const props = defineProps({
  selected: Array,
  side: String,
  banned: Array,
  metaData: Map,
})

const emit = defineEmits(['toggle'])

const search = ref('')
const roleFilter = ref('All')

const roles = [
  { label: 'Tous', value: 'All' },
  { label: 'Combattant', value: 'Fighter' },
  { label: 'Tank', value: 'Tank' },
  { label: 'Mage', value: 'Mage' },
  { label: 'Assassin', value: 'Assassin' },
  { label: 'Tireur', value: 'Marksman' },
  { label: 'Support', value: 'Support' }
]

const filtered = computed(() => {
  return HEROES.filter(h =>
    (roleFilter.value === 'All' || h.roles.includes(roleFilter.value)) &&
    h.name.toLowerCase().includes(search.value.toLowerCase()) &&
    !props.selected.find(s => s.name === h.name) &&
    !props.banned.find(b => b.name === h.name)
  ).sort((a, b) => {
    const wrA = props.metaData.get(a.name)?.winrate || 50
    const wrB = props.metaData.get(b.name)?.winrate || 50
    return wrB - wrA
  })
})

function getMeta(name) {
  return props.metaData.get(name) || null
}

function wrColor(wr) {
  if (wr >= 52) return '#34d399'
  if (wr <= 48) return '#f87171'
  return '#f0c040'
}
</script>

<template>
  <div class="selector-container" :class="{ sideA: side === 'A', sideB: side === 'B' }">
    <!-- Search Bar -->
    <div class="search-wrapper">
      <input 
        v-model="search" 
        placeholder="Rechercher un héros..." 
        class="search-input"
      />
      <div class="search-icon">🔍</div>
    </div>

    <!-- Role Filters -->
    <div class="role-filters">
      <button
        v-for="r in roles"
        :key="r.value"
        @click="roleFilter = r.value"
        class="filter-btn"
        :class="{ active: roleFilter === r.value }"
      >
        {{ r.label }}
      </button>
    </div>

    <!-- Hero Grid -->
    <div class="hero-grid">
      <div
        v-for="h in filtered"
        :key="h.name"
        class="hero-card"
        @click="emit('toggle', h)"
      >
        <div class="portrait-wrapper">
          <img v-if="getMeta(h.name)?.icon" :src="getMeta(h.name).icon" class="portrait" />
          <div v-else class="portrait-placeholder"></div>
          <!-- Role Icon Badge (simplified) -->
          <div class="role-badge" :style="{ backgroundColor: ROLE_COLORS[h.roles[0]] }"></div>
        </div>
        <div class="info">
          <div class="name">{{ h.name }}</div>
          <div class="role">{{ h.roles[0] }}</div>
          <div v-if="getMeta(h.name)" class="winrate" :style="{ color: wrColor(getMeta(h.name).winrate) }">
            {{ getMeta(h.name).winrate.toFixed(1) }}% WR
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.selector-container {
  display: flex;
  flex-direction: column;
  gap: 12px;
  background: rgba(0, 0, 0, 0.2);
  padding: 12px;
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.05);
  height: 100%;
}

.search-wrapper {
  position: relative;
}

.search-input {
  width: 100%;
  background: rgba(0, 0, 0, 0.4);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 6px;
  padding: 10px 35px 10px 12px;
  color: #fff;
  font-family: 'Rajdhani', sans-serif;
  font-size: 14px;
  outline: none;
}

.search-icon {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 16px;
  opacity: 0.5;
}

.role-filters {
  display: flex;
  gap: 4px;
  flex-wrap: wrap;
}

.filter-btn {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 4px;
  padding: 4px 10px;
  color: #8899aa;
  font-size: 11px;
  font-weight: 700;
  cursor: pointer;
  font-family: 'Rajdhani', sans-serif;
  transition: all 0.2s;
}

.filter-btn.active {
  background: rgba(240, 192, 64, 0.2);
  color: #f0c040;
  border-color: #f0c040;
}

.sideB .filter-btn.active {
  background: rgba(77, 166, 255, 0.2);
  color: #4da6ff;
  border-color: #4da6ff;
}

.hero-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(75px, 1fr));
  gap: 8px;
  overflow-y: auto;
  flex: 1;
}

.hero-card {
  display: flex;
  flex-direction: column;
  background: rgba(255, 255, 255, 0.03);
  border-radius: 6px;
  overflow: hidden;
  cursor: pointer;
  transition: transform 0.1s;
  border: 1px solid rgba(255, 255, 255, 0.05);
}

.hero-card:hover {
  transform: scale(1.05);
  background: rgba(255, 255, 255, 0.08);
}

.portrait-wrapper {
  width: 100%;
  aspect-ratio: 1;
  position: relative;
}

.portrait {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.portrait-placeholder {
  width: 100%;
  height: 100%;
  background: #1a2030;
}

.role-badge {
  position: absolute;
  top: 2px;
  right: 2px;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  border: 1px solid rgba(255, 255, 255, 0.5);
}

.info {
  padding: 4px;
  text-align: center;
}

.name {
  font-size: 10px;
  font-weight: 900;
  color: #eee;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  font-family: 'Rajdhani', sans-serif;
}

.role {
  font-size: 8px;
  color: #888;
  text-transform: uppercase;
}

.winrate {
  font-size: 9px;
  font-weight: 700;
  margin-top: 2px;
}
</style>
