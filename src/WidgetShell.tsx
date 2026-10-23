import { useId, useState, type ReactNode } from "react";
import { wibStamp } from "./demoClock";

const a = (file: string) => `/assets/widget/${file}`;
const imgInfoCircle = a("infoCircle.svg");
const imgRefresh = a("refresh.svg");
const imgTooltipArrow = a("tooltipArrow.svg");

const focusRing = "focus-visible:shadow-[0_0_0_2px_white,0_0_0_4px_#099697]";

// Figma 2348:22787. The widget's description lives in the (i) tooltip next to the title (it used to be a subtitle).
function InfoTooltip({ text }: { text: string }) {
  const [open, setOpen] = useState(false);
  const id = useId();
  return (
    <span className="relative flex shrink-0" onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)}>
      <button
        type="button"
        aria-label="About this widget"
        aria-describedby={open ? id : undefined}
        onFocus={() => setOpen(true)}
        onBlur={() => setOpen(false)}
        onClick={() => setOpen(true)}
        onKeyDown={(e) => e.key === "Escape" && setOpen(false)}
        className={`flex size-[16px] rounded-full outline-none ${focusRing}`}
      >
        <img alt="" className="block size-[16px]" src={imgInfoCircle} />
      </button>
      {open && (
        <span
          id={id}
          role="tooltip"
          className="th-tooltip origin-top pointer-events-none absolute left-1/2 top-[calc(100%+6px)] z-30 -translate-x-1/2 flex w-[300px] max-w-[calc(100vw-32px)] flex-col items-center drop-shadow-[0px_12px_8px_rgba(16,24,40,0.08)]"
        >
          <span className="flex-none rotate-180">
            <span className="relative block h-[6px] w-[16px]">
              <span className="absolute inset-[-41.91%_0_0_0]">
                <img alt="" className="block max-w-none size-full" src={imgTooltipArrow} />
              </span>
            </span>
          </span>
          <span className="w-full rounded-[8px] bg-[#171717] px-[12px] py-[8px] text-center font-['TT_Interphases_Pro:DemiBold'] leading-[18px] text-[12px] text-white">
            {text}
          </span>
        </span>
      )}
    </span>
  );
}

// Figma 2348:22787 · Widget / Header. The body below overlaps it by 12px.
export function WidgetHeader({ title, info }: { title: string; info?: string }) {
  return (
    <header className="bg-linear-to-r from-[#0aa3a4] via-[#077879] to-[#01414f] flex gap-[8px] h-[56px] items-center -mb-[12px] pb-[22px] pt-[10px] px-[20px] relative rounded-t-[15px] shrink-0 w-full" data-name="Widget / Header">
      <h2 className="font-['TT_Interphases_Pro:DemiBold'] leading-[24px] min-w-0 text-[16px] text-white truncate">{title}</h2>
      {info && <InfoTooltip text={info} />}
    </header>
  );
}

type WidgetCardProps = {
  title: string;
  info?: string;
  className?: string;
  dataName?: string;
  children: ReactNode;
};

// Figma 2348:22801 · teal header band, white body with rounded top corners.
// The card doesn't clip, so the info tooltip can extend past its edge.
export function WidgetCard({ title, info, className = "", dataName, children }: WidgetCardProps) {
  return (
    <section
      aria-label={title}
      className={`bg-white border border-[#e5e5e5] border-solid flex flex-col items-start relative rounded-[16px] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] ${className}`}
      data-name={dataName}
    >
      <WidgetHeader title={title} info={info} />
      <div className="bg-white flex flex-col flex-1 items-start relative rounded-t-[12px] rounded-b-[15px] w-full" data-name="Body">
        {children}
      </div>
    </section>
  );
}

type WidgetFooterProps = {
  updatedAt: string;
  // Omitted while the widget is loading or showing its error (that has its own Retry).
  onRefresh?: () => void;
  refreshing?: boolean;
};

// Figma 2348:22791
export function WidgetFooter({ updatedAt, onRefresh, refreshing = false }: WidgetFooterProps) {
  return (
    <footer className="flex h-[48px] items-center justify-between pb-[12px] px-[20px] shrink-0 w-full" data-name="Widget / Footer">
      <p aria-live="polite" className="font-['TT_Interphases_Pro:Regular'] leading-[18px] text-[#525252] text-[12px] whitespace-nowrap">
        Last updated {updatedAt}
      </p>
      {onRefresh && (
        <button
          type="button"
          aria-label="Refresh"
          aria-busy={refreshing}
          disabled={refreshing}
          onClick={onRefresh}
          className={`th-press flex items-center justify-center p-[8px] rounded-full outline-none enabled:hover:bg-[#f5f5f5] disabled:cursor-progress ${focusRing}`}
        >
          <img alt="" className={`block size-[20px] ${refreshing ? "animate-spin" : ""}`} src={imgRefresh} />
        </button>
      )}
    </footer>
  );
}

// Simulated refresh: the content stays on screen while the footer button spins (Figma "Refresh berjalan"),
// then the timestamp moves to now.
export function useRefresh(ms = 1200) {
  const [refreshing, setRefreshing] = useState(false);
  const [updatedAt, setUpdatedAt] = useState(() => wibStamp());
  const refresh = () => {
    setRefreshing(true);
    window.setTimeout(() => {
      setUpdatedAt(wibStamp());
      setRefreshing(false);
    }, ms);
  };
  return { refreshing, refresh, updatedAt };
}
