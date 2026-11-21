import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router'
import { Check, X } from 'lucide-react'
import Header from '../components/layout/Header'
import Spinner from '../components/ui/Spinner'
import { getMyInvitations, respondToInvitation } from '../services/rideApi'

export default function InvitationsPage() {
  const navigate = useNavigate()
  const [invitations, setInvitations] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [respondingId, setRespondingId] = useState(null)

  useEffect(() => {
    let isCurrent = true
    async function loadInvitations() {
      try {
        const nextInvitations = await getMyInvitations()
        if (!isCurrent) return
        setInvitations(nextInvitations)
      } catch (loadError) {
        if (isCurrent) setError(loadError.message)
      } finally {
        if (isCurrent) setIsLoading(false)
      }
    }
    loadInvitations()
    return () => { isCurrent = false }
  }, [])

  async function respond(invitation, status) {
    try {
      setRespondingId(invitation.id)
      setError('')
      const updatedInvitation = await respondToInvitation(invitation.id, status)
      setInvitations((current) => current.map((item) => item.id === updatedInvitation.id ? updatedInvitation : item))
      if (status === 'ACCEPTED') navigate(`/rides/${updatedInvitation.ride_id}`)
    } catch (responseError) {
      setError(responseError.message)
    } finally {
      setRespondingId(null)
    }
  }

  return <div className="min-h-screen bg-neutral-950 text-white lg:flex">
    <Header variant="sidebar" prop1="Request a ride" prop2="My invitations" />
    <main className="mx-auto w-full max-w-3xl px-4 pb-10 pt-20 sm:px-6 sm:pt-24 lg:px-8 lg:pt-10">
      <Link to="/request-ride" className="text-sm font-semibold text-lime-200 hover:text-lime-100">← Request a ride</Link>
      <h1 className="mt-6 text-3xl font-bold tracking-tight sm:text-4xl">My invitations</h1>
      <p className="mt-2 text-neutral-400">Accept a pending invitation to join that ride’s confirmed passengers.</p>
      {isLoading && <div className="mt-10 flex justify-center"><Spinner label="Loading invitations" /></div>}
      {error && <p role="alert" className="mt-6 rounded-xl border border-red-400/20 bg-red-400/10 p-4 text-sm text-red-100">{error}</p>}
      {!isLoading && <div className="mt-8 space-y-4">{invitations.length === 0 ? <section className="rounded-3xl border border-white/10 bg-neutral-900/70 p-6 text-center"><p className="font-semibold">No invitations yet</p><p className="mt-2 text-sm text-neutral-400">When someone invites you to a ride, it will appear here.</p></section> : invitations.map((invitation) => {
        const isPending = invitation.status === 'PENDING'
        const isResponding = respondingId === invitation.id
        return <section key={invitation.id} className="rounded-3xl border border-white/10 bg-neutral-900/70 p-5 shadow-2xl shadow-black/20 sm:p-6"><div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center"><div><p className="text-sm font-semibold text-lime-200">Ride #{invitation.ride_id}</p><h2 className="mt-1 text-lg font-bold capitalize">Invitation {invitation.status.replaceAll('_', ' ').toLowerCase()}</h2><p className="mt-1 text-sm text-neutral-400">Sent by passenger #{invitation.inviter_id}</p></div>{isPending && <div className="flex gap-2"><button type="button" disabled={isResponding} onClick={() => respond(invitation, 'DECLINED')} className="min-h-10 rounded-xl border border-white/10 px-4 text-sm font-bold text-white hover:bg-white/5 disabled:opacity-50"><X className="mr-1 inline size-4" aria-hidden="true" />Decline</button><button type="button" disabled={isResponding} onClick={() => respond(invitation, 'ACCEPTED')} className="min-h-10 rounded-xl bg-lime-200 px-4 text-sm font-bold text-neutral-950 hover:bg-lime-300 disabled:opacity-50"><Check className="mr-1 inline size-4" aria-hidden="true" />Accept</button></div>}</div></section>
      })}</div>}
    </main>
  </div>
}
