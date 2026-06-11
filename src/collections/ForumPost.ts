import { revalidatePath } from 'next/cache'
import type { CollectionConfig } from 'payload'

function slugify(text: string) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
}

export const ForumPost: CollectionConfig = {
  slug: 'forum-post',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title','content', 'authorPseudo', 'date'],
    description: 'Post du forum',
  },
  versions: {
    drafts: false,
  },
  hooks: {
    beforeValidate: [
      ({ data }) => {
        if (data?.title) {
          data.slug = slugify(data.title)
        }
        return data
      },
    ],
    afterChange: [
      ({ doc }) => {
        revalidatePath('/forum')
        revalidatePath(`/forum/${doc.slug ?? doc.id}`)
      },
    ],
    beforeDelete: [
    async ({ id, req }) => {
        await req.payload.delete({
          collection: 'forum-comment',
          where: {
            post: { equals: id },
          },
        })
      },
    ],
  },
  access: {
    read: () => true,
  },
  fields: [
    { name: 'title', type: 'text', required: true },
    { name: 'content', type: 'text', required: true },
    {
      name: 'slug',
      type: 'text',
      unique: true,
      index: true,
      admin: { hidden:true, readOnly:true},
    },
    {
      name: 'type',
      type: 'relationship',
      relationTo: 'forum-type'
    },
    { name: 'likes', type: 'number', defaultValue:0},
    { name: 'dislikes', type: 'number', defaultValue:0},
    {
      name: 'date',
      type: 'date',
      required: true,
      defaultValue: () => new Date().toISOString(),
      admin: { date: { pickerAppearance: 'dayOnly', displayFormat: 'HH:mm dd/MM' } },//TODO: date format
    },
    {
      name: 'authorPseudo',
      type: 'text',
      admin: { description: 'Pseudo Signal de l auteur' },
      required:true,
    },
  ],
}
