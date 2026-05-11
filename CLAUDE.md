# Philosophy Geo - 哲学家历史地理可视化平台

> **项目概述**: 展示公元前800年至今的哲学思想地理分布，通过地图、网络图、时间轴三种视图探索哲学家的生平、思想与地理空间的关系。

---

## 技术栈

| 层级 | 技术 |
|------|------|
| **框架** | Vue 3 (Composition API) + TypeScript |
| **状态管理** | Pinia (mapStore, filterStore, timeStore) |
| **地图** | Leaflet + CartoDB Positron (浅色底图) |
| **网络图** | D3.js (力导向图) |
| **构建工具** | Vite |
| **设计方法** | Impeccable (OKLCH 颜色空间) |

---

## 项目结构

```
src/
├── components/
│   ├── Map/
│   │   ├── LeafletMap.vue       # 地图主组件 (哲学家标记、连线、飞行动画)
│   │   └── PhilosopherDetail.vue # 哲学家详情弹窗
│   ├── Network/
│   │   └── NetworkGraph.vue     # D3网络图 (力导向、可拖拽、Obsidian风格控件)
│   ├── Timeline/
│   │   └── TimelineBar.vue      # 双滑块时间轴 (-800~2024)
│   ├── Sidebar/
│   │   ├── FilterPanel.vue      # 学派筛选、时代跳转
│   │   └── PhilosopherList.vue  # 哲学家列表 (按影响力排序)
│   └── Search/
│       └── GlobalSearch.vue     # 全局搜索 (哲学家/学派)
├── stores/
│   ├── mapStore.ts              # 地图状态 (选中、hover、飞行动画)
│   ├── filterStore.ts           # 筛选逻辑 (时间、学派、搜索)
│   └── timeStore.ts             # 时间范围状态
├── data/
│   ├── philosophers.ts          # 哲学家数据 (~20位)
│   └── schools.ts               # 学派数据 (8个)
└── types/
    └── index.ts                 # TypeScript类型定义
```

---

## 设计系统 (Impeccable)

**核心原则**: 不使用纯黑纯白，OKLCH颜色空间，向品牌色调微染

```css
:root {
  --brand-hue: 260;              /* 蓝紫色调 (智慧/深度) */
  --neutral-chroma: 0.005;

  /* 背景 - 微染的浅色 */
  --bg-primary: oklch(97% 0.005 260);
  --bg-secondary: oklch(100% 0.008 260);
  --bg-tertiary: oklch(94% 0.01 260);

  /* 文字 - 深色在浅色背景 */
  --text-primary: oklch(25% 0.02 260);
  --text-secondary: oklch(45% 0.015 260);
  --text-tertiary: oklch(55% 0.01 260);

  /* 强调色 - 鲜艳 (浅色模式) */
  --accent-color: oklch(55% 0.18 260);      /* 蓝紫 */
  --accent-secondary: oklch(70% 0.15 180);  /* 青绿 */
}
```

---

## 数据结构

### Philosopher (哲学家)

```typescript
interface Philosopher {
  id: string;                    // 唯一标识
  name: {
    zh: string;                  // 中文名
    en: string;                  // 英文名
    original?: string;           // 原名 (希腊/拉丁等)
  };
  birth: {
    year: number;                // 负数 = BCE
    location: { lat: number; lng: number };
    placeName: string;
  };
  death?: {
    year: number;
    location: { lat: number; lng: number };
    placeName: string;
  };
  schools: string[];             // 所属学派ID
  influences: string[];          // 影响了谁 (philosopher IDs)
  influencedBy: string[];        // 受谁影响
  ideas: string[];               // 核心概念
  importance: number;            // 影响力 1-10
  description: string;
}
```

### School (学派)

```typescript
interface School {
  id: string;
  name: { zh: string; en: string };
  region: Region;                // 地理区域
  period: { start: number; end: number };
  color: string;                 // 标记颜色
  description: string;
}
```

---

## 当前数据覆盖

**约20位哲学家**: 苏格拉底、柏拉图、亚里士多德、孔子、老子、庄子、孟子、佛陀、龙树、伊本·西那、笛卡尔、康德、黑格尔、维特根斯坦、海德格尔、胡塞尔、罗素等

**8个学派**: 柏拉图主义、亚里士多德学派、儒家、道家、佛教哲学、德国观念论、分析哲学、现象学

**数据来源**: 静态 TypeScript 文件 (`philosophers.ts`, `schools.ts`)

---

## 核心功能

### 1. 地图视图 (LeafletMap)
- 自定义圆形标记，颜色代表学派，大小代表重要性
- 标记悬停/选中效果 (缩放、阴影)
- 飞行动画到指定哲学家
- 自适应缩放适应所有标记

### 2. 网络视图 (NetworkGraph)
- D3力导向图 (可拖拽节点)
- 连线表示影响关系，箭头指向被影响者
- Obsidian风格控制面板:
  - 重要性筛选 (1-10)
  - 节点大小缩放 (30%-200%)
  - 连接长度、排斥力调整
  - 显示/隐藏标签

### 3. 时间轴 (TimelineBar)
- 双滑块范围选择 (-800 ~ 2024)
- 播放动画 (右端点移动，左端点固定)
- 速度切换 (1x, 2x)
- 时代快速跳转按钮 (古代/中世纪/近代/现代)

### 4. 筛选面板
- 时代跳转按钮
- 学派多选筛选 (复选框)
- 实时显示筛选结果数量

### 5. 搜索
- Cmd/Ctrl+K 快捷键
- 哲学家/学派混合搜索
- 键盘导航 (上下箭头选择，回车确认)

---

## 开发命令

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev
# 访问 http://localhost:5174/

# 构建
npm run build

# 代码检查
npm run lint
```

---

## 注意事项

### 地图显示
- 底图使用 CartoDB Positron (浅色主题)
- 标记大小基于 importance: `20 + importance * 3`
- 最小缩放级别: 2 (确保地图填满显示区)

### 数据扩展
当前为静态数据。如需扩展:
1. 手动添加更多哲学家到 `src/data/philosophers.ts`
2. 或接入外部 API (Wikidata、InPhO 等)

### 潜在数据源
- **Wikidata**: 结构化实体数据，SPARQL查询
- **InPhO**: 印第安纳哲学本体论 (计算哲学分类)
- **PhilPapers**: 哲学文献分类体系 (需API key)
- **Stanford Encyclopedia of Philosophy**: 权威条目 (需爬虫)

---

## 最近修改

| Commit | 内容 |
|--------|------|
| 9e30a9f | 应用 Impeccable 设计原则，切换到清晰明亮主题 |
| f34bc3e | 网络图时间过滤、Obsidian风格控件、地图自适应、移除5x速度 |

---

## 待办/想法

- [ ] 接入 Wikidata/InPhO 扩展哲学家数据
- [ ] 添加中英双语地图标签 (需接入中文地图服务)
- [ ] 导出功能 (图片/数据)
- [ ] 哲学家详情页 (独立路由)
- [ ] 更多交互: 路径动画、时间演变可视化
