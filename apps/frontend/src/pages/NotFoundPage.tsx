import { ButtonLink, EmptyState } from '../components/ui/Ui';

export function NotFoundPage() {
  return (
    <div className="section-space">
      <div className="page-shell">
        <EmptyState
          title="Halaman tidak ditemukan"
          description="Halaman yang Anda cari belum tersedia atau tautannya sudah berubah. Silakan kembali ke beranda atau jelajahi katalog pelatihan."
          action={<ButtonLink to="/">Kembali ke beranda</ButtonLink>}
        />
      </div>
    </div>
  );
}
