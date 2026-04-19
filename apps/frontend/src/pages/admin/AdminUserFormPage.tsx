import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AdminFormPageShell } from '../../components/admin/AdminFormPageShell';
import { createAdminUser, getAdminUserById, updateAdminUser, updateAdminUserPassword } from '../../services/admin';

type UserFormState = {
  name: string;
  email: string;
  role: 'ADMIN' | 'USER';
  password: string;
};

const initialForm: UserFormState = {
  name: '',
  email: '',
  role: 'ADMIN',
  password: '',
};

export function AdminUserFormPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);
  const [form, setForm] = useState<UserFormState>(initialForm);
  const [loading, setLoading] = useState(isEdit);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  function updateField<K extends keyof UserFormState>(key: K, value: UserFormState[K]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  useEffect(() => {
    async function load() {
      if (!id) {
        setLoading(false);
        return;
      }

      try {
        const user = await getAdminUserById(id);
        setForm({
          name: user.name,
          email: user.email,
          role: user.role,
          password: '',
        });
      } catch (error) {
        setErrorMessage(error instanceof Error ? error.message : 'Gagal memuat user.');
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
        await updateAdminUser(id, {
          name: form.name,
          email: form.email,
          role: form.role,
        });

        if (form.password.trim()) {
          await updateAdminUserPassword(id, { password: form.password.trim() });
        }
      } else {
        await createAdminUser({
          name: form.name,
          email: form.email,
          role: form.role,
          password: form.password.trim(),
        });
      }

      navigate('/admin/users');
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Gagal menyimpan user.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <AdminFormPageShell
      eyebrow="Admin • Users"
      title={isEdit ? 'Edit user' : 'Tambah user'}
      backTo="/admin/users"
      loading={loading}
      loadingLabel="Memuat data user..."
      errorMessage={errorMessage}
      onSubmit={handleSubmit}
      submitLabel="Simpan user"
      submitting={submitting}
      formClassName="card-surface grid gap-5 p-8 lg:grid-cols-2"
      statusClassName="lg:col-span-2"
      submitContainerClassName="lg:col-span-2"
    >
      <label className="block space-y-2 text-sm font-medium text-slate-700">
        <span>Nama</span>
        <input className="w-full rounded-2xl border border-slate-200 px-4 py-3" value={form.name} onChange={(event) => updateField('name', event.target.value)} required minLength={2} />
      </label>
      <label className="block space-y-2 text-sm font-medium text-slate-700">
        <span>Email</span>
        <input className="w-full rounded-2xl border border-slate-200 px-4 py-3" type="email" value={form.email} onChange={(event) => updateField('email', event.target.value)} required />
      </label>
      <label className="block space-y-2 text-sm font-medium text-slate-700">
        <span>Role</span>
        <select className="w-full rounded-2xl border border-slate-200 px-4 py-3" value={form.role} onChange={(event) => updateField('role', event.target.value as 'ADMIN' | 'USER')}>
          <option value="ADMIN">ADMIN</option>
          <option value="USER">USER</option>
        </select>
      </label>
      <label className="block space-y-2 text-sm font-medium text-slate-700">
        <span>{isEdit ? 'Password baru (opsional)' : 'Password'}</span>
        <input
          className="w-full rounded-2xl border border-slate-200 px-4 py-3"
          type="password"
          value={form.password}
          onChange={(event) => updateField('password', event.target.value)}
          required={!isEdit}
          minLength={8}
        />
      </label>
    </AdminFormPageShell>
  );
}
