import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Award, CheckCircle2, Clock, Layers, Map } from 'lucide-react';
import { CourseCard } from '@/components/cards/CourseCard';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { useLearner } from '@/context/LearnerContext';
import { useI18n } from '@/i18n/I18nContext';
import { catalogService } from '@/services/catalogService';
import type { Course } from '@/types';

export const LearningPathsPage: React.FC = () => {
  const { t, pickText } = useI18n();
  const { user, getPathCompletion, enrollLearningPath } = useLearner();
  const paths = catalogService.getLearningPaths();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif-display text-[28px] sm:text-[34px] leading-[1.1] tracking-[-0.02em] font-medium text-[#141312] dark:text-[#f6f3ec]">
          {t.nav.learningPaths}
        </h1>
        <p className="text-[14.5px] text-[#4c4842] dark:text-[#D5D1C8] mt-1">
          Step-by-step career tracks combining curated courses into job-ready certifications.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {paths.map((path) => {
          const stats = getPathCompletion(path.courseIds);
          const isEnrolled = user.enrolledPathIds.includes(path.id);
          return (
            <div
              key={path.id}
              className="card-tile group rounded-[18px] overflow-hidden flex flex-col"
            >
              <div
                className={`p-5 bg-gradient-to-br ${path.thumbnailTheme} border-b border-white/70 dark:border-[#2A332E] space-y-3`}
              >
                <div className="flex items-center justify-between gap-2">
                  <Badge tone="primary">
                    <Map className="h-3.5 w-3.5" />
                    {stats.total} Courses
                  </Badge>
                  <Badge tone={isEnrolled ? 'success' : 'neutral'}>
                    {isEnrolled ? 'Enrolled' : path.level}
                  </Badge>
                </div>
                <h2 className="text-[19px] font-bold text-[#141312] dark:text-[#f6f3ec] leading-snug">
                  {pickText(path.title)}
                </h2>
              </div>

              <div className="flex-1 p-5 flex flex-col justify-between gap-5">
                <div className="space-y-4">
                  <p className="text-[13.5px] text-[#4c4842] dark:text-[#D5D1C8] leading-relaxed">
                    {pickText(path.subtitle)}
                  </p>

                  <div className="flex items-center gap-4 text-[12.5px] text-[#6e6a62] dark:text-[#A3ACA6]">
                    <span className="inline-flex items-center gap-1">
                      <Clock className="h-4 w-4 text-[#6e6a62]" />
                      {path.estimatedHours} {t.common.hours}
                    </span>
                    <span className="inline-flex items-center gap-1 text-[#1c5b48] dark:text-[#7CD4B5] font-medium">
                      <Award className="h-4 w-4" />
                      {pickText(path.badgeName)}
                    </span>
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex justify-between text-[12px]">
                      <span className="text-[#6e6a62] dark:text-[#A3ACA6]">Track progress</span>
                      <span className="font-mono-custom font-bold text-[#1c5b48] dark:text-[#7CD4B5]">
                        {stats.completed}/{stats.total} ({stats.percent}%)
                      </span>
                    </div>
                    <ProgressBar value={stats.percent} />
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-2">
                  {!isEnrolled && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => enrollLearningPath(path.id)}
                    >
                      Enroll Track
                    </Button>
                  )}
                  <Link to={`/learning-paths/${path.slug}`} className="flex-1">
                    <Button
                      size="sm"
                      fullWidth
                      rightIcon={<ArrowRight className="h-4 w-4" />}
                    >
                      {isEnrolled ? 'Open Track' : 'View Path'}
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export const LearningPathDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { t, pickText } = useI18n();
  const { user, getPathCompletion, getCourseCompletion, enrollLearningPath } = useLearner();

  const path = slug ? catalogService.getLearningPathBySlug(slug) : undefined;
  if (!path) {
    return (
      <div className="card-note rounded-[16px] p-10 text-center space-y-4">
        <h2 className="text-[20px] font-bold text-[#141312] dark:text-[#f6f3ec]">Learning path not found</h2>
        <Link to="/learning-paths">
          <Button>{t.nav.learningPaths}</Button>
        </Link>
      </div>
    );
  }

  const courses = path.courseIds
    .map((id) => catalogService.getCourseById(id))
    .filter((c): c is Course => Boolean(c));
  const stats = getPathCompletion(path.courseIds);
  const isEnrolled = user.enrolledPathIds.includes(path.id);

  return (
    <div className="space-y-6">
      <Link
        to="/learning-paths"
        className="inline-flex items-center gap-1.5 text-[13.5px] font-medium text-[#6e6a62] dark:text-[#A3ACA6] hover:text-[#1c5b48] dark:text-[#7CD4B5]"
      >
        <ArrowLeft className="h-4 w-4" />
        <span>Back to {t.nav.learningPaths}</span>
      </Link>

      <section className="card-note rounded-[20px] p-6 sm:p-8 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
        <div className="space-y-3 max-w-2xl">
          <div className="flex items-center gap-2">
            <Badge tone="primary">
              <Layers className="h-3.5 w-3.5" />
              {courses.length} Courses · {path.estimatedHours}h
            </Badge>
            <Badge tone="success">
              <Award className="h-3.5 w-3.5" />
              {pickText(path.badgeName)}
            </Badge>
          </div>
          <h1 className="font-serif-display text-[28px] sm:text-[36px] leading-[1.08] tracking-[-0.02em] font-medium text-[#141312] dark:text-[#f6f3ec]">
            {pickText(path.title)}
          </h1>
          <p className="text-[15px] text-[#4c4842] dark:text-[#D5D1C8]">{pickText(path.description)}</p>
          <div className="flex flex-wrap gap-3 pt-1">
            {path.outcomes.map((o, i) => (
              <span
                key={i}
                className="inline-flex items-center gap-1.5 text-[13px] text-[#4c4842] dark:text-[#D5D1C8] bg-white/80 dark:bg-[#151A17] px-3 py-1 rounded-full border border-[#ded8ca] dark:border-[#2A332E]"
              >
                <CheckCircle2 className="h-3.5 w-3.5 text-[#16A34A]" />
                {pickText(o)}
              </span>
            ))}
          </div>
        </div>

        <div className="w-full lg:w-72 rounded-[16px] bg-[#f6f3ec] dark:bg-[#151A17] border border-[#ded8ca] dark:border-[#2A332E] p-5 space-y-3 shrink-0">
          <div className="flex justify-between text-[13px]">
            <span className="font-medium text-[#6e6a62] dark:text-[#A3ACA6]">Overall Completion</span>
            <span className="font-mono-custom font-bold text-[#1c5b48] dark:text-[#7CD4B5]">{stats.percent}%</span>
          </div>
          <ProgressBar value={stats.percent} heightClass="h-2.5" />
          <p className="text-[12px] text-[#6e6a62] dark:text-[#A3ACA6]">
            {stats.completed} of {stats.total} courses completed
          </p>
          {!isEnrolled && (
            <Button fullWidth onClick={() => enrollLearningPath(path.id)}>
              Enroll in Learning Path
            </Button>
          )}
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-[19px] font-bold text-[#141312] dark:text-[#f6f3ec]">Ordered Path Curriculum</h2>
        <div className="space-y-4">
          {courses.map((course, idx) => {
            const cStats = getCourseCompletion(course);
            return (
              <div key={course.id} className="flex flex-col md:flex-row gap-4 items-stretch">
                <div className="md:w-14 flex md:flex-col items-center justify-center gap-2 shrink-0">
                  <span
                    className={`h-9 w-9 rounded-full flex items-center justify-center font-bold text-[14px] ${
                      cStats.status === 'completed'
                        ? 'bg-[#16A34A] text-white'
                        : 'bg-[#e4ede7] dark:bg-[#1B3028] dark:bg-[#1B3028] text-[#1c5b48] dark:text-[#7CD4B5] border border-[#c5d6cb] dark:border-[#2A4D3E] dark:border-blue-800'
                    }`}
                  >
                    {idx + 1}
                  </span>
                </div>
                <div className="flex-1">
                  <CourseCard course={course} variant="enrolled" />
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};

