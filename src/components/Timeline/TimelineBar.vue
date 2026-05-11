<template>
  <div class="timeline-bar">
    <div class="timeline-header">
      <div class="time-range-display">
        <span class="time-label">{{ formatYear(startYear) }}</span>
        <span class="time-separator">-</span>
        <span class="time-label">{{ formatYear(endYear) }}</span>
      </div>
      <div class="timeline-controls">
        <button class="control-btn reset-btn" @click="resetRange" title="重置">
          <svg viewBox="0 0 24 24" width="16" height="16">
            <path fill="currentColor" d="M12 5V1L7 6l5 5V7c3.31 0 6 2.69 6 6s-2.69 6-6 6-6-2.69-6-6H4c0 4.42 3.58 8 8 8s8-3.58 8-8-3.58-8-8-8z"/>
          </svg>
        </button>
        <button class="control-btn play-btn" @click="togglePlay" :title="isPlaying ? '暂停' : '播放'">
          <svg v-if="!isPlaying" viewBox="0 0 24 24" width="20" height="20">
            <path fill="currentColor" d="M8 5v14l11-7z"/>
          </svg>
          <svg v-else viewBox="0 0 24 24" width="20" height="20">
            <path fill="currentColor" d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>
          </svg>
        </button>
        <div class="speed-controls">
          <button
            v-for="speed in speeds"
            :key="speed"
            class="speed-btn"
            :class="{ active: currentSpeed === speed }"
            @click="setSpeed(speed)"
          >
            {{ speed }}x
          </button>
        </div>
      </div>
    </div>

    <div class="timeline-slider-container">
      <div class="timeline-track">
        <div class="timeline-range" :style="rangeStyle"></div>
        <input
          type="range"
          class="slider slider-start"
          :min="MIN_YEAR"
          :max="MAX_YEAR"
          :value="startYear"
          @input="onStartInput"
        />
        <input
          type="range"
          class="slider slider-end"
          :min="MIN_YEAR"
          :max="MAX_YEAR"
          :value="endYear"
          @input="onEndInput"
        />
      </div>
      <div class="timeline-labels">
        <span class="label">{{ formatYear(MIN_YEAR) }}</span>
        <span class="label">公元元年</span>
        <span class="label">{{ formatYear(MAX_YEAR) }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onUnmounted } from 'vue'

// Constants
const MIN_YEAR = -800
const MAX_YEAR = 2024
const DEFAULT_START = -800
const DEFAULT_END = 2024
const SPEEDS = [1, 2, 5] as const

// Types
type Speed = typeof SPEEDS[number]

// Emits
const emit = defineEmits<{
  (e: 'update:range', range: { start: number; end: number }): void
  (e: 'play'): void
  (e: 'pause'): void
}>()

// State
const startYear = ref(DEFAULT_START)
const endYear = ref(DEFAULT_END)
const isPlaying = ref(false)
const currentSpeed = ref<Speed>(1)
const speeds: Speed[] = [...SPEEDS]

let playInterval: ReturnType<typeof setInterval> | null = null

// Computed
const rangeStyle = computed(() => {
  const totalRange = MAX_YEAR - MIN_YEAR
  const startPercent = ((startYear.value - MIN_YEAR) / totalRange) * 100
  const endPercent = ((endYear.value - MIN_YEAR) / totalRange) * 100
  const width = endPercent - startPercent

  return {
    left: `${startPercent}%`,
    width: `${width}%`
  }
})

// Methods
function formatYear(year: number): string {
  if (year < 0) {
    return `公元前${Math.abs(year)}年`
  } else if (year === 0) {
    return '公元元年'
  } else {
    return `${year}年`
  }
}

function onStartInput(event: Event) {
  const target = event.target as HTMLInputElement
  const value = parseInt(target.value)

  if (value >= endYear.value) {
    startYear.value = endYear.value - 10
  } else {
    startYear.value = value
  }

  emitRange()
}

function onEndInput(event: Event) {
  const target = event.target as HTMLInputElement
  const value = parseInt(target.value)

  if (value <= startYear.value) {
    endYear.value = startYear.value + 10
  } else {
    endYear.value = value
  }

  emitRange()
}

function emitRange() {
  emit('update:range', {
    start: startYear.value,
    end: endYear.value
  })
}

function resetRange() {
  startYear.value = DEFAULT_START
  endYear.value = DEFAULT_END
  stopPlay()
  emitRange()
}

