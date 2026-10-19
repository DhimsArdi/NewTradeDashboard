import { useEffect, useRef, useState } from "react";
import { currentDataset } from "./devData";

const a = (file: string) => `/assets/${file}`;
const imgChevronDown = a("transaction-history/chevronDown.svg");
const imgChevronUp = a("73c3d.svg");
const imgMenuCheck = a("transaction-history/menuCheck.svg");
const imgClock = a("efc9f.svg");
const imgAlert = a("transaction-history/alertCircle.svg");
const imgRefresh = a("transaction-history/refresh.svg");

// ---------- Demo data ----------

// All facilities share one currency. The dropdown and the usage summary list the same facilities in the
// same order (Figma 24:48271). Expiry dates other than Bill Purchasing Line's are demo values.
type Facility = { name: string; total: number; outstanding: number; expiry: string };

const CURRENCY = "IDR";
const COLOR_OUTSTANDING = "#099697";
const COLOR_AVAILABLE = "#6bc0c1";

const baseFacilities: Facility[] = [
  { name: "Bill Purchasing Line", total: 900_000_000, outstanding: 500_000_000, expiry: "30 Dec 2026" },
  { name: "Sub Limit Export", total: 600_000_000, outstanding: 270_000_000, expiry: "30 Dec 2026" },
  { name: "Local GB Facility Line", total: 1_200_000_000, outstanding: 840_000_000, expiry: "31 Mar 2027" },
  { name: "Guarantee Line", total: 750_000_000, outstanding: 225_000_000, expiry: "30 Jun 2027" },
  { name: "Sub Limit Bank Guarantee", total: 500_000_000, outstanding: 410_000_000, expiry: "31 Mar 2027" },
];

