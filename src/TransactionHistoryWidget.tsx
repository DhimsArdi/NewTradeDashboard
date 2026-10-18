import { useEffect, useRef, useState, type RefObject } from "react";
import { currentDataset } from "./devData";

const a = (file: string) => `/assets/transaction-history/${file}`;
const imgChevronDown = a("chevronDown.svg");
const imgChevronDown20 = a("chevronDown20.svg");
const imgFilterLines = a("filterLines.svg");
const imgMenuCheck = a("menuCheck.svg");
const imgCheckboxCheck = a("checkboxCheck.svg");
const imgSearch = a("search.svg");
const imgXClose = a("xClose.svg");
const imgClock = a("clock.svg");
const imgInfo = a("infoCircle.svg");
const imgAlert = a("alertCircle.svg");
const imgRefresh = a("refresh.svg");

// ---------- Demo data ----------

type Period = "Weekly" | "Monthly";

const months = ["Mar", "Apr", "May", "Jun", "Jul", "Aug"];
const monthNames = ["March", "April", "May", "June", "July", "August"];

// Last 8 weeks, Monday–Sunday, starting Mon 23 Jun 2026.
const weekStarts = Array.from({ length: 8 }, (_, i) => new Date(2026, 5, 23 + i * 7));
const shortMonth = (d: Date) => d.toLocaleString("en-US", { month: "short" });
const weekLabel = (d: Date) => `${d.getDate()} ${shortMonth(d)}`;
const weekRange = (d: Date) => {
  const end = new Date(d.getFullYear(), d.getMonth(), d.getDate() + 6);
  return end.getMonth() === d.getMonth()
    ? `${d.getDate()} – ${end.getDate()} ${shortMonth(end)} ${end.getFullYear()}`
    : `${weekLabel(d)} – ${weekLabel(end)} ${end.getFullYear()}`;
};

const periods: Record<Period, { labels: string[]; titles: string[]; unit: string; span: string }> = {
  Monthly: { labels: months, titles: monthNames.map((m) => `${m} 2026`), unit: "month", span: "last 6 months" },
  Weekly: { labels: weekStarts.map(weekLabel), titles: weekStarts.map(weekRange), unit: "week", span: "last 8 weeks" },
};

// `volume` is the monthly amount in thousands of USD.
type EventDef = { label: string; color: string; monthly: number[]; weekly: number[]; volume: number[] };
type Channel = { label: string; defaults: string[]; events: EventDef[] };

const channels: Channel[] = [
  {
    label: "Export LC",
    defaults: ["Document Presented", "Financed"],
    events: [
      { label: "Document Presented", color: "#099697", monthly: [5, 4, 7, 6, 9, 3], weekly: [2, 1, 3, 2, 2, 3, 1, 1], volume: [340, 290, 390, 440, 550, 200] },
      { label: "Financed", color: "#6bc0c1", monthly: [3, 2, 4, 3, 5, 2], weekly: [1, 1, 1, 0, 2, 1, 1, 0], volume: [200, 250, 300, 200, 350, 150] },
    ],
  },
  {
    label: "Outward Guarantee",
    defaults: ["Issued", "Amended"],
    events: [
      { label: "Issued", color: "#ff6b00", monthly: [8, 5, 9, 7, 10, 4], weekly: [2, 3, 1, 2, 3, 2, 1, 1], volume: [420, 310, 480, 390, 520, 260] },
      { label: "Amended", color: "#ffa666", monthly: [3, 2, 4, 3, 2, 1], weekly: [1, 0, 1, 1, 0, 1, 0, 0], volume: [90, 60, 120, 80, 70, 40] },
      { label: "Claimed", color: "#9ca3af", monthly: [1, 0, 1, 0, 1, 0], weekly: [0, 0, 1, 0, 0, 0, 0, 0], volume: [60, 0, 45, 0, 80, 0] },
      { label: "Expired", color: "#e5e7eb", monthly: [2, 4, 3, 5, 4, 2], weekly: [1, 1, 0, 1, 1, 1, 0, 1], volume: [30, 70, 50, 90, 60, 30] },
    ],
  },
  {
    label: "Inward Guarantee",
    defaults: ["Advised", "Amended"],
    events: [
      { label: "Advised", color: "#ff6b00", monthly: [4, 6, 3, 5, 7, 2], weekly: [1, 2, 1, 1, 2, 1, 0, 1], volume: [210, 330, 160, 270, 380, 110] },
      { label: "Amended", color: "#ffa666", monthly: [2, 1, 2, 3, 2, 1], weekly: [0, 1, 0, 1, 0, 1, 0, 0], volume: [40, 20, 40, 60, 40, 20] },
      { label: "Claim Instruction", color: "#9ca3af", monthly: [0, 1, 0, 1, 0, 0], weekly: [0, 0, 0, 0, 0, 0, 0, 0], volume: [0, 50, 0, 40, 0, 0] },
      { label: "Expired", color: "#e5e7eb", monthly: [1, 2, 1, 0, 2, 1], weekly: [0, 1, 0, 0, 1, 0, 0, 0], volume: [20, 40, 20, 0, 40, 20] },
    ],
  },
];

