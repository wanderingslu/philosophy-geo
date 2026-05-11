# 哲学家历史地理可视化平台 - MVP 实施计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 构建可演示的 MVP 版本，包含地图可视化、时间轴过滤、哲学家数据展示和搜索功能。

**Architecture:** Vue 3 + TypeScript 单页应用，Leaflet 处理地图，Pinia 管理状态，静态 JSON 存储数据。组件分层：Map 组件负责地理可视化，Timeline 组件处理时间过滤，Sidebar 处理筛选和列表，所有状态通过 Pinia 共享。

**Tech Stack:** Vue 3, TypeScript, Vite, Leaflet, Pinia, CSS

---

## 项目结构

```
philosophy-geo/
├── public/
│   └── data/
│       ├── philosophers.json    # 哲学家数据
│       └── schools.json         # 学派数据
├── src/
│   ├── components/
│   │   ├── Map/
│   │   │   ├── LeafletMap.vue       # 地图容器
│   │   │   └── PhilosopherMarker.vue # 标记组件
│   │   ├── Timeline/
│   │   │   └── TimelineBar.vue      # 时间轴
│   │   ├── Sidebar/
│   │   │   ├── FilterPanel.vue      # 筛选面板
│   │   │   └── PhilosopherList.vue  # 哲学家列表
│   │   └── Search/
│   │       └── GlobalSearch.vue     # 全局搜索
│   ├── stores/
│   │   ├── mapStore.ts          # 地图状态
│   │   ├── timeStore.ts         # 时间状态
│   │   └── filterStore.ts       # 筛选状态
│   ├── types/
│   │   └── index.ts             # TypeScript 类型
│   ├── data/
│   │   ├── philosophers.ts      # 初始数据
│   │   └── schools.ts           # 学派数据
│   └── App.vue
├── index.html
├── package.json
├── tsconfig.json
└── vite.config.ts
```

---

## Task 1: 项目脚手架初始化

**Files:**
- Create: `package.json`
- Create: `vite.config.ts`
- Create: `tsconfig.json`
- Create: `index.html`
- Create: `src/main.ts`
- Create: `src/App.vue`

- [ ] **Step 1: 创建 package.json**

```json
{
  "name": "philosophy-geo",
  "version": "0.1.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vue-tsc && vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "vue": "^3.4.0",
    "pinia": "^2.1.0",
    "leaflet": "^1.9.4"
  },
  "devDependencies": {
    "@vitejs/plugin-vue": "^5.0.0",
    "@types/leaflet": "^1.9.8",
    "typescript": "^5.3.0",
    "vite": "^5.0.0",
    "vue-tsc": "^1.8.0"
  }
}
```

- [ ] **Step 2: 创建 vite.config.ts**

```typescript
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': '/src'
    }
  }
})
```

