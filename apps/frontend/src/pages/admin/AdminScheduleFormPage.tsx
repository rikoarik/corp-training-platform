import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AdminFormPageShell } from '../../components/admin/AdminFormPageShell';
import { createAdminSchedule, getAdminScheduleById, getAdminTrainings, updateAdminSchedule } from '../../services/admin';
import type { Training } from '../../types/api';

type ScheduleFormState = {
  trainingId: string;
  title: string;
  startDate: string;
  endDate: string;
  location: string;
  quota: string;
  status: 'DRAFT' | 'OPEN' | 'CLOSED' | 'COMPLETED' | 'CANCELLED';
};

const initialForm: ScheduleFormState = {
  trainingId: '',
  title: '',
  startDate: '',
  endDate: '',
  location: '',
  quota: '30',
  status: 'OPEN',
};

function toInputDateTime(value: string) {
  return new Date(value).toISOString().slice(0, 16);
}

export function AdminScheduleFormPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);
  const [trainings, setTrainings] = useState<Training[]>([]);
  const [form, setForm] = useState<ScheduleFormState>(initialForm);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  function updateField<K extends keyof ScheduleFormState>(key: K, value: ScheduleFormState[K]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  useEffect(() => {
    async function load() {
      try {
        const trainingData = await getAdminTrainings();
        setTrainings(trainingData);

        if (id) {
          const schedule = await getAdminScheduleById(id);
          setForm({
            trainingId: schedule.trainingId,
            title: schedule.title,
            startDate: toInputDateTime(schedule.startDate),
            endDate: toInputDateTime(schedule.endDate),
            location: schedule.location,
            quota: String(schedule.quota),
            status: schedule.status,
          });
        } else {
          setForm((current) => ({
            ...current,
            trainingId: trainingData[0]?.id ?? '',
          }));
        }
      } catch (error) {
        setErrorMessage(error instanceof Error ? error.message : 'Gagal memuat data jadwal.');
      } finally {
        setLoading(false);
      }
    }

    void load();
  }, [id]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setErrorMessage(null);

    try {
      const payload = {
        trainingId: form.trainingId,
        title: form.title,
        startDate: new Date(form.startDate).toISOString(),
        endDate: new Date(form.endDate).toISOString(),
        location: form.location,
        quota: Number(form.quota),
        status: form.status,
      };

      if (isEdit && id) {
        await updateAdminSchedule(id, payload);
      } else {
        await createAdminSchedule(payload);
      }

      navigate('/admin/schedules');
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Gagal menyimpan jadwal.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <AdminFormPageShell
      eyebrow="Admin • Schedules"
      title={isEdit ? 'Edit jadwal' : 'Tambah jadwal'}
      backTo="/admin/schedules"
      loading={loading}
      loadingLabel="Memuat data jadwal..."
      errorMessage={errorMessage}
      onSubmit={handleSubmit}
      submitLabel="Simpan jadwal"
      submitting={submitting}
      formClassName="card-surface grid gap-5 p-8 lg:grid-cols-2"
      statusClassName="lg:col-span-2"
      submitContainerClassName="lg:col-span-2"
    >
      <label className="block space-y-2 text-sm font-medium text-slate-700">
        <span>Pelatihan</span>
        <select className="w-full rounded-2xl border border-slate-200 px-4 py-3" value={form.trainingId} onChange={(event) => updateField('trainingId', event.target.value)} required>
          {trainings.map((training) => (
            <option key={training.id} value={training.id}>{training.title}</option>
          ))}
        </select>
      </label>
      <label className="block space-y-2 text-sm font-medium text-slate-700">
        <span>Status</span>
        <select className="w-full rounded-2xl border border-slate-200 px-4 py-3" value={form.status} onChange={(event) => updateField('status', event.target.value as 'DRAFT' | 'OPEN' | 'CLOSED' | 'COMPLETED' | 'CANCELLED')}>
          <option value="DRAFT">DRAFT</option>
          <option value="OPEN">OPEN</option>
          <option value="CLOSED">CLOSED</option>
          <option value="COMPLETED">COMPLETED</option>
          <option value="CANCELLED">CANCELLED</option>
        </select>
      </label>
      <label className="block space-y-2 text-sm font-medium text-slate-700 lg:col-span-2">
        <span>Judul jadwal</span>
        <input className="w-full rounded-2xl border border-slate-200 px-4 py-3" value={form.title} onChange={(event) => updateField('title', event.target.value)} required minLength={3} />
      </label>
      <label className="block space-y-2 text-sm font-medium text-slate-700">
        <span>Mulai</span>
        <input className="w-full rounded-2xl border border-slate-200 px-4 py-3" type="datetime-local" value={form.startDate} onChange={(event) => updateField('startDate', event.target.value)} required />
      </label>
      <label className="block space-y-2 text-sm font-medium text-slate-700">
        <span>Selesai</span>
        <input className="w-full rounded-2xl border border-slate-200 px-4 py-3" type="datetime-local" value={form.endDate} onChange={(event) => updateField('endDate', event.target.value)} required />
      </label>
      <label className="block space-y-2 text-sm font-medium text-slate-700">
        <span>Lokasi</span>
        <input className="w-full rounded-2xl border border-slate-200 px-4 py-3" value={form.location} onChange={(event) => updateField('location', event.target.value)} required />
      </label>
      <label className="block space-y-2 text-sm font-medium text-slate-700">
        <span>Kuota</span>
        <input className="w-full rounded-2xl border border-slate-200 px-4 py-3" type="number" min="1" value={form.quota} onChange={(event) => updateField('quota', event.target.value)} required />
      </label>
    </AdminFormPageShell>
  );
}
