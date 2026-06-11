import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'

export async function POST(req: Request) {
  const payload = await getPayload({ config })

  const {
    entityType,
    entityId,
    voteType,
    cancel
  } = await req.json()

  const collection =
    entityType === 'post'
      ? 'forum-post'
      : 'forum-comment'

  const doc = await payload.findByID({
    collection,
    id: entityId,
  })

  if (!doc) {
    return NextResponse.json(
      { error: 'Not found' },
      { status: 404 },
    )
  }

  const field = voteType === 'like' ? 'likes' : 'dislikes'

  await payload.update({
    collection,
    id: entityId,
    data: {
      [field]: Math.max(0, (doc[field] ?? 0) + (cancel ? -1 : 1)),
    },
  })

  return NextResponse.json({
    success: true,
  })
}