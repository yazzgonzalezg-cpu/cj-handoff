import { Redis } from '@upstash/redis'

const redis = Redis.fromEnv()

export async function GET() {
  const data = await redis.get('cj-handoff')
  return Response.json(data || {})
}

export async function POST(req) {
  const body = await req.json()
  await redis.set('cj-handoff', body)
  return Response.json({ ok: true })
}
