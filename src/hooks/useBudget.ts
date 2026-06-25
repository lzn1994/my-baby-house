import { useMemo } from 'react'
import type {
  BudgetBreakdown,
  BudgetCategory,
  StageBudget,
  BudgetHealthStatus,
  Budget532Breakdown,
  BudgetMajorCategory,
  BudgetSubItem,
  StyleBudgetItem,
  StageRelease,
  BudgetWarning,
  StageStatus,
} from '../types'

const CITY_MULTIPLIERS: Record<string, number> = {
  '北京': 1.2,
  '上海': 1.2,
  '深圳': 1.15,
  '广州': 1.1,
  '杭州': 1.08,
  '南京': 0.95,
  '成都': 0.9,
  '武汉': 0.85,
  '西安': 0.8,
  '重庆': 0.8,
  '其他': 0.85,
}

const DEFAULT_CATEGORIES = [
  { key: '基础施工', ratio: 0.35 },
  { key: '主材费用', ratio: 0.40 },
  { key: '家具软装', ratio: 0.15 },
  { key: '电器设备', ratio: 0.10 },
]

const DEFAULT_STAGES = [
  { stage: '前期准备', releaseRatio: 0.05, purpose: '设计费、定金' },
  { stage: '主体拆改', releaseRatio: 0.10, purpose: '拆改、材料定金' },
  { stage: '水电改造', releaseRatio: 0.25, purpose: '水电材料、人工' },
  { stage: '泥木工程', releaseRatio: 0.25, purpose: '瓷砖、吊顶、人工' },
  { stage: '油工安装', releaseRatio: 0.20, purpose: '油漆、定制安装' },
  { stage: '收尾入住', releaseRatio: 0.15, purpose: '软装、尾款' },
]

const FIVE_THREE_TWO_CATEGORIES: Array<{
  name: string
  key: string
  ratio: number
  color: string
  items: Array<{ name: string; ratio: number }>
}> = [
  {
    name: '基础硬装',
    key: 'basic',
    ratio: 0.5,
    color: '#4A6FA5',
    items: [
      { name: '拆改工程', ratio: 0.1 },
      { name: '水电改造', ratio: 0.15 },
      { name: '泥木工程', ratio: 0.25 },
      { name: '油漆工程', ratio: 0.15 },
      { name: '人工费用', ratio: 0.35 },
    ],
  },
  {
    name: '主材设备',
    key: 'materials',
    ratio: 0.3,
    color: '#5B8C5A',
    items: [
      { name: '瓷砖石材', ratio: 0.2 },
      { name: '地板地面', ratio: 0.133 },
      { name: '橱柜厨房', ratio: 0.25 },
      { name: '木门门窗', ratio: 0.167 },
      { name: '卫浴洁具', ratio: 0.25 },
    ],
  },
  {
    name: '软装家电',
    key: 'soft',
    ratio: 0.2,
    color: '#8B6F47',
    items: [
      { name: '家具定制', ratio: 0.5 },
      { name: '家电设备', ratio: 0.375 },
      { name: '窗帘灯具', ratio: 0.125 },
    ],
  },
]

const STYLE_ADDONS: StyleBudgetItem[] = [
  { name: '微水泥工艺', amount: 8000, description: '墙面+地面，高级质感' },
  { name: '木格栅装饰', amount: 5000, description: '背景墙+吊顶，中式韵味' },
  { name: '胡桃木材质', amount: 10000, description: '地板+木门+柜体，温润自然' },
  { name: '新中式灯具', amount: 3000, description: '客厅+卧室，营造氛围' },
]

const STAGE_SOP_STEPS: Record<number, string[]> = {
  1: ['收房验房', '设计沟通', '预算规划'],
  2: ['主体拆改', '门窗更换', '水电交底'],
  3: ['水电改造', '防水工程', '水电验收'],
  4: ['泥瓦工程', '木工吊顶', '泥木验收'],
  5: ['油漆工程', '墙纸铺贴', '油工验收'],
  6: ['定制安装', '家具进场', '软装布置'],
}

const MOCK_WARNINGS: BudgetWarning[] = [
  {
    id: '1',
    level: 'medium',
    title: '瓷砖采购超支预警',
    category: '主材设备',
    plannedAmount: 12000,
    actualAmount: 14000,
    overrunAmount: 2000,
    suggestion: '建议从软装家具预算中调剂，或考虑降低瓷砖规格选用国产替代品牌',
  },
]

