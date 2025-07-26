'use client'

import React from 'react'
import { useUserManagementViewModel } from '../viewmodel/useUserManagementViewModel'
import { useUserListViewModel } from '../viewmodel/useUserListViewModel'
import { useUserFormViewModel } from '../viewmodel/useUserFormViewModel'
import UserListView from './UserListView'
import UserFormView from './UserFormView'

export default function UserManagementView() {
  const {
    viewMode,
    selectedUser,
    refreshTrigger,
    showList,
    showCreateForm,
    showEditForm,
    handleFormSuccess,
    handleUserDelete
  } = useUserManagementViewModel()

  // ユーザーリスト用のViewModel
  const userListViewModel = useUserListViewModel()

  // フォーム用のViewModel
  const userFormViewModel = useUserFormViewModel({
    user: selectedUser,
    onSuccess: handleFormSuccess
  })

  // refreshTriggerの変更でリストを再読み込み
  React.useEffect(() => {
    if (refreshTrigger > 0) {
      userListViewModel.refreshUsers()
    }
  }, [refreshTrigger, userListViewModel.refreshUsers])

  if (viewMode === 'create' || viewMode === 'edit') {
    return (
      <div className="max-w-2xl mx-auto">
        <UserFormView
          formData={userFormViewModel.formData}
          loading={userFormViewModel.loading}
          errors={userFormViewModel.errors}
          isEditing={userFormViewModel.isEditing}
          onFieldChange={userFormViewModel.updateFormData}
          onSubmit={userFormViewModel.submitForm}
          onCancel={showList}
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
            onClick={showCreateForm}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            新規ユーザー作成
          </button>
        </div>
        <p className="mt-2 text-sm text-gray-600">
          ユーザーの一覧表示、作成、編集、削除ができます。
        </p>
      </div>

      <UserListView
        users={userListViewModel.users}
        loading={userListViewModel.loading}
        error={userListViewModel.error}
        onUserEdit={showEditForm}
        onUserDelete={async (user) => {
          const success = await userListViewModel.deleteUser(user)
          if (success) {
            handleUserDelete()
          }
          return success
        }}
        onRetry={userListViewModel.retryFetch}
      />
    </div>
  )
} 