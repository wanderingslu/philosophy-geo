<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch, computed } from 'vue'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { useMapStore } from '@/stores/mapStore'
import { useFilterStore } from '@/stores/filterStore'
import { getSchoolById } from '@/data/schools'
import type { Philosopher } from '@/types'

const mapStore = useMapStore()
const filterStore = useFilterStore()

const mapContainer = ref<HTMLElement | null>(null)
let map: L.Map | null = null
let markersLayer: L.LayerGroup | null = null

// 获取哲学家标记颜色（基于学派）
const getPhilosopherColor = (philosopher: Philosopher): string => {
  if (philosopher.schools.length === 0) return '#888888'
  const school = getSchoolById(philosopher.schools[0])
  return school?.color || '#888888'
}

// 获取哲学家标记大小（基于importance）
const getMarkerSize = (philosopher: Philosopher): number => {
  return 20 + philosopher.importance * 3
}

// 创建自定义标记
const createCustomMarker = (philosopher: Philosopher, isSelected: boolean, isHovered: boolean): L.DivIcon => {
  const size = getMarkerSize(philosopher)
  const color = getPhilosopherColor(philosopher)
  const scale = isHovered || isSelected ? 1.3 : 1
  const finalSize = size * scale

  return L.divIcon({
    className: 'philosopher-marker',
    html: `
      <div class="marker-container ${isSelected ? 'selected' : ''} ${isHovered ? 'hovered' : ''}"
           style="
             width: ${finalSize}px;
             height: ${finalSize}px;
             background-color: ${color};
             border-radius: 50%;
             border: 3px solid white;
             box-shadow: 0 2px 8px rgba(0,0,0,0.4), 0 0 0 2px ${color};
             display: flex;
             align-items: center;
             justify-content: center;
             transition: all 0.3s ease;
             cursor: pointer;
           ">
        <span class="marker-initial" style="
          color: white;
          font-weight: bold;
          font-size: ${finalSize * 0.4}px;
          text-shadow: 0 1px 2px rgba(0,0,0,0.3);
        ">${philosopher.name.zh.charAt(0)}</span>
      </div>
      ${isHovered ? `
        <div class="marker-label" style="
          position: absolute;
          top: -30px;
          left: 50%;
          transform: translateX(-50%);
          background: rgba(0,0,0,0.8);
          color: white;
          padding: 4px 8px;
          border-radius: 4px;
          font-size: 12px;
          white-space: nowrap;
          pointer-events: none;
          z-index: 1000;
        ">${philosopher.name.zh}</div>
      ` : ''}
    `,
    iconSize: [finalSize, finalSize],
    iconAnchor: [finalSize / 2, finalSize / 2],
    popupAnchor: [0, -finalSize / 2]
  })
}

// 创建或更新标记
const updateMarkers = () => {
  if (!map || !markersLayer) return

  // 清除现有标记
  markersLayer.clearLayers()

  // 为每个筛选后的哲学家创建标记
  filterStore.filteredPhilosophers.forEach(philosopher => {
    const isSelected = mapStore.selectedPhilosopher?.id === philosopher.id
    const isHovered = mapStore.hoveredPhilosopher?.id === philosopher.id

    const marker = L.marker(
      [philosopher.birth.location.lat, philosopher.birth.location.lng],
      {
        icon: createCustomMarker(philosopher, isSelected, isHovered),
        zIndexOffset: isSelected ? 1000 : isHovered ? 500 : philosopher.importance * 10
      }
    )

    // 点击事件：选中哲学家
    marker.on('click', () => {
      mapStore.selectPhilosopher(philosopher)
    })

    // Hover事件
    marker.on('mouseover', () => {
      mapStore.hoverPhilosopher(philosopher)
    })

    marker.on('mouseout', () => {
      mapStore.hoverPhilosopher(null)
    })

    markersLayer?.addLayer(marker)
  })
}

// 飞行动画到指定位置
const flyToPhilosopher = (philosopher: Philosopher | null) => {
  if (!map || !philosopher) return

  const location = philosopher.birth.location
  map.flyTo([location.lat, location.lng], 8, {
    duration: 1.5,
    easeLinearity: 0.25
  })
}

// 初始化地图
onMounted(() => {
  if (!mapContainer.value) return

  // 创建地图实例
  map = L.map(mapContainer.value, {
    center: [mapStore.center.lat, mapStore.center.lng],
    zoom: mapStore.zoom,
    zoomControl: false,
    attributionControl: false
  })

  // 添加缩放控件到右下角
  L.control.zoom({
    position: 'bottomright'
  }).addTo(map)

  // 添加简洁的深色底图（使用CartoDB Dark Matter，但限制范围不连续）
  L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; OpenStreetMap &copy; CARTO',
    subdomains: 'abcd',
    maxZoom: 19,
    noWrap: true,
    bounds: [[-90, -180], [90, 180]]
  }).addTo(map)

  // 设置地图最大边界，防止无限滚动
  map.setMaxBounds([[-90, -180], [90, 180]])

  // 创建标记图层组
  markersLayer = L.layerGroup().addTo(map)

  // 监听地图移动事件，同步到store
  map.on('moveend', () => {
    if (map) {
      const center = map.getCenter()
      mapStore.setCenter({ lat: center.lat, lng: center.lng })
      mapStore.setZoom(map.getZoom())
    }
  })

  // 初始化标记
  updateMarkers()
})

// 清理
onUnmounted(() => {
  if (map) {
    map.remove()
    map = null
  }
  markersLayer = null
})

// 监听筛选后的哲学家变化，更新标记
watch(() => filterStore.filteredPhilosophers, () => {
  updateMarkers()
}, { deep: true })

// 监听选中哲学家变化，飞行动画
watch(() => mapStore.selectedPhilosopher, (newPhilosopher) => {
  updateMarkers()
  flyToPhilosopher(newPhilosopher)
})

// 监听hover哲学家变化，更新标记样式
watch(() => mapStore.hoveredPhilosopher, () => {
  updateMarkers()
})
</script>

<template>
  <div ref="mapContainer" class="leaflet-map"></div>
</template>

<style scoped>
.leaflet-map {
  width: 100%;
  height: 100%;
  background: #1a1a1a;
}

:global(.philosopher-marker) {
  background: transparent !important;
  border: none !important;
}

:global(.marker-container) {
  position: relative;
}

:global(.marker-container.selected) {
  box-shadow: 0 0 0 4px white, 0 0 0 6px currentColor, 0 4px 12px rgba(0,0,0,0.5) !important;
}

:global(.marker-container.hovered) {
  filter: brightness(1.2);
}

:global(.leaflet-popup-content-wrapper) {
  background: rgba(30, 30, 30, 0.95);
  color: white;
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

:global(.leaflet-popup-tip) {
  background: rgba(30, 30, 30, 0.95);
}

:global(.leaflet-container) {
  background: #1a1a1a;
}
</style>
