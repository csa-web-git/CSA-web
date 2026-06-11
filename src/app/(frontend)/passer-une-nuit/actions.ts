'use server'

import { z } from 'zod'
import { sendMail } from '@/lib/send-mail'

const Schema = z.object({
  pseudo: z.string().trim().min(1).max(100),
  dateArrivee: z.string().trim().min(1).max(50),
  dateSortie: z.string().trim().min(1).max(50),
  nombre: z.coerce.number().int().min(1).max(50),
  message: z.string().trim().max(2000).optional(),
  website: z.string().max(0).optional(),
})

export type NuitResult = { ok: true } | { ok: false; error: string }

export async function passerUneNuit(formData: FormData): Promise<NuitResult> {
  const raw = Object.fromEntries(formData.entries())
  const parsed = Schema.safeParse(raw)
  if (!parsed.success) return { ok: false, error: 'Formulaire invalide.' }
  const d = parsed.data
  try {
    await sendMail({
      subject: `[Hébergement] ${d.pseudo} — ${d.dateArrivee} → ${d.dateSortie}`,
      text:
        `Pseudo : ${d.pseudo}\n` +
        `Date arrivée : ${d.dateArrivee}\n` +
        `Date sortie : ${d.dateSortie}\n` +
        `Personnes : ${d.nombre}\n\n` +
        `Message :\n${d.message ?? '-'}\n`,
    })
    return { ok: true }
  } catch (e) {
    console.error(e)
    return { ok: false, error: 'Envoi du mail échoué.' }
  }
}
