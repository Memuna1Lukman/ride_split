import { useState } from 'react'
import logo from '../../assets/white.png';
import { Link, useLocation, useNavigate } from 'react-router';
import { Menu, UserRound, X } from 'lucide-react';

export default function Header({prop1="",prop2="",prop3="",prop4="",prop5="",prop6="", variant="top"}) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()
  const navItems = [
    { label: prop1 || 'City Ride', href: '/request-ride' },
    { label: prop2 || 'My invitations', href: '/invitations' },
    { label: prop3 || 'Notification', href: '#notifications' },
    { label: prop4 || 'Safety', href: '#safety' },
    { label: prop5 || 'Driver mode', href: '/drive' },
  ];
  const routeHref = location.pathname.startsWith('/rides/') ? '/request-ride' : location.pathname;
  const currentRouteHref = navItems.find((item) => item.href === routeHref)?.href;
  const selectedHashHref = location.hash;
  const activeHref = selectedHashHref || currentRouteHref || (location.pathname === '/profile' ? '' : '/request-ride');

  if (variant === 'sidebar') {

    return (
      <>
        <button
          type="button"
          aria-label="Open navigation"
          aria-expanded={isMobileMenuOpen}
          onClick={() => setIsMobileMenuOpen(true)}
          className="fixed left-4 top-4 z-50 inline-flex size-11 items-center justify-center rounded-xl border border-white/10 bg-neutral-900 text-white shadow-lg transition hover:bg-neutral-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lime-200 lg:hidden"
        >
          <Menu className="size-5" aria-hidden="true" />
        </button>
        {isMobileMenuOpen && <button type="button" aria-label="Close navigation" onClick={() => setIsMobileMenuOpen(false)} className="fixed inset-0 z-40 bg-black/50 lg:hidden" />}

        <aside className={`fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-white/10 bg-neutral-950 p-5 shadow-2xl transition-transform duration-200 lg:sticky lg:top-0 lg:h-screen lg:translate-x-0 lg:shadow-none ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`} aria-label="Ride navigation">
          <div className="flex items-center justify-between">
            <Link to="/" aria-label="Ride Split home" className="rounded-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lime-200">
              <img src={logo} alt="Ride Split" className="h-11 w-32 object-cover object-center brightness-200" />
            </Link>
            <button type="button" aria-label="Close navigation" onClick={() => setIsMobileMenuOpen(false)} className="inline-flex size-10 items-center justify-center rounded-lg text-neutral-400 hover:bg-white/10 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lime-200 lg:hidden">
              <X className="size-5" aria-hidden="true" />
            </button>
          </div>

          <p className="mt-10 px-3 text-xs font-semibold uppercase tracking-[0.18em] text-neutral-500">Workspace</p>
          <nav className="mt-3 space-y-1" aria-label="Dashboard">
            {navItems.map(({ label, href }) => {
              const className = `flex min-h-11 items-center rounded-xl px-3 text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lime-200 ${activeHref === href ? 'bg-lime-200 text-neutral-950' : 'text-neutral-400 hover:bg-white/10 hover:text-white'}`;
              const handleClick = () => {
                setIsMobileMenuOpen(false);
              };

              return href.startsWith('/')
                ? <Link key={label} to={href} onClick={handleClick} className={className}>{label}</Link>
                : <a key={label} href={href} onClick={handleClick} className={className}>{label}</a>;
            })}
          </nav>

          {prop6 && (
            <button
              type="button"
              onClick={() => {
                setIsMobileMenuOpen(false);
                navigate('/drive');
              }}
              className="mt-auto flex min-h-12 w-full items-center justify-center rounded-xl bg-lime-200 px-4 text-sm font-bold text-neutral-900 transition-colors hover:bg-lime-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lime-200"
            >
              {prop6}
            </button>
          )}

          <Link to="/profile" onClick={() => setIsMobileMenuOpen(false)} className="mt-3 flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-3 text-sm font-semibold text-white transition hover:border-lime-200/40 hover:bg-lime-200/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lime-200">
            <span className="flex size-9 items-center justify-center rounded-full bg-lime-200 text-xs font-bold text-neutral-900">ME</span>
            <span>View profile</span>
            <UserRound className="ml-auto size-4 text-neutral-400" aria-hidden="true" />
          </Link>
        </aside>
      </>
    );
  }

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
          <Link to="/" className="hover:text-white transition-colors duration-200">{prop1}</Link>
          <Link to="/drive" className="hover:text-white transition-colors duration-200">{prop2}</Link>
          <Link to="/about" className="hover:text-white transition-colors duration-200">{prop3}</Link>
          <Link to="/how-it-works" className="hover:text-white transition-colors duration-200">{prop4}</Link>
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
          <Link
            to="/login"
            className="flex min-h-10 items-center justify-center rounded-full px-3 text-xs font-bold text-white transition-colors hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lime-200 sm:px-4"
          >
            {prop5}
          </Link>
          <Link
            to="/signup"
            className="flex min-h-10 items-center justify-center rounded-full bg-lime-200 px-3 text-xs font-bold text-neutral-900 transition-colors hover:bg-lime-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lime-200 sm:px-4"
          >
            {prop6}
          </Link>
        </section>
      </nav>
    </header>
  )
}
