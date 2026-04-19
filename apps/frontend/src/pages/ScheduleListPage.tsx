import { useMemo, useState } from 'react';
import { ScheduleCard } from '../components/public/Cards';
import { ButtonLink, EmptyState, LoadingState, SectionHeading } from '../components/ui/Ui';
import { useAsyncData } from '../hooks/useAsyncData';
import { formatMonthLabel } from '../lib/format';
import { getSchedules } from '../services/public';

export function ScheduleListPage() {
  const [locationFilter, setLocationFilter] = useState('');
  const schedules = useAsyncData(() => getSchedules({ limit: 100 }), []);

  const filteredSchedules = useMemo(() => {
    const source = schedules.data ?? [];
    const location = locationFilter.trim().toLowerCase();

    if (!location) {
      return source;
    }

    return source.filter((schedule) => schedule.location.toLowerCase().includes(location));
  }, [locationFilter, schedules.data]);

  const groupedSchedules = useMemo(() => {
    return filteredSchedules.reduce<Record<string, typeof filteredSchedules>>((accumulator, schedule) => {
      const key = formatMonthLabel(schedule.startDate);
      accumulator[key] ??= [];
      accumulator[key].push(schedule);
      return accumulator;
    }, {});
  }, [filteredSchedules]);

  return (
    <div className="section-space">
      <div className="page-shell space-y-10">
        <SectionHeading
          eyebrow="Jadwal pelatihan"
          title="Agenda kelas yang rapi, fokus pada jadwal yang benar-benar terbuka"
          description="Phase 1 menampilkan jadwal dalam format agenda/list yang mudah dibaca sambil tetap membawa informasi penting seperti tanggal, lokasi, dan kuota peserta."
        />

        <div className="card-surface flex flex-col gap-4 p-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="text-sm font-semibold text-ink">Filter lokasi</div>
            <p className="mt-2 text-sm text-slate-500">Gunakan pencarian lokasi sederhana untuk mempersempit daftar jadwal yang relevan.</p>
          </div>
          <input
            value={locationFilter}
            onChange={(event) => setLocationFilter(event.target.value)}
            placeholder="Cari lokasi kelas"
            className="w-full rounded-full border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-primary-400 lg:max-w-xs"
          />
        </div>

        {schedules.loading ? <LoadingState label="Memuat jadwal pelatihan..." /> : null}
        {schedules.error ? (
          <EmptyState
            title="Jadwal tidak bisa dimuat"
            description={schedules.error}
            action={<ButtonLink to="/pelatihan">Lihat katalog pelatihan</ButtonLink>}
          />
        ) : null}
        {filteredSchedules.length === 0 && !schedules.loading && !schedules.error ? (
          <EmptyState
            title="Belum ada jadwal yang sesuai"
            description="Coba ubah kata kunci lokasi atau kembali ke daftar pelatihan untuk melihat program yang tersedia."
            action={<ButtonLink to="/pelatihan">Buka katalog pelatihan</ButtonLink>}
          />
        ) : null}

        <div className="space-y-12">
          {Object.entries(groupedSchedules).map(([monthLabel, monthSchedules]) => (
            <section key={monthLabel} className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="h-px flex-1 bg-slate-200" />
                <div className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">{monthLabel}</div>
                <div className="h-px flex-1 bg-slate-200" />
              </div>
              <div className="grid gap-6 lg:grid-cols-2">
                {monthSchedules.map((schedule) => (
                  <ScheduleCard key={schedule.id} schedule={schedule} />
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}
