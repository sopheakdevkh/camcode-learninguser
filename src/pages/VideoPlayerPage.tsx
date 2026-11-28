import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, Bookmark, BookmarkCheck, Clock, Eye, ListVideo } from 'lucide-react';
import { VideoCard } from '@/components/cards/VideoCard';
import { AcademyVideoPlayer } from '@/components/player/AcademyVideoPlayer';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { useLearner } from '@/context/LearnerContext';
import { useI18n } from '@/i18n/I18nContext';
import { catalogService } from '@/services/catalogService';

function fmtTimestamp(sec: number) {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${m}:${String(s).padStart(2, '0')}`;
}

export const VideoPlayerPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { t, pickText, formatNumber } = useI18n();
  const {
    user,
    settings,
    videoResumeSeconds,
    hasVideoAccess,
    toggleWatchlistVideo,
    updateVideoPosition,
  } = useLearner();

  const video = slug ? catalogService.getVideoBySlug(slug) : undefined;
  const [theaterMode, setTheaterMode] = useState(false);
  const [seekOverride, setSeekOverride] = useState<number | undefined>(undefined);

  if (!video) {
    return (
      <div className="card-note rounded-[16px] p-10 text-center space-y-4">
        <h2 className="text-[20px] font-bold text-[#141312] dark:text-[#f6f3ec]">Video not found</h2>
        <Link to="/videos">
          <Button>{t.nav.videos}</Button>
        </Link>
      </div>
    );
  }

  const instructor = catalogService.getInstructorById(video.instructorId);
  const category = catalogService.getCategoryBySlug(video.categorySlug);
  const canWatch = hasVideoAccess(video);
  const isSaved = user.watchlistVideoIds.includes(video.id);
  const related = catalogService.getRelatedVideos(video, 4);
  const savedSec = seekOverride ?? videoResumeSeconds[video.id] ?? 0;

  return (
    <div className="space-y-6">
      <Link
        to="/videos"
        className="inline-flex items-center gap-1.5 text-[13.5px] font-medium text-[#6e6a62] dark:text-[#A3ACA6] hover:text-[#1c5b48] dark:text-[#7CD4B5]"
      >
        <ArrowLeft className="h-4 w-4" />
        <span>Back to {t.nav.videos}</span>
      </Link>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
        <div className={`${theaterMode ? 'xl:col-span-12' : 'xl:col-span-8'} space-y-5`}>
          <AcademyVideoPlayer
            title={pickText(video.title)}
            subtitle={pickText(video.description)}
            instructorName={instructor?.name}
            durationMinutes={video.durationMinutes}
            initialPositionSeconds={savedSec}
            locked={!canWatch}
            chapters={(video.chapters ?? []).map((c) => ({
              timeSeconds: c.timeSeconds,
              title: pickText(c.title),
            }))}
            transcript={video.transcript}
            defaultSpeed={settings.defaultPlaybackSpeed}
            defaultCaptions={settings.captionsEnabled}
            theaterMode={theaterMode}
            onToggleTheaterMode={() => setTheaterMode((m) => !m)}
            onPositionChange={(sec) => {
              if (canWatch) updateVideoPosition(video.id, sec);
            }}
          />

          {/* Video Details Card */}
          <div className="card-note rounded-[18px] p-5 sm:p-6 space-y-4">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="space-y-2 max-w-2xl">
                <div className="flex flex-wrap items-center gap-2">
                  {category && <Badge tone="primary">{pickText(category.name)}</Badge>}
                  <Badge tone={video.accessType === 'free' ? 'success' : 'warning'}>
                    {video.accessType === 'free'
                      ? t.common.free
                      : video.accessType === 'premium'
                        ? t.common.premium
                        : t.common.basic}
                  </Badge>
                </div>
                <h1 className="font-serif-display text-[24px] sm:text-[28px] leading-[1.15] tracking-[-0.02em] font-medium text-[#141312] dark:text-[#f6f3ec]">
                  {pickText(video.title)}
                </h1>
              </div>

              <Button
                variant={isSaved ? 'primary' : 'outline'}
                size="sm"
                onClick={() => toggleWatchlistVideo(video.id)}
                leftIcon={
                  isSaved ? (
                    <BookmarkCheck className="h-4 w-4" />
                  ) : (
                    <Bookmark className="h-4 w-4" />
                  )
                }
              >
                {isSaved ? 'Saved' : 'Save to Watchlist'}
              </Button>
            </div>

            <p className="text-[14.5px] text-[#4c4842] dark:text-[#D5D1C8] leading-relaxed">
              {pickText(video.description)}
            </p>

            <div className="flex flex-wrap items-center gap-5 pt-2 border-t border-[#ded8ca] dark:border-[#2A332E] text-[13px] text-[#6e6a62] dark:text-[#A3ACA6]">
              <span className="font-semibold text-[#141312] dark:text-[#f6f3ec]">{instructor?.name}</span>
              <span className="inline-flex items-center gap-1.5">
                <Clock className="h-4 w-4" />
                {formatNumber(video.durationMinutes)} {t.common.minutes}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Eye className="h-4 w-4" />
                {formatNumber(video.viewsCount)} views
              </span>
            </div>
          </div>
        </div>

        {/* Right Sidebar: Chapters & Transcript */}
        <aside className={`${theaterMode ? 'xl:col-span-12' : 'xl:col-span-4'} space-y-5`}>
          {video.chapters && video.chapters.length > 0 && (
            <div className="card-note rounded-[18px] p-5 space-y-3">
              <h2 className="text-[16px] font-bold text-[#141312] dark:text-[#f6f3ec] flex items-center gap-2">
                <ListVideo className="h-4.5 w-4.5 text-[#1c5b48] dark:text-[#7CD4B5]" />
                {t.player.chapters}
              </h2>
              <div className="space-y-1.5">
                {video.chapters.map((ch) => (
                  <button
                    key={ch.timeSeconds}
                    type="button"
                    disabled={!canWatch}
                    onClick={() => setSeekOverride(ch.timeSeconds)}
                    className="w-full text-left px-3 py-2.5 rounded-[10px] bg-[#f6f3ec] dark:bg-[#101412] dark:bg-[#151A17] hover:bg-[#e4ede7] dark:bg-[#1B3028] dark:hover:bg-slate-800 border border-[#ded8ca] dark:border-[#2A332E] flex items-center justify-between gap-2 cursor-pointer disabled:opacity-50"
                  >
                    <span className="text-[13px] font-medium text-[#141312] dark:text-[#f6f3ec]">
                      {pickText(ch.title)}
                    </span>
                    <span className="font-mono-custom text-[12px] text-[#1c5b48] dark:text-[#7CD4B5] shrink-0">
                      {fmtTimestamp(ch.timeSeconds)}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {video.transcript && video.transcript.length > 0 && (
            <div className="card-note rounded-[18px] p-5 space-y-3">
              <h2 className="text-[16px] font-bold text-[#141312] dark:text-[#f6f3ec]">{t.player.transcript}</h2>
              <div className="space-y-2.5">
                {video.transcript.map((line, i) => (
                  <button
                    key={i}
                    type="button"
                    disabled={!canWatch}
                    onClick={() => setSeekOverride(line.timeSeconds)}
                    className="w-full text-left p-2.5 rounded-[10px] hover:bg-[#efebe1]/75 dark:hover:bg-[#181E1B] transition-colors cursor-pointer"
                  >
                    <span className="font-mono-custom text-[11px] font-semibold text-[#1c5b48] dark:text-[#7CD4B5]">
                      {fmtTimestamp(line.timeSeconds)} · {line.speaker}
                    </span>
                    <p className="text-[13px] text-[#4c4842] dark:text-[#D5D1C8] mt-0.5">{pickText(line.text)}</p>
                  </button>
                ))}
              </div>
            </div>
          )}
        </aside>
      </div>

      {/* Related Videos */}
      <section className="space-y-4">
        <h2 className="text-[19px] font-bold text-[#141312] dark:text-[#f6f3ec]">Related Training Videos</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {related.map((v) => (
            <VideoCard key={v.id} video={v} />
          ))}
        </div>
      </section>
    </div>
  );
};

