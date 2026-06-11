/**
 * Logique de calcul de semaine (lundi -> dimanche)
 * Indépendant de toute lib pour rester léger.
 */

export type WeekRange = {
  monday: Date // lundi 00:00:00
  sunday: Date // dimanche 23:59:59.999
  days: Date[] // 7 dates, lundi -> dimanche, à minuit
}

/** Renvoie le lundi de la semaine contenant `date`, à 00:00 local. */
export function getMonday(date: Date): Date {
  const d = new Date(date)
  d.setHours(0, 0, 0, 0)
  const day = d.getDay() // 0 = dimanche
  const diff = day === 0 ? -6 : 1 - day
  d.setDate(d.getDate() + diff)
  return d
}

export function getWeekRange(ref: Date, offset = 0): WeekRange {
  const monday = getMonday(ref)
  monday.setDate(monday.getDate() + offset * 7)

  const days: Date[] = []
  for (let i = 0; i < 7; i++) {
    const d = new Date(monday)
    d.setDate(monday.getDate() + i)
    days.push(d)
  }

  const sunday = new Date(days[6])
  sunday.setHours(23, 59, 59, 999)

  return { monday, sunday, days }
}

/** Format ISO court "2026-05-18" pour search params / URLs. */
export function toISODate(d: Date): string {
  const yyyy = d.getFullYear()
  const mm = String(d.getMonth() + 1).padStart(2, '0')
  const dd = String(d.getDate()).padStart(2, '0')
  return `${yyyy}-${mm}-${dd}`
}

export function fromISODate(s: string | undefined | null): Date {
  if (!s) return new Date()
  const [y, m, d] = s.split('-').map(Number)
  if (!y || !m || !d) return new Date()
  return new Date(y, m - 1, d)
}

/** Décale d'une semaine (string -> string). */
export function shiftWeek(iso: string, weeks: number): string {
  const d = fromISODate(iso)
  d.setDate(d.getDate() + weeks * 7)
  return toISODate(getMonday(d))
}

const FR_DAYS = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche']
const FR_MONTHS = [
  'janvier', 'février', 'mars', 'avril', 'mai', 'juin',
  'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre',
]

export function formatDayHeader(d: Date): { name: string; num: number; month: string } {
  return {
    name: FR_DAYS[(d.getDay() + 6) % 7],
    num: d.getDate(),
    month: FR_MONTHS[d.getMonth()],
  }
}

export function formatRange(range: WeekRange): string {
  const a = range.monday
  const b = range.days[6]
  const sameMonth = a.getMonth() === b.getMonth()
  if (sameMonth) {
    return `${a.getDate()} - ${b.getDate()} ${FR_MONTHS[a.getMonth()]} ${a.getFullYear()}`
  }
  return `${a.getDate()} ${FR_MONTHS[a.getMonth()]} - ${b.getDate()} ${FR_MONTHS[b.getMonth()]} ${b.getFullYear()}`
}
