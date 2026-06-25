import type { StyleResult, BudgetBreakdown, NianProgress, DemoChapter, AppState, SOPProgress } from '../types'

export const demoStyleResult: StyleResult = {
  styleName: '现代中式',
  matchScore: 87,
  tagline: '东方意境，当代演绎',
  tags: ['禅意', '雅致', '传承', '品质'],
  description:
    '你骨子里有着东方情怀，欣赏传统文化的深厚底蕴，同时追求现代生活的舒适便捷。现代中式风格将传统元素以现代手法重新演绎，胡桃木的温润、留白的意境、对称的美学，让家既有文化底蕴又不失时尚感。',
}

export const demoBudgetBreakdown: BudgetBreakdown = {
  total: 200000,
  cityMultiplier: 1.0,
  categories: {
    '基础施工': { amount: 70000, ratio: 0.35 },
    '主材费用': { amount: 80000, ratio: 0.40 },
    '家具软装': { amount: 30000, ratio: 0.15 },
    '电器设备': { amount: 20000, ratio: 0.10 },
  },
  stageRelease: [
    { stage: '前期准备', releaseRatio: 0.05, amount: 10000, purpose: '设计费、定金', status: 'completed' },
    { stage: '主体拆改', releaseRatio: 0.10, amount: 20000, purpose: '拆改、材料定金', status: 'completed' },
    { stage: '水电改造', releaseRatio: 0.25, amount: 50000, purpose: '水电材料、人工', status: 'released' },
    { stage: '泥木工程', releaseRatio: 0.25, amount: 50000, purpose: '瓷砖、吊顶、人工', status: 'pending' },
    { stage: '油工安装', releaseRatio: 0.20, amount: 40000, purpose: '油漆、定制安装', status: 'pending' },
    { stage: '收尾入住', releaseRatio: 0.15, amount: 30000, purpose: '软装、尾款', status: 'pending' },
  ],
}

export const demoSOPProgress: SOPProgress = {
  currentStep: 3,
  completedSteps: [1, 2],
  stageUnlockStatus: { 1: true, 2: true, 3: false, 4: false, 5: false, 6: false },
}

export const demoNianProgress: NianProgress = {
  level: 6,
  spiritPoints: 280,
  jadeStones: 350,
  houseScore: 140,
  streakDays: 12,
  emotion: 'happy',
  equipment: [
    { id: 'brush', name: '神笔马良', description: '设计灵感 +10%', icon: '🖌️' },
    { id: 'compass', name: '风水罗盘', description: '户型分析更精准', icon: '🧭' },
    { id: 'hammer', name: '开山神锤', description: '拆改效率 +15%', icon: '🔨' },
  ],
}

export const demoChapters: DemoChapter[] = [
  {
    id: 1,
    title: '风格探索',
    duration: '60秒',
    description: '体验AI风格探测，找到最适合你的装修风格',
    targetView: 'onboarding',
  },
  {
    id: 2,
    title: '预算规划',
    duration: '45秒',
    description: '智能预算拆解，每一分钱都花在刀刃上',
    targetView: 'budget',
  },
  {
    id: 3,
    title: 'SOP流程',
    duration: '90秒',
    description: '20步标准装修流程，小白也能变专家',
    targetView: 'sop',
  },
  {
    id: 4,
    title: '年兽养成',
    duration: '40秒',
    description: '陪伴式年兽精灵，让装修像游戏一样有趣',
    targetView: 'nian',
  },
  {
    id: 5,
    title: 'AI助手',
    duration: '50秒',
    description: '全程AI陪伴，有问题随时问',
    targetView: 'sop',
  },
  {
    id: 6,
    title: '全景演示',
    duration: '30秒',
    description: '全部功能一览，开启你的装修之旅',
    targetView: 'demo',
  },
]

export const demoCity = '杭州'
export const demoArea = 100

export function getDemoAppState(): AppState {
  return {
    currentView: 'demo',
    userSession: {
      styleResult: demoStyleResult,
      budgetTotal: 200000,
      budgetBreakdown: demoBudgetBreakdown,
      city: demoCity,
      area: demoArea,
      specialNeeds: ['老人房', '儿童房', '衣帽间'],
      floorPlan: { rooms: 3, area: 100 },
    },
    sopProgress: demoSOPProgress,
    nianProgress: demoNianProgress,
    demoMode: {
      isActive: true,
      currentChapter: 1,
      progress: 0,
    },
  }
}
