import { SkillLevel } from '../enum/skillLevel'

// Domain Models
export type { SkillLevel } from '../enum/skillLevel'

export interface User {
  id: string
  name: string
  email: string
  skillLevel: SkillLevel
  createdAt?: string
  updatedAt?: string
}

// Input Models
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

// API Response Models
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

// Error Models
export class UserApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public details?: Array<{ field: string; message: string }>
  ) {
    super(message)
    this.name = 'UserApiError'
  }
} 