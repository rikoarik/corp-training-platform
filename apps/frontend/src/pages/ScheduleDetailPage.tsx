import { Link, useParams } from 'react-router-dom';
import { ParticipantRegistrationForm } from '../components/public/ParticipantRegistrationForm';
import { ButtonLink, EmptyState, LoadingState, SectionHeading, SurfaceCard } from '../components/ui/Ui';
import { formatDateRange } from '../lib/format';
import { getPublicPageBySlug, getScheduleById } from '../services/public';
import { useAsyncData } from '../hooks/useAsyncData';
import type { HomePageContent } from '../types/api';

export function ScheduleDetailPage() {
  const { id = '' } = useParams();
  const schedule = useAsyncData(() => getScheduleById(id), [id]);
  const homeContent = useAsyncData(() => getPublicPageBySlug<HomePageContent>('home'), []);

  if (schedule.loading) {
    return (
      <div className="section-space">
        <div className="page-shell">
          <LoadingState label="Memuat detail jadwal..." />
        </div>
      </div>
    );
  }

  if (schedule.error || !schedule.data) {
    return (
      <div className="section-space">
        <div className="page-shell">
          <EmptyState
            title="Jadwal tidak ditemukan"
            description={schedule.error ?? 'Jadwal yang Anda cari belum tersedia atau sudah tidak aktif.'}
            action={<ButtonLink to="/jadwal">Kembali ke daftar jadwal</ButtonLink>}
          />
        </div>
      </div>
    );
  }

  const participants = schedule.data._count?.participants ?? 0;
  const remainingQuota = Math.max(schedule.data.quota - participants, 0);
  const scheduleNotes = homeContent.data?.content.scheduleNotes ?? [];

  return (
    <div className="section-space">
      <div className="page-shell space-y-12">
        <section className="grid gap-8 lg:grid-cols-[1fr_0.9fr] lg:items-start">
          <div className="space-y-6">
            <div className="eyebrow">Detail jadwal pelatihan</div>
            <h1 className="text-4xl font-semibold tracking-tight text-ink sm:text-5xl">{schedule.data.title}</h1>
            <p className="max-w-3xl text-base leading-8 text-slate-600">
              Jadwal ini terhubung langsung dengan pelatihan <Link to={`/pelatihan/${schedule.data.training.slug}`} className="font-semibold text-primary-600 hover:text-primary-700">{schedule.data.training.title}</Link> dan ditampilkan hanya untuk kelas yang masih terbuka.
            </p>
          </div>

          <SurfaceCard className="space-y-5 p-6">
            <div className="flex items-center justify-between gap-4">
              <div className="text-sm font-medium text-slate-500">Status kelas</div>
              <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
                {schedule.data.status}
              </span>
            </div>
            <div className="grid gap-3 text-sm leading-7 text-slate-600">
              <div>
                <span className="font-semibold text-slate-900">Tanggal:</span> {formatDateRange(schedule.data.startDate, schedule.data.endDate)}
              </div>
              <div>
                <span className="font-semibold text-slate-900">Lokasi:</span> {schedule.data.location}
              </div>
              <div>
                <span className="font-semibold text-slate-900">Kuota:</span> {schedule.data.quota} peserta
              </div>
              <div>
                <span className="font-semibold text-slate-900">Sisa kuota:</span> {remainingQuota} peserta
              </div>
            </div>
          </SurfaceCard>
        </section>

        <section className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-start">
          <div className="space-y-8">
            <SurfaceCard className="p-6">
              <h2 className="text-2xl font-semibold text-ink">Ringkasan informasi</h2>
              <p className="mt-4 text-sm leading-8 text-slate-600">
                Halaman ini disiapkan sebagai titik konversi utama untuk pengunjung yang sudah tertarik mengikuti kelas dan membutuhkan informasi singkat sebelum mendaftar.
              </p>
              <div className="mt-5 grid gap-3 text-sm leading-7 text-slate-600">
                {scheduleNotes.map((item) => (
                  <div key={item} className="rounded-2xl bg-slate-50 px-4 py-4">
                    {item}
                  </div>
                ))}
              </div>
            </SurfaceCard>

            <SurfaceCard className="p-6">
              <SectionHeading
                eyebrow="Terkait"
                title="Pelatihan asal"
                description="Jika pengunjung ingin memahami gambaran lengkap materi dan konteks program, arahkan kembali ke halaman detail pelatihan."
              />
              <div className="mt-6">
                <Link to={`/pelatihan/${schedule.data.training.slug}`} className="text-base font-semibold text-primary-600 hover:text-primary-700">
                  {schedule.data.training.title}
                </Link>
              </div>
            </SurfaceCard>
          </div>

          <ParticipantRegistrationForm scheduleId={schedule.data.id} />
        </section>
      </div>
    </div>
  );
}
