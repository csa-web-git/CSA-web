import { revalidatePath } from 'next/cache'
import type { CollectionConfig } from 'payload'

const slugify = (s: string) =>
  s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '')

export const ForumComment: CollectionConfig = {
  slug: 'forum-comment',
  admin: {
    useAsTitle: 'authorPseudo',
    defaultColumns: ['content', 'authorPseudo', 'date'],
    description: 'Commentaire sur un post du forum',
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
    ]
  },
  versions: {
    drafts: false,
  },
  access: {
    read: () => true,
  },
  fields: [
    {name:'post', type:'relationship', relationTo:'forum-post', required:true},
    { name: 'content', type: 'text', required: true },
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
    },
    { name: 'likes', type: 'number', defaultValue:0},
    { name: 'dislikes', type: 'number', defaultValue:0},
  ],
}
