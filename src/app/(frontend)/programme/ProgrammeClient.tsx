'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useMemo, useTransition } from 'react'
import type { Activite, Category } from '@/payload-types'
import { formatDayHeader, formatRange, getWeekRange, shiftWeek } from '@/lib/week'
import { Legende } from '@/components/Legende'

type Props = {
  weekISO: string
  activites: Activite[]
  categories: Category[]
}

function formatHeure(dateString: string) {
  return new Date(dateString).toLocaleTimeString('fr-BE', {
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function ProgrammeClient({ weekISO, activites, categories }: Props) {
  const router = useRouter()
  const [pending, startTransition] = useTransition()

  const range = useMemo(() => getWeekRange(new Date(weekISO)), [weekISO])

  const byDay = useMemo(() => {
    const map: Record<number, Activite[]> = {
      0: [],
      1: [],
      2: [],
      3: [],
      4: [],
      5: [],
      6: [],
    }

    for (const a of activites) {
      const d = new Date(a.date)
      const idx = (d.getDay() + 6) % 7
      map[idx].push(a)
    }

    for (const day of Object.values(map)) {
      day.sort((a, b) => {
        return (
          new Date(a.heureDebut).getTime() -
          new Date(b.heureDebut).getTime()
        )
      })
    }

    return map
  }, [activites])

  const go = (delta: number) => {
    const next = shiftWeek(weekISO, delta)

    startTransition(() => {
      router.push(`/programme?week=${next}`, {
        scroll: false,
      })
    })
  }

  return (
    <section className="mx-auto w-full max-w-6xl rounded-3xl bg-card p-4 text-card-foreground shadow-xl md:p-8">
      {/* Header semaine */}
      <header className="mb-6 flex flex-col items-center gap-3 md:flex-row md:justify-center md:gap-6">
        <button
          onClick={() => go(-1)}
          disabled={pending}
          className="rounded-full bg-header/80 px-4 py-2 text-sm font-medium text-header-foreground shadow transition hover:bg-header disabled:opacity-50"
        >
          ← Semaine précédente
        </button>

        <h2 className="text-center text-lg font-bold capitalize">
          {formatRange(range)}
        </h2>

        <button
          onClick={() => go(1)}
          disabled={pending}
          className="rounded-full bg-header/80 px-4 py-2 text-sm font-medium text-header-foreground shadow transition hover:bg-header disabled:opacity-50"
        >
          Semaine suivante →
        </button>
      </header>

      {/* ========================= */}
      {/* MOBILE */}
      {/* ========================= */}

      <div className="space-y-4 md:hidden">
        {range.days.map((d, idx) => {
          const h = formatDayHeader(d)

          return (
            <div
              key={d.toISOString()}
              className="rounded-xl border border-card-foreground/20 p-3"
            >
              <h3 className="mb-3 text-lg font-semibold">
                {h.name} {h.num} {h.month}
              </h3>

              {byDay[idx].length === 0 ? (
                <p className="text-sm opacity-50">
                  Aucune activité
                </p>
              ) : (
                <div className="space-y-2">
                  {byDay[idx].map((a) => {
                    const cat =
                      typeof a.categorie === 'object' &&
                      a.categorie !== null
                        ? (a.categorie as Category)
                        : null

                    const bg = cat?.couleur ?? '#cccccc'

                    return (
                      <Link
                        key={a.id}
                        href={`/activites/${a.slug}`}
                        className="block rounded-xl p-3 text-sm shadow"
                        style={{ backgroundColor: bg }}
                      >
                        <div className="font-semibold">
                          {a.titre}
                        </div>

                        <div>
                          {formatHeure(a.heureDebut)} - {formatHeure(a.heureFin)}
                        </div>

                        <div>{a.lieu}</div>

                        <div className="opacity-80">
                          contact "{a.organisateurs}"
                        </div>
                      </Link>
                    )
                  })}
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* ========================= */}
      {/* DESKTOP */}
      {/* ========================= */}

      <div className="hidden md:block">
        {/* En-têtes jours */}
        <div className="grid grid-cols-7 gap-x-2 border-b border-card-foreground/40 pb-2">
          {range.days.map((d) => {
            const h = formatDayHeader(d)

            return (
              <div
                key={d.toISOString()}
                className="text-center text-sm font-semibold"
              >
                <div>{h.name}</div>

                <div className="text-xs opacity-70">
                  {h.num} {h.month}
                </div>
              </div>
            )
          })}
        </div>

        {/* Planning desktop */}
        <div className="grid min-h-[420px] grid-cols-7 gap-x-2 pt-4">
          {range.days.map((d, idx) => (
            <div
              key={d.toISOString()}
              className="space-y-3 border-r border-dashed border-card-foreground/40 pr-2 last:border-r-0"
            >
              {byDay[idx].map((a) => {
                const cat =
                  typeof a.categorie === 'object' &&
                  a.categorie !== null
                    ? (a.categorie as Category)
                    : null

                const bg = cat?.couleur ?? '#cccccc'

                return (
                  <Link
                    key={a.id}
                    href={`/activites/${a.slug}`}
                    className="block w-full rounded-2xl px-2 py-2 text-left text-[11px] shadow transition hover:-translate-y-0.5 hover:shadow-md"
                    style={{ backgroundColor: bg }}
                  >
                    <div className="font-semibold">
                      {a.titre}
                    </div>

                    <div>
                      {formatHeure(a.heureDebut)} - {formatHeure(a.heureFin)}
                    </div>

                    <div>{a.lieu}</div>

                    <div>
                      contact "{a.organisateurs}"
                    </div>
                  </Link>
                )
              })}
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6 flex justify-center md:justify-end">
        <Legende categories={categories} />
      </div>
    </section>
  )
}