export type SkillLevel = 'A' | 'B' | 'C' | 'D' | 'E' | 'F'

export interface User {
  id: string
  name: string
  email: string
  skillLevel: SkillLevel
  createdAt?: string
  updatedAt?: string
}

export interface CreateUserInput {
  name: string
  email: string
  password: string
  skillLevel: SkillLevel
}

export interface UpdateUserInput {
  name?: string
  email?: string
  password?: string
  skillLevel?: SkillLevel
}

export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  message?: string
  details?: Array<{
    field: string
    message: string
  }>
} 