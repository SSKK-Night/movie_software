'use client'

import { useState, useEffect } from 'react'
import { User, CreateUserInput, UpdateUserInput, SkillLevel } from '../../types/user'
import { userApi, ApiError } from '../../utils/api'

interface UserFormProps {
  user?: User | null
  onSubmit?: (user: User) => void
  onCancel?: () => void
}

const skillLevelOptions: Array<{ value: SkillLevel; label: string }> = [
  { value: 'A', label: 'A (最高)' },
  { value: 'B', label: 'B (高)' },
  { value: 'C', label: 'C (中)' },
  { value: 'D', label: 'D (低)' },
  { value: 'E', label: 'E (最低)' },
  { value: 'F', label: 'F (初心者)' },
]

export default function UserForm({ user, onSubmit, onCancel }: UserFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    skillLevel: 'F' as SkillLevel,
  })
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const isEditing = !!user

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name,
        email: user.email,
        password: '', // パスワードは空にしておく
        skillLevel: user.skillLevel,
      })
    } else {
      setFormData({
        name: '',
        email: '',
        password: '',
        skillLevel: 'F',
      })
    }
    setErrors({})
  }, [user])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    // エラーをクリア
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setErrors({})

    try {
      let result: User
      
      if (isEditing && user) {
        // 編集の場合、パスワードが空の場合は更新しない
        const updateData: UpdateUserInput = {
          name: formData.name,
          email: formData.email,
          skillLevel: formData.skillLevel,
        }
        if (formData.password.trim()) {
          updateData.password = formData.password
        }
        result = await userApi.updateUser(user.id, updateData)
      } else {
        // 新規作成の場合
        const createData: CreateUserInput = {
          name: formData.name,
          email: formData.email,
          password: formData.password,
          skillLevel: formData.skillLevel,
        }
        result = await userApi.createUser(createData)
      }

      onSubmit?.(result)
    } catch (error) {
      if (error instanceof ApiError) {
        if (error.details) {
          const errorMap: Record<string, string> = {}
          error.details.forEach(detail => {
            errorMap[detail.field] = detail.message
          })
          setErrors(errorMap)
        } else {
          setErrors({ general: error.message })
        }
      } else {
        setErrors({ general: 'エラーが発生しました' })
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <h2 className="text-lg font-medium text-gray-900 mb-6">
        {isEditing ? 'ユーザー編集' : 'ユーザー作成'}
      </h2>

      {errors.general && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
          <div className="text-red-800">{errors.general}</div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            名前 <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${
              errors.name ? 'border-red-300' : ''
            }`}
            required
          />
          {errors.name && (
            <p className="mt-1 text-sm text-red-600">{errors.name}</p>
          )}
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            メールアドレス <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${
              errors.email ? 'border-red-300' : ''
            }`}
            required
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-600">{errors.email}</p>
          )}
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">
            パスワード {isEditing ? '(変更する場合のみ入力)' : <span className="text-red-500">*</span>}
          </label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${
              errors.password ? 'border-red-300' : ''
            }`}
            required={!isEditing}
          />
          {errors.password && (
            <p className="mt-1 text-sm text-red-600">{errors.password}</p>
          )}
        </div>

        <div>
          <label htmlFor="skillLevel" className="block text-sm font-medium text-gray-700">
            スキルレベル <span className="text-red-500">*</span>
          </label>
          <select
            id="skillLevel"
            name="skillLevel"
            value={formData.skillLevel}
            onChange={handleChange}
            className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${
              errors.skillLevel ? 'border-red-300' : ''
            }`}
            required
          >
            {skillLevelOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          {errors.skillLevel && (
            <p className="mt-1 text-sm text-red-600">{errors.skillLevel}</p>
          )}
        </div>

        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            キャンセル
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? '処理中...' : isEditing ? '更新' : '作成'}
          </button>
        </div>
      </form>
    </div>
  )
} 