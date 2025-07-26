import bcrypt from 'bcrypt'
import { IUserRepository } from '../../repository/user/userRepository'
import { CreateUserData, UpdateUserData, UserResponse } from '../../../domain/entities/User'
import { User as PrismaUser } from '../../../../generated/prisma'

export interface IUserUseCase {
  getAllUsers(): Promise<UserResponse[]>
  getUserById(id: string): Promise<UserResponse>
  createUser(userData: CreateUserData): Promise<UserResponse>
  updateUser(id: string, userData: UpdateUserData): Promise<UserResponse>
  deleteUser(id: string): Promise<void>
}

export class UserUseCase implements IUserUseCase {
  constructor(private userRepository: IUserRepository) {}

  async getAllUsers(): Promise<UserResponse[]> {
    const users = await this.userRepository.findAll()
    return users.map(this.toUserResponse)
  }

  async getUserById(id: string): Promise<UserResponse> {
    const user = await this.userRepository.findById(id)
    if (!user) {
      throw new Error('ユーザーが見つかりません')
    }
    return this.toUserResponse(user)
  }

  async createUser(userData: CreateUserData): Promise<UserResponse> {
    // メールアドレスの重複チェック
    const emailExists = await this.userRepository.existsByEmail(userData.email)
    if (emailExists) {
      throw new Error('このメールアドレスは既に使用されています')
    }

    // パスワードのハッシュ化
    const passwordHash = await this.hashPassword(userData.password)

    // ユーザー作成
    const user = await this.userRepository.create({
      ...userData,
      passwordHash
    })

    return this.toUserResponse(user)
  }

  async updateUser(id: string, userData: UpdateUserData): Promise<UserResponse> {
    // ユーザーの存在確認
    const existingUser = await this.userRepository.findById(id)
    if (!existingUser) {
      throw new Error('ユーザーが見つかりません')
    }

    // メールアドレスの重複チェック（自分以外）
    if (userData.email) {
      const emailExists = await this.userRepository.existsByEmailExcludeId(userData.email, id)
      if (emailExists) {
        throw new Error('このメールアドレスは既に使用されています')
      }
    }

    // 更新データの準備
    const updateData: any = {}
    if (userData.name !== undefined) updateData.name = userData.name
    if (userData.email !== undefined) updateData.email = userData.email
    if (userData.skillLevel !== undefined) updateData.skillLevel = userData.skillLevel
    
    // パスワードが指定されている場合はハッシュ化
    if (userData.password) {
      updateData.passwordHash = await this.hashPassword(userData.password)
    }

    // ユーザー更新
    const user = await this.userRepository.update(id, updateData)
    return this.toUserResponse(user)
  }

  async deleteUser(id: string): Promise<void> {
    // ユーザーの存在確認
    const existingUser = await this.userRepository.findById(id)
    if (!existingUser) {
      throw new Error('ユーザーが見つかりません')
    }

    await this.userRepository.delete(id)
  }

  private async hashPassword(password: string): Promise<string> {
    const saltRounds = 10
    return await bcrypt.hash(password, saltRounds)
  }

  private toUserResponse(user: PrismaUser): UserResponse {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      skillLevel: user.skillLevel,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    }
  }
} 