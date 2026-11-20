import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router'
import { Circle, MapPin, UserPlus, Users } from 'lucide-react'
import Header from '../components/layout/Header'
import InviteModal from '../components/split/InviteModal'
import Spinner from '../components/ui/Spinner'
import { getParticipants, getRide, getRideInvitations } from '../services/rideApi'
import { useAuth } from '../features/auth/AuthContext'

function readableStatus(status) {
  return status?.replaceAll('_', ' ').toLowerCase() ?? 'Unknown'
}

export default function RideDetailsPage() {
  const { rideId } = useParams()
  const { user } = useAuth()
  const [ride, setRide] = useState(null)
  const [participants, setParticipants] = useState([])
  const [invitations, setInvitations] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false)
  const [reloadToken, setReloadToken] = useState(0)
  const userId = user?.id

  useEffect(() => {
    let isCurrent = true
    async function loadRide() {
      try {
        const nextRide = await getRide(rideId)
        const nextParticipants = await getParticipants(rideId)
        const nextInvitations = nextRide.creator_id === userId ? await getRideInvitations(rideId) : []
        if (!isCurrent) return
        setRide(nextRide)
        setParticipants(nextParticipants)
        setInvitations(nextInvitations)
        setError('')
      } catch (loadError) {
        if (isCurrent) setError(loadError.message)
      } finally {
        if (isCurrent) setIsLoading(false)
      }
    }
    loadRide()
    return () => { isCurrent = false }
  }, [rideId, reloadToken, userId])

  function retryLoad() {
    setIsLoading(true)
    setReloadToken((current) => current + 1)
  }

  const isCreator = ride?.creator_id === user?.id
  const rideIsOpen = ride?.status === 'GATHERING_PASSENGERS'
  const isFull = participants.length >= (ride?.capacity ?? 0)

  return <div className="min-h-screen bg-neutral-950 text-white lg:flex">
    <Header variant="sidebar" prop1="Request a ride" prop2="My invitations" />
    <main className="mx-auto w-full max-w-5xl px-4 pb-10 pt-20 sm:px-6 sm:pt-24 lg:px-8 lg:pt-10">
      <Link to="/request-ride" className="text-sm font-semibold text-lime-200 hover:text-lime-100">← Request another ride</Link>
      {isLoading && <div className="mt-10 flex justify-center"><Spinner label="Loading ride details" /></div>}
      {error && <section className="mt-8 rounded-2xl border border-red-400/20 bg-red-400/10 p-5"><p role="alert" className="text-red-100">{error}</p><button type="button" onClick={retryLoad} className="mt-3 text-sm font-bold text-white underline">Try again</button></section>}
      {ride && !isLoading && <>
        <div className="mt-6 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div><p className="text-sm font-semibold text-lime-200">Ride #{ride.id}</p><h1 className="mt-1 text-3xl font-bold tracking-tight sm:text-4xl">Manage your ride</h1><p className="mt-2 text-neutral-400">Invite passengers and track who has confirmed.</p></div>
          <span className="w-fit rounded-full border border-lime-200/20 bg-lime-200/10 px-3 py-2 text-sm font-semibold capitalize text-lime-100">{readableStatus(ride.status)}</span>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
          <div className="space-y-6">
            <section className="rounded-3xl border border-white/10 bg-neutral-900/70 p-5 shadow-2xl shadow-black/20 sm:p-6">
              <h2 className="text-lg font-bold">Ride summary</h2>
              <div className="mt-5 space-y-5">
                <RoutePoint icon={Circle} label="Pickup" value={ride.pickup_label || 'Location selected for this ride'} iconClass="text-lime-200" />
                <RoutePoint icon={MapPin} label="Destination" value={ride.dropoff_label || 'Location selected for this ride'} iconClass="text-rose-300" />
              </div>
            </section>

            <section className="rounded-3xl border border-white/10 bg-neutral-900/70 p-5 shadow-2xl shadow-black/20 sm:p-6">
              <div className="flex items-center justify-between gap-3"><div><h2 className="text-lg font-bold">Confirmed passengers</h2><p className="mt-1 text-sm text-neutral-400">{participants.length} of {ride.capacity} seats filled</p></div><Users className="size-5 text-lime-200" aria-hidden="true" /></div>
              <div className="mt-5 divide-y divide-white/10">{participants.map((participant) => <div key={participant.id} className="flex items-center gap-3 py-3 first:pt-0 last:pb-0"><span className="flex size-10 items-center justify-center rounded-full bg-white/10 text-sm font-bold text-lime-100">{participant.user.full_name.slice(0, 2).toUpperCase()}</span><div className="min-w-0"><p className="truncate font-semibold">{participant.user.full_name}</p><p className="truncate text-sm text-neutral-400">{participant.is_creator ? 'Ride creator' : 'Confirmed passenger'}</p></div></div>)}</div>
            </section>
          </div>

          <aside className="h-fit rounded-3xl border border-white/10 bg-neutral-900/70 p-5 shadow-2xl shadow-black/20 sm:p-6">
            <h2 className="text-lg font-bold">Passengers</h2>
            <p className="mt-2 text-sm leading-6 text-neutral-400">Only confirmed passengers will be included when the fare is split.</p>
            {isCreator && <button type="button" disabled={!rideIsOpen || isFull} onClick={() => setIsInviteModalOpen(true)} className="mt-5 flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-lime-200 px-4 text-sm font-bold text-neutral-950 transition hover:bg-lime-300 disabled:cursor-not-allowed disabled:opacity-50"><UserPlus className="size-4" aria-hidden="true" />{isFull ? 'Ride is full' : 'Invite passengers'}</button>}
            {!isCreator && <Link to="/invitations" className="mt-5 flex min-h-11 items-center justify-center rounded-xl border border-white/10 px-4 text-sm font-bold text-white transition hover:bg-white/5">View invitations</Link>}
            {isCreator && <div className="mt-6 border-t border-white/10 pt-5"><h3 className="text-sm font-bold">Invitations</h3><div className="mt-3 space-y-3">{invitations.length === 0 ? <p className="text-sm text-neutral-500">No invitations sent yet.</p> : invitations.map((invitation) => <div key={invitation.id} className="flex items-center justify-between gap-3 text-sm"><span className="text-neutral-300">Passenger #{invitation.invitee_id}</span><span className="capitalize text-neutral-500">{readableStatus(invitation.status)}</span></div>)}</div></div>}
          </aside>
        </div>
      </>}
    </main>
    {isInviteModalOpen && <InviteModal rideId={ride.id} participantIds={participants.map((participant) => participant.user_id)} invitedUserIds={invitations.map((invitation) => invitation.invitee_id)} onClose={() => setIsInviteModalOpen(false)} onInvitationSent={(invitation) => setInvitations((current) => [invitation, ...current])} />}
  </div>
}

function RoutePoint({ icon: Icon, label, value, iconClass }) {
  return <div className="flex gap-3"><Icon className={`mt-0.5 size-4 shrink-0 ${iconClass}`} aria-hidden="true" /><div><p className="text-xs font-semibold uppercase tracking-wider text-neutral-500">{label}</p><p className="mt-1 text-sm font-medium text-neutral-200">{value}</p></div></div>
}
