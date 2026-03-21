import { PrismaClient } from '../generated/prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import { Pool } from 'pg'

const globalForPrisma = globalThis as typeof globalThis & {
  __tangredPrisma?: PrismaClient
}

function createPrismaClient() {
  const url = process.env.DATABASE_URL
  if (!url) {
    throw new Error('DATABASE_URL environment variable is not set')
  }
  const pool = new Pool({ connectionString: url })
  const adapter = new PrismaPg(pool)
  return new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
  })
}

export function getPrismaClient() {
  if (!globalForPrisma.__tangredPrisma) {
    globalForPrisma.__tangredPrisma = createPrismaClient()
  }

  return globalForPrisma.__tangredPrisma
}

export const prisma = new Proxy({} as PrismaClient, {
  get(_target, property, receiver) {
    const client = getPrismaClient()
    return Reflect.get(client, property, receiver)
  },
})
