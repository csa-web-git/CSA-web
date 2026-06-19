import Link from 'next/link'
import config from '@payload-config'
import { getPayload } from 'payload'

export const dynamic = 'force-dynamic'

export default async function ActivitesPage() {
  const payload = await getPayload({ config })

  const [{ docs: activitesCSA }, { docs: activitesPonctuelles }] = await Promise.all([
    payload.find({
      collection: 'activites-recurrentes',
      limit: 100,
      depth: 1,
    }),

    payload.find({
      collection: 'activites',
      where: {
        and: [
          {
            date: {
              greater_than_equal: new Date().toISOString(),
            },
          },
          {
            afficherActivitePonctuelle: {
              equals: true,
            },
          },
        ],
      },
      sort: 'date',
      limit: 20,
    }),
  ])

  return (
    <main className="mx-auto max-w-6xl p-6">
      <h1 className="mb-8 text-3xl font-bold text-foreground">Activités</h1>

      {/* SECTION : ACTIVITÉS PERMANENTES */}
      <section className="mb-12">
        <h2 className="mb-4 text-2xl font-semibold text-foreground">Activités permanentes</h2>

        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
          {activitesCSA.map((activite: any) => (
            <Link key={activite.id} href={`/activites/${activite.slug}`}>
              <article className="flex h-full flex-col overflow-hidden rounded-lg border border-border bg-card p-4 text-card-foreground hover:shadow-md transition-shadow">
                {/* Conteneur d'image avec aspect ratio fixe pour éviter les bandes noires */}
                <div className="relative mb-4 aspect-video w-full overflow-hidden rounded bg-muted">
                  {activite.miniAffiche?.url ? (
                    <img
                      src={activite.miniAffiche.url}
                      alt={activite.titre}
                      className="h-full w-full object-cover object-center"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-muted to-muted/50 text-muted-foreground opacity-60">
                      <span className="text-xs uppercase tracking-wider font-medium">
                        Permanente
                      </span>
                    </div>
                  )}
                </div>

                <h3 className="font-semibold text-card-foreground text-lg">{activite.titre}</h3>
                {activite.descriptionCourte && (
                  <p className="mt-2 text-sm text-card-foreground/80 line-clamp-3">
                    {activite.descriptionCourte}
                  </p>
                )}
              </article>
            </Link>
          ))}
        </div>
      </section>

      {/* SECTION : ACTIVITÉS PONCTUELLES À VENIR */}
      <section>
        <h2 className="mb-4 text-2xl font-semibold text-foreground">
          Activités ponctuelles à venir
        </h2>

        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
          {activitesPonctuelles.map((activite: any) => {
            const titreActivite = activite.titre ?? activite.nom ?? 'Activité ponctuelle'

            return (
              <Link key={activite.id} href={`/programme/${activite.slug}`}>
                <article className="flex h-full flex-col overflow-hidden rounded-lg border border-border bg-card p-4 text-card-foreground hover:shadow-md transition-shadow">
                  <div className="relative mb-4 aspect-video w-full overflow-hidden rounded bg-muted">
                    {activite.image?.url ? (
                      <div className="relative h-full w-full">
                        {/* 1. L'image de fond floutée pour boucher les trous */}
                        <img
                          src={activite.image.url}
                          alt=""
                          className="absolute inset-0 h-full w-full object-cover blur-md scale-110 brightness-50"
                        />
                        {/* 2. L'image principale au premier plan, entière et nette */}
                        <img
                          src={activite.image.url}
                          alt={titreActivite}
                          className="relative h-full w-full object-contain object-center"
                        />
                      </div>
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-zinc-900 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] opacity-70">
                        <span className="rounded bg-white/10 px-2.5 py-1 text-xs font-semibold text-white backdrop-blur-sm">
                          {activite.type ?? 'Événement'}
                        </span>
                      </div>
                    )}
                  </div>

                  <h3 className="font-semibold text-card-foreground text-lg">{titreActivite}</h3>

                  <p className="mt-1 text-xs font-medium text-primary">
                    {new Date(activite.date).toLocaleDateString('fr-BE', {
                      weekday: 'long',
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                    })}
                  </p>

                  {activite.descriptionCourte && (
                    <p className="mt-2 text-sm text-card-foreground/80 line-clamp-2">
                      {activite.descriptionCourte}
                    </p>
                  )}
                </article>
              </Link>
            )
          })}
        </div>
      </section>
    </main>
  )
}
