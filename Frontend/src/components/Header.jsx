import { useState } from 'react'
import logo from '../assets/white.png';
import { Link } from 'react-router';

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 w-full px-3 pt-3 sm:px-6 sm:pt-6">
      <nav className="mx-auto flex w-full max-w-5xl items-center justify-between gap-3 rounded-full border border-white/10 bg-neutral-900/40 px-3 py-2 backdrop-blur-md sm:px-5">
        <Link
          to="/"
          aria-label="Ride Split home"
          className="flex shrink-0 items-center rounded-full focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-lime-200"
        >
          <img
            src={logo}
            alt="Ride Split"
            className="h-9 w-24 object-cover object-center brightness-200 sm:h-16 sm:w-48"
          />
        </Link>

        <section className="hidden items-center gap-6 text-xs font-semibold tracking-wide text-neutral-300 md:flex">
          <Link to="/" className="hover:text-white transition-colors duration-200">Ride</Link>
          <Link to="/drive" className="hover:text-white transition-colors duration-200">Drive</Link>
          <Link to="/about" className="hover:text-white transition-colors duration-200">About</Link>
          <Link to="/how-it-works" className="hover:text-white transition-colors duration-200">How It Works</Link>
        </section>

        <div className="relative md:hidden">
          <button
            type="button"
            aria-expanded={isMobileMenuOpen}
            aria-controls="mobile-navigation"
            onClick={() => setIsMobileMenuOpen((isOpen) => !isOpen)}
            className="flex min-h-10 items-center rounded-full px-3 text-xs font-bold text-white transition-colors hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lime-200"
          >
            Menu
          </button>

          <section
            id="mobile-navigation"
            aria-label="Main navigation"
            hidden={!isMobileMenuOpen}
            className="absolute right-0 top-full mt-3 w-48 rounded-2xl border border-white/10 bg-neutral-900 p-2 shadow-xl"
          >
            <Link to="/" onClick={() => setIsMobileMenuOpen(false)} className="block rounded-xl px-3 py-2 text-sm font-semibold text-neutral-300 hover:bg-white/10 hover:text-white focus-visible:outline-2 focus-visible:outline-lime-200">Ride</Link>
            <Link to="/drive" onClick={() => setIsMobileMenuOpen(false)} className="block rounded-xl px-3 py-2 text-sm font-semibold text-neutral-300 hover:bg-white/10 hover:text-white focus-visible:outline-2 focus-visible:outline-lime-200">Drive</Link>
            <Link to="/about" onClick={() => setIsMobileMenuOpen(false)} className="block rounded-xl px-3 py-2 text-sm font-semibold text-neutral-300 hover:bg-white/10 hover:text-white focus-visible:outline-2 focus-visible:outline-lime-200">About</Link>
            <Link to="/how-it-works" onClick={() => setIsMobileMenuOpen(false)} className="block rounded-xl px-3 py-2 text-sm font-semibold text-neutral-300 hover:bg-white/10 hover:text-white focus-visible:outline-2 focus-visible:outline-lime-200">How It Works</Link>
          </section>
        </div>

        <section className="flex shrink-0 items-center gap-2" aria-label="Account actions">
          <button
            type="button"
            className="min-h-10 rounded-full px-3 text-xs font-bold text-white transition-colors hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lime-200 sm:px-4"
          >
            Log in
          </button>
          <button
            type="button"
            className="min-h-10 rounded-full bg-lime-200 px-3 text-xs font-bold text-neutral-900 transition-colors hover:bg-lime-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lime-200 sm:px-4"
          >
            Sign up
          </button>
        </section>
      </nav>
    </header>
  )
}
