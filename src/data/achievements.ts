export type AchievementConditionType = 'steps_completed' | 'style_quiz' | 'budget_health' | 'quality_score' | 'all_steps'

export interface AchievementCondition {
  type: AchievementConditionType
  value: number | boolean
}

export interface Achievement {
  id: string
  name: string
  description: string
  icon: string
  condition: AchievementCondition
  reward: {
    spiritPoints?: number
    jadeStones?: number
    title?: string
  }
}

export const achievements: Achievement[] = [
  {
    id: 'first-step',
    name: '第一步',
    description: '完成首个装修步骤，开启你的装修之旅',
    icon: '🎯',
    condition: { type: 'steps_completed', value: 1 },
    reward: { spiritPoints: 20, jadeStones: 10 },
  },
  {
    id: 'style-master',
    name: '风格达人',
    description: '完成风格测试，找到最适合你的家装风格',
    icon: '🎨',
    condition: { type: 'style_quiz', value: true },
    reward: { spiritPoints: 30, jadeStones: 20 },
  },
  {
    id: 'budget-master',
    name: '预算大师',
    description: '预算健康度达到100%，精打细算好管家',
    icon: '💰',
    condition: { type: 'budget_health', value: 100 },
    reward: { spiritPoints: 50, jadeStones: 30 },
  },
  {
    id: 'perfect-inspection',
    name: '完美验收',
    description: '质检评分达到90分以上，品质有保障',
    icon: '✅',
    condition: { type: 'quality_score', value: 90 },
    reward: { spiritPoints: 40, jadeStones: 25 },
  },
  {
    id: 'renovation-expert',
    name: '装修达人',
    description: '完成10个装修步骤，半程已过胜利在望',
    icon: '🏆',
    condition: { type: 'steps_completed', value: 10 },
    reward: { spiritPoints: 80, jadeStones: 50 },
  },
  {
    id: 'happy-move-in',
    name: '圆满入住',
    description: '完成全部20个步骤，恭喜乔迁之喜',
    icon: '🎉',
    condition: { type: 'all_steps', value: true },
    reward: { spiritPoints: 200, jadeStones: 100, title: '圆满入住' },
  },
]

export function isAchievementUnlocked(
  achievement: Achievement,
  context: {
    completedSteps: number
    styleQuizDone: boolean
    budgetHealth: number
    qualityScore: number
  }
): boolean {
  switch (achievement.condition.type) {
    case 'steps_completed':
      return context.completedSteps >= (achievement.condition.value as number)
    case 'style_quiz':
      return context.styleQuizDone
    case 'budget_health':
      return context.budgetHealth >= (achievement.condition.value as number)
    case 'quality_score':
      return context.qualityScore >= (achievement.condition.value as number)
    case 'all_steps':
      return context.completedSteps >= 20
    default:
      return false
  }
}
