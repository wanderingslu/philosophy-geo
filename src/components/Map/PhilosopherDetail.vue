<script setup lang="ts">
import { computed } from 'vue'
import type { Philosopher } from '@/types'
import { getSchoolById } from '@/data/schools'
import { getPhilosopherById } from '@/data/philosophers'

const props = defineProps<{
  philosopher: Philosopher | null
}>()

const emit = defineEmits<{
  close: []
  selectPhilosopher: [philosopher: Philosopher]
}>()

// 获取学派信息
const schoolDetails = computed(() => {
  if (!props.philosopher) return []
  return props.philosopher.schools
    .map(id => getSchoolById(id))
    .filter((s): s is NonNullable<typeof s> => !!s)
})

// 获取影响关系
const influenceDetails = computed(() => {
  if (!props.philosopher) return { influences: [], influencedBy: [] }

  const influences = props.philosopher.influences
    .map(id => getPhilosopherById(id))
    .filter((p): p is NonNullable<typeof p> => !!p)

  const influencedBy = props.philosopher.influencedBy
    .map(id => getPhilosopherById(id))
    .filter((p): p is NonNullable<typeof p> => !!p)

  return { influences, influencedBy }
})

// 格式化年份
const formatYear = (year: number): string => {
  if (year < 0) return `${Math.abs(year)} BCE`
  return `${year} CE`
}

// 获取生卒年显示
const lifeSpan = computed(() => {
  if (!props.philosopher) return ''
  const birth = formatYear(props.philosopher.birth.year)
  const death = props.philosopher.death
    ? formatYear(props.philosopher.death.year)
    : '至今'
  return `${birth} - ${death}`
})

// 关闭弹窗
const handleClose = () => {
  emit('close')
}

// 点击影响关系
const handleSelectPhilosopher = (philosopher: Philosopher) => {
  emit('selectPhilosopher', philosopher)
}

// 点击背景关闭
const handleBackdropClick = (e: MouseEvent) => {
  if (e.target === e.currentTarget) {
    handleClose()
  }
}
</script>

<template>
  <Transition name="modal">
    <div
      v-if="philosopher"
      class="modal-backdrop"
      @click="handleBackdropClick"
    >
      <div class="modal-container">
        <!-- 关闭按钮 -->
        <button class="close-btn" @click="handleClose">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>

        <!-- 头部信息 -->
        <div class="modal-header">
          <h2 class="philosopher-name">
            {{ philosopher.name.zh }}
          </h2>
          <div class="name-variants">
            <span class="name-en">{{ philosopher.name.en }}</span>
            <span v-if="philosopher.name.original" class="name-original">
              {{ philosopher.name.original }}
            </span>
          </div>
        </div>

        <!-- 基本信息 -->
        <div class="basic-info">
          <div class="info-item">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
            <span>{{ lifeSpan }}</span>
          </div>
          <div class="info-item">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
            <span>{{ philosopher.birth.placeName }}</span>
          </div>
          <div class="info-item importance">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
            </svg>
            <span>影响力: {{ philosopher.importance }}/10</span>
          </div>
        </div>

        <!-- 学派标签 -->
        <div v-if="schoolDetails.length > 0" class="schools-section">
          <h3 class="section-title">学派</h3>
          <div class="schools-tags">
            <span
              v-for="school in schoolDetails"
              :key="school.id"
              class="school-tag"
              :style="{ backgroundColor: school.color + '20', color: school.color, borderColor: school.color + '40' }"
            >
              {{ school.name.zh }}
            </span>
          </div>
        </div>

        <!-- 描述 -->
        <div class="description-section">
          <h3 class="section-title">简介</h3>
          <p class="description-text">{{ philosopher.description }}</p>
        </div>

        <!-- 核心概念 -->
        <div v-if="philosopher.ideas.length > 0" class="ideas-section">
          <h3 class="section-title">核心概念</h3>
          <div class="ideas-tags">
            <span
              v-for="idea in philosopher.ideas"
              :key="idea"
              class="idea-tag"
            >
              {{ idea }}
            </span>
          </div>
        </div>

        <!-- 影响关系 -->
        <div class="influence-section">
          <!-- 影响了谁 -->
          <div v-if="influenceDetails.influences.length > 0" class="influence-group">
            <h3 class="section-title">影响了</h3>
            <div class="influence-list">
              <button
                v-for="p in influenceDetails.influences"
                :key="p.id"
                class="influence-item"
                @click="handleSelectPhilosopher(p)"
              >
                {{ p.name.zh }}
              </button>
            </div>
          </div>

          <!-- 受谁影响 -->
          <div v-if="influenceDetails.influencedBy.length > 0" class="influence-group">
            <h3 class="section-title">受其影响</h3>
            <div class="influence-list">
              <button
                v-for="p in influenceDetails.influencedBy"
                :key="p.id"
                class="influence-item"
                @click="handleSelectPhilosopher(p)"
              >
                {{ p.name.zh }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
  padding: 20px;
  backdrop-filter: blur(4px);
}

