import { useEffect, useRef, useState } from "react";
import { currentDataset } from "./devData";

const a = (file: string) => `/assets/${file}`;
const imgDotExpiry = a("056f2.svg");
const imgDotToday = a("290a5.svg");
const imgDotAmend = a("d0149.svg");
const imgChevronLeft = a("2c9c3.svg");
const imgChevronRight = a("e9a5b.svg");
const imgSeparator = a("93f8f.svg");
const imgClock = a("efc9f.svg");
const imgEmpty = a("calendar/emptyState.svg");
const imgAlert = a("transaction-history/alertCircle.svg");
const imgRefresh = a("transaction-history/refresh.svg");

// ---------- Demo data ----------

const TODAY = new Date(2026, 7, 18);

type Expiry = {
  date: Date;
  title: string;
  counterparty: string;
  amount: string;
  amendExtend?: boolean;
};

const expiries: Expiry[] = [
  { date: new Date(2026, 7, 20), title: "Export LC expiry - ELTRG01236S26", counterparty: "Mitsui & Co., Ltd.", amount: "EUR 58,900.00" },
  { date: new Date(2026, 7, 20), title: "BG expiry - IGTRG00301A25", counterparty: "PT Wijaya Karya", amount: "IDR 1,250,000,000.00", amendExtend: true },
  { date: new Date(2026, 7, 24), title: "Export LC expiry - ELTRG01238S26", counterparty: "Wilmar Trading Pte. Ltd.", amount: "SGD 212,000.00" },
  { date: new Date(2026, 7, 27), title: "BG expiry - IGTRG00298A25", counterparty: "PT Pertamina", amount: "IDR 2,800,980,000.00", amendExtend: true },
  { date: new Date(2026, 7, 28), title: "Export LC expiry - ELTRG01242S26", counterparty: "Cargill Asia Pacific", amount: "USD 96,800.00" },
  { date: new Date(2026, 7, 31), title: "Facility limit expiry", counterparty: "Bank Guarantee Limit", amount: "IDR 690,000,000.00" },
  { date: new Date(2026, 7, 31), title: "BG expiry - IGTRG00305A25", counterparty: "PT Adhi Karya", amount: "IDR 450,000,000.00" },
  { date: new Date(2026, 8, 8), title: "Export LC expiry - ELTRG01240S26", counterparty: "Itochu Corporation", amount: "USD 310,000.00" },
  { date: new Date(2026, 8, 15), title: "Facility limit expiry", counterparty: "Bill Purchasing Line", amount: "IDR 5,000,000,000.00" },
  { date: new Date(2026, 8, 22), title: "BG expiry - IGTRG00312A25", counterparty: "PT Waskita Karya", amount: "IDR 980,000,000.00" },
];

// Stress-test fixtures for the dev data toggle: long names, huge amounts, a crowded day, a 60-item month.
const worstExpiries: Expiry[] = [
  { date: new Date(2026, 7, 20), title: "Export LC expiry - ELTRG01236S26-AMD03", counterparty: "PT Perusahaan Perdagangan Internasional Nusantara Sejahtera Tbk", amount: "IDR 12,500,000,000,000.00" },
  { date: new Date(2026, 7, 20), title: "Facility limit expiry", counterparty: "Standby Letter of Credit Facility – Syndicated (Tranche B)", amount: "USD 1,250,000,000.00", amendExtend: true },
  { date: new Date(2026, 7, 20), title: "BG expiry - IGTRG00301A25", counterparty: "Jo", amount: "IDR 0.00" },
  { date: new Date(2026, 7, 20), title: "Export LC expiry - ELTRG01237S26", counterparty: "Đặng Thị Ngọc Hân Trading Co., Ltd.", amount: "VND 25,000,000,000.00" },
  { date: new Date(2026, 7, 20), title: "BG expiry - IGTRG00302A25", counterparty: "Mitsubishi UFJ Trust and Banking Corporation, Singapore Branch", amount: "JPY 1,234,567,890,123.00", amendExtend: true },
  { date: new Date(2026, 7, 20), title: "Export LC expiry - ELTRG01239S26", counterparty: "王秀英贸易有限公司", amount: "CNY 88,000.00" },
  { date: new Date(2026, 7, 27), title: "BG expiry - IGTRG00298A25", counterparty: "PT Pertamina (Persero)", amount: "IDR 2,800,980,000.00", amendExtend: true },
  { date: new Date(2026, 7, 31), title: "Facility limit expiry", counterparty: "Bank Guarantee Limit", amount: "IDR 690,000,000.00" },
  ...Array.from({ length: 60 }, (_, i) => ({
    date: new Date(2026, 8, 1 + (i % 30)),
    title: `Export LC expiry - ELTRG0${1300 + i}S26`,
    counterparty: i % 2 ? "Wilmar Trading Pte. Ltd." : "Cargill Asia Pacific",
    amount: `USD ${(96_800 + i * 1_250).toLocaleString("en-US")}.00`,
  })),
];

