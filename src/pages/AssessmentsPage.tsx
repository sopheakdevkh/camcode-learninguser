import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  Award,
  CheckCircle2,
  ClipboardCheck,
  Clock,
  RotateCcw,
  ShieldCheck,
} from 'lucide-react';
import { Alert } from '@/components/ui/Alert';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { useLearner } from '@/context/LearnerContext';
import { useI18n } from '@/i18n/I18nContext';
import { catalogService } from '@/services/catalogService';
import type { AssessmentAttempt } from '@/types';

export const AssessmentsPage: React.FC = () => {
  const { t, pickText } = useI18n();
  const { assessmentAttempts } = useLearner();
  const assessments = catalogService.getAssessments();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif-display text-[28px] sm:text-[34px] leading-[1.1] tracking-[-0.02em] font-medium text-[#141312] dark:text-[#f6f3ec]">
          {t.nav.assessments}
        </h1>
        <p className="text-[14.5px] text-[#4c4842] dark:text-[#D5D1C8] mt-1">
          Complete graded certification exams to validate your skills and earn official credentials.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {assessments.map((assess) => {
          const attempt = assessmentAttempts[assess.id];
          const category = catalogService.getCategoryBySlug(assess.categorySlug);
          return (
            <div
              key={assess.id}
              className="card-tile group rounded-[18px] p-5 flex flex-col justify-between gap-4"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-2">
                  {category && <Badge tone="primary">{pickText(category.name)}</Badge>}
                  {attempt ? (
                    <Badge tone={attempt.passed ? 'success' : 'warning'}>
                      {attempt.passed ? `Passed · ${attempt.score}%` : `Score ${attempt.score}%`}
                    </Badge>
                  ) : (
                    <Badge tone="neutral">Not Taken</Badge>
                  )}
                </div>

                <h2 className="text-[17px] font-bold text-[#141312] dark:text-[#f6f3ec] leading-snug">
                  {pickText(assess.title)}
                </h2>
                <p className="text-[13.5px] text-[#6e6a62] dark:text-[#A3ACA6] leading-relaxed">
                  {pickText(assess.description)}
                </p>

                <div className="flex flex-wrap gap-3 text-[12px] text-[#6e6a62] dark:text-[#A3ACA6] pt-1">
                  <span className="inline-flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5" />
                    {assess.durationMinutes} min
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <ClipboardCheck className="h-3.5 w-3.5" />
                    {assess.questions.length} questions
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <ShieldCheck className="h-3.5 w-3.5 text-[#16A34A]" />
                    Pass: {assess.passingScore}%
                  </span>
                </div>
              </div>

              <Link to={`/assessments/${assess.slug}`}>
                <Button fullWidth variant={attempt?.passed ? 'outline' : 'primary'}>
                  {attempt?.passed ? 'Retake Assessment' : 'Start Assessment'}
                </Button>
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export const AssessmentRunnerPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { t, pickText } = useI18n();
  const { assessmentAttempts, submitAssessmentAttempt } = useLearner();

  const assessment = slug ? catalogService.getAssessmentBySlug(slug) : undefined;
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [result, setResult] = useState<AssessmentAttempt | null>(null);

  if (!assessment) {
    return (
      <div className="card-note rounded-[16px] p-10 text-center space-y-4">
        <h2 className="text-[20px] font-bold text-[#141312] dark:text-[#f6f3ec]">Assessment not found</h2>
        <Link to="/assessments">
          <Button>{t.nav.assessments}</Button>
        </Link>
      </div>
    );
  }

  const prevAttempt = assessmentAttempts[assessment.id];
  const answeredCount = Object.keys(answers).length;
  const totalQuestions = assessment.questions.length;

  const handleSubmit = () => {
    const correctCount = assessment.questions.filter(
      (q) => answers[q.id] === q.correctIndex,
    ).length;
    const attempt = submitAssessmentAttempt(assessment.id, correctCount, totalQuestions);
    setResult(attempt);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <Link
        to="/assessments"
        className="inline-flex items-center gap-1.5 text-[13.5px] font-medium text-[#6e6a62] dark:text-[#A3ACA6] hover:text-[#1c5b48] dark:text-[#7CD4B5]"
      >
        <ArrowLeft className="h-4 w-4" />
        <span>Back to {t.nav.assessments}</span>
      </Link>

      <div className="card-note rounded-[20px] p-6 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <Badge tone="primary">{assessment.durationMinutes} min</Badge>
          <span className="text-[13px] font-medium text-[#6e6a62] dark:text-[#A3ACA6]">
            Passing score: {assessment.passingScore}%
          </span>
        </div>
        <h1 className="font-serif-display text-[26px] font-medium text-[#141312] dark:text-[#f6f3ec]">{pickText(assessment.title)}</h1>
        <p className="text-[14px] text-[#4c4842] dark:text-[#D5D1C8]">{pickText(assessment.description)}</p>
        {prevAttempt && !result && (
          <Alert tone={prevAttempt.passed ? 'success' : 'info'}>
            Previous attempt on {prevAttempt.completedAt}: <strong>{prevAttempt.score}%</strong> (
            {prevAttempt.passed ? 'Passed' : 'Not passed yet'}).
          </Alert>
        )}
        <ProgressBar value={Math.round((answeredCount / totalQuestions) * 100)} />
      </div>

      {result ? (
        <div className="card-note rounded-[20px] p-6 sm:p-8 space-y-5">
          <Alert tone={result.passed ? 'success' : 'warning'}>
            <div className="space-y-1">
              <p className="text-[16px] font-bold">
                {result.passed
                  ? `Congratulations! You passed with ${result.score}%`
                  : `You scored ${result.score}% (Need ${assessment.passingScore}% to pass)`}
              </p>
              <p>
                {result.correctCount} of {result.totalQuestions} questions answered correctly.
              </p>
            </div>
          </Alert>

          <div className="space-y-3">
            {assessment.questions.map((q, idx) => {
              const userChoice = answers[q.id];
              const isCorrect = userChoice === q.correctIndex;
              return (
                <div
                  key={q.id}
                  className="p-4 rounded-[12px] bg-[#efebe1] dark:bg-[#151A17] border border-[#ded8ca] dark:border-[#2A332E] space-y-2"
                >
                  <div className="flex items-start justify-between gap-2">
                    <p className="font-semibold text-[14.5px] text-[#141312] dark:text-[#f6f3ec]">
                      {idx + 1}. {pickText(q.question)}
                    </p>
                    <Badge tone={isCorrect ? 'success' : 'error'}>
                      {isCorrect ? 'Correct' : 'Incorrect'}
                    </Badge>
                  </div>
                  <p className="text-[13px] text-[#16A34A] font-medium">
                    Correct answer: {pickText(q.options[q.correctIndex])}
                  </p>
                  <p className="text-[13px] text-[#6e6a62] dark:text-[#A3ACA6]">{pickText(q.explanation)}</p>
                </div>
              );
            })}
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {result.passed && (
              <Link to="/certifications">
                <Button leftIcon={<Award className="h-4 w-4" />}>View Certificate</Button>
              </Link>
            )}
            <Button
              variant="outline"
              onClick={() => {
                setAnswers({});
                setResult(null);
              }}
              leftIcon={<RotateCcw className="h-4 w-4" />}
            >
              Retake Exam
            </Button>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {assessment.questions.map((q, idx) => (
            <div key={q.id} className="card-note rounded-[16px] p-5 space-y-3">
              <p className="text-[15.5px] font-bold text-[#141312] dark:text-[#f6f3ec]">
                {idx + 1}. {pickText(q.question)}
              </p>
              <div className="space-y-2">
                {q.options.map((opt, optIdx) => {
                  const selected = answers[q.id] === optIdx;
                  return (
                    <button
                      key={optIdx}
                      type="button"
                      onClick={() => setAnswers((prev) => ({ ...prev, [q.id]: optIdx }))}
                      className={`w-full text-left p-3.5 rounded-[10px] border text-[14px] flex items-center gap-3 transition-colors cursor-pointer ${
                        selected
                          ? 'border-[#1c5b48] dark:border-[#7CD4B5] bg-[#e4ede7] dark:bg-[#1B3028] dark:bg-[#1B3028]/40 text-[#1D4ED8] font-medium'
                          : 'border-[#ded8ca] dark:border-[#2A332E] bg-[#efebe1] dark:bg-[#151A17] text-[#141312] dark:text-[#f6f3ec] hover:border-[#1c5b48] dark:border-[#7CD4B5]/60'
                      }`}
                    >
                      <span
                        className={`h-4.5 w-4.5 rounded-full border flex items-center justify-center shrink-0 ${
                          selected ? 'border-[#1c5b48] dark:border-[#7CD4B5] bg-[#1c5b48] dark:bg-[#2D7A62] text-white' : 'border-[#c2baa8] dark:border-[#3A4740]'
                        }`}
                      >
                        {selected && <CheckCircle2 className="h-3 w-3" />}
                      </span>
                      <span>{pickText(opt)}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}

          <div className="flex items-center justify-between pt-2">
            <span className="text-[13px] text-[#6e6a62] dark:text-[#A3ACA6]">
              {answeredCount} of {totalQuestions} answered
            </span>
            <Button
              size="lg"
              disabled={answeredCount < totalQuestions}
              onClick={handleSubmit}
            >
              Submit Assessment
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

