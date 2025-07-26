import { useState, useEffect, useCallback } from 'react'
import { User, CreateUserInput, UpdateUserInput, UserApiError } from '../model/userTypes'
import { SkillLevel, SkillLevelEnum } from '../enum/skillLevel'
import { userService } from '../model/userService'

interface FormData {
  name: string
  email: string
  password: string
  skillLevel: SkillLevel
}

interface UserFormState {
  formData: FormData
  loading: boolean
  errors: Record<string, string>
}

interface UseUserFormViewModelProps {
  user?: User | null
  onSuccess?: (user: User) => void
}

export function useUserFormViewModel({ user, onSuccess }: UseUserFormViewModelProps) {
  const [state, setState] = useState<UserFormState>({
    formData: {
      name: '',
      email: '',
      password: '',
      skillLevel: SkillLevelEnum.F
    },
    loading: false,
    errors: {}
  })

  const isEditing = !!user

  // ユーザーデータでフォームを初期化
  useEffect(() => {
    if (user) {
      setState(prev => ({
        ...prev,
        formData: {
          name: user.name,
          email: user.email,
          password: '', // パスワードは空にする
          skillLevel: user.skillLevel
        },
        errors: {}
      }))
    } else {
      setState(prev => ({
        ...prev,
        formData: {
          name: '',
          email: '',
          password: '',
          skillLevel: SkillLevelEnum.F
        },
        errors: {}
      }))
    }
  }, [user])

  const updateFormData = useCallback((field: keyof FormData, value: string) => {
    setState(prev => ({
      ...prev,
      formData: { ...prev.formData, [field]: value },
      errors: { ...prev.errors, [field]: '' } // エラーをクリア
    }))
  }, [])

  const validateForm = useCallback((): boolean => {
    const errors: Record<string, string> = {}

    if (!state.formData.name.trim()) {
      errors.name = 'ユーザー名は必須です'
    }

    if (!state.formData.email.trim()) {
      errors.email = 'メールアドレスは必須です'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(state.formData.email)) {
      errors.email = '有効なメールアドレスを入力してください'
    }

    if (!isEditing && !state.formData.password.trim()) {
      errors.password = 'パスワードは必須です'
    } else if (state.formData.password.trim() && state.formData.password.length < 8) {
      errors.password = 'パスワードは8文字以上で入力してください'
    }

    if (!state.formData.skillLevel) {
      errors.skillLevel = 'スキルレベルは必須です'
    }

    setState(prev => ({ ...prev, errors }))
    return Object.keys(errors).length === 0
  }, [state.formData, isEditing])

  const submitForm = useCallback(async (): Promise<void> => {
    if (!validateForm()) {
      return
    }

    setState(prev => ({ ...prev, loading: true, errors: {} }))

    try {
      let result: User

      if (isEditing && user) {
        // 編集の場合
        const updateData: UpdateUserInput = {
          name: state.formData.name,
          email: state.formData.email,
          skillLevel: state.formData.skillLevel
        }
        
        // パスワードが入力されている場合のみ含める
        if (state.formData.password.trim()) {
          updateData.password = state.formData.password
        }

        result = await userService.updateUser(user.id, updateData)
      } else {
        // 新規作成の場合
        const createData: CreateUserInput = {
          name: state.formData.name,
          email: state.formData.email,
          password: state.formData.password,
          skillLevel: state.formData.skillLevel
        }

        result = await userService.createUser(createData)
      }

      setState(prev => ({ ...prev, loading: false }))
      onSuccess?.(result)
    } catch (error) {
      if (error instanceof UserApiError) {
        if (error.details) {
          // バリデーションエラーの場合
          const errorMap: Record<string, string> = {}
          error.details.forEach(detail => {
            errorMap[detail.field] = detail.message
          })
          setState(prev => ({ ...prev, loading: false, errors: errorMap }))
        } else {
          // 一般的なエラーの場合
          setState(prev => ({ 
            ...prev, 
            loading: false, 
            errors: { general: error.message } 
          }))
        }
      } else {
        setState(prev => ({ 
          ...prev, 
          loading: false, 
          errors: { general: 'エラーが発生しました' } 
        }))
      }
    }
  }, [state.formData, isEditing, user, validateForm, onSuccess])

  const resetForm = useCallback(() => {
    setState(prev => ({
      ...prev,
      formData: {
        name: '',
        email: '',
        password: '',
        skillLevel: SkillLevelEnum.F
      },
      errors: {}
    }))
  }, [])

  return {
    // State
    formData: state.formData,
    loading: state.loading,
    errors: state.errors,
    isEditing,

    // Actions
    updateFormData,
    submitForm,
    resetForm
  }
} 