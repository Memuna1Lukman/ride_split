import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';

export default function Modal({
  isOpen,
  onClose,
  title,
  description,
  children,
  className = '',
  closeOnOverlayClick = true,
}) {
  const closeButtonRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return undefined;
    const previousOverflow = document.body.style.overflow;
    const onKeyDown = (event) => {
      if (event.key === 'Escape') onClose?.();
    };

    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', onKeyDown);
    window.setTimeout(() => closeButtonRef.current?.focus(), 0);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-50 grid place-items-end bg-slate-950/35 p-4 backdrop-blur-sm sm:place-items-center"
      onMouseDown={(event) => {
        if (closeOnOverlayClick && event.target === event.currentTarget) onClose?.();
      }}
    >
      <section role="dialog" aria-modal="true" aria-labelledby="modal-title" className={`w-full max-w-sm rounded-3xl bg-white p-5 shadow-2xl ${className}`}>
        <header className="mb-5 flex items-start justify-between gap-4">
          <div>
            {title && <h2 id="modal-title" className="text-lg font-bold text-slate-950">{title}</h2>}
            {description && <p className="mt-1 text-sm text-slate-500">{description}</p>}
          </div>
          <button ref={closeButtonRef} type="button" onClick={onClose} className="rounded-full p-2 text-slate-500 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-lime-500" aria-label="Close dialog">
            <X className="h-5 w-5" />
          </button>
        </header>
        {children}
      </section>
    </div>,
    document.body,
  );
}
