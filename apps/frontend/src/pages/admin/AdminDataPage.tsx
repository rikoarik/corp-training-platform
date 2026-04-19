import type { ReactNode } from 'react';
import { EmptyState, LoadingState, SurfaceCard } from '../../components/ui/Ui';

export function AdminDataPage(props: {
  eyebrow: string;
  title: string;
  description: string;
  loading: boolean;
  error: string | null;
  isEmpty: boolean;
  emptyTitle: string;
  emptyDescription: string;
  actions?: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <div className="eyebrow">{props.eyebrow}</div>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight text-ink">{props.title}</h1>
          <p className="mt-4 max-w-3xl text-base leading-8 text-slate-600">{props.description}</p>
        </div>
        {props.actions ? <div className="flex flex-wrap gap-3">{props.actions}</div> : null}
      </div>

      {props.loading ? <LoadingState label="Memuat data admin..." /> : null}
      {props.error ? <EmptyState title="Data tidak bisa dimuat" description={props.error} /> : null}
      {!props.loading && !props.error && props.isEmpty ? (
        <EmptyState title={props.emptyTitle} description={props.emptyDescription} />
      ) : null}
      {!props.loading && !props.error && !props.isEmpty ? <SurfaceCard className="overflow-hidden">{props.children}</SurfaceCard> : null}
    </div>
  );
}
