import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AdminFormPageShell } from '../../components/admin/AdminFormPageShell';
import { slugifyText } from '../../lib/format';
import { createAdminCategory, getAdminCategoryById, updateAdminCategory } from '../../services/admin';

type CategoryFormState = {
  name: string;
  slug: string;
  description: string;
};

const initialForm: CategoryFormState = {
  name: '',
  slug: '',
  description: '',
};

export function AdminCategoryFormPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);
  const [form, setForm] = useState<CategoryFormState>(initialForm);
  const [slugTouched, setSlugTouched] = useState(isEdit);
  const [loading, setLoading] = useState(isEdit);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  function updateField<K extends keyof CategoryFormState>(key: K, value: CategoryFormState[K]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  useEffect(() => {
    if (!slugTouched) {
      updateField('slug', slugifyText(form.name));
    }
  }, [form.name, slugTouched]);

  useEffect(() => {
    async function load() {
      if (!id) {
        setLoading(false);
        return;
      }

      try {
        const category = await getAdminCategoryById(id);
        setForm({
          name: category.name,
          slug: category.slug,
          description: category.description ?? '',
        });
        setSlugTouched(true);
      } catch (error) {
        setErrorMessage(error instanceof Error ? error.message : 'Gagal memuat kategori.');
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
      if (isEdit && id) {
        await updateAdminCategory(id, form);
      } else {
        await createAdminCategory(form);
      }

      navigate('/admin/categories');
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Gagal menyimpan kategori.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <AdminFormPageShell
      eyebrow="Admin • Categories"
      title={isEdit ? 'Edit kategori' : 'Tambah kategori'}
      backTo="/admin/categories"
      loading={loading}
      loadingLabel="Memuat data kategori..."
      errorMessage={errorMessage}
      onSubmit={handleSubmit}
      submitLabel="Simpan kategori"
      submitting={submitting}
    >
      <label className="block space-y-2 text-sm font-medium text-slate-700">
        <span>Nama</span>
        <input className="w-full rounded-2xl border border-slate-200 px-4 py-3" value={form.name} onChange={(event) => updateField('name', event.target.value)} required minLength={2} />
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
          minLength={2}
        />
      </label>
      <label className="block space-y-2 text-sm font-medium text-slate-700">
        <span>Deskripsi</span>
        <textarea className="min-h-32 w-full rounded-2xl border border-slate-200 px-4 py-3" value={form.description} onChange={(event) => updateField('description', event.target.value)} />
      </label>
    </AdminFormPageShell>
  );
}
