import React, { useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  ArrowRight,
  Award,
  Check,
  CheckCircle2,
  Download,
  FileQuestion,
  FileText,
  Lock,
  PlayCircle,
  Sparkles,
} from 'lucide-react';
import { AcademyVideoPlayer } from '@/components/player/AcademyVideoPlayer';
import { Alert } from '@/components/ui/Alert';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { useLearner } from '@/context/LearnerContext';
import { useI18n } from '@/i18n/I18nContext';
import { catalogService } from '@/services/catalogService';

export const CourseWorkspacePage: React.FC = () => {
  const { slug, lessonId } = useParams<{ slug: string; lessonId?: string }>();
  const navigate = useNavigate();
  const { t, pickText } = useI18n();
  const {
    courseProgress,
    settings,
    hasCourseAccess,
    getCourseCompletion,
    toggleLessonComplete,
    updateLessonPosition,
    saveLessonNote,
  } = useLearner();

  const course = slug ? catalogService.getCourseBySlug(slug) : undefined;
  const [activeTab, setActiveTab] = useState<'overview' | 'resources' | 'notes'>('overview');
  const [theaterMode, setTheaterMode] = useState(false);
  const [quizSelections, setQuizSelections] = useState<Record<string, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [downloadedId, setDownloadedId] = useState<string | null>(null);

  const allLessons = useMemo(
    () => (course ? catalogService.getAllLessons(course) : []),
    [course],
  );

  if (!course) {
    return (
      <div className="card-note rounded-[16px] p-10 text-center space-y-4">
        <h2 className="text-[20px] font-bold text-[#141312] dark:text-[#f6f3ec]">Course not found</h2>
        <Link to="/my-courses">
          <Button>{t.nav.myCourses}</Button>
        </Link>
      </div>
    );
  }

  const access = hasCourseAccess(course);
  const isEnrolled = access !== 'none';
  const progress = courseProgress[course.id];
  const completion = getCourseCompletion(course);
  const instructor = catalogService.getInstructorById(course.instructorId);

  const currentLesson =
    allLessons.find((l) => l.id === lessonId) ??
    allLessons.find((l) => l.id === progress?.lastLessonId) ??
    allLessons[0];

  const currentIndex = allLessons.findIndex((l) => l.id === currentLesson?.id);
  const prevLesson = currentIndex > 0 ? allLessons[currentIndex - 1] : null;
  const nextLesson = currentIndex >= 0 && currentIndex < allLessons.length - 1 ? allLessons[currentIndex + 1] : null;
  const isLessonLocked = !isEnrolled && !currentLesson?.isPreview;
  const isLessonComplete = Boolean(
    currentLesson && progress?.completedLessonIds.includes(currentLesson.id),
  );

  const goToLesson = (id: string) => {
    setQuizSelections({});
    setQuizSubmitted(false);
    navigate(`/learn/${course.slug}/${id}`);
  };

  const handleSimulatedDownload = (resId: string, title: string) => {
    setDownloadedId(resId);
    const blob = new Blob([`Camcode Academy Resource\n\nCourse: ${course.title.en}\nResource: ${title}\n`], {
      type: 'text/plain;charset=utf-8',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    setTimeout(() => setDownloadedId(null), 2000);
  };

  const quizQuestions = currentLesson?.quizQuestions ?? [
    {
      id: `${currentLesson?.id}-default-q`,
      question: {
        en: `Which approach best applies the core takeaway from "${currentLesson?.title.en}"?`,
      },
      options: [
        { en: 'Document clear goals, measure outcomes, and iterate with structured templates' },
        { en: 'Skip verification and guess metrics manually' },
      ],
      correctIndex: 0,
      explanation: {
        en: 'Structured templates and measurable verification ensure consistent results across teams.',
      },
    },
  ];

  const quizCorrectCount = quizQuestions.filter(
    (q) => quizSelections[q.id] === q.correctIndex,
  ).length;
  const quizPassed = quizSubmitted && quizCorrectCount === quizQuestions.length;

  return (
    <div className="space-y-5">
      {/* Workspace Header Bar */}
      <div className="card-note rounded-[16px] p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex items-center gap-3 min-w-0">
          <Link
            to={`/courses/${course.slug}`}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[8px] border border-[#ded8ca] dark:border-[#2A332E] bg-[#efebe1] dark:bg-[#151A17] text-[13px] font-medium text-[#4c4842] dark:text-[#D5D1C8] hover:border-[#1c5b48] dark:border-[#7CD4B5] shrink-0"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>{t.workspace.backToCourse}</span>
          </Link>
          <div className="min-w-0">
            <h1 className="text-[16px] sm:text-[18px] font-bold text-[#141312] dark:text-[#f6f3ec] truncate">
              {pickText(course.title)}
            </h1>
            <p className="text-[12px] text-[#6e6a62] dark:text-[#A3ACA6] truncate">
              {instructor?.name} · {completion.completedCount}/{completion.totalCount} {t.common.lessons}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4 shrink-0">
          <div className="w-40 sm:w-48 space-y-1">
            <div className="flex justify-between text-[11.5px] font-medium">
              <span className="text-[#6e6a62] dark:text-[#A3ACA6]">{t.workspace.courseProgress}</span>
              <span className="font-mono-custom font-bold text-[#1c5b48] dark:text-[#7CD4B5]">{completion.percent}%</span>
            </div>
            <ProgressBar value={completion.percent} />
          </div>
        </div>
      </div>

      {completion.percent === 100 && (
        <Alert tone="success" title={t.workspace.courseCompletedBanner}>
          <div className="flex flex-wrap items-center justify-between gap-3 mt-1">
            <span>Your verified course completion certificate has been added to your account.</span>
            <Link to="/certifications">
              <Button size="sm" variant="success" leftIcon={<Award className="h-4 w-4" />}>
                {t.workspace.claimCertificate}
              </Button>
            </Link>
          </div>
        </Alert>
      )}

      {/* Main Split Workspace: Lesson Content + Curriculum Sidebar */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
        {/* Main Lesson Area */}
        <div className={`${theaterMode ? 'xl:col-span-12' : 'xl:col-span-8'} space-y-5`}>
          {currentLesson?.type === 'video' && (
            <AcademyVideoPlayer
              title={pickText(currentLesson.title)}
              subtitle={currentLesson.summary ? pickText(currentLesson.summary) : undefined}
              instructorName={instructor?.name}
              durationMinutes={currentLesson.durationMinutes}
              initialPositionSeconds={
                progress?.lastLessonId === currentLesson.id ? progress.lastPositionSeconds : 0
              }
              locked={isLessonLocked}
              defaultSpeed={settings.defaultPlaybackSpeed}
              defaultCaptions={settings.captionsEnabled}
              theaterMode={theaterMode}
              onToggleTheaterMode={() => setTheaterMode((m) => !m)}
              onPositionChange={(sec) => {
                if (!isLessonLocked) {
                  updateLessonPosition(course.id, currentLesson.id, sec);
                }
              }}
              onEnded={() => {
                if (!isLessonLocked) {
                  toggleLessonComplete(course.id, currentLesson.id, true);
                  if (settings.autoplayNextLesson && nextLesson) {
                    goToLesson(nextLesson.id);
                  }
                }
              }}
            />
          )}

          {currentLesson?.type === 'reading' && (
            <div className="card-note rounded-[18px] p-6 sm:p-8 space-y-6">
              <div className="flex items-center justify-between gap-2">
                <Badge tone="info">
                  <FileText className="h-3.5 w-3.5" />
                  Reading Lesson · {currentLesson.durationMinutes} min
                </Badge>
              </div>
              <h2 className="text-[24px] font-bold text-[#141312] dark:text-[#f6f3ec]">
                {pickText(currentLesson.title)}
              </h2>
              {currentLesson.summary && (
                <p className="text-[15px] text-[#4c4842] dark:text-[#D5D1C8] leading-relaxed">
                  {pickText(currentLesson.summary)}
                </p>
              )}
              <div className="space-y-5 pt-2">
                {(currentLesson.readingSections ?? [
                  {
                    heading: { en: 'Core Academy Study Guide' },
                    body: {
                      en: 'Apply this lesson framework directly to your team workflow. Break larger goals into measurable weekly deliverables and document each step cleanly.',
                    },
                  },
                ]).map((sec, idx) => (
                  <div
                    key={idx}
                    className="p-5 rounded-[14px] bg-[#f6f3ec] dark:bg-[#151A17] border border-[#ded8ca] dark:border-[#2A332E] space-y-2.5"
                  >
                    <h3 className="text-[17px] font-bold text-[#141312] dark:text-[#f6f3ec]">{pickText(sec.heading)}</h3>
                    <p className="text-[14.5px] text-[#4c4842] dark:text-[#D5D1C8] leading-relaxed">{pickText(sec.body)}</p>
                    {sec.bullets && (
                      <ul className="space-y-1.5 pt-1">
                        {sec.bullets.map((b, i) => (
                          <li key={i} className="flex items-start gap-2 text-[14px] text-[#4c4842] dark:text-[#D5D1C8]">
                            <CheckCircle2 className="h-4 w-4 text-[#16A34A] shrink-0 mt-0.5" />
                            <span>{pickText(b)}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {currentLesson?.type === 'quiz' && (
            <div className="card-note rounded-[18px] p-6 sm:p-8 space-y-6">
              <div className="flex items-center justify-between">
                <Badge tone="warning">
                  <FileQuestion className="h-3.5 w-3.5" />
                  Knowledge Check · {quizQuestions.length} Questions
                </Badge>
              </div>
              <div>
                <h2 className="text-[22px] font-bold text-[#141312] dark:text-[#f6f3ec]">
                  {pickText(currentLesson.title)}
                </h2>
                {currentLesson.summary && (
                  <p className="text-[14px] text-[#6e6a62] dark:text-[#A3ACA6] mt-1">{pickText(currentLesson.summary)}</p>
                )}
              </div>

              <div className="space-y-5">
                {quizQuestions.map((q, qIdx) => (
                  <div
                    key={q.id}
                    className="p-4 rounded-[14px] bg-[#f6f3ec] dark:bg-[#151A17] border border-[#ded8ca] dark:border-[#2A332E] space-y-3"
                  >
                    <p className="font-semibold text-[15px] text-[#141312] dark:text-[#f6f3ec]">
                      {qIdx + 1}. {pickText(q.question)}
                    </p>
                    <div className="space-y-2">
                      {q.options.map((opt, oIdx) => {
                        const chosen = quizSelections[q.id] === oIdx;
                        const isCorrect = oIdx === q.correctIndex;
                        let style =
                          'border-[#ded8ca] dark:border-[#2A332E] hover:border-[#1c5b48] dark:border-[#7CD4B5]';
                        if (quizSubmitted) {
                          if (isCorrect) style = 'border-[#16A34A] bg-[#F0FDF4] dark:bg-emerald-950/40';
                          else if (chosen) style = 'border-[#a5331f] bg-[#FEF2F2] dark:bg-red-950/40';
                        } else if (chosen) {
                          style = 'border-[#1c5b48] dark:border-[#7CD4B5] bg-[#e4ede7] dark:bg-[#1B3028] dark:bg-[#1B3028]/40';
                        }
                        return (
                          <button
                            key={oIdx}
                            type="button"
                            disabled={quizSubmitted}
                            onClick={() =>
                              setQuizSelections((prev) => ({ ...prev, [q.id]: oIdx }))
                            }
                            className={`w-full text-left p-3 rounded-[10px] border text-[14px] text-[#141312] dark:text-[#f6f3ec] transition-colors cursor-pointer ${style}`}
                          >
                            {pickText(opt)}
                          </button>
                        );
                      })}
                    </div>
                    {quizSubmitted && (
                      <p className="text-[13px] text-[#4c4842] dark:text-[#D5D1C8] bg-[#f6f3ec] dark:bg-[#101412] dark:bg-[#181E1B] p-2.5 rounded-lg">
                        {pickText(q.explanation)}
                      </p>
                    )}
                  </div>
                ))}
              </div>

              {quizSubmitted ? (
                <div className="space-y-3">
                  <Alert tone={quizPassed ? 'success' : 'warning'}>
                    {quizPassed
                      ? t.workspace.quizPassed
                      : `${quizCorrectCount}/${quizQuestions.length} correct. ${t.workspace.quizTryAgainHint}`}
                  </Alert>
                  {!quizPassed && (
                    <Button
                      variant="outline"
                      onClick={() => {
                        setQuizSelections({});
                        setQuizSubmitted(false);
                      }}
                    >
                      {t.workspace.quizRetry}
                    </Button>
                  )}
                </div>
              ) : (
                <Button
                  onClick={() => {
                    setQuizSubmitted(true);
                    if (
                      quizQuestions.every((q) => quizSelections[q.id] === q.correctIndex) &&
                      currentLesson
                    ) {
                      toggleLessonComplete(course.id, currentLesson.id, true);
                    }
                  }}
                >
                  {t.workspace.quizSubmit}
                </Button>
              )}
            </div>
          )}

          {/* Action Bar: Prev / Mark Complete / Next */}
          <div className="card-note rounded-[14px] p-4 flex flex-wrap items-center justify-between gap-3">
            <Button
              variant="outline"
              size="sm"
              disabled={!prevLesson}
              onClick={() => prevLesson && goToLesson(prevLesson.id)}
              leftIcon={<ArrowLeft className="h-4 w-4" />}
            >
              {t.workspace.prevLesson}
            </Button>

            <div className="flex items-center gap-2.5">
              {!isLessonLocked && currentLesson && (
                <Button
                  variant={isLessonComplete ? 'success' : 'primary'}
                  size="sm"
                  onClick={() => toggleLessonComplete(course.id, currentLesson.id)}
                  leftIcon={isLessonComplete ? <Check className="h-4 w-4" /> : <CheckCircle2 className="h-4 w-4" />}
                >
                  {isLessonComplete ? t.workspace.markedComplete : t.workspace.markComplete}
                </Button>
              )}

              <Button
                variant="outline"
                size="sm"
                disabled={!nextLesson}
                onClick={() => nextLesson && goToLesson(nextLesson.id)}
                rightIcon={<ArrowRight className="h-4 w-4" />}
              >
                {t.workspace.nextLesson}
              </Button>
            </div>
          </div>

          {/* Lesson Tabs: Overview, Resources, Notes */}
          <div className="card-note rounded-[18px] p-5 sm:p-6 space-y-5">
            <div className="flex items-center gap-2 border-b border-[#ded8ca] dark:border-[#2A332E] pb-3">
              {(['overview', 'resources', 'notes'] as const).map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setActiveTab(tab)}
                  className={`px-3.5 py-1.5 rounded-[8px] text-[13.5px] font-semibold cursor-pointer transition-colors ${
                    activeTab === tab
                      ? 'bg-[#1c5b48] dark:bg-[#2D7A62] text-white'
                      : 'text-[#6e6a62] dark:text-[#A3ACA6] hover:text-[#141312] dark:text-[#f6f3ec] hover:bg-[#e5dfd2] dark:bg-[#181E1B] dark:hover:bg-slate-800'
                  }`}
                >
                  {tab === 'overview'
                    ? t.workspace.tabOverview
                    : tab === 'resources'
                      ? `${t.workspace.tabResources} (${currentLesson?.resources?.length ?? 1})`
                      : t.workspace.tabNotes}
                </button>
              ))}
            </div>

            {activeTab === 'overview' && currentLesson && (
              <div className="space-y-4">
                <div>
                  <h3 className="text-[17px] font-bold text-[#141312] dark:text-[#f6f3ec]">
                    {pickText(currentLesson.title)}
                  </h3>
                  <p className="text-[14px] text-[#4c4842] dark:text-[#D5D1C8] mt-1 leading-relaxed">
                    {currentLesson.summary
                      ? pickText(currentLesson.summary)
                      : pickText(course.description)}
                  </p>
                </div>
                {currentLesson.takeaways && currentLesson.takeaways.length > 0 && (
                  <div className="p-4 rounded-[12px] bg-[#f6f3ec] dark:bg-[#101412] dark:bg-[#151A17] border border-[#ded8ca] dark:border-[#2A332E] space-y-2">
                    <p className="text-[13px] font-bold text-[#141312] dark:text-[#f6f3ec] flex items-center gap-1.5">
                      <Sparkles className="h-4 w-4 text-[#1c5b48] dark:text-[#7CD4B5]" />
                      {t.workspace.keyTakeaways}
                    </p>
                    <ul className="space-y-1.5">
                      {currentLesson.takeaways.map((tk, i) => (
                        <li key={i} className="flex items-start gap-2 text-[13.5px] text-[#4c4842] dark:text-[#D5D1C8]">
                          <CheckCircle2 className="h-4 w-4 text-[#16A34A] shrink-0 mt-0.5" />
                          <span>{pickText(tk)}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'resources' && (
              <div className="space-y-3">
                {(currentLesson?.resources && currentLesson.resources.length > 0
                  ? currentLesson.resources
                  : [
                      {
                        id: 'default-res',
                        title: { en: `${course.title.en} — Lesson Summary Sheet` },
                        fileType: 'PDF' as const,
                        sizeLabel: '1.1 MB',
                        description: { en: 'Downloadable academy reference notes & checklist' },
                      },
                    ]
                ).map((res) => (
                  <div
                    key={res.id}
                    className="flex items-center justify-between gap-4 p-3.5 rounded-[12px] bg-[#f6f3ec] dark:bg-[#101412] dark:bg-[#151A17] border border-[#ded8ca] dark:border-[#2A332E]"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="px-2.5 py-1 rounded-md bg-[#e4ede7] dark:bg-[#1B3028] dark:bg-[#1B3028] text-[#1c5b48] dark:text-[#7CD4B5] font-mono-custom text-[11px] font-bold">
                        {res.fileType}
                      </span>
                      <div className="min-w-0">
                        <p className="text-[14px] font-semibold text-[#141312] dark:text-[#f6f3ec] truncate">
                          {pickText(res.title)}
                        </p>
                        <p className="text-[12px] text-[#6e6a62] dark:text-[#A3ACA6] truncate">
                          {pickText(res.description)} · {res.sizeLabel}
                        </p>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      variant={downloadedId === res.id ? 'success' : 'outline'}
                      onClick={() => handleSimulatedDownload(res.id, pickText(res.title))}
                      leftIcon={<Download className="h-3.5 w-3.5" />}
                    >
                      {downloadedId === res.id ? 'Saved' : t.workspace.downloadResource}
                    </Button>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'notes' && currentLesson && (
              <div className="space-y-2">
                <textarea
                  rows={5}
                  value={progress?.notesByLessonId?.[currentLesson.id] ?? ''}
                  onChange={(e) => saveLessonNote(course.id, currentLesson.id, e.target.value)}
                  placeholder={t.workspace.notesPlaceholder}
                  className="w-full rounded-[10px] border border-[#ded8ca] dark:border-[#2A332E] bg-[#efebe1] dark:bg-[#151A17] p-3.5 text-[14px] text-[#141312] dark:text-[#f6f3ec] outline-none focus:border-[#1c5b48] dark:border-[#7CD4B5]"
                />
                <p className="text-[12px] text-[#16A34A] font-medium">{t.workspace.notesSaved}</p>
              </div>
            )}
          </div>
        </div>

        {/* Course Curriculum Sidebar */}
        <aside className={`${theaterMode ? 'xl:col-span-12' : 'xl:col-span-4'} card-note rounded-[18px] p-4 sm:p-5 space-y-4 xl:sticky xl:top-22`}>
          <div className="flex items-center justify-between">
            <h2 className="text-[16px] font-bold text-[#141312] dark:text-[#f6f3ec]">
              {t.workspace.curriculumTitle}
            </h2>
            <span className="text-[12px] font-mono-custom text-[#1c5b48] dark:text-[#7CD4B5] font-semibold">
              {completion.completedCount}/{completion.totalCount}
            </span>
          </div>

          <div className="space-y-4 max-h-[65vh] overflow-y-auto thin-scrollbar pr-1">
            {course.curriculum.map((sec) => (
              <div key={sec.id} className="space-y-1.5">
                <p className="text-[12px] font-bold uppercase tracking-wide text-[#6e6a62] dark:text-[#A3ACA6] px-1">
                  {pickText(sec.title)}
                </p>
                <div className="space-y-1">
                  {sec.lessons.map((lesson) => {
                    const active = lesson.id === currentLesson?.id;
                    const done = progress?.completedLessonIds.includes(lesson.id);
                    const locked = !isEnrolled && !lesson.isPreview;

                    return (
                      <button
                        key={lesson.id}
                        type="button"
                        onClick={() => goToLesson(lesson.id)}
                        className={`w-full text-left p-2.5 rounded-[10px] border transition-colors flex items-start justify-between gap-2 cursor-pointer ${
                          active
                            ? 'bg-[#e4ede7] dark:bg-[#1B3028] dark:bg-[#1B3028]/50 border-[#1c5b48] dark:border-[#7CD4B5] text-[#1D4ED8]'
                            : 'bg-white/70 dark:bg-[#151A17]/70 border-transparent hover:border-[#ded8ca] dark:border-[#2A332E] dark:hover:border-slate-700'
                        }`}
                      >
                        <div className="flex items-start gap-2.5 min-w-0">
                          {locked ? (
                            <Lock className="h-4 w-4 text-[#6e6a62] shrink-0 mt-0.5" />
                          ) : done ? (
                            <CheckCircle2 className="h-4 w-4 text-[#16A34A] shrink-0 mt-0.5" />
                          ) : lesson.type === 'quiz' ? (
                            <FileQuestion className="h-4 w-4 text-[#8a5008] shrink-0 mt-0.5" />
                          ) : lesson.type === 'reading' ? (
                            <FileText className="h-4 w-4 text-[#0891B2] shrink-0 mt-0.5" />
                          ) : (
                            <PlayCircle className="h-4 w-4 text-[#1c5b48] dark:text-[#7CD4B5] shrink-0 mt-0.5" />
                          )}
                          <span
                            className={`text-[13px] font-medium leading-snug ${
                              active ? 'text-[#1D4ED8] dark:text-[#7CD4B5] font-semibold' : 'text-[#141312] dark:text-[#f6f3ec]'
                            }`}
                          >
                            {pickText(lesson.title)}
                          </span>
                        </div>
                        <span className="text-[11px] text-[#6e6a62] dark:text-[#A3ACA6] shrink-0 mt-0.5">
                          {lesson.durationMinutes}m
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </aside>
      </div>
    </div>
  );
};

