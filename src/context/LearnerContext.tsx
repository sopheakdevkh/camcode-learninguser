import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import {
  INITIAL_ACHIEVEMENTS,
  INITIAL_CERTIFICATES,
  INITIAL_INVOICES,
  INITIAL_NOTIFICATIONS,
} from '@/data/mockAcademy';
import { MOCK_COURSES } from '@/data/mockCatalog';
import { API_CONFIG, apiRequest, delay } from '@/services/apiClient';
import { catalogService } from '@/services/catalogService';
import type {
  AchievementBadge,
  AssessmentAttempt,
  BillingCycle,
  CertificateRecord,
  Course,
  CourseProgressRecord,
  InvoiceRecord,
  Locale,
  NotificationItem,
  PlanTier,
  User,
  UserSettings,
  VideoItem,
} from '@/types';

const STORAGE_KEY = 'camcodelearn_user_app_state_v1';

interface PersistedLearnerState {
  user: User;
  courseProgress: Record<string, CourseProgressRecord>;
  videoResumeSeconds: Record<string, number>;
  assessmentAttempts: Record<string, AssessmentAttempt>;
  certificates: CertificateRecord[];
  notifications: NotificationItem[];
  invoices: InvoiceRecord[];
  settings: UserSettings;
}

export interface DemoLearnerAccount {
  tier: PlanTier;
  label: string;
  fullName: string;
  email: string;
  phone: string;
  password: string;
  userPatch: Partial<User>;
}

export const DEMO_LEARNER_ACCOUNTS: DemoLearnerAccount[] = [
  {
    tier: 'free',
    label: 'Free Learner',
    fullName: 'Sokha Chan',
    email: 'free@camcodelearn.edu',
    phone: '+855 12 111 222',
    password: 'Learner@2026',
    userPatch: {
      id: 'user-free-1',
      fullName: 'Sokha Chan',
      email: 'free@camcodelearn.edu',
      phone: '+855 12 111 222',
      jobTitle: 'Junior Web Developer',
      organization: 'Phnom Penh Tech Hub',
      avatarColor: '#1c5b48',
      activePlan: 'free',
      billingCycle: undefined,
      renewalDate: undefined,
      purchasedCourseIds: [],
      enrolledFreeCourseIds: ['course-4', 'course-6'],
      enrolledPathIds: [],
      watchlistVideoIds: ['vid-1'],
      savedCourseIds: ['course-3'],
      streakDays: 3,
      weeklyMinutes: 75,
      weeklyGoalMinutes: 180,
    },
  },
  {
    tier: 'basic',
    label: 'Basic Membership',
    fullName: 'Alex Sovann',
    email: 'basic@camcodelearn.edu',
    phone: '+855 12 889 900',
    password: 'Learner@2026',
    userPatch: {
      id: 'user-alex-1',
      fullName: 'Alex Sovann',
      email: 'basic@camcodelearn.edu',
      phone: '+855 12 889 900',
      jobTitle: 'Growth & Operations Specialist',
      organization: 'Phnom Penh Digital Co.',
      avatarColor: '#2563EB',
      activePlan: 'basic',
      billingCycle: 'monthly',
      renewalDate: '2026-12-25',
      purchasedCourseIds: ['course-1'],
      enrolledFreeCourseIds: ['course-4', 'course-6'],
      enrolledPathIds: ['path-1', 'path-2'],
      watchlistVideoIds: ['vid-1', 'vid-2', 'vid-6'],
      savedCourseIds: ['course-3', 'course-9'],
      streakDays: 7,
      weeklyMinutes: 195,
      weeklyGoalMinutes: 240,
    },
  },
  {
    tier: 'premium',
    label: 'Premium Academy',
    fullName: 'Dara Rith',
    email: 'premium@camcodelearn.edu',
    phone: '+855 12 999 888',
    password: 'Learner@2026',
    userPatch: {
      id: 'user-premium-1',
      fullName: 'Dara Rith',
      email: 'premium@camcodelearn.edu',
      phone: '+855 12 999 888',
      jobTitle: 'Product Engineering Lead',
      organization: 'Mekong Cloud Labs',
      avatarColor: '#15463a',
      activePlan: 'premium',
      billingCycle: 'yearly',
      renewalDate: '2027-11-25',
      purchasedCourseIds: ['course-1'],
      enrolledFreeCourseIds: ['course-4', 'course-6'],
      enrolledPathIds: ['path-1', 'path-2'],
      watchlistVideoIds: ['vid-1', 'vid-2', 'vid-6'],
      savedCourseIds: ['course-3', 'course-9'],
      streakDays: 14,
      weeklyMinutes: 240,
      weeklyGoalMinutes: 240,
    },
  },
];

