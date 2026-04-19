import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AdminFormPageShell } from '../../components/admin/AdminFormPageShell';
import { slugifyText } from '../../lib/format';
import { createAdminTraining, getAdminCategories, getAdminTrainingById, updateAdminTraining } from '../../services/admin';
import type { Category } from '../../types/api';

type TrainingFormState = {
  categoryId: string;
  title: string;
  slug: string;
  description: string;
  price: string;
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
};

const initialForm: TrainingFormState = {
  categoryId: '',
  title: '',
  slug: '',
  description: '',
  price: '0',
  status: 'DRAFT',
};

export function AdminTrainingFormPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);
  const [categories, setCategories] = useState<Category[]>([]);
  const [form, setForm] = useState<TrainingFormState>(initialForm);
  const [slugTouched, setSlugTouched] = useState(isEdit);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  function updateField<K extends keyof TrainingFormState>(key: K, value: TrainingFormState[K]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  useEffect(() => {
    if (!slugTouched) {
      updateField('slug', slugifyText(form.title));
    }
  }, [form.title, slugTouched]);

  useEffect(() => {
    async function load() {
      try {
        const categoryData = await getAdminCategories();
        setCategories(categoryData);

        if (id) {
          const training = await getAdminTrainingById(id);
          setForm({
            categoryId: training.categoryId,
            title: training.title,
            slug: training.slug,
            description: training.description,
            price: String(training.price),
            status: training.status,
          });
          setSlugTouched(true);
        } else {
          setForm((current) => ({
            ...current,
            categoryId: categoryData[0]?.id ?? '',
          }));
        }
      } catch (error) {
        setErrorMessage(error instanceof Error ? error.message : 'Gagal memuat data pelatihan.');
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
        categoryId: form.categoryId,
        title: form.title,
        slug: form.slug,
        description: form.description,
        price: Number(form.price),
        status: form.status,
      };

      if (isEdit && id) {
        await updateAdminTraining(id, payload);
      } else {
        await createAdminTraining(payload);
      }

      navigate('/admin/trainings');
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Gagal menyimpan pelatihan.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <AdminFormPageShell
      eyebrow="Admin • Trainings"
      title={isEdit ? 'Edit pelatihan' : 'Tambah pelatihan'}
      backTo="/admin/trainings"
      loading={loading}
      loadingLabel="Memuat data pelatihan..."
      errorMessage={errorMessage}
      onSubmit={handleSubmit}
      submitLabel="Simpan pelatihan"
      submitting={submitting}
      formClassName="card-surface grid gap-5 p-8 lg:grid-cols-2"
      statusClassName="lg:col-span-2"
      submitContainerClassName="lg:col-span-2"
    >
      <label className="block space-y-2 text-sm font-medium text-slate-700">
        <span>Kategori</span>
        <select className="w-full rounded-2xl border border-slate-200 px-4 py-3" value={form.categoryId} onChange={(event) => updateField('categoryId', event.target.value)} required>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>{category.name}</option>
          ))}
        </select>
      </label>
      <label className="block space-y-2 text-sm font-medium text-slate-700">
        <span>Status</span>
        <select className="w-full rounded-2xl border border-slate-200 px-4 py-3" value={form.status} onChange={(event) => updateField('status', event.target.value as 'DRAFT' | 'PUBLISHED' | 'ARCHIVED')}>
          <option value="DRAFT">DRAFT</option>
          <option value="PUBLISHED">PUBLISHED</option>
          <option value="ARCHIVED">ARCHIVED</option>
        </select>
      </label>
      <label className="block space-y-2 text-sm font-medium text-slate-700 lg:col-span-2">
        <span>Judul</span>
        <input className="w-full rounded-2xl border border-slate-200 px-4 py-3" value={form.title} onChange={(event) => updateField('title', event.target.value)} required minLength={3} />
      </label>
      <label className="block space-y-2 text-sm font-medium text-slate-700">
        <span>Slug</span>
        <input
          className="w-full rounded-2xl border border-slate-200 px-4 py-3"
          value={form.slug}
          onChange={(event) => {
            const nextSlug = event.target.value;
            updateField('slug', nextSlug);
            setSlugTouched(nextSlug.trim().length > 0);
          }}
          required
          minLength={3}
        />
      </label>
      <label className="block space-y-2 text-sm font-medium text-slate-700">
        <span>Harga</span>
        <input className="w-full rounded-2xl border border-slate-200 px-4 py-3" type="number" min="0" value={form.price} onChange={(event) => updateField('price', event.target.value)} required />
      </label>
      <label className="block space-y-2 text-sm font-medium text-slate-700 lg:col-span-2">
        <span>Deskripsi</span>
        <textarea className="min-h-40 w-full rounded-2xl border border-slate-200 px-4 py-3" value={form.description} onChange={(event) => updateField('description', event.target.value)} required />
      </label>
    </AdminFormPageShell>
  );
}
