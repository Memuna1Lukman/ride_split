import { MapPin } from 'lucide-react';

export default function EmptyState({
  icon: Icon = MapPin,
  title,
  description,
  action,
  className = '',
  compact = false,
}) {
  return (
    <div className={`rounded-2xl border border-dashed border-neutral-200 bg-neutral-50 text-center ${compact ? 'p-4' : 'p-8'} ${className}`}>
      <div className={`mx-auto grid place-items-center rounded-full bg-lime-100 text-lime-700 ${compact ? 'mb-2 h-8 w-8' : 'mb-3 h-11 w-11'}`}>
        <Icon className={compact ? 'h-4 w-4' : 'h-5 w-5'} aria-hidden="true" />
      </div>
      <p className="text-sm font-semibold text-neutral-900">{title}</p>
      {description && <p className="mx-auto mt-1 max-w-sm text-xs leading-5 text-neutral-500">{description}</p>}
      {action && <div className="mt-3">{action}</div>}
    </div>
  );
}
