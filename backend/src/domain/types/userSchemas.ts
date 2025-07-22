import { z } from 'zod'

// スキルレベルのenum
export const skillLevelSchema = z.enum(['A', 'B', 'C', 'D', 'E', 'F'])

// ユーザー作成時のバリデーション
export const createUserSchema = z.object({
  name: z.string()
    .min(1, 'ユーザー名は必須です')
    .max(100, 'ユーザー名は100文字以内で入力してください'),
  email: z.string()
    .email('有効なメールアドレスを入力してください'),
  password: z.string()
    .min(8, 'パスワードは8文字以上で入力してください')
    .max(100, 'パスワードは100文字以内で入力してください'),
  skillLevel: skillLevelSchema
})

// ユーザー更新時のバリデーション
export const updateUserSchema = z.object({
  name: z.string()
    .min(1, 'ユーザー名は必須です')
    .max(100, 'ユーザー名は100文字以内で入力してください')
    .optional(),
  email: z.string()
    .email('有効なメールアドレスを入力してください')
    .optional(),
  password: z.string()
    .min(8, 'パスワードは8文字以上で入力してください')
    .max(100, 'パスワードは100文字以内で入力してください')
    .optional(),
  skillLevel: skillLevelSchema.optional()
})

// IDパラメータのバリデーション
export const userIdParamSchema = z.object({
  id: z.string().uuid('有効なユーザーIDを指定してください')
})

export type CreateUserInput = z.infer<typeof createUserSchema>
export type UpdateUserInput = z.infer<typeof updateUserSchema>
export type UserIdParam = z.infer<typeof userIdParamSchema> 