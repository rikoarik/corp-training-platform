import { EmptyState, LoadingState, SectionHeading, SurfaceCard } from '../components/ui/Ui';
import { useAsyncData } from '../hooks/useAsyncData';
import { getPublicPageBySlug } from '../services/public';
import type { ProfilePageContent } from '../types/api';

export function ProfilePage() {
  const page = useAsyncData(() => getPublicPageBySlug<ProfilePageContent>('profile'), []);

  if (page.loading) {
    return (
      <div className="section-space">
        <div className="page-shell">
          <LoadingState label="Memuat profil perusahaan..." />
        </div>
      </div>
    );
  }

  if (page.error || !page.data) {
    return (
      <div className="section-space">
        <div className="page-shell">
          <EmptyState title="Profil belum tersedia" description={page.error ?? 'Konten profil belum dapat dimuat saat ini.'} />
        </div>
      </div>
    );
  }

  const content = page.data.content;

  return (
    <div className="section-space">
      <div className="page-shell space-y-16">
        <SectionHeading
          eyebrow="Profil perusahaan"
          title="Bangun company profile yang kredibel, ringkas, dan mudah dipercaya"
          description={content.about}
        />

        <section className="grid gap-6 lg:grid-cols-2">
          <SurfaceCard className="p-8">
            <h2 className="text-2xl font-semibold text-ink">Visi</h2>
            <p className="mt-4 text-sm leading-8 text-slate-600">{content.vision}</p>
          </SurfaceCard>
          <SurfaceCard className="p-8">
            <h2 className="text-2xl font-semibold text-ink">Misi</h2>
            <div className="mt-4 grid gap-3 text-sm leading-7 text-slate-600">
              {content.mission.map((item) => (
                <div key={item} className="rounded-2xl bg-slate-50 px-4 py-4">
                  {item}
                </div>
              ))}
            </div>
          </SurfaceCard>
        </section>

        <section className="space-y-8">
          <SectionHeading
            eyebrow="Legalitas & sertifikasi"
            title="Sorotan dokumen penting yang memperkuat rasa aman calon klien"
            description="Section ini disiapkan untuk mempresentasikan legalitas, sertifikasi, dan dokumen pendukung lain secara lebih terstruktur."
          />
          <div className="grid gap-6 lg:grid-cols-3">
            {content.legalities.map((item) => (
              <SurfaceCard key={item} className="p-6">
                <div className="text-lg font-semibold text-ink">{item}</div>
                <p className="mt-3 text-sm leading-7 text-slate-600">
                  Dokumen dan ringkasan ini dapat menjadi dasar untuk kebutuhan penawaran, pengajuan vendor, dan komunikasi formal lainnya.
                </p>
              </SurfaceCard>
            ))}
          </div>
        </section>

        <section className="space-y-8">
          <SectionHeading
            eyebrow="Tim ahli"
            title="Susun struktur tim dan fokus keahlian secara jelas"
            description="Halaman ini membantu pengunjung memahami siapa yang mengelola program, bagaimana peran dibagi, dan di mana kekuatan kompetensi perusahaan berada."
          />
          <div className="grid gap-6 lg:grid-cols-3">
            {content.experts.map((expert) => (
              <SurfaceCard key={expert.name} className="p-6">
                <div className="text-lg font-semibold text-ink">{expert.name}</div>
                <p className="mt-3 text-sm leading-7 text-slate-600">{expert.focus}</p>
              </SurfaceCard>
            ))}
          </div>
        </section>

        <section className="grid gap-8 lg:grid-cols-2">
          <SurfaceCard className="p-8">
            <h2 className="text-2xl font-semibold text-ink">Pengalaman proyek</h2>
            <div className="mt-5 grid gap-4 text-sm leading-7 text-slate-600">
              {content.projects.map((item) => (
                <div key={item} className="rounded-2xl bg-slate-50 px-4 py-4">
                  {item}
                </div>
              ))}
            </div>
          </SurfaceCard>

          <SurfaceCard className="p-8">
            <h2 className="text-2xl font-semibold text-ink">Sertifikat & akreditasi</h2>
            <div className="mt-5 grid gap-4 text-sm leading-7 text-slate-600">
              {content.certifications.map((item) => (
                <div key={item} className="rounded-2xl bg-slate-50 px-4 py-4">
                  {item}
                </div>
              ))}
            </div>
          </SurfaceCard>
        </section>
      </div>
    </div>
  );
}
