import { LoaderCircle } from 'lucide-react';

export default function Spinner({ size = 'sm', label = 'Loading', className = '' }) {
  const sizes = { sm: 'h-4 w-4', md: 'h-5 w-5', lg: 'h-7 w-7' };

  return (
    <span className={`inline-flex items-center gap-2 ${className}`} role="status" aria-live="polite">
      <LoaderCircle className={`animate-spin ${sizes[size] ?? sizes.sm}`} aria-hidden="true" />
      <span className="sr-only">{label}</span>
    </span>
  );
}
