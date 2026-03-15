<script setup>
const props = defineProps({
  label: String,
  a: { type: Number, default: null },
  b: { type: Number, default: null },
})
const max = 10
</script>

<template>
  <div class="metric-row">
    <!-- Value A -->
    <div class="value a">{{ a !== null ? a.toFixed(1) : '—' }}</div>
    
    <!-- Bar A (Pointing Left) -->
    <div class="bar-container left">
      <div class="bar-fill a" :style="{ width: (a / max) * 100 + '%' }"></div>
    </div>

    <!-- Label -->
    <div class="metric-label">{{ label.toUpperCase() }}</div>

    <!-- Bar B (Pointing Right) -->
    <div class="bar-container right">
      <div class="bar-fill b" :style="{ width: (b / max) * 100 + '%' }"></div>
    </div>

    <!-- Value B -->
    <div class="value b">{{ b !== null ? b.toFixed(1) : '—' }}</div>
  </div>
</template>

<style scoped>
.metric-row {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 6px;
  width: 100%;
}

.value {
  font-family: 'Orbitron', sans-serif;
  font-weight: 900;
  font-size: 14px;
  width: 30px;
}
.value.a { color: #88ccff; text-align: right; }
.value.b { color: #88ccff; text-align: left; }

.metric-label {
  flex: 0 0 160px;
  background: #1e3a5a;
  color: #fff;
  text-align: center;
  font-size: 10px;
  font-weight: 700;
  padding: 2px 0;
  border-top: 1px solid rgba(255,255,255,0.2);
  border-bottom: 1px solid rgba(255,255,255,0.2);
  letter-spacing: 0.5px;
}

.bar-container {
  flex: 1;
  height: 12px;
  background: rgba(0, 20, 40, 0.4);
  position: relative;
  overflow: hidden;
}

/* Arrow tips for bars */
.bar-container.left { clip-path: polygon(10% 0, 100% 0, 100% 100%, 0 50%); }
.bar-container.right { clip-path: polygon(0 0, 90% 0, 100% 50%, 90% 100%, 0 100%); }

.bar-fill {
  height: 100%;
  transition: width 0.5s ease;
}

.bar-fill.a {
  background: linear-gradient(to left, #4da6ff, #1e3a5a);
  float: right;
  box-shadow: 0 0 10px rgba(77, 166, 255, 0.5);
}

.bar-fill.b {
  background: linear-gradient(to right, #4da6ff, #1e3a5a);
  float: left;
  box-shadow: 0 0 10px rgba(77, 166, 255, 0.5);
}
</style>
