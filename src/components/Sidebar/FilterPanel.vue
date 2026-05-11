<script setup lang="ts">
import { computed } from 'vue'
import { useFilterStore } from '@/stores/filterStore'
import { useTimeStore } from '@/stores/timeStore'
import { schools } from '@/data/schools'

const filterStore = useFilterStore()
const timeStore = useTimeStore()

// 时代跳转配置
const eraButtons = [
  { label: '古代', start: -800, end: 500 },
  { label: '中世纪', start: 500, end: 1500 },
  { label: '近代', start: 1500, end: 1900 },
  { label: '现代', start: 1900, end: 2024 }
]

// 可用的学派列表（基于当前时间范围）
const availableSchools = computed(() => {
  return schools.filter(school => {
    const { start, end } = school.period
    return start <= timeStore.currentRange.end && end >= timeStore.currentRange.start
  })
})

// 是否有激活的筛选
const hasActiveFilters = computed(() => {
  return filterStore.selectedSchools.length > 0
})

// 跳转到指定时代
const jumpToEra = (start: number, end: number) => {
  timeStore.setTimeRange({ start, end })
}

// 重置所有筛选
const resetFilters = () => {
  filterStore.resetFilters()
}
</script>

<template>
  <div class="filter-panel">
    <!-- 时代快速跳转 -->
    <div class="era-section">
      <h3 class="section-title">时代跳转</h3>
      <div class="era-buttons">
        <button
          v-for="era in eraButtons"
          :key="era.label"
          class="era-button"
          @click="jumpToEra(era.start, era.end)"
        >
          {{ era.label }}
        </button>
      </div>
    </div>

    <!-- 分隔线 -->
    <div class="divider" />

    <!-- 学派筛选 -->
    <div class="schools-section">
      <div class="section-header">
        <h3 class="section-title">学派筛选</h3>
        <button
          v-if="hasActiveFilters"
          class="reset-button"
          @click="resetFilters"
        >
          重置
        </button>
      </div>

      <div class="schools-list">
        <label
          v-for="school in availableSchools"
          :key="school.id"
          class="school-item"
          :class="{ 'is-selected': filterStore.isSchoolSelected(school.id) }"
        >
          <input
            type="checkbox"
            :checked="filterStore.isSchoolSelected(school.id)"
            @change="filterStore.toggleSchool(school.id)"
          >
          <span
            class="color-dot"
            :style="{ backgroundColor: school.color }"
          />
          <span class="school-name">{{ school.name.zh }}</span>
          <span class="school-count">
            ({{ filterStore.allPhilosophers.filter(p => p.schools.includes(school.id)).length }})
          </span>
        </label>
      </div>

      <!-- 空状态 -->
      <div
        v-if="availableSchools.length === 0"
        class="empty-state"
      >
        当前时代范围无可用学派
      </div>
    </div>
  </div>
</template>

<style scoped>
.filter-panel {
  padding: 16px;
}

.section-title {
  font-size: 14px;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0 0 12px 0;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

/* 时代跳转 */
.era-section {
  margin-bottom: 16px;
}

.era-buttons {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 8px;
}

.era-button {
  padding: 8px 12px;
  border: 1px solid var(--border-color);
  border-radius: 6px;
  background: var(--bg-primary);
  color: var(--text-secondary);
  font-size: 13px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.era-button:hover {
  background: oklch(95% 0.01 var(--brand-hue));
  border-color: oklch(75% 0.02 var(--brand-hue));
}

.era-button:active {
  background: var(--bg-tertiary);
}

/* 分隔线 */
.divider {
  height: 1px;
  background: var(--border-color);
  margin: 16px 0;
}

/* 学派筛选 */
.schools-section {
  position: relative;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.reset-button {
  padding: 4px 10px;
  border: none;
  border-radius: 4px;
  background: var(--bg-tertiary);
  color: var(--text-secondary);
  font-size: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.reset-button:hover {
  background: oklch(90% 0.02 var(--brand-hue));
  color: var(--text-primary);
}

.schools-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.school-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 10px;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
  user-select: none;
}

.school-item:hover {
  background: var(--bg-primary);
}

.school-item.is-selected {
  background: oklch(95% 0.05 var(--brand-hue));
}

.school-item input[type="checkbox"] {
  width: 16px;
  height: 16px;
  margin: 0;
  cursor: pointer;
  accent-color: var(--accent-color);
}

.color-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  flex-shrink: 0;
}

.school-name {
  flex: 1;
  font-size: 13px;
  color: var(--text-primary);
}

.school-count {
  font-size: 12px;
  color: var(--text-tertiary);
}

/* 空状态 */
.empty-state {
  padding: 24px;
  text-align: center;
  color: var(--text-tertiary);
  font-size: 13px;
}
</style>
