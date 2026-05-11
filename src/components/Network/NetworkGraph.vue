<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch, computed } from 'vue'
import { useMapStore } from '@/stores/mapStore'
import { useFilterStore } from '@/stores/filterStore'
import { philosophers } from '@/data/philosophers'
import { schools } from '@/data/schools'
import type { Philosopher } from '@/types'

const mapStore = useMapStore()
const filterStore = useFilterStore()

const networkContainer = ref<HTMLElement | null>(null)
const simulation = ref<any>(null)

// Obsidian风格控制面板状态
const nodeSizeScale = ref(1) // 节点大小缩放
const linkDistance = ref(100) // 连接距离（力度）
const chargeStrength = ref(-300) // 排斥力
const showLabels = ref(true) // 显示标签
const minImportance = ref(1) // 最小重要性筛选

// 控制面板显隐
const showControls = ref(true)

// 获取学派颜色
const getSchoolColor = (schoolId: string): string => {
  const school = schools.find(s => s.id === schoolId)
  return school?.color || '#888888'
}

// 准备节点数据（应用重要性筛选和大小缩放）
const nodes = computed(() => {
  return filterStore.filteredPhilosophers
    .filter(p => p.importance >= minImportance.value)
    .map(p => ({
      id: p.id,
      name: p.name.zh,
      enName: p.name.en,
      importance: p.importance,
      displaySize: Math.max(5, p.importance * 2 * nodeSizeScale.value), // 应用大小缩放
      color: getSchoolColor(p.schools[0]),
      philosopher: p
    }))
})

// 准备连接数据（基于influences关系）
const links = computed(() => {
  const linkList: any[] = []
  const nodeIds = new Set(nodes.value.map(n => n.id))

  nodes.value.forEach(node => {
    const philosopher = node.philosopher
    philosopher.influences.forEach(targetId => {
      if (nodeIds.has(targetId)) {
        linkList.push({
          source: node.id,
          target: targetId,
          value: 1
        })
      }
    })
  })

  return linkList
})

// 初始化D3网络图
const initNetwork = async () => {
  if (!networkContainer.value) return

  // 动态导入D3
  const d3 = await import('d3')

  const container = networkContainer.value
  const width = container.clientWidth
  const height = container.clientHeight

  // 清除之前的SVG
  container.innerHTML = ''

  // 创建SVG
  const svg = d3.select(container)
    .append('svg')
    .attr('width', width)
    .attr('height', height)
    .attr('viewBox', [0, 0, width, height])

  // 添加缩放行为
  const g = svg.append('g')

  const zoom = d3.zoom()
    .scaleExtent([0.1, 4])
    .on('zoom', (event) => {
      g.attr('transform', event.transform)
    })

  svg.call(zoom as any)

  // 如果没有数据，显示提示
  if (nodes.value.length === 0) {
    svg.append('text')
      .attr('x', width / 2)
      .attr('y', height / 2)
      .attr('text-anchor', 'middle')
      .attr('fill', '#8892b0')
      .style('font-size', '16px')
      .text('当前筛选条件下没有哲学家')
    return
  }

  // 创建力导向模拟（使用控制参数）
  simulation.value = d3.forceSimulation(nodes.value as any)
    .force('link', d3.forceLink(links.value).id((d: any) => d.id).distance(linkDistance.value))
    .force('charge', d3.forceManyBody().strength(chargeStrength.value))
    .force('center', d3.forceCenter(width / 2, height / 2))
    .force('collision', d3.forceCollide().radius((d: any) => d.displaySize + 5))

  // 绘制连接线（带箭头）
  const linkGroup = g.append('g').attr('class', 'links')

  // 创建链接数据，包含目标节点的显示大小
  const linkData = links.value.map((l: any) => {
    const targetNode = nodes.value.find(n => n.id === l.target)
    return {
      ...l,
      targetSize: targetNode?.displaySize || 10
    }
  })

  const link = linkGroup.selectAll('line')
    .data(linkData)
    .join('line')
    .attr('stroke', '#64ffda')
    .attr('stroke-opacity', 0.5)
    .attr('stroke-width', 2)
    .attr('marker-end', (d: any) => `url(#arrowhead-${Math.round(d.targetSize)})`)

  // 添加箭头标记定义
  const defs = svg.append('defs')

  // 为不同大小的节点创建不同大小的箭头
  const sizeLevels = [5, 10, 15, 20, 25, 30, 35, 40, 45, 50]
  sizeLevels.forEach(size => {
    const nodeRadius = size + 3 // 节点半径 + 偏移
    defs.append('marker')
      .attr('id', `arrowhead-${size}`)
      .attr('viewBox', '0 -5 10 10')
      .attr('refX', nodeRadius)
      .attr('refY', 0)
      .attr('markerWidth', 6)
      .attr('markerHeight', 6)
      .attr('orient', 'auto')
      .append('path')
      .attr('d', 'M0,-5L10,0L0,5')
      .attr('fill', '#64ffda')
      .attr('opacity', '0.7')
  })

  // 绘制节点组
  const node = g.append('g')
    .selectAll('g')
    .data(nodes.value)
    .join('g')
    .attr('cursor', 'pointer')
    .call(d3.drag()
      .on('start', (event, d: any) => {
        if (!event.active) simulation.value.alphaTarget(0.3).restart()
        d.fx = d.x
        d.fy = d.y
      })
      .on('drag', (event, d: any) => {
        d.fx = event.x
        d.fy = event.y
      })
      .on('end', (event, d: any) => {
        if (!event.active) simulation.value.alphaTarget(0)
        d.fx = null
        d.fy = null
      }) as any)

  // 绘制节点圆形
  node.append('circle')
    .attr('r', (d: any) => d.displaySize)
    .attr('fill', (d: any) => d.color)
    .attr('stroke', '#fff')
    .attr('stroke-width', 2)
    .attr('stroke-opacity', 0.8)
    .style('filter', 'drop-shadow(0 2px 4px rgba(0,0,0,0.4))')

  // 添加节点文字标签（可选）
  node.append('text')
    .attr('dy', (d: any) => d.displaySize + 15)
    .attr('text-anchor', 'middle')
    .attr('fill', '#e6f1ff')
    .style('font-size', '12px')
    .style('font-weight', '500')
    .style('pointer-events', 'none')
    .style('text-shadow', '0 1px 2px rgba(0,0,0,0.8)')
    .style('opacity', showLabels.value ? 1 : 0)
    .text((d: any) => d.name)

  // 点击事件
  node.on('click', (event: any, d: any) => {
    mapStore.selectPhilosopher(d.philosopher)
  })

  // Hover效果
  node.on('mouseover', function() {
    d3.select(this).select('circle')
      .transition()
      .duration(200)
      .attr('r', (d: any) => d.displaySize * 1.2)
      .attr('stroke-width', 3)
  })
  .on('mouseout', function() {
    d3.select(this).select('circle')
      .transition()
      .duration(200)
      .attr('r', (d: any) => d.displaySize)
      .attr('stroke-width', 2)
  })

  // 更新位置
  simulation.value.on('tick', () => {
    link
      .attr('x1', (d: any) => d.source.x)
      .attr('y1', (d: any) => d.source.y)
      .attr('x2', (d: any) => d.target.x)
      .attr('y2', (d: any) => d.target.y)

    node.attr('transform', (d: any) => `translate(${d.x},${d.y})`)
  })
}

