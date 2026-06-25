export type AppView = 'onboarding' | 'sop' | 'budget' | 'nian' | 'demo'

export type EmotionType = 'happy' | 'sleepy' | 'confused' | 'excited' | 'worried' | 'thinking' | 'surprised' | 'satisfied'

export type BudgetHealthStatus = 'healthy' | 'warning' | 'danger'
export type BudgetWarningLevel = 'high' | 'medium' | 'low'
export type StageStatus = 'completed' | 'in_progress' | 'pending'

export interface BudgetSubItem {
  name: string
  amount: number
  ratio: number
  actualAmount?: number
}

export interface BudgetMajorCategory {
  name: string
  key: string
  ratio: number
  amount: number
  color: string
  items: BudgetSubItem[]
  expanded?: boolean
}

export interface StyleBudgetItem {
  name: string
  amount: number
  description: string
}

export interface BudgetWarning {
  id: string
  level: BudgetWarningLevel
  title: string
  category: string
  plannedAmount: number
  actualAmount: number
  overrunAmount: number
  suggestion: string
}

export interface Budget532Breakdown {
  total: number
  categories: BudgetMajorCategory[]
  styleAddons: StyleBudgetItem[]
  styleTotal: number
}

export interface StageRelease {
  stage: number
  stageName: string
  releaseRatio: number
  amount: number
  purpose: string
  status: StageStatus
  sopSteps: string[]
}

export interface StyleResult {
  styleName: string
  matchScore: number
  tagline: string
  tags: string[]
  description: string
}

export interface BudgetCategory {
  amount: number
  ratio: number
}

export interface StageBudget {
  stage: string
  releaseRatio: number
  amount: number
  purpose: string
  status: 'pending' | 'released' | 'completed'
}

export interface BudgetBreakdown {
  total: number
  categories: Record<string, BudgetCategory>
  stageRelease: StageBudget[]
  cityMultiplier: number
}

export interface FloorPlanData {
  rooms: number
  area: number
}

export interface Equipment {
  id: string
  name: string
  description: string
  icon: string
}

export interface SOPStep {
  id: number
  title: string
  stageId: number
  stageName: string
  description: string
  guideText: string
  checklist: string[]
  aiTrigger: string | null
}

export interface SOPProgress {
  currentStep: number
  completedSteps: number[]
  stageUnlockStatus: Record<number, boolean>
}

export interface NianProgress {
  level: number
  spiritPoints: number
  jadeStones: number
  houseScore: number
  streakDays: number
  equipment: Equipment[]
  emotion: EmotionType
}

export interface UserSession {
  styleResult: StyleResult | null
  budgetTotal: number
  budgetBreakdown: BudgetBreakdown | null
  city: string
  area: number
  specialNeeds: string[]
  floorPlan: FloorPlanData | null
}

export interface DemoMode {
  isActive: boolean
  currentChapter: number
  progress: number
}

export interface AppState {
  currentView: AppView
  userSession: UserSession
  sopProgress: SOPProgress
  nianProgress: NianProgress
  demoMode: DemoMode
}

export type AppAction =
  | { type: 'SET_VIEW'; payload: AppView }
  | { type: 'SET_STYLE_RESULT'; payload: StyleResult }
  | { type: 'SET_BUDGET'; payload: { total: number; breakdown: BudgetBreakdown } }
  | { type: 'UPDATE_SOP_STEP'; payload: number }
  | { type: 'COMPLETE_STEP'; payload: number }
  | { type: 'UPDATE_NIAN'; payload: Partial<NianProgress> }
  | { type: 'SET_DEMO_MODE'; payload: Partial<DemoMode> }
  | { type: 'RESET_STATE' }
  | { type: 'SET_USER_SESSION'; payload: Partial<UserSession> }

export interface StyleQuizQuestion {
  id: number
  title: string
  description: string
  type: 'image-choice' | 'text-choice' | 'binary'
  options: StyleQuizOption[]
}

export interface StyleQuizOption {
  id: string
  label: string
  imageUrl?: string
  styleWeights: Record<string, number>
}

export interface DemoChapter {
  id: number
  title: string
  duration: string
  description: string
  targetView: AppView
}
