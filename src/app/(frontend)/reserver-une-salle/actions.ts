'use server'

import { z } from 'zod'
import { sendMail } from '@/lib/send-mail'

const Schema = z.object({
  pseudo: z.string().trim().min(1).max(100),
  organisation: z.string().trim().max(200).optional(),
  salle: z.string().trim().max(200).optional(),
  date: z.string().trim().min(1).max(50),
  nombre: z.coerce.number().int().min(1).max(1000),
  message: z.string().trim().max(2000).optional(),
  website: z.string().max(0).optional(), // honeypot
})

export type ReservationResult = { ok: true } | { ok: false; error: string }

export async function reserverSalle(formData: FormData): Promise<ReservationResult> {
  const raw = Object.fromEntries(formData.entries())
  const parsed = Schema.safeParse(raw)
  if (!parsed.success) {
    return { ok: false, error: 'Formulaire invalide.' }
  }
  const d = parsed.data
  try {
    await sendMail({
      subject: `[Réservation salle] ${d.pseudo} — ${d.date}`,
      text:
        `Pseudo : ${d.pseudo}\n` +
        `Organisation : ${d.organisation ?? '-'}\n` +
        `Salle souhaitée : ${d.salle ?? '-'}\n` +
        `Date : ${d.date}\n` +
        `Personnes estimées : ${d.nombre}\n\n` +
        `Message :\n${d.message ?? '-'}\n`,
    })
    return { ok: true }
  } catch (e) {
    console.error(e)
    return { ok: false, error: 'Envoi du mail échoué.' }
  }
}
