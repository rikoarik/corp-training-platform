import { ArticleCard } from '../components/public/Cards';
import { EmptyState, LoadingState, SectionHeading, SurfaceCard } from '../components/ui/Ui';
import { useAsyncData } from '../hooks/useAsyncData';
import { getLatestArticles, getPopularArticles } from '../services/public';

export function ArticleListPage() {
  const latestArticles = useAsyncData(() => getLatestArticles(12), []);
  const popularArticles = useAsyncData(() => getPopularArticles(6), []);

  return (
    <div className="section-space">
      <div className="page-shell space-y-14">
        <SectionHeading
          eyebrow="Artikel & insight"
          title="Feed insight yang memadukan artikel terbaru dan sorotan populer"
          description="Karena backend saat ini belum menyediakan endpoint archive publik generik, halaman artikel Phase 1 dibangun dengan dua blok utama: terbaru dan populer."
        />

        <section className="space-y-8">
          <SectionHeading
            eyebrow="Terbaru"
            title="Artikel terbaru"
            description="Gunakan artikel untuk membangun otoritas, edukasi pasar, dan membantu calon klien memahami topik yang relevan dengan layanan Anda."
          />
          {latestArticles.loading ? <LoadingState label="Memuat artikel terbaru..." /> : null}
          {latestArticles.error ? (
            <EmptyState title="Artikel terbaru belum tersedia" description={latestArticles.error} />
          ) : null}
          {latestArticles.data?.length ? (
            <div className="grid gap-6 lg:grid-cols-3">
              {latestArticles.data.map((article) => (
                <ArticleCard key={article.id} article={article} />
              ))}
            </div>
          ) : null}
        </section>

        <section className="space-y-8">
          <SectionHeading
            eyebrow="Sorotan"
            title="Artikel populer"
            description="Blok ini memberi pengunjung jalan cepat menuju topik yang paling layak ditonjolkan di beranda atau halaman konten."
          />
          {popularArticles.loading ? <LoadingState label="Memuat artikel populer..." /> : null}
          {popularArticles.error ? (
            <EmptyState title="Artikel populer belum tersedia" description={popularArticles.error} />
          ) : null}
          {popularArticles.data?.length ? (
            <div className="grid gap-6 lg:grid-cols-2">
              {popularArticles.data.map((article) => (
                <SurfaceCard key={article.id} className="p-6">
                  <div className="text-sm font-medium text-primary-600">Populer</div>
                  <h3 className="mt-3 text-2xl font-semibold text-ink">{article.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-slate-600">{article.excerpt || article.content}</p>
                  <div className="mt-6 text-sm text-slate-500">Ditulis oleh {article.author.name}</div>
                </SurfaceCard>
              ))}
            </div>
          ) : null}
        </section>
      </div>
    </div>
  );
}
