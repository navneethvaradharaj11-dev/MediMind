import { useState } from "react";
import { AlertCircle, BellRing, CalendarX, CheckCircle2, Package, Filter, Check, Volume2, ShieldCheck, Sparkles } from "lucide-react";
import ScreenHeader from "@/components/ScreenHeader";
import { AlertType } from "@/data/medicine";
import { AppLanguage } from "@/lib/appLanguage";
import {
  AppNotification,
  getNotificationTimeline,
  groupNotifications,
  loadAppNotifications,
} from "@/lib/appNotifications";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const config: Record<AlertType, { Icon: typeof CheckCircle2; classes: string; iconBg: string; label: string }> = {
  reminder: { Icon: BellRing, classes: "text-primary", iconBg: "bg-primary-soft", label: "Reminder" },
  success: { Icon: CheckCircle2, classes: "text-success", iconBg: "bg-success-soft", label: "Success" },
  missed: { Icon: AlertCircle, classes: "text-destructive", iconBg: "bg-destructive-soft", label: "Missed" },
  stock: { Icon: Package, classes: "text-warning", iconBg: "bg-warning-soft", label: "Stock" },
  expired: { Icon: CalendarX, classes: "text-destructive", iconBg: "bg-destructive-soft", label: "Expired" },
};

const tamilLabels = {
  title: "எச்சரிக்கைகள்",
  subtitle: "சமீபத்திய எச்சரிக்கைகள்",
  urgent: "கவனம்",
  emptyTitle: "எச்சரிக்கைகள் இல்லை",
  emptyBody: "மருந்து மற்றும் இருப்பு நிகழ்வுகள் இங்கே தோன்றும்.",
  all: "அனைத்தும்",
  filterBy: "வடிகட்டுதல்",
  markAllRead: "அனைத்தையும் படித்ததாகக் குறிக்கவும்",
  allMarked: "அனைத்து எச்சரிக்கைகளும் சரிபார்க்கப்பட்டன",
  systemStatus: "அறிவிப்பு நிலை",
};

