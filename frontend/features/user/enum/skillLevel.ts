// スキルレベルのenum
export enum SkillLevelEnum {
  A = 'A',
  B = 'B',
  C = 'C',
  D = 'D',
  E = 'E',
  F = 'F'
}

// スキルレベルの型定義
export type SkillLevel = 'A' | 'B' | 'C' | 'D' | 'E' | 'F'

// スキルレベルのラベルマッピング
export const SKILL_LEVEL_LABELS: Record<SkillLevel, string> = {
  [SkillLevelEnum.A]: 'A (最高)',
  [SkillLevelEnum.B]: 'B (高)',
  [SkillLevelEnum.C]: 'C (中)',
  [SkillLevelEnum.D]: 'D (低)',
  [SkillLevelEnum.E]: 'E (最低)',
  [SkillLevelEnum.F]: 'F (初心者)'
}

// スキルレベルのオプション配列
export const SKILL_LEVEL_OPTIONS: Array<{ value: SkillLevel; label: string }> = [
  { value: SkillLevelEnum.A, label: SKILL_LEVEL_LABELS[SkillLevelEnum.A] },
  { value: SkillLevelEnum.B, label: SKILL_LEVEL_LABELS[SkillLevelEnum.B] },
  { value: SkillLevelEnum.C, label: SKILL_LEVEL_LABELS[SkillLevelEnum.C] },
  { value: SkillLevelEnum.D, label: SKILL_LEVEL_LABELS[SkillLevelEnum.D] },
  { value: SkillLevelEnum.E, label: SKILL_LEVEL_LABELS[SkillLevelEnum.E] },
  { value: SkillLevelEnum.F, label: SKILL_LEVEL_LABELS[SkillLevelEnum.F] },
]

// スキルレベルの色分けマッピング
export const SKILL_LEVEL_COLORS: Record<SkillLevel, string> = {
  [SkillLevelEnum.A]: 'bg-green-100 text-green-800',
  [SkillLevelEnum.B]: 'bg-blue-100 text-blue-800',
  [SkillLevelEnum.C]: 'bg-yellow-100 text-yellow-800',
  [SkillLevelEnum.D]: 'bg-orange-100 text-orange-800',
  [SkillLevelEnum.E]: 'bg-red-100 text-red-800',
  [SkillLevelEnum.F]: 'bg-gray-100 text-gray-800'
}

// スキルレベルの値を取得するヘルパー関数
export const getSkillLevelValues = (): SkillLevel[] => {
  return Object.values(SkillLevelEnum) as SkillLevel[]
}

// スキルレベルの色クラスを取得するヘルパー関数
export const getSkillLevelColor = (skillLevel: SkillLevel): string => {
  return SKILL_LEVEL_COLORS[skillLevel] || SKILL_LEVEL_COLORS[SkillLevelEnum.F]
}

// スキルレベルのラベルを取得するヘルパー関数
export const getSkillLevelLabel = (skillLevel: SkillLevel): string => {
  return SKILL_LEVEL_LABELS[skillLevel] || SKILL_LEVEL_LABELS[SkillLevelEnum.F]
} 