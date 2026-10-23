import { useEffect, useState, type ReactNode } from "react";
import { currentDataset } from "./devData";
import { WidgetCard } from "./WidgetShell";

const a = (file: string) => `/assets/${file}`;
const imgAlertCircle = a("9dcb1.svg");
const imgClock = a("ea938.svg");
const imgArrowRight = a("9d328.svg");
const imgRefresh = a("transaction-overview/refresh.svg");
const imgChevronRight = a("transaction-overview/chevronRight.svg");
const imgChevronRightHover = a("transaction-overview/chevronRightHover.svg");

// ---------- Demo data ----------

// Maker view: tasks waiting on the maker, split by product (Figma 2425:16267 · Task list).
type Task = { product: string; count: number };
type Counts = { tasks: Task[]; progress: number };

const tasksOf = (outward: number, inward: number, exportLc: number): Task[] => [
  { product: "Outward Guarantee", count: outward },
  { product: "Inward Guarantee", count: inward },
  { product: "Export LC/Inward SKBDN", count: exportLc },
];

const countData = (): Counts => {
  const dataset = currentDataset();
  if (dataset === "worst") return { tasks: tasksOf(1096, 84, 24), progress: 1204 };
  if (dataset === "empty") return { tasks: tasksOf(0, 0, 0), progress: 0 };
  if (dataset === "one") return { tasks: tasksOf(1, 0, 0), progress: 1 };
  return { tasks: tasksOf(10, 8, 4), progress: 6 };
};

type Status = "loading" | "ready" | "error";

// QA hook: ?overviewState=error|loading forces a widget state.
const forcedState = () => {
  const v = new URLSearchParams(window.location.search).get("overviewState");
  return v === "error" || v === "loading" ? v : null;
};

const focusRing = "focus-visible:shadow-[0_0_0_2px_white,0_0_0_4px_#099697]";
const bodyText = "[word-break:break-word] font-['TT_Interphases_Pro:Regular'] min-h-[40px] leading-[20px] text-[#525252] text-[14px] w-full";

// ---------- Building blocks ----------

type CardProps = {
  name: string;
  title: string;
  icon: string;
  iconBg: string;
  iconSize: string;
  count: number;
  status: Status;
  onRetry: () => void;
  // Placeholder shown under the count while loading, sized like the ready body.
  skeleton: ReactNode;
  children: ReactNode;
};

function Card({ name, title, icon, iconBg, iconSize, count, status, onRetry, skeleton, children }: CardProps) {
  const isError = status === "error";
  return (
    <WidgetCard title={title} className="flex-[1_0_0] min-w-px" dataName={`Transaction Overview / ${name}`}>
      <div aria-busy={status === "loading"} className="flex flex-col gap-[12px] items-start min-h-[156px] p-[20px] w-full">
        <div className="flex gap-[8px] items-center w-full" data-name="Top">
          <div className="relative rounded-[20px] shrink-0 size-[32px]" style={{ background: iconBg }} data-name="Featured icon">
            <img alt="" className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 block max-w-none ${iconSize}`} src={icon} />
          </div>
          {status === "loading" ? (
            <div className="bg-[#f5f5f5] h-[29px] rounded-[4px] shrink-0 w-[40px] animate-pulse" />
          ) : (
            <p className="font-['TT_Interphases_Pro:Bold'] leading-[1.2] min-w-0 text-[#171717] text-[24px] tabular-nums truncate">
              {isError ? "—" : count.toLocaleString("en-US")}
            </p>
          )}
        </div>

        {status === "loading" ? (
          skeleton
        ) : isError ? (
          <>
            <p role="alert" className={bodyText}>
              Couldn't load this data. Please try again.
            </p>
            <button type="button" onClick={onRetry} className={`th-press flex gap-[6px] items-center justify-center rounded-[4px] outline-none ${focusRing}`}>
              <img alt="" className="block shrink-0 size-[20px]" src={imgRefresh} />
              <span className="font-['TT_Interphases_Pro:DemiBold'] leading-[20px] text-[#ff6b00] text-[14px] underline decoration-from-font [text-underline-position:from-font] [text-decoration-skip-ink:none] whitespace-nowrap">
                Retry
              </span>
            </button>
          </>
        ) : (
          children
        )}
      </div>
    </WidgetCard>
  );
}

// Figma 2420:16062 · Transaction Overview / Task row. A row opens that product's task list;
// Hover turns the product brand orange, Empty (count 0) greys the row out and drops the chevron.
const rowName = "flex-[1_0_0] font-['TT_Interphases_Pro:Regular'] leading-[20px] min-w-px overflow-hidden text-[14px] text-ellipsis whitespace-nowrap";
const rowCount = "font-['TT_Interphases_Pro:DemiBold'] leading-[20px] text-[14px] tabular-nums whitespace-nowrap";

function TaskRow({ product, count }: Task) {
  const label = count.toLocaleString("en-US");
  if (count === 0) {
    return (
      <div className="flex gap-[8px] h-[24px] items-center py-[2px] w-full" data-name="Task row · Empty">
        <span className={`${rowName} text-[#525252]`}>{product}</span>
        <span className={`${rowCount} shrink-0 text-[#525252]`}>{label}</span>
      </div>
    );
  }
  return (
    <button
      type="button"
      aria-label={`${product}: ${label} tasks`}
      className={`group flex gap-[8px] h-[24px] items-center py-[2px] rounded-[4px] text-left w-full outline-none ${focusRing}`}
      data-name={`Shortcut · ${product} tasks`}
    >
      <span className={`${rowName} text-[#404040] decoration-from-font [text-underline-position:from-font] [text-decoration-skip-ink:none] group-hover:text-[#ef4f00] group-hover:underline group-focus-visible:text-[#ef4f00] group-focus-visible:underline`}>
        {product}
      </span>
      <span className="flex gap-[2px] items-center shrink-0" data-name="Meta">
        <span className={`${rowCount} text-[#171717]`}>{label}</span>
        <img alt="" className="block shrink-0 size-[16px] group-hover:hidden group-focus-visible:hidden" src={imgChevronRight} />
        <img alt="" className="hidden shrink-0 size-[16px] group-hover:block group-focus-visible:block" src={imgChevronRightHover} />
      </span>
    </button>
  );
}

