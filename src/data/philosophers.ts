import { Philosopher } from '@/types'

export const philosophers: Philosopher[] = [
  // 古希腊
  {
    id: 'socrates',
    name: { zh: '苏格拉底', en: 'Socrates', original: 'Σωκράτης' },
    birth: { year: -470, location: { lat: 37.9715, lng: 23.7267 }, placeName: '雅典' },
    death: { year: -399, location: { lat: 37.9715, lng: 23.7267 }, placeName: '雅典' },
    schools: ['platonism'],
    influences: [],
    influencedBy: [],
    ideas: ['苏格拉底方法', '认识你自己', '德性即知识'],
    importance: 10,
    description: '古希腊哲学的奠基人，西方哲学之父，柏拉图的老师'
  },
  {
    id: 'plato',
    name: { zh: '柏拉图', en: 'Plato', original: 'Πλάτων' },
    birth: { year: -428, location: { lat: 37.9715, lng: 23.7267 }, placeName: '雅典' },
    death: { year: -348, location: { lat: 37.9715, lng: 23.7267 }, placeName: '雅典' },
    schools: ['platonism'],
    influences: ['socrates'],
    influencedBy: [],
    ideas: ['理念论', '洞穴寓言', '理想国'],
    importance: 10,
    description: '西方哲学史上最具影响力的哲学家之一，创立了柏拉图学院'
  },
  {
    id: 'aristotle',
    name: { zh: '亚里士多德', en: 'Aristotle', original: 'Ἀριστοτέλης' },
    birth: { year: -384, location: { lat: 40.7833, lng: 22.4 }, placeName: '斯塔基拉' },
    death: { year: -322, location: { lat: 38.3879, lng: 23.7267 }, placeName: '卡尔基斯' },
    schools: ['aristotelianism'],
    influences: ['plato'],
    influencedBy: [],
    ideas: ['形而上学', '逻辑学', '伦理学', '政治学'],
    importance: 10,
    description: '百科全书式的哲学家，形式逻辑的奠基人，柏拉图的学生'
  },
  {
    id: 'epicurus',
    name: { zh: '伊壁鸠鲁', en: 'Epicurus', original: 'Ἐπίκουρος' },
    birth: { year: -341, location: { lat: 37.95, lng: 26.9833 }, placeName: '萨摩斯岛' },
    death: { year: -270, location: { lat: 37.9715, lng: 23.7267 }, placeName: '雅典' },
    schools: ['epicureanism'],
    influences: [],
    influencedBy: [],
    ideas: ['快乐主义', '原子论', '无神论'],
    importance: 7,
    description: '古希腊快乐主义哲学家，伊壁鸠鲁学派创始人'
  },
  {
    id: 'seneca',
    name: { zh: '塞内卡', en: 'Seneca', original: 'Lucius Annaeus Seneca' },
    birth: { year: -4, location: { lat: 37.0833, lng: -4.3667 }, placeName: '科尔多瓦' },
    death: { year: 65, location: { lat: 41.9028, lng: 12.4964 }, placeName: '罗马' },
    schools: ['stoicism'],
    influences: [],
    influencedBy: [],
    ideas: ['斯多葛主义', '自然法', '命运'],
    importance: 7,
    description: '罗马斯多葛派哲学家，政治家，尼禄的老师'
  },

  // 中国
  {
    id: 'confucius',
    name: { zh: '孔子', en: 'Confucius', original: '孔丘' },
    birth: { year: -551, location: { lat: 35.6, lng: 117.0 }, placeName: '曲阜' },
    death: { year: -479, location: { lat: 35.6, lng: 117.0 }, placeName: '曲阜' },
    schools: ['confucianism'],
    influences: [],
    influencedBy: [],
    ideas: ['仁', '礼', '中庸', '君子'],
    importance: 10,
    description: '儒家学派创始人，中国古代最伟大的思想家、教育家'
  },
  {
    id: 'laozi',
    name: { zh: '老子', en: 'Laozi', original: '李耳' },
    birth: { year: -571, location: { lat: 34.68, lng: 112.45 }, placeName: '苦县' },
    death: { year: -471, location: { lat: 34.68, lng: 112.45 }, placeName: '不详' },
    schools: ['taoism'],
    influences: [],
    influencedBy: [],
    ideas: ['道', '无为', '自然', '柔弱胜刚强'],
    importance: 10,
    description: '道家学派创始人，《道德经》作者，中国古代思想家'
  },
  {
    id: 'zhuangzi',
    name: { zh: '庄子', en: 'Zhuangzi', original: '庄周' },
    birth: { year: -369, location: { lat: 34.8, lng: 116.9 }, placeName: '宋国蒙邑' },
    death: { year: -286, location: { lat: 34.8, lng: 116.9 }, placeName: '不详' },
    schools: ['taoism'],
    influences: ['laozi'],
    influencedBy: [],
    ideas: ['逍遥游', '齐物论', '庄周梦蝶'],
    importance: 9,
    description: '战国时期道家代表人物，与老子并称老庄'
  },
  {
    id: 'mencius',
    name: { zh: '孟子', en: 'Mencius', original: '孟轲' },
    birth: { year: -372, location: { lat: 35.0, lng: 116.3 }, placeName: '邹国' },
    death: { year: -289, location: { lat: 35.0, lng: 116.3 }, placeName: '不详' },
    schools: ['confucianism'],
    influences: ['confucius'],
    influencedBy: [],
    ideas: ['性善论', '仁政', '民贵君轻'],
    importance: 9,
    description: '战国时期儒家代表人物，被尊为亚圣'
  },
  {
    id: 'xunzi',
    name: { zh: '荀子', en: 'Xunzi', original: '荀况' },
    birth: { year: -313, location: { lat: 36.6, lng: 114.5 }, placeName: '赵国' },
    death: { year: -238, location: { lat: 36.6, lng: 114.5 }, placeName: '兰陵' },
    schools: ['confucianism'],
    influences: ['confucius'],
    influencedBy: [],
    ideas: ['性恶论', '礼法并重', '制天命而用之'],
    importance: 8,
    description: '战国末期儒家思想家，主张性恶论'
  },

  // 印度
  {
    id: 'buddha',
    name: { zh: '佛陀', en: 'Buddha', original: 'Siddhartha Gautama' },
    birth: { year: -563, location: { lat: 27.5, lng: 83.0 }, placeName: '蓝毗尼' },
    death: { year: -483, location: { lat: 26.7333, lng: 85.9167 }, placeName: '拘尸那揭罗' },
    schools: ['buddhism'],
    influences: [],
    influencedBy: [],
    ideas: ['四圣谛', '八正道', '缘起', '涅槃'],
    importance: 10,
    description: '佛教创始人，古印度思想家，被尊为释迦牟尼'
  },
  {
    id: 'nagarjuna',
    name: { zh: '龙树', en: 'Nagarjuna', original: 'नागार्जुन' },
    birth: { year: 150, location: { lat: 16.5, lng: 80.6 }, placeName: '南印度' },
    death: { year: 250, location: { lat: 16.5, lng: 80.6 }, placeName: '南印度' },
    schools: ['buddhism'],
    influences: ['buddha'],
    influencedBy: [],
    ideas: ['中观', '空性', '八不中道'],
    importance: 8,
    description: '印度大乘佛教中观学派创始人，佛教哲学家'
  },

  // 阿拉伯
  {
    id: 'avicenna',
    name: { zh: '伊本·西那', en: 'Avicenna', original: 'Ibn Sina' },
    birth: { year: 980, location: { lat: 37.9, lng: 65.2 }, placeName: '布哈拉' },
    death: { year: 1037, location: { lat: 34.8, lng: 48.5 }, placeName: '哈马丹' },
    schools: ['islamic_philosophy'],
    influences: ['aristotle'],
    influencedBy: [],
    ideas: ['存在与本质', '灵魂不朽', '医学'],
    importance: 8,
    description: '伊斯兰黄金时代最伟大的哲学家、医学家、科学家'
  },

  // 近代欧洲
  {
    id: 'descartes',
    name: { zh: '笛卡尔', en: 'Descartes', original: 'René Descartes' },
    birth: { year: 1596, location: { lat: 47.1667, lng: 1.55 }, placeName: '拉海耶' },
    death: { year: 1650, location: { lat: 54.3333, lng: 18.6333 }, placeName: '斯德哥尔摩' },
    schools: ['rationalism'],
    influences: [],
    influencedBy: [],
    ideas: ['我思故我在', '心物二元论', '理性主义'],
    importance: 9,
    description: '近代哲学之父，理性主义创始人，解析几何创始人'
  },
  {
    id: 'kant',
    name: { zh: '康德', en: 'Kant', original: 'Immanuel Kant' },
    birth: { year: 1724, location: { lat: 54.7167, lng: 20.5167 }, placeName: '柯尼斯堡' },
    death: { year: 1804, location: { lat: 54.7167, lng: 20.5167 }, placeName: '柯尼斯堡' },
    schools: ['german_idealism'],
    influences: ['descartes', 'hume'],
    influencedBy: [],
    ideas: ['批判哲学', '先验唯心论', '绝对命令', '哥白尼革命'],
    importance: 10,
    description: '德国古典哲学创始人，西方哲学史上最重要的哲学家之一'
  },
  {
    id: 'hegel',
    name: { zh: '黑格尔', en: 'Hegel', original: 'Georg Wilhelm Friedrich Hegel' },
    birth: { year: 1770, location: { lat: 48.7667, lng: 9.1833 }, placeName: '斯图加特' },
    death: { year: 1831, location: { lat: 52.5167, lng: 13.3833 }, placeName: '柏林' },
    schools: ['german_idealism'],
    influences: ['kant', 'fichte', 'schelling'],
    influencedBy: [],
    ideas: ['辩证法', '绝对精神', '主奴辩证法', '历史哲学'],
    importance: 10,
    description: '德国观念论集大成者，辩证法大师，对后世影响深远'
  },

  // 现代
  {
    id: 'wittgenstein',
    name: { zh: '维特根斯坦', en: 'Wittgenstein', original: 'Ludwig Wittgenstein' },
    birth: { year: 1889, location: { lat: 48.2, lng: 16.3667 }, placeName: '维也纳' },
    death: { year: 1951, location: { lat: 51.75, lng: -1.25 }, placeName: '剑桥' },
    schools: ['analytic_philosophy'],
    influences: ['frege', 'russell'],
    influencedBy: [],
    ideas: ['语言游戏', '家族相似', '不可说', '逻辑哲学论'],
    importance: 10,
    description: '20世纪最重要的哲学家之一，分析哲学代表人物'
  },
  {
    id: 'heidegger',
    name: { zh: '海德格尔', en: 'Heidegger', original: 'Martin Heidegger' },
    birth: { year: 1889, location: { lat: 47.9833, lng: 7.85 }, placeName: '梅斯基尔希' },
    death: { year: 1976, location: { lat: 47.9833, lng: 7.85 }, placeName: '弗莱堡' },
    schools: ['phenomenology'],
    influences: ['husserl', 'kierkegaard'],
    influencedBy: [],
    ideas: ['存在与时间', '此在', '向死而生', '技术追问'],
    importance: 10,
    description: '20世纪最具影响力的哲学家之一，存在主义代表人物'
  },
  {
    id: 'husserl',
    name: { zh: '胡塞尔', en: 'Husserl', original: 'Edmund Husserl' },
    birth: { year: 1859, location: { lat: 49.6, lng: 17.25 }, placeName: '普罗斯捷约夫' },
    death: { year: 1938, location: { lat: 48.0, lng: 7.85 }, placeName: '弗莱堡' },
    schools: ['phenomenology'],
    influences: ['brentano'],
    influencedBy: [],
    ideas: ['现象学', '悬搁', '本质直观', '先验自我'],
    importance: 9,
    description: '现象学创始人，20世纪最重要的哲学家之一'
  },
  {
    id: 'russell',
    name: { zh: '罗素', en: 'Russell', original: 'Bertrand Russell' },
    birth: { year: 1872, location: { lat: 52.6333, lng: -4.05 }, placeName: '特雷莱克' },
    death: { year: 1970, location: { lat: 51.5, lng: -0.1 }, placeName: '彭林代德赖斯' },
    schools: ['analytic_philosophy'],
    influences: ['frege', 'whitehead'],
    influencedBy: [],
    ideas: ['逻辑原子主义', '罗素悖论', '摹状词理论', '和平主义'],
    importance: 9,
    description: '英国哲学家、逻辑学家、数学家，分析哲学创始人之一'
  }
]

