import { EmptyState, LoadingState, SectionHeading, SurfaceCard } from '../components/ui/Ui';
import { useAsyncData } from '../hooks/useAsyncData';
import { getPublicPageBySlug } from '../services/public';
import type { GalleryPageContent } from '../types/api';

export function GalleryPage() {
  const page = useAsyncData(() => getPublicPageBySlug<GalleryPageContent>('gallery'), []);

  if (page.loading) {
    return (
      <div className="section-space">
        <div className="page-shell">
          <LoadingState label="Memuat galeri..." />
        </div>
      </div>
    );
  }

  if (page.error || !page.data) {
    return (
      <div className="section-space">
        <div className="page-shell">
          <EmptyState title="Galeri belum tersedia" description={page.error ?? 'Konten galeri belum dapat dimuat saat ini.'} />
        </div>
      </div>
    );
  }

  const content = page.data.content;

  return (
    <div className="section-space">
      <div className="page-shell space-y-12">
        <SectionHeading
          eyebrow="Galeri"
          title="Ruang visual untuk dokumentasi kelas, aktivitas, dan materi promosi"
          description="Sebelum upload manager tersedia di backend, halaman ini disiapkan sebagai struktur awal untuk menampilkan dokumentasi kegiatan secara meyakinkan."
        />

        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {content.items.map((item, index) => (
            <SurfaceCard key={item} className="overflow-hidden">
              <div className="h-44 bg-gradient-to-br from-primary-100 via-slate-100 to-primary-50" />
              <div className="p-6">
                <div className="text-sm font-semibold uppercase tracking-[0.18em] text-primary-500">Media {index + 1}</div>
                <p className="mt-3 text-sm leading-7 text-slate-600">{item}</p>
              </div>
            </SurfaceCard>
          ))}
        </div>
      </div>
    </div>
  );
}
