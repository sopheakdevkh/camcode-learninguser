import React, { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  Award,
  Bookmark,
  BookmarkCheck,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Clock,
  CreditCard,
  FileQuestion,
  FileText,
  Globe,
  Layers,
  PlayCircle,
  ShieldCheck,
  Star,
  Users,
} from 'lucide-react';
import { CategoryIconBox } from '@/components/academy/CourseThumbnail';
import { CourseCard } from '@/components/cards/CourseCard';
import { Alert } from '@/components/ui/Alert';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { useLearner } from '@/context/LearnerContext';
import { useI18n } from '@/i18n/I18nContext';
import { catalogService } from '@/services/catalogService';

export const CourseDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { t, pickText, formatNumber } = useI18n();
  const {
    user,
    courseProgress,
    getCourseAccessState,
    getCourseCompletion,
    enrollFreeCourse,
    purchaseCourse,
    toggleSavedCourse,
  } = useLearner();

  const course = slug ? catalogService.getCourseBySlug(slug) : undefined;
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({ '0': true });
  const [buyModalOpen, setBuyModalOpen] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'khqr'>('card');

  if (!course) {
    return (
      <div className="glass-card rounded-[16px] p-10 text-center space-y-4">
        <h2 className="text-[20px] font-bold text-[#0F172A]">Course not found</h2>
        <Link to="/explore">
          <Button>{t.courseDetail.backToExplore}</Button>
        </Link>
      </div>
    );
  }

  const instructor = catalogService.getInstructorById(course.instructorId);
  const category = catalogService.getCategoryBySlug(course.categorySlug);
  const accessState = getCourseAccessState(course);
  const completion = getCourseCompletion(course);
  const progress = courseProgress[course.id];
  const isSaved = user.savedCourseIds.includes(course.id);
  const related = catalogService.getRelatedCourses(course, 3);
  const totalLessons = catalogService.getAllLessons(course).length;

  const isUnlocked =
    accessState === 'purchased' || accessState === 'free_enrolled' || accessState === 'subscription';

  const renderPrimaryCTA = () => {
    if (accessState === 'free_enrolled' || accessState === 'subscription') {
      return (
        <Button
          fullWidth
          size="lg"
          onClick={() => navigate(`/learn/${course.slug}`)}
          leftIcon={<PlayCircle className="h-5 w-5" />}
        >
          {completion.percent > 0
            ? t.courseDetail.accessEnrolledCta
            : t.courseDetail.accessPurchasedCta}
        </Button>
      );
    }

    if (accessState === 'purchased') {
      return (
        <Button
          fullWidth
          size="lg"
          onClick={() => navigate(`/learn/${course.slug}`)}
          leftIcon={<PlayCircle className="h-5 w-5" />}
        >
          {completion.percent > 0
            ? t.courseDetail.accessEnrolledCta
            : t.courseDetail.accessPurchasedCta}
        </Button>
      );
    }

    if (accessState === 'free_available') {
      return (
        <Button
          fullWidth
          size="lg"
          onClick={() => {
            enrollFreeCourse(course.id);
            navigate(`/learn/${course.slug}`);
          }}
        >
          {t.courseDetail.accessFreeCta}
        </Button>
      );
    }

    // Paid / Subscription required
    return (
      <div className="space-y-2.5">
        <Button fullWidth size="lg" onClick={() => setBuyModalOpen(true)}>
          {t.courseDetail.accessPaidCta} — ${course.price.toFixed(0)}
        </Button>
        <Button
          fullWidth
          variant="outline"
          onClick={() => navigate('/membership')}
        >
          {t.courseDetail.accessSubCta}
        </Button>
      </div>
    );
  };

  return (
    <div className="space-y-8">
      <Link
        to="/explore"
        className="inline-flex items-center gap-1.5 text-[13.5px] font-medium text-[#64748B] hover:text-[#2563EB]"
      >
        <ArrowLeft className="h-4 w-4" />
        <span>{t.courseDetail.backToExplore}</span>
      </Link>

      {/* Course Cover & Enrollment Card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left 8 columns */}
        <div className="lg:col-span-8 space-y-6">
          <div className="glass-panel rounded-[20px] p-6 sm:p-8 space-y-5">
            <div className="flex flex-wrap items-center gap-2">
              {category && <Badge tone="primary">{pickText(category.name)}</Badge>}
              <Badge tone="neutral">
                {course.difficulty === 'beginner'
                  ? t.common.beginner
                  : course.difficulty === 'intermediate'
                    ? t.common.intermediate
                    : t.common.advanced}
              </Badge>
              {course.certificateIncluded && (
                <Badge tone="success">
                  <Award className="h-3.5 w-3.5" />
                  {t.courseDetail.certificateBadge}
                </Badge>
              )}
            </div>

            <h1 className="text-[26px] sm:text-[32px] font-bold text-[#0F172A] leading-tight">
              {pickText(course.title)}
            </h1>
            <p className="text-[15.5px] text-[#475569] leading-relaxed">
              {pickText(course.description)}
            </p>

            <div className="flex flex-wrap items-center gap-5 pt-2 text-[13.5px] text-[#475569]">
              <span className="inline-flex items-center gap-1.5 font-semibold text-[#0F172A]">
                <Star className="h-4 w-4 fill-[#D97706] text-[#D97706]" />
                {course.rating.toFixed(1)} ({formatNumber(course.reviewsCount)})
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Users className="h-4 w-4 text-[#64748B]" />
                {formatNumber(course.studentsCount)} {t.common.students}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Clock className="h-4 w-4 text-[#64748B]" />
                {formatNumber(course.durationHours)} {t.common.hours}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Globe className="h-4 w-4 text-[#64748B]" />
                {course.language === 'bilingual'
                  ? t.common.bilingual
                  : course.language === 'km'
                    ? t.common.khmer
                    : t.common.english}
              </span>
            </div>
          </div>

          {/* Learning Objectives */}
          <section className="glass-card rounded-[18px] p-6 space-y-4">
            <h2 className="text-[18px] font-bold text-[#0F172A]">
              {t.courseDetail.whatYouLearn}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {course.outcomes.map((item, idx) => (
                <div key={idx} className="flex items-start gap-2.5 text-[14px] text-[#334155]">
                  <CheckCircle2 className="h-4.5 w-4.5 text-[#16A34A] shrink-0 mt-0.5" />
                  <span>{pickText(item)}</span>
                </div>
              ))}
            </div>
          </section>

          {/* Curriculum */}
          <section className="glass-card rounded-[18px] p-6 space-y-4">
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-[18px] font-bold text-[#0F172A]">
                {t.courseDetail.curriculum}
              </h2>
              <span className="text-[13px] text-[#64748B]">
                {course.curriculum.length} {t.courseDetail.modulesLabel} · {totalLessons} {t.common.lessons}
              </span>
            </div>

            <div className="space-y-3">
              {course.curriculum.map((sec, idx) => {
                const isOpen = openSections[String(idx)] ?? idx === 0;
                return (
                  <div
                    key={sec.id}
                    className="rounded-[12px] border border-[#E2E8F0] dark:border-slate-700 overflow-hidden bg-white dark:bg-slate-900"
                  >
                    <button
                      type="button"
                      onClick={() =>
                        setOpenSections((prev) => ({ ...prev, [String(idx)]: !isOpen }))
                      }
                      className="w-full px-4 py-3.5 flex items-center justify-between gap-3 text-left bg-[#F8FAFC] dark:bg-slate-800/60 cursor-pointer"
                    >
                      <span className="font-semibold text-[14.5px] text-[#0F172A]">
                        {pickText(sec.title)}
                      </span>
                      <div className="flex items-center gap-2 text-[12px] text-[#64748B] shrink-0">
                        <span>{sec.lessons.length} {t.common.lessons}</span>
                        {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                      </div>
                    </button>

                    {isOpen && (
                      <div className="divide-y divide-[#E2E8F0]/70 dark:divide-slate-800">
                        {sec.lessons.map((lesson) => {
                          const done = progress?.completedLessonIds.includes(lesson.id);
                          return (
                            <div
                              key={lesson.id}
                              className="px-4 py-3 flex items-center justify-between gap-3 text-[13.5px]"
                            >
                              <div className="flex items-center gap-2.5 min-w-0">
                                {done ? (
                                  <CheckCircle2 className="h-4 w-4 text-[#16A34A] shrink-0" />
                                ) : lesson.type === 'quiz' ? (
                                  <FileQuestion className="h-4 w-4 text-[#D97706] shrink-0" />
                                ) : lesson.type === 'reading' ? (
                                  <FileText className="h-4 w-4 text-[#0891B2] shrink-0" />
                                ) : (
                                  <PlayCircle className="h-4 w-4 text-[#2563EB] shrink-0" />
                                )}
                                <span className="text-[#0F172A] truncate">{pickText(lesson.title)}</span>
                              </div>
                              <div className="flex items-center gap-2 shrink-0">
                                {lesson.isPreview && !isUnlocked && (
                                  <Link
                                    to={`/learn/${course.slug}/${lesson.id}`}
                                    className="text-[12px] font-semibold text-[#2563EB] hover:underline"
                                  >
                                    {t.courseDetail.previewBadge}
                                  </Link>
                                )}
                                <span className="text-[12px] text-[#64748B]">
                                  {lesson.durationMinutes}m
                                </span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </section>

          {/* Requirements */}
          <section className="glass-card rounded-[18px] p-6 space-y-3">
            <h2 className="text-[18px] font-bold text-[#0F172A]">
              {t.courseDetail.requirements}
            </h2>
            <ul className="space-y-2">
              {course.requirements.map((req, idx) => (
                <li key={idx} className="flex items-start gap-2 text-[14px] text-[#475569]">
                  <span className="mt-2 h-1.5 w-1.5 rounded-full bg-[#2563EB] shrink-0" />
                  <span>{pickText(req)}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* Instructor */}
          {instructor && (
            <section className="glass-card rounded-[18px] p-6 flex items-start gap-4">
              <div
                className="h-14 w-14 rounded-2xl text-white font-bold text-[18px] flex items-center justify-center shrink-0"
                style={{ backgroundColor: instructor.avatarColor }}
              >
                {instructor.initials}
              </div>
              <div className="space-y-1.5">
                <p className="text-[12px] font-semibold uppercase tracking-wider text-[#2563EB]">
                  {t.courseDetail.instructor}
                </p>
                <h3 className="text-[17px] font-bold text-[#0F172A]">{instructor.name}</h3>
                <p className="text-[13px] font-medium text-[#64748B]">{pickText(instructor.role)}</p>
                <p className="text-[13.5px] text-[#475569] leading-relaxed">
                  {pickText(instructor.bio)}
                </p>
              </div>
            </section>
          )}
        </div>

        {/* Right 4 columns Sticky Enrollment Box */}
        <aside className="lg:col-span-4 lg:sticky lg:top-22 space-y-4">
          <div className="glass-panel rounded-[20px] p-5 space-y-5">
            <div
              className={`h-44 rounded-[14px] bg-gradient-to-br ${course.thumbnailTheme} border border-white/80 dark:border-slate-700 p-4 flex flex-col justify-between`}
            >
              <div className="flex justify-between items-center">
                <span className="px-2.5 py-0.5 rounded-full bg-white/90 dark:bg-slate-900/90 text-[11px] font-semibold text-[#0F172A]">
                  {course.thumbnailLabel}
                </span>
                {isUnlocked && <Badge tone="success">{t.common.enrolled}</Badge>}
              </div>
              <div className="m-auto">
                <CategoryIconBox categorySlug={course.categorySlug} size="lg" />
              </div>
              <span />
            </div>

            <div className="flex items-baseline justify-between">
              {course.price === 0 ? (
                <span className="text-[26px] font-bold text-[#16A34A]">{t.common.free}</span>
              ) : isUnlocked ? (
                <span className="text-[15px] font-semibold text-[#16A34A]">
                  {accessState === 'subscription'
                    ? t.courseDetail.accessSubIncluded
                    : t.common.purchased}
                </span>
              ) : (
                <div className="flex items-baseline gap-2">
                  <span className="text-[28px] font-bold text-[#0F172A]">
                    ${course.price.toFixed(0)}
                  </span>
                  {course.originalPrice && (
                    <span className="text-[14px] text-[#94A3B8] line-through">
                      ${course.originalPrice.toFixed(0)}
                    </span>
                  )}
                </div>
              )}

              {course.includedInPlans.includes('basic') ? (
                <Badge tone="info">Basic & Premium</Badge>
              ) : course.includedInPlans.includes('premium') ? (
                <Badge tone="warning">Included in Premium</Badge>
              ) : null}
            </div>

            {renderPrimaryCTA()}

            <Button
              variant="ghost"
              fullWidth
              onClick={() => toggleSavedCourse(course.id)}
              leftIcon={
                isSaved ? (
                  <BookmarkCheck className="h-4 w-4 text-[#2563EB]" />
                ) : (
                  <Bookmark className="h-4 w-4" />
                )
              }
            >
              {isSaved ? t.courseDetail.savedToWatchlist : t.courseDetail.saveToWatchlist}
            </Button>

            <div className="pt-3 border-t border-[#E2E8F0] dark:border-slate-800 space-y-2.5 text-[13px] text-[#475569]">
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-2">
                  <Layers className="h-4 w-4 text-[#94A3B8]" />
                  {t.common.lessons}
                </span>
                <span className="font-semibold text-[#0F172A]">{totalLessons}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-2">
                  <Clock className="h-4 w-4 text-[#94A3B8]" />
                  Duration
                </span>
                <span className="font-semibold text-[#0F172A]">
                  {course.durationHours} {t.common.hours}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-2">
                  <Award className="h-4 w-4 text-[#94A3B8]" />
                  Credential
                </span>
                <span className="font-semibold text-[#0F172A]">Certificate</span>
              </div>
            </div>
          </div>
        </aside>
      </div>

      {/* Related Courses */}
      {related.length > 0 && (
        <section className="space-y-4">
          <h2 className="text-[20px] font-bold text-[#0F172A]">{t.courseDetail.relatedCourses}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {related.map((c) => (
              <CourseCard key={c.id} course={c} variant="explore" />
            ))}
          </div>
        </section>
      )}

      {/* Streamlined Purchase Modal */}
      <Modal
        open={buyModalOpen}
        onClose={() => setBuyModalOpen(false)}
        title={t.courseDetail.purchaseModalTitle}
        maxWidthClass="max-w-md"
      >
        <div className="space-y-4">
          <div className="p-3.5 rounded-[12px] bg-[#F8FAFC] dark:bg-slate-800 border border-[#E2E8F0] dark:border-slate-700 flex items-center justify-between gap-3">
            <div>
              <p className="text-[14px] font-bold text-[#0F172A]">{pickText(course.title)}</p>
              <p className="text-[12px] text-[#64748B]">Lifetime individual course access</p>
            </div>
            <span className="text-[18px] font-bold text-[#0F172A]">${course.price.toFixed(2)}</span>
          </div>

          <div className="space-y-2">
            <p className="text-[13px] font-semibold text-[#0F172A]">Payment Method</p>
            <div className="grid grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => setPaymentMethod('card')}
                className={`p-3 rounded-[10px] border text-left text-[13px] font-medium flex items-center gap-2 cursor-pointer ${
                  paymentMethod === 'card'
                    ? 'border-[#2563EB] bg-[#EFF6FF] dark:bg-blue-950/40 text-[#1D4ED8]'
                    : 'border-[#E2E8F0] dark:border-slate-700 text-[#475569]'
                }`}
              >
                <CreditCard className="h-4 w-4" />
                Visa / MasterCard
              </button>
              <button
                type="button"
                onClick={() => setPaymentMethod('khqr')}
                className={`p-3 rounded-[10px] border text-left text-[13px] font-medium flex items-center gap-2 cursor-pointer ${
                  paymentMethod === 'khqr'
                    ? 'border-[#2563EB] bg-[#EFF6FF] dark:bg-blue-950/40 text-[#1D4ED8]'
                    : 'border-[#E2E8F0] dark:border-slate-700 text-[#475569]'
                }`}
              >
                <ShieldCheck className="h-4 w-4" />
                KHQR / ABA Pay
              </button>
            </div>
          </div>

          <Alert tone="info">
            Instant demo purchase: confirming unlocks the full curriculum and adds an invoice to your Billing history.
          </Alert>

          <div className="flex items-center justify-end gap-2 pt-2">
            <Button variant="outline" onClick={() => setBuyModalOpen(false)}>
              {t.common.cancel}
            </Button>
            <Button
              onClick={() => {
                purchaseCourse(
                  course,
                  paymentMethod === 'khqr' ? 'KHQR / ABA Pay' : 'Card •••• 4242',
                );
                setBuyModalOpen(false);
                navigate(`/learn/${course.slug}`);
              }}
            >
              {t.courseDetail.confirmPurchase}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

