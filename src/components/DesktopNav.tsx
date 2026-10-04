import { Bell, Home, Clock, User, LogOut, Languages } from "lucide-react";
import { AppLanguage } from "@/lib/appLanguage";
import { Screen } from "@/components/BottomNav";
import { UserProfile } from "@/lib/userProfile";
import { cn } from "@/lib/utils";

interface DesktopNavProps {
  active: Screen;
  onChange: (screen: Screen) => void;
  language?: AppLanguage;
  onToggleLanguage?: () => void;
  userProfile?: UserProfile | null;
  onLogout?: () => void;
  alertsCount?: number;
}

const navLabels: Record<AppLanguage, Record<Screen, string>> = {
  en: {
    home: "Home",
    notifications: "Alerts",
    settings: "Reminders",
    profile: "Profile",
  },
  ta: {
    home: "முகப்பு",
    notifications: "எச்சரிக்கைகள்",
    settings: "நினைவூட்டல்கள்",
    profile: "சுயவிவரம்",
  },
};

const items: { id: Screen; Icon: typeof Home }[] = [
  { id: "home", Icon: Home },
  { id: "notifications", Icon: Bell },
  { id: "settings", Icon: Clock },
  { id: "profile", Icon: User },
];

const DesktopNav = ({
  active,
  onChange,
  language = "en",
  onToggleLanguage,
  userProfile,
  onLogout,
  alertsCount = 0,
}: DesktopNavProps) => {
  const labels = navLabels[language];

  return (
    <header className="hidden md:flex h-16 w-full shrink-0 items-center justify-between border-b border-border/70 bg-card/95 px-6 lg:px-10 backdrop-blur-md z-30 shadow-xs">
      {/* Brand */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => onChange("home")}
          className="flex items-center gap-2.5 text-left focus:outline-none group cursor-pointer"
        >
          <img
            src="/app-icon.png"
            alt="MediMind logo"
            className="h-9 w-9 rounded-xl shadow-xs object-cover transition-transform group-hover:scale-105"
          />
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-extrabold tracking-tight text-foreground">MediMind</span>
              <span className="rounded-full bg-primary-soft px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wide text-primary">
                Smart Care
              </span>
            </div>
            <p className="text-[11px] font-semibold text-muted-foreground hidden lg:block">
              {language === "ta" ? "அறிவார்ந்த மருந்து நினைவூட்டல்" : "Intelligent Medication Reminder"}
            </p>
          </div>
        </button>
      </div>

      {/* Navigation Links */}
      <nav aria-label="Desktop Navigation" className="flex items-center gap-1.5 rounded-2xl bg-muted/70 p-1 border border-border/50">
        {items.map(({ id, Icon }) => {
          const isActive = active === id;
          const label = labels[id];
          return (
            <button
              key={id}
              type="button"
              onClick={() => onChange(id)}
              className={cn(
                "relative flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-bold transition-all cursor-pointer",
                isActive
                  ? "bg-card text-primary shadow-xs"
                  : "text-muted-foreground hover:bg-card/50 hover:text-foreground"
              )}
              aria-current={isActive ? "page" : undefined}
            >
              <Icon className="h-4 w-4" strokeWidth={isActive ? 2.5 : 2} />
              <span>{label}</span>
              {id === "notifications" && alertsCount > 0 && (
                <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-destructive px-1 text-[10px] font-extrabold text-destructive-foreground">
                  {alertsCount}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Actions */}
      <div className="flex items-center gap-2.5">
        {onToggleLanguage && (
          <button
            type="button"
            onClick={onToggleLanguage}
            className="inline-flex h-9 items-center gap-1.5 rounded-xl border border-border/60 bg-secondary/70 px-3 text-xs font-bold text-foreground transition-colors hover:bg-secondary cursor-pointer"
            title="Switch Language"
          >
            <Languages className="h-3.5 w-3.5 text-primary" strokeWidth={2.4} />
            <span>{language === "ta" ? "தமிழ்" : "English"}</span>
          </button>
        )}

        {userProfile && (
          <div
            onClick={() => onChange("profile")}
            className="flex cursor-pointer items-center gap-2 rounded-xl border border-border/60 bg-card px-2.5 py-1.5 shadow-2xs hover:border-primary/40 transition-colors"
            title="View Profile"
          >
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary-soft text-primary font-extrabold text-xs">
              {userProfile.fullName.charAt(0).toUpperCase()}
            </div>
            <div className="text-left hidden lg:block pr-1">
              <p className="text-xs font-bold leading-none text-foreground">{userProfile.fullName}</p>
              <p className="text-[10px] font-semibold text-muted-foreground mt-0.5">{userProfile.patientId}</p>
            </div>
          </div>
        )}

        {onLogout && (
          <button
            type="button"
            onClick={onLogout}
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-border/60 bg-card text-muted-foreground hover:bg-destructive-soft hover:text-destructive hover:border-destructive/30 transition-colors shadow-2xs cursor-pointer"
            title="Sign out"
            aria-label="Sign out"
          >
            <LogOut className="h-4 w-4" strokeWidth={2.2} />
          </button>
        )}
      </div>
    </header>
  );
};

export default DesktopNav;
