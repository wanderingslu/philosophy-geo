<script setup lang="ts">
import { onMounted, watch, ref } from 'vue'
import { useMapStore } from '@/stores/mapStore'
import { useFilterStore } from '@/stores/filterStore'
import { useTimeStore } from '@/stores/timeStore'
import { philosophers } from '@/data/philosophers'
import type { Philosopher, School } from '@/types'

// Components
import GlobalSearch from '@/components/Search/GlobalSearch.vue'
import FilterPanel from '@/components/Sidebar/FilterPanel.vue'
import PhilosopherList from '@/components/Sidebar/PhilosopherList.vue'
import LeafletMap from '@/components/Map/LeafletMap.vue'
import PhilosopherDetail from '@/components/Map/PhilosopherDetail.vue'
import TimelineBar from '@/components/Timeline/TimelineBar.vue'
import NetworkGraph from '@/components/Network/NetworkGraph.vue'

const mapStore = useMapStore()
const filterStore = useFilterStore()
const timeStore = useTimeStore()

// 当前视图状态: 'map' | 'network'
const currentView = ref('map')

// 初始化数据
onMounted(() => {
  filterStore.setPhilosophers(philosophers)
})

// 处理搜索选择哲学家
const handleSelectPhilosopher = (philosopher: Philosopher) => {
  mapStore.selectPhilosopher(philosopher)
  mapStore.flyToLocation(philosopher.birth.location, 8)
}

// 处理搜索选择学派
const handleSelectSchool = (school: School) => {
  // 可以在这里添加学派筛选逻辑
  filterStore.selectSchools([school.id])
}

// 处理时间轴范围变化
const handleTimeRangeChange = (range: { start: number; end: number }) => {
  timeStore.setTimeRange(range)
}

// 监听选中哲学家变化，当选择新哲学家时更新详情
watch(() => mapStore.selectedPhilosopher, (newPhilosopher) => {
  if (newPhilosopher) {
    // 哲学家详情会自动显示
  }
})

// 关闭详情弹窗
const handleCloseDetail = () => {
  mapStore.selectPhilosopher(null)
}

// 切换视图
const switchView = (view: string) => {
  currentView.value = view
}
</script>

<template>
  <div class="app">
    <!-- 顶部导航栏 -->
    <header class="header">
      <div class="logo">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="10"/>
          <path d="M2 12h20"/>
          <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
        </svg>
        <span class="logo-text">Philosophy Geo</span>
      </div>

      <div class="search-wrapper">
        <GlobalSearch
          @select-philosopher="handleSelectPhilosopher"
          @select-school="handleSelectSchool"
        />
      </div>

      <nav class="view-nav">
        <button
          class="nav-btn"
          :class="{ active: currentView === 'map' }"
          @click="switchView('map')"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
            <circle cx="12" cy="10" r="3"/>
          </svg>
          地图
        </button>
        <button
          class="nav-btn"
          :class="{ active: currentView === 'network' }"
          @click="switchView('network')"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="3"/>
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/>
          </svg>
          网络
        </button>
      </nav>
    </header>

    <!-- 主内容区 -->
    <main class="main">
      <!-- 侧边栏 -->
      <aside class="sidebar">
        <div class="sidebar-content">
          <FilterPanel />
          <div class="divider"></div>
          <PhilosopherList />
        </div>
      </aside>

      <!-- 地图/网络视图区域 -->
      <div class="map-container">
        <LeafletMap v-if="currentView === 'map'" />
        <NetworkGraph v-else-if="currentView === 'network'" />
      </div>
    </main>

    <!-- 时间轴 -->
    <footer class="timeline-wrapper">
      <TimelineBar @update:range="handleTimeRangeChange" />
    </footer>

    <!-- 哲学家详情弹窗 -->
    <PhilosopherDetail
      :philosopher="mapStore.selectedPhilosopher"
      @close="handleCloseDetail"
      @select-philosopher="handleSelectPhilosopher"
    />
  </div>
</template>

<style>
/* CSS Variables - Impeccable Light Theme */
:root {
  /* Brand hue: 260 (blue-purple for wisdom/depth) */
  --brand-hue: 260;
  --neutral-chroma: 0.005;

  /* Backgrounds - tinted whites, never pure #fff */
  --bg-primary: oklch(97% 0.005 var(--brand-hue));
  --bg-secondary: oklch(100% 0.008 var(--brand-hue));
  --bg-tertiary: oklch(94% 0.01 var(--brand-hue));

  /* Text - dark on light surfaces */
  --text-primary: oklch(25% 0.02 var(--brand-hue));
  --text-secondary: oklch(45% 0.015 var(--brand-hue));
  --text-tertiary: oklch(55% 0.01 var(--brand-hue));

  /* Accents - vibrant in light mode */
  --accent-color: oklch(55% 0.18 var(--brand-hue));
  --accent-secondary: oklch(70% 0.15 180);
  --accent-hover: oklch(48% 0.2 var(--brand-hue));

  /* Borders - subtle tinted borders */
  --border-color: oklch(85% 0.01 var(--brand-hue));

  /* Shadows for depth in light mode */
  --shadow-color: oklch(60% 0.02 var(--brand-hue) / 0.12);
  --shadow-elevated: oklch(50% 0.02 var(--brand-hue) / 0.15);
}

