export interface FloorPlanRoom {
  name: string
  area: number
  position: { x: number; y: number; w: number; h: number }
}

export interface FloorPlanData {
  layout: string
  totalArea: number
  innerArea: number
  rooms: FloorPlanRoom[]
}

export const floorPlanData: FloorPlanData = {
  layout: '3室2厅1卫',
  totalArea: 100,
  innerArea: 82,
  rooms: [
    { name: '主卧', area: 15, position: { x: 0, y: 0, w: 35, h: 30 } },
    { name: '次卧', area: 12, position: { x: 35, y: 0, w: 30, h: 25 } },
    { name: '客厅', area: 25, position: { x: 0, y: 30, w: 50, h: 30 } },
    { name: '厨房', area: 8, position: { x: 50, y: 0, w: 25, h: 20 } },
    { name: '卫生间', area: 5, position: { x: 50, y: 20, w: 25, h: 15 } },
    { name: '阳台', area: 8, position: { x: 0, y: 60, w: 50, h: 15 } },
    { name: '其他', area: 7, position: { x: 65, y: 35, w: 20, h: 40 } },
  ],
}

export type RiskLevel = 'high' | 'medium' | 'low'

export interface ContractRisk {
  id: string
  level: RiskLevel
  title: string
  description: string
  suggestion: string
}

export const contractRisks: ContractRisk[] = [
  {
    id: 'risk-1',
    level: 'high',
    title: '增项条款不明确',
    description: '合同中未明确增项上限',
    suggestion: '建议增加"增项不得超过合同总额10%"条款',
  },
  {
    id: 'risk-2',
    level: 'medium',
    title: '付款节点不合理',
    description: '首付比例过高（60%）',
    suggestion: '建议调整为30-40%',
  },
  {
    id: 'risk-3',
    level: 'medium',
    title: '工期违约金过低',
    description: '延误赔偿仅10元/天',
    suggestion: '建议提高至合同额0.1%/天',
  },
  {
    id: 'risk-4',
    level: 'low',
    title: '材料品牌未细化',
    description: '辅材品牌型号未明确指定',
    suggestion: '建议明确指定辅材品牌型号',
  },
  {
    id: 'risk-5',
    level: 'low',
    title: '质保期偏短',
    description: '防水质保期不足',
    suggestion: '防水质保建议5年以上',
  },
  {
    id: 'risk-6',
    level: 'low',
    title: '验收标准模糊',
    description: '各阶段验收标准不够详细',
    suggestion: '建议增加各阶段详细验收标准',
  },
]

export const contractSuggestions = [
  '增项条款：明确增项范围、报价方式及上限（建议不超过合同总额10%）',
  '付款方式：建议按30%-30%-30%-10%分四期支付，降低首付比例',
  '工期违约：延误赔偿建议为合同额的0.1%/天，上限不低于合同额的5%',
  '材料明细：合同附件需包含完整的材料品牌、型号、规格清单',
  '质保条款：基础工程质保2年，防水工程质保5年以上',
  '验收标准：明确各阶段验收标准、验收流程及整改时限',
]

export interface QualityItem {
  id: string
  name: string
  status: 'pass' | 'warning' | 'fail'
  detail?: string
}

export interface QualityInspectionData {
  stepId: number
  stepName: string
  score: number
  scoreColor: string
  items: QualityItem[]
  detectionBoxes: { x: number; y: number; w: number; h: number; label: string }[]
}

export const qualityInspectionData: Record<number, QualityInspectionData> = {
  10: {
    stepId: 10,
    stepName: '水电验收',
    score: 92,
    scoreColor: 'zhuQing',
    items: [
      { id: 'q1', name: '电路布线', status: 'pass' },
      { id: 'q2', name: '水管打压', status: 'pass' },
      { id: 'q3', name: '防水涂层', status: 'warning', detail: '需补涂' },
      { id: 'q4', name: '开关位置', status: 'pass' },
    ],
    detectionBoxes: [
      { x: 20, y: 20, w: 25, h: 20, label: '电路检测' },
      { x: 55, y: 15, w: 20, h: 25, label: '水管检测' },
      { x: 30, y: 55, w: 30, h: 25, label: '防水检测' },
    ],
  },
  12: {
    stepId: 12,
    stepName: '防水处理',
    score: 85,
    scoreColor: 'tanHe',
    items: [
      { id: 'q1', name: '闭水试验', status: 'pass' },
      { id: 'q2', name: '防水层厚度', status: 'pass' },
      { id: 'q3', name: '阴阳角处理', status: 'warning', detail: '需加强' },
    ],
    detectionBoxes: [
      { x: 15, y: 30, w: 30, h: 35, label: '闭水检测' },
      { x: 55, y: 20, w: 25, h: 30, label: '厚度检测' },
      { x: 40, y: 60, w: 20, h: 15, label: '阴阳角' },
    ],
  },
  13: {
    stepId: 13,
    stepName: '贴砖',
    score: 88,
    scoreColor: 'tanHe',
    items: [
      { id: 'q1', name: '空鼓率', status: 'pass', detail: '2.3%<5%' },
      { id: 'q2', name: '平整度', status: 'pass' },
      { id: 'q3', name: '勾缝质量', status: 'warning', detail: '不均匀' },
    ],
    detectionBoxes: [
      { x: 10, y: 15, w: 35, h: 30, label: '空鼓检测' },
      { x: 50, y: 25, w: 30, h: 25, label: '平整度' },
      { x: 25, y: 55, w: 40, h: 20, label: '勾缝检测' },
    ],
  },
  15: {
    stepId: 15,
    stepName: '墙面刷漆',
    score: 95,
    scoreColor: 'zhuQing',
    items: [
      { id: 'q1', name: '墙面平整度', status: 'pass' },
      { id: 'q2', name: '颜色均匀度', status: 'pass' },
      { id: 'q3', name: '阴阳角顺直', status: 'pass' },
    ],
    detectionBoxes: [
      { x: 20, y: 10, w: 25, h: 40, label: '平整度' },
      { x: 55, y: 20, w: 25, h: 35, label: '颜色检测' },
      { x: 10, y: 55, w: 80, h: 15, label: '阴阳角' },
    ],
  },
}
