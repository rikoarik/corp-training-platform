import { useParams } from 'react-router-dom';
import { ButtonLink, EmptyState, LoadingState, SurfaceCard } from '../components/ui/Ui';
import { formatDate } from '../lib/format';
import { getArticleBySlug } from '../services/public';
import { useAsyncData } from '../hooks/useAsyncData';

export function ArticleDetailPage() {
  const { slug = '' } = useParams();
  const article = useAsyncData(() => getArticleBySlug(slug), [slug]);

  if (article.loading) {
    return (
      <div className="section-space">
        <div className="page-shell">
          <LoadingState label="Memuat artikel..." />
        </div>
      </div>
    );
  }

  if (article.error || !article.data) {
    return (
      <div className="section-space">
        <div className="page-shell">
          <EmptyState
            title="Artikel tidak ditemukan"
            description={article.error ?? 'Artikel yang Anda cari belum tersedia atau sudah tidak dipublikasikan.'}
            action={<ButtonLink to="/artikel">Kembali ke artikel</ButtonLink>}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="section-space">
      <div className="page-shell">
        <SurfaceCard className="mx-auto max-w-4xl p-8 sm:p-10">
          <div className="eyebrow">Artikel & insight</div>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight text-ink sm:text-5xl">{article.data.title}</h1>
          <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-sm text-slate-500">
            <span>Penulis: {article.data.author.name}</span>
            <span>
              Tanggal terbit:{' '}
              {article.data.publishedAt ? formatDate(article.data.publishedAt) : formatDate(article.data.createdAt)}
            </span>
          </div>
          {article.data.excerpt ? (
            <p className="mt-6 rounded-3xl bg-slate-50 px-5 py-5 text-base leading-8 text-slate-600">{article.data.excerpt}</p>
          ) : null}
          <div className="mt-8 whitespace-pre-line text-base leading-8 text-slate-700">{article.data.content}</div>
        </SurfaceCard>
      </div>
    </div>
  );
}
