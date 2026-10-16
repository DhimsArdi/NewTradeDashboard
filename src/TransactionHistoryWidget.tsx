import { useEffect, useRef, useState } from "react";

const a = (file: string) => `/assets/${file}`;
const imgChevronDown = a("66b97.svg");
const imgChevronUp = a("73c3d.svg");
const imgCheck = a("1b842.svg");
const imgClock = a("efc9f.svg");
const imgEmpty = a("c3b4b.svg");
const imgAlert = a("43631.svg");
const imgRefresh = a("8cf1f.svg");

const months = ["Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug"];
const monthNames = ["February", "March", "April", "May", "June", "July", "August"];

type Series = { label: string; color: string; values: number[] };
type Product = { label: string; base: Series; top: Series };

const products: Record<string, Product> = {
  "Export LC": {
    label: "Export LC",
    base: { label: "Document Presented", color: "#099697", values: [5, 7, 6, 8, 9, 11, 5] },
    top: { label: "Finance", color: "#6bc0c1", values: [3, 4, 5, 6, 4, 7, 3] },
  },
  "Bank Guarantee": {
    label: "Bank Guarantee",
    base: { label: "Issued", color: "#ff6b00", values: [6, 8, 5, 9, 7, 10, 4] },
    top: { label: "Amended", color: "#ffd3b2", values: [2, 3, 2, 4, 3, 2, 1] },
  },
};

const showByOptions = ["Number of transactions", "Volume"] as const;
type ShowBy = (typeof showByOptions)[number];
const currencies = ["USD", "EUR", "SGD", "IDR"] as const;
type Currency = (typeof currencies)[number];

// Volume per transaction (USD) and indicative FX rates used for the demo data.
const VOLUME_PER_TXN_USD = 50_000;
const fx: Record<Currency, number> = { USD: 1, EUR: 0.92, SGD: 1.34, IDR: 16_000 };
const AXIS_UNITS = 20;
const PLOT_HEIGHT = 200;

