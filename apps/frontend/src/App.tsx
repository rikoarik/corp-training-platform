import { StrictMode, useEffect } from 'react';
import {
  BrowserRouter,
  Route,
  Routes,
  useLocation,
} from 'react-router-dom';
import { AdminLayout, AdminRouteGuard, PublicLayout } from './components/layout/Layout';
import { AdminArticleFormPage } from './pages/admin/AdminArticleFormPage';
import { AdminArticlesPage } from './pages/admin/AdminArticlesPage';
import { AdminCategoriesPage } from './pages/admin/AdminCategoriesPage';
import { AdminCategoryFormPage } from './pages/admin/AdminCategoryFormPage';
import { AdminDashboardPage } from './pages/admin/AdminDashboardPage';
import { AdminLoginPage } from './pages/admin/AdminLoginPage';
import { AdminParticipantsPage } from './pages/admin/AdminParticipantsPage';
import { AdminScheduleFormPage } from './pages/admin/AdminScheduleFormPage';
import { AdminSchedulesPage } from './pages/admin/AdminSchedulesPage';
import { AdminTrainingFormPage } from './pages/admin/AdminTrainingFormPage';
import { AdminTrainingsPage } from './pages/admin/AdminTrainingsPage';
import { AdminUserFormPage } from './pages/admin/AdminUserFormPage';
import { AdminUsersPage } from './pages/admin/AdminUsersPage';
import { ArticleDetailPage } from './pages/ArticleDetailPage';
import { ArticleListPage } from './pages/ArticleListPage';
import { CareerPage } from './pages/CareerPage';
import { ContactPage } from './pages/ContactPage';
import { GalleryPage } from './pages/GalleryPage';
import { HomePage } from './pages/HomePage';
import { NotFoundPage } from './pages/NotFoundPage';
import { ProfilePage } from './pages/ProfilePage';
import { ScheduleDetailPage } from './pages/ScheduleDetailPage';
import { ScheduleListPage } from './pages/ScheduleListPage';
import { SkpLicensePage } from './pages/SkpLicensePage';
import { TrainingDetailPage } from './pages/TrainingDetailPage';
import { TrainingListPage } from './pages/TrainingListPage';

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0 });
  }, [pathname]);

  return null;
}

export default function App() {
  return (
    <StrictMode>
      <BrowserRouter>
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<PublicLayout />}>
            <Route index element={<HomePage />} />
            <Route path="profil" element={<ProfilePage />} />
            <Route path="layanan" element={<TrainingListPage />} />
            <Route path="pelatihan" element={<TrainingListPage />} />
            <Route path="pelatihan/:slug" element={<TrainingDetailPage />} />
            <Route path="jadwal" element={<ScheduleListPage />} />
            <Route path="jadwal/:id" element={<ScheduleDetailPage />} />
            <Route path="skp-lisensi" element={<SkpLicensePage />} />
            <Route path="galeri" element={<GalleryPage />} />
            <Route path="artikel" element={<ArticleListPage />} />
            <Route path="artikel/:slug" element={<ArticleDetailPage />} />
            <Route path="karir" element={<CareerPage />} />
            <Route path="kontak" element={<ContactPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Route>
          <Route path="/admin/login" element={<AdminLoginPage />} />
          <Route element={<AdminRouteGuard />}>
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<AdminDashboardPage />} />
              <Route path="users" element={<AdminUsersPage />} />
              <Route path="users/new" element={<AdminUserFormPage />} />
              <Route path="users/:id" element={<AdminUserFormPage />} />
              <Route path="categories" element={<AdminCategoriesPage />} />
              <Route path="categories/new" element={<AdminCategoryFormPage />} />
              <Route path="categories/:id" element={<AdminCategoryFormPage />} />
              <Route path="trainings" element={<AdminTrainingsPage />} />
              <Route path="trainings/new" element={<AdminTrainingFormPage />} />
              <Route path="trainings/:id" element={<AdminTrainingFormPage />} />
              <Route path="schedules" element={<AdminSchedulesPage />} />
              <Route path="schedules/new" element={<AdminScheduleFormPage />} />
              <Route path="schedules/:id" element={<AdminScheduleFormPage />} />
              <Route path="participants" element={<AdminParticipantsPage />} />
              <Route path="articles" element={<AdminArticlesPage />} />
              <Route path="articles/new" element={<AdminArticleFormPage />} />
              <Route path="articles/:id" element={<AdminArticleFormPage />} />
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </StrictMode>
  );
}
