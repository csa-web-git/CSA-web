import { getPayload } from "payload"
import config from '@payload-config'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  const payload = await getPayload({ config })

  const data = await req.json()
console.log(data)
  const comment = await payload.create({
    collection: 'forum-comment',
    data: {
      post: data.postId,
      authorPseudo: String(data.authorPseudo),
      content: String(data.content),
    } as any,
  })

  return NextResponse.json(comment)
}