import { Link, useParams } from 'react-router-dom';
import { ButtonLink, EmptyState, LoadingState, SectionHeading, SurfaceCard } from '../components/ui/Ui';
import { formatCurrency, formatDateRange } from '../lib/format';
import { getTrainingBySlug } from '../services/public';
import { useAsyncData } from '../hooks/useAsyncData';

export function TrainingDetailPage() {
  const { slug = '' } = useParams();
  const training = useAsyncData(() => getTrainingBySlug(slug), [slug]);

  if (training.loading) {
    return (
      <div className="section-space">
        <div className="page-shell">
          <LoadingState label="Memuat detail pelatihan..." />
        </div>
      </div>
    );
  }

  if (training.error || !training.data) {
    return (
      <div className="section-space">
        <div className="page-shell">
          <EmptyState
            title="Detail pelatihan tidak ditemukan"
            description={training.error ?? 'Program yang Anda cari belum tersedia atau sudah tidak dipublikasikan.'}
            action={<ButtonLink to="/pelatihan">Kembali ke katalog</ButtonLink>}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="section-space">
      <div className="page-shell space-y-12">
        <section className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-start">
          <div className="space-y-6">
            <div className="eyebrow">{training.data.category.name}</div>
            <h1 className="text-4xl font-semibold tracking-tight text-ink sm:text-5xl">{training.data.title}</h1>
            <p className="max-w-3xl text-base leading-8 text-slate-600">{training.data.description}</p>
          </div>

          <SurfaceCard className="p-6">
            <div className="text-sm font-medium text-slate-500">Investasi pelatihan</div>
            <div className="mt-3 text-3xl font-semibold text-primary-600">{formatCurrency(training.data.price)}</div>
            <div className="mt-6 grid gap-3 text-sm leading-7 text-slate-600">
              <div>
                <span className="font-semibold text-slate-900">Kategori:</span> {training.data.category.name}
              </div>
              <div>
                <span className="font-semibold text-slate-900">Jadwal terbuka:</span> {training.data.schedules.length}
              </div>
              <div>
                <span className="font-semibold text-slate-900">Status:</span> {training.data.status}
              </div>
            </div>
            <div className="mt-6 flex flex-wrap gap-3">
              <ButtonLink to="/jadwal">Lihat jadwal</ButtonLink>
              <ButtonLink to="/profil" variant="secondary">
                Lihat profil perusahaan
              </ButtonLink>
            </div>
          </SurfaceCard>
        </section>

        <section className="space-y-8">
          <SectionHeading
            eyebrow="Jadwal terbuka"
            title="Pilih batch yang paling sesuai dengan kebutuhan tim Anda"
            description="Detail pelatihan publik mengambil jadwal yang statusnya masih OPEN agar CTA tetap relevan untuk pengunjung."
          />

          {training.data.schedules.length === 0 ? (
            <EmptyState
              title="Belum ada jadwal terbuka"
              description="Program ini sudah tersedia di katalog, tetapi jadwal baru belum dipublikasikan. Silakan hubungi tim kami untuk informasi kelas berikutnya."
              action={<ButtonLink to="/jadwal">Buka semua jadwal</ButtonLink>}
            />
          ) : (
            <div className="grid gap-6 lg:grid-cols-2">
              {training.data.schedules.map((schedule) => (
                <SurfaceCard key={schedule.id} className="p-6">
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                      <h2 className="text-xl font-semibold text-ink">{schedule.title}</h2>
                      <div className="mt-3 text-sm leading-7 text-slate-600">
                        {formatDateRange(schedule.startDate, schedule.endDate)}
                      </div>
                    </div>
                    <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
                      {schedule.status}
                    </span>
                  </div>
                  <div className="mt-5 grid gap-3 text-sm leading-7 text-slate-600">
                    <div>
                      <span className="font-semibold text-slate-900">Lokasi:</span> {schedule.location}
                    </div>
                    <div>
                      <span className="font-semibold text-slate-900">Kuota:</span> {schedule.quota} peserta
                    </div>
                  </div>
                  <div className="mt-6">
                    <Link
                      to={`/jadwal/${schedule.id}`}
                      className="text-sm font-semibold text-primary-600 hover:text-primary-700"
                    >
                      Lihat detail jadwal
                    </Link>
                  </div>
                </SurfaceCard>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