const expiryData = (): Expiry[] => {
  const dataset = currentDataset();
  if (dataset === "worst") return worstExpiries;
  if (dataset === "empty") return [];
  if (dataset === "one") return expiries.slice(0, 1);
  return expiries;
};

const weekdays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const COLOR_TODAY = "#099697";
const COLOR_EXPIRY = "#f97316";
const COLOR_AMEND = "#3b82f6";

const sameDay = (x: Date, y: Date) => x.getFullYear() === y.getFullYear() && x.getMonth() === y.getMonth() && x.getDate() === y.getDate();
const monthLabel = (d: Date) => d.toLocaleString("en-US", { month: "long", year: "numeric" });
const dayLabel = (d: Date) => `${d.getDate()} ${d.toLocaleString("en-US", { month: "short" })} ${d.getFullYear()}`;
const plural = (n: number) => `${n} ${n === 1 ? "expiry" : "expiries"}`;

// Always 6 weeks, Monday first.
const monthGrid = (month: Date) => {
  const first = new Date(month.getFullYear(), month.getMonth(), 1);
  const offset = (first.getDay() + 6) % 7;
  return Array.from({ length: 42 }, (_, i) => new Date(month.getFullYear(), month.getMonth(), 1 - offset + i));
};

type Status = "loading" | "ready" | "empty" | "error";

// QA hook: ?calState=empty|error|loading forces a widget state.
const forcedState = () => {
  const v = new URLSearchParams(window.location.search).get("calState");
  return v === "empty" || v === "error" || v === "loading" ? v : null;
};

// ---------- Building blocks ----------

type DayState = "default" | "today" | "selected" | "outside";

function Day({ date, state, dots, label, onSelect }: { date: Date; state: DayState; dots: string[]; label?: string; onSelect?: () => void }) {
  const base = "relative flex flex-[1_0_0] min-w-px h-[48px] flex-col items-center justify-center leading-[24px] text-[16px] text-center";
  const look = {
    default: "rounded-[12px] font-['TT_Interphases_Pro:Medium'] text-[#171717]",
    today: "rounded-full bg-[#099697] font-['TT_Interphases_Pro:DemiBold'] text-white",
    selected: "rounded-full bg-[#edf8f1] border border-[#099697] font-['TT_Interphases_Pro:DemiBold'] text-[#099697]",
    outside: "rounded-[12px] font-['TT_Interphases_Pro:Medium'] text-[#a3a3a3]",
  }[state];
  const content = (
    <>
      {date.getDate()}
      {dots.length > 0 && (
        <span className={`absolute inset-x-0 flex justify-center gap-[4px] ${state === "selected" ? "bottom-[4px]" : "bottom-[5px]"}`}>
          {dots.map((src) => (
            <img key={src} alt="" className="block size-[8px]" src={src} />
          ))}
        </span>
      )}
    </>
  );
  if (!onSelect) return <div className={`${base} ${look}`}>{content}</div>;
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-label={label}
      aria-pressed={state === "selected"}
      className={`th-press ${base} ${look} border-solid outline-none focus-visible:shadow-[0_0_0_2px_white,0_0_0_4px_#099697] ${state === "default" ? "hover:bg-[#f5f5f5]" : ""}`}
    >
      {content}
    </button>
  );
}

