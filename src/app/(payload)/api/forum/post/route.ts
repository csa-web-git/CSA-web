import { getPayload } from 'payload'
import config from '@payload-config'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  const payload = await getPayload({ config })

  const data = await req.json()

  const post = await payload.create({
    collection: 'forum-post',
    data: {
      title: String(data.title),
      authorPseudo: String(data.authorPseudo),
      content: String(data.content),
      type: Number(data.type),
    } as any,
  })

  return NextResponse.json(post)
}