import { FastifyInstance } from 'fastify'
import { UserRepository } from '../api/repository/user/userRepository'
import { UserUseCase } from '../api/usecase/user/userUseCase'
import { UserController } from '../api/controller/user/userController'
import { CreateUserInput, UpdateUserInput, UserIdParam } from '../domain/types/userSchemas'

export async function userRoutes(fastify: FastifyInstance) {
  // 依存関係の注入
  const userRepository = new UserRepository(fastify.prisma)
  const userUseCase = new UserUseCase(userRepository)
  const userController = new UserController(userUseCase)

  // ユーザー一覧取得
  fastify.get('/users', userController.getAllUsers.bind(userController))

  // ユーザー詳細取得
  fastify.get<{ Params: UserIdParam }>('/users/:id', userController.getUserById.bind(userController))

  // ユーザー作成
  fastify.post<{ Body: CreateUserInput }>('/users', userController.createUser.bind(userController))

  // ユーザー更新
  fastify.put<{ Params: UserIdParam, Body: UpdateUserInput }>('/users/:id', userController.updateUser.bind(userController))

  // ユーザー削除
  fastify.delete<{ Params: UserIdParam }>('/users/:id', userController.deleteUser.bind(userController))
} 