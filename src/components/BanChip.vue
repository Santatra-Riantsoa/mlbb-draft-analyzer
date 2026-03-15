<script setup>
const props = defineProps({
  hero: Object,
  side: String,
  icon: { type: String, default: '' },
})

const emit = defineEmits(['remove'])
</script>

<template>
  <div :style="{
    display: 'inline-flex', alignItems: 'center', gap: '5px',
    background: '#12080808', border: '1px solid #f8717120',
    borderRadius: '4px', padding: '3px 8px', margin: '2px',
    fontSize: '11px', fontFamily: '\'Rajdhani\', sans-serif', fontWeight: 600,
    position: 'relative', overflow: 'hidden',
  }">
    <!-- Diagonal strike line -->
    <div :style="{
      position: 'absolute', top: '50%', left: 0, right: 0,
      height: '1px', background: '#f8717160',
      transform: 'rotate(-12deg)',
      pointerEvents: 'none',
    }" />
    <img v-if="icon" :src="icon" :style="{
      width: '16px', height: '16px', borderRadius: '3px', objectFit: 'cover',
      opacity: 0.4, filter: 'grayscale(80%)',
    }" />
    <span :style="{ color: '#f8717180', textDecoration: 'line-through' }">{{ hero.name }}</span>
    <button @click="emit('remove', hero.name)" :style="{
      background: 'none', border: 'none', color: '#44333360',
      cursor: 'pointer', fontSize: '12px', lineHeight: 1,
      padding: '0 0 0 2px'
    }">&times;</button>
  </div>
</template>