function togglePlay() {
  isPlaying.value = !isPlaying.value
}

function setSpeed(speed: Speed) {
  currentSpeed.value = speed
  if (isPlaying.value) {
    stopPlay()
    startPlay()
  }
}

function startPlay() {
  if (playInterval) {
    clearInterval(playInterval)
  }

  const step = 5 * currentSpeed.value

  playInterval = setInterval(() => {
    if (endYear.value >= MAX_YEAR) {
      stopPlay()
      return
    }

    // 播放时左端点固定，仅右端点移动
    endYear.value = Math.min(endYear.value + step, MAX_YEAR)

    emitRange()
  }, 100)

  emit('play')
}

function stopPlay() {
  if (playInterval) {
    clearInterval(playInterval)
    playInterval = null
  }
  isPlaying.value = false
  emit('pause')
}

// Watch
watch(isPlaying, (playing) => {
  if (playing) {
    startPlay()
  } else {
    stopPlay()
  }
})

// Cleanup
onUnmounted(() => {
  if (playInterval) {
    clearInterval(playInterval)
  }
})
</script>

<style scoped>
.timeline-bar {
  background: linear-gradient(180deg, #1a1a2e 0%, #16213e 100%);
  border-radius: 12px;
  padding: 16px 20px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.timeline-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.time-range-display {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 18px;
  font-weight: 600;
  color: #e94560;
}

.time-label {
  background: rgba(233, 69, 96, 0.15);
  padding: 6px 12px;
  border-radius: 6px;
  border: 1px solid rgba(233, 69, 96, 0.3);
}

.time-separator {
  color: #8892b0;
  font-weight: 400;
}

.timeline-controls {
  display: flex;
  align-items: center;
  gap: 12px;
}

.control-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: 8px;
  border: none;
  background: rgba(255, 255, 255, 0.1);
  color: #ccd6f6;
  cursor: pointer;
  transition: all 0.2s ease;
}

.control-btn:hover {
  background: rgba(233, 69, 96, 0.3);
  color: #e94560;
  transform: scale(1.05);
}

.play-btn {
  width: 44px;
  height: 44px;
  background: linear-gradient(135deg, #e94560 0%, #c73e54 100%);
  color: white;
}

.play-btn:hover {
  background: linear-gradient(135deg, #f05670 0%, #d84e64 100%);
  color: white;
}

.speed-controls {
  display: flex;
  gap: 4px;
  background: rgba(255, 255, 255, 0.05);
  padding: 4px;
  border-radius: 6px;
}

.speed-btn {
  padding: 6px 10px;
  border: none;
  border-radius: 4px;
  background: transparent;
  color: #8892b0;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.speed-btn:hover {
  color: #ccd6f6;
}

.speed-btn.active {
  background: rgba(233, 69, 96, 0.3);
  color: #e94560;
}

.timeline-slider-container {
  position: relative;
}

.timeline-track {
  position: relative;
  height: 8px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 4px;
  margin: 20px 0;
}

.timeline-range {
  position: absolute;
  height: 100%;
  background: linear-gradient(90deg, #e94560 0%, #f3949f 100%);
  border-radius: 4px;
  pointer-events: none;
}

.slider {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 100%;
  height: 24px;
  -webkit-appearance: none;
  appearance: none;
  background: transparent;
  cursor: pointer;
  pointer-events: none;
}

.slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: #e94560;
  border: 3px solid #1a1a2e;
  cursor: grab;
  pointer-events: auto;
  box-shadow: 0 2px 8px rgba(233, 69, 96, 0.4);
  transition: transform 0.2s ease;
}

.slider::-webkit-slider-thumb:hover {
  transform: scale(1.2);
}

.slider::-webkit-slider-thumb:active {
  cursor: grabbing;
}

.slider::-moz-range-thumb {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: #e94560;
  border: 3px solid #1a1a2e;
  cursor: grab;
  pointer-events: auto;
  box-shadow: 0 2px 8px rgba(233, 69, 96, 0.4);
}

.slider-start {
  z-index: 2;
}

.slider-end {
  z-index: 1;
}

.timeline-labels {
  display: flex;
  justify-content: space-between;
  padding: 0 4px;
  font-size: 12px;
  color: #8892b0;
}

.label {
  font-weight: 500;
}
</style>