// 重置控制参数
const resetControls = () => {
  nodeSizeScale.value = 1
  linkDistance.value = 100
  chargeStrength.value = -300
  showLabels.value = true
  minImportance.value = 1
}

// 监听控制参数变化，更新模拟
watch([nodeSizeScale, linkDistance, chargeStrength, minImportance], () => {
  initNetwork()
}, { debounce: 100 })

// 监听标签显示变化
watch(showLabels, () => {
  initNetwork()
})

// 监听数据变化，重新渲染
watch(() => filterStore.filteredPhilosophers, () => {
  initNetwork()
}, { deep: true })

onMounted(() => {
  initNetwork()
})

onUnmounted(() => {
  if (simulation.value) {
    simulation.value.stop()
  }
})
</script>

<template>
  <div ref="networkContainer" class="network-graph">
    <!-- 网络信息 -->
    <div class="network-info">
      <h3>哲学家关系网络</h3>
      <p>显示 {{ nodes.length }} 位哲学家的影响关系</p>
      <p class="hint">拖拽节点调整布局 · 滚轮缩放 · 点击查看详情</p>
    </div>

    <!-- Obsidian风格控制面板 -->
    <div class="controls-panel" :class="{ collapsed: !showControls }">
      <div class="controls-header" @click="showControls = !showControls">
        <span class="controls-title">图谱设置</span>
        <svg class="toggle-icon" :class="{ rotated: !showControls }" viewBox="0 0 24 24" width="16" height="16">
          <path fill="currentColor" d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z"/>
        </svg>
      </div>

      <div class="controls-content" v-show="showControls">
        <!-- 筛选 -->
        <div class="control-section">
          <div class="control-label">
            <span>筛选</span>
            <span class="control-value">重要性 ≥ {{ minImportance }}</span>
          </div>
          <input
            type="range"
            v-model.number="minImportance"
            min="1"
            max="10"
            step="1"
            class="control-slider"
          />
          <div class="slider-labels">
            <span>1</span>
            <span>10</span>
          </div>
        </div>

        <!-- 节点大小 -->
        <div class="control-section">
          <div class="control-label">
            <span>节点大小</span>
            <span class="control-value">{{ Math.round(nodeSizeScale * 100) }}%</span>
          </div>
          <input
            type="range"
            v-model.number="nodeSizeScale"
            min="0.3"
            max="2"
            step="0.1"
            class="control-slider"
          />
          <div class="slider-labels">
            <span>30%</span>
            <span>200%</span>
          </div>
        </div>

        <!-- 连接长度（力度） -->
        <div class="control-section">
          <div class="control-label">
            <span>连接长度</span>
            <span class="control-value">{{ linkDistance }}px</span>
          </div>
          <input
            type="range"
            v-model.number="linkDistance"
            min="30"
            max="300"
            step="10"
            class="control-slider"
          />
          <div class="slider-labels">
            <span>紧凑</span>
            <span>松散</span>
          </div>
        </div>

        <!-- 排斥力 -->
        <div class="control-section">
          <div class="control-label">
            <span>排斥力度</span>
            <span class="control-value">{{ Math.abs(chargeStrength) }}</span>
          </div>
          <input
            type="range"
            v-model.number="chargeStrength"
            min="-1000"
            max="-50"
            step="50"
            class="control-slider"
          />
          <div class="slider-labels">
            <span>弱</span>
            <span>强</span>
          </div>
        </div>

        <!-- 显示标签 -->
        <div class="control-section checkbox-section">
          <label class="checkbox-label">
            <input type="checkbox" v-model="showLabels" />
            <span>显示节点标签</span>
          </label>
        </div>

        <!-- 重置按钮 -->
        <button class="reset-btn" @click="resetControls">
          <svg viewBox="0 0 24 24" width="14" height="14">
            <path fill="currentColor" d="M12 5V1L7 6l5 5V7c3.31 0 6 2.69 6 6s-2.69 6-6 6-6-2.69-6-6H4c0 4.42 3.58 8 8 8s8-3.58 8-8-3.58-8-8-8z"/>
          </svg>
          重置设置
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.network-graph {
  width: 100%;
  height: 100%;
  background: oklch(95% 0.005 var(--brand-hue));
  position: relative;
  overflow: hidden;
}

