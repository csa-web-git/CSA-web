import Link from 'next/link'
import config from '@payload-config'
import { getPayload } from 'payload'
import { VoteButtons } from '@/components/forum/LikeButtons'
import { ForumNewPostButton } from '@/components/forum/FormNewPostButton'

export default async function ForumPage() {
  const payload = await getPayload({ config })

  const { docs: posts } = await payload.find({
    collection: 'forum-post',
    sort: '-createdAt',
    limit: 100,
  })

  const { docs: forumTypes } = await payload.find({
    collection: 'forum-type',
    sort: 'name',
  })

  return (
    <main className="mx-auto max-w-5xl p-6">
      <h1 className="mb-6 text-3xl font-bold">
        Forum
      </h1>

      <div className="space-y-4">
        <ForumNewPostButton forumTypes={forumTypes}/>
        {posts.map((post: any) => (
          <Link
            key={post.id}
            href={`/forum/${post.slug}`}
          >
            <article className="rounded-lg border p-4 bg-card text-card-foreground hover:opacity-90">
              <div className="flex items-center justify-between">
                <h2 className="font-semibold">
                  {post.title}
                </h2>

                <span className="rounded px-2 py-1 text-xs font-medium text-white" style={{ backgroundColor: post.type?.couleur || '#e5e7eb' }}>
                  {post.type.name}
                </span>
              </div>

              <p className="mt-2 text-sm">
                Par {post.authorPseudo}
              </p>

              <p className="mt-3 line-clamp-2">
                {post.content}
              </p>

              
              <VoteButtons
                  entityId={post.id}
                  entityType="post"
                  initialLikes={post.likes}
                  initialDislikes={post.dislikes}
              />
            </article>
          </Link>
        ))}
      </div>
    </main>
  )
}