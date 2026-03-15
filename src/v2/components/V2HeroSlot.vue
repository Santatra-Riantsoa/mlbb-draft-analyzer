<script setup>
import { computed } from 'vue'

const props = defineProps({
  hero: Object,
  side: String, // 'A' or 'B'
  icon: String,
})

const emit = defineEmits(['remove'])

const teamClass = computed(() => props.side === 'A' ? 'team-a' : 'team-b')
</script>

<template>
  <div class="hero-slot" :class="[teamClass, { empty: !hero }]">
    <div v-if="hero" class="hero-card" @click="emit('remove', hero.name)">
      <!-- Portrait -->
      <img :src="icon" class="portrait" />
      
      <!-- Frame -->
      <div class="frame-container">
        <!-- Gold Beveled Frame (A) or Blue Beveled Frame (B) -->
        <div class="beveled-frame"></div>
        <!-- Ornaments -->
        <div class="top-gem"></div>
        <div class="ornament top-left"></div>
        <div class="ornament top-right"></div>
        <div class="ornament bottom-left"></div>
        <div class="ornament bottom-right"></div>
      </div>

      <!-- Bottom Info -->
      <div class="info-overlay">
        <div class="hero-name">{{ hero.name }}</div>
        <div class="hero-role">{{ hero.roles[0] }}</div>
      </div>
    </div>
    <div v-else class="empty-slot"></div>
  </div>
</template>

<style scoped>
.hero-slot {
  width: 100%;
  aspect-ratio: 0.65;
  background: rgba(0, 0, 0, 0.4);
  position: relative;
  border-radius: 4px;
}

.hero-card {
  width: 100%;
  height: 100%;
  position: relative;
  cursor: pointer;
  overflow: hidden;
  border-radius: 4px;
}

.portrait {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* Frame */
.frame-container {
  position: absolute;
  top: 0; left: 0; width: 100%; height: 100%;
  pointer-events: none;
  z-index: 5;
}

.beveled-frame {
  position: absolute;
  top: 0; left: 0; width: 100%; height: 100%;
  border: 4px solid;
  border-image: linear-gradient(135deg, #c29530, #f0c040, #5a401a) 1;
}

.team-b .beveled-frame {
  border-image: linear-gradient(135deg, #4da6ff, #1e3a5a, #88ccff) 1;
}

.top-gem {
  position: absolute;
  top: -6px;
  left: 50%;
  transform: translateX(-50%);
  width: 12px;
  height: 12px;
  background: #ff00ff;
  clip-path: polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%);
  box-shadow: 0 0 10px #ff00ff;
  border: 1px solid #fff;
}

.ornament {
  position: absolute;
  width: 8px;
  height: 8px;
  background: #f0c040;
}
.team-b .ornament { background: #4da6ff; }

.top-left { top: -2px; left: -2px; }
.top-right { top: -2px; right: -2px; }
.bottom-left { bottom: -2px; left: -2px; }
.bottom-right { bottom: -2px; right: -2px; }

/* Info Overlay */
.info-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 8px 4px;
  background: linear-gradient(transparent, rgba(0, 0, 0, 0.9));
  text-align: center;
  z-index: 6;
}

.hero-name {
  color: #fff;
  font-weight: 900;
  font-size: 11px;
  font-family: 'Orbitron', sans-serif;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.hero-role {
  color: #888;
  font-size: 8px;
  text-transform: uppercase;
  font-weight: 700;
}

.empty-slot {
  width: 100%;
  height: 100%;
  background: rgba(255, 255, 255, 0.05);
  border: 1px dashed rgba(255, 255, 255, 0.1);
}
</style>