// Stress-test fixtures for the dev data toggle.
const worstChannels: Channel[] = [
  {
    label: "Standby Letter of Credit – Outward Guarantee",
    defaults: ["Issued", "Amended – Increase Amount", "Amended – Extend Expiry", "Claim Received", "Claim Paid", "Expired / Released"],
    events: [
      { label: "Issued", color: "#ff6b00", monthly: [1284, 0, 1102, 976, 1530, 812], weekly: [310, 288, 0, 342, 401, 275, 198, 366], volume: [2_600_000, 0, 2_100_000, 1_900_000, 2_950_000, 1_400_000] },
      { label: "Amended – Increase Amount", color: "#ffa666", monthly: [214, 0, 190, 160, 233, 98], weekly: [52, 44, 0, 61, 70, 38, 22, 49], volume: [410_000, 0, 360_000, 300_000, 450_000, 190_000] },
      { label: "Amended – Extend Expiry", color: "#ffd3b2", monthly: [96, 0, 80, 71, 112, 40], weekly: [20, 18, 0, 25, 31, 14, 9, 22], volume: [120_000, 0, 100_000, 90_000, 140_000, 50_000] },
      { label: "Claim Received", color: "#9ca3af", monthly: [12, 0, 9, 4, 17, 1], weekly: [3, 2, 0, 4, 5, 1, 0, 2], volume: [80_000, 0, 60_000, 30_000, 110_000, 9_000] },
      { label: "Claim Paid", color: "#6b7280", monthly: [7, 0, 5, 3, 11, 1], weekly: [2, 1, 0, 2, 3, 1, 0, 1], volume: [50_000, 0, 40_000, 20_000, 70_000, 7_000] },
      { label: "Expired / Released", color: "#e5e7eb", monthly: [402, 0, 377, 296, 455, 230], weekly: [98, 90, 0, 110, 121, 84, 60, 101], volume: [700_000, 0, 650_000, 520_000, 800_000, 400_000] },
    ],
  },
  ...channels,
];
const zeroed = (list: Channel[]): Channel[] =>
  list.map((c) => ({ ...c, events: c.events.map((e) => ({ ...e, monthly: e.monthly.map(() => 0), weekly: e.weekly.map(() => 0), volume: e.volume.map(() => 0) })) }));
const singleChannel: Channel[] = [
  {
    ...channels[0],
    defaults: ["Financed"],
    events: [{ ...channels[0].events[1], monthly: [0, 0, 0, 0, 1, 0], weekly: [0, 0, 0, 0, 1, 0, 0, 0], volume: [0, 0, 0, 0, 1, 0] }],
  },
];
const channelData = (): Channel[] => {
  const dataset = currentDataset();
  if (dataset === "worst") return worstChannels;
  if (dataset === "empty") return zeroed(channels);
  if (dataset === "one") return singleChannel;
  return channels;
};

const showByOptions = ["Transactions", "Volume"] as const;
type ShowBy = (typeof showByOptions)[number];

// Amounts are per transaction currency (not converted); scale turns the USD demo series into native-currency amounts.
const allCurrencies = ["USD", "EUR", "SGD", "JPY", "CNY", "IDR", "AUD", "GBP", "HKD"] as const;
type Currency = (typeof allCurrencies)[number];
const currencyScale: Record<Currency, number> = { USD: 1, EUR: 0.36, SGD: 0.6, JPY: 30, CNY: 2.1, IDR: 4800, AUD: 0.45, GBP: 0.28, HKD: 1.9 };
const CURRENCY_SEARCH_THRESHOLD = 6;

const AXIS_STEPS = 4;
const PLOT_TOP = 11;
const PLOT_HEIGHT = 183;
const Y_AXIS_WIDTH = 40;
const BARS_LEFT = 44;
const DIM_OPACITY = "opacity-35";
const BAR_STAGGER_MS = 30;
const MIN_SEGMENT = 3;
const TOOLTIP_W = 320;
const TOOLTIP_MIN_W = 240;
const TOOLTIP_OFFSET = 24; // half a bar + 12px gap
const TOOLTIP_EDGE = 20; // may extend into the widget padding, 4px short of its border
const skeletonHeights = [90, 120, 100, 150, 130, 170, 70, 110];

