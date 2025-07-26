'use client'

import { SkillLevel, SKILL_LEVEL_OPTIONS } from '../enum/skillLevel'

interface FormData {
  name: string
  email: string
  password: string
  skillLevel: SkillLevel
}

interface UserFormViewProps {
  formData: FormData
  loading: boolean
  errors: Record<string, string>
  isEditing: boolean
  onFieldChange: (field: keyof FormData, value: string) => void
  onSubmit: () => Promise<void>
  onCancel: () => void
}

export default function UserFormView({
  formData,
  loading,
  errors,
  isEditing,
  onFieldChange,
  onSubmit,
  onCancel
}: UserFormViewProps) {
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await onSubmit()
  }

  const handleFieldChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    onFieldChange(name as keyof FormData, value)
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
            onChange={handleFieldChange}
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
            onChange={handleFieldChange}
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
            onChange={handleFieldChange}
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
            onChange={handleFieldChange}
            className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${
              errors.skillLevel ? 'border-red-300' : ''
            }`}
            required
          >
            {SKILL_LEVEL_OPTIONS.map((option) => (
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