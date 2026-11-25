import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Captions,
  Lock,
  Maximize2,
  Minimize2,
  Pause,
  Play,
  RectangleHorizontal,
  RotateCcw,
  RotateCw,
  Settings2,
  Volume2,
  VolumeX,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { useI18n } from '@/i18n/I18nContext';
import type { TranscriptLine } from '@/types';

interface AcademyVideoPlayerProps {
  title: string;
  subtitle?: string;
  instructorName?: string;
  durationMinutes: number;
  initialPositionSeconds?: number;
  locked?: boolean;
  chapters?: { timeSeconds: number; title: string }[];
  transcript?: TranscriptLine[];
  defaultSpeed?: 1 | 1.25 | 1.5 | 2;
  defaultCaptions?: boolean;
  onPositionChange?: (seconds: number) => void;
  onEnded?: () => void;
  theaterMode?: boolean;
  onToggleTheaterMode?: () => void;
}

const SPEEDS = [0.75, 1, 1.25, 1.5, 2] as const;
const QUALITIES = ['1080p HD', '720p', 'Auto (4K)'] as const;

function formatTime(totalSec: number) {
  const s = Math.max(0, Math.floor(totalSec));
  const mins = Math.floor(s / 60);
  const secs = s % 60;
  return `${mins}:${String(secs).padStart(2, '0')}`;
}

