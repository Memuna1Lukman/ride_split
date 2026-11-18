import { forwardRef } from 'react';

const Input = forwardRef(function Input(
  {
    label,
    hint,
    error,
    id,
    className = '',
    inputClassName = '',
    startAdornment,
    endAdornment,
    ...props
  },
  ref,
) {
  const inputId = id ?? props.name;

  return (
    <div className={className}>
      {label && (
        <label htmlFor={inputId} className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-neutral-300">
          {label}
        </label>
      )}
      <div className="relative">
        {startAdornment && <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-neutral-400">{startAdornment}</span>}
        <input
          ref={ref}
          id={inputId}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined}
          className={`w-full rounded-xl border bg-neutral-950/70 px-4 py-3 text-sm text-white placeholder-neutral-500 outline-none transition focus:border-lime-200 focus:ring-1 focus:ring-lime-200 disabled:cursor-not-allowed disabled:opacity-60 ${error ? 'border-red-400/70 focus:border-red-300 focus:ring-red-300' : 'border-white/10'} ${startAdornment ? 'pl-10' : ''} ${endAdornment ? 'pr-10' : ''} ${inputClassName}`}
          {...props}
        />
        {endAdornment && <span className="absolute inset-y-0 right-3 flex items-center">{endAdornment}</span>}
      </div>
      {error ? <p id={`${inputId}-error`} role="alert" className="mt-1.5 text-xs text-red-200">{error}</p> : hint ? <p id={`${inputId}-hint`} className="mt-1.5 text-xs text-neutral-400">{hint}</p> : null}
    </div>
  );
});

export default Input;
