import { StatusBadge } from '../../components/ui/Ui';
import { useAdminListState } from '../../hooks/useAdminListState';
import { useAsyncData } from '../../hooks/useAsyncData';
import { formatDate, formatDateRange } from '../../lib/format';
import { getAdminParticipants, markAdminParticipantAttendance, updateAdminParticipant } from '../../services/admin';
import { AdminDataPage } from './AdminDataPage';

export function AdminParticipantsPage() {
  const participants = useAsyncData(() => getAdminParticipants(), []);
  const listState = useAdminListState();
  const filteredParticipants = (participants.data ?? []).filter((participant) =>
    [
      participant.name,
      participant.email,
      participant.phone ?? '',
      participant.status,
      participant.schedule.training.title,
      participant.schedule.title,
      participant.schedule.location,
    ]
      .join(' ')
      .toLowerCase()
      .includes(listState.normalizedQuery),
  );

  async function handleConfirm(id: string) {
    await listState.runRowAction(id, async () => {
      await markAdminParticipantAttendance(id);
      await participants.reload();
    }, 'Gagal mengonfirmasi peserta.');
  }

  async function handleCancel(id: string) {
    await listState.runRowAction(id, async () => {
      await updateAdminParticipant(id, { status: 'CANCELLED' });
      await participants.reload();
    }, 'Gagal membatalkan peserta.');
  }

  return (
    <AdminDataPage
      eyebrow="Admin • Participants"
      title="Daftar peserta"
      description="Pantau pendaftar yang masuk dari website public dan tindak lanjuti statusnya langsung dari tabel ini."
      loading={participants.loading}
      error={participants.error}
      isEmpty={!participants.data?.length}
      emptyTitle="Belum ada peserta"
      emptyDescription="Peserta yang berhasil mendaftar akan muncul di sini untuk dipantau dan ditindaklanjuti."
    >
      <div className="space-y-4">
        <div className="px-6 pt-6">
          <input
            className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm"
            placeholder="Cari nama, email, pelatihan, jadwal, lokasi, atau status peserta..."
            value={listState.query}
            onChange={(event) => listState.setQuery(event.target.value)}
          />
        </div>
        {listState.actionError ? <div className="mx-6 rounded-2xl bg-rose-50 px-4 py-3 text-sm text-rose-700">{listState.actionError}</div> : null}
        <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-6 py-4 font-semibold text-slate-600">Nama</th>
              <th className="px-6 py-4 font-semibold text-slate-600">Email</th>
              <th className="px-6 py-4 font-semibold text-slate-600">Jadwal</th>
              <th className="px-6 py-4 font-semibold text-slate-600">Status</th>
              <th className="px-6 py-4 font-semibold text-slate-600">Masuk</th>
              <th className="px-6 py-4 text-right font-semibold text-slate-600">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 bg-white">
            {filteredParticipants.length ? (
              filteredParticipants.map((participant) => (
                <tr key={participant.id}>
                  <td className="px-6 py-4 font-medium text-ink">{participant.name}</td>
                  <td className="px-6 py-4 text-slate-600">{participant.email}</td>
                  <td className="px-6 py-4 text-slate-600">
                    <div className="font-medium text-ink">{participant.schedule.training.title}</div>
                    <div className="mt-1 text-xs text-slate-500">{formatDateRange(participant.schedule.startDate, participant.schedule.endDate)}</div>
                  </td>
                  <td className="px-6 py-4 text-slate-600">
                    <StatusBadge status={participant.status} />
                  </td>
                  <td className="px-6 py-4 text-slate-600">{formatDate(participant.createdAt)}</td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap justify-end gap-3">
                      {participant.status === 'REGISTERED' ? (
                        <button
                          type="button"
                          onClick={() => void handleConfirm(participant.id)}
                          disabled={listState.actionId === participant.id}
                          className="text-sm font-semibold text-emerald-600 transition hover:text-emerald-700 disabled:cursor-not-allowed disabled:text-slate-400"
                        >
                          Konfirmasi
                        </button>
                      ) : null}
                      {participant.status !== 'CANCELLED' ? (
                        <button
                          type="button"
                          onClick={() => void handleCancel(participant.id)}
                          disabled={listState.actionId === participant.id}
                          className="text-sm font-semibold text-rose-600 transition hover:text-rose-700 disabled:cursor-not-allowed disabled:text-slate-400"
                        >
                          Batalkan
                        </button>
                      ) : null}
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="px-6 py-8 text-center text-sm text-slate-500">
                  Tidak ada peserta yang cocok dengan pencarian.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </AdminDataPage>
  );
}
