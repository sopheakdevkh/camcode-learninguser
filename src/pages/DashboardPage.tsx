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
    { label: 'Digital Marketing', sublabel: '12 hrs · 2 Courses', value: 45, color: '#1c5b48' },
    { label: 'Data & Practical AI', sublabel: '10 hrs · 2 Courses', value: 35, color: '#2D7A62' },
    { label: 'UI/UX Design', sublabel: '4 hrs · 1 Course', value: 20, color: '#B8862D' },
  ];

  return (
    <div className="space-y-6">
      {/* Top Editorial Greeting Header */}
      <section className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-5 border-b border-[#ded8ca] dark:border-[#2A332E]">
        <div>
          <span className="swiss-eyebrow mb-2">
            <span className="swiss-dot" aria-hidden="true" />
            <span>LEARNER WORKSPACE</span>
          </span>
          <h1 className="font-serif-display text-[28px] sm:text-[34px] leading-[1.1] tracking-[-0.02em] text-[#141312] dark:text-[#f6f3ec]">
            {t.dashboard.welcomePrefix}, {firstName}!
          </h1>
          <p className="text-[14.5px] text-[#6e6a62] mt-1">{t.dashboard.subtitle}</p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <div className="inline-flex items-center gap-2 px-3.5 py-2 rounded-full bg-[#efebe1] dark:bg-[#151A17] border border-[#ded8ca] dark:border-[#2A332E] text-[12.5px]">
            <Flame className="h-4 w-4 text-[#B8862D]" />
            <span className="font-semibold text-[#141312] dark:text-[#f6f3ec] tabular-nums">
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

      {/* Row 1: 4 Tactile Havenline KPI Stat Tiles with Icon Inversion on Hover */}
      <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {[
          {
            idx: '01',
            label: t.dashboard.stats.enrolled,
            value: formatNumber(enrolledCourses.length),
            delta: `${activeCourses.length} ${t.dashboard.activeSuffix}`,
            icon: <BookOpen className="h-5 w-5" />,
            to: '/my-courses',
          },
          {
            idx: '02',
            label: t.dashboard.stats.completed,
            value: formatNumber(completedCoursesCount),
            delta: t.dashboard.thisMonthDelta,
            icon: <CheckCircle2 className="h-5 w-5" />,
            to: '/my-courses',
          },
          {
            idx: '03',
            label: t.dashboard.stats.hours,
            value: `${getLearningHoursTotal()}h`,
            delta: `${Math.round((user.weeklyMinutes / user.weeklyGoalMinutes) * 100)}% ${t.dashboard.weeklyGoalSuffix}`,
            icon: <Clock className="h-5 w-5" />,
            to: '/achievements',
          },
          {
            idx: '04',
            label: t.dashboard.stats.certificates,
            value: formatNumber(certificates.length),
            delta: t.dashboard.verifiedLabel,
            icon: <Award className="h-5 w-5" />,
            to: '/certifications',
          },
        ].map((stat) => (
          <Link
            key={stat.label}
            to={stat.to}
            className="card-tile group p-5 flex flex-col justify-between gap-4"
          >
            <div className="flex items-start justify-between">
              <span aria-hidden="true" className="icon-box">
                {stat.icon}
              </span>
              <span aria-hidden="true" className="index-number">
                {stat.idx}
              </span>
            </div>

            <div>
              <p className="font-serif-display text-[30px] leading-none tracking-[-0.02em] text-[#141312] dark:text-[#f6f3ec] tabular-nums">
                {stat.value}
              </p>
              <p className="text-[13px] text-[#6e6a62] truncate mt-1.5">{stat.label}</p>
            </div>

            <div className="pt-3 border-t border-[#ded8ca] dark:border-[#2A332E] transition-colors duration-[0.22s] group-hover:border-[#B9B3A6] flex items-center justify-between text-[11px] font-mono-tech uppercase tracking-[0.06em] text-[#1c5b48] dark:text-[#7CD4B5]">
              <span className="inline-flex items-center gap-1">
                <TrendingUp className="h-3 w-3" />
                {stat.delta}
              </span>
            </div>
          </Link>
        ))}
      </section>

      {/* Row 2: 8-col Learning Progress Area Chart + 4-col Active Courses List */}
      <section className="grid grid-cols-1 xl:grid-cols-12 gap-5 items-stretch">
        <div className="xl:col-span-8 flex flex-col gap-5">
          <div className="relative">
            <div className="flex justify-end mb-2 xl:mb-0 xl:absolute xl:right-56 xl:top-5 xl:z-10">
              <div className="inline-flex rounded-full border border-[#ded8ca] dark:border-[#2A332E] bg-[#e5dfd2] dark:bg-[#181E1B] p-1 text-[11.5px]">
                <button
                  type="button"
                  onClick={() => setChartMetric('minutes')}
                  className={`px-3 py-1 rounded-full cursor-pointer transition-colors ${
                    chartMetric === 'minutes'
                      ? 'bg-[#1c5b48] dark:bg-[#2D7A62] text-white font-semibold'
                      : 'text-[#6e6a62]'
                  }`}
                >
                  {t.dashboard.minutesTab}
                </button>
                <button
                  type="button"
                  onClick={() => setChartMetric('lessons')}
                  className={`px-3 py-1 rounded-full cursor-pointer transition-colors ${
                    chartMetric === 'lessons'
                      ? 'bg-[#1c5b48] dark:bg-[#2D7A62] text-white font-semibold'
                      : 'text-[#6e6a62]'
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
              accentColor="#1c5b48"
            />
          </div>

          {/* Compact Continue Learning Card */}
          {continueCourse && continueCompletion && (
            <div className="card-note group p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3.5 min-w-0">
                <CategoryIconBox categorySlug={continueCourse.categorySlug} size="md" />
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-mono-tech text-[10.5px] font-semibold uppercase tracking-[0.08em] text-[#1c5b48] dark:text-[#7CD4B5]">
                      {t.dashboard.continueLearning}
                    </span>
                    <span className="text-[11px] font-mono-custom text-[#6e6a62]">
                      {continueCompletion.percent}%
                    </span>
                  </div>
                  <h3 className="font-serif-display text-[19px] font-medium text-[#141312] dark:text-[#f6f3ec] truncate mt-0.5">
                    {pickText(continueCourse.title)}
                  </h3>
                  {continueLessonObj && (
                    <p className="text-[12.5px] text-[#6e6a62] truncate">
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

        {/* Right 4 cols: Active Courses List Card */}
        <div className="xl:col-span-4 card-note p-5 sm:p-6 flex flex-col justify-between gap-4">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-serif-display text-[20px] font-medium text-[#141312] dark:text-[#f6f3ec]">
                {t.dashboard.myActiveCourses}
              </h2>
              <Link
                to="/my-courses"
                className="font-mono-tech text-[11px] uppercase tracking-[0.06em] font-semibold text-[#1c5b48] dark:text-[#7CD4B5] hover:underline"
              >
                {t.common.viewAll}
              </Link>
            </div>

            <div className="divide-y divide-[#ded8ca] dark:divide-[#2A332E]">
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
                        <p className="text-[13.5px] font-semibold text-[#141312] dark:text-[#f6f3ec] group-hover:text-[#1c5b48] dark:group-hover:text-[#7CD4B5] truncate">
                          {pickText(course.title)}
                        </p>
                        <p className="text-[11.5px] font-mono-custom text-[#6e6a62]">
                          {comp.completedCount}/{comp.totalCount} {t.common.lessons} · {comp.percent}%
                        </p>
                      </div>
                    </div>
                    <span className="inline-flex items-center gap-1 font-mono-custom text-[11.5px] text-[#6e6a62] shrink-0">
                      <Clock className="h-3.5 w-3.5 opacity-70" />
                      {course.durationHours}h
                    </span>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Membership Status Strip */}
          <div className="p-3.5 rounded-2xl bg-[#e4ede7]/65 dark:bg-[#1B3028]/55 border border-[#c5d6cb] dark:border-[#2A4D3E] flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5 min-w-0">
              <Crown className="h-4.5 w-4.5 text-[#1c5b48] dark:text-[#7CD4B5] shrink-0" />
              <div className="min-w-0">
                <p className="text-[12.5px] font-bold text-[#141312] dark:text-[#f6f3ec] capitalize truncate">
                  {user.activePlan} {t.dashboard.planLabel}
                </p>
                <p className="text-[11px] text-[#6e6a62] truncate">
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

        <div className="xl:col-span-7 card-note p-5 sm:p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-serif-display text-[20px] font-medium text-[#141312] dark:text-[#f6f3ec]">
              {t.dashboard.upcomingAssessments} & {t.dashboard.learningPaths}
            </h2>
            <Link
              to="/assessments"
              className="font-mono-tech text-[11px] uppercase tracking-[0.06em] font-semibold text-[#1c5b48] dark:text-[#7CD4B5] hover:underline"
            >
              {t.common.viewAll}
            </Link>
          </div>

          <div className="divide-y divide-[#ded8ca] dark:divide-[#2A332E]">
            {assessments.slice(0, 3).map((assess) => {
              const attempt = assessmentAttempts[assess.id];
              return (
                <div
                  key={assess.id}
                  className="py-3 first:pt-1 last:pb-1 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="icon-box !w-9 !h-9 !rounded-xl">
                      <ClipboardCheck className="h-4 w-4" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[13.5px] font-semibold text-[#141312] dark:text-[#f6f3ec] truncate">
                        {pickText(assess.title)}
                      </p>
                      <p className="text-[12px] font-mono-custom text-[#6e6a62]">
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
                    <div className="icon-box !w-9 !h-9 !rounded-xl">
                      <Award className="h-4 w-4" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[13.5px] font-semibold text-[#141312] dark:text-[#f6f3ec] truncate">
                        {pickText(path.title)}
                      </p>
                      <div className="flex items-center gap-2 mt-1 w-40">
                        <ProgressBar value={pStats.percent} heightClass="h-1.5" />
                        <span className="text-[11px] font-mono-custom text-[#6e6a62]">
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
        <div className="flex items-center justify-between pb-3 border-b border-[#ded8ca] dark:border-[#2A332E]">
          <h2 className="font-serif-display text-[22px] font-medium text-[#141312] dark:text-[#f6f3ec]">
            {t.dashboard.recommendedCourses}
          </h2>
          <div className="flex items-center gap-4">
            <span className="hidden sm:inline font-mono-tech text-[11px] uppercase tracking-[0.06em] text-[#6e6a62]">
              {achievements.filter((a) => a.unlocked).length} {t.dashboard.badgesUnlocked}
            </span>
            <Link
              to="/explore"
              className="font-mono-tech text-[11.5px] uppercase tracking-[0.06em] font-semibold text-[#1c5b48] dark:text-[#7CD4B5] hover:underline"
            >
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
