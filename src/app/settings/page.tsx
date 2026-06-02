"use client";

import { useState, useEffect, useCallback, useRef, memo } from "react";
import { motion } from "framer-motion";
import {
  Camera,
  Bell,
  Moon,
  Sun,
  Shield,
  Trash2,
  Save,
  Loader2,
  CheckCircle2,
  AlertCircle,
  User,
  Mail,
  Lock,
  Palette,
  Type,
  Target,
  Clock,
  Smartphone,
  LogOut,
  Eye,
  EyeOff,
} from "lucide-react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme, type ThemeMode, type ThemeColor, type FontSize } from "@/contexts/ThemeProvider";
import { toast } from "sonner";

// ─── Types ──────────────────────────────────────────────────────────────────

interface PersistedSettings {
  themeMode: ThemeMode;
  themeColor: ThemeColor;
  fontSize: FontSize;
  courseReminders: boolean;
  achievementAlerts: boolean;
  emailNotifications: boolean;
  dailyGoal: number;
  preferredStudyTime: string;
  autoSaveProgress: boolean;
  twoFactorEnabled: boolean;
}

const SETTINGS_STORAGE_KEY = "user-settings-v2";

// ─── Constants ──────────────────────────────────────────────────────────────

const THEME_COLORS: Record<ThemeColor, { gradient: string }> = {
  violet: { gradient: "from-violet to-indigo" },
  blue: { gradient: "from-blue to-cyan" },
  emerald: { gradient: "from-emerald to-teal" },
  orange: { gradient: "from-orange to-amber" },
  rose: { gradient: "from-rose to-pink" },
};

// ─── Static helpers (must be outside component to stay stable) ───────────────

const DEFAULTS: PersistedSettings = {
  themeMode: "dark",
  themeColor: "violet",
  fontSize: "medium",
  courseReminders: true,
  achievementAlerts: true,
  emailNotifications: true,
  dailyGoal: 60,
  preferredStudyTime: "18:00",
  autoSaveProgress: true,
  twoFactorEnabled: false,
};

function loadPersistedSettings(): PersistedSettings {
  if (typeof window === "undefined") return { ...DEFAULTS };
  try {
    const raw = localStorage.getItem(SETTINGS_STORAGE_KEY);
    if (raw) return { ...DEFAULTS, ...JSON.parse(raw) };
  } catch {
    // Corrupt data — fall back to defaults
  }
  return { ...DEFAULTS };
}

function persistSettings(s: PersistedSettings) {
  try {
    localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(s));
  } catch {
    console.warn("[Settings] Failed to write localStorage");
  }
}

// ─── Stable sub-components (memoised to prevent remounts) ────────────────────

const Toggle = memo(function Toggle({
  enabled,
  onChange,
  label,
}: {
  enabled: boolean;
  onChange: () => void;
  label: string;
}) {
  return (
    <button
      role="switch"
      aria-checked={enabled}
      aria-label={label}
      onClick={onChange}
      className={`relative h-6 w-11 rounded-full transition-colors ${
        enabled ? "bg-violet" : "bg-white/10"
      }`}
    >
      <span
        aria-hidden
        className={`absolute left-1 top-1 size-4 rounded-full bg-white transition-transform ${
          enabled ? "translate-x-5" : "translate-x-0"
        }`}
      />
    </button>
  );
});

const SectionCard = memo(function SectionCard({
  title,
  icon,
  children,
  onSave,
  saving,
}: {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  onSave?: () => void;
  saving?: boolean;
}) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="rounded-2xl border border-white/10 bg-white/5 p-4 sm:p-6 backdrop-blur-xl"
    >
      <div className="mb-4 sm:mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="flex items-center gap-2 text-base sm:text-lg font-semibold">{icon}{title}</h2>
        {onSave && (
          <button
            onClick={onSave}
            disabled={saving}
            aria-label={`Save ${title} settings`}
            className="flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl bg-violet px-4 py-2 text-sm font-semibold text-white transition-all hover:bg-violet/90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {saving ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />}
            Save
          </button>
        )}
      </div>
      {children}
    </motion.section>
  );
});

// ─── Main Settings Content ───────────────────────────────────────────────────

