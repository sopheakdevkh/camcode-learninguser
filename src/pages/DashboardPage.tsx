import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Award,
  BookOpen,
  CheckCircle2,
  ClipboardCheck,
  Clock,
  Crown,
  Flame,
  Play,
  TrendingUp,
} from 'lucide-react';
import { CategoryIconBox } from '@/components/academy/CourseThumbnail';
import { CourseCard } from '@/components/cards/CourseCard';
import { AreaTrendChart, CategoryDonutCard } from '@/components/charts/LearningCharts';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { useLearner } from '@/context/LearnerContext';
import { useI18n } from '@/i18n/I18nContext';
import { catalogService } from '@/services/catalogService';

function formatPosition(sec: number) {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${m}:${String(s).padStart(2, '0')}`;
}

export const DashboardPage: React.FC = () => {
  const { t, pickText, formatNumber } = useI18n();
  const {
    user,
    courseProgress,
    certificates,
    achievements,
    assessmentAttempts,
    getEnrolledCourses,
    getCourseCompletion,
    getContinueLearningCourse,
    getPathCompletion,
    getLearningHoursTotal,
  } = useLearner();

  const [chartMetric, setChartMetric] = useState<'minutes' | 'lessons'>('minutes');

  const enrolledCourses = getEnrolledCourses();
  const completedCoursesCount = enrolledCourses.filter(
    (c) => getCourseCompletion(c).status === 'completed',
  ).length;
  const activeCourses = enrolledCourses.filter(
    (c) => getCourseCompletion(c).status !== 'completed',
  );
  const continueCourse = getContinueLearningCourse();
  const continueProgress = continueCourse ? courseProgress[continueCourse.id] : undefined;
  const continueLessons = continueCourse ? catalogService.getAllLessons(continueCourse) : [];
  const continueLessonObj =
    continueLessons.find((l) => l.id === continueProgress?.lastLessonId) ?? continueLessons[0];
  const continueCompletion = continueCourse ? getCourseCompletion(continueCourse) : null;

  const learningPaths = catalogService.getLearningPaths();
  const assessments = catalogService.getAssessments();
  const recommendedCourses = catalogService
    .getAllCourses()
    .filter((c) => !enrolledCourses.some((e) => e.id === c.id))
    .slice(0, 3);

  const firstName = user.fullName.split(' ')[0] || user.fullName;

  const trendSeries = useMemo(
    () =>
      chartMetric === 'minutes'
        ? {
            daily: [
              { label: 'Mon', value: 30 },
              { label: 'Tue', value: 45 },
              { label: 'Wed', value: 25 },
              { label: 'Thu', value: 50 },
              { label: 'Fri', value: 40 },
              { label: 'Sat', value: 35 },
              { label: 'Sun', value: 20 },
            ],
            weekly: [
              { label: 'Wk 1', value: 140 },
              { label: 'Wk 2', value: 185 },
              { label: 'Wk 3', value: 160 },
              { label: 'Wk 4', value: 215 },
              { label: 'Wk 5', value: 195 },
              { label: 'Wk 6', value: 245 },
            ],
            monthly: [
              { label: 'Jun', value: 480 },
              { label: 'Jul', value: 620 },
              { label: 'Aug', value: 590 },
              { label: 'Sep', value: 740 },
              { label: 'Oct', value: 810 },
              { label: 'Nov', value: 920 },
            ],
          }
        : {
            daily: [
              { label: 'Mon', value: 2 },
              { label: 'Tue', value: 3 },
              { label: 'Wed', value: 1 },
              { label: 'Thu', value: 4 },
              { label: 'Fri', value: 3 },
              { label: 'Sat', value: 2 },
              { label: 'Sun', value: 1 },
            ],
            weekly: [
              { label: 'Wk 1', value: 6 },
              { label: 'Wk 2', value: 9 },
              { label: 'Wk 3', value: 7 },
              { label: 'Wk 4', value: 11 },
              { label: 'Wk 5', value: 10 },
              { label: 'Wk 6', value: 13 },
            ],
            monthly: [
              { label: 'Jun', value: 18 },
              { label: 'Jul', value: 24 },
              { label: 'Aug', value: 21 },
              { label: 'Sep', value: 29 },
              { label: 'Oct', value: 34 },
              { label: 'Nov', value: 39 },
            ],
          },
    [chartMetric],
  );

  const categoryBreakdown = [
    { label: 'Digital Marketing', sublabel: '12 hrs · 2 Courses', value: 45, color: '#2563EB' },
    { label: 'Data & Practical AI', sublabel: '10 hrs · 2 Courses', value: 35, color: '#0891B2' },
    { label: 'UI/UX Design', sublabel: '4 hrs · 1 Course', value: 20, color: '#16A34A' },
  ];

  return (
    <div className="space-y-6">
      {/* Top Greeting Header (inspired by clean executive layout) */}
      <section className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-[24px] sm:text-[28px] font-bold text-[#0F172A] tracking-tight">
            {t.dashboard.welcomePrefix}, {firstName}!
          </h1>
          <p className="text-[14px] text-[#64748B] mt-0.5">{t.dashboard.subtitle}</p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-[10px] bg-white/90 dark:bg-slate-900 border border-[#E2E8F0] dark:border-slate-700 text-[12.5px]">
            <Flame className="h-4 w-4 text-amber-500" />
            <span className="font-semibold text-[#0F172A]">
              {user.streakDays} {t.dashboard.streakLabel}
            </span>
          </div>

          {continueCourse && continueLessonObj && (
            <Link to={`/learn/${continueCourse.slug}/${continueLessonObj.id}`}>
              <Button size="sm" leftIcon={<Play className="h-3.5 w-3.5 fill-current" />}>
                {t.dashboard.resumeLesson}
              </Button>
            </Link>
          )}
        </div>
      </section>

      {/* Row 1: 4 Executive KPI Stat Cards (soft circular icon badge + bold metric + delta) */}
      <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {[
          {
            label: t.dashboard.stats.enrolled,
            value: formatNumber(enrolledCourses.length),
            delta: `${activeCourses.length} ${t.dashboard.activeSuffix}`,
            deltaPositive: true,
            icon: <BookOpen className="h-5 w-5 text-[#2563EB]" />,
            circleBg: 'bg-[#EFF6FF] dark:bg-blue-950/70',
            to: '/my-courses',
          },
          {
            label: t.dashboard.stats.completed,
            value: formatNumber(completedCoursesCount),
            delta: t.dashboard.thisMonthDelta,
            deltaPositive: true,
            icon: <CheckCircle2 className="h-5 w-5 text-[#16A34A]" />,
            circleBg: 'bg-[#F0FDF4] dark:bg-emerald-950/70',
            to: '/my-courses',
          },
          {
            label: t.dashboard.stats.hours,
            value: `${getLearningHoursTotal()}h`,
            delta: `${Math.round((user.weeklyMinutes / user.weeklyGoalMinutes) * 100)}% ${t.dashboard.weeklyGoalSuffix}`,
            deltaPositive: true,
            icon: <Clock className="h-5 w-5 text-[#0891B2]" />,
            circleBg: 'bg-[#ECFEFF] dark:bg-cyan-950/70',
            to: '/achievements',
          },
          {
            label: t.dashboard.stats.certificates,
            value: formatNumber(certificates.length),
            delta: t.dashboard.verifiedLabel,
            deltaPositive: true,
            icon: <Award className="h-5 w-5 text-[#D97706]" />,
            circleBg: 'bg-[#FFFBEB] dark:bg-amber-950/70',
            to: '/certifications',
          },
        ].map((stat) => (
          <Link
            key={stat.label}
            to={stat.to}
            className="glass-card glass-card-interactive rounded-[14px] p-4 sm:p-5 flex items-start justify-between gap-3"
          >
            <div className="flex items-center gap-3.5 min-w-0">
              <div
                className={`h-11 w-11 rounded-full ${stat.circleBg} flex items-center justify-center shrink-0`}
              >
                {stat.icon}
              </div>
              <div className="min-w-0">
                <p className="text-[22px] font-bold text-[#0F172A] leading-tight">{stat.value}</p>
                <p className="text-[12.5px] text-[#64748B] truncate mt-0.5">{stat.label}</p>
              </div>
            </div>
            <span className="inline-flex items-center gap-0.5 text-[11.5px] font-semibold text-[#16A34A] shrink-0">
              <TrendingUp className="h-3 w-3" />
              {stat.delta}
            </span>
          </Link>
        ))}
      </section>

      {/* Row 2: 8-col Learning Progress Area Chart + 4-col Active Courses List */}
      <section className="grid grid-cols-1 xl:grid-cols-12 gap-5 items-stretch">
        <div className="xl:col-span-8 flex flex-col gap-5">
          <div className="relative">
            <div className="flex justify-end mb-2 xl:mb-0 xl:absolute xl:right-52 xl:top-5 xl:z-10">
              <div className="inline-flex rounded-[8px] border border-[#E2E8F0] dark:border-slate-700 bg-[#F8FAFC] dark:bg-slate-900 p-0.5 text-[11.5px]">
                <button
                  type="button"
                  onClick={() => setChartMetric('minutes')}
                  className={`px-2.5 py-1 rounded-[6px] cursor-pointer ${
                    chartMetric === 'minutes'
                      ? 'bg-[#2563EB] text-white font-semibold'
                      : 'text-[#64748B]'
                  }`}
                >
                  {t.dashboard.minutesTab}
                </button>
                <button
                  type="button"
                  onClick={() => setChartMetric('lessons')}
                  className={`px-2.5 py-1 rounded-[6px] cursor-pointer ${
                    chartMetric === 'lessons'
                      ? 'bg-[#2563EB] text-white font-semibold'
                      : 'text-[#64748B]'
                  }`}
                >
                  {t.dashboard.lessonsTab}
                </button>
              </div>
            </div>

            <AreaTrendChart
              title={t.dashboard.learningProgressSummary}
              subtitle={`${user.weeklyMinutes}/${user.weeklyGoalMinutes} ${t.common.minutes} · ${t.dashboard.thisWeek}`}
              seriesByRange={trendSeries}
              unitSuffix={chartMetric === 'minutes' ? t.common.minutes : t.common.lessons}
              rangeLabels={{
                daily: t.dashboard.daily,
                weekly: t.dashboard.weekly,
                monthly: t.dashboard.monthly,
              }}
              accentColor="#2563EB"
            />
          </div>

          {/* Compact Continue Learning Bar */}
          {continueCourse && continueCompletion && (
            <div className="glass-card rounded-[16px] p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3.5 min-w-0">
                <CategoryIconBox categorySlug={continueCourse.categorySlug} size="md" />
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-[#2563EB]">
                      {t.dashboard.continueLearning}
                    </span>
                    <span className="text-[11px] font-mono-custom text-[#64748B]">
                      {continueCompletion.percent}%
                    </span>
                  </div>
                  <h3 className="text-[15.5px] font-bold text-[#0F172A] truncate">
                    {pickText(continueCourse.title)}
                  </h3>
                  {continueLessonObj && (
                    <p className="text-[12.5px] text-[#64748B] truncate">
                      {pickText(continueLessonObj.title)}
                      {continueProgress?.lastPositionSeconds
                        ? ` · ${formatPosition(continueProgress.lastPositionSeconds)}`
                        : ''}
                    </p>
                  )}
                </div>
              </div>

              <Link to={`/learn/${continueCourse.slug}/${continueLessonObj?.id ?? ''}`} className="shrink-0">
                <Button size="sm" leftIcon={<Play className="h-3.5 w-3.5 fill-current" />}>
                  {t.dashboard.resumeLesson}
                </Button>
              </Link>
            </div>
          )}
        </div>

        {/* Right 4 cols: Active Courses List Card ("See All" like Active Projects in reference) */}
        <div className="xl:col-span-4 glass-card rounded-[16px] p-5 flex flex-col justify-between gap-4">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-[16px] font-bold text-[#0F172A]">
                {t.dashboard.myActiveCourses}
              </h2>
              <Link
                to="/my-courses"
                className="text-[12.5px] font-semibold text-[#2563EB] hover:underline"
              >
                {t.common.viewAll}
              </Link>
            </div>

            <div className="divide-y divide-[#E2E8F0]/70 dark:divide-slate-800">
              {enrolledCourses.slice(0, 4).map((course) => {
                const comp = getCourseCompletion(course);
                return (
                  <Link
                    key={course.id}
                    to={`/learn/${course.slug}`}
                    className="py-3 first:pt-1 last:pb-1 flex items-center justify-between gap-3 group"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <CategoryIconBox categorySlug={course.categorySlug} size="sm" />
                      <div className="min-w-0">
                        <p className="text-[13.5px] font-semibold text-[#0F172A] group-hover:text-[#2563EB] truncate">
                          {pickText(course.title)}
                        </p>
                        <p className="text-[11.5px] text-[#64748B]">
                          {comp.completedCount}/{comp.totalCount} {t.common.lessons} · {comp.percent}%
                        </p>
                      </div>
                    </div>
                    <span className="inline-flex items-center gap-1 text-[11.5px] text-[#64748B] shrink-0">
                      <Clock className="h-3.5 w-3.5 text-[#94A3B8]" />
                      {course.durationHours}h
                    </span>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Compact Membership Status strip inside bottom of right column */}
          <div className="p-3.5 rounded-[12px] bg-[#EFF6FF]/70 dark:bg-blue-950/30 border border-[#BFDBFE] dark:border-blue-900 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5 min-w-0">
              <Crown className="h-4.5 w-4.5 text-[#2563EB] shrink-0" />
              <div className="min-w-0">
                <p className="text-[12.5px] font-bold text-[#0F172A] capitalize truncate">
                  {user.activePlan} {t.dashboard.planLabel}
                </p>
                <p className="text-[11px] text-[#64748B] truncate">
                  {user.activePlan === 'premium' ? t.dashboard.allUnlocked : t.dashboard.upgradePrompt}
                </p>
              </div>
            </div>
            <Link to="/membership" className="shrink-0">
              <Button size="sm" variant="outline">
                {user.activePlan === 'premium' ? t.dashboard.managePlan : t.dashboard.upgradePlan}
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Row 3: 5-col Category Focus Donut + 7-col Assessments & Paths List */}
      <section className="grid grid-cols-1 xl:grid-cols-12 gap-5 items-stretch">
        <div className="xl:col-span-5 flex flex-col">
          <CategoryDonutCard
            title={t.dashboard.learningFocusTitle}
            items={categoryBreakdown}
            centerValue={`${getLearningHoursTotal()}h`}
            centerLabel={t.dashboard.totalStudy}
          />
        </div>

        <div className="xl:col-span-7 glass-card rounded-[16px] p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-[16px] font-bold text-[#0F172A]">
              {t.dashboard.upcomingAssessments} & {t.dashboard.learningPaths}
            </h2>
            <Link to="/assessments" className="text-[12.5px] font-semibold text-[#2563EB] hover:underline">
              {t.common.viewAll}
            </Link>
          </div>

          <div className="divide-y divide-[#E2E8F0]/70 dark:divide-slate-800">
            {assessments.slice(0, 3).map((assess) => {
              const attempt = assessmentAttempts[assess.id];
              return (
                <div
                  key={assess.id}
                  className="py-3 first:pt-1 last:pb-1 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="h-9 w-9 rounded-full bg-[#EFF6FF] dark:bg-blue-950/60 text-[#2563EB] flex items-center justify-center shrink-0">
                      <ClipboardCheck className="h-4.5 w-4.5" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[13.5px] font-semibold text-[#0F172A] truncate">
                        {pickText(assess.title)}
                      </p>
                      <p className="text-[12px] text-[#64748B]">
                        {assess.durationMinutes} {t.common.minutes} · {assess.passingScore}%
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2.5 shrink-0">
                    {attempt?.passed ? (
                      <Badge tone="success">{t.dashboard.passedLabel} {attempt.score}%</Badge>
                    ) : (
                      <Badge tone="warning">{t.dashboard.readyToTake}</Badge>
                    )}
                    <Link to={`/assessments/${assess.slug}`}>
                      <Button size="sm" variant="outline">
                        {attempt?.passed ? t.dashboard.reviewBtn : t.dashboard.startAssessment}
                      </Button>
                    </Link>
                  </div>
                </div>
              );
            })}

            {learningPaths.slice(0, 1).map((path) => {
              const pStats = getPathCompletion(path.courseIds);
              return (
                <div
                  key={path.id}
                  className="py-3 last:pb-1 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="h-9 w-9 rounded-full bg-[#F0FDF4] dark:bg-emerald-950/60 text-[#16A34A] flex items-center justify-center shrink-0">
                      <Award className="h-4.5 w-4.5" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[13.5px] font-semibold text-[#0F172A] truncate">
                        {pickText(path.title)}
                      </p>
                      <div className="flex items-center gap-2 mt-1 w-40">
                        <ProgressBar value={pStats.percent} heightClass="h-1.5" />
                        <span className="text-[11px] font-mono-custom text-[#64748B]">
                          {pStats.percent}%
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2.5 shrink-0">
                    <Badge tone="primary">{t.dashboard.learningPathTag}</Badge>
                    <Link to={`/learning-paths/${path.slug}`}>
                      <Button size="sm" variant="outline">
                        {t.dashboard.openBtn}
                      </Button>
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Recommended Courses + Recent Achievements */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-[17px] font-bold text-[#0F172A]">
            {t.dashboard.recommendedCourses}
          </h2>
          <div className="flex items-center gap-4">
            <span className="hidden sm:inline text-[12.5px] text-[#64748B]">
              {achievements.filter((a) => a.unlocked).length} {t.dashboard.badgesUnlocked}
            </span>
            <Link to="/explore" className="text-[13px] font-semibold text-[#2563EB] hover:underline">
              {t.dashboard.exploreMore}
            </Link>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {recommendedCourses.map((course) => (
            <CourseCard key={course.id} course={course} variant="explore" />
          ))}
        </div>
      </section>
    </div>
  );
};