.network-info {
  position: absolute;
  top: 16px;
  left: 16px;
  background: var(--bg-secondary);
  padding: 16px 20px;
  border-radius: 8px;
  border: 1px solid var(--border-color);
  box-shadow: 0 2px 12px var(--shadow-color);
  z-index: 10;
  pointer-events: none;
}

.network-info h3 {
  margin: 0 0 8px 0;
  font-size: 16px;
  color: var(--text-primary);
}

.network-info p {
  margin: 0;
  font-size: 13px;
  color: var(--text-secondary);
}

.network-info .hint {
  margin-top: 8px;
  font-size: 11px;
  color: var(--text-tertiary);
}

:deep(svg) {
  display: block;
  cursor: grab;
}

:deep(svg:active) {
  cursor: grabbing;
}

/* Impeccable Light Theme Control Panel */
.controls-panel {
  position: absolute;
  top: 16px;
  right: 16px;
  width: 260px;
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  z-index: 20;
  box-shadow: 0 4px 20px var(--shadow-elevated);
  overflow: hidden;
  transition: all 0.3s ease;
}

.controls-panel.collapsed {
  width: auto;
}

.controls-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  cursor: pointer;
  border-bottom: 1px solid var(--border-color);
  transition: background 0.2s ease;
}

.controls-header:hover {
  background: oklch(95% 0.01 var(--brand-hue));
}

.controls-title {
  font-size: 14px;
  font-weight: 600;
  color: var(--text-primary);
}

.toggle-icon {
  color: var(--text-secondary);
  transition: transform 0.3s ease;
}

.toggle-icon.rotated {
  transform: rotate(-90deg);
}

.controls-content {
  padding: 16px;
  max-height: 400px;
  overflow-y: auto;
}

.control-section {
  margin-bottom: 16px;
}

.control-section:last-child {
  margin-bottom: 0;
}

.control-label {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
  font-size: 12px;
}

.control-label span:first-child {
  color: var(--text-secondary);
  font-weight: 500;
}

.control-value {
  color: var(--accent-color);
  font-weight: 600;
  font-size: 11px;
}

.control-slider {
  width: 100%;
  height: 4px;
  -webkit-appearance: none;
  appearance: none;
  background: oklch(90% 0.01 var(--brand-hue));
  border-radius: 2px;
  outline: none;
  cursor: pointer;
}

.control-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background: var(--accent-color);
  cursor: pointer;
  transition: transform 0.2s ease;
  box-shadow: 0 1px 3px var(--shadow-color);
}

.control-slider::-webkit-slider-thumb:hover {
  transform: scale(1.2);
}

.control-slider::-moz-range-thumb {
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background: var(--accent-color);
  cursor: pointer;
  border: none;
  box-shadow: 0 1px 3px var(--shadow-color);
}

.slider-labels {
  display: flex;
  justify-content: space-between;
  margin-top: 4px;
  font-size: 10px;
  color: var(--text-tertiary);
}

.checkbox-section {
  padding: 8px 0;
  border-top: 1px solid var(--border-color);
  border-bottom: 1px solid var(--border-color);
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  font-size: 12px;
  color: var(--text-secondary);
}

.checkbox-label input[type="checkbox"] {
  width: 16px;
  height: 16px;
  accent-color: var(--accent-color);
  cursor: pointer;
}

.reset-btn {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 10px;
  margin-top: 12px;
  border: 1px solid var(--border-color);
  border-radius: 6px;
  background: var(--bg-primary);
  color: var(--text-secondary);
  font-size: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.reset-btn:hover {
  background: oklch(95% 0.03 var(--brand-hue));
  border-color: oklch(80% 0.08 var(--brand-hue));
  color: var(--accent-color);
}
</style>
