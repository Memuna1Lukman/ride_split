import { Link } from 'react-router';
import { Mail, Phone, UserRound } from 'lucide-react';
import Header from '../components/layout/Header';
import { useAuth } from '../features/auth/AuthContext';

export default function ProfilePage() {
  const { user } = useAuth();
  const initials = user?.full_name?.split(' ').filter(Boolean).map((name) => name[0]).join('').slice(0, 2).toUpperCase() || 'ME';

  return (
    <div className="min-h-screen bg-neutral-950 text-white lg:flex">
      <Header variant="sidebar" />
      <main className="mx-auto w-full max-w-3xl px-4 py-20 sm:px-6 lg:px-10 lg:py-10">
        <p className="text-sm font-semibold text-lime-200">Account</p>
        <h1 className="mt-1 text-3xl font-bold tracking-tight">My profile</h1>
        <p className="mt-2 text-neutral-400">Your Ride Split account details.</p>

        <section className="mt-8 overflow-hidden rounded-3xl border border-white/10 bg-neutral-900/70 shadow-2xl shadow-black/20">
          <div className="flex items-center gap-4 border-b border-white/10 bg-white/5 p-6">
            <span className="flex size-14 items-center justify-center rounded-full bg-lime-200 text-lg font-bold text-neutral-900">{initials}</span>
            <div>
              <h2 className="text-lg font-bold text-white">{user?.full_name || 'Ride Split member'}</h2>
              <p className="text-sm text-neutral-400">Rider account</p>
            </div>
          </div>

          <dl className="divide-y divide-white/10">
            <ProfileDetail icon={UserRound} label="Full name" value={user?.full_name} />
            <ProfileDetail icon={Mail} label="Email" value={user?.email} />
            <ProfileDetail icon={Phone} label="Phone" value={user?.phone} />
          </dl>
        </section>

        <Link to="/request-ride" className="mt-6 inline-flex min-h-11 items-center rounded-xl bg-lime-200 px-4 text-sm font-bold text-neutral-950 transition hover:bg-lime-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lime-200">
          Request a ride
        </Link>
      </main>
    </div>
  );
}

function ProfileDetail({ icon: Icon, label, value }) {
  return (
    <div className="flex items-center gap-4 p-5">
      <Icon className="size-5 text-neutral-500" aria-hidden="true" />
      <div>
        <dt className="text-xs font-semibold uppercase tracking-wide text-neutral-500">{label}</dt>
        <dd className="mt-1 font-medium text-neutral-100">{value || 'Not available'}</dd>
      </div>
    </div>
  );
}
