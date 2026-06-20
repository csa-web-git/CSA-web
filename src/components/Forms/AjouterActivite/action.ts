// src/app/(frontend)/actions/ajouter-activite.ts
'use server'

import { z } from 'zod'
import { getPayload } from 'payload'
import config from '@payload-config'

const Schema = z.object({
  titre: z.string().trim().min(1).max(200),
  date: z.string().trim().min(1).max(50),
  heureDebut: z.string().trim().min(1).max(20),
  heureFin: z.string().trim().min(1).max(20),
  lieu: z.string().trim().max(200).optional(),
  organisateurs: z.string().trim().min(1).max(200),
  description: z.string().trim().max(2000).optional(),
  website: z.string().max(0).optional(),
})

export type AjouterActiviteResult = { ok: true } | { ok: false; error: string }

export async function ajouterActivite(formData: FormData): Promise<AjouterActiviteResult> {
  const raw = Object.fromEntries(formData.entries())
  const parsed = Schema.safeParse(raw)
  if (!parsed.success) return { ok: false, error: 'Formulaire invalide.' }
  if (parsed.data.website) return { ok: false, error: 'Formulaire invalide.' }

  const d = parsed.data
  try {
    const payload = await getPayload({ config })
    await payload.create({
      collection: 'soumissions',
      data: {
        type: 'ajout-activite',
        statut: 'en-attente',
        donnees: {
          titre: d.titre,
          date: d.date,
          heureDebut: d.heureDebut,
          heureFin: d.heureFin,
          lieu: d.lieu ?? null,
          organisateurs: d.organisateurs,
          description: d.description ?? null,
        },
      },
    })
    return { ok: true }
  } catch (e) {
    console.error(e)
    return { ok: false, error: 'Enregistrement échoué.' }
  }
}