function createInitialState(): PersistedLearnerState {
  return {
    user: {
      id: 'user-alex-1',
      fullName: 'Alex Sovann',
      email: 'alex.sovann@camcodelearn.edu',
      phone: '+855 12 889 900',
      jobTitle: 'Growth & Operations Specialist',
      organization: 'Phnom Penh Digital Co.',
      bio: 'Building practical digital marketing, analytics, and modern product workflows.',
      learningGoal: 'Earn Digital Marketing & Business Analytics certifications this quarter.',
      avatarColor: '#2563EB',
      preferredLanguage: 'en',
      activePlan: 'basic',
      billingCycle: 'monthly',
      renewalDate: '2026-12-25',
      purchasedCourseIds: ['course-1'],
      enrolledFreeCourseIds: ['course-4', 'course-6'],
      enrolledPathIds: ['path-1', 'path-2'],
      watchlistVideoIds: ['vid-1', 'vid-2', 'vid-6'],
      savedCourseIds: ['course-3', 'course-9'],
      streakDays: 7,
      weeklyMinutes: 195,
      weeklyGoalMinutes: 240,
    },
    courseProgress: {
      'course-4': {
        courseId: 'course-4',
        completedLessonIds: ['c4-l1', 'c4-l2'],
        lastLessonId: 'c4-l3',
        lastPositionSeconds: 435, // 7:15
        lastAccessedAt: '2026-11-25',
        enrolledAt: '2026-11-10',
        notesByLessonId: {
          'c4-l2': 'Remember: XLOOKUP defaults to exact match — much safer than VLOOKUP for monthly sales tables.',
        },
      },
      'course-1': {
        courseId: 'course-1',
        completedLessonIds: ['c1-l1'],
        lastLessonId: 'c1-l2',
        lastPositionSeconds: 185, // 3:05
        lastAccessedAt: '2026-11-24',
        enrolledAt: '2026-11-04',
        notesByLessonId: {},
      },
      'course-6': {
        courseId: 'course-6',
        completedLessonIds: ['c6-l1', 'c6-l2', 'c6-l3', 'c6-l4'],
        lastLessonId: 'c6-l4',
        lastPositionSeconds: 300,
        lastAccessedAt: '2026-11-12',
        enrolledAt: '2026-11-02',
        notesByLessonId: {},
      },
      'course-3': {
        courseId: 'course-3',
        completedLessonIds: [],
        lastLessonId: 'c3-l1',
        lastPositionSeconds: 0,
        lastAccessedAt: '2026-11-20',
        enrolledAt: '2026-11-20',
        notesByLessonId: {},
      },
    },
    videoResumeSeconds: {
      'vid-1': 320,
      'vid-6': 145,
    },
    assessmentAttempts: {
      'assess-ai': {
        assessmentId: 'assess-ai',
        score: 95,
        passed: true,
        completedAt: '2026-11-12',
        correctCount: 2,
        totalQuestions: 2,
      },
    },
    certificates: INITIAL_CERTIFICATES,
    notifications: INITIAL_NOTIFICATIONS,
    invoices: INITIAL_INVOICES,
    settings: {
      autoplayNextLesson: true,
      defaultPlaybackSpeed: 1,
      captionsEnabled: true,
      dailyGoalMinutes: 35,
      emailCourseUpdates: true,
      emailWeeklyDigest: true,
      inAppReminders: true,
    },
  };
}

function loadState(): PersistedLearnerState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      return JSON.parse(raw) as PersistedLearnerState;
    }
  } catch {
    // ignore corrupted storage
  }
  return createInitialState();
}

export type CourseAccessState = 'purchased' | 'subscription' | 'free_enrolled' | 'free_available' | 'paid_locked' | 'subscription_required';

export interface LearnerLoginPayload {
  identifier: string;
  password: string;
  rememberMe?: boolean;
}

export interface LearnerRegisterPayload {
  fullName: string;
  email: string;
  phone?: string;
  password: string;
  preferredLanguage: Locale;
}

export interface ChangePasswordPayload {
  currentPassword: string;
  newPassword: string;
}

