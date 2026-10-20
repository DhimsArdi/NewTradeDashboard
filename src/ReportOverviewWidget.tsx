import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { currentDataset } from "./devData";

const a = (file: string) => `/assets/report-overview/${file}`;
const imgFile06 = a("file06.svg");
const imgDownload = a("downloadRow.svg");
const imgDownloadHover = a("downloadHover.svg");
const imgDownloadDisabled = a("downloadDisabled.svg");
const imgSpinTrack = a("spinTrack.svg");
const imgSpinArc = a("spinArc.svg");
const imgErrAlert = a("errAlert.svg");
const imgRefresh = a("refresh.svg");
const imgModalDownload = a("modalDownload.svg");
const imgXClose = a("xClose.svg");
const imgModalDivider = a("modalDivider.svg");
const imgDividerWrap = a("dividerWrap.svg");
const imgChevronDown = a("chevronDown20.svg");
const imgMenuCheck = a("menuCheck.svg");
const imgCheckboxCheck = a("checkboxCheck.svg");
const imgMinus = a("minus.svg");
const imgToastCheck = a("toastCheck.svg");
const imgToastSpinner = a("toastSpinner.svg");
const imgToastAlert = a("toastAlert.svg");

type ReportId = "transaction-history" | "limit-facility";
type ReportSummary = { id: ReportId; title: string; description: string; hasData: boolean };
type ColumnSet = { defaultInfo: string; columns: { label: string; preselected: boolean }[] };

const col = (label: string, preselected = false) => ({ label, preselected });

const products: Record<string, ColumnSet> = {
  "Export LC": {
    defaultInfo: "LC number, applicant, current event, currency, amount and status.",
    columns: [
      col("LC number", true), col("Applicant", true), col("Issuing bank"), col("Current event", true),
      col("Currency", true), col("Amount", true), col("Proceed date"), col("Status", true),
    ],
  },
  "Inward Guarantee": {
    defaultInfo: "Guarantee number, applicant, current event, currency, amount and status.",
    columns: [
      col("Guarantee number", true), col("Applicant", true), col("Issuing bank"), col("Current event", true),
      col("Currency", true), col("Amount", true), col("Proceed date"), col("Status", true),
      col("Transaction number"), col("BNI reference number"), col("Guarantee type"), col("Issue date"),
      col("Validity date"), col("Expiry date"),
    ],
  },
  "Outward Guarantee": {
    defaultInfo: "Guarantee number, beneficiary, currency, amount, current event and status.",
    columns: [
      col("Transaction reference"), col("Guarantee number", true), col("Guarantee form"), col("Guarantee type"),
      col("Beneficiary", true), col("Currency", true), col("Amount", true), col("Issue date"), col("Expiry date"),
      col("Claim period"), col("Guarantee validity"), col("Underlying transaction"), col("Cover type"),
      col("Claim amount"), col("Claim date"), col("Current event", true), col("Status", true),
    ],
  },
};
const productNames = Object.keys(products);

const limitFacilityColumns: ColumnSet = {
  defaultInfo: "Month, transaction reference, guarantee / LC number, currency and amount.",
  columns: [col("Month"), col("Transaction reference"), col("Guarantee / LC number", true), col("Currency", true), col("Amount", true)],
};

const formats = [
  { value: "Excel (.xlsx)", short: "Excel", sub: "For filtering, sorting and totals" },
  { value: "CSV (.csv)", short: "CSV", sub: "Plain data to import into other systems" },
  { value: "PDF (.pdf)", short: "PDF", sub: "Ready to print or share" },
];

// Months are indexed as year * 12 + month. Data is available from Jan 2022 to the current month (Aug 2026).
const MONTH_NAMES = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const LATEST_MONTH = 2026 * 12 + 7;
const EARLIEST_MONTH = 2022 * 12;
const MAX_MONTHS_PER_FILE = 12;
const monthLabel = (m: number) => `${MONTH_NAMES[m % 12]} ${Math.floor(m / 12)}`;
const monthOptions = Array.from({ length: LATEST_MONTH - EARLIEST_MONTH + 1 }, (_, i) => LATEST_MONTH - i);
const yearOptions = [2026, 2025, 2024, 2023, 2022];

const rangeLabel = (from: number, to: number) => {
  const fy = Math.floor(from / 12);
  const ty = Math.floor(to / 12);
  if (from === to) return monthLabel(from);
  return fy === ty ? `${MONTH_NAMES[from % 12]} – ${monthLabel(to)}` : `${monthLabel(from)} – ${monthLabel(to)}`;
};

type DownloadRequest = {
  report: ReportSummary;
  product: string | null;
  periodLabel: string;
  format: string;
  columns: string[];
};

const reportName = (r: DownloadRequest) =>
  r.product ? `${r.product} ${r.report.title}` : r.report.title;

