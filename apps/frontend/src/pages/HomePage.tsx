import { ArticleCard, ScheduleCard, TrainingCard } from '../components/public/Cards';
import { ButtonLink, EmptyState, LoadingState, SectionHeading, SurfaceCard } from '../components/ui/Ui';
import { useAsyncData } from '../hooks/useAsyncData';
import { getLatestArticles, getPublicPageBySlug, getSchedules, getTrainings } from '../services/public';
import type { HomePageContent } from '../types/api';

export function HomePage() {
  const homeContent = useAsyncData(() => getPublicPageBySlug<HomePageContent>('home'), []);
  const featuredTrainings = useAsyncData(() => getTrainings({ limit: 3 }), []);
  const latestArticles = useAsyncData(() => getLatestArticles(3), []);
  const upcomingSchedules = useAsyncData(() => getSchedules({ limit: 3 }), []);

  if (homeContent.loading) {
    return (
      <div className="section-space">
        <div className="page-shell">
          <LoadingState label="Memuat konten beranda..." />
        </div>
      </div>
    );
  }

  if (homeContent.error || !homeContent.data) {
    return (
      <div className="section-space">
        <div className="page-shell">
          <EmptyState title="Beranda belum tersedia" description={homeContent.error ?? 'Konten beranda belum dapat dimuat saat ini.'} />
        </div>
      </div>
    );
  }

  const content = homeContent.data.content;

  return (
    <div>
      <section className="section-space bg-gradient-to-br from-primary-50 via-white to-slate-100">
        <div className="page-shell grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div className="space-y-6">
            <div className="eyebrow">{content.hero.eyebrow}</div>
            <h1 className="text-4xl font-semibold tracking-tight text-ink sm:text-5xl lg:text-6xl">{content.hero.title}</h1>
            <p className="max-w-2xl text-lg leading-8 text-slate-600">{content.hero.description}</p>
            <div className="flex flex-wrap gap-4">
              <ButtonLink to="/pelatihan">Lihat pelatihan</ButtonLink>
              <ButtonLink to="/jadwal" variant="secondary">
                Cek jadwal kelas
              </ButtonLink>
            </div>
            <div className="grid gap-3 pt-4 sm:grid-cols-2">
              {content.trustPoints.map((point) => (
                <div key={point} className="rounded-2xl border border-white/80 bg-white/80 px-4 py-4 text-sm text-slate-600 shadow-soft">
                  {point}
                </div>
              ))}
            </div>
          </div>

          <SurfaceCard className="grid gap-4 p-6 sm:grid-cols-2">
            {content.services.map((service) => (
              <div key={service.title} className="rounded-2xl bg-slate-50 p-5">
                <h2 className="text-lg font-semibold text-ink">{service.title}</h2>
                <p className="mt-3 text-sm leading-7 text-slate-600">{service.description}</p>
              </div>
            ))}
          </SurfaceCard>
        </div>
      </section>

      <section className="section-space">
        <div className="page-shell space-y-10">
          <SectionHeading
            eyebrow="Sorotan legalitas"
            title="Bangun kepercayaan sejak kunjungan pertama"
            description="Halaman company profile dan section legalitas disusun untuk membantu perusahaan tampil lebih kredibel saat menawarkan layanan pelatihan dan konsultansi."
          />
          <div className="grid gap-6 lg:grid-cols-3">
            {content.legalHighlights.map((item) => (
              <SurfaceCard key={item} className="p-6">
                <div className="text-lg font-semibold text-ink">{item}</div>
                <p className="mt-3 text-sm leading-7 text-slate-600">
                  Konten ini disiapkan agar calon klien, peserta, dan tim procurement mendapatkan gambaran yang jelas tentang kesiapan perusahaan.
                </p>
              </SurfaceCard>
            ))}
          </div>
        </div>
      </section>

      <section className="section-space bg-white">
        <div className="page-shell space-y-10">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <SectionHeading
              eyebrow="Pelatihan unggulan"
              title="Program pelatihan yang bisa langsung dipromosikan"
              description="Gunakan data pelatihan aktual dari backend agar katalog dan detail program tetap sinkron dengan operasional yang berjalan."
            />
            <ButtonLink to="/pelatihan" variant="ghost">
              Lihat semua pelatihan
            </ButtonLink>
          </div>

          {featuredTrainings.loading ? <LoadingState label="Memuat pelatihan unggulan..." /> : null}
          {featuredTrainings.error ? (
            <EmptyState
              title="Pelatihan belum dapat dimuat"
              description={featuredTrainings.error}
              action={<ButtonLink to="/pelatihan">Buka halaman pelatihan</ButtonLink>}
            />
          ) : null}
          {featuredTrainings.data ? (
            <div className="grid gap-6 lg:grid-cols-3">
              {featuredTrainings.data.map((training) => (
                <TrainingCard key={training.id} training={training} />
              ))}
            </div>
          ) : null}
        </div>
      </section>

      <section className="section-space bg-slate-950 text-white">
        <div className="page-shell grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
          <div>
            <SectionHeading
              eyebrow="Partner & segmen klien"
              title="Dirancang untuk komunikasi yang profesional"
              description="Landing page ini disusun agar perusahaan lebih mudah menyampaikan kapabilitas, cakupan layanan, dan nilai kerja sama kepada calon klien."
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {content.partnerSegments.map((segment) => (
              <div key={segment} className="rounded-3xl border border-white/10 bg-white/5 px-5 py-6 text-sm text-slate-200">
                {segment}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-space">
        <div className="page-shell space-y-10">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <SectionHeading
              eyebrow="Jadwal terdekat"
              title="Bantu calon peserta melihat momentum pendaftaran yang sedang terbuka"
              description="Section ini menampilkan jadwal terbuka dari backend agar informasi tanggal, lokasi, dan kuota tetap aktual."
            />
            <ButtonLink to="/jadwal" variant="ghost">
              Buka semua jadwal
            </ButtonLink>
          </div>

          {upcomingSchedules.loading ? <LoadingState label="Memuat jadwal terdekat..." /> : null}
          {upcomingSchedules.error ? <EmptyState title="Jadwal belum tersedia" description={upcomingSchedules.error} /> : null}
          {upcomingSchedules.data ? (
            <div className="grid gap-6 lg:grid-cols-3">
              {upcomingSchedules.data.map((schedule) => (
                <ScheduleCard key={schedule.id} schedule={schedule} />
              ))}
            </div>
          ) : null}
        </div>
      </section>

      <section className="section-space bg-primary-50">
        <div className="page-shell space-y-10">
          <SectionHeading
            eyebrow="Testimoni"
            title="Narasi yang mendukung kredibilitas penawaran"
            description="Sebelum backend CMS untuk testimoni tersedia, section ini dapat memakai konten statis yang mudah diganti dan tetap konsisten dengan brand voice."
            align="center"
          />
          <div className="grid gap-6 lg:grid-cols-3">
            {content.testimonials.map((item) => (
              <SurfaceCard key={item.quote} className="p-6">
                <p className="text-sm leading-7 text-slate-600">“{item.quote}”</p>
                <div className="mt-6 border-t border-slate-100 pt-5">
                  <div className="font-semibold text-ink">{item.person}</div>
                  <div className="mt-1 text-sm text-slate-500">{item.role}</div>
                </div>
              </SurfaceCard>
            ))}
          </div>
        </div>
      </section>

      <section className="section-space bg-white">
        <div className="page-shell space-y-10">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <SectionHeading
              eyebrow="Artikel & insight"
              title="Konten yang mendukung branding dan edukasi pasar"
              description="Gunakan artikel terbaru untuk menguatkan positioning brand serta membantu pengunjung memahami topik yang relevan dengan layanan Anda."
            />
            <ButtonLink to="/artikel" variant="ghost">
              Lihat semua insight
            </ButtonLink>
          </div>

          {latestArticles.loading ? <LoadingState label="Memuat artikel terbaru..." /> : null}
          {latestArticles.error ? <EmptyState title="Artikel belum tersedia" description={latestArticles.error} /> : null}
          {latestArticles.data ? (
            <div className="grid gap-6 lg:grid-cols-3">
              {latestArticles.data.map((article) => (
                <ArticleCard key={article.id} article={article} />
              ))}
            </div>
          ) : null}
        </div>
      </section>

      <section className="section-space">
        <div className="page-shell">
          <div className="card-surface grid gap-8 overflow-hidden bg-gradient-to-r from-primary-600 to-primary-700 px-8 py-10 text-white lg:grid-cols-[1fr_auto] lg:items-center">
            <div>
              <div className="eyebrow text-primary-100">{content.cta.eyebrow}</div>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight">{content.cta.title}</h2>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-primary-50">{content.cta.description}</p>
            </div>
            <div className="flex flex-wrap gap-4">
              <ButtonLink to={content.cta.primaryTo} variant="secondary">
                {content.cta.primaryLabel}
              </ButtonLink>
              <a
                href={content.contact.telHref}
                className="inline-flex items-center justify-center rounded-full border border-white/30 px-5 py-3 text-sm font-semibold text-white hover:bg-white/10"
              >
                {content.cta.secondaryLabel}
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
