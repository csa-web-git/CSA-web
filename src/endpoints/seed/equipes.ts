import type { Payload, PayloadRequest } from 'payload'
import path from 'path'
import fs from 'fs'

const EQUIPES = [
  {
    nom: 'Groupe ingé',
    slug: 'groupe-inge',
    descriptionCourte: 'Gestion des travaux - ect',
    ordre: 1,
    iconFileName: 'inge.png',
    iconAlt: 'Icône groupe ingé',
  },
  {
    nom: 'Groupe Fonctionnement',
    slug: 'groupe-fonctionnement',
    descriptionCourte: 'Organisation des différentes équipes',
    ordre: 2,
    iconFileName: 'fonctionnement.png',
    iconAlt: 'Icône groupe fonctionnement',
  },
  {
    nom: 'Groupe Nourriture',
    slug: 'groupe-nourriture',
    descriptionCourte: 'Gestion de la nourriture et cuisine',
    ordre: 3,
    iconFileName: 'nourriture.png',
    iconAlt: 'Icône groupe nourriture',
  },
  {
    nom: 'Groupe Communication',
    slug: 'groupe-communication',
    descriptionCourte: 'Communication extérieur (réseaux, site web)',
    ordre: 4,
    iconFileName: 'communication.png',
    iconAlt: 'Icône groupe communication',
  },
  {
    nom: 'Groupe activités',
    slug: 'groupe-activites',
    descriptionCourte: 'Gestion des salles et des activités',
    ordre: 5,
    iconFileName: 'activite.png',
    iconAlt: 'Icône groupe activités',
  },
]

export async function seedEquipes(payload: Payload, req: PayloadRequest) {
  payload.logger.info('— Seeding équipes depuis les fichiers locaux...')

  for (const equipe of EQUIPES) {
    let mediaId: string | number | null = null
    const fileName = equipe.iconFileName // 👈 On utilise la nouvelle propriété de ton tableau

    try {
      // 1. VERIFICATION : Est-ce que ce fichier existe déjà dans la collection media ?
      const existingMedia = await payload.find({
        collection: 'media',
        where: {
          filename: {
            equals: fileName,
          },
        },
        limit: 1,
      })

      if (existingMedia.docs.length > 0) {
        // Le fichier existe déjà sur Vercel Blob et dans Payload ! On réutilise son ID
        payload.logger.info(`L'icône ${fileName} existe déjà, utilisation de l'existant.`)
        mediaId = existingMedia.docs[0].id
      } else {
        // 2.process.cwd() donne la racine de le projet
        const filePath = path.join(process.cwd(), 'public', 'media', fileName)

        if (fs.existsSync(filePath)) {
          const fileBuffer = fs.readFileSync(filePath)

          // 3. UPLOAD : On pousse le buffer local vers Payload (qui l'envoie sur Vercel Blob)
          const media = await payload.create({
            collection: 'media',
            data: { alt: equipe.iconAlt },
            file: {
              data: fileBuffer,
              name: fileName,
              size: fileBuffer.length,
              mimetype: 'image/png',
            },
            overwriteExistingFiles: true
          })
          mediaId = media.id
        } else {
          payload.logger.error(`Fichier introuvable sur le disque : ${filePath}`)
        }
      }
    } catch (error) {
      payload.logger.error(`Erreur média pour ${equipe.nom}:`)
    }

    // 4. Création de l'équipe (liaison avec le mediaId trouvé ou créé)
    await payload.create({
      collection: 'equipes',
      data: {
        nom: equipe.nom,
        slug: equipe.slug,
        descriptionCourte: equipe.descriptionCourte,
        ordre: equipe.ordre,
        ...(mediaId ? { image: mediaId } : {}),
      },
    })
  }
}