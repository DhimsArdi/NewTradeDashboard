import { useEffect, useState } from "react";
import { currentDataset } from "./devData";
import { WidgetCard } from "./WidgetShell";

const a = (file: string) => `/assets/${file}`;
const imgAlertCircle = a("9dcb1.svg");
const imgClock = a("ea938.svg");
const imgArrowRight = a("9d328.svg");
const imgRefresh = a("transaction-overview/refresh.svg");

// ---------- Demo data ----------

type Counts = { action: number; progress: number };

const countData = (): Counts => {
  const dataset = currentDataset();
  if (dataset === "worst") return { action: 128, progress: 1204 };
  if (dataset === "empty") return { action: 0, progress: 0 };
  if (dataset === "one") return { action: 1, progress: 1 };
  return { action: 4, progress: 6 };
};

type Status = "loading" | "ready" | "error";

// QA hook: ?overviewState=error|loading forces a widget state.
const forcedState = () => {
  const v = new URLSearchParams(window.location.search).get("overviewState");
  return v === "error" || v === "loading" ? v : null;
};

const focusRing = "focus-visible:shadow-[0_0_0_2px_white,0_0_0_4px_#099697]";

// ---------- Building blocks ----------

type CardProps = {
  name: string;
  title: string;
  icon: string;
  iconBg: string;
  iconSize: string;
  count: number;
  description: string;
  zeroDescription: string;
  action: string;
  status: Status;
  onRetry: () => void;
};

function Card({ name, title, icon, iconBg, iconSize, count, description, zeroDescription, action, status, onRetry }: CardProps) {
  const isError = status === "error";
  return (
    <WidgetCard title={title} className="flex-[1_0_0] min-w-px" dataName={`Transaction Overview / ${name}`}>
      <div aria-busy={status === "loading"} className="flex flex-col gap-[12px] items-start p-[20px] w-full">
        <div className="flex gap-[8px] items-center w-full" data-name="Top">
          <div className="relative rounded-[20px] shrink-0 size-[32px]" style={{ background: iconBg }} data-name="Featured icon">
            <img alt="" className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 block max-w-none ${iconSize}`} src={icon} />
          </div>
          {status === "loading" ? (
            <div className="bg-[#f5f5f5] h-[29px] rounded-[4px] shrink-0 w-[40px] animate-pulse" />
          ) : (
            <p className="font-['TT_Interphases_Pro:Bold'] leading-[1.2] min-w-0 text-[#171717] text-[24px] tabular-nums truncate">
              {status === "error" ? "—" : count.toLocaleString("en-US")}
            </p>
          )}
        </div>

        {status === "loading" ? (
          <>
            <div className="flex flex-col gap-[8px] h-[40px] py-[4px] w-full">
              <div className="bg-[#f5f5f5] h-[12px] rounded-[4px] w-full animate-pulse" />
              <div className="bg-[#f5f5f5] h-[12px] rounded-[4px] w-[120px] max-w-full animate-pulse" />
            </div>
            <div className="bg-[#f5f5f5] h-[20px] rounded-[4px] shrink-0 w-[80px] animate-pulse" />
          </>
        ) : (
          <>
            <p role={isError ? "alert" : undefined} className="[word-break:break-word] font-['TT_Interphases_Pro:Regular'] min-h-[40px] leading-[20px] text-[#525252] text-[14px] w-full">
              {isError ? "Couldn't load this data. Please try again." : count === 0 ? zeroDescription : description}
            </p>
            <button
              type="button"
              onClick={isError ? onRetry : undefined}
              className={`th-press flex gap-[6px] items-center justify-center rounded-[4px] outline-none ${focusRing}`}
            >
              {isError && <img alt="" className="block shrink-0 size-[20px]" src={imgRefresh} />}
              <span className="font-['TT_Interphases_Pro:DemiBold'] leading-[20px] text-[#ff6b00] text-[14px] underline decoration-from-font [text-underline-position:from-font] [text-decoration-skip-ink:none] whitespace-nowrap">
                {isError ? "Retry" : action}
              </span>
              {!isError && <img alt="" className="block shrink-0 size-[20px]" src={imgArrowRight} />}
            </button>
          </>
        )}
      </div>
    </WidgetCard>
  );
}

// ---------- Widget ----------

export default function TransactionOverviewWidget({ className = "" }: { className?: string }) {
  const [status, setStatus] = useState<Status>("loading");
  const [reloadKey, setReloadKey] = useState(0);
  const [counts] = useState(countData);

  // Simulated fetch; both cards share one request, so Retry on either reloads both.
  useEffect(() => {
    setStatus("loading");
    const forced = forcedState();
    if (forced === "loading") return;
    const t = window.setTimeout(() => setStatus(forced ?? "ready"), 450);
    return () => window.clearTimeout(t);
  }, [reloadKey]);

  const retry = () => setReloadKey((k) => k + 1);

  return (
    <section aria-label="Transaction Overview" className={`flex gap-[24px] items-stretch ${className}`} data-name="Widget / Transaction Overview Card">
      <Card
        name="Need your action"
        title="Action needed"
        icon={imgAlertCircle}
        iconBg="#fee4e2"
        iconSize="size-[19.2px]"
        count={counts.action}
        description="Tasks that require your attention."
        zeroDescription="You’re all caught up."
        action="View Tasks"
        status={status}
        onRetry={retry}
      />
      <Card
        name="In progress"
        title="In progress"
        icon={imgClock}
        iconBg="#fef0c7"
        iconSize="size-[15.36px]"
        count={counts.progress}
        description="Track your ongoing trade activities."
        zeroDescription="No trade activities at the moment."
        action="Track Activities"
        status={status}
        onRetry={retry}
      />
    </section>
  );
}
