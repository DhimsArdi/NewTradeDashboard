import { useEffect, useState, type ReactNode } from "react";

const a = (file: string) => `/assets/header/${file}`;

// Lucide icons as exported from Figma: each stroke is its own vector, placed by insets inside a 20px box.
type Stroke = { src: string; inset: string; bleed: string };

const eyeOff: Stroke[] = [
  { src: a("eyeOff1.svg"), inset: "inset-[20.84%_8.33%_38.18%_44.72%]", bleed: "inset-[-10.17%_-8.88%]" },
  { src: a("eyeOff2.svg"), inset: "inset-[41.32%_41.32%_37.5%_37.5%]", bleed: "inset-[-19.67%]" },
  { src: a("eyeOff3.svg"), inset: "inset-[27.12%_27.17%_20.83%_8.33%]", bleed: "inset-[-8.01%_-6.46%]" },
  { src: a("eyeOff4.svg"), inset: "inset-[8.33%]", bleed: "inset-[-5%]" },
];
const eye: Stroke[] = [
  { src: a("eye1.svg"), inset: "inset-[20.84%_8.33%]", bleed: "inset-[-7.14%_-5%]" },
  { src: a("eye2.svg"), inset: "inset-[37.5%]", bleed: "inset-[-16.67%]" },
];
const pencil: Stroke[] = [
  { src: a("pencil1.svg"), inset: "inset-[8.33%_8.33%_8.34%_8.33%]", bleed: "inset-[-5%]" },
  { src: a("pencil2.svg"), inset: "inset-[20.83%_20.83%_62.5%_62.5%]", bleed: "inset-[-25%]" },
];

function StrokeIcon({ strokes }: { strokes: Stroke[] }) {
  return (
    <span aria-hidden className="overflow-clip relative shrink-0 size-[20px]">
      {strokes.map((s) => (
        <span key={s.src} className={`absolute ${s.inset}`}>
          <span className={`absolute ${s.bleed}`}>
            <img alt="" className="block max-w-none size-full" src={s.src} />
          </span>
        </span>
      ))}
    </span>
  );
}

const focusRing = "focus-visible:shadow-[0_0_0_2px_white,0_0_0_4px_#099697]";

function HeaderButton({ strokes, label, onClick, pressed }: { strokes: Stroke[]; label: string; onClick: () => void; pressed?: boolean }) {
  return (
    <button
      type="button"
      aria-pressed={pressed}
      onClick={onClick}
      className={`th-press bg-white border border-[#d4d4d4] drop-shadow-[0px_1px_1px_rgba(0,0,0,0.05)] flex gap-[4px] h-[42px] items-center justify-center px-[14px] py-[10px] rounded-full shrink-0 outline-none hover:bg-[#fafafa] ${focusRing}`}
    >
      <StrokeIcon strokes={strokes} />
      <span className="font-['TT_Interphases_Pro:DemiBold'] leading-[20px] text-[#404040] text-[14px] whitespace-nowrap">{label}</span>
    </button>
  );
}

function Chip({ children }: { children: ReactNode }) {
  return (
    <span className="bg-[#f9fafb] border border-[#e5e7eb] flex gap-[6px] h-[30px] items-center leading-[20px] px-[12px] py-[4px] rounded-full text-[#374151] text-[14px] whitespace-nowrap">
      {children}
    </span>
  );
}

// "Thursday, 22 October 2026, 11:42:30" in the viewer's time.
const clockLabel = (d: Date) => {
  const date = d.toLocaleString("en-GB", { weekday: "long", day: "numeric", month: "long", year: "numeric" }).replace(/^(\w+) /, "$1, ");
  const time = d.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit", second: "2-digit", hourCycle: "h23" });
  return `${date}, ${time}`;
};

function LiveClock() {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const t = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(t);
  }, []);
  return (
    <time dateTime={now.toISOString()} className="font-['TT_Interphases_Pro:Regular'] leading-[20px] text-[#475467] text-[14px] tabular-nums">
      {clockLabel(now)}
    </time>
  );
}

type PageHeaderProps = {
  amountsHidden: boolean;
  onToggleAmounts: () => void;
  onManageWidget: () => void;
};

// Figma 2320:51463 (Trade - Trade Home · 1. Trade Dashboard)
export default function PageHeader({ amountsHidden, onToggleAmounts, onManageWidget }: PageHeaderProps) {
  return (
    <header className="flex flex-col gap-[4px] items-start pb-[8px] w-full" data-name="Page header">
      <LiveClock />
      <div className="flex flex-wrap gap-[12px] items-center justify-between min-h-[42px] w-full">
        <h1 className="font-['TT_Interphases_Pro:Bold'] leading-[36px] min-w-0 text-[#171717] text-[30px]">Hi, Putra Nagara</h1>
        <div className="flex gap-[12px] items-center">
          <HeaderButton strokes={amountsHidden ? eye : eyeOff} label={amountsHidden ? "Show Amount" : "Hide Amount"} onClick={onToggleAmounts} pressed={amountsHidden} />
          <HeaderButton strokes={pencil} label="Manage Widget" onClick={onManageWidget} />
        </div>
      </div>
      <p className="font-['TT_Interphases_Pro:Regular'] leading-[24px] text-[#404040] text-[16px]">Here's your company summary for today.</p>
      <div className="flex flex-wrap gap-[8px] items-center">
        <Chip>
          <img alt="" className="block shrink-0 size-[14px]" src={a("building.svg")} />
          <span className="font-['TT_Interphases_Pro:DemiBold']">PT. Nusantara Ekspor Mandiri</span>
        </Chip>
        <Chip>
          <span className="font-['TT_Interphases_Pro:Regular']">Company ID</span>
          <span className="font-['TT_Interphases_Pro:DemiBold']">NEM132</span>
        </Chip>
        <Chip>
          <span className="font-['TT_Interphases_Pro:Regular']">User ID</span>
          <span className="font-['TT_Interphases_Pro:DemiBold']">432645</span>
        </Chip>
      </div>
    </header>
  );
}
