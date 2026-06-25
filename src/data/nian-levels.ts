export interface NianLevelData {
  level: number
  title: string
  emoji: string
  spiritRequired: number
  unlocks: string[]
}

export const nianLevels: NianLevelData[] = [
  { level: 1, title: '蛋年兽', emoji: '🐣', spiritRequired: 0, unlocks: ['基础互动'] },
  { level: 2, title: '蛋年兽', emoji: '🐣', spiritRequired: 30, unlocks: [] },
  { level: 3, title: '小小年', emoji: '🐲', spiritRequired: 70, unlocks: ['幼兽形态', '红绸带装备'] },
  { level: 4, title: '小小年', emoji: '🐲', spiritRequired: 120, unlocks: [] },
  { level: 5, title: '小小年', emoji: '🐲', spiritRequired: 180, unlocks: [] },
  { level: 6, title: '红绸少年', emoji: '🦁', spiritRequired: 250, unlocks: ['成长形态', '铜钱项链装备'] },
  { level: 7, title: '红绸少年', emoji: '🦁', spiritRequired: 330, unlocks: [] },
  { level: 8, title: '红绸少年', emoji: '🦁', spiritRequired: 420, unlocks: [] },
  { level: 9, title: '红绸少年', emoji: '🦁', spiritRequired: 520, unlocks: [] },
  { level: 10, title: '宅院守护', emoji: '🐯', spiritRequired: 650, unlocks: ['成熟形态', '玉佩装备'] },
  { level: 11, title: '宅院守护', emoji: '🐯', spiritRequired: 800, unlocks: [] },
  { level: 12, title: '宅院守护', emoji: '🐯', spiritRequired: 980, unlocks: [] },
  { level: 13, title: '宅院守护', emoji: '🐯', spiritRequired: 1180, unlocks: [] },
  { level: 14, title: '宅院守护', emoji: '🐯', spiritRequired: 1400, unlocks: [] },
  { level: 15, title: '祥瑞年兽', emoji: '🐉', spiritRequired: 1650, unlocks: ['祥瑞形态', '终极称号'] },
]

export function getLevelData(level: number): NianLevelData {
  const clampedLevel = Math.max(1, Math.min(15, level))
  return nianLevels[clampedLevel - 1]
}

export function getSpiritForLevel(level: number): number {
  if (level <= 1) return 0
  if (level > 15) return nianLevels[14].spiritRequired
  return nianLevels[level - 1].spiritRequired
}

export function getLevelProgress(currentSpirit: number, currentLevel: number): { current: number; next: number; percent: number } {
  const currentLevelSpirit = getSpiritForLevel(currentLevel)
  const nextLevelSpirit = getSpiritForLevel(currentLevel + 1)
  
  if (currentLevel >= 15) {
    return { current: currentSpirit, next: nextLevelSpirit, percent: 100 }
  }
  
  const progress = currentSpirit - currentLevelSpirit
  const needed = nextLevelSpirit - currentLevelSpirit
  const percent = Math.min(100, Math.max(0, (progress / needed) * 100))
  
  return {
    current: progress,
    next: needed,
    percent,
  }
}

export function getStageName(level: number): string {
  if (level >= 15) return '祥瑞期'
  if (level >= 10) return '成熟期'
  if (level >= 6) return '成长期'
  if (level >= 3) return '幼兽期'
  return '蛋生期'
}

export const defaultEquipment = [
  { id: 'red-ribbon', name: '红绸带', description: '灵气+5%', icon: '🎀' },
]
