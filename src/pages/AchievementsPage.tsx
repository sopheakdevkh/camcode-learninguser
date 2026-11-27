import React from 'react';
import { Award, BookOpen, CheckCircle2, Clock, Compass, Flame, ShieldCheck, Sparkles, Trophy } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { useLearner } from '@/context/LearnerContext';
import { useI18n } from '@/i18n/I18nContext';
import type { AchievementBadge } from '@/types';

const iconMap: Record<AchievementBadge['icon'], React.ReactNode> = {
  Award: <Award className="h-6 w-6" />,
  Flame: <Flame className="h-6 w-6" />,
  CheckCircle2: <CheckCircle2 className="h-6 w-6" />,
  BookOpen: <BookOpen className="h-6 w-6" />,
  Sparkles: <Sparkles className="h-6 w-6" />,
  Clock: <Clock className="h-6 w-6" />,
  Compass: <Compass className="h-6 w-6" />,
  ShieldCheck: <ShieldCheck className="h-6 w-6" />,
};

export const AchievementsPage: React.FC = () => {
  const { t, pickText } = useI18n();
  const { user, achievements, getLearningHoursTotal } = useLearner();

  const unlockedCount = achievements.filter((a) => a.unlocked).length;
  const totalXp = achievements.filter((a) => a.unlocked).reduce((s, a) => s + a.xp, 0);

  const weeklyActivity = [
    { day: 'Mon', mins: 30 },
    { day: 'Tue', mins: 45 },
    { day: 'Wed', mins: 20 },
    { day: 'Thu', mins: 35 },
    { day: 'Fri', mins: 40 },
    { day: 'Sat', mins: 15 },
    { day: 'Sun', mins: 10 },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif-display text-[28px] sm:text-[34px] leading-[1.1] tracking-[-0.02em] font-medium text-[#141312] dark:text-[#f6f3ec]">
          {t.nav.achievements}
        </h1>
        <p className="text-[14.5px] text-[#4c4842] dark:text-[#D5D1C8] mt-1">
          Milestones, XP progress, and weekly consistency across your academy journey.
        </p>
      </div>

      {/* Top Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="card-note rounded-[16px] p-5 flex items-center gap-4">
          <div className="h-12 w-12 rounded-2xl bg-[#e4ede7] dark:bg-[#1B3028] dark:bg-[#1B3028] text-[#1c5b48] dark:text-[#7CD4B5] flex items-center justify-center">
            <Trophy className="h-6 w-6" />
          </div>
          <div>
            <p className="text-[24px] font-bold text-[#141312] dark:text-[#f6f3ec]">{totalXp} XP</p>
            <p className="text-[13px] text-[#6e6a62] dark:text-[#A3ACA6]">
              {unlockedCount} / {achievements.length} Badges Unlocked
            </p>
          </div>
        </div>

        <div className="card-note rounded-[16px] p-5 flex items-center gap-4">
          <div className="h-12 w-12 rounded-2xl bg-amber-500/15 text-amber-600 flex items-center justify-center">
            <Flame className="h-6 w-6" />
          </div>
          <div>
            <p className="text-[24px] font-bold text-[#141312] dark:text-[#f6f3ec]">{user.streakDays} Days</p>
            <p className="text-[13px] text-[#6e6a62] dark:text-[#A3ACA6]">Active Learning Streak</p>
          </div>
        </div>

        <div className="card-note rounded-[16px] p-5 flex items-center gap-4">
          <div className="h-12 w-12 rounded-2xl bg-emerald-500/15 text-[#16A34A] flex items-center justify-center">
            <Clock className="h-6 w-6" />
          </div>
          <div>
            <p className="text-[24px] font-bold text-[#141312] dark:text-[#f6f3ec]">{getLearningHoursTotal()} hrs</p>
            <p className="text-[13px] text-[#6e6a62] dark:text-[#A3ACA6]">Total Academy Study Time</p>
          </div>
        </div>
      </div>

      {/* Weekly Study Activity Bar Chart */}
      <section className="card-note rounded-[18px] p-5 sm:p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-[17px] font-bold text-[#141312] dark:text-[#f6f3ec]">Weekly Study Activity</h2>
          <span className="text-[13px] font-medium text-[#1c5b48] dark:text-[#7CD4B5]">
            {user.weeklyMinutes} / {user.weeklyGoalMinutes} min goal
          </span>
        </div>
        <div className="grid grid-cols-7 gap-2 sm:gap-4 items-end h-36 pt-4">
          {weeklyActivity.map((d) => (
            <div key={d.day} className="flex flex-col items-center gap-2 h-full justify-end">
              <span className="text-[11px] font-mono-custom text-[#6e6a62] dark:text-[#A3ACA6]">{d.mins}m</span>
              <div
                className="w-full max-w-[38px] rounded-t-[8px] bg-gradient-to-t from-[#2563EB] to-[#60A5FA]"
                style={{ height: `${Math.max(16, Math.round((d.mins / 50) * 100))}%` }}
              />
              <span className="text-[12px] font-medium text-[#4c4842] dark:text-[#D5D1C8]">{d.day}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Badges Grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {achievements.map((ach) => {
          const pct = Math.round((ach.progressCurrent / ach.progressTarget) * 100);
          return (
            <div
              key={ach.id}
              className={`card-note rounded-[16px] p-5 space-y-4 ${
                !ach.unlocked ? 'opacity-80' : ''
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div
                  className={`h-12 w-12 rounded-2xl flex items-center justify-center ${
                    ach.unlocked
                      ? 'bg-[#e4ede7] dark:bg-[#1B3028] dark:bg-[#1B3028] text-[#1c5b48] dark:text-[#7CD4B5]'
                      : 'bg-[#e5dfd2] dark:bg-[#181E1B] text-[#6e6a62]'
                  }`}
                >
                  {iconMap[ach.icon]}
                </div>
                <Badge tone={ach.unlocked ? 'success' : 'neutral'}>
                  {ach.unlocked ? 'Unlocked' : `+${ach.xp} XP`}
                </Badge>
              </div>

              <div className="space-y-1">
                <h3 className="text-[16px] font-bold text-[#141312] dark:text-[#f6f3ec]">{pickText(ach.title)}</h3>
                <p className="text-[13px] text-[#6e6a62] dark:text-[#A3ACA6]">{pickText(ach.description)}</p>
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between text-[12px] text-[#6e6a62] dark:text-[#A3ACA6]">
                  <span>
                    {ach.progressCurrent}/{ach.progressTarget}
                  </span>
                  <span className="font-mono-custom font-semibold">+{ach.xp} XP</span>
                </div>
                <ProgressBar value={pct} />
              </div>
            </div>
          );
        })}
      </section>
    </div>
  );
};

