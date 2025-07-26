import { useState, useEffect, useCallback } from 'react'
import { User, UserApiError } from '../model/userTypes'
import { userService } from '../model/userService'

interface UserListState {
  users: User[]
  loading: boolean
  error: string | null
}

export function useUserListViewModel() {
  const [state, setState] = useState<UserListState>({
    users: [],
    loading: true,
    error: null
  })

  const fetchUsers = useCallback(async () => {
    setState(prev => ({ ...prev, loading: true, error: null }))
    
    try {
      const users = await userService.getAllUsers()
      setState(prev => ({ ...prev, users, loading: false }))
    } catch (error) {
      const errorMessage = error instanceof UserApiError 
        ? error.message 
        : 'ユーザー一覧の取得に失敗しました'
      
      setState(prev => ({ 
        ...prev, 
        loading: false, 
        error: errorMessage 
      }))
    }
  }, [])

  const deleteUser = useCallback(async (user: User): Promise<boolean> => {
    if (!confirm(`${user.name}を削除しますか？この操作は取り消せません。`)) {
      return false
    }

    try {
      await userService.deleteUser(user.id)
      // リストから削除
      setState(prev => ({
        ...prev,
        users: prev.users.filter(u => u.id !== user.id)
      }))
      return true
    } catch (error) {
      const errorMessage = error instanceof UserApiError 
        ? error.message 
        : '削除に失敗しました'
      
      alert(`削除に失敗しました: ${errorMessage}`)
      return false
    }
  }, [])

  const refreshUsers = useCallback(() => {
    fetchUsers()
  }, [fetchUsers])

  useEffect(() => {
    fetchUsers()
  }, [fetchUsers])

  return {
    // State
    users: state.users,
    loading: state.loading,
    error: state.error,
    
    // Actions
    deleteUser,
    refreshUsers,
    retryFetch: fetchUsers
  }
} 