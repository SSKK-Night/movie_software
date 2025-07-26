import { useState, useCallback } from 'react'
import { User } from '../model/userTypes'

type ViewMode = 'list' | 'create' | 'edit'

interface UserManagementState {
  viewMode: ViewMode
  selectedUser: User | null
  refreshTrigger: number
}

export function useUserManagementViewModel() {
  const [state, setState] = useState<UserManagementState>({
    viewMode: 'list',
    selectedUser: null,
    refreshTrigger: 0
  })

  const showList = useCallback(() => {
    setState(prev => ({
      ...prev,
      viewMode: 'list',
      selectedUser: null
    }))
  }, [])

  const showCreateForm = useCallback(() => {
    setState(prev => ({
      ...prev,
      viewMode: 'create',
      selectedUser: null
    }))
  }, [])

  const showEditForm = useCallback((user: User) => {
    setState(prev => ({
      ...prev,
      viewMode: 'edit',
      selectedUser: user
    }))
  }, [])

  const handleFormSuccess = useCallback((user: User) => {
    setState(prev => ({
      ...prev,
      viewMode: 'list',
      selectedUser: null,
      refreshTrigger: prev.refreshTrigger + 1 // リストの再読み込みをトリガー
    }))
  }, [])

  const handleUserDelete = useCallback(() => {
    setState(prev => ({
      ...prev,
      refreshTrigger: prev.refreshTrigger + 1 // リストの再読み込みをトリガー
    }))
  }, [])

  const refreshUserList = useCallback(() => {
    setState(prev => ({
      ...prev,
      refreshTrigger: prev.refreshTrigger + 1
    }))
  }, [])

  return {
    // State
    viewMode: state.viewMode,
    selectedUser: state.selectedUser,
    refreshTrigger: state.refreshTrigger,

    // Actions
    showList,
    showCreateForm,
    showEditForm,
    handleFormSuccess,
    handleUserDelete,
    refreshUserList
  }
} 