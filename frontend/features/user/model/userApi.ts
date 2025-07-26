import { User, CreateUserInput, UpdateUserInput, ApiResponse, UserApiError } from './userTypes'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'

class UserApiClient {
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    })

    const data: ApiResponse<T> = await response.json()

    if (!data.success) {
      throw new UserApiError(
        data.error || 'APIエラーが発生しました',
        response.status,
        data.details
      )
    }

    return data.data as T
  }

  async getAllUsers(): Promise<User[]> {
    return this.request<User[]>('/api/users')
  }

  async getUserById(id: string): Promise<User> {
    return this.request<User>(`/api/users/${id}`)
  }

  async createUser(userData: CreateUserInput): Promise<User> {
    return this.request<User>('/api/users', {
      method: 'POST',
      body: JSON.stringify(userData),
    })
  }

  async updateUser(id: string, userData: UpdateUserInput): Promise<User> {
    return this.request<User>(`/api/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(userData),
    })
  }

  async deleteUser(id: string): Promise<void> {
    return this.request<void>(`/api/users/${id}`, {
      method: 'DELETE',
    })
  }
}

// Singleton instance
export const userApiClient = new UserApiClient() 