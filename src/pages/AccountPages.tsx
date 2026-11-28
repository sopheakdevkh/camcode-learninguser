import React, { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Bell,
  Camera,
  Check,
  ChevronDown,
  ChevronUp,
  Eye,
  EyeOff,
  HelpCircle,
  Lock,
  Mail,
  RotateCcw,
  Send,
  Settings as SettingsIcon,
  Trash2,
  Upload,
  User as UserIcon,
} from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Dropdown } from '@/components/ui/Dropdown';
import { Input } from '@/components/ui/Input';
import { useToast } from '@/components/ui/Toast';
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
          <h1 className="font-serif-display text-[28px] sm:text-[32px] leading-[1.1] tracking-[-0.02em] font-medium text-[#141312] dark:text-[#f6f3ec]">{t.nav.notifications}</h1>
          <p className="text-[14px] text-[#6e6a62] dark:text-[#A3ACA6]">
            Updates about your lessons, assessments, certificates, and billing.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setFilter(filter === 'all' ? 'unread' : 'all')}
            className="px-3 py-1.5 rounded-[8px] border border-[#ded8ca] dark:border-[#2A332E] bg-[#efebe1] dark:bg-[#151A17] text-[13px] font-medium cursor-pointer"
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
          <div className="card-note rounded-[16px] p-10 text-center space-y-2">
            <Bell className="h-9 w-9 text-[#6e6a62] mx-auto" />
            <p className="text-[15px] font-semibold text-[#141312] dark:text-[#f6f3ec]">You are all caught up!</p>
          </div>
        ) : (
          items.map((n) => (
            <div
              key={n.id}
              className={`card-note rounded-[14px] p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                !n.read ? 'border-l-4 border-l-[#2563EB]' : ''
              }`}
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Badge tone={n.type === 'achievement' ? 'success' : n.type === 'assessment' ? 'warning' : 'primary'}>
                    {n.type}
                  </Badge>
                  <span className="text-[12px] text-[#6e6a62]">{n.createdAt}</span>
                </div>
                <h3 className="text-[15px] font-bold text-[#141312] dark:text-[#f6f3ec]">{pickText(n.title)}</h3>
                <p className="text-[13.5px] text-[#4c4842] dark:text-[#D5D1C8]">{pickText(n.message)}</p>
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
  const { toast } = useToast();
  const { user, updateProfile, changePassword } = useLearner();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [fullName, setFullName] = useState(user.fullName);
  const [email, setEmail] = useState(user.email);
  const [phone, setPhone] = useState(user.phone ?? '');
  const [jobTitle, setJobTitle] = useState(user.jobTitle);
  const [organization, setOrganization] = useState(user.organization);
  const [learningGoal, setLearningGoal] = useState(user.learningGoal);
  const [bio, setBio] = useState(user.bio);
  const [avatarUrl, setAvatarUrl] = useState<string | undefined>(user.avatarUrl);

  // Change password state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [showPasswords, setShowPasswords] = useState(false);
  const [pwdLoading, setPwdLoading] = useState(false);

  const hasMinLen = newPassword.length >= 8;
  const hasLetter = /[A-Za-z]/.test(newPassword);
  const hasNumber = /\d/.test(newPassword);

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

    if (!file.type.startsWith('image/')) {
      toast.error(t.profile.invalidImageType);
      return;
    }
    if (file.size > MAX_AVATAR_BYTES) {
      toast.error(t.profile.imageTooLarge);
      return;
    }

    try {
      const processedUrl = await processAvatarFile(file);
      setAvatarUrl(processedUrl);
      updateProfile({ avatarUrl: processedUrl });
      toast.success(t.profile.savedNotice);
    } catch {
      toast.error(t.profile.imageProcessError);
    }
  };

  const handleRemoveAvatar = () => {
    setAvatarUrl(undefined);
    updateProfile({ avatarUrl: undefined });
    toast.info('Profile photo removed.');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({ fullName, email, phone, jobTitle, organization, learningGoal, bio, avatarUrl });
    toast.success(t.profile.savedNotice);
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!currentPassword) {
      toast.error('Please enter your current password.');
      return;
    }
    if (!hasMinLen || !hasLetter || !hasNumber) {
      toast.error('Please meet all new password requirements.');
      return;
    }
    if (newPassword !== confirmNewPassword) {
      toast.error('New passwords do not match.');
      return;
    }

    setPwdLoading(true);
    try {
      await changePassword({ currentPassword, newPassword });
      setCurrentPassword('');
      setNewPassword('');
      setConfirmNewPassword('');
      toast.success(t.auth.resetDoneSuccess);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : t.common.errorGeneric);
    } finally {
      setPwdLoading(false);
    }
  };

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h1 className="font-serif-display text-[28px] sm:text-[32px] leading-[1.1] tracking-[-0.02em] font-medium text-[#141312] dark:text-[#f6f3ec]">{t.nav.profile}</h1>
        <p className="text-[14px] text-[#6e6a62] dark:text-[#A3ACA6]">{t.profile.subtitle}</p>
      </div>

      <form onSubmit={handleSubmit} className="card-note rounded-[18px] p-6 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#ded8ca] dark:border-[#2A332E]">
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
              className="relative group h-16 w-16 rounded-2xl overflow-hidden text-white text-[22px] font-bold flex items-center justify-center shrink-0 cursor-pointer border border-[#ded8ca] dark:border-[#2A332E] shadow-2xs"
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
              <p className="text-[18px] font-bold text-[#141312] dark:text-[#f6f3ec]">{user.fullName}</p>
              <p className="text-[13px] text-[#6e6a62] dark:text-[#A3ACA6]">
                {user.jobTitle} · {user.organization}
              </p>
              <p className="text-[11.5px] text-[#6e6a62] mt-0.5">{t.profile.avatarHint}</p>
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
          <label className="block text-[13px] font-medium text-[#141312] dark:text-[#f6f3ec] mb-1.5">Short Bio</label>
          <textarea
            rows={3}
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            className="w-full rounded-[10px] border border-[#ded8ca] dark:border-[#2A332E] bg-[#efebe1] dark:bg-[#151A17] p-3 text-[14px] text-[#141312] dark:text-[#f6f3ec] outline-none focus:border-[#1c5b48] dark:border-[#7CD4B5]"
          />
        </div>

        <div className="flex justify-end">
          <Button type="submit" leftIcon={<UserIcon className="h-4 w-4" />}>
            {t.common.save}
          </Button>
        </div>
      </form>

      {/* Change Password Card */}
      <form onSubmit={handlePasswordSubmit} className="card-note rounded-[18px] p-6 space-y-5" noValidate>
        <div className="flex items-center justify-between gap-3 pb-4 border-b border-[#ded8ca] dark:border-[#2A332E]">
          <div>
            <h2 className="font-serif-display text-[22px] font-medium text-[#141312] dark:text-[#f6f3ec] flex items-center gap-2">
              <Lock className="h-4.5 w-4.5 text-[#1c5b48] dark:text-[#7CD4B5]" />
              Change Password
            </h2>
            <p className="text-[13px] text-[#6e6a62] dark:text-[#A3ACA6] mt-0.5">
              Update your account password to keep your learner workspace secure.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setShowPasswords((s) => !s)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-[#ded8ca] dark:border-[#2A332E] bg-[#efebe1] dark:bg-[#181E1B] text-[12px] font-medium text-[#4c4842] dark:text-[#D5D1C8] hover:border-[#1c5b48] cursor-pointer transition-colors"
          >
            {showPasswords ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
            <span>{showPasswords ? 'Hide' : 'Show'}</span>
          </button>
        </div>

        <Input
          label="Current Password"
          type={showPasswords ? 'text' : 'password'}
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          autoComplete="current-password"
          required
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="New Password"
            type={showPasswords ? 'text' : 'password'}
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            autoComplete="new-password"
            required
          />
          <Input
            label={t.auth.confirmPassword}
            type={showPasswords ? 'text' : 'password'}
            value={confirmNewPassword}
            onChange={(e) => setConfirmNewPassword(e.target.value)}
            autoComplete="new-password"
            error={
              confirmNewPassword && confirmNewPassword !== newPassword
                ? 'Passwords do not match'
                : undefined
            }
            required
          />
        </div>

        <div className="p-3.5 rounded-[10px] bg-[#e5dfd2]/75 dark:bg-[#181E1B] border border-[#ded8ca] dark:border-[#2A332E] space-y-1">
          <p className="font-mono-tech text-[11px] uppercase tracking-[0.06em] font-semibold text-[#141312] dark:text-[#f6f3ec]">
            {t.auth.passwordReqTitle}
          </p>
          <div className="flex flex-wrap gap-x-4 gap-y-1 text-[12px]">
            <span className={hasMinLen ? 'text-[#1c5b48] dark:text-[#7CD4B5] font-semibold' : 'text-[#6e6a62]'}>
              ✓ {t.auth.reqLength}
            </span>
            <span className={hasLetter ? 'text-[#1c5b48] dark:text-[#7CD4B5] font-semibold' : 'text-[#6e6a62]'}>
              ✓ {t.auth.reqLetter}
            </span>
            <span className={hasNumber ? 'text-[#1c5b48] dark:text-[#7CD4B5] font-semibold' : 'text-[#6e6a62]'}>
              ✓ {t.auth.reqNumber}
            </span>
          </div>
        </div>

        <div className="flex justify-end">
          <Button type="submit" loading={pwdLoading} leftIcon={<Lock className="h-4 w-4" />}>
            {t.auth.updatePasswordBtn}
          </Button>
        </div>
      </form>
    </div>
  );
};

