import Link from 'next/link'
import { Panel } from '@/components/Panel'
import { Users, HandHeart, Soup, Sparkles, Hammer } from 'lucide-react'

export const metadata = {
  title: 'Accueil — Collectif',
  description: 'Présentation du collectif, de notre projet, et de comment nous soutenir.',
  openGraph: {
    title: 'Accueil — Collectif',
    description: 'Qui sommes-nous, que faisons-nous, comment nous soutenir.',
  },
}

const activities = [
  {
    icon: '/icons/rencontre.png',
    title: 'Lieu de rencontre',
    desc: 'Des gens se rencontrent et partagent.',
  },
  {
    icon: '/icons/ASBL.png',
    title: "Lieu d'organisation de collectifs",
    desc: "Tout collectifs n'a pas le budget pour louer un lieu. Ce bâtiment permet un lieu pour leurs réunions et activités.",
  },
  {
    icon: '/icons/soupe.png',
    title: 'Cantine populaire',
    desc: 'Une cantine offre à certains moments des repas à prix libre.',
  },
  {
    icon: '/icons/atelier.png',
    title: 'Ateliers créatifs',
    desc: 'Espace ouvert pour la peinture, la musique et le bricolage collectif.',
  },
  {
    icon: '/icons/chantier.png',
    title: 'Chantier collectif',
    desc: 'Restauration du bâtiment par et pour ses occupants.',
  },
]

const groups = [
  { name: 'Groupe ingé', desc: 'Gestion des travaux — électricité, plomberie.' },
  { name: 'Groupe accueil', desc: 'Accueille les nouveaux et entretient le lieu.' },
  { name: 'Groupe cuisine', desc: 'Organise la cantine et les courses.' },
  { name: 'Groupe culture', desc: 'Concerts, expos, ateliers.' },
  { name: 'Groupe externe', desc: 'Liens avec voisins, presse, autorités.' },
]

export default function HomePage() {
  return (
    <>
      <Panel title="Qui sommes nous?">
        <div className="space-y-4 text-sm leading-relaxed">
          <p>
            Le CSA est un lieu qui regroupe des habitant·es, des militant·es et des collectifs. 
            Nous occupons un bâtiment qui était abandonné au cœur de Liège pour en faire un centre social autogéré, 
            ouvert à toutes celles et ceux qui veulent y participer.
          </p>
          <p>
            Notre démarche est horizontale et radicalement inclusive. 
            Chaque décision importante est prise en assemblée générale et chaque personne présente compte autant qu'une autre.
          </p>
        </div>
      </Panel>

      <section className="mx-auto flex max-w-2xl flex-col items-center justify-center gap-4 sm:flex-row">
        <video
          controls
          muted
          className="aspect-[3/4] w-full max-w-[400px] rounded-md shadow-md object-cover"
        >
          <source src="/media/presentation.mp4" type="video/mp4" />
        </video>
      </section>

      <Panel title="Que faisons-nous?">
        <div className="grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-5">
          {activities.map((a) => (
            <div key={a.title} className="flex flex-col items-center text-center">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-background text-foreground shadow-inner">
                <img
                  src={a.icon}
                  alt={a.title}
                  className="h-full w-full rounded-full object-cover"
                />
              </div>
              <h3 className="mt-4 font-semibold">{a.title}</h3>
              <p className="mt-2 text-xs leading-relaxed opacity-90">{a.desc}</p>
            </div>
          ))}
        </div>
      </Panel>

      <Panel title="Comment nous soutenir?">
        <div className="space-y-4 text-sm leading-relaxed">
          <p>
            Le plus précieux reste la présence — venez aux permanences, mangez à la cantine,
            participez à un atelier ou à une assemblée.
          </p>
          <p>
            Vous pouvez aussi donner du matériel, relayer nos communications, ou contribuer
            financièrement aux frais courants via la page Contact.
          </p>
        </div>
        <div className="flex justify-center pt-2">
            <Link
              href="/activites"
              className="rounded-full bg-accent/80 px-5 py-2 text-sm font-medium text-accent-foreground shadow hover:bg-accent"
            >
              Rejoindre un de nos projets →
            </Link>
        </div>
      </Panel>
    </>
  )
}
