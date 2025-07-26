'use client'

import { useState } from 'react'
import { User } from '../../types/user'
import UserList from './UserList'
import UserForm from './UserForm'

type ViewMode = 'list' | 'create' | 'edit'

export default function UserManagement() {
  const [viewMode, setViewMode] = useState<ViewMode>('list')
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [refreshTrigger, setRefreshTrigger] = useState(0)

  const handleCreateUser = () => {
    setSelectedUser(null)
    setViewMode('create')
  }

  const handleEditUser = (user: User) => {
    setSelectedUser(user)
    setViewMode('edit')
  }

  const handleFormSubmit = (user: User) => {
    setViewMode('list')
    setSelectedUser(null)
    setRefreshTrigger(prev => prev + 1) // ユーザーリストを再読み込み
  }

  const handleFormCancel = () => {
    setViewMode('list')
    setSelectedUser(null)
  }

  const handleUserDelete = (userId: string) => {
    setRefreshTrigger(prev => prev + 1) // ユーザーリストを再読み込み
  }

  if (viewMode === 'create' || viewMode === 'edit') {
    return (
      <div className="max-w-2xl mx-auto">
        <UserForm
          user={selectedUser}
          onSubmit={handleFormSubmit}
          onCancel={handleFormCancel}
        />
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">ユーザー管理</h1>
          <button
            onClick={handleCreateUser}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            新規ユーザー作成
          </button>
        </div>
        <p className="mt-2 text-sm text-gray-600">
          ユーザーの一覧表示、作成、編集、削除ができます。
        </p>
      </div>

      <UserList
        onUserSelect={handleEditUser}
        onUserDelete={handleUserDelete}
        refreshTrigger={refreshTrigger}
      />
    </div>
  )
} 