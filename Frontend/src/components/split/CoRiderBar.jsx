import { Users } from 'lucide-react'

export default function CoRiderBar({ riders, compact = false }) {
  if (!riders.length) return null
  return <div className={`flex items-center gap-2 ${compact ? '' : 'rounded-2xl bg-slate-50 p-3'}`}>
    <div className="flex -space-x-2">{riders.map((rider) => <div key={rider.id} title={rider.name} className={`grid h-8 w-8 place-items-center rounded-full border-2 border-white text-[10px] font-bold text-white ${rider.color}`}>{rider.initials}</div>)}</div>
    {!compact && <div className="min-w-0"><p className="flex items-center gap-1 text-xs font-semibold text-slate-800"><Users className="h-3.5 w-3.5 text-emerald-600" /> Co-riders</p><p className="text-[11px] text-slate-500">{riders.length} joining your route</p></div>}
  </div>
}
