import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, Bookmark, BookmarkCheck, Clock, Eye, Lock, Play } from 'lucide-react';
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
    <Link to={`/videos/${video.slug}`} className="block h-full">
      <article className="card-note group flex h-full flex-col justify-between p-5">
        <div>
          {/* Inset Blueprint Frame */}
          <div className="relative h-36 w-full rounded-xl bg-[#e5dfd2]/75 dark:bg-[#181E1B] border border-[#ded8ca] dark:border-[#2A332E] swiss-blueprint-bg p-3 flex flex-col justify-between overflow-hidden transition-colors duration-[0.22s] group-hover:border-[#B9B3A6] dark:group-hover:border-[#3E4D45]">
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
                className="p-1.5 rounded-full bg-[#f6f3ec] dark:bg-[#151A17] border border-[#ded8ca] dark:border-[#2A332E] text-[#6e6a62] hover:text-[#1c5b48] hover:border-[#1c5b48] cursor-pointer transition-colors"
              >
                {isSaved ? (
                  <BookmarkCheck className="h-4 w-4 text-[#1c5b48] dark:text-[#7CD4B5]" />
                ) : (
                  <Bookmark className="h-4 w-4" />
                )}
              </button>
            </div>

            <div className="flex items-center justify-center my-auto">
              <span className="inline-flex items-center justify-center h-11 w-11 rounded-full bg-[#1c5b48] dark:bg-[#2D7A62] text-white shadow-sm transition-transform duration-300 group-hover:scale-105 group-hover:bg-[#15463a]">
                {canWatch ? (
                  <Play className="h-4 w-4 fill-current ml-0.5" />
                ) : (
                  <Lock className="h-4 w-4" />
                )}
              </span>
            </div>

            <div className="flex items-center justify-between gap-2">
              {resumedSec > 0 && canWatch ? (
                <span className="font-mono-tech px-2.5 py-0.5 rounded-full bg-[#1c5b48] text-white text-[10.5px] font-medium tabular-nums">
                  {Math.floor(resumedSec / 60)}:{String(resumedSec % 60).padStart(2, '0')}
                </span>
              ) : (
                <span />
              )}
              <span className="font-mono-tech px-2.5 py-0.5 rounded-full bg-[#1C2420] text-white text-[10.5px] font-medium tabular-nums">
                {formatNumber(video.durationMinutes)} {t.common.minutes}
              </span>
            </div>
          </div>

          {/* Serif Title + Index */}
          <div className="mt-4 flex items-start justify-between gap-3">
            <h3 className="font-serif-display text-[19px] font-medium text-[#141312] dark:text-[#f6f3ec] group-hover:text-[#1c5b48] dark:group-hover:text-[#7CD4B5] transition-colors line-clamp-2 leading-snug">
              {pickText(video.title)}
            </h3>
            <span aria-hidden="true" className="index-number mt-1 shrink-0">
              {String(video.durationMinutes).padStart(2, '0')}m
            </span>
          </div>

          <ul className="mt-3.5 flex flex-wrap gap-1.5">
            {category && (
              <li>
                <span className="inline-flex items-center rounded-full border border-[#ded8ca] dark:border-[#2A332E] bg-[#efebe1]/65 dark:bg-[#101412] px-2.5 py-1 text-[12px] font-medium text-[#4c4842] dark:text-[#D5D1C8] transition-colors duration-[0.22s] group-hover:border-[#B9B3A6] dark:group-hover:border-[#495B51]">
                  {pickText(category.name)}
                </span>
              </li>
            )}
            <li>
              <span className="inline-flex items-center gap-1 rounded-full border border-[#ded8ca] dark:border-[#2A332E] bg-[#efebe1]/65 dark:bg-[#101412] px-2.5 py-1 text-[12px] font-medium text-[#4c4842] dark:text-[#D5D1C8] tabular-nums transition-colors duration-[0.22s] group-hover:border-[#B9B3A6] dark:group-hover:border-[#495B51]">
                <Clock className="h-3 w-3 opacity-75" />
                {formatNumber(video.durationMinutes)} {t.common.minutes}
              </span>
            </li>
            <li>
              <span className="inline-flex items-center gap-1 rounded-full border border-[#ded8ca] dark:border-[#2A332E] bg-[#efebe1]/65 dark:bg-[#101412] px-2.5 py-1 text-[12px] font-medium text-[#4c4842] dark:text-[#D5D1C8] tabular-nums transition-colors duration-[0.22s] group-hover:border-[#B9B3A6] dark:group-hover:border-[#495B51]">
                <Eye className="h-3 w-3 opacity-75" />
                {formatNumber(video.viewsCount)}
              </span>
            </li>
          </ul>
        </div>

        <div className="mt-4 pt-3.5 border-t border-[#ded8ca] dark:border-[#2A332E] transition-colors duration-[0.22s] group-hover:border-[#B9B3A6] dark:group-hover:border-[#3E4D45] flex items-center justify-between gap-2">
          <p className="t-method truncate">{instructor?.name ?? 'Workshop'}</p>
          <span className="inline-flex items-center gap-1 text-[12.5px] font-semibold text-[#1c5b48] dark:text-[#7CD4B5] whitespace-nowrap">
            <span>Watch</span>
            <ArrowUpRight className="h-3.5 w-3.5 swiss-arrow-shift" />
          </span>
        </div>
      </article>
    </Link>
  );
};
