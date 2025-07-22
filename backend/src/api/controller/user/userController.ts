import { FastifyRequest, FastifyReply } from 'fastify'
import { IUserUseCase } from '../../usecase/user/userUseCase'
import { 
  CreateUserInput, 
  UpdateUserInput, 
  UserIdParam,
  createUserSchema,
  updateUserSchema,
  userIdParamSchema
} from '../../../domain/types/userSchemas'

export interface IUserController {
  getAllUsers(request: FastifyRequest, reply: FastifyReply): Promise<void>
  getUserById(request: FastifyRequest<{ Params: UserIdParam }>, reply: FastifyReply): Promise<void>
  createUser(request: FastifyRequest<{ Body: CreateUserInput }>, reply: FastifyReply): Promise<void>
  updateUser(request: FastifyRequest<{ Params: UserIdParam, Body: UpdateUserInput }>, reply: FastifyReply): Promise<void>
  deleteUser(request: FastifyRequest<{ Params: UserIdParam }>, reply: FastifyReply): Promise<void>
}

export class UserController implements IUserController {
  constructor(private userUseCase: IUserUseCase) {}

  async getAllUsers(request: FastifyRequest, reply: FastifyReply): Promise<void> {
    try {
      const users = await this.userUseCase.getAllUsers()
      reply.status(200).send({
        success: true,
        data: users
      })
    } catch (error) {
      request.log.error(error)
      reply.status(500).send({
        success: false,
        error: 'ユーザー一覧の取得に失敗しました'
      })
    }
  }

  async getUserById(request: FastifyRequest<{ Params: UserIdParam }>, reply: FastifyReply): Promise<void> {
    try {
      // パラメータのバリデーション
      const paramsResult = userIdParamSchema.safeParse(request.params)
      if (!paramsResult.success) {
        reply.status(400).send({
          success: false,
          error: 'バリデーションエラーが発生しました',
          details: paramsResult.error.errors.map(err => ({
            field: err.path.join('.'),
            message: err.message
          }))
        })
        return
      }

      const { id } = paramsResult.data
      const user = await this.userUseCase.getUserById(id)
      
      reply.status(200).send({
        success: true,
        data: user
      })
    } catch (error) {
      request.log.error(error)
      const errorMessage = error instanceof Error ? error.message : 'ユーザーの取得に失敗しました'
      const statusCode = errorMessage.includes('見つかりません') ? 404 : 500
      
      reply.status(statusCode).send({
        success: false,
        error: errorMessage
      })
    }
  }

  async createUser(request: FastifyRequest<{ Body: CreateUserInput }>, reply: FastifyReply): Promise<void> {
    try {
      // リクエストボディのバリデーション
      const bodyResult = createUserSchema.safeParse(request.body)
      if (!bodyResult.success) {
        reply.status(400).send({
          success: false,
          error: 'バリデーションエラーが発生しました',
          details: bodyResult.error.errors.map(err => ({
            field: err.path.join('.'),
            message: err.message
          }))
        })
        return
      }

      const userData = bodyResult.data
      const user = await this.userUseCase.createUser(userData)
      
      reply.status(201).send({
        success: true,
        data: user,
        message: 'ユーザーが正常に作成されました'
      })
    } catch (error) {
      request.log.error(error)
      const errorMessage = error instanceof Error ? error.message : 'ユーザーの作成に失敗しました'
      reply.status(400).send({
        success: false,
        error: errorMessage
      })
    }
  }

  async updateUser(request: FastifyRequest<{ Params: UserIdParam, Body: UpdateUserInput }>, reply: FastifyReply): Promise<void> {
    try {
      // パラメータのバリデーション
      const paramsResult = userIdParamSchema.safeParse(request.params)
      if (!paramsResult.success) {
        reply.status(400).send({
          success: false,
          error: 'バリデーションエラーが発生しました',
          details: paramsResult.error.errors.map(err => ({
            field: err.path.join('.'),
            message: err.message
          }))
        })
        return
      }

      // リクエストボディのバリデーション
      const bodyResult = updateUserSchema.safeParse(request.body)
      if (!bodyResult.success) {
        reply.status(400).send({
          success: false,
          error: 'バリデーションエラーが発生しました',
          details: bodyResult.error.errors.map(err => ({
            field: err.path.join('.'),
            message: err.message
          }))
        })
        return
      }

      const { id } = paramsResult.data
      const userData = bodyResult.data
      
      const user = await this.userUseCase.updateUser(id, userData)
      
      reply.status(200).send({
        success: true,
        data: user,
        message: 'ユーザーが正常に更新されました'
      })
    } catch (error) {
      request.log.error(error)
      const errorMessage = error instanceof Error ? error.message : 'ユーザーの更新に失敗しました'
      const statusCode = errorMessage.includes('見つかりません') ? 404 : 400
      
      reply.status(statusCode).send({
        success: false,
        error: errorMessage
      })
    }
  }

  async deleteUser(request: FastifyRequest<{ Params: UserIdParam }>, reply: FastifyReply): Promise<void> {
    try {
      // パラメータのバリデーション
      const paramsResult = userIdParamSchema.safeParse(request.params)
      if (!paramsResult.success) {
        reply.status(400).send({
          success: false,
          error: 'バリデーションエラーが発生しました',
          details: paramsResult.error.errors.map(err => ({
            field: err.path.join('.'),
            message: err.message
          }))
        })
        return
      }

      const { id } = paramsResult.data
      await this.userUseCase.deleteUser(id)
      
      reply.status(200).send({
        success: true,
        message: 'ユーザーが正常に削除されました'
      })
    } catch (error) {
      request.log.error(error)
      const errorMessage = error instanceof Error ? error.message : 'ユーザーの削除に失敗しました'
      const statusCode = errorMessage.includes('見つかりません') ? 404 : 400
      
      reply.status(statusCode).send({
        success: false,
        error: errorMessage
      })
    }
  }
} 