const compact = (n: number) => {
  if (n === 0) return "0";
  const units: [number, string][] = [[1e12, "T"], [1e9, "B"], [1e6, "M"], [1e3, "K"]];
  for (const [v, s] of units) if (n >= v) return `${+(n / v).toFixed(2)}${s}`;
  return `${+n.toFixed(2)}`;
};
const money = (n: number, c: Currency) =>
  `${c} ${n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

type Status = "loading" | "ready" | "empty" | "error";

// QA hook: ?txState=empty|error|loading forces a widget state.
const forcedState = () => {
  const v = new URLSearchParams(window.location.search).get("txState");
  return v === "empty" || v === "error" || v === "loading" ? v : null;
};

function Select<T extends string>({
  value, options, open, onOpen, onChange, label,
}: { value: T; options: readonly T[]; open: boolean; onOpen: (open: boolean) => void; onChange: (v: T) => void; label: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => !ref.current?.contains(e.target as Node) && onOpen(false);
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onOpen(false);
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open, onOpen]);

  return (
    <div ref={ref} className="relative flex-[1_0_0] min-w-px">
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={label}
        onClick={() => onOpen(!open)}
        className={`bg-white border border-solid flex gap-[8px] items-center px-[12px] py-[8px] rounded-[8px] shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05)] w-full text-left outline-none transition-colors hover:border-[#a3a3a3] focus-visible:shadow-[0_0_0_2px_white,0_0_0_4px_#099697] ${open ? "border-[#a3a3a3]" : "border-[#d4d4d4]"}`}
      >
        <span className="flex-1 min-w-0 truncate font-['TT_Interphases_Pro:Regular'] leading-[20px] text-[#171717] text-[14px]">{value}</span>
        <img alt="" className="block size-[18px] shrink-0" src={open ? imgChevronUp : imgChevronDown} />
      </button>
      {open && (
        <ul
          role="listbox"
          aria-label={label}
          className="absolute left-0 right-0 top-[calc(100%+6px)] z-30 bg-white border border-[#d4d4d4] rounded-[8px] py-[8px] shadow-[0px_12px_16px_-4px_rgba(0,0,0,0.08),0px_4px_6px_-2px_rgba(0,0,0,0.03)]"
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
                    onOpen(false);
                  }}
                  className="flex w-full items-center gap-[8px] p-[8px] rounded-[6px] text-left hover:bg-[#f5f5f5] focus-visible:bg-[#f5f5f5] outline-none"
                >
                  <span className="flex-1 py-[2px] font-['TT_Interphases_Pro:Medium'] leading-[20px] text-[#404040] text-[14px] whitespace-nowrap">{option}</span>
                  {selected && <img alt="" className="block size-[20px] shrink-0" src={imgCheck} />}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

export default function TransactionHistoryWidget({ className = "" }: { className?: string }) {
  const [productKey, setProductKey] = useState<string>("Export LC");
  const [showBy, setShowBy] = useState<ShowBy>("Number of transactions");
  const [currency, setCurrency] = useState<Currency>("USD");
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [hovered, setHovered] = useState<number | null>(null);
  const [status, setStatus] = useState<Status>("loading");
  const [reloadKey, setReloadKey] = useState(0);

  // Simulated fetch whenever the filters change.
  useEffect(() => {
    setStatus("loading");
    setHovered(null);
    const forced = forcedState();
    if (forced === "loading") return;
    const t = window.setTimeout(() => setStatus(forced ?? "ready"), 450);
    return () => window.clearTimeout(t);
  }, [productKey, showBy, currency, reloadKey]);

  const product = products[productKey];
  const isVolume = showBy === "Volume";
  const factor = isVolume ? VOLUME_PER_TXN_USD * fx[currency] : 1;
  const ticks = [20, 15, 10, 5, 0].map((t) => (isVolume ? compact(t * factor) : String(t)));
  const fmt = (count: number) => (isVolume ? money(count * factor, currency) : count.toLocaleString("en-US"));
  const subtitle = isVolume
    ? `Completed transaction volume per month, by event (${currency}).`
    : "Completed transactions per month, by event.";

  const menu = (id: string) => ({ open: openMenu === id, onOpen: (o: boolean) => setOpenMenu(o ? id : null) });

  return (
    <section
      aria-label="Transaction History"
      className={`bg-white border border-[#e5e5e5] border-solid flex flex-col gap-[20px] items-start p-[24px] relative rounded-[16px] ${className}`}
      data-name="Widget / Transaction History"
    >
      <header className="flex flex-col gap-[2px] w-full">
        <h2 className="font-['TT_Interphases_Pro:Bold'] leading-[1.2] text-[#171717] text-[18px]">Transaction History</h2>
        <p className="font-['TT_Interphases_Pro:Regular'] leading-[20px] text-[#525252] text-[14px] truncate">{subtitle}</p>
      </header>

      <div className="flex gap-[8px] items-start w-full">
        <Select label="Transaction item" value={productKey} options={Object.keys(products)} onChange={setProductKey} {...menu("product")} />
        <Select label="Show by" value={showBy} options={showByOptions} onChange={setShowBy} {...menu("showBy")} />
        {isVolume && <Select label="Currency" value={currency} options={currencies} onChange={setCurrency} {...menu("currency")} />}
      </div>

      {status === "empty" || status === "error" ? (
        <div className="flex h-[272px] w-full flex-col items-center justify-center">
          <div className="flex flex-col gap-[16px] items-center py-[48px] w-full text-center">
            <div className={`relative rounded-[24px] size-[48px] ${status === "error" ? "bg-[#fee4e2]" : "bg-[#f3f4f6]"}`}>
              <img alt="" className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 size-[28px]" src={status === "error" ? imgAlert : imgEmpty} />
            </div>
            <div className="flex flex-col gap-[4px] items-center w-full" role={status === "error" ? "alert" : undefined}>
              <p className="font-['TT_Interphases_Pro:DemiBold'] leading-[24px] text-[#171717] text-[16px]">
                {status === "error" ? "Transaction History data is unavailable" : "No transactions yet"}
              </p>
              <p className="font-['TT_Interphases_Pro:Regular'] leading-[20px] text-[#525252] text-[14px]">
                {status === "error"
                  ? "We couldn't load this data right now. Please try again."
                  : "Completed transactions from the last 6 months will appear here."}
              </p>
            </div>
            {status === "error" && (
              <button
                type="button"
                onClick={() => setReloadKey((k) => k + 1)}
                className="bg-white border border-[#d4d4d4] drop-shadow-[0px_1px_1px_rgba(0,0,0,0.05)] flex gap-[4px] items-center justify-center px-[12px] py-[8px] rounded-full hover:bg-[#fafafa] outline-none focus-visible:shadow-[0_0_0_2px_white,0_0_0_4px_#099697]"
              >
                <img alt="" className="block size-[20px]" src={imgRefresh} />
                <span className="px-[2px] font-['TT_Interphases_Pro:DemiBold'] leading-[20px] text-[#404040] text-[14px]">Retry</span>
              </button>
            )}
          </div>
        </div>
      ) : (
        <>
          <div className="flex gap-[8px] items-start w-full" aria-busy={status === "loading"}>
            <div className="flex flex-col h-[216px] items-end justify-between min-w-[24px] shrink-0 font-['TT_Interphases_Pro:Regular'] leading-[18px] text-[#525252] text-[12px] text-right">
              {ticks.map((t, i) => (
                <p key={i} className={status === "loading" ? "invisible" : ""}>{t}</p>
              ))}
            </div>
            <div className="flex flex-1 min-w-px flex-col gap-[6px] pt-[8px]">
              <div className="relative h-[200px] w-full" onMouseLeave={() => setHovered(null)}>
                {[0, 50, 100, 150, 200].map((top) => (
                  <div key={top} className="absolute bg-[#e5e5e5] h-px left-0 right-0" style={{ top }} />
                ))}
                <div className="absolute inset-x-0 top-0 flex h-[201px] items-start">
                  {months.map((m, i) => {
                    if (status === "loading") {
                      const h = [90, 120, 100, 150, 130, 170, 70][i];
                      return (
                        <div key={m} className="flex flex-1 min-w-px h-full flex-col items-center justify-end">
                          <div className="bg-[#f5f5f5] rounded-t-[4px] w-[24px] animate-pulse" style={{ height: h }} />
                        </div>
                      );
                    }
                    const base = product.base.values[i];
                    const top = product.top.values[i];
                    const dim = hovered !== null && hovered !== i;
                    return (
                      <button
                        key={m}
                        type="button"
                        aria-label={`${monthNames[i]} 2026: ${product.base.label} ${fmt(base)}, ${product.top.label} ${fmt(top)}`}
                        onMouseEnter={() => setHovered(i)}
                        onFocus={() => setHovered(i)}
                        onBlur={() => setHovered(null)}
                        className={`flex flex-1 min-w-px h-full flex-col gap-[2px] items-center justify-end outline-none transition-opacity duration-150 cursor-default ${dim ? "opacity-35" : ""}`}
                      >
                        <div className="rounded-t-[4px] w-[24px]" style={{ height: (top / AXIS_UNITS) * PLOT_HEIGHT - 2, background: product.top.color }} />
                        <div className="w-[24px]" style={{ height: (base / AXIS_UNITS) * PLOT_HEIGHT - 2, background: product.base.color }} />
                      </button>
                    );
                  })}
                </div>
                {hovered !== null && status === "ready" && (
                  <div
                    role="tooltip"
                    className="pointer-events-none absolute z-20 top-[30px] w-[320px] max-w-full bg-white border border-[#e5e5e5] flex flex-col gap-[8px] p-[12px] rounded-[8px] shadow-[0px_12px_16px_-4px_rgba(0,0,0,0.08),0px_4px_6px_-2px_rgba(0,0,0,0.03)]"
                    style={
                      hovered >= months.length / 2
                        ? { right: `calc(${((months.length - hovered) / months.length) * 100}% + 4px)` }
                        : { left: `calc(${((hovered + 1) / months.length) * 100}% + 4px)` }
                    }
                  >
                    <div className="flex items-center justify-between whitespace-nowrap">
                      <p className="font-['TT_Interphases_Pro:DemiBold'] leading-[20px] text-[#171717] text-[14px]">{monthNames[hovered]} 2026</p>
                      <p className="font-['TT_Interphases_Pro:Regular'] leading-[18px] text-[#525252] text-[12px]">
                        {fmt(product.base.values[hovered] + product.top.values[hovered])}
                        {isVolume ? "" : " transactions"}
                      </p>
                    </div>
                    <div className="flex flex-col gap-[4px]">
                      <p className="font-['TT_Interphases_Pro:Regular'] leading-[18px] text-[#525252] text-[12px]">{product.label}</p>
                      {[product.base, product.top].map((s) => (
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
              <div className="flex w-full">
                {months.map((m, i) => (
                  <p
                    key={m}
                    className={`flex-1 min-w-px text-center font-['TT_Interphases_Pro:Regular'] leading-[18px] text-[#525252] text-[12px] transition-opacity ${hovered !== null && hovered !== i ? "opacity-35" : ""}`}
                  >
                    {m}
                  </p>
                ))}
              </div>
            </div>
          </div>

          <div className="flex h-[20px] items-center w-full">
            {status === "loading" ? (
              <div className="bg-[#f5f5f5] h-[12px] rounded-[4px] w-[300px] max-w-full animate-pulse" />
            ) : (
              <div className="flex gap-[12px] items-center w-full">
                <p className="font-['TT_Interphases_Pro:DemiBold'] leading-[20px] text-[#404040] text-[14px] w-[112px] shrink-0">{product.label}</p>
                <div className="flex flex-1 flex-wrap gap-[6px_12px]">
                  {[product.base, product.top].map((s) => (
                    <div key={s.label} className="flex gap-[6px] items-center">
                      <span className="rounded-[2px] size-[10px]" style={{ background: s.color }} />
                      <p className="font-['TT_Interphases_Pro:Regular'] leading-[18px] text-[#404040] text-[12px] whitespace-nowrap">{s.label}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </>
      )}

      <footer className="border-t border-[#e5e5e5] flex items-center gap-[6px] pt-[16px] w-full">
        <img alt="" className="block size-[16px]" src={imgClock} />
        <p className="font-['TT_Interphases_Pro:Regular'] leading-[18px] text-[#525252] text-[12px]">Last updated 18 Aug 2026, 09:30 WIB</p>
      </footer>
    </section>
  );
}