export function useBudget(totalBudget: number, city: string, area: number, currentStage: number = 3) {
  const cityMultiplier = useMemo(() => {
    return CITY_MULTIPLIERS[city] || CITY_MULTIPLIERS['其他']
  }, [city])

  const adjustedBudget = useMemo(() => {
    return Math.round(totalBudget * cityMultiplier)
  }, [totalBudget, cityMultiplier])

  const categories = useMemo<Record<string, BudgetCategory>>(() => {
    const result: Record<string, BudgetCategory> = {}
    DEFAULT_CATEGORIES.forEach((cat) => {
      result[cat.key] = {
        amount: Math.round(adjustedBudget * cat.ratio),
        ratio: cat.ratio,
      }
    })
    return result
  }, [adjustedBudget])

  const stageRelease = useMemo<StageBudget[]>(() => {
    return DEFAULT_STAGES.map((stage, index) => ({
      stage: stage.stage,
      releaseRatio: stage.releaseRatio,
      amount: Math.round(adjustedBudget * stage.releaseRatio),
      purpose: stage.purpose,
      status: index < currentStage ? 'completed' : index === currentStage ? 'released' : 'pending',
    }))
  }, [adjustedBudget, currentStage])

  const budgetBreakdown = useMemo<BudgetBreakdown>(() => ({
    total: adjustedBudget,
    categories,
    stageRelease,
    cityMultiplier,
  }), [adjustedBudget, categories, stageRelease, cityMultiplier])

  const perSquareMeter = useMemo(() => {
    return area > 0 ? Math.round(adjustedBudget / area) : 0
  }, [adjustedBudget, area])

  const spentAmount = useMemo(() => {
    const completedStages = stageRelease.filter((s) => s.status === 'completed')
    const inProgressStage = stageRelease.find((s) => s.status === 'released')
    const completedTotal = completedStages.reduce((sum, s) => sum + s.amount, 0)
    const inProgressTotal = inProgressStage ? inProgressStage.amount * 0.5 : 0
    return Math.round(completedTotal + inProgressTotal)
  }, [stageRelease])

  const remainingAmount = useMemo(() => {
    return adjustedBudget - spentAmount
  }, [adjustedBudget, spentAmount])

  const healthStatus = useMemo<BudgetHealthStatus>(() => {
    if (adjustedBudget <= 0) return 'healthy'
    const remainingRatio = remainingAmount / adjustedBudget
    if (remainingRatio > 0.15) return 'healthy'
    if (remainingRatio > 0.05) return 'warning'
    return 'danger'
  }, [adjustedBudget, remainingAmount])

  const healthPercent = useMemo(() => {
    if (adjustedBudget <= 0) return 100
    return Math.round((remainingAmount / adjustedBudget) * 100)
  }, [adjustedBudget, remainingAmount])

  const breakdown532 = useMemo<Budget532Breakdown>(() => {
    const styleTotal = STYLE_ADDONS.reduce((sum, item) => sum + item.amount, 0)
    const baseBudget = adjustedBudget - styleTotal

    const categories: BudgetMajorCategory[] = FIVE_THREE_TWO_CATEGORIES.map((cat) => {
      const categoryAmount = Math.round(baseBudget * cat.ratio)
      const items: BudgetSubItem[] = cat.items.map((item) => ({
        name: item.name,
        amount: Math.round(categoryAmount * item.ratio),
        ratio: item.ratio,
      }))
      return {
        name: cat.name,
        key: cat.key,
        ratio: cat.ratio,
        amount: categoryAmount,
        color: cat.color,
        items,
        expanded: true,
      }
    })

    return {
      total: adjustedBudget,
      categories,
      styleAddons: STYLE_ADDONS,
      styleTotal,
    }
  }, [adjustedBudget])

  const stageReleases = useMemo<StageRelease[]>(() => {
    return DEFAULT_STAGES.map((stage, index) => {
      const stageNum = index + 1
      let status: StageStatus = 'pending'
      if (stageNum < currentStage) status = 'completed'
      else if (stageNum === currentStage) status = 'in_progress'

      return {
        stage: stageNum,
        stageName: stage.stage,
        releaseRatio: stage.releaseRatio,
        amount: Math.round(adjustedBudget * stage.releaseRatio),
        purpose: stage.purpose,
        status,
        sopSteps: STAGE_SOP_STEPS[stageNum] || [],
      }
    })
  }, [adjustedBudget, currentStage])

  const totalReleasedPercent = useMemo(() => {
    const released = stageReleases.filter(
      (s) => s.status === 'completed' || s.status === 'in_progress'
    )
    const releasedRatio = released.reduce((sum, s) => sum + s.releaseRatio, 0)
    return Math.round(releasedRatio * 100)
  }, [stageReleases])

  const warnings = useMemo<BudgetWarning[]>(() => {
    return MOCK_WARNINGS
  }, [])

  return {
    totalBudget,
    adjustedBudget,
    cityMultiplier,
    categories,
    stageRelease,
    budgetBreakdown,
    perSquareMeter,
    healthStatus,
    healthPercent,
    spentAmount,
    remainingAmount,
    breakdown532,
    stageReleases,
    totalReleasedPercent,
    warnings,
  }
}
