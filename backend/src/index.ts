import { buildApp } from './app'

const start = async () => {
  try {
    const app = await buildApp()
    
    const port = process.env.PORT ? parseInt(process.env.PORT) : 3000
    const host = process.env.HOST || 'localhost'
    
    await app.listen({ port, host })
    
    console.log(`🚀 Server running at http://${host}:${port}`)
  } catch (error) {
    console.error('Error starting server:', error)
    process.exit(1)
  }
}

start() 