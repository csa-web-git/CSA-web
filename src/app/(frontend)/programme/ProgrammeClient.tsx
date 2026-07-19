'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useMemo, useTransition } from 'react'
import type { Activite, Category } from '@/payload-types'
import {
  formatDayHeader,
  formatRange,
  formatMonthHeader,
  getWeekRange,
  getMonthWeeks,
  shiftWeek,
  shiftMonth,
  toISODate,
  toISOMonth,
  fromISODate,
  FR_MONTHS,
} from '@/lib/week'
import { Legende } from '@/components/Legende'

type Props = {
  vue: 'semaine' | 'mois'
  weekISO: string
  monthISO: string
  activites: Activite[]
  categories: Category[]
}

function formatHeure(dateString: string) {
  return new Date(dateString).toLocaleTimeString('fr-BE', {
    timeZone: 'UTC',
    hour: '2-digit',
    minute: '2-digit',
  })
}

function getContrastColor(hex: string) {
  const color = hex.replace('#', '')
  const r = parseInt(color.substring(0, 2), 16)
  const g = parseInt(color.substring(2, 4), 16)
  const b = parseInt(color.substring(4, 6), 16)
  const luminance = 0.299 * r + 0.587 * g + 0.114 * b
  return luminance > 160 ? '#111111' : '#FFFFFF'
}

function getSecondaryTextColor(hex: string) {
  const color = hex.replace('#', '')
  const r = parseInt(color.substring(0, 2), 16)
  const g = parseInt(color.substring(2, 4), 16)
  const b = parseInt(color.substring(4, 6), 16)
  const luminance = 0.299 * r + 0.587 * g + 0.114 * b
  return luminance > 160 ? 'rgba(0,0,0,0.65)' : 'rgba(255,255,255,0.75)'
}

// Card d'activité réutilisée dans les deux vues
function ActiviteCard({ a, compact = false }: { a: Activite; compact?: boolean }) {
  const cat =
    typeof a.categorie === 'object' && a.categorie !== null ? (a.categorie as Category) : null
  const bg = cat?.couleur ?? '#cccccc'
  const textColor = getContrastColor(bg)
  const secondaryColor = getSecondaryTextColor(bg)

  return (
    <Link
      href={`/programme/${a.slug}`}
      className="block w-full rounded-2xl shadow transition hover:-translate-y-0.5 hover:shadow-lg"
      style={{
        backgroundColor: bg,
        color: textColor,
        border: '1px solid rgba(0,0,0,0.08)',
        padding: compact ? '4px 8px' : '12px',
      }}
    >
      <div className={`font-semibold ${compact ? 'text-xs truncate' : 'mb-1'}`} style={{ color: textColor }}>
        {a.titre}
      </div>
      {!compact && (
        <div style={{ color: secondaryColor }}>
          {formatHeure(a.heureDebut)} - {formatHeure(a.heureFin)}
        </div>
      )}
    </Link>
  )
}

