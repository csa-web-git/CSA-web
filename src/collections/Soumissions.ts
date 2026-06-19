// src/collections/Soumissions.ts
import type { CollectionConfig } from 'payload'

export const Soumissions: CollectionConfig = {
  slug: 'soumissions',
  labels: { singular: 'Soumission', plural: 'Soumissions' },

  admin: {
    useAsTitle: 'type',
    defaultColumns: ['type', 'statut', 'createdAt'],
    description: 'Soumissions des formulaires du site, à valider ou refuser.',
  },

  access: {
    read: ({ req }) => Boolean(req.user), // visible uniquement aux admins connectés
    create: () => true, // les formulaires publics peuvent créer une soumission
    update: ({ req }) => Boolean(req.user),
    delete: ({ req }) => Boolean(req.user),
  },

  fields: [
    {
      name: 'type',
      type: 'select',
      required: true,
      options: [
        { label: 'Réserver une salle', value: 'reservation-salle' },
        { label: 'Passer une nuit',    value: 'passer-nuit' },
        { label: 'Contact',            value: 'contact' },
      ],
    },
    {
      name: 'statut',
      type: 'select',
      required: true,
      defaultValue: 'en-attente',
      options: [
        { label: 'En attente', value: 'en-attente' },
        { label: 'Validée',    value: 'validee'    },
        { label: 'Refusée',    value: 'refusee'     },
      ],
    },
    {
      name: 'donnees',
      type: 'json',
      label: 'Données du formulaire',
      admin: {
        description: 'Contenu brut soumis par le formulaire.',
      },
    },
  ],
}