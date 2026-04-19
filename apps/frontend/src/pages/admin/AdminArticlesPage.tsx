import { Link } from 'react-router-dom';
import { StatusBadge } from '../../components/ui/Ui';
import { useAdminListState } from '../../hooks/useAdminListState';
import { useAsyncData } from '../../hooks/useAsyncData';
import { formatDate } from '../../lib/format';
import { archiveAdminArticle, deleteAdminArticle, getAdminArticles, publishAdminArticle } from '../../services/admin';
import { AdminDataPage } from './AdminDataPage';

export function AdminArticlesPage() {
  const articles = useAsyncData(() => getAdminArticles(), []);
  const listState = useAdminListState();
  const filteredArticles = (articles.data ?? []).filter((article) =>
    [article.title, article.slug, article.author.name, article.author.email, article.status]
      .join(' ')
      .toLowerCase()
      .includes(listState.normalizedQuery),
  );

  async function handlePublish(id: string) {
    await listState.runRowAction(id, async () => {
      await publishAdminArticle(id);
      await articles.reload();
    }, 'Gagal mempublikasikan artikel.');
  }

  async function handleArchive(id: string) {
    await listState.runRowAction(id, async () => {
      await archiveAdminArticle(id);
      await articles.reload();
    }, 'Gagal mengarsipkan artikel.');
  }

  async function handleDelete(id: string) {
    if (!window.confirm('Hapus artikel ini secara permanen?')) {
      return;
    }

    await listState.runRowAction(id, async () => {
      await deleteAdminArticle(id);
      await articles.reload();
    }, 'Gagal menghapus artikel.');
  }

  return (
    <AdminDataPage
      eyebrow="Admin • Articles"
      title="Daftar artikel"
      description="Pantau konten insight, ubah status publish, dan jaga alur editorial tetap rapi dari satu layar."
      loading={articles.loading}
      error={articles.error}
      isEmpty={!articles.data?.length}
      emptyTitle="Belum ada artikel"
      emptyDescription="Mulai tambahkan artikel untuk memperkuat halaman insight dan beranda public."
      actions={
        <Link to="/admin/articles/new" className="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-primary-200 hover:text-primary-600">
          Tambah artikel
        </Link>
      }
    >
      <div className="space-y-4">
        <div className="px-6 pt-6">
          <input
            className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm"
            placeholder="Cari judul, slug, penulis, email, atau status artikel..."
            value={listState.query}
            onChange={(event) => listState.setQuery(event.target.value)}
          />
        </div>
        {listState.actionError ? <div className="mx-6 rounded-2xl bg-rose-50 px-4 py-3 text-sm text-rose-700">{listState.actionError}</div> : null}
        <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-6 py-4 font-semibold text-slate-600">Judul</th>
              <th className="px-6 py-4 font-semibold text-slate-600">Penulis</th>
              <th className="px-6 py-4 font-semibold text-slate-600">Status</th>
              <th className="px-6 py-4 font-semibold text-slate-600">Update terakhir</th>
              <th className="px-6 py-4 text-right font-semibold text-slate-600">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 bg-white">
            {filteredArticles.length ? (
              filteredArticles.map((article) => (
                <tr key={article.id}>
                  <td className="px-6 py-4 font-medium text-ink">{article.title}</td>
                  <td className="px-6 py-4 text-slate-600">{article.author.name}</td>
                  <td className="px-6 py-4 text-slate-600">
                    <StatusBadge status={article.status} />
                  </td>
                  <td className="px-6 py-4 text-slate-600">{formatDate(article.updatedAt)}</td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap justify-end gap-3">
                      <Link to={`/admin/articles/${article.id}`} className="text-sm font-semibold text-primary-600 transition hover:text-primary-700">
                        Edit
                      </Link>
                      {article.status !== 'PUBLISHED' ? (
                        <button
                          type="button"
                          onClick={() => void handlePublish(article.id)}
                          disabled={listState.actionId === article.id}
                          className="text-sm font-semibold text-emerald-600 transition hover:text-emerald-700 disabled:cursor-not-allowed disabled:text-slate-400"
                        >
                          Publish
                        </button>
                      ) : null}
                      {article.status !== 'ARCHIVED' ? (
                        <button
                          type="button"
                          onClick={() => void handleArchive(article.id)}
                          disabled={listState.actionId === article.id}
                          className="text-sm font-semibold text-slate-600 transition hover:text-slate-800 disabled:cursor-not-allowed disabled:text-slate-400"
                        >
                          Archive
                        </button>
                      ) : null}
                      <button
                        type="button"
                        onClick={() => void handleDelete(article.id)}
                        disabled={listState.actionId === article.id}
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
                  Tidak ada artikel yang cocok dengan pencarian.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </AdminDataPage>
  );
}
