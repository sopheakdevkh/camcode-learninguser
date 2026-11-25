import React from 'react';
import { Link } from 'react-router-dom';
import { Bookmark, BookmarkCheck, Clock, Eye, Lock, Play } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { useLearner } from '@/context/LearnerContext';
import { useI18n } from '@/i18n/I18nContext';
import { catalogService } from '@/services/catalogService';
import type { VideoItem } from '@/types';

interface VideoCardProps {
  video: VideoItem;
}

export const VideoCard: React.FC<VideoCardProps> = ({ video }) => {
  const { pickText, t, formatNumber } = useI18n();
  const { user, videoResumeSeconds, hasVideoAccess, toggleWatchlistVideo } = useLearner();

  const instructor = catalogService.getInstructorById(video.instructorId);
  const category = catalogService.getCategoryBySlug(video.categorySlug);
  const canWatch = hasVideoAccess(video);
  const isSaved = user.watchlistVideoIds.includes(video.id);
  const resumedSec = videoResumeSeconds[video.id] ?? 0;

  const handleWatchlistClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWatchlistVideo(video.id);
  };

  return (
    <Link
      to={`/videos/${video.slug}`}
      className="group glass-card glass-card-interactive flex flex-col rounded-[16px] overflow-hidden"
    >
      <div className="p-3.5 pb-0">
        <div
          className={`relative h-38 w-full rounded-[12px] bg-gradient-to-br ${video.thumbnailTheme} border border-white/80 dark:border-slate-700/60 p-3 flex flex-col justify-between overflow-hidden`}
        >
          <div className="flex items-start justify-between gap-2">
            {video.accessType === 'free' ? (
              <Badge tone="success">{t.common.free}</Badge>
            ) : canWatch ? (
              <Badge tone="info">{t.common.included}</Badge>
            ) : (
              <Badge tone="warning">
                <Lock className="h-3 w-3" />
                {video.accessType === 'premium' ? t.common.premium : t.common.basic}
              </Badge>
            )}

            <button
              type="button"
              onClick={handleWatchlistClick}
              aria-label={isSaved ? 'Remove from watchlist' : 'Add to watchlist'}
              className="p-1.5 rounded-[8px] bg-white/90 dark:bg-slate-900/90 border border-[#E2E8F0] dark:border-slate-700 text-[#0F172A] hover:text-[#2563EB] cursor-pointer"
            >
              {isSaved ? (
                <BookmarkCheck className="h-4 w-4 text-[#2563EB]" />
              ) : (
                <Bookmark className="h-4 w-4" />
              )}
            </button>
          </div>

          <div className="flex items-center justify-center my-auto">
            <span className="inline-flex items-center justify-center h-11 w-11 rounded-full bg-white/95 border border-white text-[#2563EB] shadow-sm group-hover:bg-[#2563EB] group-hover:text-white transition-colors">
              {canWatch ? (
                <Play className="h-4 w-4 fill-current ml-0.5" />
              ) : (
                <Lock className="h-4 w-4" />
              )}
            </span>
          </div>

          <div className="flex items-center justify-between gap-2">
            {resumedSec > 0 && canWatch ? (
              <span className="px-2 py-0.5 rounded-[6px] bg-[#2563EB]/90 text-white text-[11px] font-medium">
                {Math.floor(resumedSec / 60)}:{String(resumedSec % 60).padStart(2, '0')}
              </span>
            ) : (
              <span />
            )}
            <span className="px-2 py-0.5 rounded-[6px] bg-[#0F172A]/80 text-white text-[11px] font-medium">
              {formatNumber(video.durationMinutes)} {t.common.minutes}
            </span>
          </div>
        </div>
      </div>

      <div className="flex-1 p-4 flex flex-col justify-between gap-3">
        <div className="space-y-1.5">
          <p className="text-[12px] text-[#64748B] truncate">
            {instructor?.name}
            {category ? ` · ${pickText(category.name)}` : ''}
          </p>
          <h3 className="text-[15px] font-bold text-[#0F172A] group-hover:text-[#2563EB] transition-colors line-clamp-2 leading-snug">
            {pickText(video.title)}
          </h3>
        </div>

        <div className="pt-2.5 border-t border-[#E2E8F0]/80 flex items-center justify-between text-[12px] text-[#64748B]">
          <span className="inline-flex items-center gap-1">
            <Clock className="h-3.5 w-3.5 text-[#94A3B8]" />
            {formatNumber(video.durationMinutes)} {t.common.minutes}
          </span>
          <span className="inline-flex items-center gap-1">
            <Eye className="h-3.5 w-3.5 text-[#94A3B8]" />
            {formatNumber(video.viewsCount)}
          </span>
        </div>
      </div>
    </Link>
  );
};

