import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { siteContent } from '../../lib/site-content';
import { login } from '../../services/auth';

export function AdminLoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState('admin@example.com');
  const [password, setPassword] = useState('ChangeMe123!');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    document.title = 'Admin Login';
  }, []);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setErrorMessage(null);

    try {
      await login({ email, password });
      const targetPath = (location.state as { from?: string } | null)?.from || '/admin';
      navigate(targetPath, { replace: true });
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Login gagal.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 px-4 py-16 text-white sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[1fr_0.9fr] lg:items-center">
        <div className="space-y-6">
          <div className="eyebrow text-primary-100">{siteContent.brand.name}</div>
          <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">Masuk ke back office untuk mengelola pelatihan, jadwal, dan konten.</h1>
          <p className="max-w-2xl text-base leading-8 text-slate-300">
            Login ini memakai endpoint auth backend yang sudah tersedia, sehingga bisa menjadi langkah awal sebelum dashboard admin penuh dikembangkan.
          </p>
        </div>

        <form className="rounded-[2rem] bg-white p-8 text-ink shadow-soft" onSubmit={handleSubmit}>
          <div>
            <h2 className="text-2xl font-semibold">Login admin</h2>
            <p className="mt-3 text-sm leading-7 text-slate-600">Gunakan akun admin backend yang sudah terdaftar untuk mengakses shell dashboard awal.</p>
          </div>

          <div className="mt-6 space-y-5">
            <label className="block space-y-2 text-sm font-medium text-slate-700">
              <span>Email</span>
              <input
                className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-primary-400"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
              />
            </label>

            <label className="block space-y-2 text-sm font-medium text-slate-700">
              <span>Password</span>
              <input
                className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-primary-400"
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
              />
            </label>
          </div>

          {errorMessage ? <div className="mt-5 rounded-2xl bg-rose-50 px-4 py-3 text-sm text-rose-700">{errorMessage}</div> : null}

          <button
            type="submit"
            disabled={loading}
            className="mt-6 inline-flex w-full items-center justify-center rounded-full bg-primary-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-primary-600 disabled:cursor-not-allowed disabled:bg-primary-300"
          >
            {loading ? 'Memproses...' : 'Masuk ke admin'}
          </button>
        </form>
      </div>
    </div>
  );
}
