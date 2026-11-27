import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Award, BookOpen, Compass } from 'lucide-react';
import { CourseCard } from '@/components/cards/CourseCard';
import { Button } from '@/components/ui/Button';
import { useLearner } from '@/context/LearnerContext';
import { useI18n } from '@/i18n/I18nContext';

type MyCoursesTab = 'all' | 'in_progress' | 'not_started' | 'completed';

export const MyCoursesPage: React.FC = () => {
  const { t } = useI18n();
  const { getEnrolledCourses, getCourseCompletion } = useLearner();
  const [activeTab, setActiveTab] = useState<MyCoursesTab>('all');

  const enrolled = getEnrolledCourses();

  const grouped = useMemo(() => {
    const inProgress = enrolled.filter((c) => getCourseCompletion(c).status === 'in_progress');
    const notStarted = enrolled.filter((c) => getCourseCompletion(c).status === 'not_started');
    const completed = enrolled.filter((c) => getCourseCompletion(c).status === 'completed');
    return {
      all: enrolled,
      in_progress: inProgress,
      not_started: notStarted,
      completed,
    };
  }, [enrolled, getCourseCompletion]);

  const tabs: { key: MyCoursesTab; label: string; count: number }[] = [
    { key: 'all', label: t.myCourses.tabAll, count: grouped.all.length },
    { key: 'in_progress', label: t.myCourses.tabInProgress, count: grouped.in_progress.length },
    { key: 'not_started', label: t.myCourses.tabNotStarted, count: grouped.not_started.length },
    { key: 'completed', label: t.myCourses.tabCompleted, count: grouped.completed.length },
  ];

  const list = grouped[activeTab];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <h1 className="font-serif-display text-[28px] sm:text-[34px] leading-[1.1] tracking-[-0.02em] font-medium text-[#141312] dark:text-[#f6f3ec]">
            {t.myCourses.title}
          </h1>
          <p className="text-[14.5px] text-[#4c4842] dark:text-[#D5D1C8] mt-1">{t.myCourses.subtitle}</p>
        </div>
        <div className="flex items-center gap-2">
          <Link to="/certifications">
            <Button variant="outline" size="sm" leftIcon={<Award className="h-4 w-4" />}>
              {t.nav.certifications}
            </Button>
          </Link>
          <Link to="/explore">
            <Button size="sm" leftIcon={<Compass className="h-4 w-4" />}>
              {t.nav.explore}
            </Button>
          </Link>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar border-b border-[#ded8ca] dark:border-[#2A332E] pb-3">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => setActiveTab(tab.key)}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-[10px] text-[13.5px] font-semibold whitespace-nowrap transition-colors cursor-pointer ${
              activeTab === tab.key
                ? 'bg-[#1c5b48] dark:bg-[#2D7A62] text-white'
                : 'bg-[#efebe1] dark:bg-[#151A17] border border-[#ded8ca] dark:border-[#2A332E] text-[#4c4842] dark:text-[#D5D1C8] hover:border-[#1c5b48] dark:border-[#7CD4B5]'
            }`}
          >
            <span>{tab.label}</span>
            <span
              className={`px-1.5 py-0.5 rounded-full text-[11px] ${
                activeTab === tab.key
                  ? 'bg-white/20 text-white'
                  : 'bg-[#e5dfd2] dark:bg-[#181E1B] text-[#6e6a62] dark:text-[#A3ACA6]'
              }`}
            >
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* Course Grid */}
      {list.length === 0 ? (
        <div className="card-note rounded-[18px] p-10 text-center space-y-3">
          <BookOpen className="h-10 w-10 text-[#6e6a62] mx-auto" />
          <h3 className="text-[18px] font-bold text-[#141312] dark:text-[#f6f3ec]">{t.myCourses.emptyTitle}</h3>
          <p className="text-[14px] text-[#6e6a62] dark:text-[#A3ACA6]">{t.myCourses.emptySubtitle}</p>
          <Link to="/explore" className="inline-block">
            <Button>{t.nav.explore}</Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {list.map((course) => (
            <CourseCard key={course.id} course={course} variant="enrolled" />
          ))}
        </div>
      )}
    </div>
  );
};