export const AcademyVideoPlayer: React.FC<AcademyVideoPlayerProps> = ({
  title,
  subtitle,
  instructorName,
  durationMinutes,
  initialPositionSeconds = 0,
  locked = false,
  chapters = [],
  transcript = [],
  defaultSpeed = 1,
  defaultCaptions = true,
  onPositionChange,
  onEnded,
  theaterMode = false,
  onToggleTheaterMode,
}) => {
  const { t, pickText } = useI18n();
  const totalSeconds = Math.max(60, durationMinutes * 60);
  const containerRef = useRef<HTMLDivElement>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(() =>
    Math.min(totalSeconds - 5, Math.max(0, initialPositionSeconds)),
  );
  const [speed, setSpeed] = useState<number>(defaultSpeed);
  const [quality, setQuality] = useState<string>('1080p HD');
  const [captionsOn, setCaptionsOn] = useState<boolean>(defaultCaptions);
  const [muted, setMuted] = useState(false);
  const [volume, setVolume] = useState(85);
  const [showSettingsMenu, setShowSettingsMenu] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Sync when lesson/video changes
  useEffect(() => {
    setIsPlaying(false);
    setCurrentTime(Math.min(totalSeconds - 5, Math.max(0, initialPositionSeconds)));
  }, [title, initialPositionSeconds, totalSeconds]);

  // Simulated accurate playback clock
  useEffect(() => {
    if (!isPlaying || locked) return;
    const interval = window.setInterval(() => {
      setCurrentTime((prev) => {
        const next = prev + speed;
        if (next >= totalSeconds) {
          setIsPlaying(false);
          onEnded?.();
          return totalSeconds;
        }
        return next;
      });
    }, 1000);
    return () => window.clearInterval(interval);
  }, [isPlaying, speed, totalSeconds, locked, onEnded]);

  // Persist position periodically
  useEffect(() => {
    if (locked) return;
    const rounded = Math.floor(currentTime);
    if (rounded > 0 && rounded % 5 === 0) {
      onPositionChange?.(rounded);
    }
  }, [currentTime, locked, onPositionChange]);

  const progressPercent = (currentTime / totalSeconds) * 100;

  const activeCaption = useMemo(() => {
    if (!captionsOn) return '';
    if (transcript.length > 0) {
      const matched = [...transcript]
        .reverse()
        .find((line) => currentTime >= line.timeSeconds);
      if (matched) return pickText(matched.text);
    }
    if (currentTime < totalSeconds * 0.33) {
      return `${title} — Core concepts and practical academy framework overview.`;
    }
    if (currentTime < totalSeconds * 0.66) {
      return `Applying these workflows step-by-step with real business examples.`;
    }
    return `Summary checklist: verify outcomes and move to the next module.`;
  }, [captionsOn, transcript, currentTime, totalSeconds, title, pickText]);

  const activeSlideIndex = Math.min(3, Math.floor((currentTime / totalSeconds) * 4));
  const slideBullets = [
    ['01 · Learning Objectives & Context', '02 · Core Framework Breakdown', '03 · Guided Walkthrough'],
    ['Key Principle: Clarity Before Complexity', 'Align metrics with measurable goals', 'Document repeatable team steps'],
    ['Live Implementation Pattern', 'Common pitfalls to avoid', 'QA & verification checklist'],
    ['Module Takeaways & Next Actions', 'Download attached workbook', 'Complete lesson knowledge check'],
  ][activeSlideIndex];

  const handleSeek = (nextSec: number) => {
    const clamped = Math.max(0, Math.min(totalSeconds, nextSec));
    setCurrentTime(clamped);
    onPositionChange?.(Math.floor(clamped));
  };

  const toggleFullscreen = async () => {
    if (!containerRef.current) return;
    try {
      if (!document.fullscreenElement) {
        await containerRef.current.requestFullscreen();
        setIsFullscreen(true);
      } else {
        await document.exitFullscreen();
        setIsFullscreen(false);
      }
    } catch {
      // ignore browser restrictions
    }
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full rounded-[16px] overflow-hidden bg-[#0B1120] border border-slate-800 shadow-xl select-none"
    >
      {/* 16:9 Academy Presentation Viewport */}
      <div className="relative aspect-video w-full bg-gradient-to-br from-[#0F172A] via-[#13223F] to-[#0B172A] flex flex-col justify-between p-5 sm:p-8 overflow-hidden">
        {/* Subtle decorative academy grid inside player */}
        <div
          className="absolute inset-0 opacity-20 pointer-events-none"
          style={{
            backgroundImage:
              'radial-gradient(circle at 20% 20%, rgba(37, 99, 235, 0.45), transparent 50%), radial-gradient(circle at 80% 80%, rgba(0, 212, 146, 0.28), transparent 45%)',
          }}
        />

        {locked ? (
          <div className="relative z-10 m-auto max-w-md text-center space-y-4 bg-slate-900/85 backdrop-blur-md border border-slate-700/80 rounded-[16px] p-6">
            <div className="mx-auto h-12 w-12 rounded-full bg-amber-500/15 border border-amber-400/30 flex items-center justify-center text-amber-300">
              <Lock className="h-5 w-5" />
            </div>
            <div className="space-y-1.5">
              <h3 className="text-[17px] font-bold text-white">{t.player.lockedTitle}</h3>
              <p className="text-[13px] text-slate-300 leading-relaxed">
                {t.player.lockedSubtitle}
              </p>
            </div>
            <Link to="/membership" className="inline-block">
              <Button size="sm">{t.player.unlockPlanBtn}</Button>
            </Link>
          </div>
        ) : (
          <>
            {/* Top presentation metadata */}
            <div className="relative z-10 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <span className="px-2.5 py-1 rounded-md bg-[#2563EB]/25 border border-[#60A5FA]/30 text-[11px] font-semibold tracking-wide uppercase text-blue-200">
                  CamcodeLearn Academy
                </span>
                {initialPositionSeconds > 15 && (
                  <span className="hidden sm:inline-flex px-2.5 py-1 rounded-md bg-emerald-500/20 border border-emerald-400/30 text-[11px] font-medium text-emerald-200">
                    {t.player.resumeFrom} {formatTime(initialPositionSeconds)}
                  </span>
                )}
              </div>
              <span className="font-mono-custom text-[11px] text-slate-300 bg-slate-900/70 px-2.5 py-1 rounded-md border border-slate-700/70">
                {quality} · {speed}x
              </span>
            </div>

            {/* Center Educational Slide Visual */}
            <div
              onClick={() => setIsPlaying((p) => !p)}
              className="relative z-10 my-auto grid grid-cols-1 md:grid-cols-12 gap-5 items-center cursor-pointer"
            >
              <div className="md:col-span-7 space-y-2.5">
                <p className="text-[12px] font-medium text-emerald-300 uppercase tracking-wider">
                  {instructorName ?? 'Academy Instructor'}
                </p>
                <h2 className="text-[20px] sm:text-[26px] font-bold text-white leading-tight">
                  {title}
                </h2>
                {subtitle && (
                  <p className="text-[13px] text-slate-300 line-clamp-2 max-w-xl">{subtitle}</p>
                )}
              </div>

              <div className="hidden md:block md:col-span-5 bg-white/8 backdrop-blur-md border border-white/15 rounded-[12px] p-4 space-y-2.5">
                <div className="flex items-center justify-between text-[11px] text-slate-300">
                  <span>Slide {activeSlideIndex + 1} / 4</span>
                  <span className="text-emerald-300 font-medium">
                    {isPlaying ? 'Presenting' : 'Paused'}
                  </span>
                </div>
                <ul className="space-y-2">
                  {slideBullets.map((item) => (
                    <li key={item} className="flex items-start gap-2 text-[12px] text-slate-100">
                      <span className="mt-1 h-1.5 w-1.5 rounded-full bg-emerald-400 shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Center Play/Pause Floating Indicator when paused */}
            {!isPlaying && (
              <button
                type="button"
                onClick={() => setIsPlaying(true)}
                aria-label={t.player.play}
                className="absolute inset-0 z-10 m-auto h-16 w-16 rounded-full bg-[#2563EB]/95 hover:bg-[#1D4ED8] text-white flex items-center justify-center shadow-2xl border-2 border-white/30 transition-transform hover:scale-105 cursor-pointer"
              >
                <Play className="h-7 w-7 fill-current ml-1" />
              </button>
            )}

            {/* Live Subtitle / Caption Overlay */}
            <div className="relative z-10 flex justify-center min-h-[34px]">
              {captionsOn && activeCaption && (
                <div className="px-4 py-1.5 rounded-lg bg-black/75 border border-white/10 text-white text-[13px] text-center max-w-2xl">
                  {activeCaption}
                </div>
              )}
            </div>
          </>
        )}
      </div>

      {/* Player Controls Bar */}
      {!locked && (
        <div className="bg-[#0F172A] px-4 pt-2 pb-3 border-t border-slate-800 space-y-2.5">
          {/* Interactive Timeline Scrubber with Chapter Dots */}
          <div className="relative flex items-center group">
            <input
              type="range"
              min={0}
              max={totalSeconds}
              value={Math.floor(currentTime)}
              onChange={(e) => handleSeek(Number(e.target.value))}
              aria-label="Seek video timeline"
              className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-[#2563EB]"
              style={{
                background: `linear-gradient(to right, #2563EB 0%, #2563EB ${progressPercent}%, #334155 ${progressPercent}%, #334155 100%)`,
              }}
            />
            {chapters.map((ch) => {
              const leftPct = Math.min(98, Math.max(1, (ch.timeSeconds / totalSeconds) * 100));
              return (
                <button
                  key={ch.timeSeconds}
                  type="button"
                  title={`${ch.title} (${formatTime(ch.timeSeconds)})`}
                  onClick={() => handleSeek(ch.timeSeconds)}
                  style={{ left: `${leftPct}%` }}
                  className="absolute top-1/2 -translate-y-1/2 h-2.5 w-2.5 rounded-full bg-emerald-400 border border-slate-900 cursor-pointer hover:scale-125 transition-transform"
                />
              );
            })}
          </div>

          <div className="flex flex-wrap items-center justify-between gap-2 text-slate-200">
            {/* Left controls */}
            <div className="flex items-center gap-1.5 sm:gap-2">
              <button
                type="button"
                onClick={() => setIsPlaying((p) => !p)}
                aria-label={isPlaying ? t.player.pause : t.player.play}
                className="p-2 rounded-lg hover:bg-slate-800 text-white cursor-pointer"
              >
                {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4 fill-current" />}
              </button>

              <button
                type="button"
                onClick={() => handleSeek(currentTime - 10)}
                title={t.player.rewind10}
                className="p-2 rounded-lg hover:bg-slate-800 text-slate-300 hover:text-white cursor-pointer"
              >
                <RotateCcw className="h-4 w-4" />
              </button>

              <button
                type="button"
                onClick={() => handleSeek(currentTime + 10)}
                title={t.player.forward10}
                className="p-2 rounded-lg hover:bg-slate-800 text-slate-300 hover:text-white cursor-pointer"
              >
                <RotateCw className="h-4 w-4" />
              </button>

              {/* Volume */}
              <div className="hidden sm:flex items-center gap-1.5 ml-1">
                <button
                  type="button"
                  onClick={() => setMuted((m) => !m)}
                  aria-label="Toggle mute"
                  className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-300 cursor-pointer"
                >
                  {muted || volume === 0 ? (
                    <VolumeX className="h-4 w-4" />
                  ) : (
                    <Volume2 className="h-4 w-4" />
                  )}
                </button>
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={muted ? 0 : volume}
                  onChange={(e) => {
                    setMuted(false);
                    setVolume(Number(e.target.value));
                  }}
                  aria-label="Volume"
                  className="w-16 h-1 accent-[#2563EB] cursor-pointer"
                />
              </div>

              <span className="font-mono-custom text-[12px] text-slate-300 ml-2">
                {formatTime(currentTime)} / {formatTime(totalSeconds)}
              </span>
            </div>

            {/* Right controls */}
            <div className="relative flex items-center gap-1 sm:gap-1.5">
              <button
                type="button"
                onClick={() => setCaptionsOn((c) => !c)}
                title={t.player.captions}
                className={`inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[12px] font-medium cursor-pointer transition-colors ${
                  captionsOn
                    ? 'bg-[#2563EB]/25 text-blue-300 border border-blue-500/40'
                    : 'text-slate-300 hover:bg-slate-800'
                }`}
              >
                <Captions className="h-4 w-4" />
                <span className="hidden sm:inline">CC</span>
              </button>

              {/* Speed cycle quick button */}
              <button
                type="button"
                onClick={() => {
                  const idx = SPEEDS.indexOf(speed as (typeof SPEEDS)[number]);
                  setSpeed(SPEEDS[(idx + 1) % SPEEDS.length]);
                }}
                title={t.player.speed}
                className="px-2.5 py-1.5 rounded-lg text-[12px] font-mono-custom font-medium text-slate-200 hover:bg-slate-800 cursor-pointer"
              >
                {speed}x
              </button>

              {/* Quality & Speed popover */}
              <button
                type="button"
                onClick={() => setShowSettingsMenu((s) => !s)}
                title={t.player.quality}
                className="p-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 cursor-pointer"
              >
                <Settings2 className="h-4 w-4" />
              </button>

              {showSettingsMenu && (
                <div className="absolute right-0 bottom-11 z-30 w-52 rounded-[12px] bg-slate-900 border border-slate-700 shadow-2xl p-3 space-y-3 text-[12px]">
                  <div>
                    <p className="text-slate-400 font-semibold mb-1.5">{t.player.speed}</p>
                    <div className="flex flex-wrap gap-1">
                      {SPEEDS.map((s) => (
                        <button
                          key={s}
                          type="button"
                          onClick={() => setSpeed(s)}
                          className={`px-2 py-1 rounded cursor-pointer ${
                            speed === s ? 'bg-[#2563EB] text-white' : 'bg-slate-800 text-slate-300'
                          }`}
                        >
                          {s}x
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-slate-400 font-semibold mb-1.5">{t.player.quality}</p>
                    <div className="space-y-1">
                      {QUALITIES.map((q) => (
                        <button
                          key={q}
                          type="button"
                          onClick={() => {
                            setQuality(q);
                            setShowSettingsMenu(false);
                          }}
                          className={`w-full text-left px-2 py-1 rounded cursor-pointer ${
                            quality === q ? 'bg-[#2563EB] text-white' : 'text-slate-300 hover:bg-slate-800'
                          }`}
                        >
                          {q}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {onToggleTheaterMode && (
                <button
                  type="button"
                  onClick={onToggleTheaterMode}
                  title={t.player.theaterMode}
                  className={`hidden md:inline-flex p-2 rounded-lg cursor-pointer ${
                    theaterMode ? 'bg-slate-800 text-blue-300' : 'text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  <RectangleHorizontal className="h-4 w-4" />
                </button>
              )}

              <button
                type="button"
                onClick={toggleFullscreen}
                title={t.player.fullscreen}
                className="p-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 cursor-pointer"
              >
                {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