export function ProgrammeClient({ vue, weekISO, monthISO, activites, categories }: Props) {
  const router = useRouter()
  const [pending, startTransition] = useTransition()

  // ── Index par jour de semaine (vue semaine) ──────────────────────────────
  const range = useMemo(() => getWeekRange(fromISODate(weekISO)), [weekISO])

  const byDay = useMemo(() => {
    const map: Record<number, Activite[]> = { 0: [], 1: [], 2: [], 3: [], 4: [], 5: [], 6: [] }
    for (const a of activites) {
      const d = new Date(a.date)
      const idx = (d.getDay() + 6) % 7
      map[idx].push(a)
    }
    for (const day of Object.values(map)) {
      day.sort((a, b) => new Date(a.heureDebut).getTime() - new Date(b.heureDebut).getTime())
    }
    return map
  }, [activites])

  // ── Index par date ISO (vue mois) ────────────────────────────────────────
  const byDate = useMemo(() => {
    const map: Record<string, Activite[]> = {}
    for (const a of activites) {
      const key = a.date.substring(0, 10)
      if (!map[key]) map[key] = []
      map[key].push(a)
    }
    for (const day of Object.values(map)) {
      day.sort((a, b) => new Date(a.heureDebut).getTime() - new Date(b.heureDebut).getTime())
    }
    return map
  }, [activites])

  const monthWeeks = useMemo(
    () => (vue === 'mois' ? getMonthWeeks(monthISO) : []),
    [vue, monthISO],
  )

  const [monthYear, monthNum] = monthISO.split('-').map(Number)
  const isInMonth = (d: Date) => d.getFullYear() === monthYear && d.getMonth() === monthNum - 1

  // ── Navigation ───────────────────────────────────────────────────────────
  const goWeek = (delta: number) => {
    startTransition(() => {
      router.push(`/programme?week=${shiftWeek(weekISO, delta)}`, { scroll: false })
    })
  }

  const goMonth = (delta: number) => {
    startTransition(() => {
      router.push(`/programme?vue=mois&month=${shiftMonth(monthISO, delta)}`, { scroll: false })
    })
  }

  const switchVue = (next: 'semaine' | 'mois') => {
    startTransition(() => {
      if (next === 'mois') {
        router.push(`/programme?vue=mois&month=${monthISO}`, { scroll: false })
      } else {
        router.push(`/programme?week=${weekISO}`, { scroll: false })
      }
    })
  }

  const FR_DAYS_SHORT = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim']

  return (
    <div className="mx-auto w-full max-w-6xl rounded-3xl bg-card p-4 text-card-foreground shadow-xl md:p-8">

      {/* ── Toggle vue ──────────────────────────────────────────────────── */}
      <div className="mb-4 flex justify-center gap-2">
        <button
          onClick={() => switchVue('semaine')}
          disabled={pending}
          className={`rounded-full px-5 py-1.5 text-sm font-medium transition ${
            vue === 'semaine'
              ? 'bg-header text-header-foreground shadow'
              : 'bg-header/30 text-card-foreground hover:bg-header/50'
          }`}
        >
          Semaine
        </button>
        <button
          onClick={() => switchVue('mois')}
          disabled={pending}
          className={`rounded-full px-5 py-1.5 text-sm font-medium transition ${
            vue === 'mois'
              ? 'bg-header text-header-foreground shadow'
              : 'bg-header/30 text-card-foreground hover:bg-header/50'
          }`}
        >
          Mois
        </button>
      </div>

      {/* ── Header navigation ───────────────────────────────────────────── */}
      <header className="mb-6 flex flex-col items-center gap-3 md:flex-row md:justify-center md:gap-6">
        {vue === 'semaine' ? (
          <>
            <button
              onClick={() => goWeek(-1)}
              disabled={pending}
              className="rounded-full bg-header/80 px-4 py-2 text-sm font-medium text-header-foreground shadow transition hover:bg-header disabled:opacity-50"
            >
              ← Semaine précédente
            </button>
            <h2 className="text-center text-lg font-bold capitalize">{formatRange(range)}</h2>
            <button
              onClick={() => goWeek(1)}
              disabled={pending}
              className="rounded-full bg-header/80 px-4 py-2 text-sm font-medium text-header-foreground shadow transition hover:bg-header disabled:opacity-50"
            >
              Semaine suivante →
            </button>
          </>
        ) : (
          <>
            <button
              onClick={() => goMonth(-1)}
              disabled={pending}
              className="rounded-full bg-header/80 px-4 py-2 text-sm font-medium text-header-foreground shadow transition hover:bg-header disabled:opacity-50"
            >
              ← Mois précédent
            </button>
            <h2 className="text-center text-lg font-bold capitalize">
              {formatMonthHeader(monthISO)}
            </h2>
            <button
              onClick={() => goMonth(1)}
              disabled={pending}
              className="rounded-full bg-header/80 px-4 py-2 text-sm font-medium text-header-foreground shadow transition hover:bg-header disabled:opacity-50"
            >
              Mois suivant →
            </button>
          </>
        )}
      </header>

      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/* VUE SEMAINE — MOBILE                                               */}
      {/* ═══════════════════════════════════════════════════════════════════ */}
      {vue === 'semaine' && (
        <div className="space-y-4 md:hidden">
          {range.days.map((d, idx) => {
            const h = formatDayHeader(d)
            return (
              <div key={d.toISOString()} className="rounded-xl border border-card-foreground/20 p-3">
                <h3 className="mb-3 text-lg font-semibold">
                  {h.name} {h.num} {h.month}
                </h3>
                {byDay[idx].length === 0 ? (
                  <p className="text-sm opacity-50">Aucune activité</p>
                ) : (
                  <div className="space-y-2">
                    {byDay[idx].map((a) => <ActiviteCard key={a.id} a={a} />)}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/* VUE SEMAINE — DESKTOP                                              */}
      {/* ═══════════════════════════════════════════════════════════════════ */}
      {vue === 'semaine' && (
        <div className="hidden md:block">
          <div className="grid grid-cols-7 gap-x-2 border-b border-card-foreground/40 pb-2">
            {range.days.map((d) => {
              const h = formatDayHeader(d)
              return (
                <div key={d.toISOString()} className="text-center text-sm font-semibold">
                  <div>{h.name}</div>
                  <div className="text-xs opacity-70">{h.num} {h.month}</div>
                </div>
              )
            })}
          </div>
          <div className="grid min-h-[420px] grid-cols-7 gap-x-2 pt-4">
            {range.days.map((d, idx) => (
              <div
                key={d.toISOString()}
                className="space-y-3 border-r border-dashed border-card-foreground/40 pr-2 last:border-r-0"
              >
                {byDay[idx].map((a) => <ActiviteCard key={a.id} a={a} />)}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/* VUE MOIS — MOBILE (liste scrollable par semaine, option B)         */}
      {/* ═══════════════════════════════════════════════════════════════════ */}
      {vue === 'mois' && (
        <div className="space-y-6 md:hidden">
          {monthWeeks.map((week, wi) => {
            const daysInMonth = week.filter(isInMonth)
            if (daysInMonth.length === 0) return null
            const firstDay = daysInMonth[0]
            const lastDay = daysInMonth[daysInMonth.length - 1]
            const h1 = formatDayHeader(firstDay)
            const h2 = formatDayHeader(lastDay)
            return (
              <div key={wi}>
                {/* Séparateur de semaine */}
                <div className="mb-3 flex items-center gap-2">
                  <div className="h-px flex-1 bg-card-foreground/20" />
                  <span className="text-xs font-semibold uppercase tracking-wide opacity-50">
                    {h1.num} {h1.month} – {h2.num} {h2.month}
                  </span>
                  <div className="h-px flex-1 bg-card-foreground/20" />
                </div>
                <div className="space-y-4">
                  {daysInMonth.map((d) => {
                    const key = toISODate(d)
                    const h = formatDayHeader(d)
                    const acts = byDate[key] ?? []
                    return (
                      <div key={key} className="rounded-xl border border-card-foreground/20 p-3">
                        <h3 className="mb-3 text-lg font-semibold">
                          {h.name} {h.num} {h.month}
                        </h3>
                        {acts.length === 0 ? (
                          <p className="text-sm opacity-50">Aucune activité</p>
                        ) : (
                          <div className="space-y-2">
                            {acts.map((a) => <ActiviteCard key={a.id} a={a} />)}
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/* VUE MOIS — DESKTOP (grille calendrier)                             */}
      {/* ═══════════════════════════════════════════════════════════════════ */}
      {vue === 'mois' && (
        <div className="hidden md:block">
          {/* En-têtes jours */}
          <div className="mb-1 grid grid-cols-7 gap-1">
            {FR_DAYS_SHORT.map((name) => (
              <div key={name} className="py-1 text-center text-xs font-semibold uppercase tracking-wide opacity-60">
                {name}
              </div>
            ))}
          </div>
          {/* Semaines */}
          <div className="space-y-1">
            {monthWeeks.map((week, wi) => (
              <div key={wi} className="grid grid-cols-7 gap-1">
                {week.map((d) => {
                  const key = toISODate(d)
                  const acts = byDate[key] ?? []
                  const inMonth = isInMonth(d)
                  return (
                    <div
                      key={key}
                      className={`min-h-[90px] rounded-lg border p-1 ${
                        inMonth
                          ? 'border-card-foreground/20 bg-card-foreground/5'
                          : 'border-transparent opacity-30'
                      }`}
                    >
                      <div className={`mb-1 text-right text-xs font-semibold ${inMonth ? '' : 'opacity-40'}`}>
                        {d.getDate()}
                      </div>
                      <div className="space-y-0.5">
                        {acts.map((a) => <ActiviteCard key={a.id} a={a} compact />)}
                      </div>
                    </div>
                  )
                })}
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="mt-6 flex justify-center md:justify-end">
        <Legende categories={categories} />
      </div>
    </div>
  )
}