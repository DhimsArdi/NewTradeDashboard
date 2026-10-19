import { useLayoutEffect, useRef, useState } from "react";
import AppNavigation from "./AppNavigation";
import TransactionHistoryWidget from "./TransactionHistoryWidget";
import ReportOverviewWidget from "./ReportOverviewWidget";
import CalendarWidget from "./CalendarWidget";
import LimitFacilityWidget from "./LimitFacilityWidget";
import { DevDataToggle, useDataset } from "./devData";

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
const imgAlertCircle = `${assetPathPrefix}/9dcb1.svg`;
const imgArrowRight = `${assetPathPrefix}/9d328.svg`;
const imgClock1 = `${assetPathPrefix}/ea938.svg`;
const imgChevronRight1 = `${assetPathPrefix}/bc2d8.svg`;

const NAV_EXPANDED = 336;
const NAV_COLLAPSED = 88;

export default function TradeDashboardMaster() {
  const [isNavigationCollapsed, setIsNavigationCollapsed] = useState(false);
  const [notice, setNotice] = useState("");
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
          <div className="bg-[#f5f5f5] border border-[#e5e5e5] border-solid content-stretch flex flex-col items-start min-h-[calc(100svh-16px)] overflow-clip py-[32px] relative rounded-[16px] shrink-0 w-full" data-node-id="2:19888" data-name="Main">
            <div className="@container flex flex-col gap-[32px] max-w-[1280px] relative self-center shrink-0 w-full" data-node-id="42:64534" data-name="Vertical Scroll">
              <div className="content-stretch flex flex-col items-start px-[32px] relative shrink-0 w-full" data-node-id="2:19889" data-name="Header Section 1">
                <div className="content-stretch flex flex-col gap-[20px] isolate items-start relative shrink-0 w-full" data-node-id="2:19890" data-name="Section header">
                  <div className="content-stretch flex gap-[16px] items-start relative shrink-0 w-full z-[2]" data-node-id="I2:19890;3839:10709" data-name="Content">
                    <div className="[word-break:break-word] content-stretch flex flex-[1_0_0] flex-col gap-[2px] items-start justify-center min-w-px not-italic relative self-stretch" data-node-id="I2:19890;3839:10710" data-name="Text and supporting text">
                      <p className="font-['TT_Interphases_Pro:Bold'] leading-[1.2] relative shrink-0 text-[#171717] text-[20px] w-full" data-node-id="I2:19890;3839:10711">
                        Financial Overview
                      </p>
                      <p className="font-['TT_Interphases_Pro:Regular'] leading-[24px] overflow-hidden relative shrink-0 text-[#525252] text-[16px] text-ellipsis w-full whitespace-nowrap" data-node-id="I2:19890;3839:10712">
                        Monitor your trade activities, check limits, and manage tasks.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="@min-[880px]:flex-row content-stretch flex flex-col gap-[24px] items-start px-[32px] relative shrink-0 w-full" data-node-id="2:19891" data-name="Container <>">
                <div className="@min-[880px]:flex-[1_0_0] content-stretch flex flex-col gap-[24px] items-start min-w-px relative w-full" data-node-id="2:19892" data-name="Left-Column">
                  <LimitFacilityWidget key={`limit-${dataset}`} className="shrink-0 w-full" />
                  <TransactionHistoryWidget key={`history-${dataset}`} className="shrink-0 w-full" />
                  <ReportOverviewWidget key={`report-${dataset}`} className="shrink-0 w-full" />
                </div>
                <div className="@min-[880px]:flex-[1_0_0] content-stretch flex flex-col gap-[24px] items-center min-w-px relative w-full" data-node-id="2:20089" data-name="Right-Column">
                  <div className="content-stretch flex gap-[24px] items-stretch relative shrink-0 w-full" data-node-id="2:20090">
                    <div className="bg-white border border-[#e5e5e5] border-solid content-stretch flex flex-[1_0_0] flex-col gap-[12px] items-start min-w-px overflow-clip p-[20px] relative rounded-[16px]" data-node-id="2:20091" data-name="Transaction Overview / Need your action">
                      <div className="bg-white content-stretch flex gap-[8px] items-center overflow-clip relative shrink-0 w-full" data-node-id="I2:20091;2:19311" data-name="Top">
                        <div className="bg-[#fee4e2] relative rounded-[20px] shrink-0 size-[32px]" data-node-id="I2:20091;2:19312" data-name="Featured icon">
                          <div className="-translate-x-1/2 -translate-y-1/2 absolute left-1/2 size-[19.2px] top-1/2" data-node-id="I2:20091;2:19312;65:260" data-name="alert-circle">
                            <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgAlertCircle} />
                          </div>
                        </div>
                        <p className="[word-break:break-word] flex-[1_0_0] font-['TT_Interphases_Pro:Medium'] leading-[24px] min-w-px not-italic relative text-[#404040] text-[16px]" data-node-id="I2:20091;2:19313">
                          Need your action
                        </p>
                      </div>
                      <p className="[word-break:break-word] font-['TT_Interphases_Pro:Bold'] leading-[1.2] not-italic relative shrink-0 text-[#171717] text-[24px] whitespace-nowrap" data-node-id="I2:20091;2:19314">
                        4
                      </p>
                      <p className="[word-break:break-word] font-['TT_Interphases_Pro:Regular'] min-h-[40px] leading-[20px] min-w-full not-italic relative shrink-0 text-[#525252] text-[14px] w-[min-content]" data-node-id="I2:20091;2:19315">
                        Partially rejected or returned by the bank.
                      </p>
                      <div className="content-stretch drop-shadow-[0px_1px_1px_rgba(0,0,0,0.05)] flex gap-[6px] items-center justify-center relative rounded-[9999px] shrink-0" data-node-id="I2:20091;2:19316" data-name="Buttons">
                        <p className="[word-break:break-word] font-['TT_Interphases_Pro:DemiBold'] leading-[20px] not-italic relative shrink-0 text-[#ff6b00] text-[14px] whitespace-nowrap" data-node-id="I2:20091;2:19316;189:9163">
                          View tasks
                        </p>
                        <div className="relative shrink-0 size-[20px]" data-node-id="I2:20091;2:19316;189:9164" data-name="placeholder">
                          <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgArrowRight} />
                        </div>
                      </div>
                    </div>
                    <div className="bg-white border border-[#e5e5e5] border-solid content-stretch flex flex-[1_0_0] flex-col gap-[12px] items-start min-w-px overflow-clip p-[20px] relative rounded-[16px]" data-node-id="2:20092" data-name="Transaction Overview / In progress">
                      <div className="bg-white content-stretch flex gap-[8px] items-center overflow-clip relative shrink-0 w-full" data-node-id="I2:20092;2:19318" data-name="Top">
                        <div className="bg-[#fef0c7] relative rounded-[20px] shrink-0 size-[32px]" data-node-id="I2:20092;2:19319" data-name="Featured icon">
                          <div className="-translate-x-1/2 -translate-y-1/2 absolute left-1/2 size-[15.36px] top-1/2" data-node-id="I2:20092;2:19319;65:266" data-name="alert-triangle">
                            <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgClock1} />
                          </div>
                        </div>
                        <p className="[word-break:break-word] flex-[1_0_0] font-['TT_Interphases_Pro:Medium'] leading-[24px] min-w-px not-italic relative text-[#404040] text-[16px]" data-node-id="I2:20092;2:19320">
                          In progress
                        </p>
                      </div>
                      <p className="[word-break:break-word] font-['TT_Interphases_Pro:Bold'] leading-[1.2] not-italic relative shrink-0 text-[#171717] text-[24px] whitespace-nowrap" data-node-id="I2:20092;2:19321">
                        6
                      </p>
                      <p className="[word-break:break-word] font-['TT_Interphases_Pro:Regular'] min-h-[40px] leading-[20px] min-w-full not-italic relative shrink-0 text-[#525252] text-[14px] w-[min-content]" data-node-id="I2:20092;2:19322">
                        Waiting for approval or processed by the bank.
                      </p>
                      <div className="content-stretch drop-shadow-[0px_1px_1px_rgba(0,0,0,0.05)] flex gap-[6px] items-center justify-center relative rounded-[9999px] shrink-0" data-node-id="I2:20092;2:19323" data-name="Buttons">
                        <p className="[word-break:break-word] font-['TT_Interphases_Pro:DemiBold'] leading-[20px] not-italic relative shrink-0 text-[#ff6b00] text-[14px] whitespace-nowrap" data-node-id="I2:20092;2:19323;189:9163">
                          View details
                        </p>
                        <div className="relative shrink-0 size-[20px]" data-node-id="I2:20092;2:19323;189:9164" data-name="placeholder">
                          <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgArrowRight} />
                        </div>
                      </div>
                    </div>
                  </div>
                  <CalendarWidget key={`calendar-${dataset}`} className="shrink-0 w-full" />
                  <div className="bg-white border border-[#e5e5e5] border-solid content-stretch flex flex-col gap-[16px] items-center overflow-clip p-[24px] relative rounded-[16px] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] shrink-0 w-full" data-node-id="2:20198" data-name="Widget / Quick Access (input PO)">
                    <div className="content-stretch flex flex-col gap-[20px] isolate items-start relative shrink-0 w-full" data-node-id="2:20199" data-name="Section header">
                      <div className="content-stretch flex gap-[16px] items-start relative shrink-0 w-full z-[2]" data-node-id="I2:20199;3932:6956" data-name="Content">
                        <div className="[word-break:break-word] content-stretch flex flex-[1_0_0] flex-col gap-[2px] items-start justify-center min-w-px not-italic relative self-stretch" data-node-id="I2:20199;3932:6957" data-name="Text and supporting text">
                          <p className="font-['TT_Interphases_Pro:Bold'] leading-[1.2] relative shrink-0 text-[#171717] text-[18px] w-full" data-node-id="I2:20199;3932:6958">
                            Quick Access
                          </p>
                          <p className="font-['TT_Interphases_Pro:Regular'] leading-[20px] overflow-hidden relative shrink-0 text-[#525252] text-[14px] text-ellipsis w-full whitespace-nowrap" data-node-id="I2:20199;3932:6959">
                            Your most used transactions, based on your activity.
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="content-stretch flex flex-col gap-[12px] items-start overflow-clip relative shrink-0 w-full" data-node-id="2:20200" data-name="Shortcuts (max 4)">
                      <div className="content-stretch flex gap-[12px] items-start overflow-clip relative shrink-0 w-full" data-node-id="2:20201" data-name="Row">
                        <div className="bg-[#fafafa] border border-[#e5e5e5] border-solid content-stretch flex flex-[1_0_0] gap-[12px] items-center min-w-px overflow-clip p-[16px] relative rounded-[12px] self-stretch" data-node-id="2:20202" data-name="Shortcut · Apply for Register Document">
                          <div className="[word-break:break-word] content-stretch flex flex-[1_0_0] flex-col gap-[2px] items-start min-w-px not-italic overflow-clip relative" data-node-id="2:20204" data-name="Text">
                            <p className="font-['TT_Interphases_Pro:DemiBold'] leading-[20px] overflow-hidden relative shrink-0 text-[#171717] text-[14px] text-ellipsis w-full whitespace-nowrap" data-node-id="2:20205">
                              Apply for Register Document
                            </p>
                            <p className="font-['TT_Interphases_Pro:Regular'] leading-[18px] relative shrink-0 text-[#525252] text-[12px] w-full" data-node-id="2:20206">
                              Export LC
                            </p>
                          </div>
                          <div className="relative shrink-0 size-[24px]" data-node-id="2:20203" data-name="chevron-right">
                            <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgChevronRight1} />
                          </div>
                        </div>
                        <div className="bg-[#fafafa] border border-[#e5e5e5] border-solid content-stretch flex flex-[1_0_0] gap-[12px] items-center min-w-px overflow-clip p-[16px] relative rounded-[12px] self-stretch" data-node-id="2:20207" data-name="Shortcut · Apply for Finance">
                          <div className="[word-break:break-word] content-stretch flex flex-[1_0_0] flex-col gap-[2px] items-start min-w-px not-italic overflow-clip relative" data-node-id="2:20209" data-name="Text">
                            <p className="font-['TT_Interphases_Pro:DemiBold'] leading-[20px] overflow-hidden relative shrink-0 text-[#171717] text-[14px] text-ellipsis w-full whitespace-nowrap" data-node-id="2:20210">
                              Apply for Finance
                            </p>
                            <p className="font-['TT_Interphases_Pro:Regular'] leading-[18px] relative shrink-0 text-[#525252] text-[12px] w-full" data-node-id="2:20211">
                              Export LC
                            </p>
                          </div>
                          <div className="relative shrink-0 size-[24px]" data-node-id="33:48386" data-name="chevron-right">
                            <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgChevronRight1} />
                          </div>
                        </div>
                      </div>
                      <div className="content-stretch flex gap-[12px] items-start overflow-clip relative shrink-0 w-full" data-node-id="2:20212" data-name="Row">
                        <div className="bg-[#fafafa] border border-[#e5e5e5] border-solid content-stretch flex flex-[1_0_0] gap-[12px] items-center min-w-px overflow-clip p-[16px] relative rounded-[12px] self-stretch" data-node-id="2:20213" data-name="Shortcut · Apply for Guarantee">
                          <div className="[word-break:break-word] content-stretch flex flex-[1_0_0] flex-col gap-[2px] items-start min-w-px not-italic overflow-clip relative" data-node-id="2:20215" data-name="Text">
                            <p className="font-['TT_Interphases_Pro:DemiBold'] leading-[20px] overflow-hidden relative shrink-0 text-[#171717] text-[14px] text-ellipsis w-full whitespace-nowrap" data-node-id="2:20216">
                              Apply for Guarantee
                            </p>
                            <p className="font-['TT_Interphases_Pro:Regular'] leading-[18px] relative shrink-0 text-[#525252] text-[12px] w-full" data-node-id="2:20217">
                              Bank Guarantee
                            </p>
                          </div>
                          <div className="relative shrink-0 size-[24px]" data-node-id="33:48392" data-name="chevron-right">
                            <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgChevronRight1} />
                          </div>
                        </div>
                        <div className="bg-[#fafafa] border border-[#e5e5e5] border-solid content-stretch flex flex-[1_0_0] gap-[12px] items-center min-w-px overflow-clip p-[16px] relative rounded-[12px]" data-node-id="2:20218" data-name="Shortcut · Apply for Amendment">
                          <div className="[word-break:break-word] content-stretch flex flex-[1_0_0] flex-col gap-[2px] items-start min-w-px not-italic overflow-clip relative" data-node-id="2:20220" data-name="Text">
                            <p className="font-['TT_Interphases_Pro:DemiBold'] leading-[20px] overflow-hidden relative shrink-0 text-[#171717] text-[14px] text-ellipsis w-full whitespace-nowrap" data-node-id="2:20221">
                              Apply for Amendment
                            </p>
                            <p className="font-['TT_Interphases_Pro:Regular'] leading-[18px] relative shrink-0 text-[#525252] text-[12px] w-full" data-node-id="2:20222">
                              Bank Guarantee
                            </p>
                          </div>
                          <div className="relative shrink-0 size-[24px]" data-node-id="33:48389" data-name="chevron-right">
                            <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgChevronRight1} />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
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
