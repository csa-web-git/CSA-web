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
    title: "Lieu d'organisation d'ASBL",
    desc: "Toute ASBL n'a pas le budget pour louer un lieu. Ce bâtiment permet un lieu de rencontre.",
  },
  {
    icon: '/icons/soupe.png',
    title: 'Soupe populaire',
    desc: 'Une cantine improvisée permet de recevoir un repas, et de le payer selon ses moyens.',
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
            Nous sommes un collectif d&apos;habitant·es et de militant·es qui occupe un bâtiment
            vide au cœur de Liège pour en faire un centre social autogéré, ouvert à toutes celles et
            ceux qui veulent participer.
          </p>
          <p>
            Notre démarche est non-violente, horizontale et radicalement inclusive. Chaque décision
            est prise en assemblée et chaque personne présente compte autant qu&apos;une autre.
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

      <Panel title="Quels risques pour le projet?">
        <div className="space-y-4 text-sm leading-relaxed">
          <p>
            L&apos;occupation reste fragile juridiquement. Une procédure d&apos;expulsion peut être
            lancée à tout moment et nous y répondons par la mobilisation collective.
          </p>
          <div className="flex justify-center pt-2">
            <Link
              href="/articles"
              className="rounded-full bg-secondary/80 px-5 py-2 text-sm font-medium text-secondary-foreground shadow hover:bg-secondary"
            >
              Lien vers un article plus en profondeur →
            </Link>
          </div>
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
      </Panel>

      <Panel title="Comment sommes-nous organisés ?">
        <div className="space-y-4 text-sm leading-relaxed">
          <p>
            Notre organisation repose sur des équipes autonomes que chacun·e peut rejoindre librement selon ses envies, ses compétences ou le temps qu’il souhaite consacrer au projet. Chaque équipe gère ses propres missions au quotidien tout en partageant régulièrement son avancement lors des assemblées générales, où les décisions importantes pour l’ensemble du collectif sont discutées et prises collectivement.
          </p>
          <div className="flex justify-center pt-2">
            <Link
              href="/equipes"
              className="rounded-full bg-secondary/80 px-5 py-2 text-sm font-medium text-secondary-foreground shadow hover:bg-secondary"
            >
              Lien vers les équipes →
            </Link>
          </div>
        </div>
      </Panel>
    </>
  )
}
