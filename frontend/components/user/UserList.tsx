'use client'

import { useState, useEffect } from 'react'
import { User, SkillLevel } from '../../types/user'
import { userApi, ApiError } from '../../utils/api'

interface UserListProps {
  onUserSelect?: (user: User) => void
  onUserDelete?: (userId: string) => void
  refreshTrigger?: number
}

const skillLevelLabels: Record<SkillLevel, string> = {
  A: 'A (最高)',
  B: 'B (高)',
  C: 'C (中)',
  D: 'D (低)',
  E: 'E (最低)',
  F: 'F (初心者)'
}

export default function UserList({ onUserSelect, onUserDelete, refreshTrigger }: UserListProps) {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchUsers = async () => {
    try {
      setLoading(true)
      setError(null)
      const fetchedUsers = await userApi.getAllUsers()
      setUsers(fetchedUsers)
    } catch (error) {
      if (error instanceof ApiError) {
        setError(error.message)
      } else {
        setError('ユーザー一覧の取得に失敗しました')
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [refreshTrigger])

  const handleDelete = async (user: User) => {
    if (!confirm(`${user.name}を削除しますか？この操作は取り消せません。`)) {
      return
    }

    try {
      await userApi.deleteUser(user.id)
      onUserDelete?.(user.id)
      fetchUsers() // リストを再読み込み
    } catch (error) {
      if (error instanceof ApiError) {
        alert(`削除に失敗しました: ${error.message}`)
      } else {
        alert('削除に失敗しました')
      }
    }
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
          onClick={fetchUsers}
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
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                  user.skillLevel === 'A' ? 'bg-green-100 text-green-800' :
                  user.skillLevel === 'B' ? 'bg-blue-100 text-blue-800' :
                  user.skillLevel === 'C' ? 'bg-yellow-100 text-yellow-800' :
                  user.skillLevel === 'D' ? 'bg-orange-100 text-orange-800' :
                  user.skillLevel === 'E' ? 'bg-red-100 text-red-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {skillLevelLabels[user.skillLevel]}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                <button
                  onClick={() => onUserSelect?.(user)}
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