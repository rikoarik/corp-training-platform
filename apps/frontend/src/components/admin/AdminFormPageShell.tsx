import type { FormEventHandler, ReactNode } from 'react';
import { Link } from 'react-router-dom';

type AdminFormPageShellProps = {
  eyebrow: string;
  title: string;
  backTo: string;
  backLabel?: string;
  loading: boolean;
  loadingLabel: string;
  errorMessage: string | null;
  onSubmit: FormEventHandler<HTMLFormElement>;
  submitLabel: string;
  submitting: boolean;
  submitDisabled?: boolean;
  formClassName?: string;
  statusClassName?: string;
  submitContainerClassName?: string;
  children: ReactNode;
};

export function AdminFormPageShell({
  eyebrow,
  title,
  backTo,
  backLabel = 'Kembali',
  loading,
  loadingLabel,
  errorMessage,
  onSubmit,
  submitLabel,
  submitting,
  submitDisabled,
  formClassName = 'card-surface space-y-5 p-8',
  statusClassName = '',
  submitContainerClassName = '',
  children,
}: AdminFormPageShellProps) {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between gap-4">
        <div>
          <div className="eyebrow">{eyebrow}</div>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight text-ink">{title}</h1>
        </div>
        <Link to={backTo} className="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700">
          {backLabel}
        </Link>
      </div>

      <form className={formClassName} onSubmit={onSubmit}>
        {loading ? <div className={`text-sm text-slate-500 ${statusClassName}`.trim()}>{loadingLabel}</div> : null}
        {children}
        {errorMessage ? <div className={`rounded-2xl bg-rose-50 px-4 py-3 text-sm text-rose-700 ${statusClassName}`.trim()}>{errorMessage}</div> : null}
        <div className={submitContainerClassName}>
          <button type="submit" disabled={submitting || loading || submitDisabled} className="rounded-full bg-primary-500 px-5 py-3 text-sm font-semibold text-white disabled:bg-primary-300">
            {submitting ? 'Menyimpan...' : submitLabel}
          </button>
        </div>
      </form>
    </div>
  );
}
