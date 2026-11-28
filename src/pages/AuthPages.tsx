import React, { useState } from 'react';
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowLeft, ArrowUpRight, Eye, EyeOff } from 'lucide-react';
import { Alert } from '@/components/ui/Alert';
import { Button } from '@/components/ui/Button';
import { Dropdown } from '@/components/ui/Dropdown';
import { Input } from '@/components/ui/Input';
import { useToast } from '@/components/ui/Toast';
import { DEMO_LEARNER_ACCOUNTS, useLearner } from '@/context/LearnerContext';
import { useI18n } from '@/i18n/I18nContext';
import { API_CONFIG } from '@/services/apiClient';
import type { Locale } from '@/types';

const AuthBrandMark: React.FC = () => (
  <span
    className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-[#1c5b48] dark:bg-[#2D7A62] text-white shrink-0 shadow-xs"
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

const AuthSplitShell: React.FC<{
  title: string;
  subtitle: string;
  imageSrc?: string;
  children: React.ReactNode;
}> = ({ title, subtitle, imageSrc = '/auth-panel.jpg', children }) => {
  const { t } = useI18n();

  return (
    <div className="min-h-screen bg-[#f6f3ec] dark:bg-[#101412] text-[#141312] dark:text-[#f6f3ec] flex items-center justify-center px-4 sm:px-6 py-8 md:py-12 relative">
      <div className="bg-environment" />
      <div className="grid-floor" />

      <div className="relative z-10 w-full max-w-5xl space-y-5">
        <a
          href={API_CONFIG.publicWebUrl}
          className="font-mono-tech inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.08em] font-semibold text-[#6e6a62] hover:text-[#1c5b48] dark:hover:text-[#7CD4B5] transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>{t.auth.backToSite}</span>
        </a>

        <div className="card-note overflow-hidden grid grid-cols-1 lg:grid-cols-12 shadow-[0_24px_60px_-24px_rgba(23,28,25,0.16)]">
          {/* Desktop Full-Bleed Image Column */}
          <div className="hidden lg:block lg:col-span-5 relative min-h-[480px] bg-[#202924]">
            <img
              src={imageSrc}
              alt={t.brand.name}
              className="absolute inset-0 h-full w-full object-cover object-center"
            />
          </div>

          {/* Form Column */}
          <div className="lg:col-span-7 p-6 sm:p-10">
            <a
              href={API_CONFIG.publicWebUrl}
              className="inline-flex items-center gap-2.5 mb-8 w-fit hover:opacity-90"
            >
              <AuthBrandMark />
              <span className="font-serif-display text-[21px] font-medium tracking-[-0.02em] text-[#141312] dark:text-[#f6f3ec]">
                {t.brand.name}
              </span>
            </a>

            <h1 className="font-serif-display text-[28px] sm:text-[34px] leading-[1.1] tracking-[-0.02em] font-normal text-[#141312] dark:text-[#f6f3ec]">
              {title}
            </h1>
            <p className="text-[14.5px] text-[#6e6a62] dark:text-[#A3ACA6] mt-1.5 mb-7">{subtitle}</p>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export const LoginPage: React.FC = () => {
  const { t } = useI18n();
  const { login } = useLearner();
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();

  const rawRedirect =
    (location.state as { from?: string } | null)?.from || searchParams.get('redirect') || '/';
  const intendedTo =
    rawRedirect.startsWith('/login') || rawRedirect.startsWith('/register') ? '/' : rawRedirect;

  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifier.trim()) {
      toast.error('Please enter your email or phone number.');
      return;
    }
    if (password.length < 6) {
      toast.error('Password must be at least 6 characters.');
      return;
    }

    setLoading(true);
    try {
      await login({ identifier, password, rememberMe });
      toast.success('Signed in successfully.');
      navigate(intendedTo, { replace: true });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : t.common.errorGeneric);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthSplitShell title={t.auth.loginTitle} subtitle={t.auth.loginSubtitle}>
      <form onSubmit={handleSubmit} className="space-y-4" noValidate>

        <Input
          label={t.auth.emailOrPhone}
          placeholder={t.auth.emailOrPhonePlaceholder}
          value={identifier}
          onChange={(e) => setIdentifier(e.target.value)}
          autoComplete="username"
        />

        <Input
          label={t.auth.password}
          type={showPassword ? 'text' : 'password'}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="current-password"
          rightAddon={
            <button
              type="button"
              onClick={() => setShowPassword((s) => !s)}
              aria-label="Toggle password visibility"
              className="p-1 text-[#6e6a62] hover:text-[#141312] dark:hover:text-[#f6f3ec] cursor-pointer"
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          }
        />

        <div className="flex items-center justify-between gap-2 text-[13px]">
          <label className="inline-flex items-center gap-2 text-[#6e6a62] cursor-pointer">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="accent-[#1c5b48]"
            />
            <span>{t.auth.rememberMe}</span>
          </label>
          <Link
            to="/forgot-password"
            className="font-semibold text-[#141312] dark:text-[#f6f3ec] hover:text-[#1c5b48] dark:hover:text-[#7CD4B5]"
          >
            {t.auth.forgotPasswordLink}
          </Link>
        </div>

        <Button
          type="submit"
          fullWidth
          size="lg"
          loading={loading}
          rightIcon={<ArrowUpRight className="h-4 w-4" />}
        >
          {t.auth.signInBtn}
        </Button>

        {/* Demo Tier Accounts */}
        <div className="p-3.5 rounded-[10px] bg-[#efebe1]/70 dark:bg-[#181E1B] border border-[#ded8ca] dark:border-[#2A332E] space-y-2.5">
          <p className="font-mono-tech text-[10.5px] uppercase tracking-[0.08em] font-semibold text-[#6e6a62] dark:text-[#A3ACA6]">
            Demo Accounts (Password: Learner@2026)
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {DEMO_LEARNER_ACCOUNTS.map((acc) => (
              <button
                key={acc.tier}
                type="button"
                onClick={() => {
                  setIdentifier(acc.email);
                  setPassword(acc.password);
                }}
                className={`text-left px-3 py-2 rounded-[10px] border transition-colors cursor-pointer ${
                  identifier.toLowerCase() === acc.email.toLowerCase()
                    ? 'border-[#1c5b48] bg-[#e4ede7] dark:bg-[#1B3028] dark:border-[#7CD4B5]'
                    : 'border-[#ded8ca] dark:border-[#2A332E] bg-[#f6f3ec] dark:bg-[#151A17] hover:border-[#1c5b48] dark:hover:border-[#7CD4B5]'
                }`}
              >
                <p className="text-[12px] font-semibold text-[#141312] dark:text-[#f6f3ec]">
                  {acc.label}
                </p>
                <p className="font-mono-tech text-[10.5px] text-[#6e6a62] dark:text-[#A3ACA6] truncate">
                  {acc.email}
                </p>
              </button>
            ))}
          </div>
        </div>

        <p className="text-[14px] text-[#6e6a62] text-center pt-2">
          {t.auth.noAccount}{' '}
          <Link
            to="/register"
            state={{ from: intendedTo }}
            className="font-bold text-[#1c5b48] dark:text-[#7CD4B5] underline underline-offset-4"
          >
            {t.nav.signUp}
          </Link>
        </p>

        <div className="pt-2 flex justify-center">
          <div className="inline-flex items-center gap-2.5 px-3 py-1.5 rounded-full border border-[#ded8ca] dark:border-[#2A332E] bg-[#efebe1]/75 dark:bg-[#181E1B]">
            <div className="flex items-center gap-1.5 shrink-0">
              <div className="relative group/avatar1 shrink-0 cursor-pointer">
                <img
                  src="/creator-avatar.jpg"
                  alt="Sopheak Khoeun"
                  className="h-8 w-8 rounded-full object-cover object-[50%_22%] ring-1 ring-[#1c5b48]/25 dark:ring-[#7CD4B5]/30 transition-transform duration-200 group-hover/avatar1:scale-105"
                />
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute bottom-full left-0 sm:left-1/2 sm:-translate-x-1/2 mb-3 z-50 w-44 sm:w-48 p-1.5 rounded-[14px] bg-[#f6f3ec] dark:bg-[#151A17] border border-[#ded8ca] dark:border-[#2A332E] shadow-[0_18px_40px_-14px_rgba(20,19,18,0.28)] opacity-0 scale-95 translate-y-1.5 group-hover/avatar1:opacity-100 group-hover/avatar1:scale-100 group-hover/avatar1:translate-y-0 transition-all duration-200 ease-out"
                >
                  <img
                    src="/creator-avatar.jpg"
                    alt=""
                    className="w-full h-56 rounded-[10px] object-cover object-[50%_20%]"
                  />
                  <div className="px-1.5 pt-1.5 pb-0.5">
                    <p className="font-mono-tech text-[9.5px] uppercase tracking-[0.08em] text-[#6e6a62] dark:text-[#A3ACA6] leading-none">
                      Powered by
                    </p>
                    <p className="text-[12.5px] font-semibold text-[#141312] dark:text-[#f6f3ec] leading-tight mt-0.5">
                      Sopheak Khoeun
                    </p>
                  </div>
                </div>
              </div>

              <div className="relative group/avatar2 shrink-0 cursor-pointer">
                <div className="h-8 w-8 rounded-full overflow-hidden ring-1 ring-[#1c5b48]/25 dark:ring-[#7CD4B5]/30 transition-transform duration-200 group-hover/avatar2:scale-105">
                  <img
                    src="/creator-avatar-studio.jpg"
                    alt="Sokheng Hun"
                    className="h-full w-full object-cover scale-[1.04]"
                  />
                </div>
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute bottom-full left-0 sm:left-1/2 sm:-translate-x-1/2 mb-3 z-50 w-48 sm:w-52 p-2.5 rounded-[14px] bg-[#f6f3ec] dark:bg-[#151A17] border border-[#ded8ca] dark:border-[#2A332E] shadow-[0_18px_40px_-14px_rgba(20,19,18,0.28)] opacity-0 scale-95 translate-y-1.5 group-hover/avatar2:opacity-100 group-hover/avatar2:scale-100 group-hover/avatar2:translate-y-0 transition-all duration-200 ease-out"
                >
                  <div className="w-full aspect-square rounded-full overflow-hidden ring-1 ring-[#ded8ca] dark:ring-[#2A332E]">
                    <img
                      src="/creator-avatar-studio.jpg"
                      alt=""
                      className="w-full h-full object-cover scale-[1.03]"
                    />
                  </div>
                  <div className="px-1 pt-2 pb-0.5 text-center">
                    <p className="font-mono-tech text-[9.5px] uppercase tracking-[0.08em] text-[#6e6a62] dark:text-[#A3ACA6] leading-none">
                      Powered by
                    </p>
                    <p className="text-[12.5px] font-semibold text-[#141312] dark:text-[#f6f3ec] leading-tight mt-0.5">
                      Sokheng Hun
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="text-left pr-1">
              <p className="font-mono-tech text-[9.5px] uppercase tracking-[0.08em] text-[#6e6a62] dark:text-[#A3ACA6] leading-none">
                Powered by
              </p>
              <p className="text-[12.5px] font-semibold text-[#141312] dark:text-[#f6f3ec] leading-tight mt-0.5">
                Sopheak Khoeun &amp; Sokheng Hun
              </p>
            </div>
          </div>
        </div>
      </form>
    </AuthSplitShell>
  );
};

export const RegisterPage: React.FC = () => {
  const { t, locale, setLocale } = useI18n();
  const { register } = useLearner();
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const rawRedirect = (location.state as { from?: string } | null)?.from || '/';
  const intendedTo =
    rawRedirect.startsWith('/login') || rawRedirect.startsWith('/register') ? '/' : rawRedirect;

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [preferredLanguage, setPreferredLanguage] = useState<Locale>(locale);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const hasMinLen = password.length >= 8;
  const hasLetter = /[A-Za-z]/.test(password);
  const hasNumber = /\d/.test(password);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!fullName.trim()) {
      toast.error('Full name is required.');
      return;
    }
    if (!/^\S+@\S+\.\S+$/.test(email.trim())) {
      toast.error('Please enter a valid email address.');
      return;
    }
    if (!hasMinLen || !hasLetter || !hasNumber) {
      toast.error('Please meet all password requirements.');
      return;
    }
    if (password !== confirmPassword) {
      toast.error('Passwords do not match.');
      return;
    }
    if (!acceptTerms) {
      toast.error('Please accept the Terms of Service and Privacy Policy.');
      return;
    }

    setLoading(true);
    try {
      await register({
        fullName,
        email,
        phone,
        password,
        preferredLanguage,
      });
      setLocale(preferredLanguage);
      toast.success('Account created successfully.');
      navigate(intendedTo, { replace: true });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : t.common.errorGeneric);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthSplitShell
      title={t.auth.registerTitle}
      subtitle={t.auth.registerSubtitle}
      imageSrc="/register-panel.jpg"
    >
      <form onSubmit={handleSubmit} className="space-y-4" noValidate>

        <Input
          label={t.auth.fullName}
          placeholder={t.auth.fullNamePlaceholder}
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          autoComplete="name"
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label={t.auth.email}
            type="email"
            placeholder={t.auth.emailPlaceholder}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
          />
          <Input
            label={t.auth.phone}
            type="tel"
            placeholder={t.auth.phonePlaceholder}
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            autoComplete="tel"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label={t.auth.password}
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="new-password"
            rightAddon={
              <button
                type="button"
                onClick={() => setShowPassword((s) => !s)}
                aria-label="Toggle password visibility"
                className="p-1 text-[#6e6a62] hover:text-[#141312] dark:hover:text-[#f6f3ec] cursor-pointer"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            }
          />
          <Input
            label={t.auth.confirmPassword}
            type={showPassword ? 'text' : 'password'}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            autoComplete="new-password"
            error={
              confirmPassword && confirmPassword !== password ? 'Passwords do not match' : undefined
            }
          />
        </div>

        {/* Password requirements checklist */}
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

        <Dropdown
          label={t.auth.preferredLanguage}
          fullWidth
          size="lg"
          value={preferredLanguage}
          onChange={(next) => setPreferredLanguage(next as Locale)}
          options={[
            { value: 'en', label: `${t.common.english} (EN)` },
            { value: 'km', label: `${t.common.khmer} (ខ្មែរ)` },
          ]}
        />

        <label className="flex items-start gap-2.5 text-[13px] text-[#6e6a62] cursor-pointer">
          <input
            type="checkbox"
            checked={acceptTerms}
            onChange={(e) => setAcceptTerms(e.target.checked)}
            className="mt-0.5 accent-[#1c5b48]"
          />
          <span>
            {t.auth.acceptTermsPrefix}{' '}
            <a
              href={`${API_CONFIG.publicWebUrl}/terms`}
              className="font-semibold text-[#141312] dark:text-[#f6f3ec] underline"
            >
              {t.auth.termsLink}
            </a>{' '}
            {t.auth.andWord}{' '}
            <a
              href={`${API_CONFIG.publicWebUrl}/privacy`}
              className="font-semibold text-[#141312] dark:text-[#f6f3ec] underline"
            >
              {t.auth.privacyLink}
            </a>
            .
          </span>
        </label>

        <Button
          type="submit"
          fullWidth
          size="lg"
          loading={loading}
          rightIcon={<ArrowUpRight className="h-4 w-4" />}
        >
          {t.auth.createAccountBtn}
        </Button>

        <p className="text-[14px] text-[#6e6a62] text-center pt-2">
          {t.auth.haveAccount}{' '}
          <Link
            to="/login"
            className="font-bold text-[#1c5b48] dark:text-[#7CD4B5] underline underline-offset-4"
          >
            {t.nav.login}
          </Link>
        </p>
      </form>
    </AuthSplitShell>
  );
};

export const ForgotPasswordPage: React.FC = () => {
  const { t } = useI18n();
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!/^\S+@\S+\.\S+$/.test(email.trim())) {
      toast.error('Please enter a valid email address.');
      return;
    }
    setLoading(true);
    await new Promise((r) => setTimeout(r, 250));
    setLoading(false);
    setSent(true);
    toast.success(t.auth.resetSentSuccess);
  };

  return (
    <AuthSplitShell title={t.auth.forgotTitle} subtitle={t.auth.forgotSubtitle}>
      <form onSubmit={handleSubmit} className="space-y-4">
        {sent && (
          <Alert tone="success">
            <p>{t.auth.resetSentSuccess}</p>
            <Link
              to="/reset-password?token=demo-token"
              className="inline-block mt-2 font-semibold underline"
            >
              {t.auth.openResetDemo}
            </Link>
          </Alert>
        )}

        <Input
          label={t.auth.email}
          type="email"
          placeholder={t.auth.emailPlaceholder}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <Button
          type="submit"
          fullWidth
          size="lg"
          loading={loading}
          rightIcon={<ArrowUpRight className="h-4 w-4" />}
        >
          {t.auth.sendResetLinkBtn}
        </Button>

        <div className="text-center pt-2">
          <Link
            to="/login"
            className="text-[14px] font-semibold text-[#1c5b48] dark:text-[#7CD4B5] underline"
          >
            {t.auth.backToLogin}
          </Link>
        </div>
      </form>
    </AuthSplitShell>
  );
};

