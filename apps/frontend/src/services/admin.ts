import { deleteData, getData, patchData, postData } from '../lib/api';
import type { AdminUser, Article, Category, Participant, Schedule, Training } from '../types/api';

export async function getAdminUsers() {
  return getData<AdminUser[]>('/admin/users');
}

export async function getAdminUserById(id: string) {
  const users = await getAdminUsers();
  const user = users.find((item) => item.id === id);

  if (!user) {
    throw new Error('User tidak ditemukan.');
  }

  return user;
}

export async function createAdminUser(payload: {
  name: string;
  email: string;
  password: string;
  role?: 'ADMIN' | 'USER';
}) {
  return postData<AdminUser, typeof payload>('/admin/users', payload);
}

export async function updateAdminUser(
  id: string,
  payload: {
    name?: string;
    email?: string;
    role?: 'ADMIN' | 'USER';
  },
) {
  return patchData<AdminUser, typeof payload>(`/admin/users/${id}`, payload);
}

export async function updateAdminUserPassword(id: string, payload: { password: string }) {
  return patchData<null, typeof payload>(`/admin/users/${id}/password`, payload);
}

export async function getAdminCategories() {
  return getData<Category[]>('/admin/categories', { limit: 100 });
}

export async function getAdminTrainings() {
  return getData<Training[]>('/admin/trainings', { limit: 100 });
}

export async function getAdminSchedules() {
  return getData<Schedule[]>('/admin/schedules', { limit: 100 });
}

export async function getAdminParticipants() {
  return getData<Participant[]>('/admin/participants', { limit: 100 });
}

export async function getAdminArticles() {
  return getData<Article[]>('/admin/articles');
}

export async function getAdminCategoryById(id: string) {
  return getData<Category>(`/admin/categories/${id}`);
}

export async function createAdminCategory(payload: { name: string; slug: string; description?: string }) {
  return postData<Category, { name: string; slug: string; description?: string }>('/admin/categories', payload);
}

export async function updateAdminCategory(id: string, payload: { name?: string; slug?: string; description?: string }) {
  return patchData<Category, { name?: string; slug?: string; description?: string }>(`/admin/categories/${id}`, payload);
}

export async function deleteAdminCategory(id: string) {
  return deleteData<null>(`/admin/categories/${id}`);
}

export async function getAdminTrainingById(id: string) {
  return getData<Training & { schedules?: Schedule[] }>(`/admin/trainings/${id}`);
}

export async function createAdminTraining(payload: {
  categoryId: string;
  title: string;
  slug: string;
  description: string;
  price: number;
  status?: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
}) {
  return postData<Training, typeof payload>('/admin/trainings', payload);
}

export async function updateAdminTraining(
  id: string,
  payload: {
    categoryId?: string;
    title?: string;
    slug?: string;
    description?: string;
    price?: number;
    status?: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
  },
) {
  return patchData<Training, typeof payload>(`/admin/trainings/${id}`, payload);
}

export async function deleteAdminTraining(id: string) {
  return deleteData<null>(`/admin/trainings/${id}`);
}

export async function getAdminScheduleById(id: string) {
  return getData<Schedule>(`/admin/schedules/${id}`);
}

export async function createAdminSchedule(payload: {
  trainingId: string;
  title: string;
  startDate: string;
  endDate: string;
  location: string;
  quota: number;
  status?: 'DRAFT' | 'OPEN' | 'CLOSED' | 'COMPLETED' | 'CANCELLED';
}) {
  return postData<Schedule, typeof payload>('/admin/schedules', payload);
}

export async function updateAdminSchedule(
  id: string,
  payload: {
    trainingId?: string;
    title?: string;
    startDate?: string;
    endDate?: string;
    location?: string;
    quota?: number;
    status?: 'DRAFT' | 'OPEN' | 'CLOSED' | 'COMPLETED' | 'CANCELLED';
  },
) {
  return patchData<Schedule, typeof payload>(`/admin/schedules/${id}`, payload);
}

export async function deleteAdminSchedule(id: string) {
  return deleteData<null>(`/admin/schedules/${id}`);
}

export async function getAdminArticleById(id: string) {
  const articles = await getAdminArticles();
  const article = articles.find((item) => item.id === id);

  if (!article) {
    throw new Error('Artikel tidak ditemukan.');
  }

  return article;
}

export async function createAdminArticle(payload: {
  title: string;
  slug: string;
  excerpt?: string;
  content: string;
  status?: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
  publishedAt?: string;
}) {
  return postData<Article, typeof payload>('/admin/articles', payload);
}

export async function updateAdminArticle(
  id: string,
  payload: {
    title?: string;
    slug?: string;
    excerpt?: string;
    content?: string;
    status?: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
    publishedAt?: string;
  },
) {
  return patchData<Article, typeof payload>(`/admin/articles/${id}`, payload);
}

export async function publishAdminArticle(id: string) {
  return patchData<Article, Record<string, never>>(`/admin/articles/${id}/publish`, {});
}

export async function archiveAdminArticle(id: string) {
  return patchData<Article, Record<string, never>>(`/admin/articles/${id}/archive`, {});
}

export async function updateAdminParticipant(
  id: string,
  payload: {
    name?: string;
    email?: string;
    phone?: string;
    status?: 'REGISTERED' | 'CONFIRMED' | 'CANCELLED';
  },
) {
  return patchData<Participant, typeof payload>(`/admin/participants/${id}`, payload);
}

export async function markAdminParticipantAttendance(id: string) {
  return postData<Participant, Record<string, never>>(`/admin/participants/${id}/attendance`, {});
}

export async function deleteAdminArticle(id: string) {
  return deleteData<null>(`/admin/articles/${id}`);
}
