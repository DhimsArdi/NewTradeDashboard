import { useState, useSyncExternalStore } from "react";

// Dev-only switch between demo data and stress-test fixtures (?data=worst|empty|one).
// Production builds always read "demo" and never render the toggle.

export const datasets = ["demo", "worst", "empty", "one"] as const;
export type Dataset = (typeof datasets)[number];

const EVENT = "devdatachange";
const labels: Record<Dataset, string> = { demo: "Demo data", worst: "Worst case", empty: "Empty", one: "One" };
const hints: Record<Dataset, string> = {
  demo: "Data contoh yang wajar, seperti tampilan dashboard sehari-hari.",
  worst: "Data ekstrem tapi masih realistis: nominal triliunan, nama counterparty panjang, 60 expiry dalam sebulan, facility melebihi limit. Untuk cek tampilan tidak rusak.",
  empty: "Tanpa data sama sekali. Untuk cek tampilan kosong (empty state) di setiap widget.",
  one: "Hanya satu data per widget. Untuk cek teks tunggal (mis. \"1 expiry\") dan tampilan saat datanya sedikit.",
};

export const currentDataset = (): Dataset => {
  if (!import.meta.env.DEV) return "demo";
  const v = new URLSearchParams(window.location.search).get("data");
  return (datasets as readonly string[]).includes(v ?? "") ? (v as Dataset) : "demo";
};

const setDataset = (d: Dataset) => {
  const url = new URL(window.location.href);
  if (d === "demo") url.searchParams.delete("data");
  else url.searchParams.set("data", d);
  window.history.replaceState(null, "", url);
  window.dispatchEvent(new Event(EVENT));
};

const subscribe = (cb: () => void) => {
  window.addEventListener(EVENT, cb);
  window.addEventListener("popstate", cb);
  return () => {
    window.removeEventListener(EVENT, cb);
    window.removeEventListener("popstate", cb);
  };
};

export const useDataset = () => useSyncExternalStore(subscribe, currentDataset, () => "demo" as Dataset);

export function DevDataToggle() {
  const active = useDataset();
  const [hint, setHint] = useState<Dataset | null>(null);
  if (!import.meta.env.DEV) return null;
  return (
    <div
      role="radiogroup"
      aria-label="Fixture data"
      onMouseLeave={() => setHint(null)}
      className="fixed bottom-[16px] left-1/2 -translate-x-1/2 z-50 flex gap-[2px] p-[3px] rounded-full bg-[#e5e5e5] shadow-[0_2px_8px_rgba(0,0,0,0.12)] font-[system-ui,sans-serif] text-[12px]"
    >
      {hint && (
        <p
          id="dev-data-hint"
          role="tooltip"
          className="th-tooltip origin-bottom absolute bottom-[calc(100%+8px)] left-1/2 -translate-x-1/2 w-[280px] max-w-[calc(100vw-32px)] px-[10px] py-[8px] rounded-[8px] bg-[#171717] text-white leading-[16px] shadow-[0_2px_8px_rgba(0,0,0,0.16)] pointer-events-none"
        >
          {hints[hint]}
        </p>
      )}
      {datasets.map((d) => (
        <button
          key={d}
          type="button"
          role="radio"
          aria-checked={active === d}
          aria-describedby={hint === d ? "dev-data-hint" : undefined}
          onMouseEnter={() => setHint(d)}
          onFocus={() => setHint(d)}
          onBlur={() => setHint(null)}
          onClick={() => setDataset(d)}
          className={`px-[12px] py-[5px] rounded-full whitespace-nowrap ${active === d ? "bg-white text-[#171717] shadow-[0_1px_2px_rgba(0,0,0,0.1)]" : "text-[#525252]"}`}
        >
          {labels[d]}
        </button>
      ))}
    </div>
  );
}
