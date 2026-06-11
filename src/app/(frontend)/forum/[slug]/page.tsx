import config from '@payload-config'
import { getPayload } from 'payload'
import { notFound } from 'next/navigation'
import { VoteButtons } from '@/components/forum/LikeButtons'
import { CreateCommentForm } from '@/components/forum/CreateCommentForm'

type Props = {
  params: Promise<{
    slug: string
  }>
}

export default async function ForumPostPage({
  params,
}: Props) {
  const { slug } = await params

  const payload = await getPayload({
    config,
  })

  const result = await payload.find({
    collection: 'forum-post',
    where: {
      slug: {
        equals: slug,
      },
    },
  })

  const post = result.docs[0]

  if (!post) {
    notFound()
  }

  const { docs: comments } = await payload.find({
    collection: 'forum-comment',
    where: {
      post: {
        equals: post.id,
      },
    },
    limit: 200,
  })

  return (
    <main className="mx-auto max-w-4xl p-6">
      <article className="rounded-lg border p-6 bg-card text-card-foreground">
        <h1 className="text-3xl font-bold">
          {post.title}
        </h1>

        <p className="mt-2 text-sm">
          Par {post.authorPseudo}
        </p>

        <div className="mt-4 whitespace-pre-wrap">
          {post.content}
        </div>

        <div className="mt-4">
            <VoteButtons
                entityId={post.id}
                entityType="post"
                initialLikes={post.likes!}
                initialDislikes={post.dislikes!}
            />
        </div>
      </article>

      <section className="pace-y-3 text-sm leading-relaxed">
        <h2 className="mb-4 text-xl font-semibold">
          Commentaires
        </h2>

        <div className="space-y-4 bg-card text-card-foreground">
            <CreateCommentForm
                postId={post.id}
            />
          {comments.map((comment: any) => (
            <div
              key={comment.id}
              className="rounded-lg border p-4"
            >
              <p className="font-medium">
                {comment.authorPseudo}
              </p>

              <p className="mt-2 whitespace-pre-wrap">
                {comment.content}
              </p>

              <VoteButtons
                  entityId={comment.id}
                  entityType="comment"
                  initialLikes={comment.likes}
                  initialDislikes={comment.dislikes}
              />
            </div>
          ))}
        </div>
      </section>
    </main>
  )
}