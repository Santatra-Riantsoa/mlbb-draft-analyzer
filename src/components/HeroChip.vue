<script setup>
import { computed } from 'vue'
import { ROLE_COLORS } from '../data/heroes.js'

const props = defineProps({
  hero: Object,
  side: String,
  icon: { type: String, default: '' },
})

const emit = defineEmits(['remove'])

const roleColor = computed(() => ROLE_COLORS[props.hero.roles[0]] || '#aaa')
const teamColor = computed(() => props.side === 'A' ? '#f0c040' : '#4da6ff')
</script>

<template>
  <div :style="{
    display: 'flex', alignItems: 'center', gap: '8px',
    background: 'linear-gradient(135deg, ' + (side === 'A' ? '#1a150505' : '#05101a05') + ', ' + (side === 'A' ? '#1a1500' : '#001525') + ')',
    border: '1px solid ' + teamColor + '25',
    borderLeft: '3px solid ' + teamColor + '80',
    borderRadius: '6px', padding: '6px 10px', margin: '3px 0',
    backdropFilter: 'blur(4px)',
    transition: 'all 0.2s ease',
  }">
    <!-- Portrait -->
    <div :style="{
      width: '32px', height: '32px', borderRadius: '6px',
      background: '#0a1525', overflow: 'hidden', flexShrink: 0,
      border: '1px solid ' + teamColor + '30',
      boxShadow: '0 0 8px ' + teamColor + '15',
    }">
      <img v-if="icon" :src="icon" :style="{
        width: '100%', height: '100%', objectFit: 'cover',
      }" />
      <div v-else :style="{
        width: '100%', height: '100%', display: 'flex',
        alignItems: 'center', justifyContent: 'center',
        fontSize: '14px', fontWeight: 700, color: teamColor + '60',
        fontFamily: '\'Orbitron\', sans-serif',
      }">{{ hero.name[0] }}</div>
    </div>
    <!-- Info -->
    <div :style="{ flex: 1, minWidth: 0 }">
      <div :style="{
        color: '#eee', fontSize: '13px', fontWeight: 700,
        fontFamily: '\'Rajdhani\', sans-serif',
        letterSpacing: '0.5px',
        whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
      }">{{ hero.name }}</div>
      <div :style="{ display: 'flex', gap: '4px', marginTop: '1px' }">
        <span
          v-for="role in hero.roles"
          :key="role"
          :style="{
            fontSize: '8px', fontWeight: 700, letterSpacing: '1px',
            color: ROLE_COLORS[role] || '#888',
            textTransform: 'uppercase',
          }"
        >{{ role }}</span>
      </div>
    </div>
    <!-- Remove -->
    <button @click="emit('remove', hero.name)" :style="{
      background: 'none', border: 'none',
      color: '#334455', cursor: 'pointer',
      fontSize: '16px', lineHeight: 1, padding: '2px',
      transition: 'color 0.15s',
      flexShrink: 0,
    }">&times;</button>
  </div>
</template>
