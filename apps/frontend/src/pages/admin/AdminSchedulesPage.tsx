import { Link } from 'react-router-dom';
import { useAdminListState } from '../../hooks/useAdminListState';
import { useAsyncData } from '../../hooks/useAsyncData';
import { formatDateRange } from '../../lib/format';
import { deleteAdminSchedule, getAdminSchedules } from '../../services/admin';
import { AdminDataPage } from './AdminDataPage';

export function AdminSchedulesPage() {
  const schedules = useAsyncData(() => getAdminSchedules(), []);
  const listState = useAdminListState();
  const filteredSchedules = (schedules.data ?? []).filter((schedule) =>
    [schedule.title, schedule.training.title, schedule.location, schedule.status].join(' ').toLowerCase().includes(listState.normalizedQuery),
  );

  async function handleDelete(id: string) {
    if (!window.confirm('Hapus jadwal ini? Data peserta terkait bisa ikut terhapus.')) {
      return;
    }

    await listState.runRowAction(id, async () => {
      await deleteAdminSchedule(id);
      await schedules.reload();
    }, 'Gagal menghapus jadwal.');
  }

  return (
    <AdminDataPage
      eyebrow="Admin • Schedules"
      title="Daftar jadwal kelas"
      description="Lihat jadwal yang sudah dibuat, lokasi, status, dan keterkaitannya dengan pelatihan inti."
      loading={schedules.loading}
      error={schedules.error}
      isEmpty={!schedules.data?.length}
      emptyTitle="Belum ada jadwal"
      emptyDescription="Tambahkan jadwal baru untuk membuka pendaftaran peserta di frontend public."
      actions={
        <Link to="/admin/schedules/new" className="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-primary-200 hover:text-primary-600">
          Tambah jadwal
        </Link>
      }
    >
      <div className="space-y-4">
        <div className="px-6 pt-6">
          <input
            className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm"
            placeholder="Cari judul, pelatihan, lokasi, atau status jadwal..."
            value={listState.query}
            onChange={(event) => listState.setQuery(event.target.value)}
          />
        </div>
        {listState.actionError ? <div className="mx-6 rounded-2xl bg-rose-50 px-4 py-3 text-sm text-rose-700">{listState.actionError}</div> : null}
        <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-6 py-4 font-semibold text-slate-600">Judul</th>
              <th className="px-6 py-4 font-semibold text-slate-600">Pelatihan</th>
              <th className="px-6 py-4 font-semibold text-slate-600">Tanggal</th>
              <th className="px-6 py-4 font-semibold text-slate-600">Lokasi</th>
              <th className="px-6 py-4 font-semibold text-slate-600">Status</th>
              <th className="px-6 py-4 text-right font-semibold text-slate-600">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 bg-white">
            {filteredSchedules.length ? (
              filteredSchedules.map((schedule) => (
                <tr key={schedule.id}>
                  <td className="px-6 py-4 font-medium text-ink">{schedule.title}</td>
                  <td className="px-6 py-4 text-slate-600">{schedule.training.title}</td>
                  <td className="px-6 py-4 text-slate-600">{formatDateRange(schedule.startDate, schedule.endDate)}</td>
                  <td className="px-6 py-4 text-slate-600">{schedule.location}</td>
                  <td className="px-6 py-4 text-slate-600">{schedule.status}</td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap justify-end gap-3">
                      <Link to={`/admin/schedules/${schedule.id}`} className="text-sm font-semibold text-primary-600 transition hover:text-primary-700">
                        Edit
                      </Link>
                      <button
                        type="button"
                        onClick={() => void handleDelete(schedule.id)}
                        disabled={listState.actionId === schedule.id}
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
                <td colSpan={6} className="px-6 py-8 text-center text-sm text-slate-500">
                  Tidak ada jadwal yang cocok dengan pencarian.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </AdminDataPage>
  );
}
