import { Link } from 'react-router-dom';
import { EmptyState, LoadingState, SurfaceCard } from '../../components/ui/Ui';
import { useAsyncData } from '../../hooks/useAsyncData';
import {
  getAdminArticles,
  getAdminCategories,
  getAdminParticipants,
  getAdminSchedules,
  getAdminTrainings,
  getAdminUsers,
} from '../../services/admin';

const quickActions = [
  { label: 'Tambah kategori', to: '/admin/categories/new' },
  { label: 'Tambah pelatihan', to: '/admin/trainings/new' },
  { label: 'Tambah jadwal', to: '/admin/schedules/new' },
  { label: 'Tambah artikel', to: '/admin/articles/new' },
];

export function AdminDashboardPage() {
  const summary = useAsyncData(async () => {
    const [users, categories, trainings, schedules, participants, articles] = await Promise.all([
      getAdminUsers(),
      getAdminCategories(),
      getAdminTrainings(),
      getAdminSchedules(),
      getAdminParticipants(),
      getAdminArticles(),
    ]);

    return {
      users: users.length,
      categories: categories.length,
      trainings: trainings.length,
      publishedTrainings: trainings.filter((item) => item.status === 'PUBLISHED').length,
      schedules: schedules.length,
      openSchedules: schedules.filter((item) => item.status === 'OPEN').length,
      participants: participants.length,
      confirmedParticipants: participants.filter((item) => item.status === 'CONFIRMED').length,
      articles: articles.length,
      publishedArticles: articles.filter((item) => item.status === 'PUBLISHED').length,
      draftArticles: articles.filter((item) => item.status === 'DRAFT').length,
    };
  }, []);

  if (summary.loading) {
    return <LoadingState label="Memuat ringkasan admin..." />;
  }

  if (summary.error || !summary.data) {
    return <EmptyState title="Dashboard belum bisa dimuat" description={summary.error ?? 'Data admin tidak tersedia saat ini.'} />;
  }

  return (
    <div className="space-y-8">
      <div>
        <div className="eyebrow">Admin overview</div>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight text-ink">Ringkasan operasional back office</h1>
        <p className="mt-4 max-w-3xl text-base leading-8 text-slate-600">
          Pantau modul inti yang sudah aktif di backend dan lompat cepat ke aksi yang paling sering dipakai tim admin.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        <SurfaceCard className="p-6">
          <div className="text-sm font-medium text-slate-500">Kategori aktif</div>
          <div className="mt-4 text-4xl font-semibold text-primary-600">{summary.data.categories}</div>
          <div className="mt-2 text-sm text-slate-500">Struktur layanan yang tampil di katalog.</div>
        </SurfaceCard>
        <SurfaceCard className="p-6">
          <div className="text-sm font-medium text-slate-500">Pelatihan</div>
          <div className="mt-4 text-4xl font-semibold text-primary-600">{summary.data.trainings}</div>
          <div className="mt-2 text-sm text-slate-500">{summary.data.publishedTrainings} sudah published.</div>
        </SurfaceCard>
        <SurfaceCard className="p-6">
          <div className="text-sm font-medium text-slate-500">Jadwal</div>
          <div className="mt-4 text-4xl font-semibold text-primary-600">{summary.data.schedules}</div>
          <div className="mt-2 text-sm text-slate-500">{summary.data.openSchedules} kelas masih open.</div>
        </SurfaceCard>
        <SurfaceCard className="p-6">
          <div className="text-sm font-medium text-slate-500">Peserta</div>
          <div className="mt-4 text-4xl font-semibold text-primary-600">{summary.data.participants}</div>
          <div className="mt-2 text-sm text-slate-500">{summary.data.confirmedParticipants} sudah confirmed.</div>
        </SurfaceCard>
        <SurfaceCard className="p-6">
          <div className="text-sm font-medium text-slate-500">Artikel</div>
          <div className="mt-4 text-4xl font-semibold text-primary-600">{summary.data.articles}</div>
          <div className="mt-2 text-sm text-slate-500">{summary.data.publishedArticles} published, {summary.data.draftArticles} draft.</div>
        </SurfaceCard>
        <SurfaceCard className="p-6">
          <div className="text-sm font-medium text-slate-500">User admin</div>
          <div className="mt-4 text-4xl font-semibold text-primary-600">{summary.data.users}</div>
          <div className="mt-2 text-sm text-slate-500">Akun yang punya akses ke back office.</div>
        </SurfaceCard>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
        <SurfaceCard className="p-6">
          <h2 className="text-2xl font-semibold text-ink">Ikhtisar yang perlu dipantau</h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <div className="rounded-3xl bg-slate-50 p-5">
              <div className="text-sm font-medium text-slate-500">Kesiapan katalog</div>
              <div className="mt-3 text-2xl font-semibold text-ink">{summary.data.publishedTrainings}/{summary.data.trainings}</div>
              <p className="mt-2 text-sm leading-7 text-slate-500">Pelatihan yang sudah siap tampil penuh di website public.</p>
            </div>
            <div className="rounded-3xl bg-slate-50 p-5">
              <div className="text-sm font-medium text-slate-500">Kelas berjalan</div>
              <div className="mt-3 text-2xl font-semibold text-ink">{summary.data.openSchedules}</div>
              <p className="mt-2 text-sm leading-7 text-slate-500">Jadwal yang masih menerima peserta baru saat ini.</p>
            </div>
            <div className="rounded-3xl bg-slate-50 p-5">
              <div className="text-sm font-medium text-slate-500">Follow up peserta</div>
              <div className="mt-3 text-2xl font-semibold text-ink">{summary.data.participants - summary.data.confirmedParticipants}</div>
              <p className="mt-2 text-sm leading-7 text-slate-500">Peserta yang belum confirmed dan masih perlu tindak lanjut.</p>
            </div>
            <div className="rounded-3xl bg-slate-50 p-5">
              <div className="text-sm font-medium text-slate-500">Pipeline artikel</div>
              <div className="mt-3 text-2xl font-semibold text-ink">{summary.data.draftArticles}</div>
              <p className="mt-2 text-sm leading-7 text-slate-500">Draft insight yang masih menunggu review atau publish.</p>
            </div>
          </div>
        </SurfaceCard>

        <SurfaceCard className="p-6">
          <h2 className="text-2xl font-semibold text-ink">Aksi cepat</h2>
          <p className="mt-3 text-sm leading-7 text-slate-600">Shortcut untuk pekerjaan admin yang paling sering dilakukan setiap hari.</p>
          <div className="mt-6 grid gap-3">
            {quickActions.map((action) => (
              <Link
                key={action.to}
                to={action.to}
                className="rounded-2xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:border-primary-200 hover:text-primary-600"
              >
                {action.label}
              </Link>
            ))}
            <Link
              to="/admin/participants"
              className="rounded-2xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:border-primary-200 hover:text-primary-600"
            >
              Lihat peserta masuk
            </Link>
            <Link
              to="/admin/articles"
              className="rounded-2xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:border-primary-200 hover:text-primary-600"
            >
              Kelola status artikel
            </Link>
          </div>
        </SurfaceCard>
      </div>
    </div>
  );
}