/* Global Reset */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html, body {
  height: 100%;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  background: var(--bg-primary);
  color: var(--text-primary);
  overflow: hidden;
}

/* Scrollbar Styles - Light theme */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: var(--bg-secondary);
}

::-webkit-scrollbar-thumb {
  background: oklch(70% 0.02 var(--brand-hue));
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: oklch(60% 0.03 var(--brand-hue));
}

/* Firefox Scrollbar */
* {
  scrollbar-width: thin;
  scrollbar-color: oklch(70% 0.02 var(--brand-hue)) var(--bg-secondary);
}

/* App Layout */
.app {
  height: 100vh;
  display: flex;
  flex-direction: column;
  background: var(--bg-primary);
}

/* Header - Light theme with subtle shadow */
.header {
  height: 64px;
  background: var(--bg-secondary);
  border-bottom: 1px solid var(--border-color);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;
  gap: 24px;
  flex-shrink: 0;
  box-shadow: 0 1px 3px var(--shadow-color);
}

.logo {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-shrink: 0;
}

.logo svg {
  width: 32px;
  height: 32px;
  color: var(--accent-color);
}

.logo-text {
  font-size: 20px;
  font-weight: 700;
  color: var(--accent-color);
}

.search-wrapper {
  flex: 1;
  max-width: 480px;
  display: flex;
  justify-content: center;
}

.view-nav {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
}

.nav-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  background: var(--bg-primary);
  color: var(--text-secondary);
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.nav-btn:hover {
  background: oklch(95% 0.01 var(--brand-hue));
  color: var(--text-primary);
  border-color: oklch(75% 0.02 var(--brand-hue));
}

.nav-btn.active {
  background: oklch(92% 0.03 var(--brand-hue));
  border-color: var(--accent-color);
  color: var(--accent-color);
}

.nav-btn svg {
  width: 16px;
  height: 16px;
}

/* Main Content */
.main {
  flex: 1;
  display: flex;
  overflow: hidden;
}

/* Sidebar - Light theme */
.sidebar {
  width: 320px;
  flex-shrink: 0;
  background: var(--bg-secondary);
  border-right: 1px solid var(--border-color);
  overflow: hidden;
  box-shadow: 2px 0 8px var(--shadow-color);
}

.sidebar-content {
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.sidebar .divider {
  height: 1px;
  background: var(--border-color);
  margin: 0 16px;
}

/* Map Container - Light theme */
.map-container {
  flex: 1;
  position: relative;
  overflow: hidden;
  background: oklch(92% 0.005 var(--brand-hue));
}

/* Timeline Wrapper - Light theme */
.timeline-wrapper {
  padding: 16px 24px;
  background: var(--bg-secondary);
  border-top: 1px solid var(--border-color);
  flex-shrink: 0;
  box-shadow: 0 -2px 8px var(--shadow-color);
}

/* Responsive Design */
@media (max-width: 1024px) {
  .sidebar {
    width: 280px;
  }
}

@media (max-width: 768px) {
  .header {
    padding: 0 16px;
    gap: 12px;
  }

  .logo-text {
    display: none;
  }

  .search-wrapper {
    max-width: none;
  }

  .nav-btn {
    padding: 8px 12px;
  }

  .nav-btn span {
    display: none;
  }

  .sidebar {
    position: absolute;
    left: 0;
    top: 64px;
    bottom: 0;
    z-index: 100;
    transform: translateX(-100%);
    transition: transform 0.3s ease;
  }

  .sidebar.open {
    transform: translateX(0);
  }

  .timeline-wrapper {
    padding: 12px 16px;
  }
}

/* Selection and Focus Styles - Light theme */
::selection {
  background: oklch(85% 0.08 var(--brand-hue));
  color: var(--text-primary);
}

/* Focus Visible */
:focus-visible {
  outline: 2px solid var(--accent-color);
  outline-offset: 2px;
}

/* Button Reset */
button {
  font-family: inherit;
}

/* Transition Defaults */
* {
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
}
</style>
