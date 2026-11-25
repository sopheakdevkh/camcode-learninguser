import React, { useMemo, useState } from 'react';
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
  GraduationCap,
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
    [t, unreadNotificationCount],
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
            <p className="px-3 mb-1.5 text-[11px] font-semibold uppercase tracking-wider text-[#64748B]">
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
                    collapsed ? 'justify-center px-2' : 'justify-between px-3'
                  } py-2 rounded-[10px] text-[13.5px] font-medium transition-colors ${
                    isActive
                      ? 'bg-[#EFF6FF] dark:bg-blue-950/60 text-[#2563EB] dark:text-blue-300 font-semibold border-l-3 border-[#2563EB]'
                      : 'text-[#334155] dark:text-slate-300 hover:bg-[#F8FAFC] hover:text-[#1D4ED8] dark:hover:bg-slate-800/80 dark:hover:text-white'
                  }`
                }
              >
                <span className="flex items-center gap-2.5 min-w-0">
                  <span className="shrink-0">{item.icon}</span>
                  {!collapsed && <span className="truncate">{item.label}</span>}
                </span>
                {!collapsed && item.badge !== undefined && item.badge > 0 && (
                  <span className="px-2 py-0.5 rounded-full bg-[#2563EB] text-white text-[10.5px] font-bold leading-none">
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
    <div className="min-h-screen flex bg-transparent">
      <div className="bg-environment" />
      <div className="grid-floor" />

      {/* Desktop Sidebar */}
      <aside
        className={`no-print hidden lg:flex flex-col sticky top-0 h-screen shrink-0 border-r border-[#E2E8F0] dark:border-slate-800 bg-white/90 dark:bg-slate-950/90 backdrop-blur-xl transition-all duration-200 z-30 ${
          sidebarCollapsed ? 'w-[76px]' : 'w-[258px]'
        }`}
      >
        {/* Brand Header */}
        <div className="h-16 px-4 flex items-center justify-between border-b border-[#E2E8F0] dark:border-slate-800 shrink-0">
          <Link to="/" className="flex items-center gap-2.5 min-w-0">
            <div className="h-9 w-9 rounded-[10px] bg-gradient-to-br from-[#2563EB] to-[#0891B2] text-white flex items-center justify-center shadow-sm shrink-0">
              <GraduationCap className="h-5 w-5" />
            </div>
            {!sidebarCollapsed && (
              <div className="min-w-0">
                <p className="text-[15px] font-bold text-[#0F172A] dark:text-white leading-tight truncate">
                  {t.brand.name}
                </p>
                <p className="text-[11px] font-medium text-[#2563EB] leading-tight">
                  {t.brand.academy}
                </p>
              </div>
            )}
          </Link>
        </div>

        {renderSidebarLinks(sidebarCollapsed)}

        {/* Sidebar Footer Membership Pill */}
        {!sidebarCollapsed && (
          <div className="p-3 border-t border-[#E2E8F0] dark:border-slate-800">
            <Link
              to="/membership"
              className="flex items-center justify-between p-2.5 rounded-[10px] bg-[#F8FAFC] dark:bg-slate-900 border border-[#E2E8F0] dark:border-slate-800 hover:border-[#2563EB]/40 transition-colors"
            >
              <div>
                <p className="text-[11px] text-[#64748B]">{t.dashboard.membershipTitle}</p>
                <p className="text-[13px] font-semibold text-[#0F172A] capitalize">
                  {user.activePlan} {t.dashboard.planLabel}
                </p>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-[#EFF6FF] dark:bg-blue-950 text-[#2563EB] dark:text-blue-300 text-[11px] font-semibold">
                {user.activePlan === 'premium' ? t.dashboard.fullBadge : t.dashboard.upgradeBadge}
              </span>
            </Link>
          </div>
        )}
      </aside>

      {/* Mobile Navigation Drawer */}
      {mobileDrawerOpen && (
        <div
          className="fixed inset-0 z-50 lg:hidden bg-[#0F172A]/50 backdrop-blur-xs flex"
          onClick={() => setMobileDrawerOpen(false)}
        >
          <div
            className="w-[272px] max-w-[85vw] h-full bg-white dark:bg-slate-950 border-r border-[#E2E8F0] dark:border-slate-800 flex flex-col shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="h-16 px-4 flex items-center justify-between border-b border-[#E2E8F0] dark:border-slate-800">
              <Link
                to="/"
                onClick={() => setMobileDrawerOpen(false)}
                className="flex items-center gap-2.5"
              >
                <div className="h-8 w-8 rounded-[9px] bg-[#2563EB] text-white flex items-center justify-center">
                  <GraduationCap className="h-4.5 w-4.5" />
                </div>
                <span className="font-bold text-[15px] text-[#0F172A]">
                  {t.brand.name} {t.brand.academy}
                </span>
              </Link>
              <button
                type="button"
                onClick={() => setMobileDrawerOpen(false)}
                className="p-1.5 rounded-lg text-[#64748B] hover:bg-[#F1F5F9]"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            {renderSidebarLinks(false, () => setMobileDrawerOpen(false))}
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 min-w-0 flex flex-col">
        {/* Top Navigation Bar */}
        <header className="no-print sticky top-0 z-20 h-16 px-4 sm:px-6 lg:px-8 border-b border-[#E2E8F0]/80 dark:border-slate-800 bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl flex items-center justify-between gap-4">
          {/* Left: Collapse / Menu + Breadcrumb */}
          <div className="flex items-center gap-2.5 min-w-0">
            <button
              type="button"
              onClick={() => setMobileDrawerOpen(true)}
              aria-label={t.topbar.openMenu}
              className="lg:hidden p-2 rounded-[8px] text-[#475569] hover:bg-[#F1F5F9] cursor-pointer"
            >
              <Menu className="h-5 w-5" />
            </button>

            <button
              type="button"
              onClick={() => setSidebarCollapsed((c) => !c)}
              aria-label={sidebarCollapsed ? t.topbar.expandSidebar : t.topbar.collapseSidebar}
              className="hidden lg:inline-flex p-2 rounded-[8px] text-[#64748B] hover:text-[#0F172A] hover:bg-[#F1F5F9] dark:hover:bg-slate-900 cursor-pointer transition-colors"
            >
              {sidebarCollapsed ? (
                <PanelLeftOpen className="h-4.5 w-4.5" />
              ) : (
                <PanelLeftClose className="h-4.5 w-4.5" />
              )}
            </button>

            <div className="min-w-0 flex items-center gap-1.5 text-[13px] text-[#64748B]">
              <Link to="/" className="hover:text-[#2563EB] hidden sm:inline">
                {t.brand.academy}
              </Link>
              <span className="hidden sm:inline text-[#CBD5E1]">/</span>
              <span className="font-semibold text-[14px] sm:text-[15px] text-[#0F172A] truncate">
                {currentTitle}
              </span>
            </div>
          </div>

          {/* Right Utility Cluster: Search + EN/KM + Theme + Bell + Profile */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Search Input (right-aligned icon like reference) */}
            <div className="relative hidden md:block w-60 lg:w-72">
              <div className="flex items-center h-9 px-3 rounded-[9px] border border-[#E2E8F0] dark:border-slate-700 bg-[#F8FAFC] dark:bg-slate-900 focus-within:border-[#2563EB] focus-within:bg-white dark:focus-within:bg-slate-900 transition-colors">
                <input
                  type="text"
                  value={searchQuery}
                  onFocus={() => setSearchFocused(true)}
                  onBlur={() => setTimeout(() => setSearchFocused(false), 180)}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={t.topbar.searchPlaceholder}
                  className="w-full bg-transparent text-[13px] text-[#0F172A] dark:text-slate-100 placeholder:text-[#94A3B8] outline-none pr-2"
                />
                {searchQuery ? (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="text-[#94A3B8] hover:text-[#475569] cursor-pointer shrink-0"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                ) : (
                  <Search className="h-4 w-4 text-[#94A3B8] shrink-0" />
                )}
              </div>

              {searchFocused && searchQuery.trim().length > 0 && (
                <div className="absolute left-0 right-0 top-11 rounded-[12px] bg-white dark:bg-slate-900 border border-[#E2E8F0] dark:border-slate-700 shadow-xl p-2 z-40 max-h-96 overflow-y-auto">
                  {!hasSearchMatches ? (
                    <p className="p-3 text-[13px] text-[#64748B] text-center">
                      {t.topbar.noSearchResults}
                    </p>
                  ) : (
                    <div className="space-y-2">
                      {searchResults.courses.length > 0 && (
                        <div>
                          <p className="px-2.5 py-1 text-[11px] font-semibold uppercase text-[#64748B]">
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
                              className="w-full text-left px-2.5 py-2 rounded-[8px] hover:bg-[#EFF6FF] dark:hover:bg-slate-800 flex items-center justify-between gap-2 cursor-pointer"
                            >
                              <span className="text-[13px] font-medium text-[#0F172A] truncate">
                                {pickText(c.title)}
                              </span>
                              <span className="text-[11px] text-[#2563EB] shrink-0">Course</span>
                            </button>
                          ))}
                        </div>
                      )}
                      {searchResults.videos.length > 0 && (
                        <div>
                          <p className="px-2.5 py-1 text-[11px] font-semibold uppercase text-[#64748B]">
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
                              className="w-full text-left px-2.5 py-2 rounded-[8px] hover:bg-[#EFF6FF] dark:hover:bg-slate-800 flex items-center justify-between gap-2 cursor-pointer"
                            >
                              <span className="text-[13px] font-medium text-[#0F172A] truncate">
                                {pickText(v.title)}
                              </span>
                              <span className="text-[11px] text-[#0891B2] shrink-0">Video</span>
                            </button>
                          ))}
                        </div>
                      )}
                      {searchResults.paths.length > 0 && (
                        <div>
                          <p className="px-2.5 py-1 text-[11px] font-semibold uppercase text-[#64748B]">
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
                              className="w-full text-left px-2.5 py-2 rounded-[8px] hover:bg-[#EFF6FF] dark:hover:bg-slate-800 flex items-center justify-between gap-2 cursor-pointer"
                            >
                              <span className="text-[13px] font-medium text-[#0F172A] truncate">
                                {pickText(lp.title)}
                              </span>
                              <span className="text-[11px] text-[#16A34A] shrink-0">Path</span>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Language EN / KM */}
            <button
              type="button"
              onClick={toggleLocale}
              aria-label="Switch language"
              className="inline-flex items-center gap-1 h-8 px-2.5 rounded-[8px] text-[12px] font-semibold text-[#475569] hover:text-[#2563EB] hover:bg-[#F1F5F9] dark:hover:bg-slate-900 cursor-pointer transition-colors"
            >
              <Globe className="h-3.5 w-3.5 text-[#2563EB]" />
              <span>{locale === 'en' ? 'EN' : 'KM'}</span>
            </button>

            {/* Theme Toggle */}
            <button
              type="button"
              onClick={toggleTheme}
              aria-label={t.topbar.toggleTheme}
              className="inline-flex items-center justify-center h-8 w-8 rounded-[8px] text-[#475569] hover:text-[#2563EB] hover:bg-[#F1F5F9] dark:hover:bg-slate-900 cursor-pointer transition-colors"
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
                className="relative inline-flex items-center justify-center h-8 w-8 rounded-[8px] text-[#475569] hover:text-[#2563EB] hover:bg-[#F1F5F9] dark:hover:bg-slate-900 cursor-pointer transition-colors"
              >
                <Bell className="h-4.5 w-4.5" />
                {unreadNotificationCount > 0 && (
                  <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-rose-500 ring-2 ring-white dark:ring-slate-950" />
                )}
              </button>

              {notifOpen && (
                <div className="absolute right-0 top-11 w-80 sm:w-96 rounded-[14px] bg-white dark:bg-slate-900 border border-[#E2E8F0] dark:border-slate-700 shadow-2xl z-40 overflow-hidden">
                  <div className="px-4 py-3 border-b border-[#E2E8F0] dark:border-slate-800 flex items-center justify-between">
                    <span className="font-semibold text-[14px] text-[#0F172A]">
                      {t.topbar.notifications}
                    </span>
                    <button
                      type="button"
                      onClick={markAllNotificationsRead}
                      className="text-[12px] font-medium text-[#2563EB] hover:underline cursor-pointer"
                    >
                      {t.topbar.markAllRead}
                    </button>
                  </div>
                  <div className="max-h-80 overflow-y-auto divide-y divide-[#E2E8F0]/70 dark:divide-slate-800">
                    {notifications.slice(0, 4).map((n) => (
                      <button
                        key={n.id}
                        type="button"
                        onClick={() => {
                          markNotificationRead(n.id);
                          setNotifOpen(false);
                          if (n.actionUrl) navigate(n.actionUrl);
                        }}
                        className={`w-full text-left px-4 py-3 hover:bg-[#F8FAFC] dark:hover:bg-slate-800/70 transition-colors cursor-pointer ${
                          !n.read ? 'bg-[#EFF6FF]/50 dark:bg-blue-950/20' : ''
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <p className="text-[13px] font-semibold text-[#0F172A]">
                            {pickText(n.title)}
                          </p>
                          {!n.read && <span className="mt-1.5 h-2 w-2 rounded-full bg-[#2563EB] shrink-0" />}
                        </div>
                        <p className="text-[12px] text-[#64748B] line-clamp-2 mt-0.5">
                          {pickText(n.message)}
                        </p>
                        <p className="text-[11px] text-[#94A3B8] mt-1">{n.createdAt}</p>
                      </button>
                    ))}
                  </div>
                  <Link
                    to="/notifications"
                    onClick={() => setNotifOpen(false)}
                    className="block text-center py-2.5 text-[12.5px] font-semibold text-[#2563EB] bg-[#F8FAFC] dark:bg-slate-800/50 border-t border-[#E2E8F0] dark:border-slate-800 hover:underline"
                  >
                    {t.topbar.viewAllNotifications}
                  </Link>
                </div>
              )}
            </div>

            {/* User Avatar & Dropdown (clean avatar + name + chevron) */}
            <div className="relative pl-1">
              <button
                type="button"
                onClick={() => {
                  setProfileMenuOpen((p) => !p);
                  setNotifOpen(false);
                }}
                className="flex items-center gap-2 py-1 px-1.5 rounded-[10px] hover:bg-[#F1F5F9] dark:hover:bg-slate-900 transition-colors cursor-pointer"
              >
                {user.avatarUrl ? (
                  <img
                    src={user.avatarUrl}
                    alt={user.fullName}
                    className="h-8 w-8 rounded-full object-cover shrink-0 border border-[#E2E8F0] dark:border-slate-700 shadow-2xs"
                  />
                ) : (
                  <span
                    className="h-8 w-8 rounded-full text-white text-[12px] font-bold flex items-center justify-center shrink-0 shadow-2xs"
                    style={{ backgroundColor: user.avatarColor }}
                  >
                    {initials}
                  </span>
                )}
                <span className="hidden sm:inline text-[13.5px] font-medium text-[#0F172A] max-w-[130px] truncate">
                  {user.fullName}
                </span>
                <ChevronDown className="hidden sm:inline h-4 w-4 text-[#64748B]" />
              </button>

              {profileMenuOpen && (
                <div className="absolute right-0 top-11 w-64 rounded-[14px] bg-white dark:bg-slate-900 border border-[#E2E8F0] dark:border-slate-700 shadow-2xl p-2 z-40">
                  <div className="px-3 py-2.5 border-b border-[#E2E8F0] dark:border-slate-800">
                    <p className="text-[14px] font-semibold text-[#0F172A] truncate">{user.fullName}</p>
                    <p className="text-[12px] text-[#64748B] truncate">{user.email}</p>
                  </div>

                  {/* Quick Demo Plan Switcher for easy QA testing */}
                  <div className="px-3 py-2 border-b border-[#E2E8F0] dark:border-slate-800">
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-[#64748B] mb-1.5">
                      {t.topbar.demoAccountSwitcher}
                    </p>
                    <div className="grid grid-cols-3 gap-1">
                      {(['free', 'basic', 'premium'] as PlanTier[]).map((tier) => (
                        <button
                          key={tier}
                          type="button"
                          onClick={() => switchDemoPlan(tier)}
                          className={`py-1 rounded-md text-[11px] font-semibold capitalize cursor-pointer ${
                            user.activePlan === tier
                              ? 'bg-[#2563EB] text-white'
                              : 'bg-[#F1F5F9] dark:bg-slate-800 text-[#475569]'
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
                      className="flex items-center gap-2 px-3 py-2 rounded-[8px] text-[#0F172A] hover:bg-[#F8FAFC] dark:hover:bg-slate-800"
                    >
                      <UserIcon className="h-4 w-4 text-[#64748B]" />
                      {t.nav.profile}
                    </Link>
                    <Link
                      to="/certifications"
                      onClick={() => setProfileMenuOpen(false)}
                      className="flex items-center gap-2 px-3 py-2 rounded-[8px] text-[#0F172A] hover:bg-[#F8FAFC] dark:hover:bg-slate-800"
                    >
                      <CheckCircle2 className="h-4 w-4 text-[#64748B]" />
                      {t.nav.certifications}
                    </Link>
                    <Link
                      to="/membership"
                      onClick={() => setProfileMenuOpen(false)}
                      className="flex items-center gap-2 px-3 py-2 rounded-[8px] text-[#0F172A] hover:bg-[#F8FAFC] dark:hover:bg-slate-800"
                    >
                      <CreditCard className="h-4 w-4 text-[#64748B]" />
                      {t.nav.membership}
                    </Link>
                    <Link
                      to="/settings"
                      onClick={() => setProfileMenuOpen(false)}
                      className="flex items-center gap-2 px-3 py-2 rounded-[8px] text-[#0F172A] hover:bg-[#F8FAFC] dark:hover:bg-slate-800"
                    >
                      <Settings className="h-4 w-4 text-[#64748B]" />
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
          className="no-print lg:hidden fixed bottom-0 left-0 right-0 z-30 h-16 bg-white/95 dark:bg-slate-950/95 backdrop-blur-xl border-t border-[#E2E8F0] dark:border-slate-800 grid grid-cols-5"
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
                `flex flex-col items-center justify-center gap-0.5 text-[11px] font-medium ${
                  isActive ? 'text-[#2563EB]' : 'text-[#64748B]'
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

