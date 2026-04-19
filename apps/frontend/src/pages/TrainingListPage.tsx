import { useMemo, useState } from 'react';
import { TrainingCard } from '../components/public/Cards';
import { ButtonLink, EmptyState, LoadingState, SectionHeading } from '../components/ui/Ui';
import { useAsyncData } from '../hooks/useAsyncData';
import { getCategories, getTrainings } from '../services/public';

export function TrainingListPage() {
  const [selectedCategoryId, setSelectedCategoryId] = useState('');
  const categories = useAsyncData(() => getCategories(), []);
  const trainings = useAsyncData(() => getTrainings({ categoryId: selectedCategoryId || undefined, limit: 50 }), [selectedCategoryId]);

  const categoryOptions = useMemo(() => categories.data ?? [], [categories.data]);

  return (
    <div className="section-space">
      <div className="page-shell space-y-10">
        <SectionHeading
          eyebrow="Layanan & pelatihan"
          title="Katalog pelatihan yang mudah dipilah dan siap digunakan untuk penawaran"
          description="Halaman ini mengambil data langsung dari backend agar daftar program, kategori, dan detail ringkas tetap sinkron dengan informasi operasional."
        />

        <div className="card-surface flex flex-col gap-4 p-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="text-sm font-semibold text-ink">Filter kategori</div>
            <p className="mt-2 text-sm text-slate-500">Pilih kategori untuk menyaring program yang paling relevan dengan kebutuhan pengunjung.</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => setSelectedCategoryId('')}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                selectedCategoryId === '' ? 'bg-primary-500 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Semua kategori
            </button>
            {categoryOptions.map((category) => (
              <button
                key={category.id}
                type="button"
                onClick={() => setSelectedCategoryId(category.id)}
                className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                  selectedCategoryId === category.id ? 'bg-primary-500 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>

        {trainings.loading ? <LoadingState label="Memuat daftar pelatihan..." /> : null}
        {trainings.error ? (
          <EmptyState
            title="Pelatihan tidak bisa dimuat"
            description={trainings.error}
            action={<ButtonLink to="/jadwal">Lihat jadwal yang tersedia</ButtonLink>}
          />
        ) : null}
        {trainings.data?.length === 0 ? (
          <EmptyState
            title="Belum ada pelatihan pada kategori ini"
            description="Coba pilih kategori lain atau lihat jadwal yang sedang dibuka untuk menemukan program yang sesuai."
            action={<ButtonLink to="/jadwal">Cek jadwal pelatihan</ButtonLink>}
          />
        ) : null}
        {trainings.data?.length ? (
          <div className="grid gap-6 lg:grid-cols-3">
            {trainings.data.map((training) => (
              <TrainingCard key={training.id} training={training} />
            ))}
          </div>
        ) : null}
      </div>
    </div>
  );
}
