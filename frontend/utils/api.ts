import { User, CreateUserInput, UpdateUserInput, ApiResponse } from '../types/user'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'

class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public details?: Array<{ field: string; message: string }>
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

const apiRequest = async <T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> => {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  })

  const data: ApiResponse<T> = await response.json()

  if (!data.success) {
    throw new ApiError(
      data.error || 'APIエラーが発生しました',
      response.status,
      data.details
    )
  }

  return data.data as T
}

export const userApi = {
  // ユーザー一覧取得
  getAllUsers: (): Promise<User[]> => {
    return apiRequest<User[]>('/api/users')
  },

  // ユーザー詳細取得
  getUserById: (id: string): Promise<User> => {
    return apiRequest<User>(`/api/users/${id}`)
  },

  // ユーザー作成
  createUser: (userData: CreateUserInput): Promise<User> => {
    return apiRequest<User>('/api/users', {
      method: 'POST',
      body: JSON.stringify(userData),
    })
  },

  // ユーザー更新
  updateUser: (id: string, userData: UpdateUserInput): Promise<User> => {
    return apiRequest<User>(`/api/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(userData),
    })
  },

  // ユーザー削除
  deleteUser: (id: string): Promise<void> => {
    return apiRequest<void>(`/api/users/${id}`, {
      method: 'DELETE',
    })
  },
}

export { ApiError } 