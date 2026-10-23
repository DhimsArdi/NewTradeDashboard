import { useLayoutEffect, useRef, useState } from "react";
import AppNavigation from "./AppNavigation";
import TransactionHistoryWidget from "./TransactionHistoryWidget";
import ReportOverviewWidget from "./ReportOverviewWidget";
import CalendarWidget from "./CalendarWidget";
import LimitFacilityWidget from "./LimitFacilityWidget";
import TransactionOverviewWidget from "./TransactionOverviewWidget";
import QuickAccessWidget from "./QuickAccessWidget";
import { DevDataToggle, useDataset } from "./devData";
import PageHeader from "./PageHeader";
import { AmountsHiddenProvider } from "./amountVisibility";

const assetPathPrefix = "/assets";
const imgLogo = `${assetPathPrefix}/f2ae2.png`;
const imgSvgLucide = `${assetPathPrefix}/5c708.svg`;
const imgGlobe03 = `${assetPathPrefix}/99317.svg`;
const imgGlobe04 = `${assetPathPrefix}/19f13.svg`;
const imgWallet04 = `${assetPathPrefix}/2d9f2.svg`;
const imgDataflow03 = `${assetPathPrefix}/f8560.svg`;
const imgCoins02 = `${assetPathPrefix}/5b274.svg`;
const imgCoinsHand = `${assetPathPrefix}/5d4d7.svg`;
const imgGlobe01 = `${assetPathPrefix}/314af.svg`;
const imgBell01 = `${assetPathPrefix}/5e207.svg`;
const imgSearch = `${assetPathPrefix}/bbf14.svg`;
const imgGrid01 = `${assetPathPrefix}/bd0bb.svg`;
const imgClipboardCheck = `${assetPathPrefix}/13e1b.svg`;
const imgFileCheck02 = `${assetPathPrefix}/c0068.svg`;
const imgFile07 = `${assetPathPrefix}/056d4.svg`;
const imgBuilding08 = `${assetPathPrefix}/ca8cc.svg`;
const imgUsersPlus = `${assetPathPrefix}/c9439.svg`;
const imgHome02 = `${assetPathPrefix}/1e7c9.svg`;
const imgChartBreakoutCircle = `${assetPathPrefix}/625b8.svg`;
const imgBank = `${assetPathPrefix}/cf740.svg`;
const imgArrowCircleBrokenUpRight = `${assetPathPrefix}/7c7ea.svg`;
const imgContainer1 = `${assetPathPrefix}/62582.svg`;

// Hide Amount is a per-viewer preference, remembered across visits.
const HIDE_AMOUNT_KEY = "trade-dashboard:hide-amount";
const readAmountsHidden = () => {
  try {
    return localStorage.getItem(HIDE_AMOUNT_KEY) === "1";
  } catch {
    return false;
  }
};

const NAV_EXPANDED = 336;
const NAV_COLLAPSED = 88;