function ExpiryItem({ item }: { item: Expiry }) {
  const day = String(item.date.getDate()).padStart(2, "0");
  const month = item.date.toLocaleString("en-US", { month: "short" }).toUpperCase();
  return (
    <li className="border-b border-[#f5f5f5] flex gap-[16px] min-h-[74px] items-center pl-[8px] pr-[12px] py-[13.5px] w-full">
      <div className="bg-[#f9f9f9] flex flex-col items-center justify-center rounded-[8px] shrink-0 size-[40px] font-['TT_Interphases_Pro:Medium'] leading-[18px] text-[#171717] text-[12px] text-center">
        <span>{day}</span>
        <span>{month}</span>
      </div>
      <div className="flex flex-[1_0_0] min-w-px gap-[8px] items-center">
        <div className="self-stretch min-h-[46px] w-[4px] rounded-[24px] shrink-0" style={{ background: item.amendExtend ? COLOR_AMEND : COLOR_EXPIRY }} />
        <div className="flex flex-[1_0_0] min-w-px flex-col gap-[2px]">
          <div className="flex flex-wrap gap-[4px_8px] items-center">
            <p title={item.title} className="min-w-0 max-w-full font-['TT_Interphases_Pro:DemiBold'] leading-[24px] text-[#0e0e0e] text-[16px] truncate">{item.title}</p>
            {item.amendExtend && (
              <span className="bg-[#eff6ff] border border-[#bfdbfe] flex h-[22px] items-center px-[8px] rounded-[16px] shrink-0 font-['TT_Interphases_Pro:DemiBold'] leading-[1.2] text-[#1d4ed8] text-[12px] whitespace-nowrap">
                Amendment Extension
              </span>
            )}
          </div>
          <div className="flex flex-wrap gap-x-[8px] items-center font-['TT_Interphases_Pro:Regular'] leading-[20px] text-[#4e4e4e] text-[14px] whitespace-nowrap">
            <span title={item.counterparty} className="min-w-0 max-w-full truncate">{item.counterparty}</span>
            <span className="flex gap-[8px] items-center tabular-nums">
              <img alt="" className="block size-[4px] shrink-0" src={imgSeparator} />
              {item.amount}
            </span>
          </div>
        </div>
      </div>
    </li>
  );
}

// Native overlay scrollbars hide until scrolled, so the "more below" thumb is drawn here and kept visible.
function ExpiryList({ label, items }: { label: string; items: Expiry[] }) {
  const ref = useRef<HTMLUListElement>(null);
  const thumbRef = useRef<HTMLDivElement>(null);

  // Runs on every scroll event, so it writes straight to the DOM instead of re-rendering the list.
  const measure = () => {
    const el = ref.current;
    const thumb = thumbRef.current;
    if (!el || !thumb) return;
    const overflow = el.scrollHeight > el.clientHeight + 1;
    if (el.dataset.overflow !== String(overflow)) el.dataset.overflow = String(overflow);
    thumb.style.display = overflow ? "block" : "none";
    if (!overflow) return;
    // Long lists would shrink the thumb to a sliver; keep it grabbable-looking.
    const height = Math.max(24, (el.clientHeight / el.scrollHeight) * el.clientHeight);
    const top = (el.scrollTop / (el.scrollHeight - el.clientHeight)) * (el.clientHeight - height);
    thumb.style.height = `${height}px`;
    thumb.style.transform = `translateY(${top}px)`;
  };

  useEffect(() => {
    measure();
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [items]);

  return (
    <div className="cal-fade-in relative h-full">
      <ul ref={ref} aria-label={label} onScroll={measure} className="cal-scroll h-full overflow-x-clip overflow-y-auto data-[overflow=true]:pr-[12px]">
        {items.map((item) => (
          <ExpiryItem key={`${item.title}-${item.date.toISOString()}`} item={item} />
        ))}
      </ul>
      <div ref={thumbRef} aria-hidden className="pointer-events-none absolute right-0 top-0 hidden w-[4px] rounded-[2px] bg-[#d4d4d4]" />
    </div>
  );
}

const skeletonLines = [[210, 160], [240, 160], [210, 120]];

function SkeletonList() {
  return (
    <ul aria-hidden className="flex flex-col w-full">
      {skeletonLines.map(([w1, w2], i) => (
        <li key={i} className="border-b border-[#f0f0f0] flex gap-[16px] items-center pl-[8px] pr-[12px] py-[14px] w-full">
          <div className="bg-[#f5f5f5] rounded-[8px] shrink-0 size-[40px] animate-pulse" />
          <div className="flex flex-col gap-[10px] min-w-0">
            <div className="bg-[#f5f5f5] h-[14px] rounded-[4px] max-w-full animate-pulse" style={{ width: w1 }} />
            <div className="bg-[#f5f5f5] h-[12px] rounded-[4px] max-w-full animate-pulse" style={{ width: w2 }} />
          </div>
        </li>
      ))}
    </ul>
  );
}

function NavButton({ label, icon, onClick }: { label: string; icon: string; onClick: () => void }) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className="th-press flex items-center justify-center p-[8px] rounded-[8px] outline-none hover:bg-[#f5f5f5] focus-visible:shadow-[0_0_0_2px_white,0_0_0_4px_#099697]"
    >
      <img alt="" className="block size-[20px]" src={icon} />
    </button>
  );
}

