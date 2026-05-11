<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue'
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
let networkLayer: L.LayerGroup | null = null
let networkSvgLayer: L.SVG | null = null

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

  // 添加浅色底图（使用CartoDB Positron for light theme）
  L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
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

  // 创建网络关系图层组（在标记图层之上）
  networkLayer = L.layerGroup().addTo(map)

  // 监听地图移动事件，同步到store
  map.on('moveend', () => {
    if (map) {
      const center = map.getCenter()
      mapStore.setCenter({ lat: center.lat, lng: center.lng })
      mapStore.setZoom(map.getZoom())
    }
  })

  // 初始化标记和网络
  updateMarkers()
  updateNetworkLayer()

  // 自适应缩放以适应所有标记
  setTimeout(() => {
    fitMapToMarkers()
  }, 100)
})

// 自适应缩放以适应所有标记
const fitMapToMarkers = () => {
  if (!map || filterStore.filteredPhilosophers.length === 0) return

  const bounds = L.latLngBounds(
    filterStore.filteredPhilosophers.map(p => [p.birth.location.lat, p.birth.location.lng])
  )

  map.fitBounds(bounds, {
    padding: [50, 50],
    maxZoom: 8,
    minZoom: 2,
    animate: true,
    duration: 1
  })
}

// 更新网络层（显示影响关系连线）
const updateNetworkLayer = async () => {
  if (!map || !networkLayer) return

  // 清除现有网络线
  networkLayer.clearLayers()

  const philosophers = filterStore.filteredPhilosophers
  const philoIds = new Set(philosophers.map(p => p.id))

  // 为每个哲学家绘制影响关系线
  philosophers.forEach(sourcePhilosopher => {
    sourcePhilosopher.influences.forEach(targetId => {
      // 只绘制双方都在当前筛选中的关系
      if (!philoIds.has(targetId)) return

      const targetPhilosopher = philosophers.find(p => p.id === targetId)
      if (!targetPhilosopher) return

      const sourceLatLng = [sourcePhilosopher.birth.location.lat, sourcePhilosopher.birth.location.lng]
      const targetLatLng = [targetPhilosopher.birth.location.lat, targetPhilosopher.birth.location.lng]

      // 创建带箭头的曲线
      const latlngs = [sourceLatLng as L.LatLngExpression, targetLatLng as L.LatLngExpression]

      // 绘制连线
      const polyline = L.polyline(latlngs, {
        color: '#64ffda',
        weight: 2,
        opacity: 0.6,
        dashArray: '5, 5',
        className: 'network-line'
      }).addTo(networkLayer!)

      // 添加箭头标记（在目标点）
      const arrowIcon = L.divIcon({
        className: 'network-arrow',
        html: `
          <svg width="12" height="12" viewBox="0 0 12 12" style="transform: rotate(${getAngle(sourceLatLng, targetLatLng)}deg)">
            <polygon points="6,12 0,0 12,0" fill="#64ffda" opacity="0.8"/>
          </svg>
        `,
        iconSize: [12, 12],
        iconAnchor: [6, 6]
      })

      // 在目标位置附近放置箭头
      const arrowLatLng = getArrowPosition(sourceLatLng, targetLatLng, 0.85)
      L.marker(arrowLatLng as L.LatLngExpression, { icon: arrowIcon, interactive: false }).addTo(networkLayer!)
    })
  })
}

// 计算两点角度（用于箭头旋转）
const getAngle = (from: number[], to: number[]): number => {
  const dx = to[1] - from[1]
  const dy = to[0] - from[0]
  return Math.atan2(dy, dx) * 180 / Math.PI + 90
}

// 计算箭头位置（在线段的某个百分比位置）
const getArrowPosition = (from: number[], to: number[], ratio: number): number[] => {
  return [
    from[0] + (to[0] - from[0]) * ratio,
    from[1] + (to[1] - from[1]) * ratio
  ]
}

// 清理
onUnmounted(() => {
  if (map) {
    map.remove()
    map = null
  }
  markersLayer = null
  networkLayer = null
  networkSvgLayer = null
})

// 监听筛选后的哲学家变化，更新标记和网络，并自适应缩放
watch(() => filterStore.filteredPhilosophers, () => {
  updateMarkers()
  updateNetworkLayer()
  fitMapToMarkers()
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
  background: oklch(95% 0.005 var(--brand-hue));
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
  background: var(--bg-secondary);
  color: var(--text-primary);
  border-radius: 8px;
  border: 1px solid var(--border-color);
  box-shadow: 0 4px 16px var(--shadow-elevated);
}

:global(.leaflet-popup-tip) {
  background: var(--bg-secondary);
}

:global(.leaflet-container) {
  background: oklch(95% 0.005 var(--brand-hue));
}

/* 网络连线样式 */
:global(.network-line) {
  pointer-events: none;
}

:global(.network-arrow) {
  pointer-events: none;
  background: transparent;
  border: none;
}
</style>