const NotificationsScreen = ({
  language = "en",
  notifications,
}: {
  language?: AppLanguage;
  notifications?: AppNotification[];
}) => {
  const [filter, setFilter] = useState<"all" | AlertType | "urgent">("all");
  const [markedRead, setMarkedRead] = useState(false);

  const notificationHistory = groupNotifications(
    getNotificationTimeline(notifications ?? loadAppNotifications())
  );

  const alertCounts = notificationHistory.reduce<Record<AlertType, number>>(
    (acc, alert) => {
      acc[alert.type] += 1;
      return acc;
    },
    { reminder: 0, success: 0, missed: 0, stock: 0, expired: 0 }
  );
  const urgentCount = alertCounts.missed + alertCounts.stock + alertCounts.expired;

  const filteredNotifications = notificationHistory.filter((alert) => {
    if (filter === "all") return true;
    if (filter === "urgent") return alert.type === "missed" || alert.type === "stock" || alert.type === "expired";
    return alert.type === filter;
  });

  const groupedNotifications = filteredNotifications.reduce<Record<string, typeof filteredNotifications>>((acc, alert) => {
    (acc[alert.group] ||= []).push(alert);
    return acc;
  }, {});

  const copy =
    language === "ta"
      ? {
          title: tamilLabels.title,
          subtitle: `${notificationHistory.length} ${tamilLabels.subtitle}`,
          urgent: tamilLabels.urgent,
          emptyTitle: tamilLabels.emptyTitle,
          emptyBody: tamilLabels.emptyBody,
          all: tamilLabels.all,
          filterBy: tamilLabels.filterBy,
          markAllRead: tamilLabels.markAllRead,
          allMarked: tamilLabels.allMarked,
          systemStatus: tamilLabels.systemStatus,
        }
      : {
          title: "Notifications",
          subtitle: `${notificationHistory.length} recent alerts`,
          urgent: "urgent",
          emptyTitle: "No alerts found",
          emptyBody: filter !== "all" ? "No notifications match this filter." : "Dose, stock, and expiry events will appear here.",
          all: "All",
          filterBy: "Filter by",
          markAllRead: "Mark all as reviewed",
          allMarked: "All notifications marked as reviewed",
          systemStatus: "Alert System Status",
        };

  return (
    <div className="flex-1 overflow-y-auto bg-page">
      <ScreenHeader title={copy.title} subtitle={copy.subtitle} />
      <div className="mx-auto w-full max-w-xl md:max-w-6xl lg:max-w-7xl 2xl:max-w-[1440px] px-5 pb-28 md:pb-12 sm:px-6 md:px-8 lg:px-10">
        <div className="md:grid md:grid-cols-12 md:gap-6 md:items-start space-y-5 md:space-y-0">
          {notificationHistory.length > 0 && (
            <div className="md:col-span-4 lg:col-span-4 md:sticky md:top-6 space-y-4">
              {/* Alert Types Overview Card */}
              <section className="rounded-2xl border border-border/60 bg-card p-4 shadow-card">
                <div className="mb-4 flex items-center justify-between gap-3">
                  <div>
                    <h2 className="text-sm font-extrabold text-foreground">
                      {language === "ta" ? "எச்சரிக்கை வகைகள்" : "Alert types"}
                    </h2>
                    <p className="mt-0.5 text-xs font-medium text-muted-foreground">
                      {language === "ta" ? "சமீபத்திய அறிவிப்புகள்" : "Breakdown of recent notifications"}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setFilter(filter === "urgent" ? "all" : "urgent")}
                    className={cn(
                      "rounded-2xl px-3 py-2 text-center transition-all cursor-pointer",
                      filter === "urgent"
                        ? "bg-destructive text-destructive-foreground shadow-sm ring-2 ring-destructive/40"
                        : "bg-destructive-soft text-destructive hover:bg-destructive/20"
                    )}
                    title="Filter urgent"
                  >
                    <p className="text-lg font-extrabold leading-none">{urgentCount}</p>
                    <p className="mt-1 text-[10px] font-bold uppercase">{copy.urgent}</p>
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  {(["success", "reminder", "missed", "stock"] as AlertType[]).map((type) => {
                    const item = config[type];
                    const isSelected = filter === type;
                    return (
                      <button
                        key={type}
                        type="button"
                        onClick={() => setFilter(isSelected ? "all" : type)}
                        className={cn(
                          "flex items-center gap-2 rounded-2xl p-2 text-left transition-all cursor-pointer border",
                          isSelected
                            ? "bg-card border-primary shadow-xs ring-1 ring-primary/40"
                            : "bg-muted/60 border-transparent hover:bg-muted"
                        )}
                      >
                        <div className={cn("flex h-8 w-8 shrink-0 items-center justify-center rounded-xl", item.iconBg)}>
                          <item.Icon className={cn("h-4 w-4", item.classes)} />
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-extrabold leading-none text-foreground">{alertCounts[type]}</p>
                          <p className="mt-1 truncate text-[10px] font-bold uppercase text-muted-foreground">{type}</p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </section>

              {/* Quick Filter Selection */}
              <div className="rounded-2xl border border-border/60 bg-card p-4 shadow-card">
                <div className="flex items-center gap-2 mb-3">
                  <Filter className="h-4 w-4 text-primary" />
                  <h3 className="text-xs font-extrabold uppercase tracking-wider text-foreground">
                    {copy.filterBy}
                  </h3>
                  {filter !== "all" && (
                    <button
                      type="button"
                      onClick={() => setFilter("all")}
                      className="ml-auto text-xs font-bold text-primary hover:underline cursor-pointer"
                    >
                      {language === "ta" ? "அனைத்தையும் காட்டு" : "Reset"}
                    </button>
                  )}
                </div>

                <div className="flex flex-wrap gap-1.5">
                  <button
                    type="button"
                    onClick={() => setFilter("all")}
                    className={cn(
                      "rounded-xl px-3 py-1.5 text-xs font-extrabold transition-all cursor-pointer",
                      filter === "all"
                        ? "bg-primary text-primary-foreground shadow-xs"
                        : "bg-secondary text-muted-foreground hover:text-foreground"
                    )}
                  >
                    {copy.all} ({notificationHistory.length})
                  </button>
                  <button
                    type="button"
                    onClick={() => setFilter("urgent")}
                    className={cn(
                      "rounded-xl px-3 py-1.5 text-xs font-extrabold transition-all cursor-pointer",
                      filter === "urgent"
                        ? "bg-destructive text-destructive-foreground shadow-xs"
                        : "bg-secondary text-muted-foreground hover:text-foreground"
                    )}
                  >
                    {copy.urgent} ({urgentCount})
                  </button>
                  <button
                    type="button"
                    onClick={() => setFilter("missed")}
                    className={cn(
                      "rounded-xl px-3 py-1.5 text-xs font-extrabold transition-all cursor-pointer",
                      filter === "missed"
                        ? "bg-destructive text-destructive-foreground shadow-xs"
                        : "bg-secondary text-muted-foreground hover:text-foreground"
                    )}
                  >
                    Missed ({alertCounts.missed})
                  </button>
                  <button
                    type="button"
                    onClick={() => setFilter("success")}
                    className={cn(
                      "rounded-xl px-3 py-1.5 text-xs font-extrabold transition-all cursor-pointer",
                      filter === "success"
                        ? "bg-success text-success-foreground shadow-xs"
                        : "bg-secondary text-muted-foreground hover:text-foreground"
                    )}
                  >
                    Success ({alertCounts.success})
                  </button>
                  <button
                    type="button"
                    onClick={() => setFilter("stock")}
                    className={cn(
                      "rounded-xl px-3 py-1.5 text-xs font-extrabold transition-all cursor-pointer",
                      filter === "stock"
                        ? "bg-warning text-warning-foreground shadow-xs"
                        : "bg-secondary text-muted-foreground hover:text-foreground"
                    )}
                  >
                    Stock ({alertCounts.stock})
                  </button>
                </div>
              </div>

              {/* Alert Insights & System Status */}
              <div className="rounded-2xl border border-border/60 bg-card p-4 shadow-card">
                <div className="flex items-center gap-2 mb-2">
                  <ShieldCheck className="h-4 w-4 text-success" />
                  <h3 className="text-xs font-extrabold uppercase tracking-wider text-foreground">
                    {copy.systemStatus}
                  </h3>
                </div>

                <div className="space-y-2 text-xs text-muted-foreground mb-3">
                  <div className="flex items-center justify-between">
                    <span>{language === "ta" ? "ஒலி அறிவிப்பு" : "Audio Alarms"}</span>
                    <span className="font-bold text-success">{language === "ta" ? "இயக்கத்தில்" : "Active"}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>{language === "ta" ? "தானியங்கு கண்காணிப்பு" : "Auto-Tracking"}</span>
                    <span className="font-bold text-primary">{language === "ta" ? "ஒத்திசைவு" : "Live Sync"}</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setMarkedRead(true);
                    toast.success(copy.allMarked);
                  }}
                  disabled={markedRead}
                  className={cn(
                    "w-full rounded-xl py-2 px-3 text-xs font-bold transition-all cursor-pointer border",
                    markedRead
                      ? "bg-success/15 border-success/30 text-success cursor-default"
                      : "bg-secondary hover:bg-secondary/80 border-border text-foreground"
                  )}
                >
                  <span className="inline-flex items-center gap-1.5">
                    {markedRead ? <Check className="h-3.5 w-3.5" /> : <Sparkles className="h-3.5 w-3.5" />}
                    {markedRead ? (language === "ta" ? "சரிபார்க்கப்பட்டது" : "All Reviewed") : copy.markAllRead}
                  </span>
                </button>
              </div>
            </div>
          )}

          {/* Main Notifications List */}
          <div className={cn(notificationHistory.length > 0 ? "md:col-span-8 lg:col-span-8" : "md:col-span-12")}>
            {filteredNotifications.length === 0 ? (
              <div className="rounded-3xl border border-border bg-card p-8 text-center shadow-card">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-soft text-primary">
                  <BellRing className="h-7 w-7" />
                </div>
                <h2 className="mt-4 text-lg font-extrabold text-foreground">{copy.emptyTitle}</h2>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">{copy.emptyBody}</p>
                {filter !== "all" && (
                  <button
                    type="button"
                    onClick={() => setFilter("all")}
                    className="mt-4 inline-flex items-center gap-1 rounded-xl bg-primary px-4 py-2 text-xs font-bold text-primary-foreground shadow-xs cursor-pointer hover:bg-primary/90"
                  >
                    {language === "ta" ? "அனைத்து எச்சரிக்கைகளையும் காட்டு" : "Show All Alerts"}
                  </button>
                )}
              </div>
            ) : (
              <div className="space-y-6">
                {Object.entries(groupedNotifications).map(([group, groupAlerts]) => (
                  <section key={group}>
                    <div className="mb-3 flex items-center justify-between gap-3 px-1">
                      <h2 className="text-xs font-bold uppercase tracking-[0.18em] text-muted-foreground">
                        {groupAlerts[0]?.groupLabel}
                      </h2>
                      <span className="rounded-full bg-primary-soft px-2.5 py-1 text-[11px] font-bold text-primary">
                        {groupAlerts.length}
                      </span>
                    </div>

                    <ul className="space-y-3">
                      {groupAlerts.map((alert) => {
                        const item = config[alert.type];
                        return (
                          <li
                            key={alert.id}
                            className="flex items-start gap-3 rounded-2xl border border-border/60 bg-card p-4 shadow-card transition-shadow hover:shadow-soft"
                          >
                            <div className={cn("flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl", item.iconBg)}>
                              <item.Icon className={cn("h-5 w-5", item.classes)} strokeWidth={2.3} />
                            </div>
                            <div className="min-w-0 flex-1">
                              <div className="flex items-start justify-between gap-2">
                                <p className="break-words font-bold leading-snug text-foreground">{alert.title}</p>
                                <span className="mt-0.5 whitespace-nowrap text-[11px] font-semibold text-muted-foreground">
                                  {alert.time}
                                </span>
                              </div>
                              <p className="mt-0.5 break-words text-sm font-medium text-muted-foreground">
                                {alert.message}
                              </p>
                            </div>
                          </li>
                        );
                      })}
                    </ul>
                  </section>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationsScreen;