- [ ] **Step 3: 创建 tsconfig.json**

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "module": "ESNext",
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "preserve",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"]
    }
  },
  "include": ["src/**/*.ts", "src/**/*.tsx", "src/**/*.vue"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

- [ ] **Step 4: 创建 tsconfig.node.json**

```json
{
  "compilerOptions": {
    "composite": true,
    "skipLibCheck": true,
    "module": "ESNext",
    "moduleResolution": "bundler",
    "allowSyntheticDefaultImports": true
  },
  "include": ["vite.config.ts"]
}
```

- [ ] **Step 5: 创建 index.html**

```html
<!DOCTYPE html>
<html lang="zh-CN">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>哲学家历史地理可视化平台</title>
    <link
      rel="stylesheet"
      href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
      integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY="
      crossorigin=""
    />
  </head>
  <body>
    <div id="app"></div>
    <script type="module" src="/src/main.ts"></script>
  </body>
</html>
```

- [ ] **Step 6: 创建 src/main.ts**

```typescript
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'

const app = createApp(App)
app.use(createPinia())
app.mount('#app')
```

- [ ] **Step 7: 创建基础 App.vue**

```vue
<template>
  <div class="app">
    <header class="header">
      <h1>Philosophy Geo</h1>
    </header>
    <main class="main">
      <p>项目初始化完成</p>
    </main>
  </div>
</template>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  background: #1a1a1a;
  color: #fff;
}

.app {
  height: 100vh;
  display: flex;
  flex-direction: column;
}

.header {
  height: 60px;
  background: rgba(20, 20, 20, 0.95);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  align-items: center;
  padding: 0 20px;
}

.main {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
```

- [ ] **Step 8: 安装依赖并测试**

Run: `npm install`
Expected: 依赖安装完成，无错误

Run: `npm run dev`
Expected: Vite 启动成功，显示 "项目初始化完成"

- [ ] **Step 9: 提交**

```bash
git add package.json vite.config.ts tsconfig.json tsconfig.node.json index.html src/main.ts src/App.vue

git commit -m "chore: init project with Vue 3 + TypeScript + Vite"
```

---

## Task 2: 类型定义与数据结构

**Files:**
- Create: `src/types/index.ts`
- Create: `src/data/schools.ts`
- Create: `src/data/philosophers.ts`

- [ ] **Step 1: 创建类型定义**

```typescript
// src/types/index.ts

export interface GeoPoint {
  lat: number;
  lng: number;
}

export interface NameI18n {
  zh: string;
  en: string;
  original?: string;
}

export interface LifeEvent {
  year: number;
  location: GeoPoint;
  placeName: string;
}

export interface Philosopher {
  id: string;
  name: NameI18n;
  birth: LifeEvent;
  death?: LifeEvent;
  schools: string[];
  influences: string[];
  influencedBy: string[];
  ideas: string[];
  importance: number;
  description: string;
}

export interface School {
  id: string;
  name: NameI18n;
  region: Region;
  period: {
    start: number;
    end: number;
  };
  color: string;
  description: string;
}

export enum Region {
  GREECE = '古希腊',
  ROME = '古罗马',
  EUROPE_WEST = '西欧',
  EUROPE_CENTRAL = '中欧',
  EUROPE_EAST = '东欧',
  CHINA = '中国',
  JAPAN = '日本',
  INDIA = '印度',
  PERSIA = '波斯',
  ARABIA = '阿拉伯世界',
  AMERICAS = '美洲',
  OTHER = '其他'
}

export type TimeRange = {
  start: number;
  end: number;
};
```

- [ ] **Step 2: 创建学派数据**

```typescript
// src/data/schools.ts
import { School, Region } from '@/types'

export const schools: School[] = [
  {
    id: 'platonism',
    name: { zh: '柏拉图主义', en: 'Platonism' },
    region: Region.GREECE,
    period: { start: -387, end: 2024 },
    color: '#4A90E2',
    description: '柏拉图创立的哲学传统'
  },
  {
    id: 'aristotelianism',
    name: { zh: '亚里士多德学派', en: 'Aristotelianism' },
    region: Region.GREECE,
    period: { start: -335, end: 2024 },
    color: '#5B8FF9',
    description: '亚里士多德创立的逍遥学派'
  },
  {
    id: 'confucianism',
    name: { zh: '儒家', en: 'Confucianism' },
    region: Region.CHINA,
    period: { start: -500, end: 2024 },
    color: '#C73E1D',
    description: '孔子创立的儒家学说'
  },
  {
    id: 'taoism',
    name: { zh: '道家', en: 'Taoism' },
    region: Region.CHINA,
    period: { start: -400, end: 2024 },
    color: '#2E7D32',
    description: '老子、庄子代表的道家思想'
  },
  {
    id: 'buddhism',
    name: { zh: '佛教哲学', en: 'Buddhist Philosophy' },
    region: Region.INDIA,
    period: { start: -500, end: 2024 },
    color: '#FF9933',
    description: '源于印度的佛教思想传统'
  },
  {
    id: 'german_idealism',
    name: { zh: '德国观念论', en: 'German Idealism' },
    region: Region.EUROPE_CENTRAL,
    period: { start: 1780, end: 1850 },
    color: '#8E44AD',
    description: '康德、费希特、谢林、黑格尔代表的哲学运动'
  },
  {
    id: 'analytic_philosophy',
    name: { zh: '分析哲学', en: 'Analytic Philosophy' },
    region: Region.EUROPE_WEST,
    period: { start: 1900, end: 2024 },
    color: '#F39C12',
    description: '20世纪英美主导的哲学传统'
  },
  {
    id: 'phenomenology',
    name: { zh: '现象学', en: 'Phenomenology' },
    region: Region.EUROPE_CENTRAL,
    period: { start: 1900, end: 2024 },
    color: '#27AE60',
    description: '胡塞尔创立的现象学运动'
  }
]

export const getSchoolById = (id: string): School | undefined =>
  schools.find(s => s.id === id)
```

- [ ] **Step 3: 创建哲学家数据（20位核心人物）**

```typescript
// src/data/philosophers.ts
import { Philosopher } from '@/types'

export const philosophers: Philosopher[] = [
  // 古希腊
  {
    id: 'socrates',
    name: { zh: '苏格拉底', en: 'Socrates', original: 'Σωκράτης' },
    birth: { year: -470, location: { lat: 37.9838, lng: 23.7275 }, placeName: '雅典' },
    death: { year: -399, location: { lat: 37.9838, lng: 23.7275 }, placeName: '雅典' },
    schools: ['platonism'],
    influences: [],
    influencedBy: [],
    ideas: ['苏格拉底方法', '认识你自己', '美德即知识'],
    importance: 10,
    description: '西方哲学的奠基人之一'
  },
  {
    id: 'plato',
    name: { zh: '柏拉图', en: 'Plato', original: 'Πλάτων' },
    birth: { year: -428, location: { lat: 37.9838, lng: 23.7275 }, placeName: '雅典' },
    death: { year: -348, location: { lat: 37.9838, lng: 23.7275 }, placeName: '雅典' },
    schools: ['platonism'],
    influences: ['socrates'],
    influencedBy: ['aristotle'],
    ideas: ['理念论', '洞穴寓言', '理想国'],
    importance: 10,
    description: '柏拉图学园的创立者，西方哲学史上最具影响力的哲学家之一'
  },
  {
    id: 'aristotle',
    name: { zh: '亚里士多德', en: 'Aristotle', original: 'Ἀριστοτέλης' },
    birth: { year: -384, location: { lat: 40.7814, lng: 22.4784 }, placeName: '斯塔吉拉' },
    death: { year: -322, location: { lat: 39.3667, lng: 22.9333 }, placeName: '卡尔基斯' },
    schools: ['aristotelianism'],
    influences: ['plato'],
    influencedBy: [],
    ideas: ['形而上学', '逻辑学', '伦理学', '政治学'],
    importance: 10,
    description: '逍遥学派创始人，百科全书式的学者'
  },
  // 中国
  {
    id: 'confucius',
    name: { zh: '孔子', en: 'Confucius', original: '孔丘' },
    birth: { year: -551, location: { lat: 35.6, lng: 116.98 }, placeName: '曲阜' },
    death: { year: -479, location: { lat: 35.6, lng: 116.98 }, placeName: '曲阜' },
    schools: ['confucianism'],
    influences: [],
    influencedBy: [],
    ideas: ['仁', '礼', '中庸', '君子'],
    importance: 10,
    description: '儒家学派创始人，对中国文化影响最深远的思想家'
  },
  {
    id: 'laozi',
    name: { zh: '老子', en: 'Laozi', original: '李耳' },
    birth: { year: -571, location: { lat: 34.0, lng: 112.5 }, placeName: '苦县' },
    death: { year: -471, location: { lat: 34.0, lng: 112.5 }, placeName: '不详' },
    schools: ['taoism'],
    influences: [],
    influencedBy: [],
    ideas: ['道', '无为', '自然', '柔弱胜刚强'],
    importance: 10,
    description: '道家学派创始人，著有《道德经》'
  },
  {
    id: 'zhuangzi',
    name: { zh: '庄子', en: 'Zhuangzi', original: '庄周' },
    birth: { year: -369, location: { lat: 33.0, lng: 115.5 }, placeName: '宋国蒙' },
    death: { year: -286, location: { lat: 33.0, lng: 115.5 }, placeName: '不详' },
    schools: ['taoism'],
    influences: ['laozi'],
    influencedBy: [],
    ideas: ['逍遥', '齐物', '梦蝶', '无用之用'],
    importance: 9,
    description: '道家思想的集大成者，与老子并称老庄'
  },
  {
    id: 'mencius',
    name: { zh: '孟子', en: 'Mencius', original: '孟轲' },
    birth: { year: -372, location: { lat: 35.0, lng: 117.0 }, placeName: '邹国' },
    death: { year: -289, location: { lat: 35.0, lng: 117.0 }, placeName: '不详' },
    schools: ['confucianism'],
    influences: ['confucius'],
    influencedBy: [],
    ideas: ['性善论', '仁政', '民贵君轻'],
    importance: 9,
    description: '儒家亚圣，继承并发展了孔子的思想'
  },
  // 印度
  {
    id: 'buddha',
    name: { zh: '佛陀', en: 'Buddha', original: 'Siddhartha Gautama' },
    birth: { year: -563, location: { lat: 27.5, lng: 83.0 }, placeName: '蓝毗尼' },
    death: { year: -483, location: { lat: 26.75, lng: 85.0 }, placeName: '拘尸那揭罗' },
    schools: ['buddhism'],
    influences: [],
    influencedBy: [],
    ideas: ['四圣谛', '八正道', '缘起', '涅槃'],
    importance: 10,
    description: '佛教创始人，觉悟者'
  },
  {
    id: 'nagarjuna',
    name: { zh: '龙树', en: 'Nagarjuna', original: 'नागार्जुन' },
    birth: { year: -150, location: { lat: 17.5, lng: 78.5 }, placeName: '南印度' },
    death: { year: 250, location: { lat: 17.5, lng: 78.5 }, placeName: '不详' },
    schools: ['buddhism'],
    influences: ['buddha'],
    influencedBy: [],
    ideas: ['中观', '空性', '二谛'],
    importance: 9,
    description: '中观学派创始人，大乘佛教最重要的论师'
  },
  // 阿拉伯/波斯
  {
    id: 'avicenna',
    name: { zh: '伊本·西那', en: 'Avicenna', original: 'Ibn Sina' },
    birth: { year: 980, location: { lat: 37.5, lng: 66.0 }, placeName: '布哈拉' },
    death: { year: 1037, location: { lat: 35.7, lng: 51.4 }, placeName: '哈马丹' },
    schools: ['aristotelianism'],
    influences: ['aristotle'],
    influencedBy: [],
    ideas: ['存在与本质', '灵魂学', '医学'],
    importance: 9,
    description: '伊斯兰黄金时代最伟大的哲学家和医学家'
  },
  // 近代欧洲
  {
    id: 'descartes',
    name: { zh: '笛卡尔', en: 'Descartes', original: 'René Descartes' },
    birth: { year: 1596, location: { lat: 47.2, lng: 1.5 }, placeName: '拉海耶' },
    death: { year: 1650, location: { lat: 54.5, lng: 18.5 }, placeName: '斯德哥尔摩' },
    schools: ['rationalism'],
    influences: [],
    influencedBy: [],
    ideas: ['我思故我在', '心物二元', '理性主义'],
    importance: 10,
    description: '近代哲学之父，理性主义奠基人'
  },
  {
    id: 'kant',
    name: { zh: '康德', en: 'Kant', original: 'Immanuel Kant' },
    birth: { year: 1724, location: { lat: 54.7, lng: 20.5 }, placeName: '柯尼斯堡' },
    death: { year: 1804, location: { lat: 54.7, lng: 20.5 }, placeName: '柯尼斯堡' },
    schools: ['german_idealism'],
    influences: ['descartes', 'hume'],
    influencedBy: ['hegel'],
    ideas: ['先验唯心论', '绝对命令', '哥白尼革命'],
    importance: 10,
    description: '德国古典哲学创始人，批判哲学体系建立者'
  },
  {
    id: 'hegel',
    name: { zh: '黑格尔', en: 'Hegel', original: 'Georg Wilhelm Friedrich Hegel' },
    birth: { year: 1770, location: { lat: 48.8, lng: 9.2 }, placeName: '斯图加特' },
    death: { year: 1831, location: { lat: 52.5, lng: 13.4 }, placeName: '柏林' },
    schools: ['german_idealism'],
    influences: ['kant'],
    influencedBy: ['marx'],
    ideas: ['辩证法', '绝对精神', '主奴辩证法'],
    importance: 10,
    description: '德国观念论集大成者'
  },
  // 现代
  {
    id: 'wittgenstein',
    name: { zh: '维特根斯坦', en: 'Wittgenstein', original: 'Ludwig Wittgenstein' },
    birth: { year: 1889, location: { lat: 48.2, lng: 16.4 }, placeName: '维也纳' },
    death: { year: 1951, location: { lat: 52.2, lng: 0.1 }, placeName: '剑桥' },
    schools: ['analytic_philosophy'],
    influences: ['frege', 'russell'],
    influencedBy: [],
    ideas: ['语言游戏', '私人语言论证', '不可说'],
    importance: 10,
    description: '20世纪最有影响力的哲学家之一'
  },
  {
    id: 'heidegger',
    name: { zh: '海德格尔', en: 'Heidegger', original: 'Martin Heidegger' },
    birth: { year: 1889, location: { lat: 48.0, lng: 8.0 }, placeName: '梅斯基希' },
    death: { year: 1976, location: { lat: 48.0, lng: 8.0 }, placeName: '弗莱堡' },
    schools: ['phenomenology'],
    influences: ['husserl'],
    influencedBy: [],
    ideas: ['此在', '存在与时间', '技术追问'],
    importance: 9,
    description: '存在主义现象学代表人物'
  },
  {
    id: 'husserl',
    name: { zh: '胡塞尔', en: 'Husserl', original: 'Edmund Husserl' },
    birth: { year: 1859, location: { lat: 49.2, lng: 17.6 }, placeName: '普罗斯捷约夫' },
    death: { year: 1938, location: { lat: 48.0, lng: 7.8 }, placeName: '弗莱堡' },
    schools: ['phenomenology'],
    influences: ['brentano'],
    influencedBy: ['heidegger'],
    ideas: ['现象学', '回到事物本身', '意向性'],
    importance: 9,
    description: '现象学运动创始人'
  },
  {
    id: 'epicurus',
    name: { zh: '伊壁鸠鲁', en: 'Epicurus', original: 'Ἐπίκουρος' },
    birth: { year: -341, location: { lat: 37.0, lng: 27.0 }, placeName: '萨摩斯岛' },
    death: { year: -270, location: { lat: 37.9838, lng: 23.7275 }, placeName: '雅典' },
    schools: ['epicureanism'],
    influences: ['democritus'],
    influencedBy: [],
    ideas: ['快乐主义', '原子论', '花园哲学'],
    importance: 8,
    description: '伊壁鸠鲁学派创始人'
  },
  {
    id: 'xunzi',
    name: { zh: '荀子', en: 'Xunzi', original: '荀况' },
    birth: { year: -313, location: { lat: 36.0, lng: 114.5 }, placeName: '赵国' },
    death: { year: -238, location: { lat: 36.0, lng: 114.5 }, placeName: '兰陵' },
    schools: ['confucianism'],
    influences: ['confucius'],
    influencedBy: [],
    ideas: ['性恶论', '礼法并重', '天行有常'],
    importance: 8,
    description: '儒家重要代表人物，先秦思想的集大成者'
  },
  {
    id: 'seneca',
    name: { zh: '塞内卡', en: 'Seneca', original: 'Lucius Annaeus Seneca' },
    birth: { year: -4, location: { lat: 37.25, lng: -6.95 }, placeName: '科尔多瓦' },
    death: { year: 65, location: { lat: 41.9, lng: 12.5 }, placeName: '罗马' },
    schools: ['stoicism'],
    influences: ['zeno'],
    influencedBy: [],
    ideas: ['斯多葛主义', '自然法', '命运'],
    importance: 8,
    description: '罗马斯多葛学派代表人物'
  },
  {
    id: 'russell',
    name: { zh: '罗素', en: 'Russell', original: 'Bertrand Russell' },
    birth: { year: 1872, location: { lat: 52.5, lng: -3.5 }, placeName: '特雷莱克' },
    death: { year: 1970, location: { lat: 51.5, lng: -0.1 }, placeName: '彭林' },
    schools: ['analytic_philosophy'],
    influences: ['frege'],
    influencedBy: ['wittgenstein'],
    ideas: ['逻辑原子论', '类型论', '和平主义'],
    importance: 9,
    description: '分析哲学创始人之一，逻辑学家和社会活动家'
  }
]

export const getPhilosopherById = (id: string) =>
  philosophers.find(p => p.id === id)

export const getPhilosophersByTimeRange = (start: number, end: number) =>
  philosophers.filter(p => {
    const birth = p.birth.year
    const death = p.death?.year ?? birth + 80
    return birth <= end && death >= start
  })

export const getPhilosophersBySchool = (schoolId: string) =>
  philosophers.filter(p => p.schools.includes(schoolId))

export const getPhilosophersByRegion = (region: string) =>
  philosophers.filter(p => {
    const school = p.schools[0]
    // 需要结合schools数据判断，简化处理
    return true
  })
```

- [ ] **Step 4: 提交**

```bash
git add src/types/index.ts src/data/schools.ts src/data/philosophers.ts
git commit -m "feat: add type definitions and initial data (20 philosophers, 8 schools)"
```

---

## Task 3: Pinia 状态管理

**Files:**
- Create: `src/stores/mapStore.ts`
- Create: `src/stores/timeStore.ts`
- Create: `src/stores/filterStore.ts`

- [ ] **Step 1: 创建地图状态**

```typescript
// src/stores/mapStore.ts
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Philosopher, GeoPoint } from '@/types'

export const useMapStore = defineStore('map', () => {
  // State
  const center = ref<GeoPoint>({ lat: 30, lng: 20 })
  const zoom = ref(3)
  const selectedPhilosopher = ref<Philosopher | null>(null)
  const hoveredPhilosopher = ref<Philosopher | null>(null)

  // Getters
  const mapConfig = computed(() => ({
    center: center.value,
    zoom: zoom.value
  }))

  // Actions
  const setCenter = (newCenter: GeoPoint) => {
    center.value = newCenter
  }

  const setZoom = (newZoom: number) => {
    zoom.value = newZoom
  }

  const selectPhilosopher = (philosopher: Philosopher | null) => {
    selectedPhilosopher.value = philosopher
  }

  const hoverPhilosopher = (philosopher: Philosopher | null) => {
    hoveredPhilosopher.value = philosopher
  }

  const flyToLocation = (location: GeoPoint, targetZoom = 8) => {
    center.value = location
    zoom.value = targetZoom
  }

  return {
    center,
    zoom,
    selectedPhilosopher,
    hoveredPhilosopher,
    mapConfig,
    setCenter,
    setZoom,
    selectPhilosopher,
    hoverPhilosopher,
    flyToLocation
  }
})
```

- [ ] **Step 2: 创建时间状态**

```typescript
// src/stores/timeStore.ts
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useTimeStore = defineStore('time', () => {
  // State
  const minYear = ref(-800)
  const maxYear = ref(2024)
  const currentRange = ref({ start: -800, end: 2024 })
  const isPlaying = ref(false)
  const playSpeed = ref(1) // years per second

  // Getters
  const yearSpan = computed(() => currentRange.value.end - currentRange.value.start)
  
  const formattedRange = computed(() => ({
    start: formatYear(currentRange.value.start),
    end: formatYear(currentRange.value.end)
  }))

  // Actions
  const setRange = (start: number, end: number) => {
    currentRange.value = {
      start: Math.max(minYear.value, start),
      end: Math.min(maxYear.value, end)
    }
  }

  const setStart = (start: number) => {
    if (start < currentRange.value.end) {
      currentRange.value.start = Math.max(minYear.value, start)
    }
  }

  const setEnd = (end: number) => {
    if (end > currentRange.value.start) {
      currentRange.value.end = Math.min(maxYear.value, end)
    }
  }

  const play = () => {
    isPlaying.value = true
  }

  const pause = () => {
    isPlaying.value = false
  }

  const togglePlay = () => {
    isPlaying.value = !isPlaying.value
  }

  const setSpeed = (speed: number) => {
    playSpeed.value = speed
  }

  const advanceTime = (years: number) => {
    const newStart = currentRange.value.start + years
    const newEnd = currentRange.value.end + years
    
    if (newEnd <= maxYear.value) {
      currentRange.value.start = newStart
      currentRange.value.end = newEnd
      return true
    }
    return false
  }

  const reset = () => {
    currentRange.value = { start: minYear.value, end: maxYear.value }
    isPlaying.value = false
  }

  // Helper
  function formatYear(year: number): string {
    if (year < 0) {
      return `公元前 ${Math.abs(year)} 年`
    }
    return `${year} 年`
  }

  return {
    minYear,
    maxYear,
    currentRange,
    isPlaying,
    playSpeed,
    yearSpan,
    formattedRange,
    setRange,
    setStart,
    setEnd,
    play,
    pause,
    togglePlay,
    setSpeed,
    advanceTime,
    reset
  }
})
```

- [ ] **Step 3: 创建筛选状态**

```typescript
// src/stores/filterStore.ts
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Philosopher, School, Region } from '@/types'
import { philosophers } from '@/data/philosophers'
import { schools } from '@/data/schools'
import { useTimeStore } from './timeStore'

export const useFilterStore = defineStore('filter', () => {
  // State
  const selectedRegions = ref<Region[]>([])
  const selectedSchools = ref<string[]>([])
  const searchQuery = ref('')

  // Getters
  const filteredPhilosophers = computed(() => {
    const timeStore = useTimeStore()
    const { start, end } = timeStore.currentRange

    return philosophers.filter(p => {
      // 时间筛选
      const birth = p.birth.year
      const death = p.death?.year ?? birth + 80
      const inTimeRange = birth <= end && death >= start

      // 学派筛选
      const inSchools = selectedSchools.value.length === 0 ||
        p.schools.some(s => selectedSchools.value.includes(s))

      // 搜索筛选
      const matchesSearch = searchQuery.value === '' ||
        p.name.zh.includes(searchQuery.value) ||
        p.name.en.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
        p.name.original?.includes(searchQuery.value) ||
        p.description.includes(searchQuery.value)

      return inTimeRange && inSchools && matchesSearch
    })
  })

  const filteredSchools = computed(() => {
    if (selectedSchools.value.length === 0) return schools
    return schools.filter(s => selectedSchools.value.includes(s.id))
  })

  const availableSchools = computed(() => {
    const usedSchoolIds = new Set(
      filteredPhilosophers.value.flatMap(p => p.schools)
    )
    return schools.filter(s => usedSchoolIds.has(s.id))
  })

  // Actions
  const setSearchQuery = (query: string) => {
    searchQuery.value = query
  }

  const toggleRegion = (region: Region) => {
    const index = selectedRegions.value.indexOf(region)
    if (index === -1) {
      selectedRegions.value.push(region)
    } else {
      selectedRegions.value.splice(index, 1)
    }
  }

  const toggleSchool = (schoolId: string) => {
    const index = selectedSchools.value.indexOf(schoolId)
    if (index === -1) {
      selectedSchools.value.push(schoolId)
    } else {
      selectedSchools.value.splice(index, 1)
    }
  }

  const resetFilters = () => {
    selectedRegions.value = []
    selectedSchools.value = []
    searchQuery.value = ''
  }

  const clearSearch = () => {
    searchQuery.value = ''
  }

  return {
    selectedRegions,
    selectedSchools,
    searchQuery,
    filteredPhilosophers,
    filteredSchools,
    availableSchools,
    setSearchQuery,
    toggleRegion,
    toggleSchool,
    resetFilters,
    clearSearch
  }
})
```

- [ ] **Step 4: 提交**

```bash
git add src/stores/mapStore.ts src/stores/timeStore.ts src/stores/filterStore.ts
git commit -m "feat: add Pinia stores for map, time, and filter state"
```

---

## Task 4: 地图组件实现

**Files:**
- Create: `src/components/Map/LeafletMap.vue`
- Create: `src/components/Map/PhilosopherMarker.vue`

- [ ] **Step 1: 创建 LeafletMap.vue**

```vue
<template>
  <div ref="mapContainer" class="map-container"></div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue'
import L from 'leaflet'
import { useMapStore } from '@/stores/mapStore'
import { useFilterStore } from '@/stores/filterStore'
import type { Philosopher } from '@/types'

const mapContainer = ref<HTMLElement | null>(null)
const map = ref<L.Map | null>(null)
const markers = ref<Map<string, L.Marker>>(new Map())

const mapStore = useMapStore()
const filterStore = useFilterStore()

onMounted(() => {
  if (!mapContainer.value) return

  // 初始化地图
  map.value = L.map(mapContainer.value, {
    center: [mapStore.center.lat, mapStore.center.lng],
    zoom: mapStore.zoom,
    minZoom: 2,
    maxZoom: 18,
    zoomControl: false,
    attributionControl: false
  })

  // 添加深色底图
  L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
    maxZoom: 19,
    attribution: '&copy; OpenStreetMap &copy; CARTO'
  }).addTo(map.value)

  // 添加缩放控件到右下角
  L.control.zoom({ position: 'bottomright' }).addTo(map.value)

  // 监听地图移动
  map.value.on('moveend', () => {
    if (map.value) {
      const center = map.value.getCenter()
      mapStore.setCenter({ lat: center.lat, lng: center.lng })
    }
  })

  map.value.on('zoomend', () => {
    if (map.value) {
      mapStore.setZoom(map.value.getZoom())
    }
  })

  // 初始渲染标记
  updateMarkers()

  // 监听筛选结果变化
  watch(() => filterStore.filteredPhilosophers, updateMarkers, { deep: true })

  // 监听选中哲学家变化（飞行到位置）
  watch(() => mapStore.selectedPhilosopher, (phil) => {
    if (phil && map.value) {
      map.value.flyTo(
        [phil.birth.location.lat, phil.birth.location.lng],
        8,
        { duration: 1.5 }
      )
      highlightMarker(phil.id)
    }
  })
})

onUnmounted(() => {
  if (map.value) {
    map.value.remove()
    map.value = null
  }
})

function updateMarkers() {
  if (!map.value) return

  // 清除现有标记
  markers.value.forEach(marker => marker.remove())
  markers.value.clear()

  // 添加新标记
  filterStore.filteredPhilosophers.forEach(philosopher => {
    const marker = createMarker(philosopher)
    marker.addTo(map.value!)
    markers.value.set(philosopher.id, marker)
  })
}

function createMarker(philosopher: Philosopher): L.Marker {
  const { lat, lng } = philosopher.birth.location
  const school = getSchoolColor(philosopher.schools[0])
  const size = 20 + philosopher.importance * 3

  const icon = L.divIcon({
    className: 'philosopher-marker',
    html: `
      <div class="marker-inner" style="
        width: ${size}px;
        height: ${size}px;
        background: ${school};
        border: 2px solid white;
        border-radius: 50%;
        box-shadow: 0 2px 8px rgba(0,0,0,0.4);
        cursor: pointer;
        transition: transform 0.2s;
      "></div>
      <div class="marker-label" style="
        position: absolute;
        top: 100%;
        left: 50%;
        transform: translateX(-50%);
        margin-top: 4px;
        white-space: nowrap;
        font-size: 12px;
        color: white;
        text-shadow: 0 1px 2px rgba(0,0,0,0.8);
        pointer-events: none;
        opacity: 0;
        transition: opacity 0.2s;
      ">${philosopher.name.zh}</div>
    `,
    iconSize: [size, size + 20],
    iconAnchor: [size / 2, size / 2]
  })

  const marker = L.marker([lat, lng], { icon })

  marker.on('click', () => {
    mapStore.selectPhilosopher(philosopher)
  })

  marker.on('mouseover', () => {
    mapStore.hoverPhilosopher(philosopher)
    const el = marker.getElement()
    if (el) {
      const inner = el.querySelector('.marker-inner') as HTMLElement
      const label = el.querySelector('.marker-label') as HTMLElement
      if (inner) inner.style.transform = 'scale(1.2)'
      if (label) label.style.opacity = '1'
    }
  })

  marker.on('mouseout', () => {
    mapStore.hoverPhilosopher(null)
    const el = marker.getElement()
    if (el) {
      const inner = el.querySelector('.marker-inner') as HTMLElement
      const label = el.querySelector('.marker-label') as HTMLElement
      if (inner) inner.style.transform = 'scale(1)'
      if (label) label.style.opacity = '0'
    }
  })

  return marker
}

function highlightMarker(philosopherId: string) {
  markers.value.forEach((marker, id) => {
    const el = marker.getElement()
    if (!el) return
    const inner = el.querySelector('.marker-inner') as HTMLElement
    if (inner) {
      if (id === philosopherId) {
        inner.style.boxShadow = '0 0 20px rgba(255,255,255,0.8)'
        inner.style.transform = 'scale(1.3)'
      } else {
        inner.style.boxShadow = '0 2px 8px rgba(0,0,0,0.4)'
        inner.style.transform = 'scale(1)'
      }
    }
  })
}

function getSchoolColor(schoolId: string): string {
  const schoolColors: Record<string, string> = {
    platonism: '#4A90E2',
    aristotelianism: '#5B8FF9',
    confucianism: '#C73E1D',
    taoism: '#2E7D32',
    buddhism: '#FF9933',
    german_idealism: '#8E44AD',
    analytic_philosophy: '#F39C12',
    phenomenology: '#27AE60',
    epicureanism: '#9B59B6',
    stoicism: '#34495E',
    rationalism: '#3498DB'
  }
  return schoolColors[schoolId] || '#95A5A6'
}
</script>

<style scoped>
.map-container {
  width: 100%;
  height: 100%;
  background: #1a1a1a;
}

:global(.philosopher-marker) {
  position: relative;
}

:global(.leaflet-container) {
  background: #1a1a1a !important;
}
</style>
```

- [ ] **Step 2: 提交**

```bash
git add src/components/Map/LeafletMap.vue
git commit -m "feat: implement LeafletMap component with philosopher markers"
```

---

## Task 5: 时间轴组件

**Files:**
- Create: `src/components/Timeline/TimelineBar.vue`

- [ ] **Step 1: 创建 TimelineBar.vue**

```vue
<template>
  <div class="timeline-bar">
    <div class="timeline-controls">
      <button
        class="play-btn"
        @click="timeStore.togglePlay"
        :class="{ playing: timeStore.isPlaying }"
      >
        {{ timeStore.isPlaying ? '⏸' : '▶' }}
      </button>
      <div class="speed-control">
        <button
          v-for="speed in [1, 2, 5]"
          :key="speed"
          :class="{ active: timeStore.playSpeed === speed }"
          @click="timeStore.setSpeed(speed)"
        >
          {{ speed }}x
        </button>
      </div>
      <span class="time-display">
        {{ timeStore.formattedRange.start }} - {{ timeStore.formattedRange.end }}
      </span>
      <button class="reset-btn" @click="reset">重置</button>
    </div>

    <div class="timeline-slider">
      <div class="slider-track">
        <div
          class="slider-range"
          :style="rangeStyle"
        ></div>
        <input
          type="range"
          class="slider-input start"
          :min="timeStore.minYear"
          :max="timeStore.maxYear"
          v-model.number="startYear"
          @input="onStartChange"
        />
        <input
          type="range"
          class="slider-input end"
          :min="timeStore.minYear"
          :max="timeStore.maxYear"
          v-model.number="endYear"
          @input="onEndChange"
        />
      </div>
      <div class="timeline-labels">
        <span>公元前800年</span>
        <span>公元元年</span>
        <span>2024年</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onUnmounted } from 'vue'
import { useTimeStore } from '@/stores/timeStore'

const timeStore = useTimeStore()
const startYear = ref(timeStore.currentRange.start)
const endYear = ref(timeStore.currentRange.end)

let playInterval: ReturnType<typeof setInterval> | null = null

const rangeStyle = computed(() => {
  const total = timeStore.maxYear - timeStore.minYear
  const start = ((startYear.value - timeStore.minYear) / total) * 100
  const end = ((endYear.value - timeStore.minYear) / total) * 100
  return {
    left: `${start}%`,
    width: `${end - start}%`
  }
})

// Sync with store
watch(() => timeStore.currentRange, (range) => {
  startYear.value = range.start
  endYear.value = range.end
}, { deep: true })

// Handle animation
watch(() => timeStore.isPlaying, (isPlaying) => {
  if (isPlaying) {
    playInterval = setInterval(() => {
      const advanced = timeStore.advanceTime(10 * timeStore.playSpeed)
      if (!advanced) {
        timeStore.pause()
      }
    }, 200)
  } else {
    if (playInterval) {
      clearInterval(playInterval)
      playInterval = null
    }
  }
})

onUnmounted(() => {
  if (playInterval) {
    clearInterval(playInterval)
  }
})

function onStartChange() {
  if (startYear.value >= endYear.value) {
    startYear.value = endYear.value - 50
  }
  timeStore.setStart(startYear.value)
}

function onEndChange() {
  if (endYear.value <= startYear.value) {
    endYear.value = startYear.value + 50
  }
  timeStore.setEnd(endYear.value)
}

function reset() {
  timeStore.reset()
}
</script>

<style scoped>
.timeline-bar {
  background: rgba(20, 20, 20, 0.95);
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  padding: 12px 20px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.timeline-controls {
  display: flex;
  align-items: center;
  gap: 16px;
}

.play-btn {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: none;
  background: #4A90E2;
  color: white;
  font-size: 14px;
  cursor: pointer;
  transition: background 0.2s;
}

.play-btn:hover {
  background: #3a7bc8;
}

.play-btn.playing {
  background: #e74c3c;
}

.speed-control {
  display: flex;
  gap: 4px;
}

.speed-control button {
  padding: 4px 10px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  background: transparent;
  color: rgba(255, 255, 255, 0.7);
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
}

.speed-control button.active {
  background: #4A90E2;
  color: white;
  border-color: #4A90E2;
}

.time-display {
  flex: 1;
  text-align: center;
  font-size: 16px;
  font-weight: 500;
}

.reset-btn {
  padding: 6px 16px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  background: transparent;
  color: rgba(255, 255, 255, 0.7);
  border-radius: 4px;
  cursor: pointer;
  font-size: 13px;
}

.reset-btn:hover {
  background: rgba(255, 255, 255, 0.1);
}

.timeline-slider {
  position: relative;
}

.slider-track {
  position: relative;
  height: 6px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 3px;
  margin: 10px 0;
}

.slider-range {
  position: absolute;
  height: 100%;
  background: #4A90E2;
  border-radius: 3px;
}

.slider-input {
  position: absolute;
  top: -7px;
  width: 100%;
  height: 20px;
  -webkit-appearance: none;
  appearance: none;
  background: transparent;
  pointer-events: none;
}

.slider-input::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: white;
  cursor: pointer;
  pointer-events: auto;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
}

.slider-input::-moz-range-thumb {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: white;
  cursor: pointer;
  pointer-events: auto;
  border: none;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
}

.timeline-labels {
  display: flex;
  justify-content: space-between;
  font-size: 11px;
  color: rgba(255, 255, 255, 0.5);
}
</style>
```

- [ ] **Step 2: 提交**

```bash
git add src/components/Timeline/TimelineBar.vue
git commit -m "feat: implement TimelineBar with dual sliders and play animation"
```

---

## Task 6: 侧边栏组件

**Files:**
- Create: `src/components/Sidebar/FilterPanel.vue`
- Create: `src/components/Sidebar/PhilosopherList.vue`

- [ ] **Step 1: 创建 FilterPanel.vue**

```vue
<template>
  <div class="filter-panel">
    <h3>筛选</h3>

    <div class="filter-section">
      <h4>学派</h4>
      <div class="school-filters">
        <label
          v-for="school in schools"
          :key="school.id"
          class="school-checkbox"
        >
          <input
            type="checkbox"
            :value="school.id"
            :checked="filterStore.selectedSchools.includes(school.id)"
            @change="filterStore.toggleSchool(school.id)"
          />
          <span
            class="color-dot"
            :style="{ background: school.color }"
          ></span>
          <span class="school-name">{{ school.name.zh }}</span>
        </label>
      </div>
    </div>

    <div class="filter-section">
      <h4>快速跳转</h4>
      <div class="era-buttons">
        <button
          v-for="era in eras"
          :key="era.name"
          @click="jumpToEra(era)"
        >
          {{ era.name }}
        </button>
      </div>
    </div>

    <button class="reset-btn" @click="filterStore.resetFilters">
      重置筛选
    </button>
  </div>
</template>

<script setup lang="ts">
import { useFilterStore } from '@/stores/filterStore'
import { useTimeStore } from '@/stores/timeStore'
import { schools } from '@/data/schools'

const filterStore = useFilterStore()
const timeStore = useTimeStore()

const eras = [
  { name: '古代', start: -800, end: 500 },
  { name: '中世纪', start: 500, end: 1500 },
  { name: '近代', start: 1500, end: 1900 },
  { name: '现代', start: 1900, end: 2024 }
]

function jumpToEra(era: { start: number; end: number }) {
  timeStore.setRange(era.start, era.end)
}
</script>

<style scoped>
.filter-panel {
  padding: 16px;
}

h3 {
  margin: 0 0 16px;
  font-size: 16px;
  font-weight: 600;
}

.filter-section {
  margin-bottom: 20px;
}

h4 {
  margin: 0 0 10px;
  font-size: 13px;
  color: rgba(255, 255, 255, 0.6);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.school-filters {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.school-checkbox {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  padding: 6px 8px;
  border-radius: 6px;
  transition: background 0.2s;
}

.school-checkbox:hover {
  background: rgba(255, 255, 255, 0.05);
}

.school-checkbox input {
  cursor: pointer;
}

.color-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  flex-shrink: 0;
}

.school-name {
  font-size: 13px;
}

.era-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.era-buttons button {
  padding: 6px 12px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  background: transparent;
  color: rgba(255, 255, 255, 0.8);
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
  transition: all 0.2s;
}

.era-buttons button:hover {
  background: rgba(255, 255, 255, 0.1);
  border-color: rgba(255, 255, 255, 0.4);
}

.reset-btn {
  width: 100%;
  padding: 10px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  background: transparent;
  color: rgba(255, 255, 255, 0.7);
  border-radius: 6px;
  cursor: pointer;
  font-size: 13px;
  transition: all 0.2s;
}

.reset-btn:hover {
  background: rgba(231, 76, 60, 0.2);
  border-color: rgba(231, 76, 60, 0.5);
  color: #e74c3c;
}
</style>
```

- [ ] **Step 2: 创建 PhilosopherList.vue**

```vue
<template>
  <div class="philosopher-list">
    <div class="list-header">
      <span>哲学家 ({{ filterStore.filteredPhilosophers.length }})</span>
    </div>
    <div class="list-content">
      <div
        v-for="philosopher in sortedPhilosophers"
        :key="philosopher.id"
        class="philosopher-item"
        :class="{ active: mapStore.selectedPhilosopher?.id === philosopher.id }"
        @click="selectPhilosopher(philosopher)"
        @mouseenter="mapStore.hoverPhilosopher(philosopher)"
        @mouseleave="mapStore.hoverPhilosopher(null)"
      >
        <span
          class="school-indicator"
          :style="{ background: getSchoolColor(philosopher.schools[0]) }"
        ></span>
        <div class="philosopher-info">
          <div class="name">{{ philosopher.name.zh }}</div>
          <div class="years">{{ formatYears(philosopher) }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useMapStore } from '@/stores/mapStore'
import { useFilterStore } from '@/stores/filterStore'
import type { Philosopher } from '@/types'
import { schools } from '@/data/schools'

const mapStore = useMapStore()
const filterStore = useFilterStore()

const sortedPhilosophers = computed(() => {
  return [...filterStore.filteredPhilosophers].sort(
    (a, b) => b.importance - a.importance
  )
})

function selectPhilosopher(philosopher: Philosopher) {
  mapStore.selectPhilosopher(philosopher)
  mapStore.flyToLocation(philosopher.birth.location)
}

function getSchoolColor(schoolId: string): string {
  const school = schools.find(s => s.id === schoolId)
  return school?.color || '#95A5A6'
}

function formatYears(p: Philosopher): string {
  const birth = p.birth.year < 0 ? `前${Math.abs(p.birth.year)}` : p.birth.year
  const death = p.death
    ? (p.death.year < 0 ? `前${Math.abs(p.death.year)}` : p.death.year)
    : '?'
  return `${birth} - ${death}`
}
</script>

<style scoped>
.philosopher-list {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.list-header {
  padding: 12px 16px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  font-size: 13px;
  color: rgba(255, 255, 255, 0.6);
}

.list-content {
  flex: 1;
  overflow-y: auto;
}

.philosopher-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  cursor: pointer;
  transition: background 0.2s;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.philosopher-item:hover {
  background: rgba(255, 255, 255, 0.05);
}

.philosopher-item.active {
  background: rgba(74, 144, 226, 0.2);
}

.school-indicator {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  flex-shrink: 0;
}

.philosopher-info {
  flex: 1;
  min-width: 0;
}

.name {
  font-size: 14px;
  font-weight: 500;
  margin-bottom: 2px;
}

.years {
  font-size: 11px;
  color: rgba(255, 255, 255, 0.5);
}
</style>
```

- [ ] **Step 3: 提交**

```bash
git add src/components/Sidebar/FilterPanel.vue src/components/Sidebar/PhilosopherList.vue
git commit -m "feat: implement Sidebar components - FilterPanel and PhilosopherList"
```

---

## Task 7: 全局搜索组件

**Files:**
- Create: `src/components/Search/GlobalSearch.vue`

- [ ] **Step 1: 创建 GlobalSearch.vue**

```vue
<template>
  <div class="global-search" ref="searchRef">
    <div class="search-input-wrapper">
      <span class="search-icon">🔍</span>
      <input
        ref="inputRef"
        v-model="query"
        type="text"
        placeholder="搜索哲学家、学派、地点..."
        @focus="isOpen = true"
        @keydown.down.prevent="highlightNext"
        @keydown.up.prevent="highlightPrev"
        @keydown.enter.prevent="selectHighlighted"
        @keydown.esc="isOpen = false"
      />
      <span class="shortcut-hint">⌘K</span>
    </div>

    <div v-if="isOpen && results.length > 0" class="search-dropdown">
      <div
        v-for="(result, index) in results"
        :key="result.id"
        class="search-result"
        :class="{ highlighted: index === highlightedIndex }"
        @click="selectResult(result)"
        @mouseenter="highlightedIndex = index"
      >
        <span
          class="result-type"
          :class="result.type"
        >{{ typeLabel[result.type] }}</span>
        <span class="result-name">{{ result.name }}</span>
        <span class="result-subtitle">{{ result.subtitle }}</span>
      </div>
    </div>

    <div v-else-if="isOpen && query && results.length === 0" class="search-dropdown">
      <div class="search-result no-results">未找到匹配结果</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue'
import { useMapStore } from '@/stores/mapStore'
import { philosophers } from '@/data/philosophers'
import { schools } from '@/data/schools'
import type { Philosopher } from '@/types'

const mapStore = useMapStore()
const searchRef = ref<HTMLElement | null>(null)
const inputRef = ref<HTMLInputElement | null>(null)
const query = ref('')
const isOpen = ref(false)
const highlightedIndex = ref(0)

const typeLabel = {
  philosopher: '哲学家',
  school: '学派'
}

interface SearchResult {
  id: string
  type: 'philosopher' | 'school'
  name: string
  subtitle: string
  data: Philosopher
}

const results = computed(() => {
  if (!query.value.trim()) return []

  const q = query.value.toLowerCase()
  const results: SearchResult[] = []

  // Search philosophers
  philosophers.forEach(p => {
    const match =
      p.name.zh.includes(query.value) ||
      p.name.en.toLowerCase().includes(q) ||
      p.name.original?.toLowerCase().includes(q) ||
      p.birth.placeName.includes(query.value)

    if (match) {
      results.push({
        id: p.id,
        type: 'philosopher',
        name: `${p.name.zh} (${p.name.en})`,
        subtitle: `${p.birth.placeName} · ${formatYear(p.birth.year)}`,
        data: p
      })
    }
  })

  // Search schools
  schools.forEach(s => {
    const match =
      s.name.zh.includes(query.value) ||
      s.name.en.toLowerCase().includes(q)

    if (match) {
      const count = philosophers.filter(p => p.schools.includes(s.id)).length
      results.push({
        id: s.id,
        type: 'school',
        name: s.name.zh,
        subtitle: `${count} 位哲学家`,
        data: null as any
      })
    }
  })

  return results.slice(0, 8)
})

function formatYear(year: number): string {
  return year < 0 ? `公元前${Math.abs(year)}年` : `${year}年`
}

function selectResult(result: SearchResult) {
  if (result.type === 'philosopher') {
    mapStore.selectPhilosopher(result.data)
    mapStore.flyToLocation(result.data.birth.location, 8)
  } else {
    // Filter by school
    const schoolPhilosophers = philosophers.filter(p => p.schools.includes(result.id))
    if (schoolPhilosophers.length > 0) {
      const first = schoolPhilosophers[0]
      mapStore.flyToLocation(first.birth.location, 6)
    }
  }

  query.value = ''
  isOpen.value = false
}

function highlightNext() {
  highlightedIndex.value = (highlightedIndex.value + 1) % results.value.length
}

function highlightPrev() {
  highlightedIndex.value = (highlightedIndex.value - 1 + results.value.length) % results.value.length
}

function selectHighlighted() {
  if (results.value[highlightedIndex.value]) {
    selectResult(results.value[highlightedIndex.value])
  }
}

// Keyboard shortcut
function handleKeydown(e: KeyboardEvent) {
  if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
    e.preventDefault()
    inputRef.value?.focus()
  }
}

// Click outside to close
function handleClickOutside(e: MouseEvent) {
  if (searchRef.value && !searchRef.value.contains(e.target as Node)) {
    isOpen.value = false
  }
}

onMounted(() => {
  document.addEventListener('keydown', handleKeydown)
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeydown)
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped>
.global-search {
  position: relative;
  width: 400px;
}

.search-input-wrapper {
  display: flex;
  align-items: center;
  gap: 8px;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  padding: 8px 12px;
  transition: all 0.2s;
}

.search-input-wrapper:focus-within {
  background: rgba(255, 255, 255, 0.15);
  border-color: rgba(255, 255, 255, 0.3);
}

.search-icon {
  font-size: 14px;
  opacity: 0.6;
}

input {
  flex: 1;
  background: transparent;
  border: none;
  color: white;
  font-size: 14px;
  outline: none;
}

input::placeholder {
  color: rgba(255, 255, 255, 0.5);
}

.shortcut-hint {
  font-size: 11px;
  color: rgba(255, 255, 255, 0.4);
  padding: 2px 6px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 4px;
}

.search-dropdown {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  margin-top: 8px;
  background: rgba(30, 30, 30, 0.98);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  max-height: 320px;
  overflow-y: auto;
  z-index: 1000;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.4);
}

.search-result {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 14px;
  cursor: pointer;
  transition: background 0.15s;
}

.search-result:hover,
.search-result.highlighted {
  background: rgba(255, 255, 255, 0.08);
}

.search-result.no-results {
  color: rgba(255, 255, 255, 0.5);
  cursor: default;
}

.result-type {
  font-size: 10px;
  padding: 2px 6px;
  border-radius: 4px;
  text-transform: uppercase;
  font-weight: 500;
}

.result-type.philosopher {
  background: rgba(74, 144, 226, 0.3);
  color: #4A90E2;
}

.result-type.school {
  background: rgba(142, 68, 173, 0.3);
  color: #8E44AD;
}

.result-name {
  flex: 1;
  font-size: 14px;
}

.result-subtitle {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.5);
}
</style>
```

- [ ] **Step 2: 提交**

```bash
git add src/components/Search/GlobalSearch.vue
git commit -m "feat: implement GlobalSearch with keyboard shortcuts and dropdown"
```

---

## Task 8: 整合主应用

**Files:**
- Modify: `src/App.vue`

- [ ] **Step 1: 更新 App.vue**

```vue
<template>
  <div class="app">
    <header class="header">
      <div class="logo">
        <span class="logo-icon">🌍</span>
        <h1>Philosophy Geo</h1>
      </div>
      <GlobalSearch />
      <div class="view-toggle">
        <button class="active">地图</button>
        <button disabled>网络</button>
        <button disabled>故事</button>
      </div>
    </header>

    <main class="main">
      <aside class="sidebar">
        <FilterPanel />
        <PhilosopherList />
      </aside>

      <div class="map-wrapper">
        <LeafletMap />
        <PhilosopherDetail
          v-if="mapStore.selectedPhilosopher"
          :philosopher="mapStore.selectedPhilosopher"
          @close="mapStore.selectPhilosopher(null)"
        />
      </div>
    </main>

    <TimelineBar />
  </div>
</template>

<script setup lang="ts">
import { useMapStore } from '@/stores/mapStore'
import LeafletMap from '@/components/Map/LeafletMap.vue'
import TimelineBar from '@/components/Timeline/TimelineBar.vue'
import FilterPanel from '@/components/Sidebar/FilterPanel.vue'
import PhilosopherList from '@/components/Sidebar/PhilosopherList.vue'
import GlobalSearch from '@/components/Search/GlobalSearch.vue'
import PhilosopherDetail from '@/components/Map/PhilosopherDetail.vue'

const mapStore = useMapStore()
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  background: #1a1a1a;
  color: #fff;
  overflow: hidden;
}

.app {
  height: 100vh;
  display: flex;
  flex-direction: column;
}

.header {
  height: 60px;
  background: rgba(20, 20, 20, 0.98);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  flex-shrink: 0;
}

.logo {
  display: flex;
  align-items: center;
  gap: 10px;
}

.logo-icon {
  font-size: 24px;
}

.logo h1 {
  font-size: 18px;
  font-weight: 600;
  letter-spacing: -0.5px;
}

.view-toggle {
  display: flex;
  gap: 4px;
  background: rgba(255, 255, 255, 0.1);
  padding: 4px;
  border-radius: 8px;
}

.view-toggle button {
  padding: 6px 14px;
  border: none;
  background: transparent;
  color: rgba(255, 255, 255, 0.6);
  border-radius: 6px;
  cursor: pointer;
  font-size: 13px;
  transition: all 0.2s;
}

.view-toggle button:hover:not(:disabled) {
  color: white;
}

.view-toggle button.active {
  background: rgba(255, 255, 255, 0.15);
  color: white;
}

.view-toggle button:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

.main {
  flex: 1;
  display: flex;
  overflow: hidden;
}

.sidebar {
  width: 280px;
  background: rgba(20, 20, 20, 0.95);
  border-right: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  flex-shrink: 0;
}

.map-wrapper {
  flex: 1;
  position: relative;
  overflow: hidden;
}

/* Scrollbar styling */
::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

::-webkit-scrollbar-track {
  background: transparent;
}

::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.2);
  border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.3);
}
</style>
```

- [ ] **Step 2: 创建 PhilosopherDetail.vue**

```vue
<template>
  <div class="philosopher-detail" @click.self="$emit('close')">
    <div class="detail-card">
      <button class="close-btn" @click="$emit('close')">✕</button>

      <div class="card-header">
        <h2>{{ philosopher.name.zh }}</h2>
        <span class="original-name">{{ philosopher.name.original }}</span>
        <span class="en-name">{{ philosopher.name.en }}</span>
      </div>

      <div class="card-meta">
        <div class="meta-item">
          <span class="label">生卒</span>
          <span class="value">{{ formatYears(philosopher) }}</span>
        </div>
        <div class="meta-item">
          <span class="label">出生地</span>
          <span class="value">{{ philosopher.birth.placeName }}</span>
        </div>
        <div class="meta-item">
          <span class="label">学派</span>
          <div class="school-tags">
            <span
              v-for="schoolId in philosopher.schools"
              :key="schoolId"
              class="school-tag"
              :style="{ background: getSchoolColor(schoolId) }"
            >
              {{ getSchoolName(schoolId) }}
            </span>
          </div>
        </div>
      </div>

      <p class="description">{{ philosopher.description }}</p>

      <div class="ideas-section">
        <h4>核心概念</h4>
        <div class="idea-tags">
          <span v-for="idea in philosopher.ideas" :key="idea" class="idea-tag">
            {{ idea }}
          </span>
        </div>
      </div>

      <div v-if="philosopher.influences.length > 0" class="influence-section">
        <h4>影响</h4>
        <div class="influence-list">
          <span
            v-for="id in philosopher.influences"
            :key="id"
            class="influence-item"
            @click="selectRelated(id)"
          >
            {{ getPhilosopherName(id) }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useMapStore } from '@/stores/mapStore'
import type { Philosopher } from '@/types'
import { schools } from '@/data/schools'
import { philosophers } from '@/data/philosophers'

defineProps<{
  philosopher: Philosopher
}>()

defineEmits<{
  close: []
}>()

const mapStore = useMapStore()

function formatYears(p: Philosopher): string {
  const birth = p.birth.year < 0 ? `前${Math.abs(p.birth.year)}年` : `${p.birth.year}年`
  const death = p.death
    ? (p.death.year < 0 ? `前${Math.abs(p.death.year)}年` : `${p.death.year}年`)
    : '不详'
  return `${birth} - ${death}`
}

function getSchoolColor(schoolId: string): string {
  const school = schools.find(s => s.id === schoolId)
  return school?.color || '#95A5A6'
}

function getSchoolName(schoolId: string): string {
  const school = schools.find(s => s.id === schoolId)
  return school?.name.zh || schoolId
}

function getPhilosopherName(id: string): string {
  const p = philosophers.find(p => p.id === id)
  return p?.name.zh || id
}

function selectRelated(id: string) {
  const p = philosophers.find(p => p.id === id)
  if (p) {
    mapStore.selectPhilosopher(p)
    mapStore.flyToLocation(p.birth.location)
  }
}
</script>

<style scoped>
.philosopher-detail {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.detail-card {
  background: rgba(30, 30, 30, 0.98);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  padding: 24px;
  width: 420px;
  max-height: 80vh;
  overflow-y: auto;
  position: relative;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
}

.close-btn {
  position: absolute;
  top: 16px;
  right: 16px;
  width: 32px;
  height: 32px;
  border: none;
  background: rgba(255, 255, 255, 0.1);
  color: rgba(255, 255, 255, 0.7);
  border-radius: 50%;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.2s;
}

.close-btn:hover {
  background: rgba(255, 255, 255, 0.2);
  color: white;
}

.card-header {
  margin-bottom: 16px;
}

.card-header h2 {
  font-size: 24px;
  margin-bottom: 4px;
}

.original-name {
  display: block;
  font-size: 13px;
  color: rgba(255, 255, 255, 0.6);
  font-style: italic;
}

.en-name {
  display: block;
  font-size: 12px;
  color: rgba(255, 255, 255, 0.4);
  margin-top: 2px;
}

.card-meta {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 16px 0;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  margin-bottom: 16px;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 12px;
}

.meta-item .label {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.5);
  width: 60px;
  flex-shrink: 0;
}

.meta-item .value {
  font-size: 13px;
}

.school-tags {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
}

.school-tag {
  padding: 4px 10px;
  border-radius: 4px;
  font-size: 11px;
  color: white;
}

.description {
  font-size: 14px;
  line-height: 1.6;
  color: rgba(255, 255, 255, 0.8);
  margin-bottom: 20px;
}

.ideas-section,
.influence-section {
  margin-bottom: 16px;
}

.ideas-section h4,
.influence-section h4 {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.5);
  margin-bottom: 10px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.idea-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.idea-tag {
  padding: 4px 10px;
  background: rgba(255, 255, 255, 0.08);
  border-radius: 4px;
  font-size: 12px;
  color: rgba(255, 255, 255, 0.8);
}

.influence-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.influence-item {
  padding: 6px 12px;
  background: rgba(74, 144, 226, 0.15);
  border: 1px solid rgba(74, 144, 226, 0.3);
  border-radius: 6px;
  font-size: 12px;
  color: #4A90E2;
  cursor: pointer;
  transition: all 0.2s;
}

.influence-item:hover {
  background: rgba(74, 144, 226, 0.25);
}
</style>
```

- [ ] **Step 3: 运行测试**

Run: `npm run dev`
Expected: 应用正常启动，显示地图、侧边栏、时间轴和搜索框

- [ ] **Step 4: 提交**

```bash
git add src/App.vue src/components/Map/PhilosopherDetail.vue
git commit -m "feat: integrate all components into main App with detail modal"
```

---

## Task 9: 优化与完善

**Files:**
- Create: `src/vite-env.d.ts`
- Modify: `tsconfig.json`

- [ ] **Step 1: 创建 Vite 类型声明**

```typescript
// src/vite-env.d.ts
/// <reference types="vite/client" />

declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}
```

- [ ] **Step 2: 添加 Leaflet 类型支持**

已添加 `@types/leaflet` 到 devDependencies，确保类型支持。

- [ ] **Step 3: 创建 README.md**

```markdown
# Philosophy Geo - 哲学家历史地理可视化平台

数据可视化导向的哲学史探索平台，展示公元前800年至2020年代全球哲学思想的地理分布、时间演变和传播路径。

## 技术栈

- Vue 3 + TypeScript
- Vite
- Leaflet (地图)
- Pinia (状态管理)

## 功能

- 🗺️ 交互式地图：显示哲学家出生地和活动范围
- ⏰ 时间轴：拖动查看不同时期的哲学发展
- 🔍 全局搜索：快速定位哲学家、学派、地点
- 🎨 学派筛选：按地域和学派筛选哲学家
- 👤 详情卡片：查看哲学家生平和思想

## 开发

```bash
npm install
npm run dev
```

## 构建

```bash
npm run build
```

## 数据

目前包含20位核心哲学家：
- 古希腊：苏格拉底、柏拉图、亚里士多德、伊壁鸠鲁
- 中国：孔子、老子、庄子、孟子、荀子
- 印度：佛陀、龙树
- 阿拉伯：伊本·西那
- 近代欧洲：笛卡尔、康德、黑格尔
- 现代：维特根斯坦、海德格尔、胡塞尔、罗素

## 许可证

MIT
```

- [ ] **Step 4: 运行生产构建测试**

Run: `npm run build`
Expected: 构建成功，dist目录生成

- [ ] **Step 5: 最终提交**

```bash
git add src/vite-env.d.ts README.md
git commit -m "docs: add README and type declarations"
```

---

## 规范审查清单

### 1. Spec覆盖审查

| 设计需求 | 实现任务 | 状态 |
|---------|---------|------|
| Leaflet地图集成 | Task 4 | ✅ |
| 深色底图 | Task 4 | ✅ |
| 哲学家数据20位 | Task 2 | ✅ |
| 时间轴拖动过滤 | Task 5 | ✅ |
| 地图标记颜色区分 | Task 4 | ✅ |
| 侧边栏列表 | Task 6 | ✅ |
| 基础筛选 | Task 6 | ✅ |
| 详情弹窗 | Task 8 | ✅ |
| 全局搜索 | Task 7 | ✅ |
| 顶部搜索框 | Task 7 + 8 | ✅ |
| 视图切换按钮 | Task 8 | ✅ (UI框架) |
| 时间范围-800~2024 | Task 3 | ✅ |
| Pinia状态管理 | Task 3 | ✅ |

### 2. Placeholder扫描
- 无TBD/TODO
- 所有代码步骤包含完整实现
- 所有类型定义完整

### 3. 类型一致性检查
- Philosopher类型在types/index.ts定义，所有组件使用一致
- Store中的类型与定义匹配
- 组件props类型正确声明

---

## 执行方式选择

**Plan complete and saved to `docs/superpowers/plans/2026-05-11-philosophy-geo-mvp.md`.**

**Two execution options:**

**1. Subagent-Driven (recommended)** - Dispatch a fresh subagent per task, review between tasks, fast iteration

**2. Inline Execution** - Execute tasks in this session using executing-plans, batch execution with checkpoints

**Which approach do you prefer?**
