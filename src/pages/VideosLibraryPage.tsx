import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Bookmark, Film, Search } from 'lucide-react';
import { CourseCard } from '@/components/cards/CourseCard';
import { VideoCard } from '@/components/cards/VideoCard';
import { Button } from '@/components/ui/Button';
import { Dropdown } from '@/components/ui/Dropdown';
import { useLearner } from '@/context/LearnerContext';
import { useI18n } from '@/i18n/I18nContext';
import { catalogService } from '@/services/catalogService';

export const VideosLibraryPage: React.FC = () => {
  const { t, pickText } = useI18n();
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('');
  const [accessFilter, setAccessFilter] = useState<'all' | 'free' | 'member'>('all');

  const categories = catalogService.getCategories();
  const videos = catalogService.getAllVideos();

  const filtered = useMemo(() => {
    return videos.filter((v) => {
      if (category && v.categorySlug !== category) return false;
      if (accessFilter === 'free' && v.accessType !== 'free') return false;
      if (accessFilter === 'member' && v.accessType === 'free') return false;
      if (query.trim()) {
        const q = query.trim().toLowerCase();
        return (
          pickText(v.title).toLowerCase().includes(q) ||
          v.tags.some((tag) => tag.toLowerCase().includes(q))
        );
      }
      return true;
    });
  }, [videos, category, accessFilter, query, pickText]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif-display text-[28px] sm:text-[34px] leading-[1.1] tracking-[-0.02em] font-medium text-[#141312] dark:text-[#f6f3ec]">
          {t.nav.videos}
        </h1>
        <p className="text-[14.5px] text-[#4c4842] dark:text-[#D5D1C8] mt-1">
          Focused workshops, technical clinics, and industry walkthroughs.
        </p>
      </div>

      <div className="card-note rounded-[16px] p-4 flex flex-col md:flex-row gap-3 items-stretch md:items-center">
        <div className="flex-1 flex items-center h-10 px-3 rounded-[9px] border border-[#ded8ca] dark:border-[#2A332E] bg-[#efebe1] dark:bg-[#151A17]">
          <Search className="h-4 w-4 text-[#6e6a62] mr-2 shrink-0" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search videos or tags..."
            className="w-full bg-transparent text-[13.5px] text-[#141312] dark:text-[#f6f3ec] outline-none"
          />
        </div>
        <Dropdown
          value={category}
          onChange={setCategory}
          aria-label={t.explore.allCategories}
          options={[
            { value: '', label: t.explore.allCategories },
            ...categories.map((c) => ({ value: c.slug, label: pickText(c.name) })),
          ]}
        />
        <div className="flex items-center gap-1.5">
          {(['all', 'free', 'member'] as const).map((mode) => (
            <button
              key={mode}
              type="button"
              onClick={() => setAccessFilter(mode)}
              className={`h-10 px-3.5 rounded-[9px] text-[13px] font-medium capitalize cursor-pointer ${
                accessFilter === mode
                  ? 'bg-[#1c5b48] dark:bg-[#2D7A62] text-white'
                  : 'bg-[#efebe1] dark:bg-[#151A17] border border-[#ded8ca] dark:border-[#2A332E] text-[#4c4842] dark:text-[#D5D1C8]'
              }`}
            >
              {mode === 'all' ? 'All' : mode === 'free' ? t.common.free : 'Member'}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="card-note rounded-[16px] p-10 text-center space-y-3">
          <Film className="h-10 w-10 text-[#6e6a62] mx-auto" />
          <p className="text-[16px] font-semibold text-[#141312] dark:text-[#f6f3ec]">No matching videos found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {filtered.map((v) => (
            <VideoCard key={v.id} video={v} />
          ))}
        </div>
      )}
    </div>
  );
};

export const WatchlistPage: React.FC = () => {
  const { t } = useI18n();
  const { user } = useLearner();
  const [tab, setTab] = useState<'all' | 'courses' | 'videos'>('all');

  const savedCourses = catalogService
    .getAllCourses()
    .filter((c) => user.savedCourseIds.includes(c.id));
  const savedVideos = catalogService
    .getAllVideos()
    .filter((v) => user.watchlistVideoIds.includes(v.id));

  const showCourses = tab === 'all' || tab === 'courses';
  const showVideos = tab === 'all' || tab === 'videos';
  const isEmpty = savedCourses.length === 0 && savedVideos.length === 0;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <h1 className="font-serif-display text-[28px] sm:text-[34px] leading-[1.1] tracking-[-0.02em] font-medium text-[#141312] dark:text-[#f6f3ec]">
            {t.nav.watchlist}
          </h1>
          <p className="text-[14.5px] text-[#4c4842] dark:text-[#D5D1C8] mt-1">
            Courses and training videos bookmarked for later study.
          </p>
        </div>
        <div className="flex items-center gap-2">
          {(['all', 'courses', 'videos'] as const).map((key) => (
            <button
              key={key}
              type="button"
              onClick={() => setTab(key)}
              className={`px-3.5 py-1.5 rounded-[9px] text-[13px] font-semibold capitalize cursor-pointer ${
                tab === key
                  ? 'bg-[#1c5b48] dark:bg-[#2D7A62] text-white'
                  : 'bg-[#efebe1] dark:bg-[#151A17] border border-[#ded8ca] dark:border-[#2A332E] text-[#4c4842] dark:text-[#D5D1C8]'
              }`}
            >
              {key}
            </button>
          ))}
        </div>
      </div>

      {isEmpty ? (
        <div className="card-note rounded-[18px] p-10 text-center space-y-3">
          <Bookmark className="h-10 w-10 text-[#6e6a62] mx-auto" />
          <h3 className="text-[18px] font-bold text-[#141312] dark:text-[#f6f3ec]">Your watchlist is empty</h3>
          <p className="text-[14px] text-[#6e6a62] dark:text-[#A3ACA6]">
            Bookmark courses or training videos to keep them handy here.
          </p>
          <Link to="/explore" className="inline-block">
            <Button>{t.nav.explore}</Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-8">
          {showCourses && savedCourses.length > 0 && (
            <section className="space-y-3">
              <h2 className="text-[18px] font-bold text-[#141312] dark:text-[#f6f3ec]">
                Saved Courses ({savedCourses.length})
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                {savedCourses.map((c) => (
                  <CourseCard key={c.id} course={c} variant="explore" />
                ))}
              </div>
            </section>
          )}

          {showVideos && savedVideos.length > 0 && (
            <section className="space-y-3">
              <h2 className="text-[18px] font-bold text-[#141312] dark:text-[#f6f3ec]">
                Saved Videos ({savedVideos.length})
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {savedVideos.map((v) => (
                  <VideoCard key={v.id} video={v} />
                ))}
              </div>
            </section>
          )}
        </div>
      )}
    </div>
  );
};

