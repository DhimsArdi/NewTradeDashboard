import { useSyncExternalStore } from "react";

// Dev-only switch between demo data and stress-test fixtures (?data=worst|empty|one).
// Production builds always read "demo" and never render the toggle.

export const datasets = ["demo", "worst", "empty", "one"] as const;
export type Dataset = (typeof datasets)[number];

const EVENT = "devdatachange";
const labels: Record<Dataset, string> = { demo: "Demo data", worst: "Worst case", empty: "Empty", one: "One" };

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
  if (!import.meta.env.DEV) return null;
  return (
    <div
      role="radiogroup"
      aria-label="Fixture data"
      className="fixed bottom-[16px] left-1/2 -translate-x-1/2 z-50 flex gap-[2px] p-[3px] rounded-full bg-[#e5e5e5] shadow-[0_2px_8px_rgba(0,0,0,0.12)] font-[system-ui,sans-serif] text-[12px]"
    >
      {datasets.map((d) => (
        <button
          key={d}
          type="button"
          role="radio"
          aria-checked={active === d}
          onClick={() => setDataset(d)}
          className={`px-[12px] py-[5px] rounded-full whitespace-nowrap ${active === d ? "bg-white text-[#171717] shadow-[0_1px_2px_rgba(0,0,0,0.1)]" : "text-[#525252]"}`}
        >
          {labels[d]}
        </button>
      ))}
    </div>
  );
}
