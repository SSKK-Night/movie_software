import fastify, { FastifyInstance } from 'fastify'
import { PrismaClient } from '../generated/prisma'
import { userRoutes } from './routes/users'

// Prisma client
const prisma = new PrismaClient()

export const buildApp = async (): Promise<FastifyInstance> => {
  const app = fastify({
    logger: {
      level: process.env.LOG_LEVEL || 'info'
    }
  })

  // CORS設定
  await app.register(require('@fastify/cors'), {
    origin: process.env.CORS_ORIGIN || 'http://localhost:3001',
    credentials: true
  })

  // JWT設定
  await app.register(require('@fastify/jwt'), {
    secret: process.env.JWT_SECRET || 'your-secret-key'
  })

  // Prismaをapp.decorateに追加
  app.decorate('prisma', prisma)

  // ヘルスチェック
  app.get('/health', async (request, reply) => {
    return { status: 'OK', timestamp: new Date().toISOString() }
  })

  // APIルート
  app.get('/', async (request, reply) => {
    return { message: 'Movie Software API is running!' }
  })

  // ユーザールートを登録
  await app.register(userRoutes, { prefix: '/api' })

  return app
}

declare module 'fastify' {
  interface FastifyInstance {
    prisma: PrismaClient
  }
} 