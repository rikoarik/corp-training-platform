import { useState } from 'react';
import { EmptyState, LoadingState, SectionHeading, SurfaceCard } from '../components/ui/Ui';
import { useAsyncData } from '../hooks/useAsyncData';
import { getPublicPageBySlug, submitContactInquiry } from '../services/public';
import type { ContactInquiryBody, ContactPageContent } from '../types/api';

const initialForm: ContactInquiryBody = {
  name: '',
  email: '',
  phone: '',
  company: '',
  message: '',
};

export function ContactPage() {
  const page = useAsyncData(() => getPublicPageBySlug<ContactPageContent>('contact'), []);
  const [form, setForm] = useState(initialForm);
  const [submitting, setSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  function updateField<K extends keyof ContactInquiryBody>(key: K, value: ContactInquiryBody[K]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setSuccessMessage(null);
    setErrorMessage(null);

    try {
      await submitContactInquiry({
        name: form.name,
        email: form.email,
        phone: form.phone || undefined,
        company: form.company || undefined,
        message: form.message,
      });

      setSuccessMessage('Permintaan Anda sudah kami terima. Tim kami akan segera menghubungi Anda untuk tindak lanjut berikutnya.');
      setForm(initialForm);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Permintaan tidak dapat dikirim saat ini.');
    } finally {
      setSubmitting(false);
    }
  }

  if (page.loading) {
    return (
      <div className="section-space">
        <div className="page-shell">
          <LoadingState label="Memuat informasi kontak..." />
        </div>
      </div>
    );
  }

  if (page.error || !page.data) {
    return (
      <div className="section-space">
        <div className="page-shell">
          <EmptyState title="Kontak belum tersedia" description={page.error ?? 'Informasi kontak belum dapat dimuat saat ini.'} />
        </div>
      </div>
    );
  }

  const content = page.data.content;

  return (
    <div className="section-space">
      <div className="page-shell space-y-10">
        <SectionHeading
          eyebrow="Kontak"
          title="Hubungi tim kami untuk kebutuhan pelatihan, konsultasi, atau penawaran"
          description="Halaman ini dirancang sebagai titik CTA yang jelas sebelum modul leads/form dinamis tersedia di backend."
        />

        <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="space-y-6">
            <SurfaceCard className="space-y-5 p-8">
              <div>
                <h2 className="text-2xl font-semibold text-ink">Informasi kontak</h2>
                <p className="mt-3 text-sm leading-7 text-slate-600">
                  Untuk diskusi kebutuhan program, permintaan penawaran, atau konsultasi awal, Anda dapat menghubungi tim melalui kanal berikut.
                </p>
              </div>
              <div className="grid gap-4 text-sm leading-7 text-slate-600">
                <div>
                  <span className="font-semibold text-slate-900">Alamat:</span> {content.contactInfo.address}
                </div>
                <div>
                  <span className="font-semibold text-slate-900">Telepon:</span>{' '}
                  <a href={content.contactInfo.telHref} className="text-primary-600 hover:text-primary-700">
                    {content.contactInfo.phone}
                  </a>
                </div>
                <div>
                  <span className="font-semibold text-slate-900">Email:</span>{' '}
                  <a href={content.contactInfo.mailHref} className="text-primary-600 hover:text-primary-700">
                    {content.contactInfo.email}
                  </a>
                </div>
                <div>
                  <span className="font-semibold text-slate-900">WhatsApp:</span>{' '}
                  <a href={content.contactInfo.whatsappHref} className="text-primary-600 hover:text-primary-700">
                    Chat sekarang
                  </a>
                </div>
              </div>
            </SurfaceCard>

            <SurfaceCard className="grid gap-4 p-8 sm:grid-cols-2">
              {content.cards.map((card) => (
                <div key={card.title} className="rounded-2xl bg-slate-50 p-5">
                  <h3 className="text-lg font-semibold text-ink">{card.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-slate-600">{card.description}</p>
                </div>
              ))}
            </SurfaceCard>
          </div>

          <form className="card-surface space-y-5 p-8" onSubmit={handleSubmit}>
            <div>
              <div className="eyebrow">Form konsultasi</div>
              <h2 className="mt-3 text-2xl font-semibold text-ink">Kirim kebutuhan Anda</h2>
              <p className="mt-3 text-sm leading-7 text-slate-600">
                Isi form berikut untuk permintaan penawaran, konsultasi program, atau diskusi awal dengan tim kami.
              </p>
            </div>

            <label className="block space-y-2 text-sm font-medium text-slate-700">
              <span>Nama lengkap</span>
              <input
                className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-primary-400"
                value={form.name}
                onChange={(event) => updateField('name', event.target.value)}
                required
                minLength={2}
              />
            </label>

            <label className="block space-y-2 text-sm font-medium text-slate-700">
              <span>Email</span>
              <input
                className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-primary-400"
                type="email"
                value={form.email}
                onChange={(event) => updateField('email', event.target.value)}
                required
              />
            </label>

            <label className="block space-y-2 text-sm font-medium text-slate-700">
              <span>Nomor telepon</span>
              <input
                className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-primary-400"
                value={form.phone ?? ''}
                onChange={(event) => updateField('phone', event.target.value)}
              />
            </label>

            <label className="block space-y-2 text-sm font-medium text-slate-700">
              <span>Perusahaan</span>
              <input
                className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-primary-400"
                value={form.company ?? ''}
                onChange={(event) => updateField('company', event.target.value)}
              />
            </label>

            <label className="block space-y-2 text-sm font-medium text-slate-700">
              <span>Kebutuhan Anda</span>
              <textarea
                className="min-h-36 w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-primary-400"
                value={form.message}
                onChange={(event) => updateField('message', event.target.value)}
                required
                minLength={10}
              />
            </label>

            {successMessage ? <div className="rounded-2xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700">{successMessage}</div> : null}
            {errorMessage ? <div className="rounded-2xl bg-rose-50 px-4 py-3 text-sm text-rose-700">{errorMessage}</div> : null}

            <button
              type="submit"
              disabled={submitting}
              className="inline-flex w-full items-center justify-center rounded-full bg-primary-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-primary-600 disabled:cursor-not-allowed disabled:bg-primary-300"
            >
              {submitting ? 'Mengirim...' : 'Kirim permintaan'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
