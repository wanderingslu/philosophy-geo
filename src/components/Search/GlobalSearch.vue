<template>
  <div ref="searchContainer" class="global-search">
    <div class="search-input-wrapper" :class="{ 'is-focused': isFocused, 'is-open': isOpen && hasResults }">
      <svg class="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <circle cx="11" cy="11" r="8" />
        <path d="m21 21-4.35-4.35" />
      </svg>
      <input
        ref="searchInput"
        v-model="searchQuery"
        type="text"
        class="search-input"
        placeholder="搜索哲学家、学派、地点..."
        @focus="onFocus"
        @keydown.down.prevent="navigateDown"
        @keydown.up.prevent="navigateUp"
        @keydown.enter.prevent="selectCurrent"
        @keydown.esc.prevent="closeDropdown"
      />
      <kbd class="shortcut-hint" v-if="!isFocused && !searchQuery">
        <span v-if="isMac">⌘K</span>
        <span v-else>Ctrl K</span>
      </kbd>
    </div>

    <Transition name="dropdown">
      <div v-if="isOpen && hasResults" class="search-dropdown">
        <!-- 哲学家结果 -->
        <div v-if="filteredPhilosophers.length > 0" class="search-section">
          <div class="section-header">
            <svg class="section-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
            <span>哲学家</span>
            <span class="section-count">{{ filteredPhilosophers.length }}</span>
          </div>
          <ul class="search-results">
            <li
              v-for="(philosopher, index) in filteredPhilosophers.slice(0, 5)"
              :key="philosopher.id"
              class="search-result-item"
              :class="{ 'is-highlighted': highlightedIndex === getGlobalIndex('philosopher', index) }"
              @click="selectPhilosopher(philosopher)"
              @mouseenter="highlightedIndex = getGlobalIndex('philosopher', index)"
            >
              <div class="result-content">
                <div class="result-title">
                  <span class="name-zh">{{ philosopher.name.zh }}</span>
                  <span class="name-en">{{ philosopher.name.en }}</span>
                  <span v-if="philosopher.name.original" class="name-original">{{ philosopher.name.original }}</span>
                </div>
                <div class="result-meta">
                  <span class="meta-item">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                      <circle cx="12" cy="10" r="3" />
                    </svg>
                    {{ philosopher.birth.placeName }}
                  </span>
                  <span class="meta-item" v-if="getSchoolNames(philosopher).length > 0">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
                      <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
                    </svg>
                    {{ getSchoolNames(philosopher).join('、') }}
                  </span>
                </div>
              </div>
            </li>
          </ul>
        </div>

        <!-- 学派结果 -->
        <div v-if="filteredSchools.length > 0" class="search-section">
          <div class="section-header">
            <svg class="section-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
              <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
            </svg>
            <span>学派</span>
            <span class="section-count">{{ filteredSchools.length }}</span>
          </div>
          <ul class="search-results">
            <li
              v-for="(school, index) in filteredSchools.slice(0, 3)"
              :key="school.id"
              class="search-result-item"
              :class="{ 'is-highlighted': highlightedIndex === getGlobalIndex('school', index) }"
              :style="{ '--school-color': school.color }"
              @click="selectSchool(school)"
              @mouseenter="highlightedIndex = getGlobalIndex('school', index)"
            >
              <div class="result-content">
                <div class="result-title">
                  <span class="school-indicator" :style="{ backgroundColor: school.color }"></span>
                  <span class="name-zh">{{ school.name.zh }}</span>
                  <span class="name-en">{{ school.name.en }}</span>
                </div>
                <div class="result-meta">
                  <span class="meta-item">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <circle cx="12" cy="12" r="10" />
                      <polyline points="12 6 12 12 16 14" />
                    </svg>
                    {{ formatPeriod(school.period) }}
                  </span>
                  <span class="meta-item">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                      <circle cx="12" cy="10" r="3" />
                    </svg>
                    {{ school.region }}
                  </span>
                </div>
              </div>
            </li>
          </ul>
        </div>

        <!-- 查看更多提示 -->
        <div v-if="totalResults > 8" class="more-results">
          还有 {{ totalResults - 8 }} 个结果，请继续输入以精确搜索
        </div>

        <!-- 无结果提示 -->
        <div v-if="searchQuery && !hasResults" class="no-results">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.35-4.35" />
          </svg>
          <p>未找到与 "{{ searchQuery }}" 相关的结果</p>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue'
import { philosophers } from '@/data/philosophers'
import { schools } from '@/data/schools'
import type { Philosopher, School } from '@/types'

const emit = defineEmits<{
  selectPhilosopher: [philosopher: Philosopher]
  selectSchool: [school: School]
  close: []
}>()

// Refs
const searchContainer = ref<HTMLElement | null>(null)
const searchInput = ref<HTMLInputElement | null>(null)
const searchQuery = ref('')
const isFocused = ref(false)
const isOpen = ref(false)
const highlightedIndex = ref(-1)
const isMac = ref(false)

