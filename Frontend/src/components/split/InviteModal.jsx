import { Search, UserPlus } from 'lucide-react'
import { useEffect, useState } from 'react'
import { createInvitation, searchPassengers } from '../../services/rideApi'
import Modal from '../ui/Modal'

export default function InviteModal({ rideId, participantIds, invitedUserIds, onClose, onInvitationSent }) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [resultsQuery, setResultsQuery] = useState('')
  const [isSearching, setIsSearching] = useState(false)
  const [isSending, setIsSending] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const trimmedQuery = query.trim()
    if (trimmedQuery.length < 2) {
      return undefined
    }

    let isCurrent = true
    const timer = window.setTimeout(async () => {
      try {
        setIsSearching(true)
        setError('')
        const passengers = await searchPassengers(trimmedQuery)
        if (isCurrent) {
          setResults(passengers)
          setResultsQuery(trimmedQuery)
        }
      } catch (searchError) {
        if (isCurrent) setError(searchError.message)
      } finally {
        if (isCurrent) setIsSearching(false)
      }
    }, 300)

    return () => {
      isCurrent = false
      window.clearTimeout(timer)
    }
  }, [query])

  async function sendInvitation(passenger) {
    if (isSending) return
    try {
      setIsSending(true)
      setError('')
      const invitation = await createInvitation(rideId, passenger.id)
      onInvitationSent(invitation)
      setQuery('')
      setResults([])
      setResultsQuery('')
    } catch (invitationError) {
      setError(invitationError.message)
    } finally {
      setIsSending(false)
    }
  }

  const trimmedQuery = query.trim()
  const availableResults = (trimmedQuery.length >= 2 && resultsQuery === trimmedQuery ? results : []).filter((passenger) => !participantIds.includes(passenger.id) && !invitedUserIds.includes(passenger.id))

  return <Modal isOpen onClose={onClose} title="Invite co-riders" description="Search for a registered passenger and send an invitation.">
    <label className="block text-sm font-semibold text-slate-800" htmlFor="passenger-search">Find a passenger</label>
    <div className="relative mt-2">
      <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" aria-hidden="true" />
      <input id="passenger-search" value={query} onChange={(event) => {
        const nextQuery = event.target.value
        setQuery(nextQuery)
        setResults([])
        setResultsQuery('')
        if (nextQuery.trim().length < 2) setIsSearching(false)
      }} autoFocus placeholder="Name or email" className="min-h-11 w-full rounded-xl border border-slate-200 py-2 pl-10 pr-3 text-sm text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100" />
    </div>
    {error && <p role="alert" className="mt-3 text-sm text-red-600">{error}</p>}
    {isSearching && <p className="mt-3 text-sm text-slate-500">Searching passengers…</p>}
    {!isSearching && query.trim().length >= 2 && availableResults.length === 0 && !error && <p className="mt-3 text-sm text-slate-500">No eligible passengers found.</p>}
    <div className="mt-3 max-h-64 space-y-2 overflow-y-auto">
      {availableResults.map((passenger) => <div key={passenger.id} className="flex items-center gap-3 rounded-xl border border-slate-200 p-3">
        <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-xs font-bold text-emerald-800">{passenger.full_name.slice(0, 2).toUpperCase()}</span>
        <div className="min-w-0 flex-1"><p className="truncate text-sm font-semibold text-slate-900">{passenger.full_name}</p><p className="truncate text-xs text-slate-500">{passenger.email}</p></div>
        <button type="button" disabled={isSending} onClick={() => sendInvitation(passenger)} className="inline-flex min-h-9 shrink-0 items-center gap-1 rounded-lg bg-emerald-600 px-3 text-xs font-bold text-white hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"><UserPlus className="size-3.5" aria-hidden="true" />Invite</button>
      </div>)}
    </div>
  </Modal>
}