// ---------- Widget ----------

export default function CalendarWidget({ className = "" }: { className?: string }) {
  const [month, setMonth] = useState(() => new Date(TODAY.getFullYear(), TODAY.getMonth(), 1));
  const [direction, setDirection] = useState<"prev" | "next" | null>(null);
  const [selected, setSelected] = useState<Date | null>(null);
  const [status, setStatus] = useState<Status>("loading");
  const [reloadKey, setReloadKey] = useState(0);
  const [expiries] = useState(expiryData);

  // Simulated fetch per visible month.
  useEffect(() => {
    setStatus("loading");
    const forced = forcedState();
    if (forced === "loading") return;
    const t = window.setTimeout(() => setStatus(forced ?? "ready"), 450);
    return () => window.clearTimeout(t);
  }, [month, reloadKey]);

  const goTo = (target: Date, dir: "prev" | "next" | null) => {
    setSelected(null);
    if (target.getFullYear() === month.getFullYear() && target.getMonth() === month.getMonth()) return;
    setDirection(dir);
    setMonth(target);
  };
  const shiftMonth = (delta: number) => goTo(new Date(month.getFullYear(), month.getMonth() + delta, 1), delta < 0 ? "prev" : "next");
  const goToday = () => {
    const target = new Date(TODAY.getFullYear(), TODAY.getMonth(), 1);
    goTo(target, target < month ? "prev" : "next");
  };

  const ready = status === "ready";
  const inMonth = (d: Date) => d.getFullYear() === month.getFullYear() && d.getMonth() === month.getMonth();
  const monthItems = ready ? expiries.filter((e) => inMonth(e.date)) : [];
  const isCurrentMonth = inMonth(TODAY);
  const scoped = isCurrentMonth ? monthItems.filter((e) => e.date >= TODAY) : monthItems;
  const listItems = selected ? monthItems.filter((e) => sameDay(e.date, selected)) : scoped;

  // One dot per kind on that day: expiry, then amend extend. On today's solid tile the first dot turns white.
  const dotsFor = (d: Date, state: DayState) => {
    const items = monthItems.filter((e) => sameDay(e.date, d));
    const dots = [items.some((e) => !e.amendExtend) && imgDotExpiry, items.some((e) => e.amendExtend) && imgDotAmend].filter((x) => x !== false);
    if (state === "today" && dots.length) dots[0] = imgDotToday;
    return dots;
  };

  // Legend only names what this month actually shows; with no expiries it disappears entirely.
  const legend = monthItems.length
    ? (
        [
          [isCurrentMonth, "Today", COLOR_TODAY],
          [monthItems.some((e) => !e.amendExtend), "Expiry date", COLOR_EXPIRY],
          [monthItems.some((e) => e.amendExtend), "Amendment: expiry date extension", COLOR_AMEND],
        ] as const
      ).filter(([show]) => show)
    : [];

  const listTitle = selected ? `Expiries on ${dayLabel(selected)}` : isCurrentMonth ? "Upcoming expiries" : `Expiries in ${monthLabel(month)}`;
  const showEmpty = status === "empty" || (ready && listItems.length === 0);

  return (
    <section
      aria-label="Calendar"
      className={`bg-white border border-[#e5e5e5] border-solid flex flex-col gap-[16px] items-start overflow-clip p-[24px] relative rounded-[16px] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] ${className}`}
      data-name="Widget / Calendar"
    >
      <header className="flex flex-col gap-[12px] w-full">
        <div className="flex flex-col gap-[2px]">
          <h2 className="font-['TT_Interphases_Pro:Bold'] leading-[1.2] text-[#171717] text-[18px]">Calendar</h2>
          <p className="font-['TT_Interphases_Pro:Regular'] leading-[20px] text-[#525252] text-[14px]">Shows the expiry dates of your transactions and facility limits.</p>
        </div>
        <div className="h-px w-full bg-[#e5e5e5]" />
      </header>

      <div className="flex flex-col gap-[16px] w-full">
        <div className="flex flex-col gap-[12px] w-full">
          <div className="flex items-center justify-between w-full">
            <p aria-live="polite" className="font-['TT_Interphases_Pro:DemiBold'] leading-[28px] text-[#171717] text-[18px] whitespace-nowrap">
              {monthLabel(month)}
            </p>
            <div className="flex gap-[4px] items-center">
              <button
                type="button"
                onClick={goToday}
                className="th-press bg-white border border-[#d0d5dd] flex items-center justify-center px-[12px] py-[7px] rounded-[8px] shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05)] outline-none hover:bg-[#fafafa] focus-visible:shadow-[0_0_0_2px_white,0_0_0_4px_#099697]"
              >
                <span className="px-[2px] font-['Inter:Semi_Bold'] font-semibold leading-[20px] text-[#344054] text-[14px] whitespace-nowrap">Today</span>
              </button>
              <NavButton label="Previous month" icon={imgChevronLeft} onClick={() => shiftMonth(-1)} />
              <NavButton label="Next month" icon={imgChevronRight} onClick={() => shiftMonth(1)} />
            </div>
          </div>

          <div className="flex flex-col gap-[4px] w-full overflow-hidden">
            <div className="flex gap-[4px] w-full">
              {weekdays.map((w) => (
                <p key={w} className="flex flex-[1_0_0] min-w-px h-[32px] items-center justify-center font-['TT_Interphases_Pro:Regular'] leading-[24px] text-[#525252] text-[16px]">
                  {w}
                </p>
              ))}
            </div>
            <div key={month.toISOString()} className={`flex flex-col gap-[4px] w-full ${direction ? `cal-month-${direction}` : ""}`}>
              {Array.from({ length: 6 }, (_, week) => (
                <div key={week} className="flex gap-[4px] w-full">
                  {monthGrid(month)
                    .slice(week * 7, week * 7 + 7)
                    .map((d) => {
                      const state: DayState = !inMonth(d)
                        ? "outside"
                        : selected && sameDay(d, selected)
                          ? "selected"
                          : sameDay(d, TODAY)
                            ? "today"
                            : "default";
                      const dots = state === "outside" ? [] : dotsFor(d, state);
                      const count = monthItems.filter((e) => sameDay(e.date, d)).length;
                      return (
                        <Day
                          key={d.toISOString()}
                          date={d}
                          state={state}
                          dots={dots}
                          label={`${dayLabel(d)}, ${plural(count)}`}
                          onSelect={dots.length ? () => setSelected(state === "selected" ? null : d) : undefined}
                        />
                      );
                    })}
                </div>
              ))}
            </div>
          </div>

          {legend.length > 0 && (
            <ul aria-label="Legend" className="cal-fade-in flex flex-wrap gap-[4px_12px] items-center">
              {legend.map(([, label, color]) => (
                <li key={label} className="flex gap-[6px] items-center">
                  <span className="rounded-full shrink-0 size-[10px] shadow-[inset_0_0_0_0.625px_rgba(0,0,0,0.1)]" style={{ background: color }} />
                  <span className="font-['TT_Interphases_Pro:Regular'] leading-[20px] text-[#525252] text-[14px] whitespace-nowrap">{label}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="flex flex-col gap-[8px] w-full">
          <div className="border-t border-[#e5e5e5] flex items-center justify-between pt-[16px] leading-[20px] text-[14px] whitespace-nowrap">
            <p className="font-['TT_Interphases_Pro:DemiBold'] text-[#404040]">{listTitle}</p>
            {selected ? (
              <button
                type="button"
                onClick={() => setSelected(null)}
                className="th-press rounded-[4px] font-['TT_Interphases_Pro:DemiBold'] text-[#ef4f00] outline-none hover:underline focus-visible:shadow-[0_0_0_2px_white,0_0_0_4px_#099697]"
              >
                Show All
              </button>
            ) : (
              ready && listItems.length > 0 && <p className="font-['TT_Interphases_Pro:Regular'] text-[#525252]">{plural(listItems.length)}</p>
            )}
          </div>

          <div className="h-[222px] w-full">
            {status === "loading" ? (
              <SkeletonList />
            ) : status === "error" ? (
              <div role="alert" className="flex h-full flex-col gap-[16px] items-center justify-center text-center">
                <div className="relative bg-[#fee4e2] rounded-[24px] size-[48px] shrink-0">
                  <img alt="" className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 size-[28px]" src={imgAlert} />
                </div>
                <div className="flex flex-col gap-[4px] items-center">
                  <p className="font-['TT_Interphases_Pro:DemiBold'] leading-[24px] text-[#171717] text-[16px]">Calendar data is unavailable</p>
                  <p className="font-['TT_Interphases_Pro:Regular'] leading-[20px] text-[#525252] text-[14px]">We couldn't load this data right now. Please try again.</p>
                </div>
                <button
                  type="button"
                  onClick={() => setReloadKey((k) => k + 1)}
                  className="th-press bg-white border border-[#d4d4d4] drop-shadow-[0px_1px_1px_rgba(0,0,0,0.05)] flex gap-[4px] items-center justify-center px-[12px] py-[8px] rounded-full hover:bg-[#fafafa] outline-none focus-visible:shadow-[0_0_0_2px_white,0_0_0_4px_#099697]"
                >
                  <img alt="" className="block size-[20px]" src={imgRefresh} />
                  <span className="px-[2px] font-['TT_Interphases_Pro:DemiBold'] leading-[20px] text-[#404040] text-[14px]">Retry</span>
                </button>
              </div>
            ) : showEmpty ? (
              <div className="cal-fade-in bg-[#fafafa] flex h-full flex-col gap-[8px] items-center justify-center p-[16px] rounded-[12px] text-center">
                <img alt="" className="block h-[80.8px] w-[130.8px]" src={imgEmpty} />
                <p className="font-['TT_Interphases_Pro:DemiBold'] leading-[24px] text-[#171717] text-[16px]">No expiries in this month</p>
                <p className="font-['TT_Interphases_Pro:Regular'] leading-[20px] text-[#525252] text-[14px] max-w-[340px]">
                  Expiry dates of your transactions and facility limits will appear here.
                </p>
              </div>
            ) : (
              <ExpiryList key={`${month.toISOString()}-${selected?.toISOString() ?? "all"}`} label={listTitle} items={listItems} />
            )}
          </div>
        </div>
      </div>

      <footer className="border-t border-[#e5e5e5] flex items-center gap-[6px] pt-[16px] w-full">
        <img alt="" className="block size-[16px]" src={imgClock} />
        <p className="font-['TT_Interphases_Pro:Regular'] leading-[18px] text-[#525252] text-[12px]">Last updated 18 Aug 2026, 09:30 WIB</p>
      </footer>
    </section>
  );
}
