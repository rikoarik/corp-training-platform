import { Link } from 'react-router-dom';
import { StatusBadge } from '../../components/ui/Ui';
import { useAdminListState } from '../../hooks/useAdminListState';
import { useAsyncData } from '../../hooks/useAsyncData';
import { formatDate } from '../../lib/format';
import { getAdminUsers } from '../../services/admin';
import { AdminDataPage } from './AdminDataPage';

export function AdminUsersPage() {
  const users = useAsyncData(() => getAdminUsers(), []);
  const listState = useAdminListState();
  const filteredUsers = (users.data ?? []).filter((user) =>
    [user.name, user.email, user.role].join(' ').toLowerCase().includes(listState.normalizedQuery),
  );

  return (
    <AdminDataPage
      eyebrow="Admin • Users"
      title="Daftar user admin"
      description="Kelola akun yang dapat mengakses back office, perbarui role, dan tambah user baru saat diperlukan."
      loading={users.loading}
      error={users.error}
      isEmpty={!users.data?.length}
      emptyTitle="Belum ada user"
      emptyDescription="Tambahkan user baru ketika dibutuhkan untuk operasional admin atau editor konten."
      actions={
        <Link to="/admin/users/new" className="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-primary-200 hover:text-primary-600">
          Tambah user
        </Link>
      }
    >
      <div className="space-y-4">
        <div className="px-6 pt-6">
          <input
            className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm"
            placeholder="Cari nama, email, atau role user..."
            value={listState.query}
            onChange={(event) => listState.setQuery(event.target.value)}
          />
        </div>
        <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-6 py-4 font-semibold text-slate-600">Nama</th>
              <th className="px-6 py-4 font-semibold text-slate-600">Email</th>
              <th className="px-6 py-4 font-semibold text-slate-600">Role</th>
              <th className="px-6 py-4 font-semibold text-slate-600">Dibuat</th>
              <th className="px-6 py-4 text-right font-semibold text-slate-600">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 bg-white">
            {filteredUsers.length ? (
              filteredUsers.map((user) => (
                <tr key={user.id}>
                  <td className="px-6 py-4 font-medium text-ink">{user.name}</td>
                  <td className="px-6 py-4 text-slate-600">{user.email}</td>
                  <td className="px-6 py-4 text-slate-600">
                    <StatusBadge status={user.role} />
                  </td>
                  <td className="px-6 py-4 text-slate-600">{formatDate(user.createdAt)}</td>
                  <td className="px-6 py-4 text-right">
                    <Link to={`/admin/users/${user.id}`} className="text-sm font-semibold text-primary-600 transition hover:text-primary-700">
                      Edit
                    </Link>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-sm text-slate-500">
                  Tidak ada user yang cocok dengan pencarian.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </AdminDataPage>
  );
}
