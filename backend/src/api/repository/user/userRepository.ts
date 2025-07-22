import { PrismaClient, User as PrismaUser } from '../../../../generated/prisma'
import { CreateUserData, UpdateUserData } from '../../../domain/entities/User'

export interface IUserRepository {
  findAll(): Promise<PrismaUser[]>
  findById(id: string): Promise<PrismaUser | null>
  findByEmail(email: string): Promise<PrismaUser | null>
  create(userData: CreateUserData & { passwordHash: string }): Promise<PrismaUser>
  update(id: string, userData: Partial<PrismaUser>): Promise<PrismaUser>
  delete(id: string): Promise<void>
  existsByEmail(email: string): Promise<boolean>
  existsByEmailExcludeId(email: string, excludeId: string): Promise<boolean>
}

export class UserRepository implements IUserRepository {
  constructor(private prisma: PrismaClient) {}

  async findAll(): Promise<PrismaUser[]> {
    return await this.prisma.user.findMany({
      orderBy: { createdAt: 'desc' }
    })
  }

  async findById(id: string): Promise<PrismaUser | null> {
    return await this.prisma.user.findUnique({
      where: { id }
    })
  }

  async findByEmail(email: string): Promise<PrismaUser | null> {
    return await this.prisma.user.findUnique({
      where: { email }
    })
  }

  async create(userData: CreateUserData & { passwordHash: string }): Promise<PrismaUser> {
    return await this.prisma.user.create({
      data: {
        name: userData.name,
        email: userData.email,
        passwordHash: userData.passwordHash,
        skillLevel: userData.skillLevel
      }
    })
  }

  async update(id: string, userData: Partial<PrismaUser>): Promise<PrismaUser> {
    return await this.prisma.user.update({
      where: { id },
      data: userData
    })
  }

  async delete(id: string): Promise<void> {
    await this.prisma.user.delete({
      where: { id }
    })
  }

  async existsByEmail(email: string): Promise<boolean> {
    const user = await this.prisma.user.findUnique({
      where: { email }
    })
    return !!user
  }

  async existsByEmailExcludeId(email: string, excludeId: string): Promise<boolean> {
    const user = await this.prisma.user.findFirst({
      where: {
        email,
        NOT: { id: excludeId }
      }
    })
    return !!user
  }
} 