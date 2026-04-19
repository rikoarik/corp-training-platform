import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AdminFormPageShell } from '../../components/admin/AdminFormPageShell';
import { slugifyText } from '../../lib/format';
import { createAdminArticle, getAdminArticleById, updateAdminArticle } from '../../services/admin';

type ArticleFormState = {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
  publishedAt: string;
};

const initialForm: ArticleFormState = {
  title: '',
  slug: '',
  excerpt: '',
  content: '',
  status: 'DRAFT',
  publishedAt: '',
};

export function AdminArticleFormPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);
  const [form, setForm] = useState<ArticleFormState>(initialForm);
  const [slugTouched, setSlugTouched] = useState(isEdit);
  const [loading, setLoading] = useState(isEdit);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  function updateField<K extends keyof ArticleFormState>(key: K, value: ArticleFormState[K]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  useEffect(() => {
    if (!slugTouched) {
      updateField('slug', slugifyText(form.title));
    }
  }, [form.title, slugTouched]);

  useEffect(() => {
    async function load() {
      if (!id) {
        setLoading(false);
        return;
      }

      try {
        const article = await getAdminArticleById(id);
        setForm({
          title: article.title,
          slug: article.slug,
          excerpt: article.excerpt ?? '',
          content: article.content,
          status: article.status,
          publishedAt: article.publishedAt ? new Date(article.publishedAt).toISOString().slice(0, 16) : '',
        });
        setSlugTouched(true);
      } catch (error) {
        setErrorMessage(error instanceof Error ? error.message : 'Gagal memuat artikel.');
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
        title: form.title,
        slug: form.slug,
        excerpt: form.excerpt || undefined,
        content: form.content,
        status: form.status,
        publishedAt: form.publishedAt ? new Date(form.publishedAt).toISOString() : undefined,
      };

      if (isEdit && id) {
        await updateAdminArticle(id, payload);
      } else {
        await createAdminArticle(payload);
      }

      navigate('/admin/articles');
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Gagal menyimpan artikel.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <AdminFormPageShell
      eyebrow="Admin • Articles"
      title={isEdit ? 'Edit artikel' : 'Tambah artikel'}
      backTo="/admin/articles"
      loading={loading}
      loadingLabel="Memuat data artikel..."
      errorMessage={errorMessage}
      onSubmit={handleSubmit}
      submitLabel="Simpan artikel"
      submitting={submitting}
      formClassName="card-surface grid gap-5 p-8 lg:grid-cols-2"
      statusClassName="lg:col-span-2"
      submitContainerClassName="lg:col-span-2"
    >
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
        <span>Status</span>
        <select className="w-full rounded-2xl border border-slate-200 px-4 py-3" value={form.status} onChange={(event) => updateField('status', event.target.value as 'DRAFT' | 'PUBLISHED' | 'ARCHIVED')}>
          <option value="DRAFT">DRAFT</option>
          <option value="PUBLISHED">PUBLISHED</option>
          <option value="ARCHIVED">ARCHIVED</option>
        </select>
      </label>
      <label className="block space-y-2 text-sm font-medium text-slate-700 lg:col-span-2">
        <span>Excerpt</span>
        <textarea className="min-h-24 w-full rounded-2xl border border-slate-200 px-4 py-3" value={form.excerpt} onChange={(event) => updateField('excerpt', event.target.value)} />
      </label>
      <label className="block space-y-2 text-sm font-medium text-slate-700 lg:col-span-2">
        <span>Konten</span>
        <textarea className="min-h-56 w-full rounded-2xl border border-slate-200 px-4 py-3" value={form.content} onChange={(event) => updateField('content', event.target.value)} required />
      </label>
      <label className="block space-y-2 text-sm font-medium text-slate-700">
        <span>Published at</span>
        <input className="w-full rounded-2xl border border-slate-200 px-4 py-3" type="datetime-local" value={form.publishedAt} onChange={(event) => updateField('publishedAt', event.target.value)} />
      </label>
    </AdminFormPageShell>
  );
}
