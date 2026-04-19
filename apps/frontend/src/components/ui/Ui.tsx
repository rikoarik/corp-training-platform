import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';

export function SectionHeading(props: {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: 'left' | 'center';
}) {
  const alignClass = props.align === 'center' ? 'mx-auto text-center' : '';

  return (
    <div className={`max-w-3xl space-y-4 ${alignClass}`.trim()}>
      {props.eyebrow ? <div className="eyebrow">{props.eyebrow}</div> : null}
      <h2 className="section-title">{props.title}</h2>
      {props.description ? <p className="text-base leading-8 text-slate-600">{props.description}</p> : null}
    </div>
  );
}

export function ButtonLink(props: {
  to: string;
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost';
}) {
  const variantClassName =
    props.variant === 'secondary'
      ? 'border border-slate-200 bg-white text-slate-700 hover:border-primary-200 hover:text-primary-600'
      : props.variant === 'ghost'
        ? 'border border-transparent bg-transparent text-primary-600 hover:bg-primary-50'
        : 'border border-primary-500 bg-primary-500 text-white hover:bg-primary-600';

  return (
    <Link
      to={props.to}
      className={`inline-flex items-center justify-center rounded-full px-5 py-3 text-sm font-semibold transition-colors ${variantClassName}`}
    >
      {props.children}
    </Link>
  );
}

export function LoadingState(props: { label?: string }) {
  return (
    <div className="card-surface px-6 py-10 text-center text-sm text-slate-500">
      {props.label ?? 'Memuat data...'}
    </div>
  );
}

export function EmptyState(props: { title: string; description: string; action?: ReactNode }) {
  return (
    <div className="card-surface px-6 py-10 text-center">
      <h3 className="text-lg font-semibold text-ink">{props.title}</h3>
      <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-slate-500">{props.description}</p>
      {props.action ? <div className="mt-6">{props.action}</div> : null}
    </div>
  );
}

export function SurfaceCard(props: { children: ReactNode; className?: string }) {
  return <div className={`card-surface ${props.className ?? ''}`.trim()}>{props.children}</div>;
}

export function StatusBadge(props: { status: string }) {
  const colorClassName =
    props.status === 'OPEN' || props.status === 'PUBLISHED' || props.status === 'CONFIRMED'
      ? 'bg-emerald-100 text-emerald-700'
      : props.status === 'CLOSED'
        ? 'bg-amber-100 text-amber-700'
        : props.status === 'COMPLETED' || props.status === 'ARCHIVED'
          ? 'bg-slate-200 text-slate-700'
          : props.status === 'CANCELLED'
            ? 'bg-rose-100 text-rose-700'
            : 'bg-primary-100 text-primary-700';

  return (
    <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${colorClassName}`}>
      {props.status}
    </span>
  );
}
