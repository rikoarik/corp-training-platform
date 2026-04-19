import { Link } from 'react-router-dom';
import { useAdminListState } from '../../hooks/useAdminListState';
import { useAsyncData } from '../../hooks/useAsyncData';
import { formatCurrency } from '../../lib/format';
import { deleteAdminTraining, getAdminTrainings } from '../../services/admin';
import { AdminDataPage } from './AdminDataPage';

export function AdminTrainingsPage() {
  const trainings = useAsyncData(() => getAdminTrainings(), []);
  const listState = useAdminListState();
  const filteredTrainings = (trainings.data ?? []).filter((training) =>
    [training.title, training.slug, training.category.name, training.status].join(' ').toLowerCase().includes(listState.normalizedQuery),
  );

  async function handleDelete(id: string) {
    if (!window.confirm('Hapus pelatihan ini? Jadwal terkait bisa ikut terhapus.')) {
      return;
    }

    await listState.runRowAction(id, async () => {
      await deleteAdminTraining(id);
      await trainings.reload();
    }, 'Gagal menghapus pelatihan.');
  }

  return (
    <AdminDataPage
      eyebrow="Admin • Trainings"
      title="Daftar pelatihan"
      description="Pantau program aktif, harga, kategori, dan jumlah jadwal yang sudah terkait dengan setiap pelatihan."
      loading={trainings.loading}
      error={trainings.error}
      isEmpty={!trainings.data?.length}
      emptyTitle="Belum ada pelatihan"
      emptyDescription="Tambahkan data pelatihan untuk mulai mengisi katalog dan jadwal public."
      actions={
        <Link to="/admin/trainings/new" className="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-primary-200 hover:text-primary-600">
          Tambah pelatihan
        </Link>
      }
    >
      <div className="space-y-4">
        <div className="px-6 pt-6">
          <input
            className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm"
            placeholder="Cari judul, slug, kategori, atau status pelatihan..."
            value={listState.query}
            onChange={(event) => listState.setQuery(event.target.value)}
          />
        </div>
        {listState.actionError ? <div className="mx-6 rounded-2xl bg-rose-50 px-4 py-3 text-sm text-rose-700">{listState.actionError}</div> : null}
        <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-6 py-4 font-semibold text-slate-600">Judul</th>
              <th className="px-6 py-4 font-semibold text-slate-600">Kategori</th>
              <th className="px-6 py-4 font-semibold text-slate-600">Harga</th>
              <th className="px-6 py-4 font-semibold text-slate-600">Status</th>
              <th className="px-6 py-4 text-right font-semibold text-slate-600">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 bg-white">
            {filteredTrainings.length ? (
              filteredTrainings.map((training) => (
                <tr key={training.id}>
                  <td className="px-6 py-4 font-medium text-ink">{training.title}</td>
                  <td className="px-6 py-4 text-slate-600">{training.category.name}</td>
                  <td className="px-6 py-4 text-slate-600">{formatCurrency(training.price)}</td>
                  <td className="px-6 py-4 text-slate-600">{training.status}</td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap justify-end gap-3">
                      <Link to={`/admin/trainings/${training.id}`} className="text-sm font-semibold text-primary-600 transition hover:text-primary-700">
                        Edit
                      </Link>
                      <button
                        type="button"
                        onClick={() => void handleDelete(training.id)}
                        disabled={listState.actionId === training.id}
                        className="text-sm font-semibold text-rose-600 transition hover:text-rose-700 disabled:cursor-not-allowed disabled:text-slate-400"
                      >
                        Hapus
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-sm text-slate-500">
                  Tidak ada pelatihan yang cocok dengan pencarian.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </AdminDataPage>
  );
}
