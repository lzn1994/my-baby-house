import type { AppView } from '../types'

export type DemoAction =
  | { type: 'navigate'; delay?: number; payload: AppView }
  | { type: 'speak'; delay?: number; payload: string }
  | { type: 'highlight'; delay?: number; payload: { selector?: string; position?: 'top' | 'bottom' | 'left' | 'right' | 'center'; message?: string } }
  | { type: 'click'; delay?: number; payload?: Record<string, unknown> }
  | { type: 'type'; delay?: number; payload?: Record<string, unknown> }
  | { type: 'custom'; delay?: number; payload?: Record<string, unknown> }
  | { type: 'wait'; delay?: number; payload?: number }

export interface DemoChapter {
  id: number
  title: string
  duration: number
  targetView: AppView
  description: string
  actions: DemoAction[]
}

export const demoChapters: DemoChapter[] = [
  {
    id: 1,
    title: '风格测试',
    duration: 8,
    targetView: 'onboarding',
    description: 'AI风格探测，找到最适合你的装修风格',
    actions: [
      { type: 'navigate', payload: 'onboarding', delay: 0 },
      { type: 'speak', payload: '欢迎！我是年兽，帮你找到最适合的装修风格~', delay: 500 },
      { type: 'click', payload: { phase: 'welcome', action: 'start' }, delay: 1500 },
      { type: 'speak', payload: '选择你喜欢的空间感觉...', delay: 1000 },
      { type: 'click', payload: { phase: 'quiz', question: 1, answer: 'a' }, delay: 1500 },
      { type: 'click', payload: { phase: 'quiz', question: 2, answer: 'b' }, delay: 1000 },
      { type: 'speak', payload: '匹配成功！现代中式，87%契合度！', delay: 2000 },
    ],
  },
  {
    id: 2,
    title: 'SOP流程',
    duration: 10,
    targetView: 'sop',
    description: '20步标准流程，小白变专家',
    actions: [
      { type: 'navigate', payload: 'sop', delay: 0 },
      { type: 'speak', payload: '20步标准化流程，跟着年兽轻松装修~', delay: 500 },
      { type: 'click', payload: { step: 3 }, delay: 1500 },
      { type: 'speak', payload: '第3步签订合同，AI自动鉴别风险~', delay: 1500 },
      { type: 'click', payload: { action: 'gotIt' }, delay: 2000 },
      { type: 'speak', payload: '发现3个风险点，完成+10灵气值！', delay: 2000 },
      { type: 'click', payload: { action: 'complete' }, delay: 1500 },
    ],
  },
  {
    id: 3,
    title: 'AI合同',
    duration: 8,
    targetView: 'sop',
    description: '智能审核合同，避坑防骗',
    actions: [
      { type: 'navigate', payload: 'sop', delay: 0 },
      { type: 'click', payload: { step: 3 }, delay: 500 },
      { type: 'click', payload: { action: 'gotIt' }, delay: 1000 },
      { type: 'speak', payload: 'AI正在分析合同条款...', delay: 1500 },
      { type: 'speak', payload: '发现高风险：模糊报价条款！', delay: 2000 },
      { type: 'speak', payload: '中风险：工期约定不明确~', delay: 1500 },
      { type: 'click', payload: { action: 'contractConfirm' }, delay: 1500 },
    ],
  },
  {
    id: 4,
    title: '预算管理',
    duration: 10,
    targetView: 'budget',
    description: '532智能拆解，预算清晰不超支',
    actions: [
      { type: 'navigate', payload: 'budget', delay: 0 },
      { type: 'speak', payload: '智能532拆解：硬装50%、主材30%、软装20%', delay: 500 },
      { type: 'highlight', payload: { selector: 'aside:first-child', position: 'left' }, delay: 2000 },
      { type: 'speak', payload: '预算概览：健康度、总预算、已花费一目了然~', delay: 2000 },
      { type: 'click', payload: { action: 'toggleCategory', value: 'basic' }, delay: 1500 },
      { type: 'speak', payload: '展开明细项目，每笔支出都清晰~', delay: 1500 },
      { type: 'highlight', payload: { selector: '.bg-zhuSha\\/10', position: 'top' }, delay: 1000 },
      { type: 'speak', payload: '超支预警！智能提醒并给出优化建议~', delay: 1500 },
    ],
  },
  {
    id: 5,
    title: 'AI质检',
    duration: 8,
    targetView: 'sop',
    description: 'AI验收水电，隐蔽工程更安心',
    actions: [
      { type: 'navigate', payload: 'sop', delay: 0 },
      { type: 'click', payload: { step: 10 }, delay: 500 },
      { type: 'click', payload: { action: 'gotIt' }, delay: 1000 },
      { type: 'speak', payload: 'AI正在分析水电施工...', delay: 1500 },
      { type: 'speak', payload: '质检92分！电路横平竖直、防水达标~', delay: 2000 },
      { type: 'speak', payload: '注意：2个插座位置需微调~', delay: 1500 },
      { type: 'click', payload: { action: 'qualityConfirm' }, delay: 1000 },
    ],
  },
  {
    id: 6,
    title: '年兽养成',
    duration: 8,
    targetView: 'nian',
    description: '陪伴式精灵，装修像游戏一样有趣',
    actions: [
      { type: 'navigate', payload: 'nian', delay: 0 },
      { type: 'speak', payload: '我是年兽，你的装修小伙伴~', delay: 500 },
      { type: 'click', payload: { action: 'clickNian' }, delay: 1500 },
      { type: 'speak', payload: '完成任务获得灵气值，等级提升！', delay: 1500 },
      { type: 'highlight', payload: { selector: '.bg-tongQianJin\\/10', position: 'left' }, delay: 1000 },
      { type: 'speak', payload: '现在6级「监工小童」，快来开始吧~', delay: 2000 },
    ],
  },
]

export const totalDemoDuration = demoChapters.reduce((sum, ch) => sum + ch.duration, 0)