export const getPhilosopherById = (id: string): Philosopher | undefined =>
  philosophers.find(p => p.id === id)

export const getPhilosophersBySchool = (schoolId: string): Philosopher[] =>
  philosophers.filter(p => p.schools.includes(schoolId))

export const getPhilosophersByRegion = (region: string): Philosopher[] =>
  philosophers.filter(p => {
    // 根据出生地或学派推断地区
    const birthPlace = p.birth.placeName
    const regionMap: Record<string, string[]> = {
      '古希腊': ['雅典', '斯塔基拉', '萨摩斯岛'],
      '中国': ['曲阜', '苦县', '宋国蒙邑', '邹国', '赵国', '兰陵'],
      '印度': ['蓝毗尼', '拘尸那揭罗', '南印度'],
      '阿拉伯世界': ['布哈拉', '哈马丹'],
      '西欧': ['拉海耶', '斯德哥尔摩', '剑桥', '特雷莱克', '彭林代德赖斯'],
      '中欧': ['柯尼斯堡', '斯图加特', '柏林', '维也纳', '梅斯基尔希', '弗莱堡', '普罗斯捷约夫'],
      '古罗马': ['罗马'],
      '西班牙': ['科尔多瓦']
    }
    return Object.entries(regionMap).some(([r, places]) =>
      places.some(place => birthPlace.includes(place))
    )
  })