.modal-container {
  position: relative;
  background: linear-gradient(180deg, #1e1e2e 0%, #252535 100%);
  border-radius: 16px;
  width: 100%;
  max-width: 480px;
  max-height: 85vh;
  overflow-y: auto;
  padding: 28px;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

/* 关闭按钮 */
.close-btn {
  position: absolute;
  top: 16px;
  right: 16px;
  width: 32px;
  height: 32px;
  border: none;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.1);
  color: #8892b0;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.close-btn:hover {
  background: rgba(233, 69, 96, 0.2);
  color: #e94560;
}

.close-btn svg {
  width: 18px;
  height: 18px;
}

/* 头部 */
.modal-header {
  margin-bottom: 20px;
  padding-right: 40px;
}

.philosopher-name {
  font-size: 24px;
  font-weight: 700;
  color: #e6f1ff;
  margin: 0 0 8px 0;
  line-height: 1.3;
}

.name-variants {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.name-en {
  font-size: 14px;
  color: #8892b0;
  font-weight: 500;
}

.name-original {
  font-size: 13px;
  color: #64ffda;
  font-style: italic;
}

/* 基本信息 */
.basic-info {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  margin-bottom: 24px;
  padding: 16px;
  background: rgba(255, 255, 255, 0.03);
  border-radius: 12px;
}

.info-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  color: #a8b2d1;
}

.info-item svg {
  width: 16px;
  height: 16px;
  color: #64ffda;
}

.info-item.importance svg {
  color: #ffd700;
}

/* 章节标题 */
.section-title {
  font-size: 12px;
  font-weight: 600;
  color: #8892b0;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  margin: 0 0 12px 0;
}

/* 学派标签 */
.schools-section {
  margin-bottom: 24px;
}

.schools-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.school-tag {
  padding: 6px 14px;
  border-radius: 20px;
  font-size: 13px;
  font-weight: 500;
  border: 1px solid;
}

/* 描述 */
.description-section {
  margin-bottom: 24px;
}

.description-text {
  font-size: 14px;
  line-height: 1.7;
  color: #a8b2d1;
  margin: 0;
}

/* 核心概念 */
.ideas-section {
  margin-bottom: 24px;
}

.ideas-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.idea-tag {
  padding: 6px 12px;
  background: rgba(100, 255, 218, 0.1);
  color: #64ffda;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 500;
}

/* 影响关系 */
.influence-section {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.influence-group {
  padding-top: 20px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.influence-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.influence-item {
  padding: 8px 14px;
  background: rgba(233, 69, 96, 0.1);
  color: #e94560;
  border: 1px solid rgba(233, 69, 96, 0.3);
  border-radius: 8px;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.influence-item:hover {
  background: rgba(233, 69, 96, 0.2);
  transform: translateY(-2px);
}

/* 滚动条 */
.modal-container::-webkit-scrollbar {
  width: 6px;
}

.modal-container::-webkit-scrollbar-track {
  background: transparent;
}

.modal-container::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.2);
  border-radius: 3px;
}

.modal-container::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.3);
}

/* 过渡动画 */
.modal-enter-active,
.modal-leave-active {
  transition: all 0.3s ease;
}

.modal-enter-from {
  opacity: 0;
}

.modal-enter-from .modal-container {
  transform: scale(0.95) translateY(10px);
}

.modal-leave-to {
  opacity: 0;
}

.modal-leave-to .modal-container {
  transform: scale(0.95) translateY(10px);
}

.modal-enter-active .modal-container,
.modal-leave-active .modal-container {
  transition: all 0.3s ease;
}

/* 响应式 */
@media (max-width: 640px) {
  .modal-backdrop {
    padding: 0;
    align-items: flex-end;
  }

  .modal-container {
    max-height: 85vh;
    border-radius: 20px 20px 0 0;
    padding: 24px 20px;
  }

  .philosopher-name {
    font-size: 20px;
  }

  .basic-info {
    flex-direction: column;
    gap: 10px;
  }
}
</style>
