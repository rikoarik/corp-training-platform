import { Link } from 'react-router-dom';
import { formatCurrency, formatDateRange, truncateText } from '../../lib/format';
import type { Article, Schedule, Training } from '../../types/api';
import { SurfaceCard, StatusBadge } from '../ui/Ui';

export function TrainingCard(props: { training: Training }) {
  return (
    <SurfaceCard className="flex h-full flex-col p-6">
      <div className="mb-4 flex items-center justify-between gap-4">
        <span className="inline-flex rounded-full bg-primary-50 px-3 py-1 text-xs font-semibold text-primary-700">
          {props.training.category.name}
        </span>
        <span className="text-sm font-semibold text-accent">{formatCurrency(props.training.price)}</span>
      </div>
      <h3 className="text-xl font-semibold text-ink">{props.training.title}</h3>
      <p className="mt-3 flex-1 text-sm leading-7 text-slate-600">
        {truncateText(props.training.description, 150)}
      </p>
      <div className="mt-6 flex items-center justify-between gap-4 border-t border-slate-100 pt-5">
        <span className="text-sm text-slate-500">
          {props.training._count?.schedules ?? 0} jadwal tersedia
        </span>
        <Link
          to={`/pelatihan/${props.training.slug}`}
          className="text-sm font-semibold text-primary-600 hover:text-primary-700"
        >
          Lihat detail
        </Link>
      </div>
    </SurfaceCard>
  );
}

export function ScheduleCard(props: { schedule: Schedule }) {
  const participants = props.schedule._count?.participants ?? 0;
  const remaining = Math.max(props.schedule.quota - participants, 0);

  return (
    <SurfaceCard className="flex h-full flex-col p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="text-sm font-medium text-primary-600">{props.schedule.training.title}</div>
          <h3 className="mt-2 text-xl font-semibold text-ink">{props.schedule.title}</h3>
        </div>
        <StatusBadge status={props.schedule.status} />
      </div>
      <div className="mt-5 grid gap-3 text-sm text-slate-600">
        <div>
          <span className="font-semibold text-slate-900">Tanggal:</span> {formatDateRange(props.schedule.startDate, props.schedule.endDate)}
        </div>
        <div>
          <span className="font-semibold text-slate-900">Lokasi:</span> {props.schedule.location}
        </div>
        <div>
          <span className="font-semibold text-slate-900">Kuota tersisa:</span> {remaining} peserta
        </div>
      </div>
      <div className="mt-6 flex items-center justify-between gap-4 border-t border-slate-100 pt-5">
        <Link to={`/pelatihan/${props.schedule.training.slug}`} className="text-sm text-slate-500 hover:text-primary-600">
          Lihat pelatihan
        </Link>
        <Link
          to={`/jadwal/${props.schedule.id}`}
          className="text-sm font-semibold text-primary-600 hover:text-primary-700"
        >
          Detail jadwal
        </Link>
      </div>
    </SurfaceCard>
  );
}

export function ArticleCard(props: { article: Article }) {
  return (
    <SurfaceCard className="flex h-full flex-col p-6">
      <div className="text-sm font-medium text-primary-600">Insight & Artikel</div>
      <h3 className="mt-3 text-xl font-semibold text-ink">{props.article.title}</h3>
      <p className="mt-3 flex-1 text-sm leading-7 text-slate-600">
        {truncateText(props.article.excerpt || props.article.content, 150)}
      </p>
      <div className="mt-6 flex items-center justify-between gap-4 border-t border-slate-100 pt-5 text-sm text-slate-500">
        <span>{props.article.author.name}</span>
        <Link
          to={`/artikel/${props.article.slug}`}
          className="font-semibold text-primary-600 hover:text-primary-700"
        >
          Baca artikel
        </Link>
      </div>
    </SurfaceCard>
  );
}