const defaultReports: ReportSummary[] = [
  { id: "transaction-history", title: "Transaction History", description: "Bank Guarantee and LC transactions.", hasData: true },
  { id: "limit-facility", title: "Facility Limit", description: "Limit and usage of your facilities.", hasData: true },
];

// Stress-test fixture for the dev data toggle: descriptions as long as the API may send.
const worstReports: ReportSummary[] = [
  {
    id: "transaction-history",
    title: "Transaction History",
    description: "Monthly completed transactions by event and product, including amendments, claims and released guarantees across all channels.",
    hasData: true,
  },
  { id: "limit-facility", title: "Facility Limit", description: "Limit, outstanding and availability per facility, including syndicated and over-limit facilities.", hasData: false },
];

type Status = "loading" | "ready" | "error";

// QA hooks: ?reportState=loading|error|empty|single forces a widget state, ?reportDownload=fail forces a failed download.
const params = () => new URLSearchParams(window.location.search);
const forcedState = () => params().get("reportState");

function fetchReportOverview(): Promise<ReportSummary[]> {
  return new Promise((resolve, reject) =>
    window.setTimeout(() => {
      const forced = forcedState();
      if (forced === "error") return reject(new Error("unavailable"));
      if (forced === "empty")
        return resolve(defaultReports.map((r) => (r.id === "transaction-history" ? { ...r, hasData: false, description: "No transactions yet." } : r)));
      if (forced === "single") return resolve(defaultReports.filter((r) => r.id === "transaction-history"));
      const dataset = currentDataset();
      if (dataset === "worst") return resolve(worstReports);
      if (dataset === "empty") return resolve(defaultReports.map((r) => ({ ...r, hasData: false, description: "Nothing to report yet." })));
      if (dataset === "one") return resolve(defaultReports.slice(0, 1));
      resolve(defaultReports);
    }, 700),
  );
}

function prepareReportFile(_request: DownloadRequest): Promise<void> {
  return new Promise((resolve, reject) =>
    window.setTimeout(() => (params().get("reportDownload") === "fail" ? reject(new Error("failed")) : resolve()), 1600),
  );
}

