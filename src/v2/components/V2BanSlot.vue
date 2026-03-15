<script setup>
const props = defineProps({
  hero: Object,
  icon: String,
})
const emit = defineEmits(['remove'])
</script>

<template>
  <div class="ban-slot" :class="{ empty: !hero }">
    <div v-if="hero" class="hero-content" @click="emit('remove', hero.name)">
      <img :src="icon" class="hero-icon" />
      <div class="strike-line"></div>
      <div class="remove-overlay">&times;</div>
    </div>
  </div>
</template>

<style scoped>
.ban-slot {
  width: 40px;
  height: 40px;
  background: rgba(0, 0, 0, 0.4);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 4px;
  overflow: hidden;
  position: relative;
}

.hero-content {
  width: 100%;
  height: 100%;
  cursor: pointer;
}

.hero-icon {
  width: 100%;
  height: 100%;
  object-fit: cover;
  opacity: 0.6;
  filter: grayscale(0.5);
}

.strike-line {
  position: absolute;
  top: 50%;
  left: -20%;
  width: 140%;
  height: 2px;
  background: #f87171;
  transform: rotate(45deg);
  box-shadow: 0 0 5px rgba(248, 113, 113, 0.8);
}

.remove-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 20px;
  opacity: 0;
  transition: opacity 0.2s;
}

.hero-content:hover .remove-overlay {
  opacity: 1;
}
</style>
