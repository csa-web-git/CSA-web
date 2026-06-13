'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const mainLinks = [
  { href: '/', label: 'Home' },
  { href: '/programme', label: 'Programme' },
  { href: '/articles', label: 'Articles' },
  { href: '/equipes', label: 'Equipes' },
  { href: '/contact', label: 'Contact' },
]

const ctaLinks = [
  { href: '/reserver-une-salle', label: 'Réserve une salle' },
  { href: '/passer-une-nuit', label: 'Passer une nuit' },
]

export function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false)
  const pathname = usePathname()
  const isActive = (href: string) => (href === '/' ? pathname === '/' : pathname.startsWith(href))

  return (
    <header className="w-full bg-header py-5 px-6">
      <nav className="mx-auto flex max-w-7xl items-center justify-between gap-4 flex-wrap">
        {menuOpen && (
        <div className="md:hidden mt-4 flex flex-col gap-2">
          {[...mainLinks, ...ctaLinks].map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setMenuOpen(false)}
              className={[
                'rounded-md px-4 py-3 text-center font-medium',
                isActive(l.href)
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-secondary text-secondary-foreground',
              ].join(' ')}
            >
              {l.label}
            </Link>
          ))}
        </div>
      )}

        <div className="font-display text-base font-bold leading-tight text-header-foreground">
          Centre
          <br />
          Social
          <br />
          Associatif
        </div>

        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden text-header-foreground text-3xl"
        >
        ☰
        </button>

        <div className="hidden md:flex flex-1 items-center justify-center gap-3 flex-wrap">
          {mainLinks.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={[
                'rounded-md px-6 py-3 text-sm font-medium shadow-sm transition-colors',
                isActive(l.href)
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
              ].join(' ')}
            >
              {l.label}
            </Link>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-3 flex-wrap">
          {ctaLinks.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={[
                'rounded-md px-4 py-3 text-center text-xs font-semibold leading-tight shadow-sm transition-colors',
                isActive(l.href)
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
              ].join(' ')}
            >
              {l.label}
              <div className="text-base leading-none mt-1">↓</div>
            </Link>
          ))}
        </div>
      </nav>
    </header>
  )
}
