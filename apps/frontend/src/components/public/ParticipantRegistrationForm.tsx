import { useState } from 'react';
import { registerParticipant } from '../../services/public';

export function ParticipantRegistrationForm(props: { scheduleId: string }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setSuccessMessage(null);
    setErrorMessage(null);

    try {
      await registerParticipant({
        scheduleId: props.scheduleId,
        name,
        email,
        phone: phone || undefined,
      });

      setSuccessMessage('Pendaftaran berhasil dikirim. Tim kami akan menghubungi Anda untuk tindak lanjut berikutnya.');
      setName('');
      setEmail('');
      setPhone('');
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Pendaftaran gagal dikirim.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <form className="card-surface space-y-5 p-6" onSubmit={handleSubmit}>
      <div>
        <div className="eyebrow">Form pendaftaran</div>
        <h3 className="mt-3 text-2xl font-semibold text-ink">Daftarkan peserta untuk jadwal ini</h3>
        <p className="mt-3 text-sm leading-7 text-slate-600">
          Isi data berikut untuk mengajukan pendaftaran. Tim kami akan melakukan verifikasi dan follow-up setelah formulir diterima.
        </p>
      </div>

      <label className="block space-y-2 text-sm font-medium text-slate-700">
        <span>Nama lengkap</span>
        <input
          className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-primary-400"
          value={name}
          onChange={(event) => setName(event.target.value)}
          required
          minLength={2}
        />
      </label>

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
        <span>Nomor telepon</span>
        <input
          className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-primary-400"
          value={phone}
          onChange={(event) => setPhone(event.target.value)}
          placeholder="Opsional"
        />
      </label>

      {successMessage ? (
        <div className="rounded-2xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700">{successMessage}</div>
      ) : null}

      {errorMessage ? (
        <div className="rounded-2xl bg-rose-50 px-4 py-3 text-sm text-rose-700">{errorMessage}</div>
      ) : null}

      <button
        type="submit"
        disabled={loading}
        className="inline-flex w-full items-center justify-center rounded-full bg-primary-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-primary-600 disabled:cursor-not-allowed disabled:bg-primary-300"
      >
        {loading ? 'Mengirim...' : 'Kirim pendaftaran'}
      </button>
    </form>
  );
}