// Smallest "nice" axis maximum strictly above the data maximum.
const niceMax = (max: number, integer: boolean) => {
  const raw = max / AXIS_STEPS;
  const mag = 10 ** Math.floor(Math.log10(raw || 1));
  for (const s of integer ? [1, 2, 3, 5, 10] : [1, 2, 2.5, 5, 10]) {
    const step = s * mag;
    if (step * AXIS_STEPS > max && (!integer || Number.isInteger(step))) return step * AXIS_STEPS;
  }
  return 10 * mag * AXIS_STEPS;
};

// Axis labels share the unit of the top tick, e.g. 1M, 0.75M, 0.5M.
const axisLabel = (v: number, top: number) => {
  if (v === 0) return "0";
  const [div, suffix] = top >= 1e12 ? [1e12, "T"] : top >= 1e9 ? [1e9, "B"] : top >= 1e6 ? [1e6, "M"] : top >= 1e3 ? [1e3, "K"] : [1, ""];
  return `${+(v / div).toFixed(2)}${suffix}`;
};

const money = (n: number, c: Currency) =>
  `${c} ${n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

type Status = "loading" | "ready" | "empty" | "error";

// QA hooks:
// ?txState=empty|error|loading|partial forces a widget state (partial = some periods without transactions).
// ?txChannels=export,outward,inward limits the channels the customer owns.
// ?txCurrencies=<n> limits the number of transaction currencies.
const params = () => new URLSearchParams(window.location.search);
const forcedState = () => {
  const v = params().get("txState");
  return v === "empty" || v === "error" || v === "loading" || v === "partial" ? v : null;
};
const ownedChannels = () => {
  const all = channelData();
  const keys = params().get("txChannels")?.split(",").map((k) => k.trim().toLowerCase());
  const owned = keys ? all.filter((c) => keys.some((k) => k && c.label.toLowerCase().startsWith(k))) : [];
  return owned.length ? owned : all;
};
const ownedCurrencies = (): Currency[] => {
  if (currentDataset() === "one") return ["USD"];
  const n = Number(params().get("txCurrencies"));
  return n > 0 ? allCurrencies.slice(0, n) : [...allCurrencies];
};

// ---------- Building blocks ----------

function useDismiss(ref: RefObject<HTMLElement | null>, open: boolean, onClose: () => void) {
  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => !ref.current?.contains(e.target as Node) && onClose();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [ref, open, onClose]);
}

const menuShadow = "shadow-[0px_12px_16px_-4px_rgba(0,0,0,0.08),0px_4px_6px_-2px_rgba(0,0,0,0.03)]";
const focusRing = "focus-visible:shadow-[0_0_0_2px_white,0_0_0_4px_#099697]";

function MenuItem({ label, selected, onSelect }: { label: string; selected: boolean; onSelect: () => void }) {
  return (
    <li className="px-[6px] py-px">
      <button
        type="button"
        role="option"
        aria-selected={selected}
        onClick={onSelect}
        className={`flex w-full items-center gap-[8px] p-[8px] rounded-[6px] text-left hover:bg-[#fafafa] focus-visible:bg-[#fafafa] outline-none ${selected ? "bg-[#fafafa]" : ""}`}
      >
        <span className="flex-1 py-[2px] font-['TT_Interphases_Pro:Medium'] leading-[20px] text-[#404040] text-[14px]">{label}</span>
        {selected && <img alt="" className="block size-[20px] shrink-0" src={imgMenuCheck} />}
      </button>
    </li>
  );
}

