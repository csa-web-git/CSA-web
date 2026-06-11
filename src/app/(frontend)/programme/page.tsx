import { getPayload } from 'payload'
import config from '@payload-config'
import { ProgrammeClient } from './ProgrammeClient'
import { getMonday, getWeekRange, fromISODate, toISODate } from '@/lib/week'
import type { Activite, Category } from '@/payload-types'

export const dynamic = 'force-dynamic'

export default async function ProgrammePage({
  searchParams,
}: {
  searchParams: Promise<{ week?: string }>
}) {
  const { week } = await searchParams
  const base = fromISODate(week)

  // getWeekRange calcule déjà lundi + dimanche correctement
  const { monday: start, sunday: end } = getWeekRange(base)

  const payload = await getPayload({ config })

  const [{ docs: activites }, { docs: categories }] = await Promise.all([
    payload.find({
      collection: 'activites',
      where: {
        date: {
          greater_than_equal: start.toISOString(),
          less_than_equal: end.toISOString(),
        },
      },
      limit: 200,
      sort: ['date', 'heureDebut'],
      depth: 2,
    }),
    payload.find({
      collection: 'categories',
      limit: 50,
    }),
  ])

  return (
    <section className="mx-auto w-full max-w-6xl rounded-md bg-card text-card-foreground px-8 py-8 shadow-md">
      <ProgrammeClient
        weekISO={toISODate(start)}
        activites={activites as Activite[]}
        categories={categories as Category[]}
      />
    </section>
  )
}