export const ResetPasswordPage: React.FC = () => {
  const { t } = useI18n();
  const { toast } = useToast();
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 8) {
      toast.error('Password must be at least 8 characters.');
      return;
    }
    if (password !== confirm) {
      toast.error('Passwords do not match.');
      return;
    }
    setLoading(true);
    await new Promise((r) => setTimeout(r, 250));
    setLoading(false);
    setDone(true);
    toast.success(t.auth.resetDoneSuccess);
  };

  return (
    <AuthSplitShell title={t.auth.resetTitle} subtitle={t.auth.resetSubtitle}>
      <form onSubmit={handleSubmit} className="space-y-4">
        {done && (
          <Alert tone="success">
            <p>{t.auth.resetDoneSuccess}</p>
            <Link to="/login" className="inline-block mt-2 font-semibold underline">
              {t.nav.login}
            </Link>
          </Alert>
        )}

        <Input
          label={t.auth.password}
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Input
          label={t.auth.confirmPassword}
          type="password"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
        />

        <Button
          type="submit"
          fullWidth
          size="lg"
          loading={loading}
          rightIcon={<ArrowUpRight className="h-4 w-4" />}
        >
          {t.auth.updatePasswordBtn}
        </Button>
      </form>
    </AuthSplitShell>
  );
};