// Computed
const filteredPhilosophers = computed(() => {
  if (!searchQuery.value.trim()) return []
  const query = searchQuery.value.toLowerCase()
  return philosophers.filter(p => {
    const nameZh = p.name.zh.toLowerCase()
    const nameEn = p.name.en.toLowerCase()
    const nameOriginal = p.name.original?.toLowerCase() || ''
    const placeName = p.birth.placeName.toLowerCase()
    return nameZh.includes(query) ||
           nameEn.includes(query) ||
           nameOriginal.includes(query) ||
           placeName.includes(query)
  }).slice(0, 8)
})

const filteredSchools = computed(() => {
  if (!searchQuery.value.trim()) return []
  const query = searchQuery.value.toLowerCase()
  return schools.filter(s => {
    const nameZh = s.name.zh.toLowerCase()
    const nameEn = s.name.en.toLowerCase()
    return nameZh.includes(query) || nameEn.includes(query)
  }).slice(0, 8)
})

const hasResults = computed(() => {
  return filteredPhilosophers.value.length > 0 || filteredSchools.value.length > 0
})

const totalResults = computed(() => {
  return filteredPhilosophers.value.length + filteredSchools.value.length
})

const totalVisibleResults = computed(() => {
  return Math.min(filteredPhilosophers.value.length, 5) +
         Math.min(filteredSchools.value.length, 3)
})

// Methods
const onFocus = () => {
  isFocused.value = true
  if (searchQuery.value && hasResults.value) {
    isOpen.value = true
  }
}

const closeDropdown = () => {
  isOpen.value = false
  highlightedIndex.value = -1
  emit('close')
}

const navigateDown = () => {
  if (!isOpen.value) {
    if (hasResults.value) isOpen.value = true
    return
  }
  highlightedIndex.value = (highlightedIndex.value + 1) % totalVisibleResults.value
}

const navigateUp = () => {
  if (!isOpen.value) return
  highlightedIndex.value = highlightedIndex.value <= 0
    ? totalVisibleResults.value - 1
    : highlightedIndex.value - 1
}

const getGlobalIndex = (type: 'philosopher' | 'school', localIndex: number): number => {
  if (type === 'philosopher') {
    return localIndex
  }
  return Math.min(filteredPhilosophers.value.length, 5) + localIndex
}

const selectCurrent = () => {
  if (highlightedIndex.value < 0) return

  const philosopherCount = Math.min(filteredPhilosophers.value.length, 5)

  if (highlightedIndex.value < philosopherCount) {
    selectPhilosopher(filteredPhilosophers.value[highlightedIndex.value])
  } else {
    const schoolIndex = highlightedIndex.value - philosopherCount
    selectSchool(filteredSchools.value[schoolIndex])
  }
}

const selectPhilosopher = (philosopher: Philosopher) => {
  emit('selectPhilosopher', philosopher)
  searchQuery.value = ''
  closeDropdown()
}

const selectSchool = (school: School) => {
  emit('selectSchool', school)
  searchQuery.value = ''
  closeDropdown()
}

const getSchoolNames = (philosopher: Philosopher): string[] => {
  return philosopher.schools
    .map(id => schools.find(s => s.id === id)?.name.zh)
    .filter((name): name is string => !!name)
}

const formatPeriod = (period: { start: number; end: number }): string => {
  const start = period.start < 0 ? `${Math.abs(period.start)} BC` : `${period.start} AD`
  const end = period.end < 0 ? `${Math.abs(period.end)} BC` : `${period.end} AD`
  return `${start} - ${end}`
}

// Keyboard shortcut
const handleKeydown = (e: KeyboardEvent) => {
  // Cmd/Ctrl + K
  if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
    e.preventDefault()
    searchInput.value?.focus()
  }
}

// Click outside
const handleClickOutside = (e: MouseEvent) => {
  if (searchContainer.value && !searchContainer.value.contains(e.target as Node)) {
    closeDropdown()
    isFocused.value = false
  }
}

// Watch search query to open dropdown
watch(searchQuery, (newVal) => {
  if (newVal && hasResults.value) {
    isOpen.value = true
    highlightedIndex.value = -1
  } else if (!newVal) {
    isOpen.value = false
  }
})

// Lifecycle
onMounted(() => {
  isMac.value = navigator.platform.toUpperCase().indexOf('MAC') >= 0
  document.addEventListener('keydown', handleKeydown)
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeydown)
  document.removeEventListener('click', handleClickOutside)
})

// Import watch
import { watch } from 'vue'
</script>

<style scoped>
.global-search {
  position: relative;
  width: 100%;
  max-width: 480px;
}

