import { getData, postData } from '../lib/api';
import type {
  Article,
  Category,
  ContactInquiry,
  ContactInquiryBody,
  Participant,
  ParticipantRegistrationBody,
  PublicPage,
  Schedule,
  Training,
} from '../types/api';

export type TrainingDetail = Training & {
  schedules: Array<{
    id: string;
    trainingId: string;
    title: string;
    startDate: string;
    endDate: string;
    location: string;
    quota: number;
    status: 'DRAFT' | 'OPEN' | 'CLOSED' | 'COMPLETED' | 'CANCELLED';
    createdAt: string;
    updatedAt: string;
  }>;
};

export async function getCategories() {
  return getData<Category[]>('/public/categories', { limit: 100 });
}

export async function getTrainings(params?: { categoryId?: string; limit?: number }) {
  return getData<Training[]>('/public/trainings', {
    categoryId: params?.categoryId,
    limit: params?.limit ?? 12,
  });
}

export async function getTrainingBySlug(slug: string) {
  return getData<TrainingDetail>(`/public/trainings/${slug}`);
}

export async function getSchedules(params?: { trainingId?: string; limit?: number }) {
  return getData<Schedule[]>('/public/schedules', {
    trainingId: params?.trainingId,
    limit: params?.limit ?? 50,
  });
}

export async function getScheduleById(id: string) {
  return getData<Schedule>(`/public/schedules/${id}`);
}

export async function registerParticipant(payload: ParticipantRegistrationBody) {
  return postData<Participant, ParticipantRegistrationBody>('/public/participants/register', payload);
}

export async function getPublicPageBySlug<TContent>(slug: string) {
  return getData<PublicPage<TContent>>(`/public/pages/${slug}`);
}

export async function submitContactInquiry(payload: ContactInquiryBody) {
  return postData<ContactInquiry, ContactInquiryBody>('/public/contact-inquiries', payload);
}

export async function getLatestArticles(limit = 6) {
  return getData<Article[]>('/public/articles/latest', { limit });
}

export async function getPopularArticles(limit = 6) {
  return getData<Article[]>('/public/articles/popular', { limit });
}

export async function getArticleBySlug(slug: string) {
  return getData<Article>(`/public/articles/${slug}`);
}