export default function TradeDashboardMaster() {
  const [isNavigationCollapsed, setIsNavigationCollapsed] = useState(false);
  const [notice, setNotice] = useState("");
  const [amountsHidden, setAmountsHidden] = useState(readAmountsHidden);
  const toggleAmounts = () => {
    const next = !amountsHidden;
    setAmountsHidden(next);
    try {
      localStorage.setItem(HIDE_AMOUNT_KEY, next ? "1" : "0");
    } catch {
      // Storage can be blocked; the toggle still works for this visit.
    }
  };
  // Dev-only fixture switch; remounting the widgets reloads them with the chosen dataset.
  const dataset = useDataset();
  const contentRef = useRef<HTMLDivElement>(null);
  const contentLeft = isNavigationCollapsed ? NAV_COLLAPSED : NAV_EXPANDED;
  const previousLeft = useRef(contentLeft);

  // Animating `left` re-lays out the whole dashboard every frame. Instead the content moves to its new
  // offset once and a WAAPI transform slides it from the old one, which the compositor can run off the main thread.
  useLayoutEffect(() => {
    const el = contentRef.current;
    const delta = previousLeft.current - contentLeft;
    previousLeft.current = contentLeft;
    if (!el || delta === 0 || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    el.animate([{ transform: `translateX(${delta}px)` }, { transform: "translateX(0)" }], {
      duration: 200,
      easing: "cubic-bezier(0.23, 1, 0.32, 1)",
    });
  }, [contentLeft]);

  const handleDashboardClick = (event: React.MouseEvent<HTMLDivElement>) => {
    const target = (event.target as HTMLElement).closest<HTMLElement>("[data-name]");
    const name = target?.dataset.name ?? "";

    if (name.startsWith("Shortcut ·")) {
      setNotice(`${name.replace("Shortcut · ", "")} opened`);
    }
  };

  return (
    <div
      className="bg-[#fcfcfc] dashboard-viewport min-h-[1091px] relative w-full"
      data-node-id="2:19885"
      data-name="Trade Dashboard [Master]"
      onClick={handleDashboardClick}
    >
      <AppNavigation collapsed={isNavigationCollapsed} onToggle={() => setIsNavigationCollapsed((c) => !c)} onNotify={setNotice} />
      <div
        ref={contentRef}
        className="absolute min-h-full pointer-events-none right-0 top-0 left-[var(--content-left)]"
        style={{ "--content-left": `${contentLeft}px` } as React.CSSProperties}
        data-node-id="2:19887"
      >
        <div className="content-stretch flex flex-col items-start min-w-[400px] pointer-events-auto pr-[8px] py-[8px] rounded-[16px] w-full" data-name="container_wrapper">
          <div className="bg-[#f5f5f5] border border-[#e5e5e5] border-solid content-stretch flex flex-col items-start min-h-[calc(100svh-16px)] overflow-clip pb-[32px] pt-[40px] relative rounded-[16px] shrink-0 w-full" data-node-id="2:19888" data-name="Main">
            <div className="@container flex flex-col gap-[32px] max-w-[1280px] relative self-center shrink-0 w-full" data-node-id="42:64534" data-name="Vertical Scroll">
              <div className="flex px-[32px] w-full">
                <PageHeader amountsHidden={amountsHidden} onToggleAmounts={toggleAmounts} onManageWidget={() => setNotice("Manage Widget opened")} />
              </div>
              <AmountsHiddenProvider value={amountsHidden}>
                <div className="@min-[880px]:flex-row content-stretch flex flex-col gap-[24px] items-start px-[32px] relative shrink-0 w-full" data-node-id="2:19891" data-name="Container <>">
                  <div className="@min-[880px]:flex-[1_0_0] content-stretch flex flex-col gap-[24px] items-start min-w-px relative w-full" data-node-id="2:19892" data-name="Left-Column">
                    <LimitFacilityWidget key={`limit-${dataset}`} className="shrink-0 w-full" />
                    <TransactionHistoryWidget key={`history-${dataset}`} className="shrink-0 w-full" />
                    <ReportOverviewWidget key={`report-${dataset}`} className="shrink-0 w-full" />
                  </div>
                  <div className="@min-[880px]:flex-[1_0_0] content-stretch flex flex-col gap-[24px] items-center min-w-px relative w-full" data-node-id="2:20089" data-name="Right-Column">
                    <TransactionOverviewWidget key={`overview-${dataset}`} className="shrink-0 w-full" />
                    <CalendarWidget key={`calendar-${dataset}`} className="shrink-0 w-full" />
                    <QuickAccessWidget className="shrink-0 w-full" />
                  </div>
                </div>
              </AmountsHiddenProvider>
            </div>
          </div>
        </div>
      </div>
      {notice && (
        <div
          aria-live="polite"
          className="bg-[#171717] bottom-[24px] fixed font-['TT_Interphases_Pro:Medium'] leading-[20px] px-[16px] py-[12px] right-[24px] rounded-[10px] shadow-[0px_8px_24px_rgba(0,0,0,0.18)] text-[14px] text-white z-50"
          onClick={() => setNotice("")}
          role="status"
        >
          {notice}
        </div>
      )}
      <DevDataToggle />
    </div>
  );
}