function SettingsContent() {
  const { profile, user, updateProfile, signOut } = useAuth();
  const {
    themeMode, themeColor, fontSize,
    setThemeMode, setThemeColor, setFontSize,
    isDark,
  } = useTheme();

  // One-time init flag — prevents re-running the init effect on profile updates
  const initRef = useRef(false);

  // ── Profile fields (synced from auth context, saved via updateProfile) ──
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  // ── Non-theme persisted preferences (localStorage) ──
  const [courseReminders, setCourseReminders] = useState(true);
  const [achievementAlerts, setAchievementAlerts] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [dailyGoal, setDailyGoal] = useState(60);
  const [preferredStudyTime, setPreferredStudyTime] = useState("18:00");
  const [autoSaveProgress, setAutoSaveProgress] = useState(true);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);

  // ── Password change (fully local, never persisted) ──
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  // ── Per-section saving spinners ──
  const [savingAccount, setSavingAccount] = useState(false);
  const [savingAvatar, setSavingAvatar] = useState(false);
  const [savingAppearance, setSavingAppearance] = useState(false);
  const [savingNotifications, setSavingNotifications] = useState(false);
  const [savingLearning, setSavingLearning] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);
  const [savingLogoutAll, setSavingLogoutAll] = useState(false);
  const [savingDeleteAccount, setSavingDeleteAccount] = useState(false);

  const [isInitialized, setIsInitialized] = useState(false);

  // ── Initialise ONCE after auth context is ready ──────────────────────────
  // Depends only on `user` (identity change = login/logout). We read profile
  // inside the effect via the value at call-time — NOT as a dependency — so
  // profile updates from handleSaveAccount do NOT re-run this effect.
  useEffect(() => {
    if (initRef.current) return;
    if (!user) return; // wait until auth resolves
    initRef.current = true;

    const fullName = profile?.full_name || user?.user_metadata?.full_name || "";
    const emailAddr = profile?.email || user?.email || "";
    const avatar = profile?.avatar_url || user?.user_metadata?.avatar_url || null;

    const persisted = loadPersistedSettings();

    setDisplayName(fullName);
    setEmail(emailAddr);
    setAvatarUrl(avatar);

    // Theme settings are managed by ThemeProvider — only load non-theme prefs here
    setCourseReminders(persisted.courseReminders);
    setAchievementAlerts(persisted.achievementAlerts);
    setEmailNotifications(persisted.emailNotifications);
    setDailyGoal(persisted.dailyGoal);
    setPreferredStudyTime(persisted.preferredStudyTime);
    setAutoSaveProgress(persisted.autoSaveProgress);
    setTwoFactorEnabled(persisted.twoFactorEnabled);

    setIsInitialized(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]); // intentionally no `profile` — prevents focus-loss re-runs

  // ── Theme/font-size DOM updates are handled by ThemeProvider ──

  // ── Helper: build PersistedSettings snapshot ────────────────────────────
  const buildPersistedSnapshot = useCallback((): PersistedSettings => ({
    themeMode,
    themeColor,
    fontSize,
    courseReminders,
    achievementAlerts,
    emailNotifications,
    dailyGoal,
    preferredStudyTime,
    autoSaveProgress,
    twoFactorEnabled,
  }), [themeMode, themeColor, fontSize, courseReminders, achievementAlerts, emailNotifications, dailyGoal, preferredStudyTime, autoSaveProgress, twoFactorEnabled]);

  // ── Avatar upload ───────────────────────────────────────────────────────
  const handleAvatarUpload = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) { toast.error("Image must be under 5MB"); return; }
    if (!file.type.startsWith("image/")) { toast.error("Please upload an image file"); return; }

    setSavingAvatar(true);
    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64 = reader.result as string;
      const { error } = await updateProfile({ avatar_url: base64 });
      if (error) { toast.error("Failed to update profile picture"); setSavingAvatar(false); return; }
      setAvatarUrl(base64);
      persistSettings({ ...loadPersistedSettings(), themeMode, themeColor, fontSize, courseReminders, achievementAlerts, emailNotifications, dailyGoal, preferredStudyTime, autoSaveProgress, twoFactorEnabled });
      toast.success("Profile picture updated");
      setSavingAvatar(false);
    };
    reader.onerror = () => { toast.error("Failed to read image"); setSavingAvatar(false); };
    reader.readAsDataURL(file);
  }, [updateProfile, themeMode, themeColor, fontSize, courseReminders, achievementAlerts, emailNotifications, dailyGoal, preferredStudyTime, autoSaveProgress, twoFactorEnabled]);

  // ── Save Account ────────────────────────────────────────────────────────
  const handleSaveAccount = useCallback(async () => {
    if (!displayName.trim()) { toast.error("Display name is required"); return; }
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { toast.error("Invalid email address"); return; }

    setSavingAccount(true);
    try {
      const { error } = await updateProfile({ full_name: displayName.trim(), email, avatar_url: avatarUrl });
      if (error) { toast.error(error.includes("email") ? "Email may already be in use" : error); return; }
      toast.success("Account settings saved");
    } finally {
      setSavingAccount(false);
    }
  }, [displayName, email, avatarUrl, updateProfile]);

  // ── Save Appearance ─────────────────────────────────────────────────────
  // Theme changes are applied instantly by ThemeProvider and auto-persisted.
  // This button is a confirmation that also saves non-theme prefs to localStorage.
  const handleSaveAppearance = useCallback(() => {
    setSavingAppearance(true);
    try {
      // Write current theme values alongside other settings into localStorage
      const snapshot: PersistedSettings = {
        themeMode, themeColor, fontSize,
        courseReminders, achievementAlerts, emailNotifications,
        dailyGoal, preferredStudyTime, autoSaveProgress, twoFactorEnabled,
      };
      persistSettings(snapshot);
      toast.success("Appearance settings saved");
    } finally {
      setSavingAppearance(false);
    }
  }, [themeMode, themeColor, fontSize, courseReminders, achievementAlerts, emailNotifications, dailyGoal, preferredStudyTime, autoSaveProgress, twoFactorEnabled]);

  // ── Save Notifications ──────────────────────────────────────────────────
  const handleSaveNotifications = useCallback(async () => {
    setSavingNotifications(true);
    try {
      persistSettings(buildPersistedSnapshot());
      toast.success("Notification preferences saved");
    } finally {
      setSavingNotifications(false);
    }
  }, [buildPersistedSnapshot]);

  // ── Save Learning ───────────────────────────────────────────────────────
  const handleSaveLearning = useCallback(async () => {
    if (dailyGoal < 0 || dailyGoal > 480) { toast.error("Daily goal must be 0–480 minutes"); return; }
    setSavingLearning(true);
    try {
      persistSettings(buildPersistedSnapshot());
      toast.success("Learning preferences saved");
    } finally {
      setSavingLearning(false);
    }
  }, [buildPersistedSnapshot, dailyGoal]);

  // ── Change Password ─────────────────────────────────────────────────────
  const handleChangePassword = useCallback(async () => {
    if (!currentPassword) { toast.error("Enter your current password"); return; }
    if (!newPassword) { toast.error("Enter a new password"); return; }
    if (newPassword !== confirmPassword) { toast.error("Passwords do not match"); return; }
    if (newPassword.length < 8) { toast.error("Password must be at least 8 characters"); return; }
    if (!/[A-Z]/.test(newPassword) || !/[a-z]/.test(newPassword) || !/\d/.test(newPassword)) {
      toast.error("Password needs uppercase, lowercase, and a number"); return;
    }
    setSavingPassword(true);
    try {
      const { supabase: sb } = await import("@/integrations/supabase/client");
      const { error } = await sb.auth.updateUser({ password: newPassword });
      if (error) throw error;
      toast.success("Password updated");
      setCurrentPassword(""); setNewPassword(""); setConfirmPassword("");
    } catch (err: any) {
      toast.error(err.message || "Failed to update password");
    } finally {
      setSavingPassword(false);
    }
  }, [currentPassword, newPassword, confirmPassword]);

  // ── Logout All Devices ──────────────────────────────────────────────────
  const handleLogoutAll = useCallback(async () => {
    if (!window.confirm("Log out from all devices?")) return;
    setSavingLogoutAll(true);
    try {
      await signOut();
      window.location.href = "/signin";
    } catch (err: any) {
      toast.error(err.message || "Failed to log out");
      setSavingLogoutAll(false);
    }
  }, [signOut]);

  // ── Delete Account ──────────────────────────────────────────────────────
  const handleDeleteAccount = useCallback(async () => {
    if (!window.confirm("⚠️ This cannot be undone. Delete your account?")) return;
    if (!window.confirm("Type OK in the next prompt to confirm.")) return;
    setSavingDeleteAccount(true);
    try {
      await signOut();
      toast.error("Account deletion is disabled in demo mode. Contact support.");
    } finally {
      setSavingDeleteAccount(false);
    }
  }, [signOut]);

  // ── Loading state while auth resolves ──────────────────────────────────
  if (!isInitialized) {
    return (
      <DashboardLayout title="Settings" subtitle="Loading…">
        <div className="flex items-center justify-center py-20">
          <Loader2 className="size-8 animate-spin text-violet" aria-label="Loading settings" />
        </div>
      </DashboardLayout>
    );
  }

  // ─── Render ──────────────────────────────────────────────────────────────
  return (
    <DashboardLayout title="Settings" subtitle="Manage your account and preferences">
      <main className="mx-auto max-w-4xl space-y-4 sm:space-y-6" aria-label="Settings sections">

        {/* ── Account ── */}
        <SectionCard
          title="Account"
          icon={<User className="size-5 text-violet-300" aria-hidden />}
          onSave={handleSaveAccount}
          saving={savingAccount}
        >
          <div className="space-y-6">
            {/* Avatar */}
            <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
              <div className="relative shrink-0">
                <div
                  className={`grid size-24 place-items-center overflow-hidden rounded-full bg-gradient-to-br ${THEME_COLORS[themeColor].gradient} text-3xl font-bold text-white`}
                  aria-label="User avatar"
                >
                  {savingAvatar ? (
                    <Loader2 className="size-8 animate-spin" />
                  ) : avatarUrl ? (
                    <img src={avatarUrl} alt="Profile" className="size-full object-cover" />
                  ) : (
                    (displayName.charAt(0) || "U").toUpperCase()
                  )}
                </div>
                <label
                  className="absolute bottom-0 right-0 cursor-pointer rounded-full bg-violet p-2 ring-2 ring-background transition-colors hover:bg-violet/90"
                  aria-label="Upload profile picture"
                >
                  <Camera className="size-4 text-white" aria-hidden />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarUpload}
                    className="hidden"
                    disabled={savingAvatar}
                    aria-label="Choose image file"
                  />
                </label>
              </div>

              <div className="flex-1 space-y-4">
                {/* Display name — stable controlled input */}
                <div>
                  <label htmlFor="settings-display-name" className="mb-2 block text-sm font-medium text-foreground">
                    Display Name
                  </label>
                  <input
                    id="settings-display-name"
                    type="text"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-violet/50 focus:outline-none focus:ring-2 focus:ring-violet/20"
                    placeholder="Enter your name"
                    autoComplete="name"
                    aria-required="true"
                  />
                </div>

                {/* Email */}
                <div>
                  <label htmlFor="settings-email" className="mb-2 block text-sm font-medium text-foreground">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground pointer-events-none" aria-hidden />
                    <input
                      id="settings-email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full rounded-xl border border-white/10 bg-white/5 pl-10 pr-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-violet/50 focus:outline-none focus:ring-2 focus:ring-violet/20"
                      placeholder="your@email.com"
                      autoComplete="email"
                    />
                  </div>
                  {email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) && (
                    <p className="mt-2 flex items-center gap-1 text-xs text-destructive" role="alert">
                      <AlertCircle className="size-3" aria-hidden />
                      Please enter a valid email address
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Change Password */}
            <fieldset className="space-y-4 border-t border-white/10 pt-4 sm:pt-6">
              <legend className="flex items-center gap-2 text-sm font-semibold text-foreground">
                <Lock className="size-4" aria-hidden />
                Change Password
              </legend>
              <div className="space-y-3">
                <div className="relative">
                  <label htmlFor="settings-current-pw" className="sr-only">Current Password</label>
                  <input
                    id="settings-current-pw"
                    type={showCurrentPassword ? "text" : "password"}
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 pr-10 text-sm text-foreground placeholder:text-muted-foreground focus:border-violet/50 focus:outline-none focus:ring-2 focus:ring-violet/20"
                    placeholder="Current Password"
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    aria-label={showCurrentPassword ? "Hide current password" : "Show current password"}
                  >
                    {showCurrentPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                  </button>
                </div>
                <div className="relative">
                  <label htmlFor="settings-new-pw" className="sr-only">New Password</label>
                  <input
                    id="settings-new-pw"
                    type={showNewPassword ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 pr-10 text-sm text-foreground placeholder:text-muted-foreground focus:border-violet/50 focus:outline-none focus:ring-2 focus:ring-violet/20"
                    placeholder="New Password"
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    aria-label={showNewPassword ? "Hide new password" : "Show new password"}
                  >
                    {showNewPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                  </button>
                </div>
                <div>
                  <label htmlFor="settings-confirm-pw" className="sr-only">Confirm New Password</label>
                  <input
                    id="settings-confirm-pw"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-violet/50 focus:outline-none focus:ring-2 focus:ring-violet/20"
                    placeholder="Confirm New Password"
                    autoComplete="new-password"
                  />
                </div>
                <button
                  onClick={handleChangePassword}
                  disabled={savingPassword}
                  className="w-full rounded-xl bg-white/5 px-4 py-2.5 text-sm font-medium text-foreground hover:bg-white/10 transition-colors disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {savingPassword ? <Loader2 className="mx-auto size-4 animate-spin" /> : "Update Password"}
                </button>
              </div>
            </fieldset>
          </div>
        </SectionCard>

        {/* ── Appearance ── */}
        <SectionCard
          title="Appearance"
          icon={<Palette className="size-5 text-cyan-300" aria-hidden />}
          onSave={handleSaveAppearance}
          saving={savingAppearance}
        >
          <div className="space-y-6">
            {/* Theme Mode */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {isDark ? (
                  <Moon className="size-5 text-violet-300" aria-hidden />
                ) : (
                  <Sun className="size-5 text-amber-300" aria-hidden />
                )}
                <div>
                  <p className="text-sm font-medium text-foreground">Theme Mode</p>
                  <p className="text-xs text-muted-foreground">
                    {isDark ? "Dark mode enabled" : "Light mode enabled"}
                  </p>
                </div>
              </div>
              <Toggle
                enabled={isDark}
                onChange={() => setThemeMode(isDark ? "light" : "dark")}
                label="Toggle dark/light mode"
              />
            </div>

            {/* Theme Color */}
            <div role="radiogroup" aria-label="Theme color">
              <p className="mb-3 text-sm font-medium text-foreground">Theme Color</p>
              <div className="flex flex-wrap gap-3">
                {(Object.keys(THEME_COLORS) as ThemeColor[]).map((color) => (
                  <button
                    key={color}
                    role="radio"
                    aria-checked={themeColor === color}
                    aria-label={`${color} theme`}
                    onClick={() => setThemeColor(color)}
                    className={`size-9 sm:size-10 rounded-full bg-gradient-to-br ${THEME_COLORS[color].gradient} transition-all ${
                      themeColor === color
                        ? "ring-2 ring-white ring-offset-2 ring-offset-background scale-110"
                        : "hover:scale-105 opacity-70"
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Font Size */}
            <div role="radiogroup" aria-label="Font size">
              <p className="mb-3 text-sm font-medium text-foreground">Font Size</p>
              <div className="grid grid-cols-3 gap-2">
                {(["small", "medium", "large"] as FontSize[]).map((size) => (
                  <button
                    key={size}
                    role="radio"
                    aria-checked={fontSize === size}
                    aria-label={`${size} font size`}
                    onClick={() => setFontSize(size)}
                    className={`flex-1 rounded-xl border px-4 py-2.5 text-sm font-medium capitalize transition-all ${
                      fontSize === size
                        ? "border-violet bg-violet/20 text-foreground"
                        : "border-white/10 bg-white/5 text-muted-foreground hover:bg-white/10"
                    }`}
                  >
                    <Type className="mb-1 inline-block size-4" aria-hidden />
                    <br />
                    {size}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </SectionCard>

        {/* ── Notifications ── */}
        <SectionCard
          title="Notifications"
          icon={<Bell className="size-5 text-emerald-300" aria-hidden />}
          onSave={handleSaveNotifications}
          saving={savingNotifications}
        >
          <div className="space-y-4">
            {[
              { label: "Course Reminders", desc: "Get notified about upcoming lessons", value: courseReminders, setter: setCourseReminders },
              { label: "Achievement Alerts", desc: "Celebrations when you earn badges", value: achievementAlerts, setter: setAchievementAlerts },
              { label: "Email Notifications", desc: "Receive updates via email", value: emailNotifications, setter: setEmailNotifications },
            ].map(({ label, desc, value, setter }) => (
              <div key={label} className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-foreground">{label}</p>
                  <p className="text-xs text-muted-foreground">{desc}</p>
                </div>
                <Toggle
                  enabled={value}
                  onChange={() => setter((v) => !v)}
                  label={`Toggle ${label.toLowerCase()}`}
                />
              </div>
            ))}
          </div>
        </SectionCard>

        {/* ── Learning Preferences ── */}
        <SectionCard
          title="Learning Preferences"
          icon={<Target className="size-5 text-orange-300" aria-hidden />}
          onSave={handleSaveLearning}
          saving={savingLearning}
        >
          <div className="space-y-6">
            <div>
              <label htmlFor="settings-daily-goal" className="mb-2 block text-sm font-medium text-foreground">
                Daily Learning Goal (minutes)
              </label>
              <input
                id="settings-daily-goal"
                type="number"
                value={dailyGoal}
                onChange={(e) => setDailyGoal(parseInt(e.target.value) || 0)}
                min={0}
                max={480}
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-foreground focus:border-violet/50 focus:outline-none focus:ring-2 focus:ring-violet/20"
                aria-describedby="daily-goal-hint"
              />
              <p id="daily-goal-hint" className="mt-1 text-xs text-muted-foreground">0–480 minutes per day</p>
            </div>
            <div>
              <label htmlFor="settings-study-time" className="mb-2 flex items-center gap-2 text-sm font-medium text-foreground">
                <Clock className="size-4" aria-hidden />
                Preferred Study Time
              </label>
              <input
                id="settings-study-time"
                type="time"
                value={preferredStudyTime}
                onChange={(e) => setPreferredStudyTime(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-foreground focus:border-violet/50 focus:outline-none focus:ring-2 focus:ring-violet/20"
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-foreground">Auto-Save Progress</p>
                <p className="text-xs text-muted-foreground">Automatically save your learning progress</p>
              </div>
              <Toggle
                enabled={autoSaveProgress}
                onChange={() => setAutoSaveProgress((v) => !v)}
                label="Toggle auto-save progress"
              />
            </div>
          </div>
        </SectionCard>

        {/* ── Privacy & Security ── */}
        <SectionCard
          title="Privacy &amp; Security"
          icon={<Shield className="size-5 text-rose-300" aria-hidden />}
        >
          <div className="space-y-6">
            {/* 2FA */}
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-foreground">Two-Factor Authentication</p>
                <p className="text-xs text-muted-foreground">
                  {twoFactorEnabled ? "2FA is enabled — your account is more secure" : "Add an extra layer of security"}
                </p>
              </div>
              <Toggle
                enabled={twoFactorEnabled}
                onChange={() => {
                  const next = !twoFactorEnabled;
                  if (next) {
                    if (window.confirm("Enable 2FA? You'll need an authenticator app.")) {
                      setTwoFactorEnabled(true);
                      persistSettings({ ...loadPersistedSettings(), twoFactorEnabled: true });
                      toast.success("2FA enabled");
                    }
                  } else {
                    if (window.confirm("Disable 2FA? Your account will be less secure.")) {
                      setTwoFactorEnabled(false);
                      persistSettings({ ...loadPersistedSettings(), twoFactorEnabled: false });
                      toast.info("2FA disabled");
                    }
                  }
                }}
                label="Toggle two-factor authentication"
              />
            </div>

            {/* Active Session */}
            <div className="border-t border-white/10 pt-4 sm:pt-6">
              <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-foreground">
                <Smartphone className="size-4" aria-hidden />
                Active Sessions
              </h3>
              <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-foreground">Current Session</p>
                    <p className="text-xs text-muted-foreground">This device • Active now</p>
                  </div>
                  <CheckCircle2 className="size-4 text-emerald-300" aria-hidden />
                </div>
              </div>
            </div>

            {/* Logout All */}
            <button
              onClick={handleLogoutAll}
              disabled={savingLogoutAll}
              className="flex w-full items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-medium text-foreground hover:bg-white/10 transition-colors disabled:cursor-not-allowed disabled:opacity-50"
              aria-label="Log out from all devices"
            >
              {savingLogoutAll ? <Loader2 className="size-4 animate-spin" /> : <LogOut className="size-4" aria-hidden />}
              Logout from All Devices
            </button>

            {/* Danger Zone */}
            <div className="border-t border-white/10 pt-4 sm:pt-6">
              <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-destructive">
                <Trash2 className="size-4" aria-hidden />
                Danger Zone
              </h3>
              <button
                onClick={handleDeleteAccount}
                disabled={savingDeleteAccount}
                className="w-full rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-2.5 text-sm font-medium text-destructive hover:bg-destructive/20 transition-colors disabled:cursor-not-allowed disabled:opacity-50"
                aria-label="Permanently delete account"
              >
                {savingDeleteAccount ? <Loader2 className="mx-auto size-4 animate-spin" /> : "Delete Account"}
              </button>
              <p className="mt-2 text-xs text-muted-foreground">
                Once deleted, your account and all data cannot be recovered.
              </p>
            </div>
          </div>
        </SectionCard>
      </main>
    </DashboardLayout>
  );
}

export default function SettingsPage() {
  return (
    <ProtectedRoute>
      <SettingsContent />
    </ProtectedRoute>
  );
}
