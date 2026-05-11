<script setup lang="ts">
import { computed } from 'vue'
import { useFilterStore } from '@/stores/filterStore'
import { useMapStore } from '@/stores/mapStore'
import { getSchoolById } from '@/data/schools'
import type { Philosopher } from '@/types'

const filterStore = useFilterStore()
const mapStore = useMapStore()

// 按影响力排序的哲学家列表
const sortedPhilosophers = computed(() => {
  return [...filterStore.filteredPhilosophers].sort((a, b) => b.importance - a.importance)
})

// 列表统计
const listStats = computed(() => ({
  total: filterStore.filterStats.total,
  filtered: sortedPhilosophers.value.length,
  showing: Math.min(sortedPhilosophers.value.length, 100)
}))

// 格式化年份显示
const formatYear = (year: number): string => {
  if (year < 0) return `${Math.abs(year)} BCE`
  return `${year} CE`
}

// 获取哲学家的主要学派颜色
const getPrimarySchoolColor = (philosopher: Philosopher): string => {
  if (philosopher.schools.length === 0) return '#999'
  const school = getSchoolById(philosopher.schools[0])
  return school?.color ?? '#999'
}

// 获取生卒年显示文本
const getLifeSpan = (philosopher: Philosopher): string => {
  const birth = formatYear(philosopher.birth.year)
  const death = philosopher.death ? formatYear(philosopher.death.year) : '至今'
  return `${birth} - ${death}`
}

// 点击哲学家：选中并飞行到地图位置
const handleClick = (philosopher: Philosopher) => {
  mapStore.selectPhilosopher(philosopher)
  mapStore.flyToLocation(philosopher.birth.location, 8)
}

// Hover处理
const handleMouseEnter = (philosopher: Philosopher) => {
  mapStore.hoverPhilosopher(philosopher)
}

const handleMouseLeave = () => {
  mapStore.hoverPhilosopher(null)
}

// 是否当前选中
const isSelected = (philosopher: Philosopher): boolean => {
  return mapStore.selectedPhilosopher?.id === philosopher.id
}

// 是否被Hover
const isHovered = (philosopher: Philosopher): boolean => {
  return mapStore.hoveredPhilosopher?.id === philosopher.id
}
</script>

<template>
  <div class="philosopher-list">
    <!-- 列表头部统计 -->
    <div class="list-header">
      <div class="stats">
        <span class="stats-count">{{ listStats.filtered }}</span>
        <span class="stats-label">位哲学家</span>
        <span
          v-if="listStats.filtered !== listStats.total"
          class="stats-total"
        >
          / 共 {{ listStats.total }} 位
        </span>
      </div>
      <div
        v-if="sortedPhilosophers.length > 100"
        class="stats-hint"
      >
        显示前 100 位
      </div>
    </div>

    <!-- 哲学家列表 -->
    <div class="list-container">
      <div
        v-for="philosopher in sortedPhilosophers.slice(0, 100)"
        :key="philosopher.id"
        class="philosopher-item"
        :class="{
          'is-selected': isSelected(philosopher),
          'is-hovered': isHovered(philosopher)
        }"
        @click="handleClick(philosopher)"
        @mouseenter="handleMouseEnter(philosopher)"
        @mouseleave="handleMouseLeave"
      >
        <!-- 学派颜色条 -->
        <div
          class="school-indicator"
          :style="{ backgroundColor: getPrimarySchoolColor(philosopher) }"
        />

        <!-- 哲学家信息 -->
        <div class="philosopher-info">
          <div class="philosopher-name">
            {{ philosopher.name.zh }}
            <span
              v-if="philosopher.name.original"
              class="original-name"
            >
              {{ philosopher.name.original }}
            </span>
          </div>
          <div class="philosopher-meta">
            <span class="life-span">{{ getLifeSpan(philosopher) }}</span>
            <span class="importance-score">
              影响力: {{ philosopher.importance.toFixed(1) }}
            </span>
          </div>
        </div>

        <!-- 选中指示器 -->
        <div
          v-if="isSelected(philosopher)"
          class="selected-indicator"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
          >
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>
      </div>

      <!-- 空状态 -->
      <div
        v-if="sortedPhilosophers.length === 0"
        class="empty-state"
      >
        <div class="empty-icon">🔍</div>
        <div class="empty-title">未找到匹配的哲学家</div>
        <div class="empty-hint">
          尝试调整筛选条件或时间范围
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.philosopher-list {
  display: flex;
  flex-direction: column;
  height: 100%;
}

/* 列表头部 */
.list-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  border-bottom: 1px solid #e0e0e0;
  background: #fafafa;
}

.stats {
  display: flex;
  align-items: baseline;
  gap: 4px;
}

.stats-count {
  font-size: 18px;
  font-weight: 700;
  color: #333;
}

.stats-label {
  font-size: 13px;
  color: #666;
}

.stats-total {
  font-size: 12px;
  color: #999;
}

.stats-hint {
  font-size: 11px;
  color: #999;
  padding: 2px 8px;
  background: #e8e8e8;
  border-radius: 10px;
}

/* 列表容器 */
.list-container {
  flex: 1;
  overflow-y: auto;
  padding: 8px;
}

/* 哲学家项 */
.philosopher-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  margin-bottom: 4px;
}

.philosopher-item:hover {
  background: #f5f5f5;
}

.philosopher-item.is-hovered {
  background: #e8f4fd;
}

.philosopher-item.is-selected {
  background: #d0e8f9;
  box-shadow: 0 0 0 2px #4A90E2;
}

/* 学派指示器 */
.school-indicator {
  width: 4px;
  height: 40px;
  border-radius: 2px;
  flex-shrink: 0;
}

/* 哲学家信息 */
.philosopher-info {
  flex: 1;
  min-width: 0;
}

.philosopher-name {
  font-size: 14px;
  font-weight: 600;
  color: #333;
  margin-bottom: 4px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.original-name {
  font-size: 12px;
  font-weight: 400;
  color: #666;
  margin-left: 4px;
}

.philosopher-meta {
  display: flex;
  gap: 12px;
  font-size: 12px;
  color: #888;
}

.life-span {
  font-family: 'SF Mono', Monaco, monospace;
}

.importance-score {
  color: #999;
}

/* 选中指示器 */
.selected-indicator {
  width: 20px;
  height: 20px;
  color: #4A90E2;
  flex-shrink: 0;
}

.selected-indicator svg {
  width: 100%;
  height: 100%;
}

/* 空状态 */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 48px 24px;
  text-align: center;
}

.empty-icon {
  font-size: 32px;
  margin-bottom: 12px;
  opacity: 0.6;
}

.empty-title {
  font-size: 14px;
  font-weight: 600;
  color: #666;
  margin-bottom: 4px;
}

.empty-hint {
  font-size: 12px;
  color: #999;
}

/* 滚动条样式 */
.list-container::-webkit-scrollbar {
  width: 6px;
}

.list-container::-webkit-scrollbar-track {
  background: transparent;
}

.list-container::-webkit-scrollbar-thumb {
  background: #ccc;
  border-radius: 3px;
}

.list-container::-webkit-scrollbar-thumb:hover {
  background: #aaa;
}
</style>
