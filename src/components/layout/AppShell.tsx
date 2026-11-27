import React, { useEffect, useMemo, useState } from 'react';
import { Link, NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import {
  Award,
  Bell,
  Bookmark,
  BookOpen,
  CheckCircle2,
  ChevronDown,
  ClipboardCheck,
  Compass,
  CreditCard,
  Film,
  Globe,
  HelpCircle,
  LayoutDashboard,
  Map,
  Menu,
  Moon,
  PanelLeftClose,
  PanelLeftOpen,
  Search,
  Settings,
  Sun,
  Trophy,
  User as UserIcon,
  X,
} from 'lucide-react';
import { useLearner } from '@/context/LearnerContext';
import { useTheme } from '@/context/ThemeContext';
import { useI18n } from '@/i18n/I18nContext';
import { catalogService } from '@/services/catalogService';
import type { PlanTier } from '@/types';

interface NavItem {
  to: string;
  label: string;
  icon: React.ReactNode;
  badge?: number;
}

const BrandMark: React.FC<{ className?: string }> = ({ className = '' }) => (
  <span
    className={`inline-flex h-8 w-8 items-center justify-center rounded-lg bg-[#1c5b48] dark:bg-[#2D7A62] text-white shrink-0 shadow-xs ${className}`}
    aria-hidden="true"
  >
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path
        d="M3 5.5H13M3 10.5C5.2 8.9 6.8 12.1 9 10.5C10.5 9.4 11.7 9.6 13 10.5"
        stroke="currentColor"
        strokeWidth="1.65"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  </span>
);

export const AppShell: React.FC = () => {
  const { t, locale, toggleLocale, pickText } = useI18n();
  const { isDark, toggleTheme } = useTheme();
  const {
    user,
    notifications,
    unreadNotificationCount,
    getEnrolledCourses,
    markNotificationRead,
    markAllNotificationsRead,
    switchDemoPlan,
  } = useLearner();

  const enrolledCount = getEnrolledCourses().length;

  const location = useLocation();
  const navigate = useNavigate();

  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchFocused, setSearchFocused] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);

  useEffect(() => {
    setMobileDrawerOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (!mobileDrawerOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMobileDrawerOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener('keydown', onKey);
    };
  }, [mobileDrawerOpen]);

  const navGroups: { title: string; items: NavItem[] }[] = useMemo(
    () => [
      {
        title: t.nav.groups.overview,
        items: [{ to: '/', label: t.nav.dashboard, icon: <LayoutDashboard className="h-4.5 w-4.5" /> }],
      },
      {
        title: t.nav.groups.learning,
        items: [
          { to: '/explore', label: t.nav.explore, icon: <Compass className="h-4.5 w-4.5" /> },
          {
            to: '/my-courses',
            label: t.nav.myCourses,
            icon: <BookOpen className="h-4.5 w-4.5" />,
            badge: enrolledCount,
          },
          { to: '/learning-paths', label: t.nav.learningPaths, icon: <Map className="h-4.5 w-4.5" /> },
          { to: '/videos', label: t.nav.videos, icon: <Film className="h-4.5 w-4.5" /> },
          { to: '/watchlist', label: t.nav.watchlist, icon: <Bookmark className="h-4.5 w-4.5" /> },
        ],
      },
      {
        title: t.nav.groups.achievements,
        items: [
          { to: '/certifications', label: t.nav.certifications, icon: <Award className="h-4.5 w-4.5" /> },
          { to: '/assessments', label: t.nav.assessments, icon: <ClipboardCheck className="h-4.5 w-4.5" /> },
          { to: '/achievements', label: t.nav.achievements, icon: <Trophy className="h-4.5 w-4.5" /> },
        ],
      },
      {
        title: t.nav.groups.account,
        items: [
          { to: '/membership', label: t.nav.membership, icon: <CreditCard className="h-4.5 w-4.5" /> },
          {
            to: '/notifications',
            label: t.nav.notifications,
            icon: <Bell className="h-4.5 w-4.5" />,
            badge: unreadNotificationCount,
          },
          { to: '/profile', label: t.nav.profile, icon: <UserIcon className="h-4.5 w-4.5" /> },
          { to: '/settings', label: t.nav.settings, icon: <Settings className="h-4.5 w-4.5" /> },
          { to: '/help', label: t.nav.help, icon: <HelpCircle className="h-4.5 w-4.5" /> },
        ],
      },
    ],
    [t, unreadNotificationCount, enrolledCount],
  );

  // Page title & breadcrumb based on active route
  const currentTitle = useMemo(() => {
    const p = location.pathname;
    if (p === '/') return t.nav.dashboard;
    if (p.startsWith('/explore')) return t.nav.explore;
    if (p.startsWith('/courses/')) return t.workspace.backToCourse;
    if (p.startsWith('/learn/')) return 'Learning Workspace';
    if (p.startsWith('/my-courses')) return t.nav.myCourses;
    if (p.startsWith('/learning-paths')) return t.nav.learningPaths;
    if (p.startsWith('/videos')) return t.nav.videos;
    if (p.startsWith('/watchlist')) return t.nav.watchlist;
    if (p.startsWith('/certifications')) return t.nav.certifications;
    if (p.startsWith('/assessments')) return t.nav.assessments;
    if (p.startsWith('/achievements')) return t.nav.achievements;
    if (p.startsWith('/membership')) return t.nav.membership;
    if (p.startsWith('/notifications')) return t.nav.notifications;
    if (p.startsWith('/profile')) return t.nav.profile;
    if (p.startsWith('/settings')) return t.nav.settings;
    if (p.startsWith('/help')) return t.nav.help;
    return t.brand.academy;
  }, [location.pathname, t]);

  // Global search results
  const searchResults = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return { courses: [], videos: [], paths: [] };
    return {
      courses: catalogService
        .getAllCourses()
        .filter((c) => pickText(c.title).toLowerCase().includes(q) || pickText(c.subtitle).toLowerCase().includes(q))
        .slice(0, 4),
      videos: catalogService
        .getAllVideos()
        .filter((v) => pickText(v.title).toLowerCase().includes(q) || v.tags.some((tag) => tag.toLowerCase().includes(q)))
        .slice(0, 3),
      paths: catalogService
        .getLearningPaths()
        .filter((lp) => pickText(lp.title).toLowerCase().includes(q))
        .slice(0, 2),
    };
  }, [searchQuery, pickText]);

  const hasSearchMatches =
    searchResults.courses.length > 0 || searchResults.videos.length > 0 || searchResults.paths.length > 0;

  const initials = user.fullName
    .split(' ')
    .map((p) => p[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  const renderSidebarLinks = (collapsed: boolean, onItemClick?: () => void) => (
    <div className="flex-1 overflow-y-auto thin-scrollbar px-3 py-4 space-y-5">
      {navGroups.map((group) => (
        <div key={group.title}>
          {!collapsed && (
            <p className="font-mono-tech px-3 mb-1.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-[#6e6a62]">
              {group.title}
            </p>
          )}
          <nav className="space-y-0.5">
            {group.items.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/'}
                onClick={onItemClick}
                title={collapsed ? item.label : undefined}
                className={({ isActive }) =>
                  `flex items-center ${
                    collapsed ? 'justify-center px-2' : 'justify-between px-3.5'
                  } py-2.5 rounded-full text-[13.5px] font-medium transition-colors duration-[0.22s] ${
                    isActive
                      ? 'bg-[#e4ede7] dark:bg-[#1B3028] text-[#1c5b48] dark:text-[#7CD4B5] font-semibold'
                      : 'text-[#4c4842] dark:text-[#D5D1C8] hover:bg-[#e5dfd2]/75 dark:hover:bg-[#181E1B] hover:text-[#141312] dark:hover:text-[#f6f3ec]'
                  }`
                }
              >
                <span className="flex items-center gap-2.5 min-w-0">
                  <span className="shrink-0">{item.icon}</span>
                  {!collapsed && <span className="truncate">{item.label}</span>}
                </span>
                {!collapsed && item.badge !== undefined && item.badge > 0 && (
                  <span className="font-mono-tech px-2 py-0.5 rounded-full bg-[#1c5b48] dark:bg-[#2D7A62] text-white text-[10.5px] font-semibold leading-none tabular-nums">
                    {item.badge}
                  </span>
                )}
              </NavLink>
            ))}
          </nav>
        </div>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen flex bg-[#f6f3ec] dark:bg-[#101412] text-[#141312] dark:text-[#f6f3ec]">
      <div className="bg-environment" />
      <div className="grid-floor" />

      {/* Desktop Sidebar */}
      <aside
        className={`no-print hidden lg:flex flex-col sticky top-0 h-screen shrink-0 border-r border-[#ded8ca] dark:border-[#2A332E] bg-[#efebe1]/92 dark:bg-[#151A17]/92 backdrop-blur-xl transition-all duration-200 z-30 ${
          sidebarCollapsed ? 'w-[76px]' : 'w-[264px]'
        }`}
      >
        {/* Brand Header */}
        <div className="h-16 px-4 flex items-center justify-between border-b border-[#ded8ca] dark:border-[#2A332E] shrink-0">
          <Link to="/" className="flex items-center gap-2.5 min-w-0">
            <BrandMark />
            {!sidebarCollapsed && (
              <div className="min-w-0">
                <p className="font-serif-display text-[19px] font-normal text-[#141312] dark:text-[#f6f3ec] leading-none truncate">
                  {t.brand.name}
                </p>
                <p className="font-mono-tech text-[9.5px] uppercase tracking-[0.1em] text-[#1c5b48] dark:text-[#7CD4B5] leading-tight mt-0.5">
                  {t.brand.academy}
                </p>
              </div>
            )}
          </Link>
        </div>

        {renderSidebarLinks(sidebarCollapsed)}

        {/* Sidebar Footer Membership Pill */}
        {!sidebarCollapsed && (
          <div className="p-3.5 border-t border-[#ded8ca] dark:border-[#2A332E]">
            <Link
              to="/membership"
              className="flex items-center justify-between p-3 rounded-2xl bg-[#f6f3ec] dark:bg-[#101412] border border-[#ded8ca] dark:border-[#2A332E] hover:border-[#1c5b48] dark:hover:border-[#7CD4B5] transition-colors"
            >
              <div>
                <p className="font-mono-tech text-[10px] uppercase tracking-[0.08em] text-[#6e6a62]">
                  {t.dashboard.membershipTitle}
                </p>
                <p className="text-[13px] font-semibold text-[#141312] dark:text-[#f6f3ec] capitalize mt-0.5">
                  {user.activePlan} {t.dashboard.planLabel}
                </p>
              </div>
              <span className="font-mono-tech px-2.5 py-1 rounded-full bg-[#e4ede7] dark:bg-[#1B3028] text-[#1c5b48] dark:text-[#7CD4B5] text-[10px] uppercase tracking-[0.06em] font-semibold">
                {user.activePlan === 'premium' ? t.dashboard.fullBadge : t.dashboard.upgradeBadge}
              </span>
            </Link>
          </div>
        )}
      </aside>

      {/* Full-Screen Right-to-Left Mobile Drawer */}
      <div
        className={`fixed inset-0 z-50 lg:hidden transition-opacity duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          mobileDrawerOpen ? 'pointer-events-auto opacity-100 visible' : 'pointer-events-none opacity-0 invisible'
        }`}
        onClick={() => setMobileDrawerOpen(false)}
        aria-hidden={!mobileDrawerOpen}
      >
        <div
          aria-hidden="true"
          className={`absolute inset-0 bg-[#141312]/45 backdrop-blur-[2px] transition-opacity duration-500 ${
            mobileDrawerOpen ? 'opacity-100' : 'opacity-0'
          }`}
        />
        <div
          className={`relative ml-auto w-full h-dvh bg-[#f6f3ec] dark:bg-[#101412] flex flex-col transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] will-change-transform ${
            mobileDrawerOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="h-16 px-5 flex items-center justify-between border-b border-[#ded8ca] dark:border-[#2A332E]">
            <Link
              to="/"
              onClick={() => setMobileDrawerOpen(false)}
              className="flex items-center gap-2.5"
            >
              <BrandMark />
              <span className="font-serif-display text-[20px] font-medium text-[#141312] dark:text-[#f6f3ec]">
                {t.brand.name}
              </span>
            </Link>
            <button
              type="button"
              onClick={() => setMobileDrawerOpen(false)}
              aria-label="Close drawer"
              className="grid size-10 place-items-center rounded-full border border-[#ded8ca] dark:border-[#2A332E] bg-[#efebe1] dark:bg-[#151A17] text-[#141312] dark:text-[#f6f3ec] cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          {renderSidebarLinks(false, () => setMobileDrawerOpen(false))}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 min-w-0 flex flex-col">
        {/* Top Navigation Bar */}
        <header className="no-print sticky top-0 z-20 h-16 px-4 sm:px-6 lg:px-8 border-b border-[#ded8ca] dark:border-[#2A332E] bg-[rgb(246_243_236/0.86)] dark:bg-[rgb(16_20_18/0.86)] [backdrop-filter:blur(14px)] flex items-center justify-between gap-4">
          {/* Left: Collapse / Menu + Breadcrumb */}
          <div className="flex items-center gap-2.5 min-w-0">
            <button
              type="button"
              onClick={() => setMobileDrawerOpen(true)}
              aria-label={t.topbar.openMenu}
              className="lg:hidden grid size-9 place-items-center rounded-full border border-[#ded8ca] dark:border-[#2A332E] bg-[#efebe1] dark:bg-[#151A17] text-[#141312] dark:text-[#f6f3ec] cursor-pointer"
            >
              <Menu className="h-4 w-4" />
            </button>

            <button
              type="button"
              onClick={() => setSidebarCollapsed((c) => !c)}
              aria-label={sidebarCollapsed ? t.topbar.expandSidebar : t.topbar.collapseSidebar}
              className="hidden lg:inline-flex size-9 items-center justify-center rounded-full border border-[#ded8ca] dark:border-[#2A332E] bg-[#efebe1] dark:bg-[#151A17] text-[#6e6a62] hover:text-[#141312] hover:border-[#1c5b48] dark:hover:text-[#f6f3ec] cursor-pointer transition-colors"
            >
              {sidebarCollapsed ? (
                <PanelLeftOpen className="h-4 w-4" />
              ) : (
                <PanelLeftClose className="h-4 w-4" />
              )}
            </button>

            <div className="min-w-0 flex items-center gap-2 text-[13px] text-[#6e6a62]">
              <Link to="/" className="font-mono-tech text-[11px] uppercase tracking-[0.08em] hover:text-[#1c5b48] dark:hover:text-[#7CD4B5] hidden sm:inline">
                {t.brand.academy}
              </Link>
              <span className="hidden sm:inline text-[#c2baa8] dark:text-[#2A332E]">/</span>
              <span className="font-serif-display text-[17px] text-[#141312] dark:text-[#f6f3ec] truncate">
                {currentTitle}
              </span>
            </div>
          </div>

          {/* Right Utility Cluster */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            {/* Search Pill Input */}
            <div className="relative hidden md:block w-60 lg:w-72">
              <div className="flex items-center h-9 px-3.5 rounded-full border border-[#ded8ca] dark:border-[#2A332E] bg-[#efebe1] dark:bg-[#151A17] focus-within:border-[#1c5b48] dark:focus-within:border-[#2D7A62] transition-colors">
                <input
                  type="text"
                  value={searchQuery}
                  onFocus={() => setSearchFocused(true)}
                  onBlur={() => setTimeout(() => setSearchFocused(false), 180)}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={t.topbar.searchPlaceholder}
                  className="w-full bg-transparent text-[13px] text-[#141312] dark:text-[#f6f3ec] placeholder:text-[#6e6a62]/70 outline-none pr-2"
                />
                {searchQuery ? (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="text-[#6e6a62] hover:text-[#141312] cursor-pointer shrink-0"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                ) : (
                  <Search className="h-3.5 w-3.5 text-[#6e6a62] shrink-0" />
                )}
              </div>

              {searchFocused && searchQuery.trim().length > 0 && (
                <div className="absolute left-0 right-0 top-11 rounded-2xl bg-[#efebe1] dark:bg-[#151A17] border border-[#ded8ca] dark:border-[#2A332E] shadow-xl p-2 z-40 max-h-96 overflow-y-auto">
                  {!hasSearchMatches ? (
                    <p className="p-3 text-[13px] text-[#6e6a62] text-center">
                      {t.topbar.noSearchResults}
                    </p>
                  ) : (
                    <div className="space-y-2">
                      {searchResults.courses.length > 0 && (
                        <div>
                          <p className="font-mono-tech px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.08em] text-[#6e6a62]">
                            Courses
                          </p>
                          {searchResults.courses.map((c) => (
                            <button
                              key={c.id}
                              type="button"
                              onMouseDown={() => {
                                navigate(`/courses/${c.slug}`);
                                setSearchQuery('');
                              }}
                              className="w-full text-left px-2.5 py-2 rounded-xl hover:bg-[#e4ede7] dark:hover:bg-[#1B3028] flex items-center justify-between gap-2 cursor-pointer"
                            >
                              <span className="text-[13px] font-medium text-[#141312] dark:text-[#f6f3ec] truncate">
                                {pickText(c.title)}
                              </span>
                              <span className="font-mono-tech text-[10px] uppercase text-[#1c5b48] dark:text-[#7CD4B5] shrink-0">
                                Course
                              </span>
                            </button>
                          ))}
                        </div>
                      )}
                      {searchResults.videos.length > 0 && (
                        <div>
                          <p className="font-mono-tech px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.08em] text-[#6e6a62]">
                            Videos
                          </p>
                          {searchResults.videos.map((v) => (
                            <button
                              key={v.id}
                              type="button"
                              onMouseDown={() => {
                                navigate(`/videos/${v.slug}`);
                                setSearchQuery('');
                              }}
                              className="w-full text-left px-2.5 py-2 rounded-xl hover:bg-[#e4ede7] dark:hover:bg-[#1B3028] flex items-center justify-between gap-2 cursor-pointer"
                            >
                              <span className="text-[13px] font-medium text-[#141312] dark:text-[#f6f3ec] truncate">
                                {pickText(v.title)}
                              </span>
                              <span className="font-mono-tech text-[10px] uppercase text-[#1c5b48] dark:text-[#7CD4B5] shrink-0">
                                Video
                              </span>
                            </button>
                          ))}
                        </div>
                      )}
                      {searchResults.paths.length > 0 && (
                        <div>
                          <p className="font-mono-tech px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.08em] text-[#6e6a62]">
                            Learning Paths
                          </p>
                          {searchResults.paths.map((lp) => (
                            <button
                              key={lp.id}
                              type="button"
                              onMouseDown={() => {
                                navigate(`/learning-paths/${lp.slug}`);
                                setSearchQuery('');
                              }}
                              className="w-full text-left px-2.5 py-2 rounded-xl hover:bg-[#e4ede7] dark:hover:bg-[#1B3028] flex items-center justify-between gap-2 cursor-pointer"
                            >
                              <span className="text-[13px] font-medium text-[#141312] dark:text-[#f6f3ec] truncate">
                                {pickText(lp.title)}
                              </span>
                              <span className="font-mono-tech text-[10px] uppercase text-[#1c5b48] dark:text-[#7CD4B5] shrink-0">
                                Path
                              </span>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Language EN / ខ្មែរ */}
            <button
              type="button"
              onClick={toggleLocale}
              aria-label="Switch language"
              className="inline-flex items-center gap-1.5 h-9 px-3 rounded-full border border-[#ded8ca] dark:border-[#2A332E] bg-[#efebe1] dark:bg-[#151A17] font-mono-tech text-[11px] font-semibold uppercase tracking-[0.06em] text-[#141312] dark:text-[#f6f3ec] hover:border-[#1c5b48] cursor-pointer transition-colors"
            >
              <Globe className="h-3.5 w-3.5 text-[#1c5b48] dark:text-[#7CD4B5]" />
              <span>{locale === 'en' ? 'EN' : 'ខ្មែរ'}</span>
            </button>

            {/* Theme Toggle */}
            <button
              type="button"
              onClick={toggleTheme}
              aria-label={t.topbar.toggleTheme}
              className="inline-flex items-center justify-center size-9 rounded-full border border-[#ded8ca] dark:border-[#2A332E] bg-[#efebe1] dark:bg-[#151A17] text-[#6e6a62] hover:text-[#141312] hover:border-[#1c5b48] dark:hover:text-[#f6f3ec] cursor-pointer transition-colors"
            >
              {isDark ? <Sun className="h-4 w-4 text-amber-400" /> : <Moon className="h-4 w-4" />}
            </button>

            {/* Notifications Bell */}
            <div className="relative">
              <button
                type="button"
                onClick={() => {
                  setNotifOpen((o) => !o);
                  setProfileMenuOpen(false);
                }}
                aria-label={t.topbar.notifications}
                className="relative inline-flex items-center justify-center size-9 rounded-full border border-[#ded8ca] dark:border-[#2A332E] bg-[#efebe1] dark:bg-[#151A17] text-[#6e6a62] hover:text-[#141312] hover:border-[#1c5b48] dark:hover:text-[#f6f3ec] cursor-pointer transition-colors"
              >
                <Bell className="h-4 w-4" />
                {unreadNotificationCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-[#1c5b48] dark:bg-[#7CD4B5] ring-2 ring-[#efebe1] dark:ring-[#151A17]" />
                )}
              </button>

              {notifOpen && (
                <div className="absolute right-0 top-11 w-80 sm:w-96 rounded-2xl bg-[#efebe1] dark:bg-[#151A17] border border-[#ded8ca] dark:border-[#2A332E] shadow-2xl z-40 overflow-hidden">
                  <div className="px-4 py-3 border-b border-[#ded8ca] dark:border-[#2A332E] flex items-center justify-between">
                    <span className="font-serif-display text-[16px] font-medium text-[#141312] dark:text-[#f6f3ec]">
                      {t.topbar.notifications}
                    </span>
                    <button
                      type="button"
                      onClick={markAllNotificationsRead}
                      className="font-mono-tech text-[11px] uppercase tracking-[0.06em] font-medium text-[#1c5b48] dark:text-[#7CD4B5] hover:underline cursor-pointer"
                    >
                      {t.topbar.markAllRead}
                    </button>
                  </div>
                  <div className="max-h-80 overflow-y-auto divide-y divide-[#ded8ca] dark:divide-[#2A332E]">
                    {notifications.slice(0, 4).map((n) => (
                      <button
                        key={n.id}
                        type="button"
                        onClick={() => {
                          markNotificationRead(n.id);
                          setNotifOpen(false);
                          if (n.actionUrl) navigate(n.actionUrl);
                        }}
                        className={`w-full text-left px-4 py-3 hover:bg-[#e5dfd2]/55 dark:hover:bg-[#181E1B] transition-colors cursor-pointer ${
                          !n.read ? 'bg-[#e4ede7]/55 dark:bg-[#1B3028]/35' : ''
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <p className="text-[13px] font-semibold text-[#141312] dark:text-[#f6f3ec]">
                            {pickText(n.title)}
                          </p>
                          {!n.read && (
                            <span className="mt-1.5 h-2 w-2 rounded-full bg-[#1c5b48] dark:bg-[#7CD4B5] shrink-0" />
                          )}
                        </div>
                        <p className="text-[12px] text-[#6e6a62] line-clamp-2 mt-0.5">
                          {pickText(n.message)}
                        </p>
                        <p className="font-mono-tech text-[10.5px] text-[#6e6a62] mt-1">{n.createdAt}</p>
                      </button>
                    ))}
                  </div>
                  <Link
                    to="/notifications"
                    onClick={() => setNotifOpen(false)}
                    className="block text-center py-2.5 text-[12.5px] font-semibold text-[#1c5b48] dark:text-[#7CD4B5] bg-[#e5dfd2]/60 dark:bg-[#181E1B] border-t border-[#ded8ca] dark:border-[#2A332E] hover:underline"
                  >
                    {t.topbar.viewAllNotifications}
                  </Link>
                </div>
              )}
            </div>

            {/* User Avatar & Dropdown */}
            <div className="relative pl-0.5">
              <button
                type="button"
                onClick={() => {
                  setProfileMenuOpen((p) => !p);
                  setNotifOpen(false);
                }}
                className="flex items-center gap-2 py-1 pl-1 pr-2.5 rounded-full border border-[#ded8ca] dark:border-[#2A332E] bg-[#efebe1] dark:bg-[#151A17] hover:border-[#1c5b48] transition-colors cursor-pointer"
              >
                {user.avatarUrl ? (
                  <img
                    src={user.avatarUrl}
                    alt={user.fullName}
                    className="h-7 w-7 rounded-full object-cover shrink-0 border border-[#ded8ca] dark:border-[#2A332E]"
                  />
                ) : (
                  <span className="h-7 w-7 rounded-full bg-[#1c5b48] text-white text-[11px] font-bold flex items-center justify-center shrink-0">
                    {initials}
                  </span>
                )}
                <span className="hidden sm:inline text-[13px] font-medium text-[#141312] dark:text-[#f6f3ec] max-w-[120px] truncate">
                  {user.fullName}
                </span>
                <ChevronDown className="hidden sm:inline h-3.5 w-3.5 text-[#6e6a62]" />
              </button>

              {profileMenuOpen && (
                <div className="absolute right-0 top-11 w-64 rounded-2xl bg-[#efebe1] dark:bg-[#151A17] border border-[#ded8ca] dark:border-[#2A332E] shadow-2xl p-2 z-40">
                  <div className="px-3 py-2.5 border-b border-[#ded8ca] dark:border-[#2A332E]">
                    <p className="text-[14px] font-semibold text-[#141312] dark:text-[#f6f3ec] truncate">
                      {user.fullName}
                    </p>
                    <p className="text-[12px] text-[#6e6a62] truncate">{user.email}</p>
                  </div>

                  {/* Quick Demo Plan Switcher */}
                  <div className="px-3 py-2.5 border-b border-[#ded8ca] dark:border-[#2A332E]">
                    <p className="font-mono-tech text-[10px] font-semibold uppercase tracking-[0.08em] text-[#6e6a62] mb-1.5">
                      {t.topbar.demoAccountSwitcher}
                    </p>
                    <div className="grid grid-cols-3 gap-1">
                      {(['free', 'basic', 'premium'] as PlanTier[]).map((tier) => (
                        <button
                          key={tier}
                          type="button"
                          onClick={() => switchDemoPlan(tier)}
                          className={`py-1 rounded-full text-[11px] font-semibold capitalize cursor-pointer transition-colors ${
                            user.activePlan === tier
                              ? 'bg-[#1c5b48] dark:bg-[#2D7A62] text-white'
                              : 'bg-[#e5dfd2] dark:bg-[#181E1B] text-[#6e6a62]'
                          }`}
                        >
                          {tier}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="py-1 space-y-0.5 text-[13px]">
                    <Link
                      to="/profile"
                      onClick={() => setProfileMenuOpen(false)}
                      className="flex items-center gap-2 px-3 py-2 rounded-xl text-[#141312] dark:text-[#f6f3ec] hover:bg-[#e4ede7] dark:hover:bg-[#1B3028]"
                    >
                      <UserIcon className="h-4 w-4 text-[#6e6a62]" />
                      {t.nav.profile}
                    </Link>
                    <Link
                      to="/certifications"
                      onClick={() => setProfileMenuOpen(false)}
                      className="flex items-center gap-2 px-3 py-2 rounded-xl text-[#141312] dark:text-[#f6f3ec] hover:bg-[#e4ede7] dark:hover:bg-[#1B3028]"
                    >
                      <CheckCircle2 className="h-4 w-4 text-[#6e6a62]" />
                      {t.nav.certifications}
                    </Link>
                    <Link
                      to="/membership"
                      onClick={() => setProfileMenuOpen(false)}
                      className="flex items-center gap-2 px-3 py-2 rounded-xl text-[#141312] dark:text-[#f6f3ec] hover:bg-[#e4ede7] dark:hover:bg-[#1B3028]"
                    >
                      <CreditCard className="h-4 w-4 text-[#6e6a62]" />
                      {t.nav.membership}
                    </Link>
                    <Link
                      to="/settings"
                      onClick={() => setProfileMenuOpen(false)}
                      className="flex items-center gap-2 px-3 py-2 rounded-xl text-[#141312] dark:text-[#f6f3ec] hover:bg-[#e4ede7] dark:hover:bg-[#1B3028]"
                    >
                      <Settings className="h-4 w-4 text-[#6e6a62]" />
                      {t.nav.settings}
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Page Body */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 pb-24 lg:pb-10 max-w-[1440px] w-full mx-auto">
          <Outlet />
        </main>

        {/* Mobile Bottom Navigation */}
        <nav
          aria-label="Mobile navigation"
          className="no-print lg:hidden fixed bottom-0 left-0 right-0 z-30 h-16 bg-[#efebe1]/95 dark:bg-[#151A17]/95 [backdrop-filter:blur(14px)] border-t border-[#ded8ca] dark:border-[#2A332E] grid grid-cols-5"
        >
          {[
            { to: '/', label: t.nav.bottom.home, icon: <LayoutDashboard className="h-5 w-5" /> },
            { to: '/explore', label: t.nav.bottom.explore, icon: <Compass className="h-5 w-5" /> },
            { to: '/my-courses', label: t.nav.bottom.courses, icon: <BookOpen className="h-5 w-5" /> },
            { to: '/learning-paths', label: t.nav.bottom.paths, icon: <Map className="h-5 w-5" /> },
            { to: '/profile', label: t.nav.bottom.profile, icon: <UserIcon className="h-5 w-5" /> },
          ].map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              className={({ isActive }) =>
                `flex flex-col items-center justify-center gap-0.5 text-[11px] font-medium transition-colors ${
                  isActive ? 'text-[#1c5b48] dark:text-[#7CD4B5] font-semibold' : 'text-[#6e6a62]'
                }`
              }
            >
              {item.icon}
              <span className="truncate max-w-[64px]">{item.label}</span>
            </NavLink>
          ))}
        </nav>
      </div>
    </div>
  );
};
