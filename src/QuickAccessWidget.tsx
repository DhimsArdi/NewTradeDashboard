import { useRef, useState } from "react";
import { WidgetCard } from "./WidgetShell";

const imgChevronRight = "/assets/bc2d8.svg";
const imgTooltipArrow = "/assets/widget/tooltipArrow.svg";

// Figma 2371:61019 · at most four shortcuts, two per row.
const shortcuts = [
  { title: "Incoming LC", product: "Export LC/Inward SKBDN" },
  { title: "Apply for Document Presentation", product: "Export LC/Inward SKBDN" },
  { title: "Apply for Guarantee", product: "Outward Guarantee" },
  { title: "Incoming Guarantee", product: "Inward Guarantee" },
];

// Figma 2371:61519 · a title cut off with an ellipsis shows in full in a tooltip on hover.
function Shortcut({ title, product }: { title: string; product: string }) {
  const titleRef = useRef<HTMLParagraphElement>(null);
  const [showTitle, setShowTitle] = useState(false);
  const isTruncated = () => {
    const el = titleRef.current;
    return !!el && el.scrollWidth > el.clientWidth;
  };
  return (
    <div className="relative min-w-px" onMouseEnter={() => setShowTitle(isTruncated())} onMouseLeave={() => setShowTitle(false)}>
      <div
        className="bg-[#fafafa] border border-[#e5e5e5] border-solid flex gap-[12px] h-full items-center overflow-clip p-[16px] relative rounded-[12px]"
        data-name={`Shortcut · ${title}`}
      >
        <div className="[word-break:break-word] flex flex-[1_0_0] flex-col gap-[2px] items-start min-w-px overflow-clip">
          <p ref={titleRef} className="font-['TT_Interphases_Pro:DemiBold'] leading-[20px] overflow-hidden text-[#171717] text-[14px] text-ellipsis w-full whitespace-nowrap">
            {title}
          </p>
          <p className="font-['TT_Interphases_Pro:Regular'] leading-[18px] text-[#525252] text-[12px] w-full">{product}</p>
        </div>
        <img alt="" className="block shrink-0 size-[24px]" src={imgChevronRight} />
      </div>
      {showTitle && (
        <span
          role="tooltip"
          className="th-tooltip origin-bottom-left pointer-events-none absolute bottom-[calc(100%+4px)] left-[16px] z-30 flex flex-col items-center drop-shadow-[0px_12px_8px_rgba(16,24,40,0.08)]"
        >
          <span className="rounded-[8px] bg-[#171717] px-[12px] py-[8px] font-['TT_Interphases_Pro:DemiBold'] leading-[18px] text-[12px] text-white whitespace-nowrap">{title}</span>
          <span className="relative block h-[6px] w-[16px]">
            <span className="absolute inset-[-41.91%_0_0_0]">
              <img alt="" className="block max-w-none size-full" src={imgTooltipArrow} />
            </span>
          </span>
        </span>
      )}
    </div>
  );
}

export default function QuickAccessWidget({ className = "" }: { className?: string }) {
  return (
    <WidgetCard title="Quick Access" info="Shortcuts to the transactions you use most." className={className} dataName="Widget / Quick Access">
      <div className="grid grid-cols-2 gap-[12px] p-[20px] w-full" data-name="Shortcuts (max 4)">
        {shortcuts.map((s) => (
          <Shortcut key={s.title} {...s} />
        ))}
      </div>
    </WidgetCard>
  );
}