function Spinner() {
  return (
    <div className="animate-spin relative shrink-0 size-[20px]" data-name="Spinner Loader">
      <div className="absolute flex items-center justify-center left-[-2.93px] size-[25.858px] top-[-2.93px]">
        <div className="flex-none rotate-[-68.9deg]">
          <div className="relative size-[20px]">
            <div className="absolute inset-[-6.25%]">
              <img alt="" className="block max-w-none size-full" src={imgSpinTrack} />
            </div>
          </div>
        </div>
      </div>
      <div className="absolute flex items-center justify-center left-[-2.93px] size-[25.858px] top-[-2.93px]">
        <div className="flex-none rotate-[-68.9deg]">
          <div className="relative size-[20px]">
            <div className="absolute inset-[43.75%_-6.25%_-3.8%_59.2%]">
              <img alt="" className="block max-w-none size-full" src={imgSpinArc} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function FeaturedIcon({ src }: { src: string }) {
  return (
    <div className="border border-[#e4e7ec] border-solid drop-shadow-[0px_1px_1px_rgba(16,24,40,0.05)] relative rounded-[8px] shrink-0 size-[40px]" data-name="Featured icon">
      <div aria-hidden className="absolute bg-white inset-0 pointer-events-none rounded-[8px]" />
      <div className="absolute inset-[calc(25%-0.5px)]">
        <img alt="" className="absolute block inset-0 max-w-none size-full" src={src} />
      </div>
      <div className="absolute inset-0 pointer-events-none rounded-[inherit] shadow-[inset_0px_0px_0px_0px_rgba(16,24,40,0.18),inset_0px_-2px_0px_0px_rgba(16,24,40,0.05)]" />
    </div>
  );
}

function SectionHeader() {
  return (
    <div className="[word-break:break-word] content-stretch flex flex-col gap-[2px] items-start not-italic relative shrink-0 w-full" data-name="Section header">
      <p className="font-['TT_Interphases_Pro:Bold'] leading-[1.2] relative shrink-0 text-[#171717] text-[18px] w-full">Report Overview</p>
      <p className="font-['TT_Interphases_Pro:Regular'] leading-[20px] relative shrink-0 text-[#525252] text-[14px] w-full">
        Download reports of your transactions and facility limits.
      </p>
    </div>
  );
}

function ReportRow({ report, preparing, onDownload }: { report: ReportSummary; preparing: boolean; onDownload: () => void }) {
  const disabled = !report.hasData;
  return (
    <div
      className={`bg-[#fafafa] border border-[#e5e5e5] border-solid content-stretch flex gap-[12px] group items-center overflow-clip p-[16px] relative rounded-[12px] shrink-0 transition-colors w-full ${
        disabled || preparing ? "" : "cursor-pointer hover:bg-[#f5f5f5]"
      }`}
      data-name={`Report · ${report.title}`}
      onClick={() => !disabled && !preparing && onDownload()}
    >
      <FeaturedIcon src={imgFile06} />
      <div className="content-stretch flex flex-[1_0_0] flex-col gap-[2px] items-start min-w-px not-italic relative">
        <p className="font-['TT_Interphases_Pro:DemiBold'] leading-[20px] relative shrink-0 text-[#171717] text-[14px] w-full">{report.title}</p>
        <p title={report.description} className="font-['TT_Interphases_Pro:Regular'] leading-[18px] line-clamp-2 relative shrink-0 text-[#525252] text-[12px] w-full">{report.description}</p>
      </div>
      <button
        aria-busy={preparing}
        aria-label={`Download ${report.title} report`}
        className={`content-stretch flex items-center justify-center overflow-clip px-[12px] py-[8px] relative rounded-[9999px] shrink-0 transition-colors ${
          preparing ? "bg-[#fafafa] gap-[6px] cursor-progress" : "gap-[4px]"
        } ${disabled ? "cursor-not-allowed" : preparing ? "" : "cursor-pointer group-hover:bg-[#fafafa]"}`}
        data-name="Button · Download"
        disabled={disabled || preparing}
        onClick={(e) => {
          e.stopPropagation();
          onDownload();
        }}
        type="button"
      >
        {preparing ? (
          <Spinner />
        ) : (
          <div className="relative shrink-0 size-[20px]">
            <img alt="" className={`absolute block inset-0 max-w-none size-full ${disabled ? "" : "group-hover:opacity-0"}`} src={disabled ? imgDownloadDisabled : imgDownload} />
            {!disabled && <img alt="" className="absolute block inset-0 max-w-none opacity-0 size-full group-hover:opacity-100" src={imgDownloadHover} />}
          </div>
        )}
        <span
          className={`@max-[400px]:sr-only font-['TT_Interphases_Pro:DemiBold'] leading-[20px] px-[2px] text-[14px] whitespace-nowrap ${
            disabled ? "text-[#9ca3af]" : preparing ? "text-[#374151]" : "text-[#404040] group-hover:text-[#262626]"
          }`}
        >
          Download
        </span>
      </button>
    </div>
  );
}

function SkeletonRow() {
  return (
    <div className="bg-[#fafafa] border border-[#e5e5e5] border-solid content-stretch flex gap-[12px] items-center overflow-clip p-[16px] relative rounded-[12px] shrink-0 w-full" data-name="Skeleton">
      <div className="animate-pulse bg-[#f5f5f5] rounded-[8px] shrink-0 size-[40px]" />
      <div className="flex flex-[1_0_0] flex-col gap-[8px] items-start min-w-px">
        <div className="animate-pulse bg-[#f5f5f5] h-[14px] rounded-[4px] w-[140px]" />
        <div className="animate-pulse bg-[#f5f5f5] h-[12px] rounded-[4px] w-[200px]" />
      </div>
      <div className="animate-pulse bg-[#f5f5f5] h-[14px] rounded-[4px] shrink-0 w-[90px]" />
    </div>
  );
}

function ErrorState({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="flex flex-col h-[160px] items-center justify-center shrink-0 w-full" data-name="Error state">
      <div className="flex flex-col gap-[12px] items-center w-full">
        <div className="bg-[#fee4e2] relative rounded-[20px] shrink-0 size-[40px]">
          <div className="-translate-x-1/2 -translate-y-1/2 absolute left-1/2 size-[24px] top-1/2">
            <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgErrAlert} />
          </div>
        </div>
        <div className="[word-break:break-word] flex flex-col gap-[4px] items-center not-italic text-center w-full">
          <p className="font-['TT_Interphases_Pro:DemiBold'] leading-[24px] text-[#171717] text-[16px] whitespace-nowrap">Report overview is unavailable</p>
          <p className="font-['TT_Interphases_Pro:Regular'] leading-[20px] text-[#525252] text-[14px] w-full">{`We couldn't load this data right now. Please try again.`}</p>
        </div>
        <button
          className="bg-white border border-[#d4d4d4] border-solid cursor-pointer drop-shadow-[0px_1px_1px_rgba(0,0,0,0.05)] flex gap-[4px] hover:bg-[#fafafa] items-center justify-center px-[12px] py-[8px] rounded-[9999px] shrink-0"
          data-name="Button · Retry"
          onClick={onRetry}
          type="button"
        >
          <img alt="" className="block shrink-0 size-[20px]" src={imgRefresh} />
          <span className="font-['TT_Interphases_Pro:DemiBold'] leading-[20px] px-[2px] text-[#404040] text-[14px] whitespace-nowrap">Retry</span>
        </button>
      </div>
    </div>
  );
}

type MenuOption = { value: string; label: string; sub?: string };

function SelectField({
  label,
  value,
  options,
  selected,
  open,
  onOpenChange,
  onSelect,
  menuMinWidth,
  menuMaxHeight,
}: {
  label?: string;
  value: string;
  options: MenuOption[];
  selected: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelect: (value: string) => void;
  menuMinWidth?: number;
  menuMaxHeight?: number;
}) {
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const [rect, setRect] = useState<DOMRect | null>(null);

  useLayoutEffect(() => {
    if (open && triggerRef.current) setRect(triggerRef.current.getBoundingClientRect());
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const close = (e: Event) => {
      const t = e.target as Node;
      if (menuRef.current?.contains(t) || triggerRef.current?.contains(t)) return;
      onOpenChange(false);
    };
    const reposition = () => triggerRef.current && setRect(triggerRef.current.getBoundingClientRect());
    document.addEventListener("mousedown", close);
    window.addEventListener("resize", reposition);
    document.addEventListener("scroll", reposition, true);
    return () => {
      document.removeEventListener("mousedown", close);
      window.removeEventListener("resize", reposition);
      document.removeEventListener("scroll", reposition, true);
    };
  }, [open, onOpenChange]);

  // Bring the selected option into view when a long list (e.g. months) opens.
  const menuReady = open && rect !== null;
  useEffect(() => {
    const menu = menuRef.current;
    const item = menu?.querySelector<HTMLElement>("[aria-selected='true']");
    if (menuReady && menu && item && item.offsetTop + item.offsetHeight > menu.clientHeight)
      menu.scrollTop = item.offsetTop + item.offsetHeight - menu.clientHeight + 8;
  }, [menuReady]);

  return (
    <div className="flex flex-col gap-[6px] items-start relative shrink-0 w-full">
      {label && <p className="font-['TT_Interphases_Pro:DemiBold'] leading-[24px] text-[#404040] text-[16px] whitespace-nowrap">{label}</p>}
      <button
        aria-expanded={open}
        aria-haspopup="listbox"
        className={`bg-white border-solid cursor-pointer flex gap-[8px] items-center overflow-clip relative rounded-[8px] shrink-0 text-left w-full ${
          open ? "border-2 border-[#ff8933] px-[12px] py-[8px]" : "border border-[#d4d4d4] px-[13px] py-[9px] shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05)]"
        }`}
        data-name="Input"
        onClick={() => onOpenChange(!open)}
        ref={triggerRef}
        type="button"
      >
        <span className="flex-[1_0_0] font-['TT_Interphases_Pro:Regular'] leading-[24px] min-w-px overflow-hidden text-[#171717] text-[16px] text-ellipsis whitespace-nowrap">{value}</span>
        <img alt="" className={`block shrink-0 size-[20px] transition-transform ${open ? "rotate-180" : ""}`} src={imgChevronDown} />
      </button>
      {open &&
        rect &&
        createPortal(
          <div
            className="bg-white border border-[#d4d4d4] border-solid fixed overflow-y-auto py-[7px] report-menu-scroll rounded-[8px] shadow-[0px_12px_16px_-4px_rgba(0,0,0,0.08),0px_4px_6px_-2px_rgba(0,0,0,0.03)] z-[1001]"
            data-name="Dropdown List"
            ref={menuRef}
            role="listbox"
            style={{ left: rect.left, top: rect.bottom + 4, width: Math.max(rect.width, menuMinWidth ?? 0), maxHeight: menuMaxHeight }}
          >
            {options.map((o) => {
              const isSelected = o.value === selected;
              return (
                <div className="flex items-center px-[6px] py-px w-full" key={o.value}>
                  <button
                    aria-selected={isSelected}
                    className={`cursor-pointer flex flex-[1_0_0] gap-[8px] hover:bg-[#fafafa] items-center min-w-px pl-[8px] pr-[10px] py-[10px] rounded-[6px] text-left ${isSelected ? "bg-[#fafafa]" : ""}`}
                    onClick={() => {
                      onSelect(o.value);
                      onOpenChange(false);
                    }}
                    role="option"
                    type="button"
                  >
                    <span className="[word-break:break-word] flex flex-[1_0_0] flex-col gap-[2px] min-w-px not-italic">
                      <span className="font-['TT_Interphases_Pro:Medium'] leading-[24px] text-[#404040] text-[16px] whitespace-nowrap">{o.label}</span>
                      {o.sub && <span className="font-['TT_Interphases_Pro:Regular'] leading-[20px] text-[#525252] text-[14px]">{o.sub}</span>}
                    </span>
                    {isSelected && <img alt="" className="block shrink-0 size-[20px]" src={imgMenuCheck} />}
                  </button>
                </div>
              );
            })}
          </div>,
          document.body,
        )}
    </div>
  );
}

function Radio({ checked }: { checked: boolean }) {
  return checked ? (
    <div className="bg-[#ff6b00] border border-[#ff6b00] border-solid overflow-clip relative rounded-[10px] shrink-0 size-[20px]">
      <div className="absolute bg-white inset-[calc(30%-0.4px)] rounded-[9999px]" />
    </div>
  ) : (
    <div className="bg-white border border-[#d4d4d4] border-solid overflow-clip relative rounded-[10px] shrink-0 size-[20px]" />
  );
}

function CheckboxBox({ state }: { state: "checked" | "unchecked" | "indeterminate" }) {
  if (state === "unchecked") return <div className="bg-white border border-[#d4d4d4] border-solid overflow-clip relative rounded-[4px] shrink-0 size-[16px]" />;
  return (
    <div className="bg-[#ff6b00] border border-[#ff6b00] border-solid overflow-clip relative rounded-[4px] shrink-0 size-[16px]">
      <div className="absolute inset-[calc(12.5%-0.75px)]">
        <img alt="" className="absolute block inset-0 max-w-none size-full" src={state === "checked" ? imgCheckboxCheck : imgMinus} />
      </div>
    </div>
  );
}

function RadioOption({ checked, title, description, onSelect }: { checked: boolean; title: string; description: string; onSelect: () => void }) {
  return (
    <button aria-checked={checked} className="cursor-pointer flex gap-[8px] items-start shrink-0 text-left w-full" onClick={onSelect} role="radio" type="button">
      <span className="flex items-center justify-center pt-[2px] shrink-0">
        <Radio checked={checked} />
      </span>
      <span className="[word-break:break-word] flex flex-[1_0_0] flex-col gap-[2px] min-w-px not-italic text-[16px]">
        <span className="font-['TT_Interphases_Pro:DemiBold'] leading-[24px] text-[#171717]">{title}</span>
        <span className="font-['TT_Interphases_Pro:Regular'] leading-[24px] text-[#404040]">{description}</span>
      </span>
    </button>
  );
}

function ColumnPicker({ columns, selected, onChange }: { columns: string[]; selected: Set<string>; onChange: (next: Set<string>) => void }) {
  const half = Math.ceil(columns.length / 2);
  const all = selected.size === columns.length;
  const toggle = (c: string) => {
    const next = new Set(selected);
    if (next.has(c)) next.delete(c);
    else next.add(c);
    onChange(next);
  };
  const renderColumn = (list: string[]) => (
    <div className="flex flex-[1_0_0] flex-col gap-[12px] items-start min-w-px">
      {list.map((c) => (
        <button aria-checked={selected.has(c)} className="cursor-pointer flex gap-[8px] items-start text-left w-full" key={c} onClick={() => toggle(c)} role="checkbox" type="button">
          <span className="flex items-center justify-center pt-[2px] shrink-0">
            <CheckboxBox state={selected.has(c) ? "checked" : "unchecked"} />
          </span>
          <span className="[word-break:break-word] flex-[1_0_0] font-['TT_Interphases_Pro:DemiBold'] leading-[20px] min-w-px text-[#171717] text-[14px]">{c}</span>
        </button>
      ))}
    </div>
  );
  return (
    <div className="border border-[#e5e5e5] border-solid flex flex-col gap-[12px] items-start p-[16px] rounded-[12px] shrink-0 w-full" data-name="Columns (choose information)">
      <div className="flex items-center justify-between w-full">
        <button
          aria-checked={all ? true : selected.size === 0 ? false : "mixed"}
          className="cursor-pointer flex gap-[8px] items-center"
          onClick={() => onChange(all ? new Set() : new Set(columns))}
          role="checkbox"
          type="button"
        >
          <CheckboxBox state={all ? "checked" : selected.size === 0 ? "unchecked" : "indeterminate"} />
          <span className="font-['TT_Interphases_Pro:DemiBold'] leading-[20px] text-[#171717] text-[14px] whitespace-nowrap">Select all</span>
        </button>
        <p className="font-['TT_Interphases_Pro:Regular'] leading-[20px] text-[#525252] text-[14px] whitespace-nowrap">
          {selected.size} of {columns.length} selected
        </p>
      </div>
      <div className="bg-[#e5e5e5] h-px shrink-0 w-full" />
      <div className="flex gap-[16px] items-start w-full">
        {renderColumn(columns.slice(0, half))}
        {renderColumn(columns.slice(half))}
      </div>
    </div>
  );
}

type MenuId = "product" | "from" | "to" | "year" | "format";

function DownloadReportModal({ report, onClose, onDownload }: { report: ReportSummary; onClose: () => void; onDownload: (request: DownloadRequest) => void }) {
  const isTransactionHistory = report.id === "transaction-history";
  const [product, setProduct] = useState(productNames[0]);
  const [period, setPeriod] = useState<"Monthly" | "Yearly">("Monthly");
  const [fromMonth, setFromMonth] = useState(LATEST_MONTH - 5);
  const [toMonth, setToMonth] = useState(LATEST_MONTH);
  const [year, setYear] = useState(2025);
  const [format, setFormat] = useState(formats[0].value);
  const [infoMode, setInfoMode] = useState<"default" | "choose">("default");
  const columnSet = isTransactionHistory ? products[product] : limitFacilityColumns;
  const preselected = (set: ColumnSet) => new Set(set.columns.filter((c) => c.preselected).map((c) => c.label));
  const [selectedColumns, setSelectedColumns] = useState<Set<string>>(() => preselected(columnSet));
  const [openMenu, setOpenMenu] = useState<MenuId | null>(null);
  const menuProps = (id: MenuId) => ({ open: openMenu === id, onOpenChange: (o: boolean) => setOpenMenu(o ? id : null) });

  const changeProduct = (p: string) => {
    setProduct(p);
    setSelectedColumns(preselected(products[p]));
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      if (openMenu) setOpenMenu(null);
      else onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [openMenu, onClose]);

  const changeFrom = (m: number) => {
    setFromMonth(m);
    if (toMonth < m || toMonth - m >= MAX_MONTHS_PER_FILE) setToMonth(Math.min(m + MAX_MONTHS_PER_FILE - 1, LATEST_MONTH));
  };
  const changeTo = (m: number) => {
    setToMonth(m);
    if (fromMonth > m || m - fromMonth >= MAX_MONTHS_PER_FILE) setFromMonth(Math.max(m - MAX_MONTHS_PER_FILE + 1, EARLIEST_MONTH));
  };

  const canDownload = infoMode === "default" || selectedColumns.size > 0;
  const submit = () => {
    if (!canDownload) return;
    onDownload({
      report,
      product: isTransactionHistory ? product : null,
      periodLabel: period === "Monthly" ? rangeLabel(fromMonth, toMonth) : String(year),
      format,
      columns: columnSet.columns.map((c) => c.label).filter((c) => (infoMode === "default" ? preselected(columnSet) : selectedColumns).has(c)),
    });
  };

  const monthMenu = monthOptions.map((m) => ({ value: String(m), label: monthLabel(m) }));

  return createPortal(
    <div className="fixed inset-0 flex items-center justify-center p-[16px] sm:p-[40px] z-[1000]" data-name="Modal · Download report root">
      <div className="absolute bg-[#030712] inset-0 opacity-70 report-overlay-in" data-name="Background overlay" onClick={onClose} />
      <div
        aria-labelledby="download-report-title"
        aria-modal="true"
        className="bg-white flex flex-col items-start max-h-full max-w-[516px] overflow-clip relative report-modal-in rounded-[12px] shadow-[0px_12px_16px_-4px_rgba(0,0,0,0.08),0px_4px_6px_-2px_rgba(0,0,0,0.03)] w-full"
        data-name="Modal · Download report"
        role="dialog"
      >
        <div className="flex flex-col items-center relative shrink-0 w-full" data-name="_Modal header">
          <div className="flex flex-col gap-[16px] items-start pt-[24px] px-[24px] w-full">
            <FeaturedIcon src={imgModalDownload} />
            <div className="[word-break:break-word] flex flex-col gap-[2px] items-start not-italic w-full">
              <p className="font-['TT_Interphases_Pro:DemiBold'] leading-[28px] text-[#171717] text-[18px] w-full" id="download-report-title">
                Download {report.title} report
              </p>
              <p className="font-['TT_Interphases_Pro:Regular'] leading-[20px] text-[#525252] text-[14px] w-full">
                {isTransactionHistory ? "Choose the product, period, format and information to include." : "Choose the period, format and information to include."}
              </p>
            </div>
          </div>
          <button aria-label="Close" className="absolute cursor-pointer flex hover:bg-[#f5f5f5] items-center justify-center p-[8px] right-[16px] rounded-[9999px] size-[36px] top-[16px]" data-name="Button close X" onClick={onClose} type="button">
            <img alt="" className="block shrink-0 size-[20px]" src={imgXClose} />
          </button>
          <div className="h-[20px] shrink-0 w-full" />
          <img alt="" className="block h-px shrink-0 w-full" src={imgModalDivider} />
        </div>

        <div className="flex flex-[1_1_auto] flex-col gap-[20px] items-start min-h-0 overflow-y-auto pt-[20px] px-[24px] report-modal-scroll w-full" data-name="Body">
          {isTransactionHistory && (
            <SelectField
              label="Product"
              onSelect={changeProduct}
              options={productNames.map((p) => ({ value: p, label: p }))}
              selected={product}
              value={product}
              {...menuProps("product")}
            />
          )}

          <div className="flex flex-col gap-[8px] items-start shrink-0 w-full" data-name="Period">
            <div className="flex items-center justify-between w-full">
              <p className="font-['TT_Interphases_Pro:DemiBold'] leading-[24px] text-[#404040] text-[16px] whitespace-nowrap">Period</p>
              <div className="border border-[#d4d4d4] border-solid flex items-start overflow-clip rounded-[8px] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] shrink-0" data-name="Button group · Monthly / Yearly" role="group">
                {(["Monthly", "Yearly"] as const).map((p, i) => (
                  <button
                    aria-pressed={period === p}
                    className={`cursor-pointer flex items-center justify-center min-h-[36px] px-[14px] py-[8px] ${i === 0 ? "border-r border-[#d4d4d4] border-solid" : ""} ${
                      period === p ? "bg-[#f5f5f5]" : "bg-white hover:bg-[#fafafa]"
                    }`}
                    key={p}
                    onClick={() => {
                      setPeriod(p);
                      setOpenMenu(null);
                    }}
                    type="button"
                  >
                    <span className="font-['TT_Interphases_Pro:DemiBold'] leading-[20px] text-[#404040] text-[14px] whitespace-nowrap">{p}</span>
                  </button>
                ))}
              </div>
            </div>
            {period === "Monthly" ? (
              <div className="flex gap-[12px] items-center w-full" data-name="Month range">
                <div className="flex-[1_0_0] min-w-px">
                  <SelectField menuMaxHeight={338} menuMinWidth={240} onSelect={(v) => changeFrom(Number(v))} options={monthMenu} selected={String(fromMonth)} value={monthLabel(fromMonth)} {...menuProps("from")} />
                </div>
                <p className="font-['TT_Interphases_Pro:Regular'] leading-[20px] text-[#525252] text-[14px] whitespace-nowrap">to</p>
                <div className="flex-[1_0_0] min-w-px">
                  <SelectField menuMaxHeight={338} menuMinWidth={240} onSelect={(v) => changeTo(Number(v))} options={monthMenu} selected={String(toMonth)} value={monthLabel(toMonth)} {...menuProps("to")} />
                </div>
              </div>
            ) : (
              <SelectField
                onSelect={(v) => setYear(Number(v))}
                options={yearOptions.map((y) => ({ value: String(y), label: String(y), sub: y === 2026 ? "Jan – Aug, year to date" : undefined }))}
                selected={String(year)}
                value={String(year)}
                {...menuProps("year")}
              />
            )}
            <p className="font-['TT_Interphases_Pro:Regular'] leading-[20px] text-[#525252] text-[14px] w-full">
              {period === "Monthly" ? "Last 6 months by default. Up to 12 months per file." : "One full year per file, January to December."}
            </p>
          </div>

          <SelectField label="Format" onSelect={setFormat} options={formats.map((f) => ({ value: f.value, label: f.value, sub: f.sub }))} selected={format} value={format} {...menuProps("format")} />

          <div className="flex flex-col gap-[12px] items-start shrink-0 w-full" data-name="Information to include" role="radiogroup">
            <p className="font-['TT_Interphases_Pro:DemiBold'] leading-[24px] text-[#404040] text-[16px] whitespace-nowrap">Information to include</p>
            <RadioOption checked={infoMode === "default"} description={columnSet.defaultInfo} onSelect={() => setInfoMode("default")} title="Default information" />
            <RadioOption checked={infoMode === "choose"} description="Select only the columns you need." onSelect={() => setInfoMode("choose")} title="Choose information" />
            {infoMode === "choose" && <ColumnPicker columns={columnSet.columns.map((c) => c.label)} onChange={setSelectedColumns} selected={selectedColumns} />}
          </div>
        </div>

        <div className="flex flex-col items-start pt-[32px] shrink-0 w-full" data-name="_Modal actions">
          <img alt="" className="block h-[25px] shrink-0 w-full" src={imgDividerWrap} />
          <div className="flex gap-[12px] items-start pb-[24px] px-[24px] w-full">
            <button
              className="bg-white border border-[#d0d5dd] border-solid cursor-pointer drop-shadow-[0px_1px_1px_rgba(16,24,40,0.05)] flex flex-[1_0_0] hover:bg-[#fafafa] items-center justify-center min-w-px px-[16px] py-[10px] rounded-[9999px]"
              onClick={onClose}
              type="button"
            >
              <span className="font-['TT_Interphases_Pro:DemiBold'] leading-[24px] px-[2px] text-[#404040] text-[16px] whitespace-nowrap">Cancel</span>
            </button>
            <button
              className="bg-[#ff6b00] border border-[#ff6b00] border-solid cursor-pointer disabled:cursor-not-allowed disabled:opacity-50 drop-shadow-[0px_1px_1px_rgba(16,24,40,0.05)] enabled:hover:bg-[#f25f00] flex flex-[1_0_0] items-center justify-center min-w-px px-[16px] py-[10px] rounded-[9999px]"
              disabled={!canDownload}
              onClick={submit}
              type="button"
            >
              <span className="font-['TT_Interphases_Pro:DemiBold'] leading-[24px] px-[2px] text-[16px] text-white whitespace-nowrap">Download</span>
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
}

// "preparing" shows from the moment the modal's Download is clicked until the file is ready.
type Toast = { id: number; kind: "preparing" | "success" | "error"; message: string };

const toastBg: Record<Toast["kind"], string> = { preparing: "bg-[#1f2937]", success: "bg-[#16a34a]", error: "bg-[#dc2626]" };

function ReportToast({ toast, onDismiss }: { toast: Toast; onDismiss: () => void }) {
  const isError = toast.kind === "error";
  return createPortal(
    <div className="-translate-x-1/2 fixed left-1/2 max-w-[calc(100vw-32px)] report-toast-in top-[90px] w-[560px] z-[1002]" key={toast.id}>
      <div
        aria-live={isError ? "assertive" : "polite"}
        className={`flex gap-[8px] items-center pl-[12px] pr-[24px] py-[12px] rounded-[8px] w-full ${toastBg[toast.kind]}`}
        data-name="Toast"
        onClick={onDismiss}
        role={isError ? "alert" : "status"}
      >
        {toast.kind === "preparing" ? (
          // The arc's circle sits at (11.25, 11.25) in the SVG, so it spins around that point.
          <span className="relative shrink-0 size-[24px]">
            <img alt="" className="absolute animate-spin block left-[-1.25px] max-w-none origin-[11.25px_11.25px] size-[25.25px] top-[-1.25px]" src={imgToastSpinner} />
          </span>
        ) : (
          <img alt="" className="block shrink-0 size-[24px]" src={isError ? imgToastAlert : imgToastCheck} />
        )}
        <div className="flex flex-[1_0_0] gap-[32px] items-center min-w-px">
          <p className="[word-break:break-word] flex-[1_0_0] font-['TT_Interphases_Pro:Regular'] leading-[20px] min-w-px text-[14px] text-white">{toast.message}</p>
          {isError && (
            <button
              className="cursor-pointer font-['TT_Interphases_Pro:DemiBold'] hover:underline leading-[20px] shrink-0 text-[14px] text-white whitespace-nowrap"
              onClick={(e) => {
                e.stopPropagation();
                onDismiss();
              }}
              type="button"
            >
              Okay
            </button>
          )}
        </div>
      </div>
    </div>,
    document.body,
  );
}

export default function ReportOverviewWidget({ className = "" }: { className?: string }) {
  const [status, setStatus] = useState<Status>("loading");
  const [reports, setReports] = useState<ReportSummary[]>([]);
  const [modalReport, setModalReport] = useState<ReportSummary | null>(null);
  const [preparing, setPreparing] = useState<Partial<Record<ReportId, boolean>>>({});
  const [toast, setToast] = useState<Toast | null>(null);

  const load = useCallback(() => {
    setStatus("loading");
    fetchReportOverview()
      .then((data) => {
        setReports(data);
        setStatus("ready");
      })
      .catch(() => setStatus("error"));
  }, []);

  useEffect(() => {
    if (forcedState() === "loading") return;
    load();
  }, [load]);

  useEffect(() => {
    if (!toast || toast.kind === "preparing") return;
    const t = window.setTimeout(() => setToast(null), toast.kind === "error" ? 8000 : 5000);
    return () => window.clearTimeout(t);
  }, [toast]);

  useEffect(() => {
    if (!modalReport) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [modalReport]);

  const download = (request: DownloadRequest) => {
    setModalReport(null);
    setPreparing((p) => ({ ...p, [request.report.id]: true }));
    const fmt = formats.find((f) => f.value === request.format)?.short ?? request.format;
    const details = `(${fmt}, ${request.periodLabel})`;
    // The result reuses the preparing toast's id so it swaps in place instead of sliding in again.
    const id = Date.now();
    setToast({ id, kind: "preparing", message: `Downloading ${reportName(request)} report ${details}.` });
    prepareReportFile(request)
      .then(() => setToast({ id, kind: "success", message: `${reportName(request)} report downloaded ${details}.` }))
      .catch(() => setToast({ id, kind: "error", message: `Failed to download the ${reportName(request)} report. Please try again later.` }))
      .finally(() => setPreparing((p) => ({ ...p, [request.report.id]: false })));
  };

  return (
    <div
      className={`@container bg-white border border-[#e5e5e5] border-solid content-stretch flex flex-col gap-[16px] items-start overflow-clip p-[24px] relative rounded-[16px] ${className}`}
      data-node-id="79:7"
      data-name="Widget / Report Overview"
    >
      <SectionHeader />
      {status === "error" ? (
        <ErrorState onRetry={load} />
      ) : (
        <div aria-busy={status === "loading"} className="flex flex-col gap-[12px] items-start overflow-clip shrink-0 w-full" data-name="Reports">
          {status === "loading"
            ? defaultReports.map((r) => <SkeletonRow key={r.id} />)
            : reports.map((r) => <ReportRow key={r.id} onDownload={() => setModalReport(r)} preparing={!!preparing[r.id]} report={r} />)}
        </div>
      )}
      {modalReport && <DownloadReportModal key={modalReport.id} onClose={() => setModalReport(null)} onDownload={download} report={modalReport} />}
      {toast && <ReportToast onDismiss={() => setToast(null)} toast={toast} />}
    </div>
  );
}
