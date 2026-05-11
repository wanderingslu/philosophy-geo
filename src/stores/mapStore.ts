import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Philosopher, GeoPoint } from '@/types'

export const useMapStore = defineStore('map', () => {
  const center = ref<GeoPoint>({ lat: 30, lng: 20 })
  const zoom = ref(3)
  const selectedPhilosopher = ref<Philosopher | null>(null)
  const hoveredPhilosopher = ref<Philosopher | null>(null)

  const mapConfig = computed(() => ({
    center: center.value,
    zoom: zoom.value
  }))

  const setCenter = (newCenter: GeoPoint) => { center.value = newCenter }
  const setZoom = (newZoom: number) => { zoom.value = newZoom }
  const selectPhilosopher = (philosopher: Philosopher | null) => { selectedPhilosopher.value = philosopher }
  const hoverPhilosopher = (philosopher: Philosopher | null) => { hoveredPhilosopher.value = philosopher }
  const flyToLocation = (location: GeoPoint, targetZoom = 8) => {
    center.value = location
    zoom.value = targetZoom
  }

  return { center, zoom, selectedPhilosopher, hoveredPhilosopher, mapConfig, setCenter, setZoom, selectPhilosopher, hoverPhilosopher, flyToLocation }
})
