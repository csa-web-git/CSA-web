import { Fraunces, Inter } from 'next/font/google'
import './globals.css'
import { SiteHeader } from '@/components/SiteHeader'

const fraunces = Fraunces({
  subsets: ['latin'],
  variable: '--font-display',
  weight: ['500', '700'],
  display: 'swap',
})

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  weight: ['400', '500', '600', '700'],
  display: 'swap',
})

export const metadata = {
  title: 'Centre Social Associatif',
  description: 'Centre social autogéré — programme, équipes, hébergement, réservation de salle.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={`${fraunces.variable} ${inter.variable}`}>
      <body className="min-h-screen bg-background text-foreground antialiased">
        <SiteHeader />
        <main className="px-4 py-10 space-y-10">{children}</main>
      </body>
    </html>
  )
}