const money = (n: number) => `${CURRENCY} ${n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
const usedPct = (f: Facility) => (f.total > 0 ? Math.min(100, Math.round((f.outstanding / f.total) * 100)) : 0);

// Usage summary rows: 58px tall, 20px apart. The list shows three and a peek of the fourth, then scrolls.
const ROW_H = 58;
const ROW_GAP = 20;
const LIST_MAX_H = 248;
const listHeight = (n: number) => Math.min(LIST_MAX_H, n * ROW_H + (n - 1) * ROW_GAP);

type Status = "loading" | "ready" | "error";

// QA hooks:
// ?lfState=loading|error forces a widget state; full = the last facility fully used; large = amounts in trillions.
// ?lfFacilities=<n>|none keeps the first n facilities the customer owns (none hides the widget).
const params = () => new URLSearchParams(window.location.search);
const scenario = () => params().get("lfState");
// Stress-test fixture for the dev data toggle: a huge untouched limit, an over-limit facility, long names, and a long list.
const worstFacilities: Facility[] = [
  { name: "Bill Purchasing Line", total: 125_000_000_000_000, outstanding: 0, expiry: "30 Dec 2026" },
  { name: "Sub Limit Bank Guarantee", total: 690_000_000, outstanding: 731_500_000, expiry: "31 Mar 2027" },
  { name: "Standby Letter of Credit Facility – Syndicated (Tranche B)", total: 20_000_000_000_000, outstanding: 19_999_000_000_000, expiry: "31 Dec 2030" },
  ...baseFacilities.slice(1, 4),
  { name: "Pre-Shipment Financing Line", total: 350_000_000, outstanding: 1_000_000, expiry: "30 Sep 2027" },
];

const ownedFacilities = (): Facility[] => {
  const dataset = currentDataset();
  if (dataset === "worst") return worstFacilities;
  if (dataset === "empty") return [];
  if (dataset === "one") return baseFacilities.slice(0, 1);
  let list = baseFacilities;
  if (scenario() === "full") list = list.map((f, i) => (i === list.length - 1 ? { ...f, outstanding: f.total } : f));
  if (scenario() === "large") list = list.map((f, i) => (i === 0 ? { ...f, total: 20_000_000_000_000, outstanding: 7_500_000_000_000 } : { ...f, total: f.total * 10_000, outstanding: f.outstanding * 10_000 }));
  const owned = params().get("lfFacilities");
  if (owned === "none") return [];
  const n = Number(owned);
  return n > 0 ? list.slice(0, n) : list;
};

// ---------- Building blocks ----------

const focusRing = "focus-visible:shadow-[0_0_0_2px_white,0_0_0_4px_#099697]";

function FacilitySelect({ value, options, onChange }: { value: string; options: string[]; onChange: (v: string) => void }) {
  const ref = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => !ref.current?.contains(e.target as Node) && setOpen(false);
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div ref={ref} className="relative w-full">
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={`Facility: ${value}`}
        onClick={() => setOpen((o) => !o)}
        className={`th-press bg-white border border-[#d4d4d4] flex gap-[8px] items-center px-[12px] py-[7px] rounded-[8px] shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05)] w-full text-left outline-none hover:border-[#a3a3a3] ${focusRing}`}
      >
        <span className="flex-1 min-w-0 truncate font-['TT_Interphases_Pro:Regular'] leading-[20px] text-[#171717] text-[14px]">{value}</span>
        <img alt="" className="block size-[18px] shrink-0" src={open ? imgChevronUp : imgChevronDown} />
      </button>
      {open && (
        <ul
          role="listbox"
          aria-label="Facility"
          className="th-pop origin-top absolute left-0 right-0 top-[calc(100%+6px)] z-30 bg-white border border-[#d4d4d4] rounded-[8px] py-[7px] shadow-[0px_12px_16px_-4px_rgba(0,0,0,0.08),0px_4px_6px_-2px_rgba(0,0,0,0.03)]"
        >
          {options.map((option) => {
            const selected = option === value;
            return (
              <li key={option} className="px-[6px] py-px">
                <button
                  type="button"
                  role="option"
                  aria-selected={selected}
                  onClick={() => {
                    onChange(option);
                    setOpen(false);
                  }}
                  className={`flex w-full items-center gap-[8px] p-[8px] rounded-[6px] text-left outline-none hover:bg-[#fafafa] focus-visible:bg-[#fafafa] ${selected ? "bg-[#fafafa]" : ""}`}
                >
                  <span className="flex-1 py-[2px] font-['TT_Interphases_Pro:Medium'] leading-[20px] text-[#404040] text-[14px] whitespace-nowrap">{option}</span>
                  {selected && <img alt="" className="block size-[20px] shrink-0" src={imgMenuCheck} />}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

// Bold 24px headline amount; shrinks with the card width for very long amounts so digits are never split or cut.
function FitAmount({ value }: { value: string }) {
  return (
    <div className="w-full [container-type:inline-size]">
      <p
        className="font-['TT_Interphases_Pro:Bold'] leading-[1.2] text-[#171717] whitespace-nowrap tabular-nums"
        style={{ fontSize: `min(24px, calc(100cqi / ${(value.length * 0.52).toFixed(2)}))` }}
      >
        {value}
      </p>
    </div>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-wrap items-center gap-x-[8px] w-full">
      <p className="font-['TT_Interphases_Pro:Regular'] leading-[20px] text-[#525252] text-[14px] whitespace-nowrap">{label}</p>
      <p className="ml-auto font-['TT_Interphases_Pro:DemiBold'] leading-[24px] text-[#404040] text-[16px] text-right whitespace-nowrap tabular-nums">{value}</p>
    </div>
  );
}

// Bars grow from the left once data arrives; delay is staggered per row.
function UsageBar({ pct, delay }: { pct: number; delay: number }) {
  return (
    <div className="lf-bar-in flex gap-[2px] w-full" style={{ animationDelay: `${delay}ms` }} role="img" aria-label={`${pct}% used`}>
      {pct > 0 && (
        <div className="h-[8px] rounded-[4px] shrink-0" style={{ width: pct >= 100 ? "100%" : `calc((100% - 2px) * ${pct / 100})`, background: COLOR_OUTSTANDING }} />
      )}
      {pct < 100 && <div className="flex-1 min-w-px h-[8px] rounded-[4px]" style={{ background: COLOR_AVAILABLE }} />}
    </div>
  );
}

const Skel = ({ w, h, className = "" }: { w: number | string; h: number; className?: string }) => (
  <div className={`bg-[#f5f5f5] rounded-[4px] shrink-0 max-w-full animate-pulse ${className}`} style={{ width: w, height: h }} />
);

function LegendDot({ color }: { color: string }) {
  return (
    <span className="flex items-center justify-center shrink-0 size-[20px]">
      <span className="rounded-full size-[8px]" style={{ background: color }} />
    </span>
  );
}

function UsageHeader({ loading }: { loading: boolean }) {
  return (
    <>
      <div className="flex flex-col gap-[12px] w-full">
        <h3 className="font-['TT_Interphases_Pro:DemiBold'] leading-[24px] text-[#171717] text-[16px]">Usage Summary</h3>
        <div className="h-px w-full bg-[#e5e5e5]" />
      </div>
      <ul aria-label="Legend" className="flex gap-[20px] items-center">
        {[
          ["Outstanding", COLOR_OUTSTANDING],
          ["Available", COLOR_AVAILABLE],
        ].map(([label, color]) => (
          <li key={label} className="flex items-center">
            <LegendDot color={loading ? "#f5f5f5" : color} />
            <span className="font-['TT_Interphases_Pro:Regular'] leading-[20px] text-[#404040] text-[14px]">{label}</span>
          </li>
        ))}
      </ul>
    </>
  );
}

// Native overlay scrollbars hide until scrolled, so the thumb is drawn here and kept visible (as in the calendar list).
function UsageList({ facilities }: { facilities: Facility[] }) {
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
  }, [facilities]);

  return (
    <div className="relative w-full" style={{ maxHeight: LIST_MAX_H }}>
      <ul
        ref={ref}
        aria-label="Usage by facility"
        onScroll={measure}
        className="cal-scroll flex flex-col gap-[20px] w-full overflow-x-clip overflow-y-auto data-[overflow=true]:pr-[12px]"
        style={{ maxHeight: LIST_MAX_H }}
      >
        {facilities.map((f, i) => {
          const pct = usedPct(f);
          return (
            <li key={f.name} className="flex flex-col gap-[6px] w-full shrink-0">
              <div className="flex items-start justify-between gap-[8px] leading-[20px] text-[14px] whitespace-nowrap w-full">
                <p title={f.name} className="font-['TT_Interphases_Pro:DemiBold'] text-[#171717] truncate">{f.name}</p>
                <p className="font-['TT_Interphases_Pro:Regular'] text-[#404040]">{pct}% used</p>
              </div>
              <UsageBar pct={pct} delay={Math.min(i, 3) * 60} />
              <p className="font-['TT_Interphases_Pro:Regular'] leading-[18px] text-[#525252] text-[12px]">
                <span className="whitespace-nowrap">{money(f.total - f.outstanding)}</span> available of{" "}
                <span className="whitespace-nowrap">{money(f.total)}</span>
              </p>
            </li>
          );
        })}
      </ul>
      <div ref={thumbRef} aria-hidden className="pointer-events-none absolute right-0 top-0 hidden w-[4px] rounded-[2px] bg-[#d4d4d4]" />
    </div>
  );
}

// ---------- Widget ----------

export default function LimitFacilityWidget({ className = "" }: { className?: string }) {
  const [facilities] = useState(ownedFacilities);
  const [selectedName, setSelectedName] = useState(facilities[0]?.name ?? "");
  const [status, setStatus] = useState<Status>("loading");
  const [reloadKey, setReloadKey] = useState(0);

  // Simulated fetch.
  useEffect(() => {
    setStatus("loading");
    const forced = scenario();
    if (forced === "loading") return;
    const t = window.setTimeout(() => setStatus(forced === "error" ? "error" : "ready"), 450);
    return () => window.clearTimeout(t);
  }, [reloadKey]);

  // No facility: the widget is not shown at all.
  if (!facilities.length) return null;

  const facility = facilities.find((f) => f.name === selectedName) ?? facilities[0];
  const single = facilities.length === 1;
  // Content height with data (info box + gap + usage header + list), kept for error so the card does not jump.
  const bodyHeight = (single ? 234 : 250) + 16 + 89 + listHeight(facilities.length);

  return (
    <section
      aria-label="Facility Limit"
      className={`bg-white border border-[#e5e5e5] border-solid drop-shadow-[0px_1px_1px_rgba(0,0,0,0.05)] flex flex-col gap-[16px] items-start p-[24px] relative rounded-[16px] ${className}`}
      data-name="Widget / Limit Facility"
    >
      <header className="flex flex-col gap-[2px] w-full">
        <h2 className="font-['TT_Interphases_Pro:Bold'] leading-[1.2] text-[#171717] text-[18px]">Facility Limit</h2>
        <p className="font-['TT_Interphases_Pro:Regular'] leading-[20px] text-[#525252] text-[14px]">Select a facility to see its limit details.</p>
      </header>

      {status === "error" ? (
        <div className="flex w-full flex-col items-center justify-center" style={{ minHeight: bodyHeight }}>
          <div role="alert" className="flex flex-col gap-[16px] items-center py-[48px] w-full text-center">
            <div className="relative bg-[#fee4e2] rounded-[24px] size-[48px] shrink-0">
              <img alt="" className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 size-[28px]" src={imgAlert} />
            </div>
            <div className="flex flex-col gap-[4px] items-center w-full">
              <p className="font-['TT_Interphases_Pro:DemiBold'] leading-[24px] text-[#171717] text-[16px]">Limit Facility data is unavailable</p>
              <p className="font-['TT_Interphases_Pro:Regular'] leading-[20px] text-[#525252] text-[14px]">We couldn't load this data right now. Please try again.</p>
            </div>
            <button
              type="button"
              onClick={() => setReloadKey((k) => k + 1)}
              className={`th-press bg-white border border-[#d4d4d4] drop-shadow-[0px_1px_1px_rgba(0,0,0,0.05)] flex gap-[4px] items-center justify-center px-[12px] py-[8px] rounded-full hover:bg-[#fafafa] outline-none ${focusRing}`}
            >
              <img alt="" className="block size-[20px]" src={imgRefresh} />
              <span className="px-[2px] font-['TT_Interphases_Pro:DemiBold'] leading-[20px] text-[#404040] text-[14px]">Retry</span>
            </button>
          </div>
        </div>
      ) : status === "loading" ? (
        <div aria-busy className="flex flex-col gap-[16px] w-full" style={{ minHeight: bodyHeight }}>
          <div className="bg-gradient-to-b from-[#fefefe] to-[#fafafa] border border-[#e5e5e5] flex flex-col gap-[12px] p-[16px] rounded-[16px] w-full">
            <div className="flex flex-col gap-[12px] w-full">
              {single ? <Skel w={160} h={20} /> : <Skel w="100%" h={36} className="rounded-[8px]" />}
              <div className="flex flex-col gap-[6px]">
                <Skel w={73} h={11} />
                <Skel w={220} h={17} />
              </div>
            </div>
            <div className="py-[4px] w-full">
              <div className="h-px w-full bg-[#e5e5e5]" />
            </div>
            <div className="flex flex-col gap-[6px] w-full">
              {[[162, 162], [162, 162], [220, 95]].map(([l, r], i) => (
                <div key={i} className="flex items-center justify-between h-[14px] w-full">
                  <Skel w={l} h={12} />
                  <Skel w={r} h={14} />
                </div>
              ))}
            </div>
          </div>
          <div className="flex flex-col gap-[16px] w-full">
            <UsageHeader loading />
            <div className="flex flex-col gap-[20px] w-full overflow-hidden" style={{ height: listHeight(facilities.length) }}>
              {facilities.slice(0, 4).map((f, i) => (
                <div key={f.name} className="flex flex-col gap-[6px] w-full shrink-0">
                  <div className="flex justify-between w-full">
                    <Skel w={i === 0 ? 126 : 97} h={12} />
                    <Skel w={61} h={12} />
                  </div>
                  <div className="flex gap-[2px] w-full">
                    <Skel w={`calc((100% - 2px) * ${i === 0 ? 0.56 : 0.7})`} h={8} />
                    <Skel w="auto" h={8} className="flex-1" />
                  </div>
                  <Skel w={220} h={11} />
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-[16px] w-full">
          <div className="bg-gradient-to-b from-[#fefefe] to-[#fafafa] border border-[#e5e5e5] flex flex-col gap-[12px] p-[16px] rounded-[16px] w-full">
            <div className="flex flex-col gap-[12px] w-full">
              {single ? (
                <p className="font-['TT_Interphases_Pro:DemiBold'] leading-[20px] text-[#171717] text-[16px]">{facility.name}</p>
              ) : (
                <FacilitySelect value={facility.name} options={facilities.map((f) => f.name)} onChange={setSelectedName} />
              )}
              <div key={facility.name} className="cal-fade-in flex flex-col gap-[6px] w-full">
                <p className="font-['TT_Interphases_Pro:Regular'] leading-[18px] text-[#525252] text-[12px]">Available limit</p>
                <FitAmount value={money(facility.total - facility.outstanding)} />
              </div>
            </div>
            <div className="py-[4px] w-full">
              <div className="h-px w-full bg-[#e5e5e5]" />
            </div>
            <div key={facility.name} className="cal-fade-in flex flex-col gap-[6px] w-full">
              <SummaryRow label="Total limit" value={money(facility.total)} />
              <SummaryRow label="Outstanding limit" value={money(facility.outstanding)} />
              <SummaryRow label="Expiry date" value={facility.expiry} />
            </div>
          </div>

          <div className="flex flex-col gap-[16px] w-full">
            <UsageHeader loading={false} />
            <UsageList facilities={facilities} />
          </div>
        </div>
      )}

      <footer className="border-t border-[#e5e5e5] flex items-center gap-[6px] pt-[16px] w-full">
        <img alt="" className="block size-[16px]" src={imgClock} />
        <p className="font-['TT_Interphases_Pro:Regular'] leading-[18px] text-[#525252] text-[12px]">Last updated 18 Aug 2026, 09:30 WIB</p>
      </footer>
    </section>
  );
}
