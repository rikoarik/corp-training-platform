import { EmptyState, LoadingState, SectionHeading, SurfaceCard } from '../components/ui/Ui';
import { useAsyncData } from '../hooks/useAsyncData';
import { getPublicPageBySlug } from '../services/public';
import type { SkpLicensePageContent } from '../types/api';

export function SkpLicensePage() {
  const page = useAsyncData(() => getPublicPageBySlug<SkpLicensePageContent>('skp-license'), []);

  if (page.loading) {
    return (
      <div className="section-space">
        <div className="page-shell">
          <LoadingState label="Memuat konten SKP & lisensi..." />
        </div>
      </div>
    );
  }

  if (page.error || !page.data) {
    return (
      <div className="section-space">
        <div className="page-shell">
          <EmptyState title="Konten belum tersedia" description={page.error ?? 'Konten SKP & lisensi belum dapat dimuat saat ini.'} />
        </div>
      </div>
    );
  }

  const content = page.data.content;

  return (
    <div className="section-space">
      <div className="page-shell space-y-12">
        <SectionHeading
          eyebrow="SKP & Lisensi"
          title="Halaman khusus untuk membangun rasa aman dan kejelasan layanan pendukung"
          description={content.intro}
        />

        <div className="grid gap-6 lg:grid-cols-3">
          {content.offerings.map((item) => (
            <SurfaceCard key={item} className="p-6">
              <h2 className="text-xl font-semibold text-ink">{item}</h2>
              <p className="mt-3 text-sm leading-7 text-slate-600">
                Konten ini dapat diperkaya nanti ketika backend untuk company profile, legalitas, dan dokumen sudah dibuat lebih dinamis.
              </p>
            </SurfaceCard>
          ))}
        </div>
      </div>
    </div>
  );
}
