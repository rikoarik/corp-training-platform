import { Link } from 'react-router-dom';
import { useAdminListState } from '../../hooks/useAdminListState';
import { useAsyncData } from '../../hooks/useAsyncData';
import { deleteAdminCategory, getAdminCategories } from '../../services/admin';
import { AdminDataPage } from './AdminDataPage';

export function AdminCategoriesPage() {
  const categories = useAsyncData(() => getAdminCategories(), []);
  const listState = useAdminListState();
  const filteredCategories = (categories.data ?? []).filter((category) =>
    [category.name, category.slug, category.description ?? ''].join(' ').toLowerCase().includes(listState.normalizedQuery),
  );

  async function handleDelete(id: string) {
    if (!window.confirm('Hapus kategori ini? Data terkait bisa ikut terdampak.')) {
      return;
    }

    await listState.runRowAction(id, async () => {
      await deleteAdminCategory(id);
      await categories.reload();
    }, 'Gagal menghapus kategori.');
  }

  return (
    <AdminDataPage
      eyebrow="Admin • Categories"
      title="Daftar kategori layanan"
      description="Kategori digunakan sebagai pengelompokan pelatihan di katalog public dan admin."
      loading={categories.loading}
      error={categories.error}
      isEmpty={!categories.data?.length}
      emptyTitle="Belum ada kategori"
      emptyDescription="Buat kategori baru ketika struktur layanan sudah ditetapkan."
      actions={
        <Link to="/admin/categories/new" className="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-primary-200 hover:text-primary-600">
          Tambah kategori
        </Link>
      }
    >
      <div className="space-y-4">
        <div className="px-6 pt-6">
          <input
            className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm"
            placeholder="Cari nama atau slug kategori..."
            value={listState.query}
            onChange={(event) => listState.setQuery(event.target.value)}
          />
        </div>
        {listState.actionError ? <div className="mx-6 rounded-2xl bg-rose-50 px-4 py-3 text-sm text-rose-700">{listState.actionError}</div> : null}
        <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-6 py-4 font-semibold text-slate-600">Nama</th>
              <th className="px-6 py-4 font-semibold text-slate-600">Slug</th>
              <th className="px-6 py-4 font-semibold text-slate-600">Training</th>
              <th className="px-6 py-4 text-right font-semibold text-slate-600">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 bg-white">
            {filteredCategories.length ? (
              filteredCategories.map((category) => (
                <tr key={category.id}>
                  <td className="px-6 py-4 font-medium text-ink">{category.name}</td>
                  <td className="px-6 py-4 text-slate-600">{category.slug}</td>
                  <td className="px-6 py-4 text-slate-600">{category._count?.trainings ?? 0}</td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap justify-end gap-3">
                      <Link to={`/admin/categories/${category.id}`} className="text-sm font-semibold text-primary-600 transition hover:text-primary-700">
                        Edit
                      </Link>
                      <button
                        type="button"
                        onClick={() => void handleDelete(category.id)}
                        disabled={listState.actionId === category.id}
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
                <td colSpan={4} className="px-6 py-8 text-center text-sm text-slate-500">
                  Tidak ada kategori yang cocok dengan pencarian.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </AdminDataPage>
  );
}
