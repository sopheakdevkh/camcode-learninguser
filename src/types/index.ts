export type Locale = 'en' | 'km';

export interface LocalizedText {
  en: string;
  km?: string;
}

export type DifficultyLevel = 'beginner' | 'intermediate' | 'advanced';
export type ContentLanguage = 'en' | 'km' | 'bilingual';
export type VideoAccessType = 'free' | 'subscription' | 'premium';
export type PlanTier = 'free' | 'basic' | 'premium';
export type BillingCycle = 'monthly' | 'yearly';

export interface Category {
  id: string;
  slug: string;
  name: LocalizedText;
  description: LocalizedText;
  icon: string;
  courseCount: number;
  videoCount: number;
  accentColor: string;
}

export interface Instructor {
  id: string;
  name: string;
  role: LocalizedText;
  bio: LocalizedText;
  avatarColor: string;
  initials: string;
  rating: number;
  studentsCount: number;
  coursesCount: number;
}

export interface LessonResource {
  id: string;
  title: LocalizedText;
  fileType: 'PDF' | 'XLSX' | 'FIG' | 'DOCX' | 'ZIP';
  sizeLabel: string;
  description: LocalizedText;
}

export interface TranscriptLine {
  timeSeconds: number;
  speaker: string;
  text: LocalizedText;
}

export interface LessonQuizQuestion {
  id: string;
  question: LocalizedText;
  options: LocalizedText[];
  correctIndex: number;
  explanation: LocalizedText;
}

export interface CourseLesson {
  id: string;
  title: LocalizedText;
  durationMinutes: number;
  isPreview: boolean;
  type: 'video' | 'reading' | 'quiz';
  summary?: LocalizedText;
  readingSections?: {
    heading: LocalizedText;
    body: LocalizedText;
    bullets?: LocalizedText[];
  }[];
  takeaways?: LocalizedText[];
  resources?: LessonResource[];
  transcript?: TranscriptLine[];
  quizQuestions?: LessonQuizQuestion[];
}

export interface CourseSection {
  id: string;
  title: LocalizedText;
  lessons: CourseLesson[];
}

export interface CourseReview {
  id: string;
  authorName: string;
  authorRole: LocalizedText;
  rating: number;
  date: string;
  comment: LocalizedText;
}

export interface Course {
  id: string;
  slug: string;
  title: LocalizedText;
  subtitle: LocalizedText;
  description: LocalizedText;
  categorySlug: string;
  instructorId: string;
  difficulty: DifficultyLevel;
  durationHours: number;
  lessonsCount: number;
  language: ContentLanguage;
  price: number; // 0 for free
  originalPrice?: number;
  includedInPlans: PlanTier[];
  rating: number;
  reviewsCount: number;
  studentsCount: number;
  lastUpdated: string;
  thumbnailTheme: string;
  thumbnailLabel: string;
  featured: boolean;
  certificateIncluded: boolean;
  outcomes: LocalizedText[];
  requirements: LocalizedText[];
  curriculum: CourseSection[];
  reviews: CourseReview[];
}

export interface VideoItem {
  id: string;
  slug: string;
  title: LocalizedText;
  description: LocalizedText;
  categorySlug: string;
  instructorId: string;
  durationMinutes: number;
  publishedAt: string;
  accessType: VideoAccessType;
  requiredPlans: PlanTier[];
  viewsCount: number;
  featured?: boolean;
  trending?: boolean;
  recommended?: boolean;
  recentlyAdded?: boolean;
  thumbnailTheme: string;
  tags: string[];
  chapters?: { timeSeconds: number; title: LocalizedText }[];
  transcript?: TranscriptLine[];
  resources?: LessonResource[];
}

export interface LearningPath {
  id: string;
  slug: string;
  title: LocalizedText;
  subtitle: LocalizedText;
  description: LocalizedText;
  categorySlug: string;
  level: DifficultyLevel;
  estimatedHours: number;
  courseIds: string[];
  badgeName: LocalizedText;
  outcomes: LocalizedText[];
  accentColor: string;
  thumbnailTheme: string;
}

export interface AssessmentQuestion {
  id: string;
  question: LocalizedText;
  options: LocalizedText[];
  correctIndex: number;
  explanation: LocalizedText;
}

