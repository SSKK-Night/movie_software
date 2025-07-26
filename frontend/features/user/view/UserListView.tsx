'use client'

import { User } from '../model/userTypes'
import { SKILL_LEVEL_LABELS, getSkillLevelColor } from '../enum/skillLevel'

interface UserListViewProps {
  users: User[]
  loading: boolean
  error: string | null
  onUserEdit: (user: User) => void
  onUserDelete: (user: User) => Promise<boolean>
  onRetry: () => void
}

export default function UserListView({
  users,
  loading,
  error,
  onUserEdit,
  onUserDelete,
  onRetry
}: UserListViewProps) {
  const handleDelete = async (user: User) => {
    await onUserDelete(user)
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2">読み込み中...</span>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-md p-4">
        <div className="text-red-800">{error}</div>
        <button
          onClick={onRetry}
          className="mt-2 text-sm text-red-600 hover:text-red-800 underline"
        >
          再試行
        </button>
      </div>
    )
  }

  if (users.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        ユーザーが見つかりません
      </div>
    )
  }

  return (
    <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
      <table className="min-w-full divide-y divide-gray-300">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              名前
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              メールアドレス
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              スキルレベル
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              操作
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {users.map((user) => (
            <tr key={user.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {user.name}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {user.email}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getSkillLevelColor(user.skillLevel)}`}>
                  {SKILL_LEVEL_LABELS[user.skillLevel]}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                <button
                  onClick={() => onUserEdit(user)}
                  className="text-blue-600 hover:text-blue-900 transition-colors"
                >
                  編集
                </button>
                <button
                  onClick={() => handleDelete(user)}
                  className="text-red-600 hover:text-red-900 transition-colors"
                >
                  削除
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
} 