function Select<T extends string>({
  value, options, open, onOpen, onChange, label, menuWidth, className = "",
}: {
  value: T; options: readonly T[]; open: boolean; onOpen: (open: boolean) => void; onChange: (v: T) => void;
  label: string; menuWidth: number; className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  useDismiss(ref, open, () => onOpen(false));

  return (
    <div ref={ref} className={`relative ${className}`}>
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={label}
        onClick={() => onOpen(!open)}
        className={`th-press bg-white border-solid flex gap-[8px] items-center rounded-[8px] shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05)] w-full text-left outline-none ${focusRing} ${open ? "border-2 border-[#ff8a2d] px-[11px] py-[7px]" : "border border-[#d4d4d4] px-[12px] py-[8px] hover:border-[#a3a3a3]"}`}
      >
        <span title={value} className="flex-1 min-w-0 truncate font-['TT_Interphases_Pro:Regular'] leading-[20px] text-[#171717] text-[14px]">{value}</span>
        <img alt="" className="block size-[18px] shrink-0" src={imgChevronDown} />
      </button>
      {open && (
        <ul
          role="listbox"
          aria-label={label}
          className={`th-pop origin-top-left absolute left-0 top-[calc(100%+4px)] z-30 bg-white border border-[#d4d4d4] rounded-[8px] py-[8px] ${menuShadow}`}
          style={{ width: "max-content", minWidth: `max(100%, ${menuWidth}px)`, maxWidth: "min(320px, calc(100vw - 32px))" }}
        >
          {options.map((option) => (
            <MenuItem
              key={option}
              label={option}
              selected={option === value}
              onSelect={() => {
                onChange(option);
                onOpen(false);
              }}
            />
          ))}
        </ul>
      )}
    </div>
  );
}

function Checkbox({ checked, disabled }: { checked: boolean; disabled: boolean }) {
  return (
    <span
      aria-hidden
      className={`relative shrink-0 size-[16px] rounded-[4px] border border-solid transition-colors duration-100 ${checked ? "bg-[#ff6b00] border-[#ff6b00]" : "bg-white border-[#d4d4d4]"} ${disabled ? "opacity-50" : ""}`}
    >
      {checked && <img alt="" className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 block size-[12px] max-w-none" src={imgCheckboxCheck} />}
    </span>
  );
}

function EventsFilter({
  channel, selected, onToggle, open, onOpen,
}: { channel: Channel; selected: string[]; onToggle: (label: string) => void; open: boolean; onOpen: (open: boolean) => void }) {
  const ref = useRef<HTMLDivElement>(null);
  useDismiss(ref, open, () => onOpen(false));
  const lastOne = selected.length === 1;

  return (
    <div ref={ref} className="relative shrink-0 ml-auto">
      <button
        type="button"
        aria-haspopup="true"
        aria-expanded={open}
        onClick={() => onOpen(!open)}
        className={`th-press bg-white border border-solid drop-shadow-[0px_1px_1px_rgba(0,0,0,0.05)] flex gap-[4px] items-center justify-center px-[12px] py-[8px] rounded-[8px] outline-none ${focusRing} ${open ? "border-[#d1d5db] shadow-[0_0_0_4px_rgba(152,162,179,0.14)]" : "border-[#d4d4d4] hover:bg-[#fafafa]"}`}
      >
        <img alt="" className="block size-[20px] shrink-0" src={imgFilterLines} />
        <span className="px-[2px] font-['TT_Interphases_Pro:Regular'] leading-[20px] text-[#404040] text-[14px] whitespace-nowrap">Events ({selected.length})</span>
      </button>
      {open && (
        <div
          role="group"
          aria-label={`${channel.label} events`}
          className={`th-pop origin-top-right absolute right-0 top-[calc(100%+4px)] z-30 w-max min-w-[240px] max-w-[min(320px,calc(100vw-32px))] bg-white border border-[#e5e5e5] rounded-[8px] py-[4px] ${menuShadow}`}
        >
          {channel.events.map((e) => {
            const checked = selected.includes(e.label);
            const locked = checked && lastOne;
            return (
              <button
                key={e.label}
                type="button"
                role="checkbox"
                aria-checked={checked}
                aria-disabled={locked}
                onClick={() => !locked && onToggle(e.label)}
                className={`flex w-full items-center gap-[12px] px-[16px] py-[12px] text-left outline-none focus-visible:bg-[#fafafa] ${locked ? "cursor-not-allowed" : "hover:bg-[#fafafa]"}`}
              >
                <Checkbox checked={checked} disabled={locked} />
                <span className="rounded-[2px] shrink-0 size-[10px]" style={{ background: e.color }} />
                <span className="font-['TT_Interphases_Pro:Regular'] leading-[20px] text-[#404040] text-[14px]">{e.label}</span>
              </button>
            );
          })}
          {lastOne && (
            <p className="px-[16px] pt-[4px] pb-[8px] font-['TT_Interphases_Pro:Regular'] leading-[18px] text-[#525252] text-[12px]">
              At least one event stays selected.
            </p>
          )}
        </div>
      )}
    </div>
  );
}

function CurrencyPicker({
  value, options, onChange, open, onOpen,
}: { value: Currency; options: Currency[]; onChange: (c: Currency) => void; open: boolean; onOpen: (open: boolean) => void }) {
  const ref = useRef<HTMLDivElement>(null);
  const [query, setQuery] = useState("");
  const searchable = options.length > CURRENCY_SEARCH_THRESHOLD;
  useDismiss(ref, open, () => onOpen(false));

  useEffect(() => {
    if (!open) setQuery("");
  }, [open]);

  const matches = options.filter((c) => c.toLowerCase().includes(query.trim().toLowerCase()));

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={`Currency: ${value}`}
        onClick={() => onOpen(!open)}
        className={`th-press bg-[#fafafa] drop-shadow-[0px_1px_1px_rgba(0,0,0,0.05)] flex gap-[4px] items-center justify-center px-[8px] py-[4px] rounded-[8px] outline-none hover:bg-[#f5f5f5] ${focusRing} ${open ? "shadow-[0_0_0_4px_rgba(152,162,179,0.2)]" : ""}`}
      >
        <span className="px-[2px] font-['TT_Interphases_Pro:DemiBold'] leading-[20px] text-[#404040] text-[14px]">{value}</span>
        <img alt="" className="block size-[20px] shrink-0" src={imgChevronDown20} />
      </button>
      {open && (
        <div
          className={`th-pop origin-top-left absolute left-0 top-[calc(100%+4px)] z-30 flex flex-col bg-white border border-[#d4d4d4] rounded-[8px] py-[4px] overflow-hidden ${menuShadow}`}
          style={{ width: searchable ? 200 : 160 }}
        >
          {searchable && (
            <div className="pt-[10px] px-[14px] pb-[4px]">
              <label className="group flex items-center gap-[8px] bg-white border border-[#d4d4d4] rounded-[8px] px-[14px] py-[10px] shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05)] focus-within:border-2 focus-within:border-[#ff8a2d] focus-within:px-[13px] focus-within:py-[9px] focus-within:shadow-none">
                <img alt="" className="block size-[20px] shrink-0" src={imgSearch} />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search currency"
                  aria-label="Search currency"
                  className="flex-1 min-w-0 bg-transparent outline-none font-['TT_Interphases_Pro:Regular'] leading-[24px] text-[16px] text-[#171717] placeholder:text-[#737373]"
                />
                {query && (
                  <button type="button" aria-label="Clear search" onClick={() => setQuery("")} className="th-press shrink-0 rounded-[4px] outline-none focus-visible:bg-[#f5f5f5]">
                    <img alt="" className="block size-[20px]" src={imgXClose} />
                  </button>
                )}
              </label>
            </div>
          )}
          <ul role="listbox" aria-label="Currency" className="py-[4px] max-h-[264px] overflow-y-auto">
            {matches.length ? (
              matches.map((c) => (
                <MenuItem
                  key={c}
                  label={c}
                  selected={c === value}
                  onSelect={() => {
                    onChange(c);
                    onOpen(false);
                  }}
                />
              ))
            ) : (
              <li className="px-[6px] py-px">
                <p className="p-[8px] py-[10px] font-['TT_Interphases_Pro:Medium'] leading-[20px] text-[#404040] text-[14px]">No currency found</p>
              </li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
}

function StateBody({ kind, span, onRetry }: { kind: "empty" | "error"; span: string; onRetry: () => void }) {
  const isError = kind === "error";
  return (
    <div className="flex h-[272px] w-full flex-col items-center justify-center">
      <div className="flex flex-col gap-[16px] items-center py-[48px] w-full text-center">
        {isError ? (
          <div className="relative bg-[#fee4e2] rounded-[24px] size-[48px] shrink-0">
            <img alt="" className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 size-[28px]" src={imgAlert} />
          </div>
        ) : (
          <div className="relative bg-white border border-[#e4e7ec] rounded-[10px] size-[48px] shrink-0 shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05),inset_0px_-2px_0px_0px_rgba(16,24,40,0.05)]">
            <img alt="" className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 size-[24px]" src={imgInfo} />
          </div>
        )}
        <div className="flex flex-col gap-[4px] items-center w-full" role={isError ? "alert" : undefined}>
          <p className="font-['TT_Interphases_Pro:DemiBold'] leading-[24px] text-[#171717] text-[16px]">
            {isError ? "Transaction History data is unavailable" : "No transactions yet"}
          </p>
          <p className="font-['TT_Interphases_Pro:Regular'] leading-[20px] text-[#525252] text-[14px]">
            {isError ? "We couldn't load this data right now. Please try again." : `Completed transactions from the ${span} will appear here.`}
          </p>
        </div>
        {isError && (
          <button
            type="button"
            onClick={onRetry}
            className={`th-press bg-white border border-[#d4d4d4] drop-shadow-[0px_1px_1px_rgba(0,0,0,0.05)] flex gap-[4px] items-center justify-center px-[12px] py-[8px] rounded-full hover:bg-[#fafafa] outline-none ${focusRing}`}
          >
            <img alt="" className="block size-[20px]" src={imgRefresh} />
            <span className="px-[2px] font-['TT_Interphases_Pro:DemiBold'] leading-[20px] text-[#404040] text-[14px]">Retry</span>
          </button>
        )}
      </div>
    </div>
  );
}

// ---------- Widget ----------

export default function TransactionHistoryWidget({ className = "" }: { className?: string }) {
  const [owned] = useState(ownedChannels);
  const [currencies] = useState(ownedCurrencies);
  const [channelLabel, setChannelLabel] = useState(owned[0].label);
  const [selectedEvents, setSelectedEvents] = useState<string[]>(owned[0].defaults);
  const [period, setPeriod] = useState<Period>("Monthly");
  const [showBy, setShowBy] = useState<ShowBy>("Transactions");
  const [currency, setCurrency] = useState<Currency>(currencies[0]);
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [hovered, setHovered] = useState<number | null>(null);
  const [status, setStatus] = useState<Status>("loading");
  const [reloadKey, setReloadKey] = useState(0);
  const chartRef = useRef<HTMLDivElement>(null);
  const [chartWidth, setChartWidth] = useState(0);
  const forced = forcedState();

  // Simulated fetch whenever the query changes; toggling events filters client-side.
  useEffect(() => {
    setStatus("loading");
    setHovered(null);
    if (forced === "loading") return;
    const t = window.setTimeout(() => setStatus(forced === "empty" || forced === "error" ? forced : "ready"), 450);
    return () => window.clearTimeout(t);
  }, [channelLabel, period, showBy, currency, reloadKey, forced]);

  const channel = owned.find((c) => c.label === channelLabel) ?? owned[0];
  const changeChannel = (label: string) => {
    if (label === channelLabel) return;
    setChannelLabel(label);
    setSelectedEvents(owned.find((c) => c.label === label)!.defaults);
  };
  const toggleEvent = (label: string) =>
    setSelectedEvents((prev) =>
      prev.includes(label) ? prev.filter((l) => l !== label) : channel.events.filter((e) => e.label === label || prev.includes(e.label)).map((e) => e.label),
    );

  const isVolume = showBy === "Volume";
  const { labels, titles, unit, span } = periods[period];
  const events = channel.events.filter((e) => selectedEvents.includes(e.label));
  const series = events.map((e) => {
    const counts = period === "Monthly" ? e.monthly : e.weekly;
    const ticket = e.volume.reduce((s, v) => s + v, 0) / Math.max(1, e.monthly.reduce((s, v) => s + v, 0));
    const values = counts.map((count, i) => {
      if (forced === "partial" && i % 2 === 1 && i < 4) return 0;
      if (!isVolume) return count;
      const usdK = period === "Monthly" ? e.volume[i] : count * ticket;
      return Math.round(usdK * 1000 * currencyScale[currency]);
    });
    return { ...e, values };
  });
  const totals = labels.map((_, i) => series.reduce((s, e) => s + e.values[i], 0));
  const top = niceMax(Math.max(0, ...totals), !isVolume);
  // A successful response with nothing in it gets the empty state, not a blank grid.
  const noData = status === "ready" && totals.every((t) => t === 0);
  const hasChart = status !== "empty" && status !== "error" && !noData;

  useEffect(() => {
    const el = chartRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => setChartWidth(entry.contentRect.width));
    ro.observe(el);
    return () => ro.disconnect();
  }, [hasChart]);
  const ticks = Array.from({ length: AXIS_STEPS + 1 }, (_, i) => (top / AXIS_STEPS) * (AXIS_STEPS - i));
  const fmt = (v: number) => (isVolume ? money(v, currency) : v.toLocaleString("en-US"));
  const fmtTotal = (v: number) => (v === 0 ? "No transactions" : isVolume ? money(v, currency) : `${v.toLocaleString("en-US")} transaction${v === 1 ? "" : "s"}`);

  const singleChannel = owned.length === 1;
  const subtitle = singleChannel
    ? `${channel.label} · ${isVolume ? "volume " : ""}per ${unit} · ${span}`
    : `${isVolume ? "Volume" : "Completed"} per ${unit} · ${span}`;

  const menu = (id: string) => ({ open: openMenu === id, onOpen: (o: boolean) => setOpenMenu(o ? id : null) });
  const n = labels.length;
  const loading = status === "loading";

  // Tooltip sits beside the hovered bar: right side when it fits, else left, else the roomier side, kept inside the widget.
  const tooltipBox = (i: number) => {
    const center = BARS_LEFT + ((chartWidth - BARS_LEFT) * (i + 0.5)) / n;
    const minX = -TOOLTIP_EDGE;
    const maxX = chartWidth + TOOLTIP_EDGE;
    const roomRight = maxX - center - TOOLTIP_OFFSET;
    const roomLeft = center - TOOLTIP_OFFSET - minX;
    const fit = (room: number) => Math.min(TOOLTIP_W, Math.max(TOOLTIP_MIN_W, room), maxX - minX);
    if (roomRight >= TOOLTIP_W || (roomLeft < TOOLTIP_W && roomRight >= roomLeft)) {
      const width = fit(roomRight);
      return { left: Math.min(center + TOOLTIP_OFFSET, maxX - width), width, transformOrigin: "left top" };
    }
    const width = fit(roomLeft);
    return { left: Math.max(minX, center - TOOLTIP_OFFSET - width), width, transformOrigin: "right top" };
  };

  return (
    <section
      aria-label="Transaction History"
      className={`bg-white border border-[#e5e5e5] border-solid flex flex-col gap-[20px] items-start p-[24px] relative rounded-[16px] ${className}`}
      data-name="Widget / Transaction History"
    >
      <header className="flex flex-wrap gap-[12px_16px] items-start w-full">
        <div className="flex flex-[1_1_200px] min-w-0 flex-col gap-[2px] justify-center self-stretch">
          <h2 className="font-['TT_Interphases_Pro:Bold'] leading-[1.2] text-[#171717] text-[18px]">Transaction History</h2>
          <p className="font-['TT_Interphases_Pro:Regular'] leading-[20px] text-[#525252] text-[14px]">{subtitle}</p>
        </div>
        <div role="group" aria-label="Period" className="bg-[#fafafa] border border-[#e5e5e5] flex gap-[2px] items-center rounded-[8px] shrink-0">
          {(["Weekly", "Monthly"] as const).map((p) => {
            const active = p === period;
            return (
              <button
                key={p}
                type="button"
                aria-pressed={active}
                onClick={() => setPeriod(p)}
                className={`th-press flex h-[36px] items-center justify-center px-[12px] py-[8px] rounded-[8px] border outline-none font-['TT_Interphases_Pro:DemiBold'] leading-[20px] text-[14px] whitespace-nowrap ${focusRing} ${active ? "bg-white border-[#d4d4d4] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] text-[#404040]" : "border-transparent text-[#737373] hover:text-[#404040]"}`}
              >
                {p}
              </button>
            );
          })}
        </div>
      </header>

      <div className="flex flex-col gap-[16px] w-full">
        <div className="flex flex-wrap gap-[8px] items-start w-full">
          {!singleChannel && (
            <Select
              label="Product"
              className="flex-[1_1_0] min-w-[140px]"
              menuWidth={200}
              value={channel.label}
              options={owned.map((c) => c.label)}
              onChange={changeChannel}
              {...menu("product")}
            />
          )}
          <Select
            label="Show by"
            className={singleChannel ? "flex-[1_1_0] min-w-[140px]" : "flex-[0_1_150px] min-w-[130px]"}
            menuWidth={160}
            value={showBy}
            options={showByOptions}
            onChange={setShowBy}
            {...menu("showBy")}
          />
          <EventsFilter channel={channel} selected={selectedEvents} onToggle={toggleEvent} {...menu("events")} />
        </div>
        {isVolume && (
          <div className="flex gap-[4px] items-center">
            <p className="font-['TT_Interphases_Pro:Regular'] leading-[20px] text-[#525252] text-[14px]">Amount in</p>
            {currencies.length > 1 ? (
              <CurrencyPicker value={currency} options={currencies} onChange={setCurrency} {...menu("currency")} />
            ) : (
              <p className="font-['TT_Interphases_Pro:DemiBold'] leading-[20px] text-[#404040] text-[14px]">{currency}</p>
            )}
          </div>
        )}
      </div>

      {!hasChart ? (
        <StateBody kind={status === "error" ? "error" : "empty"} span={span} onRetry={() => setReloadKey((k) => k + 1)} />
      ) : (
        <>
          <div ref={chartRef} className="relative h-[220px] w-full" aria-busy={loading} onMouseLeave={() => setHovered(null)}>
            {ticks.map((t, i) => {
              const y = PLOT_TOP + (PLOT_HEIGHT / AXIS_STEPS) * i;
              return (
                <div key={i} className="absolute left-0 right-0 flex items-center gap-[8px] -translate-y-1/2" style={{ top: y }}>
                  <p className={`shrink-0 text-right font-['TT_Interphases_Pro:Regular'] leading-[18px] text-[#525252] text-[12px] ${loading ? "invisible" : ""}`} style={{ width: Y_AXIS_WIDTH }}>
                    {axisLabel(t, top)}
                  </p>
                  <div className="flex-1 h-px bg-[#e5e5e5]" />
                </div>
              );
            })}

            <div className="absolute right-0 flex items-end" style={{ left: BARS_LEFT, top: PLOT_TOP, height: PLOT_HEIGHT }}>
              {labels.map((label, i) => {
                if (loading) {
                  return (
                    <div key={label} className="flex flex-1 min-w-px h-full items-end justify-center">
                      <div className="bg-[#f5f5f5] rounded-t-[4px] w-[24px] animate-pulse" style={{ height: (skeletonHeights[i % skeletonHeights.length] / 200) * PLOT_HEIGHT }} />
                    </div>
                  );
                }
                const dim = hovered !== null && hovered !== i;
                const parts = series.filter((s) => s.values[i] > 0);
                return (
                  <button
                    key={label}
                    type="button"
                    aria-label={`${titles[i]}: ${series.map((s) => `${s.label} ${fmt(s.values[i])}`).join(", ")}`}
                    onMouseEnter={() => setHovered(i)}
                    onFocus={() => setHovered(i)}
                    onBlur={() => setHovered(null)}
                    className={`th-dim flex flex-1 min-w-px h-full items-end justify-center outline-none cursor-default ${dim ? DIM_OPACITY : ""}`}
                  >
                    {parts.length > 0 && (
                      <div
                        className="th-bar-in flex w-[24px] flex-col-reverse gap-[2px] overflow-hidden rounded-t-[4px]"
                        style={{ animationDelay: `${i * BAR_STAGGER_MS}ms` }}
                      >
                        {parts.map((s, j) => (
                          <div
                            key={s.label}
                            className="w-full shrink-0"
                            style={{ height: Math.max(MIN_SEGMENT, (s.values[i] / top) * PLOT_HEIGHT - (j > 0 ? 2 : 0)), background: s.color }}
                          />
                        ))}
                      </div>
                    )}
                  </button>
                );
              })}
            </div>

            <div className="absolute bottom-0 right-0 flex h-[18px]" style={{ left: BARS_LEFT }}>
              {labels.map((label) => (
                <p key={label} className={`flex-1 min-w-px text-center whitespace-nowrap font-['TT_Interphases_Pro:Regular'] leading-[18px] text-[#525252] text-[12px] ${loading ? "invisible" : ""}`}>
                  {label}
                </p>
              ))}
            </div>

            {hovered !== null && status === "ready" && (
              <div
                role="tooltip"
                className={`th-tooltip pointer-events-none absolute z-20 top-[8px] bg-white border border-[#e5e5e5] flex flex-col gap-[8px] p-[12px] rounded-[8px] ${menuShadow}`}
                style={tooltipBox(hovered)}
              >
                <div className="flex items-center justify-between gap-[8px] whitespace-nowrap">
                  <p className="font-['TT_Interphases_Pro:DemiBold'] leading-[20px] text-[#171717] text-[14px]">{titles[hovered]}</p>
                  <p className="font-['TT_Interphases_Pro:Regular'] leading-[18px] text-[#525252] text-[12px]">{fmtTotal(totals[hovered])}</p>
                </div>
                <div className="flex flex-col gap-[4px]">
                  {series.map((s) => (
                    <div key={s.label} className="flex gap-[6px] items-center">
                      <span className="rounded-[2px] size-[8px] shrink-0" style={{ background: s.color }} />
                      <p className="flex-1 min-w-px font-['TT_Interphases_Pro:Regular'] leading-[18px] text-[#404040] text-[12px]">{s.label}</p>
                      <p className="font-['TT_Interphases_Pro:DemiBold'] leading-[20px] text-[#171717] text-[14px] whitespace-nowrap">{fmt(s.values[hovered])}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {loading ? (
            <div className="flex h-[20px] items-center w-full">
              <div className="bg-[#f5f5f5] h-[12px] rounded-[4px] w-[300px] max-w-full animate-pulse" />
            </div>
          ) : (
            <ul aria-label="Legend" className="flex flex-wrap gap-[4px_12px] items-start">
              {series.map((s) => (
                <li key={s.label} className="flex gap-[8px] items-center">
                  <span className="rounded-full size-[8px] shrink-0" style={{ background: s.color }} />
                  <span className="font-['TT_Interphases_Pro:Regular'] leading-[20px] text-[#525252] text-[14px] whitespace-nowrap">{s.label}</span>
                </li>
              ))}
            </ul>
          )}
        </>
      )}

      <footer className="border-t border-[#e5e5e5] flex items-center gap-[6px] pt-[16px] w-full">
        <img alt="" className="block size-[16px]" src={imgClock} />
        <p className="font-['TT_Interphases_Pro:Regular'] leading-[18px] text-[#525252] text-[12px]">Last updated 18 Aug 2026, 09:30 WIB</p>
      </footer>
    </section>
  );
}