export interface Assessment {
  id: string;
  slug: string;
  title: LocalizedText;
  description: LocalizedText;
  courseId?: string;
  categorySlug: string;
  durationMinutes: number;
  passingScore: number; // percentage e.g. 80
  dueDate?: string;
  difficulty: DifficultyLevel;
  certificateTitle: LocalizedText;
  questions: AssessmentQuestion[];
}

export interface AssessmentAttempt {
  assessmentId: string;
  score: number;
  passed: boolean;
  completedAt: string;
  correctCount: number;
  totalQuestions: number;
}

export interface CertificateRecord {
  id: string;
  credentialCode: string;
  title: LocalizedText;
  categorySlug: string;
  courseId?: string;
  assessmentId?: string;
  issuedAt: string;
  instructorName: string;
  hoursCompleted: number;
  score?: number;
}

export interface AchievementBadge {
  id: string;
  title: LocalizedText;
  description: LocalizedText;
  xp: number;
  icon: 'Award' | 'Flame' | 'CheckCircle2' | 'BookOpen' | 'Sparkles' | 'Clock' | 'Compass' | 'ShieldCheck';
  category: 'progress' | 'consistency' | 'mastery' | 'exploration';
  unlocked: boolean;
  unlockedAt?: string;
  progressCurrent: number;
  progressTarget: number;
}

export interface NotificationItem {
  id: string;
  type: 'course' | 'achievement' | 'assessment' | 'billing';
  title: LocalizedText;
  message: LocalizedText;
  createdAt: string;
  read: boolean;
  actionUrl?: string;
  actionLabel?: LocalizedText;
}

export interface InvoiceRecord {
  id: string;
  date: string;
  description: LocalizedText;
  amount: number;
  status: 'paid' | 'refunded';
  method: string;
}

export interface SubscriptionPlanFeature {
  label: LocalizedText;
  included: boolean;
  detail?: LocalizedText;
}

export interface SubscriptionPlan {
  id: string;
  tier: PlanTier;
  name: LocalizedText;
  tagline: LocalizedText;
  monthlyPrice: number;
  yearlyPrice: number;
  currency: 'USD';
  taxRate: number;
  highlighted?: boolean;
  autoRenewNotice: LocalizedText;
  cancellationPolicy: LocalizedText;
  features: SubscriptionPlanFeature[];
}

export interface CourseProgressRecord {
  courseId: string;
  completedLessonIds: string[];
  lastLessonId: string;
  lastPositionSeconds: number; // saved video resume timestamp
  lastAccessedAt: string;
  enrolledAt: string;
  notesByLessonId?: Record<string, string>;
}

export interface UserSettings {
  autoplayNextLesson: boolean;
  defaultPlaybackSpeed: 1 | 1.25 | 1.5 | 2;
  captionsEnabled: boolean;
  dailyGoalMinutes: number;
  emailCourseUpdates: boolean;
  emailWeeklyDigest: boolean;
  inAppReminders: boolean;
}

export interface User {
  id: string;
  fullName: string;
  email: string;
  phone?: string;
  jobTitle: string;
  organization: string;
  bio: string;
  learningGoal: string;
  avatarColor: string;
  avatarUrl?: string;
  preferredLanguage: Locale;
  activePlan: PlanTier;
  billingCycle?: BillingCycle;
  renewalDate?: string;
  purchasedCourseIds: string[];
  enrolledFreeCourseIds: string[];
  enrolledPathIds: string[];
  watchlistVideoIds: string[];
  savedCourseIds: string[];
  streakDays: number;
  weeklyMinutes: number;
  weeklyGoalMinutes: number;
}

export type CourseSortOption =
  | 'recommended'
  | 'popular'
  | 'newest'
  | 'highest_rated'
  | 'price_asc'
  | 'price_desc';

export type AccessFilterOption = 'all' | 'free' | 'premium' | 'purchased';

export interface CourseFilterParams {
  q?: string;
  category?: string;
  difficulty?: DifficultyLevel | '';
  accessType?: AccessFilterOption;
  sort?: CourseSortOption;
  page?: number;
  pageSize?: number;
}

