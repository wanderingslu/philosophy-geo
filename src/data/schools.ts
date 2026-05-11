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
