import { EmptyState, LoadingState, SectionHeading, SurfaceCard } from '../components/ui/Ui';
import { useAsyncData } from '../hooks/useAsyncData';
import { getPublicPageBySlug } from '../services/public';
import type { CareerPageContent } from '../types/api';

export function CareerPage() {
  const page = useAsyncData(() => getPublicPageBySlug<CareerPageContent>('career'), []);

  if (page.loading) {
    return (
      <div className="section-space">
        <div className="page-shell">
          <LoadingState label="Memuat lowongan karir..." />
        </div>
      </div>
    );
  }

  if (page.error || !page.data) {
    return (
      <div className="section-space">
        <div className="page-shell">
          <EmptyState title="Lowongan belum tersedia" description={page.error ?? 'Konten karir belum dapat dimuat saat ini.'} />
        </div>
      </div>
    );
  }

  const content = page.data.content;

  return (
    <div className="section-space">
      <div className="page-shell space-y-12">
        <SectionHeading
          eyebrow="Karir"
          title="Halaman karir yang siap dipakai sambil menunggu modul lowongan dinamis"
          description={content.intro}
        />

        <div className="grid gap-6 lg:grid-cols-3">
          {content.openings.map((opening) => (
            <SurfaceCard key={opening.title} className="flex h-full flex-col p-6">
              <div className="flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.18em] text-primary-500">
                <span>{opening.type}</span>
                <span className="h-1 w-1 rounded-full bg-primary-300" />
                <span>{opening.location}</span>
              </div>
              <h2 className="mt-4 text-2xl font-semibold text-ink">{opening.title}</h2>
              <p className="mt-4 flex-1 text-sm leading-7 text-slate-600">{opening.summary}</p>
              <div className="mt-6 rounded-2xl bg-slate-50 px-4 py-4 text-sm leading-7 text-slate-600">
                Untuk tahap awal, CTA lowongan dapat diarahkan ke WhatsApp, email rekrutmen, atau formulir eksternal hingga backend karir siap dibuat dinamis.
              </div>
            </SurfaceCard>
          ))}
        </div>
      </div>
    </div>
  );
}
