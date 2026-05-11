import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { TimeRange } from '@/types'

export const useTimeStore = defineStore('time', () => {
  // 时间范围常量
  const MIN_YEAR = -800
  const MAX_YEAR = 2024

  // 状态
  const minYear = ref(MIN_YEAR)
  const maxYear = ref(MAX_YEAR)
  const currentRange = ref<TimeRange>({ start: MIN_YEAR, end: MAX_YEAR })
  const isPlaying = ref(false)
  const playSpeed = ref(100) // 毫秒/年

  // 计算属性
  const formattedRange = computed(() => {
    const formatYear = (year: number) => {
      if (year < 0) return `${Math.abs(year)} BCE`
      return `${year} CE`
    }
    return `${formatYear(currentRange.value.start)} - ${formatYear(currentRange.value.end)}`
  })

  const rangeSpan = computed(() => currentRange.value.end - currentRange.value.start)

  const progressPercentage = computed(() => {
    const totalSpan = maxYear.value - minYear.value
    const currentSpan = currentRange.value.end - minYear.value
    return (currentSpan / totalSpan) * 100
  })

  // 方法
  const setTimeRange = (range: TimeRange) => {
    currentRange.value = {
      start: Math.max(minYear.value, Math.min(range.start, maxYear.value)),
      end: Math.max(minYear.value, Math.min(range.end, maxYear.value))
    }
  }

  const setStartYear = (year: number) => {
    currentRange.value.start = Math.max(minYear.value, Math.min(year, currentRange.value.end))
  }

  const setEndYear = (year: number) => {
    currentRange.value.end = Math.max(currentRange.value.start, Math.min(year, maxYear.value))
  }

  const setPlaySpeed = (speed: number) => {
    playSpeed.value = Math.max(10, Math.min(speed, 2000))
  }

  const play = () => { isPlaying.value = true }
  const pause = () => { isPlaying.value = false }
  const togglePlay = () => { isPlaying.value = !isPlaying.value }

  const reset = () => {
    currentRange.value = { start: minYear.value, end: maxYear.value }
    isPlaying.value = false
  }

  const stepForward = (years = 10) => {
    const newEnd = Math.min(currentRange.value.end + years, maxYear.value)
    const span = currentRange.value.end - currentRange.value.start
    currentRange.value = {
      start: Math.max(minYear.value, newEnd - span),
      end: newEnd
    }
  }

  const stepBackward = (years = 10) => {
    const newStart = Math.max(currentRange.value.start - years, minYear.value)
    const span = currentRange.value.end - currentRange.value.start
    currentRange.value = {
      start: newStart,
      end: Math.min(maxYear.value, newStart + span)
    }
  }

  return {
    MIN_YEAR,
    MAX_YEAR,
    minYear,
    maxYear,
    currentRange,
    isPlaying,
    playSpeed,
    formattedRange,
    rangeSpan,
    progressPercentage,
    setTimeRange,
    setStartYear,
    setEndYear,
    setPlaySpeed,
    play,
    pause,
    togglePlay,
    reset,
    stepForward,
    stepBackward
  }
})
