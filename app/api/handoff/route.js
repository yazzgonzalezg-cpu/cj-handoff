import { kv } from '@vercel/kv'

export async function GET() {
const data = await kv.get('cj-handoff')
return Response.json(data || {})
}

export async function POST(req) {
const body = await req.json()
await kv.set('cj-handoff', body)
return Response.json({ ok: true })
}