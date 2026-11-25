import React, { useEffect } from 'react';
import { BrowserRouter, Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { AppShell } from '@/components/layout/AppShell';
import { LearnerProvider } from '@/context/LearnerContext';
import { ThemeProvider } from '@/context/ThemeContext';
import { I18nProvider } from '@/i18n/I18nContext';
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

export function App() {
  return (
    <ThemeProvider>
      <I18nProvider>
        <LearnerProvider>
          <BrowserRouter>
            <ScrollToTop />
            <Routes>
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
          </BrowserRouter>
        </LearnerProvider>
      </I18nProvider>
    </ThemeProvider>
  );
}

export default App;

