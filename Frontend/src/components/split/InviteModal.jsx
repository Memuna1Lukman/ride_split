import { Check, Copy, Link as LinkIcon, X } from 'lucide-react'
import { initialRiders } from '../../utils/mockData'
import { useState } from 'react'

export default function InviteModal({ onClose, onSave }) {
  const [chosen, setChosen] = useState(['kojo', 'esi'])
  const [copied, setCopied] = useState(false)
  const toggle = (id) => setChosen((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id])
  const copy = () => { navigator.clipboard?.writeText('ridesplit.app/join/ACCRA-42'); setCopied(true); setTimeout(() => setCopied(false), 1400) }
  return <div className="fixed inset-0 z-50 grid place-items-end bg-slate-950/35 p-4 backdrop-blur-sm sm:place-items-center" role="dialog" aria-modal="true" aria-label="Invite co-riders">
    <div className="w-full max-w-sm rounded-3xl bg-white p-5 shadow-2xl">
      <div className="mb-5 flex items-start justify-between"><div><h2 className="text-lg font-bold text-slate-950">Invite co-riders</h2><p className="mt-1 text-sm text-slate-500">Split this trip with friends on your route.</p></div><button onClick={onClose} className="rounded-full p-2 text-slate-500 hover:bg-slate-100"><X className="h-5 w-5" /></button></div>
      <div className="space-y-2">{initialRiders.map((friend) => <button key={friend.id} onClick={() => toggle(friend.id)} className="flex w-full items-center gap-3 rounded-2xl p-2 text-left hover:bg-slate-50"><span className={`grid h-10 w-10 place-items-center rounded-full text-xs font-bold text-white ${friend.color}`}>{friend.initials}</span><span className="flex-1"><span className="block text-sm font-semibold text-slate-800">{friend.name}</span><span className="block text-xs text-slate-500">Near {friend.stop}</span></span><span className={`grid h-5 w-5 place-items-center rounded-full border ${chosen.includes(friend.id) ? 'border-emerald-600 bg-emerald-600 text-white' : 'border-slate-300'}`}>{chosen.includes(friend.id) && <Check className="h-3.5 w-3.5" />}</span></button>)}</div>
      <button onClick={copy} className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"><LinkIcon className="h-4 w-4" />{copied ? 'Invite link copied' : 'Copy invite link'} {copied && <Copy className="h-3.5 w-3.5" />}</button>
      {/* Future API: POST /rides/{rideId}/invitations for every selected user. */}
      <button onClick={() => { onSave(chosen); onClose() }} className="mt-2 w-full rounded-xl bg-emerald-600 py-3 text-sm font-bold text-white hover:bg-emerald-700">Send invitations</button>
    </div>
  </div>
}
