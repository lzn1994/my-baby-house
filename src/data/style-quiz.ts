import type { StyleQuizQuestion, StyleResult } from '../types'

export const styleQuizQuestions: StyleQuizQuestion[] = [
  {
    id: 1,
    title: '第一眼，哪张图最让你心动？',
    description: '凭直觉选择你最喜欢的空间氛围',
    type: 'image-choice',
    options: [
      {
        id: 'a',
        label: '留白胡桃木',
        imageUrl: '/images/style/modern-chinese.jpg',
        styleWeights: { '现代中式': 3, '日式': 2, '北欧': 1, '轻奢': 0, '工业风': 0 },
      },
      {
        id: 'b',
        label: '温暖原木',
        imageUrl: '/images/style/japanese.jpg',
        styleWeights: { '现代中式': 1, '日式': 3, '北欧': 2, '轻奢': 0, '工业风': 0 },
      },
      {
        id: 'c',
        label: '裸露管线',
        imageUrl: '/images/style/industrial.jpg',
        styleWeights: { '现代中式': 0, '日式': 0, '北欧': 1, '轻奢': 1, '工业风': 3 },
      },
      {
        id: 'd',
        label: '繁花壁纸',
        imageUrl: '/images/style/luxury.jpg',
        styleWeights: { '现代中式': 1, '日式': 0, '北欧': 0, '轻奢': 3, '工业风': 0 },
      },
    ],
  },
  {
    id: 2,
    title: '你更偏爱哪种色系？',
    description: '选择最让你感到舒适的色彩组合',
    type: 'text-choice',
    options: [
      {
        id: 'a',
        label: '大地暖棕 + 米白',
        styleWeights: { '现代中式': 3, '日式': 2, '北欧': 1, '轻奢': 1, '工业风': 0 },
      },
      {
        id: 'b',
        label: '清新浅绿 + 原木',
        styleWeights: { '现代中式': 1, '日式': 3, '北欧': 2, '轻奢': 0, '工业风': 0 },
      },
      {
        id: 'c',
        label: '高级灰 + 金属质感',
        styleWeights: { '现代中式': 1, '日式': 0, '北欧': 1, '轻奢': 3, '工业风': 2 },
      },
    ],
  },
  {
    id: 3,
    title: '你的理想生活状态是？',
    description: '想象一下你未来在这个家里的日常',
    type: 'text-choice',
    options: [
      {
        id: 'a',
        label: '品茶读书，宁静致远',
        styleWeights: { '现代中式': 3, '日式': 2, '北欧': 1, '轻奢': 0, '工业风': 0 },
      },
      {
        id: 'b',
        label: '朋友聚会，热闹温馨',
        styleWeights: { '现代中式': 0, '日式': 1, '北欧': 3, '轻奢': 2, '工业风': 1 },
      },
      {
        id: 'c',
        label: '极简克制，井井有条',
        styleWeights: { '现代中式': 2, '日式': 3, '北欧': 2, '轻奢': 0, '工业风': 1 },
      },
      {
        id: 'd',
        label: '精致讲究，品质至上',
        styleWeights: { '现代中式': 1, '日式': 0, '北欧': 0, '轻奢': 3, '工业风': 1 },
      },
    ],
  },
  {
    id: 4,
    title: '哪种材质组合最吸引你？',
    description: '触摸的质感也很重要哦',
    type: 'text-choice',
    options: [
      {
        id: 'a',
        label: '实木 + 棉麻 + 陶瓷',
        styleWeights: { '现代中式': 2, '日式': 3, '北欧': 2, '轻奢': 0, '工业风': 0 },
      },
      {
        id: 'b',
        label: '金属 + 玻璃 + 皮革',
        styleWeights: { '现代中式': 0, '日式': 0, '北欧': 1, '轻奢': 3, '工业风': 2 },
      },
      {
        id: 'c',
        label: '黑胡桃木 + 真丝 + 大理石',
        styleWeights: { '现代中式': 3, '日式': 0, '北欧': 0, '轻奢': 2, '工业风': 0 },
      },
      {
        id: 'd',
        label: '水泥 + 红砖 + 原钢',
        styleWeights: { '现代中式': 0, '日式': 0, '北欧': 0, '轻奢': 0, '工业风': 3 },
      },
    ],
  },
  {
    id: 5,
    title: '最终二选一，你的心之所属是？',
    description: '如果只能选一个，你更倾向于哪种感觉',
    type: 'binary',
    options: [
      {
        id: 'a',
        label: '现代中式 · 东方韵味',
        styleWeights: { '现代中式': 4, '日式': 1, '北欧': 0, '轻奢': 1, '工业风': 0 },
      },
      {
        id: 'b',
        label: '北欧简约 · 自然清新',
        styleWeights: { '现代中式': 0, '日式': 1, '北欧': 4, '轻奢': 0, '工业风': 0 },
      },
    ],
  },
]

export const styleResults: Record<string, StyleResult> = {
  '现代中式': {
    styleName: '现代中式',
    matchScore: 87,
    tagline: '东方意境，当代演绎',
    tags: ['禅意', '雅致', '传承', '品质'],
    description:
      '你骨子里有着东方情怀，欣赏传统文化的深厚底蕴，同时追求现代生活的舒适便捷。现代中式风格将传统元素以现代手法重新演绎，胡桃木的温润、留白的意境、对称的美学，让家既有文化底蕴又不失时尚感。',
  },
  '北欧': {
    styleName: '北欧简约',
    matchScore: 82,
    tagline: '自然清新，温暖治愈',
    tags: ['自然', '简约', '温馨', '生活'],
    description:
      '你热爱自然，追求简单纯粹的生活方式。北欧风格以白色为基调，大量使用原木材质，搭配绿植和温暖的灯光，营造出清新自然、温馨舒适的居家氛围。功能性与美观性完美结合，是热爱生活的你的理想选择。',
  },
  '日式': {
    styleName: '日式原木',
    matchScore: 79,
    tagline: '禅意极简，万物归一',
    tags: ['禅意', '极简', '自然', '收纳'],
    description:
      '你追求内心的平静，欣赏侘寂之美。日式风格强调整齐划一的收纳、原木的自然质感、推拉门的灵活空间，让家成为一个可以让人完全放松的禅意空间。少即是多，是你信奉的生活哲学。',
  },
  '轻奢': {
    styleName: '轻奢都市',
    matchScore: 75,
    tagline: '精致生活，品质为王',
    tags: ['精致', '品质', '优雅', '现代'],
    description:
      '你注重生活品质，追求精致优雅的生活态度。轻奢风格在现代简约的基础上，加入金属、大理石、丝绒等高端材质，用恰到好处的华丽感彰显品味。不浮夸、不张扬，却处处透露着对生活品质的坚持。',
  },
  '工业风': {
    styleName: '工业复古',
    matchScore: 70,
    tagline: '个性张扬，自由不羁',
    tags: ['个性', '复古', '自由', '艺术'],
    description:
      '你是一个特立独行的人，不喜欢循规蹈矩。工业风以裸露的管线、原始的水泥墙面、金属与木质的碰撞为特点，充满了自由不羁的艺术气息。在这里，每一件物品都可以成为独特的装饰。',
  },
}

export const defaultStyleResult: StyleResult = styleResults['现代中式']