export const SettingsPage: React.FC = () => {
  const { t, locale, setLocale } = useI18n();
  const { theme, setTheme } = useTheme();
  const { toast } = useToast();
  const { settings, updateSettings, resetDemoState } = useLearner();

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h1 className="font-serif-display text-[28px] sm:text-[32px] leading-[1.1] tracking-[-0.02em] font-medium text-[#141312] dark:text-[#f6f3ec]">{t.nav.settings}</h1>
        <p className="text-[14px] text-[#6e6a62] dark:text-[#A3ACA6]">
          Customize language, appearance, video playback, and learning reminders.
        </p>
      </div>

      <div className="card-note rounded-[18px] p-6 space-y-6">
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

        <div className="pt-4 border-t border-[#ded8ca] dark:border-[#2A332E] space-y-3">
          <h2 className="text-[15px] font-bold text-[#141312] dark:text-[#f6f3ec] flex items-center gap-2">
            <SettingsIcon className="h-4 w-4 text-[#1c5b48] dark:text-[#7CD4B5]" />
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
          ].map((item) => {
            const enabled = settings[item.key];
            return (
              <label
                key={item.key}
                className="flex items-center justify-between gap-4 p-3 rounded-[10px] bg-[#f6f3ec] dark:bg-[#151A17] border border-[#ded8ca] dark:border-[#2A332E] hover:border-[#c2baa8] dark:hover:border-[#3E4D45] cursor-pointer transition-colors"
              >
                <span className="text-[14px] text-[#141312] dark:text-[#f6f3ec] select-none">
                  {item.label}
                </span>
                <span className="relative inline-flex items-center shrink-0">
                  <input
                    type="checkbox"
                    role="switch"
                    aria-checked={enabled}
                    checked={enabled}
                    onChange={(e) => updateSettings({ [item.key]: e.target.checked })}
                    className="peer sr-only"
                  />
                  <span
                    className={`h-6 w-11 rounded-full transition-colors duration-200 flex items-center px-0.5 peer-focus-visible:ring-2 peer-focus-visible:ring-[#1c5b48]/40 ${
                      enabled
                        ? 'bg-[#1c5b48] dark:bg-[#2D7A62]'
                        : 'bg-[#c2baa8] dark:bg-[#2A332E]'
                    }`}
                  >
                    <span
                      className={`h-5 w-5 rounded-full bg-[#f6f3ec] shadow-xs transition-transform duration-200 ${
                        enabled ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </span>
                </span>
              </label>
            );
          })}
        </div>

        <div className="pt-4 border-t border-[#ded8ca] dark:border-[#2A332E] flex items-center justify-between gap-4">
          <div>
            <p className="text-[14px] font-semibold text-[#141312] dark:text-[#f6f3ec]">Reset Demo Learning State</p>
            <p className="text-[12.5px] text-[#6e6a62] dark:text-[#A3ACA6]">
              Restore sample enrollments, certificates, and progress.
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              resetDemoState();
              toast.info('Demo learner progress has been restored to default sample data.');
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
  const { toast } = useToast();
  const [openIdx, setOpenIdx] = useState<number | null>(0);
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');

  const faqs = [
    {
      q: 'How do I resume a course from where I left off?',
      a: 'Your lesson progress and last video timestamp are saved automatically. Click "Resume Lesson" on your Dashboard or open any course in My Courses.',
    },
    {
      q: 'How do I earn an official Camcode certificate?',
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
    toast.success('Support ticket received! Our team typically responds within 1 business day.');
    setSubject('');
    setMessage('');
  };

  return (
    <div className="max-w-4xl space-y-8">
      <div>
        <h1 className="font-serif-display text-[28px] sm:text-[32px] leading-[1.1] tracking-[-0.02em] font-medium text-[#141312] dark:text-[#f6f3ec]">{t.nav.help}</h1>
        <p className="text-[14.5px] text-[#4c4842] dark:text-[#D5D1C8] mt-1">
          Find quick answers or send a support request to the Camcode Academy team.
        </p>
      </div>

      <section className="space-y-3">
        <h2 className="text-[18px] font-bold text-[#141312] dark:text-[#f6f3ec] flex items-center gap-2">
          <HelpCircle className="h-5 w-5 text-[#1c5b48] dark:text-[#7CD4B5]" />
          Frequently Asked Questions
        </h2>
        <div className="space-y-2.5">
          {faqs.map((item, idx) => {
            const isOpen = openIdx === idx;
            return (
              <div
                key={idx}
                className="card-note rounded-[14px] overflow-hidden"
              >
                <button
                  type="button"
                  onClick={() => setOpenIdx(isOpen ? null : idx)}
                  className="w-full px-5 py-4 flex items-center justify-between text-left font-semibold text-[14.5px] text-[#141312] dark:text-[#f6f3ec] cursor-pointer"
                >
                  <span>{item.q}</span>
                  {isOpen ? <ChevronUp className="h-4 w-4 shrink-0" /> : <ChevronDown className="h-4 w-4 shrink-0" />}
                </button>
                {isOpen && (
                  <p className="px-5 pb-4 text-[13.5px] text-[#4c4842] dark:text-[#D5D1C8] leading-relaxed">
                    {item.a}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </section>

      <section className="card-note rounded-[18px] p-6 space-y-4">
        <h2 className="text-[18px] font-bold text-[#141312] dark:text-[#f6f3ec] flex items-center gap-2">
          <Mail className="h-5 w-5 text-[#1c5b48] dark:text-[#7CD4B5]" />
          Contact Academy Support
        </h2>
        <form onSubmit={handleSend} className="space-y-4">
          <Input
            label="Subject"
            placeholder="e.g., Question about certificate verification"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            required
          />
          <div>
            <label className="block text-[13px] font-medium text-[#141312] dark:text-[#f6f3ec] mb-1.5">
              How can we help?
            </label>
            <textarea
              rows={4}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Describe your question or course name..."
              required
              className="w-full rounded-[10px] border border-[#ded8ca] dark:border-[#2A332E] bg-[#efebe1] dark:bg-[#151A17] p-3 text-[14px] text-[#141312] dark:text-[#f6f3ec] outline-none focus:border-[#1c5b48] dark:border-[#7CD4B5]"
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

