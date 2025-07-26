import { SkillLevel } from '../../../generated/prisma'
import { CreateUserInput, UpdateUserInput } from '../types/userSchemas'

export interface User {
  id: string
  name: string
  email: string
  passwordHash: string
  skillLevel: SkillLevel
  createdAt: Date
  updatedAt: Date
}

// Zodスキーマから生成された型を使用
export type CreateUserData = CreateUserInput
export type UpdateUserData = UpdateUserInput

export interface UserResponse {
  id: string
  name: string
  email: string
  skillLevel: SkillLevel
  createdAt: Date
  updatedAt: Date
} 