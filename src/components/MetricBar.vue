<script setup>
import { computed } from 'vue'

const props = defineProps({
  label: String,
  a: { type: Number, default: null },
  b: { type: Number, default: null },
})
const max = 10
const uid = computed(() => 'mb' + props.label.replace(/[^a-zA-Z]/g, '').slice(0, 10))
</script>

<template>
  <div class="mb">
    <svg width="0" height="0" style="position:absolute">
      <defs>
        <filter :id="uid + 'ice'" x="0%" y="0%" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency="0.015 0.08"
            numOctaves="3" seed="2" result="noise" />
          <feSpecularLighting in="noise" surfaceScale="0.6"
            specularConstant="0.4" specularExponent="40"
            lighting-color="#d0faff" result="spec">
            <feDistantLight azimuth="200" elevation="65" />
          </feSpecularLighting>
          <feComposite in="spec" in2="SourceGraphic" operator="in" result="sc" />
          <feComposite in="SourceGraphic" in2="sc" operator="arithmetic"
            k1="0" k2="1" k3="0.25" k4="0" />
        </filter>
      </defs>
    </svg>

    <div class="mb-label">{{ label }}</div>
    <div class="mb-row">
      <span class="mb-score" :class="{ bright: a !== null && b !== null && a > b }">
        {{ a !== null ? a.toFixed(1) : '—' }}
      </span>

      <div class="mb-frame">
        <div class="mb-tip mb-tip-l"></div>
        <div class="mb-track">
          <!-- Team A -->
          <div v-if="a !== null" class="mb-fill mb-fill-a"
            :style="{ width: (a / max) * 50 + '%', filter: `url(#${uid}ice)` }">
            <div class="mb-gloss"></div>
          </div>
          <!-- Team B -->
          <div v-if="b !== null" class="mb-fill mb-fill-b"
            :style="{ width: (b / max) * 50 + '%', filter: `url(#${uid}ice)` }">
            <div class="mb-gloss"></div>
          </div>
          <div class="mb-mid"></div>
        </div>
        <div class="mb-tip mb-tip-r"></div>
      </div>

      <span class="mb-score mb-score-r" :class="{ bright: b !== null && a !== null && b > a }">
        {{ b !== null ? b.toFixed(1) : '—' }}
      </span>
    </div>
  </div>
</template>

<style>
.mb { margin-bottom: 12px; position: relative; }
.mb-label {
  text-align: center;
  font-size: 11px; letter-spacing: 2px;
  color: #c0d4e8; margin-bottom: 5px;
  font-family: 'Rajdhani', sans-serif;
  font-weight: 700; text-transform: uppercase;
  text-shadow: 0 1px 2px rgba(0,0,0,0.3);
}
.mb-row { display: flex; align-items: center; gap: 8px; }
.mb-score {
  width: 34px; text-align: right;
  font-weight: 700; font-size: 16px;
  color: #4a6a88;
  font-family: 'Rajdhani', sans-serif;
  transition: color 0.3s;
}
.mb-score-r { text-align: left; }
.mb-score.bright {
  color: #e0f0ff;
  text-shadow: 0 0 8px rgba(60, 200, 240, 0.5);
}

.mb-frame {
  flex: 1; display: flex; align-items: center;
  height: 22px;
}
.mb-tip {
  width: 0; height: 0; flex-shrink: 0; z-index: 2;
}
.mb-tip-l {
  border-top: 11px solid transparent;
  border-bottom: 11px solid transparent;
  border-right: 10px solid #b08028;
  filter: drop-shadow(1px 0 1px rgba(200,160,60,0.3));
}
.mb-tip-r {
  border-top: 11px solid transparent;
  border-bottom: 11px solid transparent;
  border-left: 10px solid #b08028;
  filter: drop-shadow(-1px 0 1px rgba(200,160,60,0.3));
}

.mb-track {
  flex: 1; height: 100%;
  position: relative;
  background: linear-gradient(180deg, #0e2038, #081428);
  border-top: 2px solid #c89830;
  border-bottom: 2px solid #8a6820;
  overflow: hidden;
  border-radius: 2px;
}

/* ═══ Fills ═══ */
.mb-fill {
  position: absolute;
  top: 0; height: 100%;
  background: linear-gradient(180deg,
    #5ce4f2 0%,
    #38d4e8 20%,
    #28c4dc 50%,
    #38d4e8 80%,
    #5ce4f2 100%
  );
  box-shadow:
    0 0 10px rgba(50, 215, 240, 0.5),
    0 0 22px rgba(50, 215, 240, 0.2);
  transition: width 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}

.mb-fill-a { right: 50%; }
.mb-fill-b { left: 50%; }

.mb-gloss {
  position: absolute;
  top: 0; left: 0; right: 0;
  height: 40%;
  background: linear-gradient(180deg,
    rgba(180, 250, 255, 0.35) 0%,
    rgba(180, 250, 255, 0.05) 60%,
    transparent 100%
  );
  pointer-events: none;
}

.mb-mid {
  position: absolute;
  left: 50%; top: 0;
  width: 1px; height: 100%;
  background: rgba(100, 150, 180, 0.3);
  transform: translateX(-50%);
  z-index: 1;
}
</style>
