import React, { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Bell,
  Camera,
  Check,
  ChevronDown,
  ChevronUp,
  HelpCircle,
  Mail,
  RotateCcw,
  Send,
  Settings as SettingsIcon,
  Trash2,
  Upload,
  User as UserIcon,
} from 'lucide-react';
import { Alert } from '@/components/ui/Alert';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Dropdown } from '@/components/ui/Dropdown';
import { Input } from '@/components/ui/Input';
import { useLearner } from '@/context/LearnerContext';
import { useTheme } from '@/context/ThemeContext';
import { useI18n } from '@/i18n/I18nContext';

export const NotificationsPage: React.FC = () => {
  const { t, pickText } = useI18n();
  const { notifications, markNotificationRead, markAllNotificationsRead } = useLearner();
  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  const items = filter === 'unread' ? notifications.filter((n) => !n.read) : notifications;

  return (
    <div className="max-w-3xl space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-[26px] font-bold text-[#0F172A]">{t.nav.notifications}</h1>
          <p className="text-[14px] text-[#64748B]">
            Updates about your lessons, assessments, certificates, and billing.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setFilter(filter === 'all' ? 'unread' : 'all')}
            className="px-3 py-1.5 rounded-[8px] border border-[#E2E8F0] dark:border-slate-700 bg-white dark:bg-slate-900 text-[13px] font-medium cursor-pointer"
          >
            {filter === 'all' ? 'Unread only' : 'Show all'}
          </button>
          <Button size="sm" variant="outline" onClick={markAllNotificationsRead}>
            {t.topbar.markAllRead}
          </Button>
        </div>
      </div>

      <div className="space-y-3">
        {items.length === 0 ? (
          <div className="glass-card rounded-[16px] p-10 text-center space-y-2">
            <Bell className="h-9 w-9 text-[#94A3B8] mx-auto" />
            <p className="text-[15px] font-semibold text-[#0F172A]">You are all caught up!</p>
          </div>
        ) : (
          items.map((n) => (
            <div
              key={n.id}
              className={`glass-card rounded-[14px] p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                !n.read ? 'border-l-4 border-l-[#2563EB]' : ''
              }`}
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Badge tone={n.type === 'achievement' ? 'success' : n.type === 'assessment' ? 'warning' : 'primary'}>
                    {n.type}
                  </Badge>
                  <span className="text-[12px] text-[#94A3B8]">{n.createdAt}</span>
                </div>
                <h3 className="text-[15px] font-bold text-[#0F172A]">{pickText(n.title)}</h3>
                <p className="text-[13.5px] text-[#475569]">{pickText(n.message)}</p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                {!n.read && (
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => markNotificationRead(n.id)}
                    leftIcon={<Check className="h-3.5 w-3.5" />}
                  >
                    Mark read
                  </Button>
                )}
                {n.actionUrl && (
                  <Link to={n.actionUrl} onClick={() => markNotificationRead(n.id)}>
                    <Button size="sm">
                      {n.actionLabel ? pickText(n.actionLabel) : 'Open'}
                    </Button>
                  </Link>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

const MAX_AVATAR_BYTES = 5 * 1024 * 1024;
const AVATAR_OUTPUT_SIZE = 256;

async function processAvatarFile(file: File): Promise<string> {
  const objectUrl = URL.createObjectURL(file);
  try {
    const img = await new Promise<HTMLImageElement>((resolve, reject) => {
      const image = new Image();
      image.onload = () => resolve(image);
      image.onerror = () => reject(new Error('Failed to load image'));
      image.src = objectUrl;
    });

    const side = Math.min(img.naturalWidth || img.width, img.naturalHeight || img.height);
    const sx = Math.max(0, ((img.naturalWidth || img.width) - side) / 2);
    const sy = Math.max(0, ((img.naturalHeight || img.height) - side) / 2);

    const canvas = document.createElement('canvas');
    canvas.width = AVATAR_OUTPUT_SIZE;
    canvas.height = AVATAR_OUTPUT_SIZE;
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Canvas unavailable');

    ctx.drawImage(img, sx, sy, side, side, 0, 0, AVATAR_OUTPUT_SIZE, AVATAR_OUTPUT_SIZE);
    return canvas.toDataURL('image/webp', 0.86);
  } finally {
    URL.revokeObjectURL(objectUrl);
  }
}

export const ProfilePage: React.FC = () => {
  const { t } = useI18n();
  const { user, updateProfile } = useLearner();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [fullName, setFullName] = useState(user.fullName);
  const [email, setEmail] = useState(user.email);
  const [phone, setPhone] = useState(user.phone ?? '');
  const [jobTitle, setJobTitle] = useState(user.jobTitle);
  const [organization, setOrganization] = useState(user.organization);
  const [learningGoal, setLearningGoal] = useState(user.learningGoal);
  const [bio, setBio] = useState(user.bio);
  const [avatarUrl, setAvatarUrl] = useState<string | undefined>(user.avatarUrl);
  const [avatarError, setAvatarError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  const initials = (fullName || user.fullName)
    .split(' ')
    .filter(Boolean)
    .map((p) => p[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;

    setAvatarError(null);
    if (!file.type.startsWith('image/')) {
      setAvatarError(t.profile.invalidImageType);
      return;
    }
    if (file.size > MAX_AVATAR_BYTES) {
      setAvatarError(t.profile.imageTooLarge);
      return;
    }

    try {
      const processedUrl = await processAvatarFile(file);
      setAvatarUrl(processedUrl);
      updateProfile({ avatarUrl: processedUrl });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch {
      setAvatarError(t.profile.imageProcessError);
    }
  };

  const handleRemoveAvatar = () => {
    setAvatarError(null);
    setAvatarUrl(undefined);
    updateProfile({ avatarUrl: undefined });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({ fullName, email, phone, jobTitle, organization, learningGoal, bio, avatarUrl });
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h1 className="text-[26px] font-bold text-[#0F172A]">{t.nav.profile}</h1>
        <p className="text-[14px] text-[#64748B]">{t.profile.subtitle}</p>
      </div>

      {saved && <Alert tone="success">{t.profile.savedNotice}</Alert>}
      {avatarError && <Alert tone="error">{avatarError}</Alert>}

      <form onSubmit={handleSubmit} className="glass-panel rounded-[18px] p-6 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E2E8F0] dark:border-slate-800">
          <div className="flex items-center gap-4">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/png,image/jpeg,image/webp,image/gif"
              onChange={handleAvatarChange}
              className="hidden"
              aria-label={t.profile.uploadPhoto}
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              title={avatarUrl ? t.profile.changePhoto : t.profile.uploadPhoto}
              className="relative group h-16 w-16 rounded-2xl overflow-hidden text-white text-[22px] font-bold flex items-center justify-center shrink-0 cursor-pointer border border-[#E2E8F0] dark:border-slate-700 shadow-2xs"
              style={!avatarUrl ? { backgroundColor: user.avatarColor } : undefined}
            >
              {avatarUrl ? (
                <img
                  src={avatarUrl}
                  alt={fullName || user.fullName}
                  className="h-full w-full object-cover"
                />
              ) : (
                <span>{initials}</span>
              )}
              <span className="absolute inset-0 bg-[#0F172A]/45 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <Camera className="h-5 w-5 text-white" />
              </span>
            </button>
            <div>
              <p className="text-[18px] font-bold text-[#0F172A]">{user.fullName}</p>
              <p className="text-[13px] text-[#64748B]">
                {user.jobTitle} · {user.organization}
              </p>
              <p className="text-[11.5px] text-[#94A3B8] mt-0.5">{t.profile.avatarHint}</p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
              leftIcon={<Upload className="h-3.5 w-3.5" />}
            >
              {avatarUrl ? t.profile.changePhoto : t.profile.uploadPhoto}
            </Button>
            {avatarUrl && (
              <Button
                type="button"
                size="sm"
                variant="ghost"
                onClick={handleRemoveAvatar}
                leftIcon={<Trash2 className="h-3.5 w-3.5" />}
              >
                {t.profile.removePhoto}
              </Button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input label="Full Name (for certificates)" value={fullName} onChange={(e) => setFullName(e.target.value)} required />
          <Input label="Email Address" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <Input label="Phone Number" value={phone} onChange={(e) => setPhone(e.target.value)} />
          <Input label="Role / Job Title" value={jobTitle} onChange={(e) => setJobTitle(e.target.value)} />
          <Input label="Organization / University" value={organization} onChange={(e) => setOrganization(e.target.value)} />
          <Input label="Current Learning Goal" value={learningGoal} onChange={(e) => setLearningGoal(e.target.value)} />
        </div>

        <div>
          <label className="block text-[13px] font-medium text-[#0F172A] mb-1.5">Short Bio</label>
          <textarea
            rows={3}
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            className="w-full rounded-[8px] border border-[#E2E8F0] dark:border-slate-700 bg-white dark:bg-slate-900 p-3 text-[14px] text-[#0F172A] outline-none focus:border-[#2563EB]"
          />
        </div>

        <div className="flex justify-end">
          <Button type="submit" leftIcon={<UserIcon className="h-4 w-4" />}>
            {t.common.save}
          </Button>
        </div>
      </form>
    </div>
  );
};

export const SettingsPage: React.FC = () => {
  const { t, locale, setLocale } = useI18n();
  const { theme, setTheme } = useTheme();
  const { settings, updateSettings, resetDemoState } = useLearner();
  const [resetDone, setResetDone] = useState(false);

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h1 className="text-[26px] font-bold text-[#0F172A]">{t.nav.settings}</h1>
        <p className="text-[14px] text-[#64748B]">
          Customize language, appearance, video playback, and learning reminders.
        </p>
      </div>

      {resetDone && (
        <Alert tone="info">Demo learner progress has been restored to default sample data.</Alert>
      )}

      <div className="glass-panel rounded-[18px] p-6 space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Dropdown<'en' | 'km'>
            fullWidth
            label="Interface Language"
            value={locale}
            onChange={setLocale}
            options={[
              { value: 'en', label: 'English (EN)' },
              { value: 'km', label: 'ភាសាខ្មែរ (KM)' },
            ]}
          />

          <Dropdown<'light' | 'dark'>
            fullWidth
            label="Theme Appearance"
            value={theme}
            onChange={setTheme}
            options={[
              { value: 'light', label: 'Light Academy' },
              { value: 'dark', label: 'Dark Mode' },
            ]}
          />
        </div>

        <div className="pt-4 border-t border-[#E2E8F0] dark:border-slate-800 space-y-3">
          <h2 className="text-[15px] font-bold text-[#0F172A] flex items-center gap-2">
            <SettingsIcon className="h-4 w-4 text-[#2563EB]" />
            Video & Workspace Preferences
          </h2>

          {[
            {
              key: 'autoplayNextLesson' as const,
              label: 'Auto-advance to next lesson when video finishes',
            },
            {
              key: 'captionsEnabled' as const,
              label: 'Enable bilingual captions by default',
            },
            {
              key: 'emailWeeklyDigest' as const,
              label: 'Send weekly study progress summary email',
            },
            {
              key: 'inAppReminders' as const,
              label: 'Show streak & assessment reminders',
            },
          ].map((item) => (
            <label
              key={item.key}
              className="flex items-center justify-between p-3 rounded-[10px] bg-white dark:bg-slate-900 border border-[#E2E8F0] dark:border-slate-800 cursor-pointer"
            >
              <span className="text-[14px] text-[#0F172A]">{item.label}</span>
              <input
                type="checkbox"
                checked={settings[item.key]}
                onChange={(e) => updateSettings({ [item.key]: e.target.checked })}
                className="h-4 w-4 accent-[#2563EB]"
              />
            </label>
          ))}
        </div>

        <div className="pt-4 border-t border-[#E2E8F0] dark:border-slate-800 flex items-center justify-between gap-4">
          <div>
            <p className="text-[14px] font-semibold text-[#0F172A]">Reset Demo Learning State</p>
            <p className="text-[12.5px] text-[#64748B]">
              Restore sample enrollments, certificates, and progress.
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              resetDemoState();
              setResetDone(true);
            }}
            leftIcon={<RotateCcw className="h-4 w-4" />}
          >
            Reset Demo
          </Button>
        </div>
      </div>
    </div>
  );
};

export const HelpSupportPage: React.FC = () => {
  const { t } = useI18n();
  const [openIdx, setOpenIdx] = useState<number | null>(0);
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);

  const faqs = [
    {
      q: 'How do I resume a course from where I left off?',
      a: 'Your lesson progress and last video timestamp are saved automatically. Click "Resume Lesson" on your Dashboard or open any course in My Courses.',
    },
    {
      q: 'How do I earn an official CamcodeLearn certificate?',
      a: 'Complete all lessons inside a certificate-eligible course, or pass a graded Certification Exam in the Assessments tab with the required passing score.',
    },
    {
      q: 'What is the difference between buying a course and subscribing?',
      a: 'Buying an individual course grants lifetime access to that course. A Basic or Premium membership unlocks the subscription video library and included plan courses while active.',
    },
    {
      q: 'Can I switch between English and Khmer anytime?',
      a: 'Yes! Use the EN / KM toggle in the top navigation bar or change your default language in Settings.',
    },
  ];

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim() || !message.trim()) return;
    setSent(true);
    setSubject('');
    setMessage('');
  };

  return (
    <div className="max-w-4xl space-y-8">
      <div>
        <h1 className="text-[26px] font-bold text-[#0F172A]">{t.nav.help}</h1>
        <p className="text-[14.5px] text-[#475569] mt-1">
          Find quick answers or send a support request to the CamcodeLearn Academy team.
        </p>
      </div>

      <section className="space-y-3">
        <h2 className="text-[18px] font-bold text-[#0F172A] flex items-center gap-2">
          <HelpCircle className="h-5 w-5 text-[#2563EB]" />
          Frequently Asked Questions
        </h2>
        <div className="space-y-2.5">
          {faqs.map((item, idx) => {
            const isOpen = openIdx === idx;
            return (
              <div
                key={idx}
                className="glass-card rounded-[14px] overflow-hidden"
              >
                <button
                  type="button"
                  onClick={() => setOpenIdx(isOpen ? null : idx)}
                  className="w-full px-5 py-4 flex items-center justify-between text-left font-semibold text-[14.5px] text-[#0F172A] cursor-pointer"
                >
                  <span>{item.q}</span>
                  {isOpen ? <ChevronUp className="h-4 w-4 shrink-0" /> : <ChevronDown className="h-4 w-4 shrink-0" />}
                </button>
                {isOpen && (
                  <p className="px-5 pb-4 text-[13.5px] text-[#475569] leading-relaxed">
                    {item.a}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </section>

      <section className="glass-panel rounded-[18px] p-6 space-y-4">
        <h2 className="text-[18px] font-bold text-[#0F172A] flex items-center gap-2">
          <Mail className="h-5 w-5 text-[#2563EB]" />
          Contact Academy Support
        </h2>
        {sent && (
          <Alert tone="success">
            Support ticket received! Our team typically responds within 1 business day.
          </Alert>
        )}
        <form onSubmit={handleSend} className="space-y-4">
          <Input
            label="Subject"
            placeholder="e.g., Question about certificate verification"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            required
          />
          <div>
            <label className="block text-[13px] font-medium text-[#0F172A] mb-1.5">
              How can we help?
            </label>
            <textarea
              rows={4}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Describe your question or course name..."
              required
              className="w-full rounded-[8px] border border-[#E2E8F0] dark:border-slate-700 bg-white dark:bg-slate-900 p-3 text-[14px] text-[#0F172A] outline-none focus:border-[#2563EB]"
            />
          </div>
          <Button type="submit" leftIcon={<Send className="h-4 w-4" />}>
            Send Support Message
          </Button>
        </form>
      </section>
    </div>
  );
};

