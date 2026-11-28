import React, { useEffect } from 'react';
import { BrowserRouter, Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { AppShell } from '@/components/layout/AppShell';
import { ToastProvider } from '@/components/ui/Toast';
import { LearnerProvider, useLearner } from '@/context/LearnerContext';
import { ThemeProvider } from '@/context/ThemeContext';
import { I18nProvider } from '@/i18n/I18nContext';
import {
  ForgotPasswordPage,
  LoginPage,
  RegisterPage,
  ResetPasswordPage,
} from '@/pages/AuthPages';
import {
  HelpSupportPage,
  NotificationsPage,
  ProfilePage,
  SettingsPage,
} from '@/pages/AccountPages';
import { AchievementsPage } from '@/pages/AchievementsPage';
import { AssessmentRunnerPage, AssessmentsPage } from '@/pages/AssessmentsPage';
import { CertificationsPage } from '@/pages/CertificationsPage';
import { CourseDetailPage } from '@/pages/CourseDetailPage';
import { CourseWorkspacePage } from '@/pages/CourseWorkspacePage';
import { DashboardPage } from '@/pages/DashboardPage';
import { ExploreCoursesPage } from '@/pages/ExploreCoursesPage';
import { LearningPathDetailPage, LearningPathsPage } from '@/pages/LearningPathsPage';
import { MembershipPage } from '@/pages/MembershipPage';
import { MyCoursesPage } from '@/pages/MyCoursesPage';
import { VideoPlayerPage } from '@/pages/VideoPlayerPage';
import { VideosLibraryPage, WatchlistPage } from '@/pages/VideosLibraryPage';

const ScrollToTop: React.FC = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

const LearnerRoutes: React.FC = () => {
  const { isAuthenticated } = useLearner();

  if (!isAuthenticated) {
    return (
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    );
  }

  return (
    <Routes>
      <Route path="/login" element={<Navigate to="/" replace />} />
      <Route path="/register" element={<Navigate to="/" replace />} />
      <Route path="/forgot-password" element={<Navigate to="/" replace />} />
      <Route path="/reset-password" element={<Navigate to="/" replace />} />
      <Route element={<AppShell />}>
        {/* Overview */}
        <Route path="/" element={<DashboardPage />} />

        {/* Learning */}
        <Route path="/explore" element={<ExploreCoursesPage />} />
        <Route path="/courses/:slug" element={<CourseDetailPage />} />
        <Route path="/my-courses" element={<MyCoursesPage />} />
        <Route path="/learn/:slug" element={<CourseWorkspacePage />} />
        <Route path="/learn/:slug/:lessonId" element={<CourseWorkspacePage />} />
        <Route path="/learning-paths" element={<LearningPathsPage />} />
        <Route path="/learning-paths/:slug" element={<LearningPathDetailPage />} />
        <Route path="/videos" element={<VideosLibraryPage />} />
        <Route path="/videos/:slug" element={<VideoPlayerPage />} />
        <Route path="/watchlist" element={<WatchlistPage />} />

        {/* Achievements */}
        <Route path="/certifications" element={<CertificationsPage />} />
        <Route path="/assessments" element={<AssessmentsPage />} />
        <Route path="/assessments/:slug" element={<AssessmentRunnerPage />} />
        <Route path="/achievements" element={<AchievementsPage />} />

        {/* Account */}
        <Route path="/membership" element={<MembershipPage />} />
        <Route path="/notifications" element={<NotificationsPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/help" element={<HelpSupportPage />} />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
};

export function App() {
  return (
    <ThemeProvider>
      <I18nProvider>
        <ToastProvider>
          <LearnerProvider>
            <BrowserRouter>
              <ScrollToTop />
              <LearnerRoutes />
            </BrowserRouter>
          </LearnerProvider>
        </ToastProvider>
      </I18nProvider>
    </ThemeProvider>
  );
}

export default App;