.search-input-wrapper {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  background: var(--bg-secondary, #f5f5f5);
  border: 2px solid transparent;
  border-radius: 12px;
  transition: all 0.2s ease;
}

.search-input-wrapper.is-focused,
.search-input-wrapper.is-open {
  background: var(--bg-primary, #ffffff);
  border-color: var(--accent-color, #3b82f6);
  box-shadow: 0 0 0 3px var(--accent-color-alpha, rgba(59, 130, 246, 0.1));
}

.search-icon {
  width: 18px;
  height: 18px;
  color: var(--text-tertiary, #9ca3af);
  flex-shrink: 0;
}

.search-input-wrapper.is-focused .search-icon,
.search-input-wrapper.is-open .search-icon {
  color: var(--accent-color, #3b82f6);
}

.search-input {
  flex: 1;
  border: none;
  background: transparent;
  font-size: 14px;
  color: var(--text-primary, #1f2937);
  outline: none;
}

.search-input::placeholder {
  color: var(--text-tertiary, #9ca3af);
}

.shortcut-hint {
  display: flex;
  align-items: center;
  gap: 2px;
  padding: 2px 6px;
  background: var(--bg-tertiary, #e5e7eb);
  border-radius: 4px;
  font-size: 11px;
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  color: var(--text-secondary, #6b7280);
  flex-shrink: 0;
}

/* Dropdown */
.search-dropdown {
  position: absolute;
  top: calc(100% + 8px);
  left: 0;
  right: 0;
  background: var(--bg-primary, #ffffff);
  border: 1px solid var(--border-color, #e5e7eb);
  border-radius: 12px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
  max-height: 480px;
  overflow-y: auto;
  z-index: 1000;
}

.dropdown-enter-active,
.dropdown-leave-active {
  transition: all 0.15s ease;
}

.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}

/* Search Sections */
.search-section {
  padding: 8px 0;
}

.search-section:not(:last-child) {
  border-bottom: 1px solid var(--border-color, #e5e7eb);
}

.section-header {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--text-secondary, #6b7280);
}

.section-icon {
  width: 14px;
  height: 14px;
}

.section-count {
  margin-left: auto;
  padding: 2px 6px;
  background: var(--bg-secondary, #f5f5f5);
  border-radius: 10px;
  font-size: 10px;
  font-weight: 500;
}

/* Search Results */
.search-results {
  list-style: none;
  margin: 0;
  padding: 0;
}

.search-result-item {
  padding: 10px 16px;
  cursor: pointer;
  transition: background-color 0.15s ease;
}

.search-result-item:hover,
.search-result-item.is-highlighted {
  background-color: var(--bg-secondary, #f5f5f5);
}

.result-content {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.result-title {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

.name-zh {
  font-size: 14px;
  font-weight: 500;
  color: var(--text-primary, #1f2937);
}

.name-en {
  font-size: 12px;
  color: var(--text-secondary, #6b7280);
}

.name-original {
  font-size: 11px;
  color: var(--text-tertiary, #9ca3af);
  font-style: italic;
}

.school-indicator {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  flex-shrink: 0;
}

.result-meta {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 11px;
  color: var(--text-tertiary, #9ca3af);
}

.meta-item svg {
  width: 12px;
  height: 12px;
}

/* More Results */
.more-results {
  padding: 12px 16px;
  text-align: center;
  font-size: 12px;
  color: var(--text-tertiary, #9ca3af);
  border-top: 1px solid var(--border-color, #e5e7eb);
}

/* No Results */
.no-results {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  padding: 32px 16px;
  color: var(--text-tertiary, #9ca3af);
}

.no-results svg {
  width: 32px;
  height: 32px;
}

.no-results p {
  margin: 0;
  font-size: 13px;
}

/* Dark mode support */
@media (prefers-color-scheme: dark) {
  .search-input-wrapper {
    background: rgba(255, 255, 255, 0.05);
  }

  .search-input-wrapper.is-focused,
  .search-input-wrapper.is-open {
    background: var(--bg-primary, #1f2937);
    border-color: var(--accent-color, #60a5fa);
    box-shadow: 0 0 0 3px rgba(96, 165, 250, 0.15);
  }

  .search-input {
    color: var(--text-primary, #f9fafb);
  }

  .shortcut-hint {
    background: rgba(255, 255, 255, 0.1);
    color: var(--text-secondary, #9ca3af);
  }

  .search-dropdown {
    background: var(--bg-primary, #1f2937);
    border-color: rgba(255, 255, 255, 0.1);
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.4);
  }

  .search-section:not(:last-child) {
    border-color: rgba(255, 255, 255, 0.1);
  }

  .section-count {
    background: rgba(255, 255, 255, 0.1);
  }

  .search-result-item:hover,
  .search-result-item.is-highlighted {
    background-color: rgba(255, 255, 255, 0.05);
  }

  .name-zh {
    color: var(--text-primary, #f9fafb);
  }

  .name-en {
    color: var(--text-secondary, #9ca3af);
  }

  .more-results {
    border-color: rgba(255, 255, 255, 0.1);
  }
}

/* Responsive */
@media (max-width: 640px) {
  .global-search {
    max-width: none;
  }

  .shortcut-hint {
    display: none;
  }

  .search-dropdown {
    position: fixed;
    top: auto;
    left: 16px;
    right: 16px;
    max-height: 60vh;
  }
}
</style>
