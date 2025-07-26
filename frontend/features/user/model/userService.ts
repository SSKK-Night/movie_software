import { User, CreateUserInput, UpdateUserInput, UserApiError } from './userTypes'
import { userApiClient } from './userApi'

export class UserService {
  async getAllUsers(): Promise<User[]> {
    try {
      return await userApiClient.getAllUsers()
    } catch (error) {
      if (error instanceof UserApiError) {
        throw error
      }
      throw new UserApiError('ユーザー一覧の取得に失敗しました', 500)
    }
  }

  async getUserById(id: string): Promise<User> {
    if (!id) {
      throw new UserApiError('ユーザーIDが指定されていません', 400)
    }

    try {
      return await userApiClient.getUserById(id)
    } catch (error) {
      if (error instanceof UserApiError) {
        throw error
      }
      throw new UserApiError('ユーザーの取得に失敗しました', 500)
    }
  }

  async createUser(userData: CreateUserInput): Promise<User> {
    this.validateCreateUserInput(userData)

    try {
      return await userApiClient.createUser(userData)
    } catch (error) {
      if (error instanceof UserApiError) {
        throw error
      }
      throw new UserApiError('ユーザーの作成に失敗しました', 500)
    }
  }

  async updateUser(id: string, userData: UpdateUserInput): Promise<User> {
    if (!id) {
      throw new UserApiError('ユーザーIDが指定されていません', 400)
    }

    this.validateUpdateUserInput(userData)

    try {
      return await userApiClient.updateUser(id, userData)
    } catch (error) {
      if (error instanceof UserApiError) {
        throw error
      }
      throw new UserApiError('ユーザーの更新に失敗しました', 500)
    }
  }

  async deleteUser(id: string): Promise<void> {
    if (!id) {
      throw new UserApiError('ユーザーIDが指定されていません', 400)
    }

    try {
      return await userApiClient.deleteUser(id)
    } catch (error) {
      if (error instanceof UserApiError) {
        throw error
      }
      throw new UserApiError('ユーザーの削除に失敗しました', 500)
    }
  }

  private validateCreateUserInput(userData: CreateUserInput): void {
    if (!userData.name?.trim()) {
      throw new UserApiError('ユーザー名は必須です', 400)
    }
    if (!userData.email?.trim()) {
      throw new UserApiError('メールアドレスは必須です', 400)
    }
    if (!userData.password?.trim()) {
      throw new UserApiError('パスワードは必須です', 400)
    }
    if (!userData.skillLevel) {
      throw new UserApiError('スキルレベルは必須です', 400)
    }
  }

  private validateUpdateUserInput(userData: UpdateUserInput): void {
    if (userData.name !== undefined && !userData.name?.trim()) {
      throw new UserApiError('ユーザー名が空です', 400)
    }
    if (userData.email !== undefined && !userData.email?.trim()) {
      throw new UserApiError('メールアドレスが空です', 400)
    }
    if (userData.password !== undefined && userData.password.trim() && userData.password.length < 8) {
      throw new UserApiError('パスワードは8文字以上で入力してください', 400)
    }
  }
}

// Singleton instance
export const userService = new UserService() 