function TaskList({ tasks }: { tasks: Task[] }) {
  return (
    <ul className="flex flex-col items-start w-full" data-name="Task list">
      {tasks.map((t) => (
        <li key={t.product} className="w-full">
          <TaskRow {...t} />
        </li>
      ))}
    </ul>
  );
}

const lineSkeleton = (
  <div className="flex flex-col gap-[8px] h-[40px] py-[4px] w-full">
    <div className="bg-[#f5f5f5] h-[12px] rounded-[4px] w-full animate-pulse" />
    <div className="bg-[#f5f5f5] h-[12px] rounded-[4px] w-[120px] max-w-full animate-pulse" />
  </div>
);

// ---------- Widget ----------

export default function TransactionOverviewWidget({ className = "" }: { className?: string }) {
  const [status, setStatus] = useState<Status>("loading");
  const [reloadKey, setReloadKey] = useState(0);
  const [counts] = useState(countData);
  const actionTotal = counts.tasks.reduce((sum, t) => sum + t.count, 0);

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
        count={actionTotal}
        status={status}
        onRetry={retry}
        skeleton={
          <div className="flex flex-col w-full">
            {counts.tasks.map((t) => (
              <div key={t.product} className="flex gap-[8px] h-[24px] items-center py-[2px] w-full">
                <div className="bg-[#f5f5f5] flex-1 h-[12px] max-w-[160px] rounded-[4px] animate-pulse" />
                <div className="bg-[#f5f5f5] h-[12px] ml-auto rounded-[4px] shrink-0 w-[28px] animate-pulse" />
              </div>
            ))}
          </div>
        }
      >
        <TaskList tasks={counts.tasks} />
      </Card>
      <Card
        name="In progress"
        title="In progress"
        icon={imgClock}
        iconBg="#fef0c7"
        iconSize="size-[15.36px]"
        count={counts.progress}
        status={status}
        onRetry={retry}
        skeleton={
          <>
            {lineSkeleton}
            <div className="bg-[#f5f5f5] h-[20px] rounded-[4px] shrink-0 w-[80px] animate-pulse" />
          </>
        }
      >
        <p className={bodyText}>{counts.progress === 0 ? "No trade activities at the moment." : "Track your ongoing trade activities."}</p>
        <button type="button" className={`th-press flex gap-[6px] items-center justify-center rounded-[4px] outline-none ${focusRing}`}>
          <span className="font-['TT_Interphases_Pro:DemiBold'] leading-[20px] text-[#ff6b00] text-[14px] underline decoration-from-font [text-underline-position:from-font] [text-decoration-skip-ink:none] whitespace-nowrap">
            Track Activities
          </span>
          <img alt="" className="block shrink-0 size-[20px]" src={imgArrowRight} />
        </button>
      </Card>
    </section>
  );
}
