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

// 获取学派颜色
const getSchoolColor = (schoolId: string): string => {
  const school = schools.find(s => s.id === schoolId)
  return school?.color || '#888888'
}

// 准备节点数据
const nodes = computed(() => {
  return filterStore.filteredPhilosophers.map(p => ({
    id: p.id,
    name: p.name.zh,
    enName: p.name.en,
    importance: p.importance,
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

  // 创建力导向模拟
  simulation.value = d3.forceSimulation(nodes.value as any)
    .force('link', d3.forceLink(links.value).id((d: any) => d.id).distance(100))
    .force('charge', d3.forceManyBody().strength(-300))
    .force('center', d3.forceCenter(width / 2, height / 2))
    .force('collision', d3.forceCollide().radius((d: any) => d.importance * 3 + 10))

  // 绘制连接线
  const link = g.append('g')
    .attr('stroke', '#64ffda')
    .attr('stroke-opacity', 0.4)
    .selectAll('line')
    .data(links.value)
    .join('line')
    .attr('stroke-width', 2)
    .attr('marker-end', 'url(#arrowhead)')

  // 添加箭头标记
  svg.append('defs').append('marker')
    .attr('id', 'arrowhead')
    .attr('viewBox', '0 -5 10 10')
    .attr('refX', 25)
    .attr('refY', 0)
    .attr('markerWidth', 6)
    .attr('markerHeight', 6)
    .attr('orient', 'auto')
    .append('path')
    .attr('d', 'M0,-5L10,0L0,5')
    .attr('fill', '#64ffda')

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
    .attr('r', (d: any) => d.importance * 3)
    .attr('fill', (d: any) => d.color)
    .attr('stroke', '#fff')
    .attr('stroke-width', 2)
    .attr('stroke-opacity', 0.8)
    .style('filter', 'drop-shadow(0 2px 4px rgba(0,0,0,0.4))')

  // 添加节点文字标签
  node.append('text')
    .attr('dy', (d: any) => d.importance * 3 + 15)
    .attr('text-anchor', 'middle')
    .attr('fill', '#e6f1ff')
    .style('font-size', '12px')
    .style('font-weight', '500')
    .style('pointer-events', 'none')
    .style('text-shadow', '0 1px 2px rgba(0,0,0,0.8)')
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
      .attr('r', (d: any) => d.importance * 3.5)
      .attr('stroke-width', 3)
  })
  .on('mouseout', function() {
    d3.select(this).select('circle')
      .transition()
      .duration(200)
      .attr('r', (d: any) => d.importance * 3)
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
    <div class="network-info">
      <h3>哲学家关系网络</h3>
      <p>显示 {{ nodes.length }} 位哲学家的影响关系</p>
      <p class="hint">拖拽节点调整布局 · 滚轮缩放 · 点击查看详情</p>
    </div>
  </div>
</template>

<style scoped>
.network-graph {
  width: 100%;
  height: 100%;
  background: var(--bg-primary);
  position: relative;
  overflow: hidden;
}

.network-info {
  position: absolute;
  top: 16px;
  left: 16px;
  background: rgba(17, 34, 64, 0.9);
  padding: 16px 20px;
  border-radius: 8px;
  border: 1px solid var(--border-color);
  backdrop-filter: blur(10px);
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
  opacity: 0.7;
}

:deep(svg) {
  display: block;
  cursor: grab;
}

:deep(svg:active) {
  cursor: grabbing;
}
</style>