interface LearnerContextValue {
  user: User;
  isAuthenticated: boolean;
  login: (payload: LearnerLoginPayload) => Promise<void>;
  register: (payload: LearnerRegisterPayload) => Promise<void>;
  changePassword: (payload: ChangePasswordPayload) => Promise<void>;
  logout: () => void;
  courseProgress: Record<string, CourseProgressRecord>;
  videoResumeSeconds: Record<string, number>;
  assessmentAttempts: Record<string, AssessmentAttempt>;
  certificates: CertificateRecord[];
  achievements: AchievementBadge[];
  notifications: NotificationItem[];
  unreadNotificationCount: number;
  invoices: InvoiceRecord[];
  settings: UserSettings;

  // Access & progress helpers
  hasCourseAccess: (course: Course) => 'purchased' | 'subscription' | 'free_enrolled' | 'none';
  getCourseAccessState: (course: Course) => CourseAccessState;
  hasVideoAccess: (video: VideoItem) => boolean;
  getCourseCompletion: (course: Course) => {
    completedCount: number;
    totalCount: number;
    percent: number;
    status: 'not_started' | 'in_progress' | 'completed';
  };
  getEnrolledCourses: () => Course[];
  getContinueLearningCourse: () => Course | null;
  getPathCompletion: (courseIds: string[]) => { completed: number; total: number; percent: number };
  getLearningHoursTotal: () => number;

  // Mutations
  enrollFreeCourse: (courseId: string) => void;
  purchaseCourse: (course: Course, paymentLabel?: string) => void;
  upgradePlan: (plan: PlanTier, billingCycle: BillingCycle) => void;
  enrollLearningPath: (pathId: string) => void;
  toggleWatchlistVideo: (videoId: string) => void;
  toggleSavedCourse: (courseId: string) => void;
  toggleLessonComplete: (courseId: string, lessonId: string, forceComplete?: boolean) => void;
  updateLessonPosition: (courseId: string, lessonId: string, seconds: number) => void;
  saveLessonNote: (courseId: string, lessonId: string, note: string) => void;
  updateVideoPosition: (videoId: string, seconds: number) => void;
  submitAssessmentAttempt: (assessmentId: string, correctCount: number, totalQuestions: number) => AssessmentAttempt;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  updateProfile: (patch: Partial<Pick<User, 'fullName' | 'email' | 'phone' | 'jobTitle' | 'organization' | 'bio' | 'learningGoal' | 'avatarColor' | 'avatarUrl'>>) => void;
  updateSettings: (patch: Partial<UserSettings>) => void;
  switchDemoPlan: (tier: PlanTier) => void;
  resetDemoState: () => void;
}

const LearnerContext = createContext<LearnerContextValue | null>(null);

