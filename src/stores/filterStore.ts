import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Philosopher } from '@/types'
import { useTimeStore } from './timeStore'

export const useFilterStore = defineStore('filter', () => {
  // 依赖其他store
  const timeStore = useTimeStore()

  // 状态
  const selectedSchools = ref<string[]>([])
  const searchQuery = ref('')
  const allPhilosophers = ref<Philosopher[]>([])

  // 计算属性：筛选后的哲学家列表
  const filteredPhilosophers = computed(() => {
    return allPhilosophers.value.filter(philosopher => {
      // 时间范围筛选
      const birthYear = philosopher.birth.year
      const deathYear = philosopher.death?.year ?? new Date().getFullYear()

      const inTimeRange = (
        birthYear <= timeStore.currentRange.end &&
        deathYear >= timeStore.currentRange.start
      )

      // 学派筛选
      const inSelectedSchools = selectedSchools.value.length === 0 ||
        philosopher.schools.some(school => selectedSchools.value.includes(school))

      // 搜索词筛选
      const matchesSearch = searchQuery.value === '' ||
        philosopher.name.zh.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
        philosopher.name.en.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
        philosopher.name.original?.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
        philosopher.description.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
        philosopher.ideas.some(idea => idea.toLowerCase().includes(searchQuery.value.toLowerCase()))

      return inTimeRange && inSelectedSchools && matchesSearch
    })
  })

  // 计算属性：可用的学派列表（基于当前筛选结果）
  const availableSchools = computed(() => {
    const schools = new Set<string>()
    filteredPhilosophers.value.forEach(p => {
      p.schools.forEach(s => schools.add(s))
    })
    return Array.from(schools).sort()
  })

  // 计算属性：筛选结果统计
  const filterStats = computed(() => ({
    total: allPhilosophers.value.length,
    filtered: filteredPhilosophers.value.length,
    activeFilters: selectedSchools.value.length + (searchQuery.value ? 1 : 0)
  }))

  // 方法
  const setPhilosophers = (philosophers: Philosopher[]) => {
    allPhilosophers.value = philosophers
  }

  const toggleSchool = (schoolId: string) => {
    const index = selectedSchools.value.indexOf(schoolId)
    if (index === -1) {
      selectedSchools.value.push(schoolId)
    } else {
      selectedSchools.value.splice(index, 1)
    }
  }

  const selectSchools = (schoolIds: string[]) => {
    selectedSchools.value = schoolIds
  }

  const clearSchoolSelection = () => {
    selectedSchools.value = []
  }

  const setSearchQuery = (query: string) => {
    searchQuery.value = query
  }

  const clearSearch = () => {
    searchQuery.value = ''
  }

  const resetFilters = () => {
    selectedSchools.value = []
    searchQuery.value = ''
  }

  const isSchoolSelected = (schoolId: string) => {
    return selectedSchools.value.includes(schoolId)
  }

  return {
    selectedSchools,
    searchQuery,
    allPhilosophers,
    filteredPhilosophers,
    availableSchools,
    filterStats,
    setPhilosophers,
    toggleSchool,
    selectSchools,
    clearSchoolSelection,
    setSearchQuery,
    clearSearch,
    resetFilters,
    isSchoolSelected
  }
})