export const LearnerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<PersistedLearnerState>(() => loadState());
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [sessionPassword, setSessionPassword] = useState<string>('Learner@2026');

  const login: LearnerContextValue['login'] = async (payload) => {
    if (!API_CONFIG.useMock) {
      const remoteUser = await apiRequest<User>('/auth/login', {
        method: 'POST',
        body: JSON.stringify(payload),
      });
      setState((prev) => ({
        ...prev,
        user: { ...prev.user, ...remoteUser },
      }));
      setSessionPassword(payload.password);
      setIsAuthenticated(true);
      return;
    }

    await delay(250);
    const identifier = payload.identifier.trim();
    if (!identifier || payload.password.length < 6) {
      throw new Error('Invalid credentials. Please check your email/phone and password.');
    }

    setState((prev) => {
      const normalized = identifier.toLowerCase();
      const matchedDemo = DEMO_LEARNER_ACCOUNTS.find(
        (acc) =>
          acc.email.toLowerCase() === normalized ||
          acc.phone === identifier ||
          (acc.tier === 'basic' && normalized === 'alex.sovann@camcodelearn.edu'),
      );
      if (matchedDemo) {
        return {
          ...prev,
          user: {
            ...prev.user,
            ...matchedDemo.userPatch,
          },
        };
      }

      const isEmail = identifier.includes('@');
      const matchesExisting =
        normalized === prev.user.email.toLowerCase() ||
        identifier === prev.user.phone;
      if (matchesExisting) return prev;
      return {
        ...prev,
        user: {
          ...prev.user,
          fullName: isEmail
            ? identifier
                .split('@')[0]
                .replace(/[._]/g, ' ')
                .replace(/\b\w/g, (c) => c.toUpperCase())
            : prev.user.fullName,
          email: isEmail ? identifier : prev.user.email,
          phone: isEmail ? prev.user.phone : identifier,
          activePlan: 'free',
          billingCycle: undefined,
        },
      };
    });
    setSessionPassword(payload.password);
    setIsAuthenticated(true);
  };

  const register: LearnerContextValue['register'] = async (payload) => {
    if (!API_CONFIG.useMock) {
      const remoteUser = await apiRequest<User>('/auth/register', {
        method: 'POST',
        body: JSON.stringify(payload),
      });
      setState((prev) => ({
        ...prev,
        user: { ...prev.user, ...remoteUser },
      }));
      setSessionPassword(payload.password);
      setIsAuthenticated(true);
      return;
    }

    await delay(280);
    setState((prev) => ({
      ...prev,
      user: {
        ...prev.user,
        id: `user-${Date.now()}`,
        fullName: payload.fullName.trim(),
        email: payload.email.trim(),
        phone: payload.phone?.trim() || undefined,
        preferredLanguage: payload.preferredLanguage,
        activePlan: 'free',
        billingCycle: undefined,
      },
    }));
    setSessionPassword(payload.password);
    setIsAuthenticated(true);
  };

  const changePassword: LearnerContextValue['changePassword'] = async (payload) => {
    if (!API_CONFIG.useMock) {
      await apiRequest('/auth/change-password', {
        method: 'POST',
        body: JSON.stringify(payload),
      });
      setSessionPassword(payload.newPassword);
      return;
    }

    await delay(250);
    if (!payload.currentPassword || payload.currentPassword !== sessionPassword) {
      throw new Error('Current password is incorrect.');
    }
    if (
      payload.newPassword.length < 8 ||
      !/[A-Za-z]/.test(payload.newPassword) ||
      !/\d/.test(payload.newPassword)
    ) {
      throw new Error('New password must be at least 8 characters and include a letter and a number.');
    }
    setSessionPassword(payload.newPassword);
  };

  const logout = () => {
    if (!API_CONFIG.useMock) {
      apiRequest('/auth/logout', { method: 'POST' }).catch(() => {});
    }
    setIsAuthenticated(false);
  };

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // ignore storage quota errors
    }
  }, [state]);

  const hasCourseAccess = (course: Course): 'purchased' | 'subscription' | 'free_enrolled' | 'none' => {
    const { user } = state;
    if (user.purchasedCourseIds.includes(course.id)) return 'purchased';
    if (course.price === 0 && user.enrolledFreeCourseIds.includes(course.id)) return 'free_enrolled';
    if (user.activePlan !== 'free' && course.includedInPlans.includes(user.activePlan)) {
      return 'subscription';
    }
    return 'none';
  };

  const getCourseAccessState = (course: Course): CourseAccessState => {
    const access = hasCourseAccess(course);
    if (access === 'purchased') return 'purchased';
    if (access === 'free_enrolled') return 'free_enrolled';
    if (access === 'subscription') return 'subscription';
    if (course.price === 0) return 'free_available';
    if (course.includedInPlans.includes('premium') || course.includedInPlans.includes('basic')) {
      return 'paid_locked';
    }
    return 'subscription_required';
  };

  const hasVideoAccess = (video: VideoItem): boolean => {
    if (video.accessType === 'free') return true;
    return video.requiredPlans.includes(state.user.activePlan);
  };

  const getCourseCompletion = (course: Course) => {
    const allLessons = catalogService.getAllLessons(course);
    const totalCount = allLessons.length || course.lessonsCount;
    const progress = state.courseProgress[course.id];
    const completedIds = progress?.completedLessonIds ?? [];
    const completedCount = allLessons.filter((l) => completedIds.includes(l.id)).length;
    const percent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;
    const status: 'not_started' | 'in_progress' | 'completed' =
      percent >= 100 ? 'completed' : completedCount > 0 || (progress?.lastPositionSeconds ?? 0) > 0 ? 'in_progress' : 'not_started';
    return { completedCount, totalCount, percent, status };
  };

  const getEnrolledCourses = (): Course[] => {
    return MOCK_COURSES.filter((course) => {
      if (hasCourseAccess(course) !== 'none') return true;
      return Boolean(state.courseProgress[course.id]);
    });
  };

  const getContinueLearningCourse = (): Course | null => {
    const enrolled = getEnrolledCourses();
    const inProgress = enrolled.filter((c) => getCourseCompletion(c).status === 'in_progress');
    const candidates = inProgress.length > 0 ? inProgress : enrolled;
    if (candidates.length === 0) return null;
    return [...candidates].sort((a, b) => {
      const dateA = state.courseProgress[a.id]?.lastAccessedAt ?? '';
      const dateB = state.courseProgress[b.id]?.lastAccessedAt ?? '';
      return dateB.localeCompare(dateA);
    })[0];
  };

  const getPathCompletion = (courseIds: string[]) => {
    const courses = courseIds.map((id) => catalogService.getCourseById(id)).filter((c): c is Course => Boolean(c));
    if (courses.length === 0) return { completed: 0, total: 0, percent: 0 };
    const completed = courses.filter((c) => getCourseCompletion(c).status === 'completed').length;
    const percent = Math.round(
      courses.reduce((acc, c) => acc + getCourseCompletion(c).percent, 0) / courses.length,
    );
    return { completed, total: courses.length, percent };
  };

  const getLearningHoursTotal = () => {
    const completedMinutes = MOCK_COURSES.reduce((sum, course) => {
      const completedIds = state.courseProgress[course.id]?.completedLessonIds ?? [];
      const lessons = catalogService.getAllLessons(course);
      const mins = lessons
        .filter((l) => completedIds.includes(l.id))
        .reduce((acc, l) => acc + l.durationMinutes, 0);
      return sum + mins;
    }, 0);
    // Add baseline weekly study time so numbers feel meaningful
    return Number(((completedMinutes + state.user.weeklyMinutes * 4) / 60).toFixed(1));
  };

  const enrollFreeCourse = (courseId: string) => {
    const course = catalogService.getCourseById(courseId);
    const firstLesson = course ? catalogService.getAllLessons(course)[0]?.id ?? '' : '';
    const today = new Date().toISOString().slice(0, 10);

    setState((prev) => ({
      ...prev,
      user: {
        ...prev.user,
        enrolledFreeCourseIds: Array.from(new Set([...prev.user.enrolledFreeCourseIds, courseId])),
      },
      courseProgress: prev.courseProgress[courseId]
        ? prev.courseProgress
        : {
            ...prev.courseProgress,
            [courseId]: {
              courseId,
              completedLessonIds: [],
              lastLessonId: firstLesson,
              lastPositionSeconds: 0,
              lastAccessedAt: today,
              enrolledAt: today,
              notesByLessonId: {},
            },
          },
    }));
  };

  const purchaseCourse = (course: Course, paymentLabel = 'Card •••• 4242') => {
    const firstLesson = catalogService.getAllLessons(course)[0]?.id ?? '';
    const today = new Date().toISOString().slice(0, 10);

    setState((prev) => ({
      ...prev,
      user: {
        ...prev.user,
        purchasedCourseIds: Array.from(new Set([...prev.user.purchasedCourseIds, course.id])),
      },
      courseProgress: prev.courseProgress[course.id]
        ? prev.courseProgress
        : {
            ...prev.courseProgress,
            [course.id]: {
              courseId: course.id,
              completedLessonIds: [],
              lastLessonId: firstLesson,
              lastPositionSeconds: 0,
              lastAccessedAt: today,
              enrolledAt: today,
              notesByLessonId: {},
            },
          },
      invoices: [
        {
          id: `INV-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
          date: today,
          description: {
            en: `Individual Course — ${course.title.en}`,
            km: `ទិញវគ្គសិក្សា — ${course.title.km ?? course.title.en}`,
          },
          amount: course.price,
          status: 'paid',
          method: paymentLabel,
        },
        ...prev.invoices,
      ],
      notifications: [
        {
          id: `notif-${Date.now()}`,
          type: 'course',
          title: { en: 'Course Unlocked!', km: 'បានបើកវគ្គសិក្សាដោយជោគជ័យ!' },
          message: {
            en: `You now have lifetime access to "${course.title.en}".`,
            km: `ឥឡូវអ្នកអាចចូលរៀន "${course.title.km ?? course.title.en}" បានពេញលេញ។`,
          },
          createdAt: 'Just now',
          read: false,
          actionUrl: `/learn/${course.slug}`,
          actionLabel: { en: 'Start Learning', km: 'ចាប់ផ្តើមរៀន' },
        },
        ...prev.notifications,
      ],
    }));
  };

  const upgradePlan = (plan: PlanTier, billingCycle: BillingCycle) => {
    const today = new Date().toISOString().slice(0, 10);
    const planObj = catalogService.getPlans().find((p) => p.tier === plan);
    const amount = planObj ? (billingCycle === 'yearly' ? planObj.yearlyPrice : planObj.monthlyPrice) : 0;

    setState((prev) => ({
      ...prev,
      user: {
        ...prev.user,
        activePlan: plan,
        billingCycle,
        renewalDate: plan === 'free' ? undefined : '2026-12-25',
      },
      invoices:
        amount > 0
          ? [
              {
                id: `INV-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
                date: today,
                description: {
                  en: `${planObj?.name.en ?? plan} (${billingCycle})`,
                  km: `${planObj?.name.km ?? plan} (${billingCycle})`,
                },
                amount,
                status: 'paid',
                method: 'Card •••• 4242',
              },
              ...prev.invoices,
            ]
          : prev.invoices,
    }));
  };

  const enrollLearningPath = (pathId: string) => {
    const path = catalogService.getLearningPaths().find((p) => p.id === pathId);
    setState((prev) => {
      const nextEnrolledFree = [...prev.user.enrolledFreeCourseIds];
      if (path) {
        path.courseIds.forEach((cid) => {
          const c = catalogService.getCourseById(cid);
          if (c && c.price === 0 && !nextEnrolledFree.includes(cid)) {
            nextEnrolledFree.push(cid);
          }
        });
      }
      return {
        ...prev,
        user: {
          ...prev.user,
          enrolledPathIds: Array.from(new Set([...prev.user.enrolledPathIds, pathId])),
          enrolledFreeCourseIds: nextEnrolledFree,
        },
      };
    });
  };

  const toggleWatchlistVideo = (videoId: string) => {
    setState((prev) => {
      const exists = prev.user.watchlistVideoIds.includes(videoId);
      return {
        ...prev,
        user: {
          ...prev.user,
          watchlistVideoIds: exists
            ? prev.user.watchlistVideoIds.filter((id) => id !== videoId)
            : [...prev.user.watchlistVideoIds, videoId],
        },
      };
    });
  };

  const toggleSavedCourse = (courseId: string) => {
    setState((prev) => {
      const exists = prev.user.savedCourseIds.includes(courseId);
      return {
        ...prev,
        user: {
          ...prev.user,
          savedCourseIds: exists
            ? prev.user.savedCourseIds.filter((id) => id !== courseId)
            : [...prev.user.savedCourseIds, courseId],
        },
      };
    });
  };

  const toggleLessonComplete = (courseId: string, lessonId: string, forceComplete?: boolean) => {
    const today = new Date().toISOString().slice(0, 10);
    const course = catalogService.getCourseById(courseId);

    setState((prev) => {
      const existing = prev.courseProgress[courseId] ?? {
        courseId,
        completedLessonIds: [],
        lastLessonId: lessonId,
        lastPositionSeconds: 0,
        lastAccessedAt: today,
        enrolledAt: today,
        notesByLessonId: {},
      };
      const isDone = existing.completedLessonIds.includes(lessonId);
      const shouldComplete = forceComplete !== undefined ? forceComplete : !isDone;
      const nextCompleted = shouldComplete
        ? Array.from(new Set([...existing.completedLessonIds, lessonId]))
        : existing.completedLessonIds.filter((id) => id !== lessonId);

      // Check if completing this lesson finishes the course & awards a certificate
      let nextCertificates = prev.certificates;
      let nextNotifications = prev.notifications;
      if (course && course.certificateIncluded && shouldComplete) {
        const allLessonIds = catalogService.getAllLessons(course).map((l) => l.id);
        const allDone = allLessonIds.length > 0 && allLessonIds.every((id) => nextCompleted.includes(id));
        const alreadyHasCert = prev.certificates.some((cert) => cert.courseId === course.id);
        if (allDone && !alreadyHasCert) {
          const instructor = catalogService.getInstructorById(course.instructorId);
          nextCertificates = [
            {
              id: `cert-${Date.now()}`,
              credentialCode: `CCL-2026-${Math.floor(1000 + Math.random() * 9000)}`,
              title: course.title,
              categorySlug: course.categorySlug,
              courseId: course.id,
              issuedAt: today,
              instructorName: instructor?.name ?? 'Camcode Faculty',
              hoursCompleted: course.durationHours,
            },
            ...prev.certificates,
          ];
          nextNotifications = [
            {
              id: `notif-cert-${Date.now()}`,
              type: 'achievement',
              title: { en: 'Certificate Earned!', km: 'ទទួលបានវិញ្ញាបនបត្រថ្មី!' },
              message: {
                en: `You completed "${course.title.en}" and earned an official certificate.`,
                km: `អ្នកបានបញ្ចប់ "${course.title.km ?? course.title.en}" និងទទួលបានវិញ្ញាបនបត្រ។`,
              },
              createdAt: 'Just now',
              read: false,
              actionUrl: '/certifications',
              actionLabel: { en: 'View Certificate', km: 'មើលវិញ្ញាបនបត្រ' },
            },
            ...prev.notifications,
          ];
        }
      }

      return {
        ...prev,
        user: {
          ...prev.user,
          weeklyMinutes: shouldComplete && !isDone ? prev.user.weeklyMinutes + 15 : prev.user.weeklyMinutes,
        },
        courseProgress: {
          ...prev.courseProgress,
          [courseId]: {
            ...existing,
            completedLessonIds: nextCompleted,
            lastLessonId: lessonId,
            lastAccessedAt: today,
          },
        },
        certificates: nextCertificates,
        notifications: nextNotifications,
      };
    });
  };

  const updateLessonPosition = (courseId: string, lessonId: string, seconds: number) => {
    const today = new Date().toISOString().slice(0, 10);
    setState((prev) => {
      const existing = prev.courseProgress[courseId] ?? {
        courseId,
        completedLessonIds: [],
        lastLessonId: lessonId,
        lastPositionSeconds: 0,
        lastAccessedAt: today,
        enrolledAt: today,
        notesByLessonId: {},
      };
      return {
        ...prev,
        courseProgress: {
          ...prev.courseProgress,
          [courseId]: {
            ...existing,
            lastLessonId: lessonId,
            lastPositionSeconds: Math.max(0, Math.floor(seconds)),
            lastAccessedAt: today,
          },
        },
      };
    });
  };

  const saveLessonNote = (courseId: string, lessonId: string, note: string) => {
    const today = new Date().toISOString().slice(0, 10);
    setState((prev) => {
      const existing = prev.courseProgress[courseId] ?? {
        courseId,
        completedLessonIds: [],
        lastLessonId: lessonId,
        lastPositionSeconds: 0,
        lastAccessedAt: today,
        enrolledAt: today,
        notesByLessonId: {},
      };
      return {
        ...prev,
        courseProgress: {
          ...prev.courseProgress,
          [courseId]: {
            ...existing,
            notesByLessonId: {
              ...(existing.notesByLessonId ?? {}),
              [lessonId]: note,
            },
          },
        },
      };
    });
  };

  const updateVideoPosition = (videoId: string, seconds: number) => {
    setState((prev) => ({
      ...prev,
      videoResumeSeconds: {
        ...prev.videoResumeSeconds,
        [videoId]: Math.max(0, Math.floor(seconds)),
      },
    }));
  };

  const submitAssessmentAttempt = (
    assessmentId: string,
    correctCount: number,
    totalQuestions: number,
  ): AssessmentAttempt => {
    const assessment = catalogService.getAssessments().find((a) => a.id === assessmentId);
    const score = totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0;
    const passed = score >= (assessment?.passingScore ?? 75);
    const today = new Date().toISOString().slice(0, 10);

    const attempt: AssessmentAttempt = {
      assessmentId,
      score,
      passed,
      completedAt: today,
      correctCount,
      totalQuestions,
    };

    setState((prev) => {
      let nextCertificates = prev.certificates;
      let nextNotifications = prev.notifications;
      if (passed && assessment) {
        const exists = prev.certificates.some((c) => c.assessmentId === assessment.id);
        if (!exists) {
          nextCertificates = [
            {
              id: `cert-${Date.now()}`,
              credentialCode: `CCL-2026-${Math.floor(1000 + Math.random() * 9000)}`,
              title: assessment.certificateTitle,
              categorySlug: assessment.categorySlug,
              courseId: assessment.courseId,
              assessmentId: assessment.id,
              issuedAt: today,
              instructorName: 'Camcode Assessment Board',
              hoursCompleted: Math.max(4, Math.round(assessment.durationMinutes / 3)),
              score,
            },
            ...prev.certificates,
          ];
          nextNotifications = [
            {
              id: `notif-exam-${Date.now()}`,
              type: 'achievement',
              title: { en: 'Certification Exam Passed!', km: 'ប្រឡងជាប់វិញ្ញាបនបត្រ!' },
              message: {
                en: `You scored ${score}% on "${assessment.title.en}". Your verified certificate is ready.`,
                km: `អ្នកទទួលបានពិន្ទុ ${score}% ក្នុង "${assessment.title.km ?? assessment.title.en}"។`,
              },
              createdAt: 'Just now',
              read: false,
              actionUrl: '/certifications',
              actionLabel: { en: 'View Certificate', km: 'មើលវិញ្ញាបនបត្រ' },
            },
            ...prev.notifications,
          ];
        }
      }

      return {
        ...prev,
        assessmentAttempts: {
          ...prev.assessmentAttempts,
          [assessmentId]: attempt,
        },
        certificates: nextCertificates,
        notifications: nextNotifications,
      };
    });

    return attempt;
  };

  const markNotificationRead = (id: string) => {
    setState((prev) => ({
      ...prev,
      notifications: prev.notifications.map((n) => (n.id === id ? { ...n, read: true } : n)),
    }));
  };

  const markAllNotificationsRead = () => {
    setState((prev) => ({
      ...prev,
      notifications: prev.notifications.map((n) => ({ ...n, read: true })),
    }));
  };

  const updateProfile: LearnerContextValue['updateProfile'] = (patch) => {
    setState((prev) => ({
      ...prev,
      user: { ...prev.user, ...patch },
    }));
  };

  const updateSettings: LearnerContextValue['updateSettings'] = (patch) => {
    setState((prev) => ({
      ...prev,
      settings: { ...prev.settings, ...patch },
    }));
  };

  const switchDemoPlan = (tier: PlanTier) => {
    setState((prev) => ({
      ...prev,
      user: {
        ...prev.user,
        activePlan: tier,
        billingCycle: tier === 'free' ? undefined : prev.user.billingCycle ?? 'monthly',
      },
    }));
  };

  const resetDemoState = () => {
    const fresh = createInitialState();
    setState(fresh);
  };

  const achievements = useMemo<AchievementBadge[]>(() => {
    const completedCoursesCount = MOCK_COURSES.filter((c) => getCourseCompletion(c).status === 'completed').length;
    const passedExamsCount = Object.values(state.assessmentAttempts).filter((a) => a.passed).length;

    return INITIAL_ACHIEVEMENTS.map((ach) => {
      if (ach.id === 'ach-course-finisher') {
        const unlocked = completedCoursesCount >= 3;
        return { ...ach, progressCurrent: Math.min(3, completedCoursesCount), unlocked };
      }
      if (ach.id === 'ach-quiz-master') {
        const unlocked = passedExamsCount >= 2;
        return { ...ach, progressCurrent: Math.min(2, passedExamsCount), unlocked };
      }
      if (ach.id === 'ach-certified') {
        const count = state.certificates.length;
        return { ...ach, progressCurrent: Math.min(1, count), unlocked: count >= 1 };
      }
      return ach;
    });
  }, [state.courseProgress, state.assessmentAttempts, state.certificates]);

  const unreadNotificationCount = useMemo(
    () => state.notifications.filter((n) => !n.read).length,
    [state.notifications],
  );

  const value: LearnerContextValue = {
    user: state.user,
    isAuthenticated,
    login,
    register,
    changePassword,
    logout,
    courseProgress: state.courseProgress,
    videoResumeSeconds: state.videoResumeSeconds,
    assessmentAttempts: state.assessmentAttempts,
    certificates: state.certificates,
    achievements,
    notifications: state.notifications,
    unreadNotificationCount,
    invoices: state.invoices,
    settings: state.settings,
    hasCourseAccess,
    getCourseAccessState,
    hasVideoAccess,
    getCourseCompletion,
    getEnrolledCourses,
    getContinueLearningCourse,
    getPathCompletion,
    getLearningHoursTotal,
    enrollFreeCourse,
    purchaseCourse,
    upgradePlan,
    enrollLearningPath,
    toggleWatchlistVideo,
    toggleSavedCourse,
    toggleLessonComplete,
    updateLessonPosition,
    saveLessonNote,
    updateVideoPosition,
    submitAssessmentAttempt,
    markNotificationRead,
    markAllNotificationsRead,
    updateProfile,
    updateSettings,
    switchDemoPlan,
    resetDemoState,
  };

  return <LearnerContext.Provider value={value}>{children}</LearnerContext.Provider>;
};

export function useLearner() {
  const ctx = useContext(LearnerContext);
  if (!ctx) throw new Error('useLearner must be used within LearnerProvider');
  return ctx;
}

