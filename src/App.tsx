import { useState } from "react";
import AppNavigation from "./AppNavigation";
import TransactionHistoryWidget from "./TransactionHistoryWidget";

const assetPathPrefix = "/assets";
const imgClock = `${assetPathPrefix}/efc9f.svg`;
const imgScheduleDot = `${assetPathPrefix}/056f2.svg`;
const imgScheduleDot1 = `${assetPathPrefix}/290a5.svg`;
const imgChevronLeft = `${assetPathPrefix}/2c9c3.svg`;
const imgChevronRight = `${assetPathPrefix}/e9a5b.svg`;
const imgChevronDown = `${assetPathPrefix}/66b97.svg`;
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
const imgContainer = `${assetPathPrefix}/4f7de.svg`;
const imgHome02 = `${assetPathPrefix}/1e7c9.svg`;
const imgChartBreakoutCircle = `${assetPathPrefix}/625b8.svg`;
const imgBank = `${assetPathPrefix}/cf740.svg`;
const imgArrowCircleBrokenUpRight = `${assetPathPrefix}/7c7ea.svg`;
const imgContainer1 = `${assetPathPrefix}/62582.svg`;
const imgDivider = `${assetPathPrefix}/2acbd.svg`;
const imgLegendIcon = `${assetPathPrefix}/a7dbe.svg`;
const imgLegendIcon1 = `${assetPathPrefix}/5a007.svg`;
const imgFile06 = `${assetPathPrefix}/d51ea.svg`;
const imgDownload01 = `${assetPathPrefix}/c9f3a.svg`;
const imgAlertCircle = `${assetPathPrefix}/9dcb1.svg`;
const imgArrowRight = `${assetPathPrefix}/9d328.svg`;
const imgClock1 = `${assetPathPrefix}/ea938.svg`;
const imgScheduleDot2 = `${assetPathPrefix}/d0149.svg`;
const imgSeparator = `${assetPathPrefix}/93f8f.svg`;
const imgChevronRight1 = `${assetPathPrefix}/bc2d8.svg`;

function FooterStampComponent({ className }: { className?: string }) {
  return (
    <div className={className || "border-[#e5e5e5] border-solid border-t content-stretch flex flex-col items-start overflow-clip pt-[16px] relative w-[456px]"} data-node-id="24:47649" data-name="Footer - Stamp Component">
      <div className="content-stretch flex gap-[6px] items-center overflow-clip relative shrink-0" data-node-id="24:47646" data-name="Last updated">
        <div className="relative shrink-0 size-[16px]" data-node-id="24:47647" data-name="clock">
          <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgClock} />
        </div>
        <p className="[word-break:break-word] font-['TT_Interphases_Pro:Regular'] leading-[18px] not-italic relative shrink-0 text-[#525252] text-[12px] whitespace-nowrap" data-node-id="24:47648">
          Last updated 18 Aug 2026, 09:30 WIB
        </p>
      </div>
    </div>
  );
}

type CalendarDayOpsiBProps = {
  className?: string;
  day?: string;
  hasSchedule?: boolean;
  state?: "Default" | "Today" | "Outside month";
};

function CalendarDayOpsiB({ className, day = "18", hasSchedule = false, state = "Default" }: CalendarDayOpsiBProps) {
  const isDefault = state === "Default";
  const isOutsideMonth = state === "Outside month";
  const isToday = state === "Today";
  return (
    <div className={className || `content-stretch flex flex-col h-[48px] items-center justify-center relative w-[62px] ${isToday ? "bg-[#099697] rounded-[9999px]" : "rounded-[12px]"}`} id={isOutsideMonth ? "node-2_19339" : isToday ? "node-2_19333" : "node-2_19327"}>
      {isDefault && (
        <p className="[word-break:break-word] font-['TT_Interphases_Pro:Medium'] leading-[24px] not-italic relative shrink-0 text-[#171717] text-[16px] text-center whitespace-nowrap" data-node-id="2:19328">
          {day}
        </p>
      )}
      {isDefault && hasSchedule && (
        <div className="-translate-x-1/2 absolute bottom-[5px] left-1/2 size-[8px]" data-node-id="2:19329" data-name="Schedule dot">
          <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgScheduleDot} />
        </div>
      )}
      {isToday && (
        <p className="[word-break:break-word] font-['TT_Interphases_Pro:DemiBold'] leading-[24px] not-italic relative shrink-0 text-[16px] text-center text-white whitespace-nowrap" data-node-id="2:19334">
          {day}
        </p>
      )}
      {isToday && hasSchedule && (
        <div className="-translate-x-1/2 absolute bottom-[5px] left-1/2 size-[8px]" data-node-id="2:19335" data-name="Schedule dot">
          <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgScheduleDot1} />
        </div>
      )}
      {isOutsideMonth && (
        <p className="[word-break:break-word] font-['TT_Interphases_Pro:Medium'] leading-[24px] not-italic relative shrink-0 text-[#a3a3a3] text-[16px] text-center whitespace-nowrap" data-node-id="2:19340">
          {day}
        </p>
      )}
      {isOutsideMonth && hasSchedule && (
        <div className="-translate-x-1/2 absolute bottom-[5px] left-1/2 size-[8px]" data-node-id="2:19341" data-name="Schedule dot">
          <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgScheduleDot} />
        </div>
      )}
    </div>
  );
}

function MonthComponent({ className }: { className?: string }) {
  return (
    <div className={className || "content-stretch flex items-center justify-between overflow-clip relative w-[456px]"} data-node-id="2:19789" data-name="Month Component">
      <p className="[word-break:break-word] font-['TT_Interphases_Pro:DemiBold'] leading-[28px] not-italic relative shrink-0 text-[#171717] text-[18px] whitespace-nowrap" data-node-id="2:19790">
        August 2026
      </p>
      <div className="content-stretch flex gap-[4px] items-center overflow-clip relative shrink-0" data-node-id="2:19791" data-name="Navigation">
        <div className="bg-white border border-[#d0d5dd] border-solid content-stretch flex gap-[4px] items-center justify-center overflow-clip px-[12px] py-[8px] relative rounded-[8px] shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05)] shrink-0" data-node-id="2:19792" data-name="Today button">
          <div className="content-stretch flex items-center justify-center px-[2px] relative shrink-0" data-node-id="I2:19792;6153:22815" data-name="Text padding">
            <p className="[word-break:break-word] font-['Inter:Semi_Bold'] font-semibold leading-[20px] not-italic relative shrink-0 text-[#344054] text-[14px] whitespace-nowrap" data-node-id="I2:19792;3287:433057">
              Today
            </p>
          </div>
        </div>
        <div className="content-stretch flex items-center justify-center overflow-clip p-[8px] relative rounded-[8px] shrink-0" data-node-id="2:19793" data-name="Buttons/Button">
          <div className="relative shrink-0 size-[20px]" data-node-id="I2:19793;3471:598450" data-name="placeholder">
            <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgChevronLeft} />
          </div>
        </div>
        <div className="content-stretch flex items-center justify-center overflow-clip p-[8px] relative rounded-[8px] shrink-0" data-node-id="2:19794" data-name="Buttons/Button">
          <div className="relative shrink-0 size-[20px]" data-node-id="I2:19794;3471:598450" data-name="placeholder">
            <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgChevronRight} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function TradeDashboardMaster() {
  const [isNavigationCollapsed, setIsNavigationCollapsed] = useState(false);
  const [notice, setNotice] = useState("");

  const handleDashboardClick = (event: React.MouseEvent<HTMLDivElement>) => {
    const target = (event.target as HTMLElement).closest<HTMLElement>("[data-name]");
    const name = target?.dataset.name ?? "";

    if (name.startsWith("Shortcut ·")) {
      setNotice(`${name.replace("Shortcut · ", "")} opened`);
      return;
    }

    if (name.startsWith("Report ·")) {
      setNotice(`${name.replace("Report · ", "")} download prepared`);
      return;
    }

    if (name === "Today button") {
      setNotice("Calendar returned to today");
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
        className={`absolute bottom-0 h-[1735px] pointer-events-none top-0 transition-[left] duration-200 ${isNavigationCollapsed ? "left-[88px]" : "left-[336px]"}`}
        data-node-id="2:19887"
      >
        <div className="content-stretch flex flex-col items-start pointer-events-auto pr-[8px] py-[8px] rounded-[16px] sticky top-0 w-[1106px]" data-name="container_wrapper">
          <div className="bg-[#f5f5f5] border border-[#e5e5e5] border-solid content-stretch flex flex-col h-[1719px] items-start overflow-clip py-[32px] relative rounded-[16px] shrink-0 w-full" data-node-id="2:19888" data-name="Main">
            <div className="h-[824px] relative shrink-0 w-[1096px]" data-node-id="42:64534" data-name="Vertical Scroll">
              <div className="absolute content-stretch flex flex-col h-[50px] items-start left-0 px-[32px] top-0 w-[1096px]" data-node-id="2:19889" data-name="Header Section 1">
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
              <div className="absolute content-stretch flex gap-[24px] items-start left-0 px-[32px] top-[82px] w-[1096px]" data-node-id="2:19891" data-name="Container <>">
                <div className="content-stretch flex flex-[1_0_0] flex-col gap-[24px] items-start min-w-px relative" data-node-id="2:19892" data-name="Left-Column">
                  <div className="content-stretch flex flex-col h-[728px] items-start justify-between relative shrink-0 w-[504px]" data-node-id="24:48272" data-name="Widget / Limit Facility">
                    <div className="bg-white border border-[#e5e5e5] border-solid content-stretch drop-shadow-[0px_1px_1px_rgba(0,0,0,0.05)] flex flex-col gap-[16px] items-start p-[24px] relative rounded-[16px] shrink-0 w-full" data-node-id="I24:48272;2:22617" data-name="Limit-Information-Card">
                      <div className="content-stretch flex flex-col gap-[20px] isolate items-start relative shrink-0 w-full" data-node-id="I24:48272;2:22618" data-name="Section header">
                        <div className="content-stretch flex gap-[16px] items-start relative shrink-0 w-full z-[2]" data-node-id="I24:48272;2:22618;3932:6946" data-name="Content">
                          <div className="[word-break:break-word] content-stretch flex flex-[1_0_0] flex-col gap-[2px] items-start justify-center min-w-px not-italic relative self-stretch" data-node-id="I24:48272;2:22618;3932:6947" data-name="Text and supporting text">
                            <p className="font-['TT_Interphases_Pro:Bold'] leading-[1.2] relative shrink-0 text-[#171717] text-[18px] w-full" data-node-id="I24:48272;2:22618;3932:6948">
                              Limit Facility
                            </p>
                            <p className="font-['TT_Interphases_Pro:Regular'] leading-[20px] overflow-hidden relative shrink-0 text-[#525252] text-[14px] text-ellipsis w-full whitespace-nowrap" data-node-id="I24:48272;2:22618;3932:6949">
                              Select a facility to see its limit details.
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="content-stretch flex flex-col gap-[16px] items-start relative shrink-0 w-full" data-node-id="I24:48272;36:62366" data-name="Content <>">
                        <div className="bg-gradient-to-b border border-[#e5e5e5] border-solid content-stretch flex flex-col from-[#fefefe] gap-[12px] items-start p-[16px] relative rounded-[16px] shrink-0 to-[#fafafa] w-full" data-node-id="I24:48272;36:62697" data-name="Limits-Info-Box">
                          <div className="content-stretch flex flex-col gap-[12px] items-start relative shrink-0 w-full" data-node-id="I24:48272;36:62698" data-name="Heading">
                            <div className="content-stretch flex flex-col gap-[4px] items-start relative shrink-0 w-full" data-node-id="I24:48272;36:62699" data-name="Select Input">
                              <div className="content-stretch flex flex-col gap-[4px] items-start relative shrink-0 w-full" data-node-id="I24:48272;36:62699;3108:1949" data-name="Input with label">
                                <div className="bg-white border border-[#d4d4d4] border-solid content-stretch flex gap-[8px] items-center overflow-clip px-[12px] py-[8px] relative rounded-[8px] shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05)] shrink-0 w-full" data-node-id="I24:48272;36:62699;3108:1955" data-name="Input">
                                  <div className="content-stretch flex flex-[1_0_0] gap-[8px] items-center min-w-px relative" data-node-id="I24:48272;36:62699;3108:1956" data-name="Content">
                                    <p className="[word-break:break-word] font-['TT_Interphases_Pro:Regular'] leading-[20px] not-italic relative shrink-0 text-[#171717] text-[14px] whitespace-nowrap" data-node-id="I24:48272;36:62699;3108:1958">
                                      Bill Purchasing Line
                                    </p>
                                  </div>
                                  <div className="relative shrink-0 size-[18px]" data-node-id="I24:48272;36:62699;3108:1959" data-name="chevron-down">
                                    <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgChevronDown} />
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="content-stretch flex flex-col gap-[6px] items-start justify-center relative shrink-0 w-full" data-node-id="I24:48272;36:62700">
                              <p className="[word-break:break-word] font-['TT_Interphases_Pro:Regular'] leading-[18px] not-italic relative shrink-0 text-[#525252] text-[12px] whitespace-nowrap" data-node-id="I24:48272;36:62701">
                                Available limit
                              </p>
                              <div className="content-stretch flex items-center justify-between relative shrink-0 w-full" data-node-id="I24:48272;36:62702">
                                <p className="[word-break:break-word] font-['TT_Interphases_Pro:Bold'] leading-[1.2] not-italic relative shrink-0 text-[#171717] text-[24px] whitespace-nowrap" data-node-id="I24:48272;36:62703">
                                  IDR 400,000,000.00
                                </p>
                              </div>
                            </div>
                          </div>
                          <div className="content-stretch flex items-start justify-center py-[4px] relative shrink-0 w-full" data-node-id="I24:48272;36:62705" data-name="Divider">
                            <div className="flex-[1_0_0] h-px min-w-px relative" data-node-id="I24:48272;36:62705;510:6397" data-name="Container">
                              <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgContainer1} />
                            </div>
                          </div>
                          <div className="[word-break:break-word] content-stretch flex flex-col gap-[6px] items-start not-italic relative shrink-0 w-full" data-node-id="I24:48272;36:62706" data-name="Summary-Box">
                            <div className="content-stretch flex items-center relative shrink-0 w-full" data-node-id="I24:48272;36:62707" data-name="Row-Total">
                              <p className="flex-[1_0_0] font-['TT_Interphases_Pro:Regular'] leading-[20px] min-w-px relative text-[#525252] text-[14px]" data-node-id="I24:48272;36:62708">
                                Total limit
                              </p>
                              <p className="flex-[1_0_0] font-['TT_Interphases_Pro:DemiBold'] leading-[24px] min-w-px relative text-[#404040] text-[16px] text-right" data-node-id="I24:48272;36:62709">
                                IDR 900,000,000.00
                              </p>
                            </div>
                            <div className="content-stretch flex items-center relative shrink-0 w-full" data-node-id="I24:48272;36:62713" data-name="Row-Usage">
                              <p className="flex-[1_0_0] font-['TT_Interphases_Pro:Regular'] leading-[20px] min-w-px relative text-[#525252] text-[14px]" data-node-id="I24:48272;36:62714">
                                Outstanding limit
                              </p>
                              <p className="flex-[1_0_0] font-['TT_Interphases_Pro:DemiBold'] leading-[24px] min-w-px relative text-[#404040] text-[16px] text-right" data-node-id="I24:48272;36:62715">
                                IDR 500,000,000.00
                              </p>
                            </div>
                            <div className="content-stretch flex items-center relative shrink-0 w-full" data-node-id="I24:48272;36:62716" data-name="Row-Usage">
                              <p className="flex-[1_0_0] font-['TT_Interphases_Pro:Regular'] leading-[20px] min-w-px relative text-[#525252] text-[14px]" data-node-id="I24:48272;36:62717">
                                Expiry date
                              </p>
                              <p className="font-['TT_Interphases_Pro:DemiBold'] leading-[24px] relative shrink-0 text-[#404040] text-[16px] whitespace-nowrap" data-node-id="I24:48272;36:62718">
                                30 Dec 2026
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className="content-stretch flex flex-col gap-[16px] items-start relative shrink-0 w-full" data-node-id="I24:48272;2:22641" data-name="Limit usage">
                          <div className="content-stretch flex flex-col gap-[12px] isolate items-start relative shrink-0 w-full" data-node-id="I24:48272;2:22642" data-name="Section header">
                            <div className="content-stretch flex gap-[16px] items-start relative shrink-0 w-full z-[2]" data-node-id="I24:48272;2:22642;3793:8388" data-name="Content">
                              <div className="content-stretch flex flex-[1_0_0] flex-col gap-[2px] items-start justify-center min-w-px relative self-stretch" data-node-id="I24:48272;2:22642;3793:8389" data-name="Text and supporting text">
                                <p className="[word-break:break-word] font-['TT_Interphases_Pro:DemiBold'] leading-[24px] not-italic relative shrink-0 text-[#171717] text-[16px] w-full" data-node-id="I24:48272;2:22642;3793:8390">
                                  Limit usage summary
                                </p>
                              </div>
                            </div>
                            <div className="h-px relative shrink-0 w-full z-[1]" data-node-id="I24:48272;2:22642;3793:8396" data-name="Divider">
                              <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgDivider} />
                            </div>
                          </div>
                          <div className="content-stretch flex gap-[20px] items-start overflow-clip relative shrink-0 w-full" data-node-id="I24:48272;2:22643" data-name="Legend">
                            <div className="content-stretch flex items-center overflow-clip relative shrink-0" data-node-id="I24:48272;2:22644" data-name="Legend · Outstanding">
                              <div className="relative shrink-0 size-[20px]" data-node-id="I24:48272;2:22645" data-name="Legend icon">
                                <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgLegendIcon} />
                              </div>
                              <p className="[word-break:break-word] font-['TT_Interphases_Pro:Regular'] h-full leading-[20px] not-italic relative shrink-0 text-[#404040] text-[14px] w-[77px]">Outstanding</p>
                            </div>
                            <div className="content-stretch flex items-center overflow-clip relative shrink-0" data-node-id="I24:48272;2:22648" data-name="Legend · Available">
                              <div className="relative shrink-0 size-[20px]" data-node-id="I24:48272;2:22649" data-name="Legend icon">
                                <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgLegendIcon1} />
                              </div>
                              <p className="[word-break:break-word] font-['TT_Interphases_Pro:Regular'] h-full leading-[20px] not-italic relative shrink-0 text-[#404040] text-[14px] w-[56px]">Available</p>
                            </div>
                          </div>
                          <div className="content-stretch flex flex-col gap-[20px] items-start overflow-clip relative shrink-0 w-full" data-node-id="I24:48272;2:22652" data-name="By limit">
                            <div className="content-stretch flex flex-col gap-[6px] items-start overflow-clip relative shrink-0 w-full" data-node-id="I24:48272;2:22653" data-name="Limit · Bill Purchasing Line">
                              <div className="[word-break:break-word] content-stretch flex items-start justify-between leading-[20px] not-italic overflow-clip relative shrink-0 text-[14px] w-full whitespace-nowrap" data-node-id="I24:48272;2:22654" data-name="Name row">
                                <p className="font-['TT_Interphases_Pro:DemiBold'] relative shrink-0 text-[#171717]" data-node-id="I24:48272;2:22655">
                                  Bill Purchasing Line
                                </p>
                                <p className="font-['TT_Interphases_Pro:Regular'] relative shrink-0 text-[#404040]" data-node-id="I24:48272;2:22656">
                                  56% used
                                </p>
                              </div>
                              <div className="content-stretch flex gap-[2px] items-start overflow-clip relative shrink-0 w-full" data-node-id="I24:48272;2:22657" data-name="Bar">
                                <div className="bg-[#099697] h-[8px] relative rounded-[4px] shrink-0 w-[254px]" data-node-id="I24:48272;2:22658" data-name="Outstanding" />
                                <div className="bg-[#b5e0e0] flex-[1_0_0] h-[8px] min-w-px relative rounded-[4px]" data-node-id="I24:48272;2:22659" data-name="Available" />
                              </div>
                              <div className="content-stretch flex items-start justify-between overflow-clip relative shrink-0 w-full" data-node-id="I24:48272;2:22660" data-name="Detail row">
                                <p className="[word-break:break-word] font-['TT_Interphases_Pro:Regular'] leading-[18px] not-italic relative shrink-0 text-[#525252] text-[12px] whitespace-nowrap" data-node-id="I24:48272;2:22661">
                                  IDR 400,000,000.00 available of IDR 900,000,000.00
                                </p>
                              </div>
                            </div>
                            <div className="content-stretch flex flex-col gap-[6px] items-start overflow-clip relative shrink-0 w-full" data-node-id="I24:48272;2:22662" data-name="Limit · Non Cash Loan">
                              <div className="[word-break:break-word] content-stretch flex items-start justify-between leading-[20px] not-italic overflow-clip relative shrink-0 text-[14px] w-full whitespace-nowrap" data-node-id="I24:48272;2:22663" data-name="Name row">
                                <p className="font-['TT_Interphases_Pro:DemiBold'] relative shrink-0 text-[#171717]" data-node-id="I24:48272;2:22664">
                                  Non Cash Loan
                                </p>
                                <p className="font-['TT_Interphases_Pro:Regular'] relative shrink-0 text-[#404040]" data-node-id="I24:48272;2:22665">
                                  70% used
                                </p>
                              </div>
                              <div className="content-stretch flex gap-[2px] items-start overflow-clip relative shrink-0 w-full" data-node-id="I24:48272;2:22666" data-name="Bar">
                                <div className="bg-[#099697] h-[8px] relative rounded-[4px] shrink-0 w-[318px]" data-node-id="I24:48272;2:22667" data-name="Outstanding" />
                                <div className="bg-[#b5e0e0] flex-[1_0_0] h-[8px] min-w-px relative rounded-[4px]" data-node-id="I24:48272;2:22668" data-name="Available" />
                              </div>
                              <div className="content-stretch flex items-start justify-between overflow-clip relative shrink-0 w-full" data-node-id="I24:48272;2:22669" data-name="Detail row">
                                <p className="[word-break:break-word] font-['TT_Interphases_Pro:Regular'] leading-[18px] not-italic relative shrink-0 text-[#525252] text-[12px] whitespace-nowrap" data-node-id="I24:48272;2:22670">
                                  IDR 207,000,000.00 available of IDR 690,000,000.00
                                </p>
                              </div>
                            </div>
                            <div className="content-stretch flex flex-col gap-[6px] items-start overflow-clip relative shrink-0 w-full" data-node-id="I24:48272;2:22671" data-name="Limit · Bank Guarantee Limit">
                              <div className="[word-break:break-word] content-stretch flex items-start justify-between leading-[20px] not-italic overflow-clip relative shrink-0 text-[14px] w-full whitespace-nowrap" data-node-id="I24:48272;2:22672" data-name="Name row">
                                <p className="font-['TT_Interphases_Pro:DemiBold'] relative shrink-0 text-[#171717]" data-node-id="I24:48272;2:22673">
                                  Bank Guarantee Limit
                                </p>
                                <p className="font-['TT_Interphases_Pro:Regular'] relative shrink-0 text-[#404040]" data-node-id="I24:48272;2:22674">
                                  50% used
                                </p>
                              </div>
                              <div className="content-stretch flex gap-[2px] items-start overflow-clip relative shrink-0 w-full" data-node-id="I24:48272;2:22675" data-name="Bar">
                                <div className="bg-[#099697] h-[8px] relative rounded-[4px] shrink-0 w-[227px]" data-node-id="I24:48272;2:22676" data-name="Outstanding" />
                                <div className="bg-[#b5e0e0] flex-[1_0_0] h-[8px] min-w-px relative rounded-[4px]" data-node-id="I24:48272;2:22677" data-name="Available" />
                              </div>
                              <div className="content-stretch flex items-start justify-between overflow-clip relative shrink-0 w-full" data-node-id="I24:48272;2:22678" data-name="Detail row">
                                <p className="[word-break:break-word] font-['TT_Interphases_Pro:Regular'] leading-[18px] not-italic relative shrink-0 text-[#525252] text-[12px] whitespace-nowrap" data-node-id="I24:48272;2:22679">
                                  IDR 343,000,000.00 available of IDR 690,000,000.00
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <FooterStampComponent className="border-[#e5e5e5] border-solid border-t content-stretch flex flex-col items-start overflow-clip pt-[16px] relative shrink-0 w-[456px]" />
                    </div>
                  </div>
                  <TransactionHistoryWidget className="shrink-0 w-[504px]" />
                  <div className="bg-white border border-[#e5e5e5] border-solid content-stretch flex flex-col gap-[16px] items-start overflow-clip p-[24px] relative rounded-[16px] shrink-0 w-full" data-node-id="2:20070" data-name="Widget / Report Overview (input PO)">
                    <div className="content-stretch flex flex-col gap-[20px] isolate items-start relative shrink-0 w-full" data-node-id="2:20071" data-name="Section header">
                      <div className="content-stretch flex gap-[16px] items-start relative shrink-0 w-full z-[2]" data-node-id="I2:20071;3932:6946" data-name="Content">
                        <div className="[word-break:break-word] content-stretch flex flex-[1_0_0] flex-col gap-[2px] items-start justify-center min-w-px not-italic relative self-stretch" data-node-id="I2:20071;3932:6947" data-name="Text and supporting text">
                          <p className="font-['TT_Interphases_Pro:Bold'] leading-[1.2] relative shrink-0 text-[#171717] text-[18px] w-full" data-node-id="I2:20071;3932:6948">
                            Report Overview
                          </p>
                          <p className="font-['TT_Interphases_Pro:Regular'] leading-[20px] overflow-hidden relative shrink-0 text-[#525252] text-[14px] text-ellipsis w-full whitespace-nowrap" data-node-id="I2:20071;3932:6949">
                            Download a report with the default information, or choose your own.
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="content-stretch flex flex-col gap-[12px] items-start overflow-clip relative shrink-0 w-full" data-node-id="2:20072" data-name="Reports">
                      <div className="bg-[#fafafa] border border-[#e5e5e5] border-solid content-stretch flex gap-[12px] items-center overflow-clip p-[16px] relative rounded-[12px] shrink-0 w-full" data-node-id="2:20073" data-name="Report · Transaction History">
                        <div className="border border-[#e4e7ec] border-solid drop-shadow-[0px_1px_1px_rgba(16,24,40,0.05)] relative rounded-[8px] shrink-0 size-[40px]" data-node-id="2:20074" data-name="Featured icon">
                          <div aria-hidden className="absolute bg-white inset-0 pointer-events-none rounded-[8px]" />
                          <div className="absolute inset-[calc(25%-0.5px)]" data-node-id="I2:20074;65:246" data-name="alert-circle">
                            <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgFile06} />
                          </div>
                          <div className="absolute inset-0 pointer-events-none rounded-[inherit] shadow-[inset_0px_0px_0px_0px_rgba(16,24,40,0.18),inset_0px_-2px_0px_0px_rgba(16,24,40,0.05)]" />
                        </div>
                        <div className="[word-break:break-word] content-stretch flex flex-[1_0_0] flex-col gap-[2px] items-start min-w-px not-italic overflow-clip relative whitespace-nowrap" data-node-id="2:20075" data-name="Text">
                          <p className="font-['TT_Interphases_Pro:DemiBold'] leading-[20px] overflow-hidden relative shrink-0 text-[#171717] text-[14px] text-ellipsis w-full" data-node-id="2:20076">
                            Transaction History
                          </p>
                          <p className="font-['TT_Interphases_Pro:Regular'] leading-[18px] overflow-hidden relative shrink-0 text-[#525252] text-[12px] text-ellipsis w-full" data-node-id="2:20077">
                            Monthly, by event and product.
                          </p>
                        </div>
                        <div className="flex flex-row items-center self-stretch" data-node-id="2:20078">
                          <div className="content-stretch flex gap-[8px] h-full items-center overflow-clip relative shrink-0" data-name="Actions">
                            <div className="content-stretch drop-shadow-[0px_1px_1px_rgba(0,0,0,0.05)] flex gap-[4px] items-center justify-center px-[12px] py-[8px] relative rounded-[9999px] shrink-0" data-node-id="2:20080" data-name="Button · Download">
                              <div className="relative shrink-0 size-[20px]" data-node-id="I2:20080;189:9175" data-name="placeholder">
                                <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgDownload01} />
                              </div>
                              <div className="content-stretch flex items-center justify-center px-[2px] relative shrink-0" data-node-id="I2:20080;189:9176" data-name="Text padding">
                                <p className="[word-break:break-word] font-['TT_Interphases_Pro:DemiBold'] leading-[20px] not-italic relative shrink-0 text-[#404040] text-[14px] whitespace-nowrap" data-node-id="I2:20080;189:9177">
                                  Download
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="bg-[#fafafa] border border-[#e5e5e5] border-solid content-stretch flex gap-[12px] items-center overflow-clip p-[16px] relative rounded-[12px] shrink-0 w-full" data-node-id="2:20081" data-name="Report · Limit Facility">
                        <div className="border border-[#e4e7ec] border-solid drop-shadow-[0px_1px_1px_rgba(16,24,40,0.05)] relative rounded-[8px] shrink-0 size-[40px]" data-node-id="2:20082" data-name="Featured icon">
                          <div aria-hidden className="absolute bg-white inset-0 pointer-events-none rounded-[8px]" />
                          <div className="absolute inset-[calc(25%-0.5px)]" data-node-id="I2:20082;65:246" data-name="alert-circle">
                            <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgFile06} />
                          </div>
                          <div className="absolute inset-0 pointer-events-none rounded-[inherit] shadow-[inset_0px_0px_0px_0px_rgba(16,24,40,0.18),inset_0px_-2px_0px_0px_rgba(16,24,40,0.05)]" />
                        </div>
                        <div className="[word-break:break-word] content-stretch flex flex-[1_0_0] flex-col gap-[2px] items-start min-w-px not-italic overflow-clip relative whitespace-nowrap" data-node-id="2:20083" data-name="Text">
                          <p className="font-['TT_Interphases_Pro:DemiBold'] leading-[20px] overflow-hidden relative shrink-0 text-[#171717] text-[14px] text-ellipsis w-full" data-node-id="2:20084">
                            Limit Facility
                          </p>
                          <p className="font-['TT_Interphases_Pro:Regular'] leading-[18px] overflow-hidden relative shrink-0 text-[#525252] text-[12px] text-ellipsis w-full" data-node-id="2:20085">
                            Limit and usage per facility.
                          </p>
                        </div>
                        <div className="flex flex-row items-center self-stretch" data-node-id="2:20086">
                          <div className="content-stretch flex gap-[8px] h-full items-center overflow-clip relative shrink-0" data-name="Actions">
                            <div className="content-stretch drop-shadow-[0px_1px_1px_rgba(0,0,0,0.05)] flex gap-[4px] items-center justify-center px-[12px] py-[8px] relative rounded-[9999px] shrink-0" data-node-id="2:20088" data-name="Button · Download">
                              <div className="relative shrink-0 size-[20px]" data-node-id="I2:20088;189:9175" data-name="placeholder">
                                <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgDownload01} />
                              </div>
                              <div className="content-stretch flex items-center justify-center px-[2px] relative shrink-0" data-node-id="I2:20088;189:9176" data-name="Text padding">
                                <p className="[word-break:break-word] font-['TT_Interphases_Pro:DemiBold'] leading-[20px] not-italic relative shrink-0 text-[#404040] text-[14px] whitespace-nowrap" data-node-id="I2:20088;189:9177">
                                  Download
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="content-stretch flex flex-[1_0_0] flex-col gap-[24px] items-center min-w-px relative" data-node-id="2:20089" data-name="Right-Column">
                  <div className="content-stretch flex gap-[24px] items-center relative shrink-0 w-full" data-node-id="2:20090">
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
                      <p className="[word-break:break-word] font-['TT_Interphases_Pro:Regular'] h-[40px] leading-[20px] min-w-full not-italic relative shrink-0 text-[#525252] text-[14px] w-[min-content]" data-node-id="I2:20091;2:19315">
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
                      <p className="[word-break:break-word] font-['TT_Interphases_Pro:Regular'] h-[40px] leading-[20px] min-w-full not-italic relative shrink-0 text-[#525252] text-[14px] w-[min-content]" data-node-id="I2:20092;2:19322">
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
                  <div className="bg-white border border-[#e5e5e5] border-solid content-stretch flex flex-col gap-[16px] items-start overflow-clip p-[24px] relative rounded-[16px] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] shrink-0 w-[504px]" data-node-id="24:48025" data-name="Widget / Calendar · State · Default (3 expiries)">
                    <div className="content-stretch flex flex-col gap-[12px] isolate items-start relative shrink-0 w-full" data-node-id="I24:48025;22:11745" data-name="Section header">
                      <div className="content-stretch flex gap-[16px] items-start relative shrink-0 w-full z-[2]" data-node-id="I24:48025;22:11745;3932:6946" data-name="Content">
                        <div className="[word-break:break-word] content-stretch flex flex-[1_0_0] flex-col gap-[2px] items-start justify-center min-w-px not-italic relative self-stretch" data-node-id="I24:48025;22:11745;3932:6947" data-name="Text and supporting text">
                          <p className="font-['TT_Interphases_Pro:Bold'] leading-[1.2] relative shrink-0 text-[#171717] text-[18px] w-full" data-node-id="I24:48025;22:11745;3932:6948">
                            Calendar
                          </p>
                          <p className="font-['TT_Interphases_Pro:Regular'] leading-[20px] overflow-hidden relative shrink-0 text-[#525252] text-[14px] text-ellipsis w-full whitespace-nowrap" data-node-id="I24:48025;22:11745;3932:6949">
                            Expiry dates of your products and limit facilities.
                          </p>
                        </div>
                      </div>
                      <div className="h-px relative shrink-0 w-full z-[1]" data-node-id="I24:48025;22:11745;3932:6954" data-name="Divider">
                        <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgDivider} />
                      </div>
                    </div>
                    <div className="content-stretch flex flex-col gap-[16px] items-start relative shrink-0 w-full" data-node-id="I24:48025;22:11746" data-name="Body">
                      <div className="content-stretch flex flex-col gap-[12px] items-start overflow-clip relative shrink-0 w-full" data-node-id="I24:48025;22:11747" data-name="Date picker">
                        <MonthComponent className="content-stretch flex items-center justify-between overflow-clip relative shrink-0 w-full" />
                        <div className="content-stretch flex flex-col gap-[4px] items-start overflow-clip relative shrink-0 w-full" data-node-id="I24:48025;22:11749" data-name="Grid">
                          <div className="content-stretch flex gap-[4px] items-start overflow-clip relative shrink-0 w-full" data-node-id="I24:48025;22:11750" data-name="Weekdays">
                            <div className="content-stretch flex flex-[1_0_0] h-[32px] items-center justify-center min-w-px overflow-clip relative" data-node-id="I24:48025;22:11751" data-name="Mon">
                              <p className="[word-break:break-word] font-['TT_Interphases_Pro:Regular'] leading-[24px] not-italic relative shrink-0 text-[#525252] text-[16px] whitespace-nowrap" data-node-id="I24:48025;22:11752">
                                Mon
                              </p>
                            </div>
                            <div className="content-stretch flex flex-[1_0_0] h-[32px] items-center justify-center min-w-px overflow-clip relative" data-node-id="I24:48025;22:11753" data-name="Tue">
                              <p className="[word-break:break-word] font-['TT_Interphases_Pro:Regular'] leading-[24px] not-italic relative shrink-0 text-[#525252] text-[16px] whitespace-nowrap" data-node-id="I24:48025;22:11754">
                                Tue
                              </p>
                            </div>
                            <div className="content-stretch flex flex-[1_0_0] h-[32px] items-center justify-center min-w-px overflow-clip relative" data-node-id="I24:48025;22:11755" data-name="Wed">
                              <p className="[word-break:break-word] font-['TT_Interphases_Pro:Regular'] leading-[24px] not-italic relative shrink-0 text-[#525252] text-[16px] whitespace-nowrap" data-node-id="I24:48025;22:11756">
                                Wed
                              </p>
                            </div>
                            <div className="content-stretch flex flex-[1_0_0] h-[32px] items-center justify-center min-w-px overflow-clip relative" data-node-id="I24:48025;22:11757" data-name="Thu">
                              <p className="[word-break:break-word] font-['TT_Interphases_Pro:Regular'] leading-[24px] not-italic relative shrink-0 text-[#525252] text-[16px] whitespace-nowrap" data-node-id="I24:48025;22:11758">
                                Thu
                              </p>
                            </div>
                            <div className="content-stretch flex flex-[1_0_0] h-[32px] items-center justify-center min-w-px overflow-clip relative" data-node-id="I24:48025;22:11759" data-name="Fri">
                              <p className="[word-break:break-word] font-['TT_Interphases_Pro:Regular'] leading-[24px] not-italic relative shrink-0 text-[#525252] text-[16px] whitespace-nowrap" data-node-id="I24:48025;22:11760">
                                Fri
                              </p>
                            </div>
                            <div className="content-stretch flex flex-[1_0_0] h-[32px] items-center justify-center min-w-px overflow-clip relative" data-node-id="I24:48025;22:11761" data-name="Sat">
                              <p className="[word-break:break-word] font-['TT_Interphases_Pro:Regular'] leading-[24px] not-italic relative shrink-0 text-[#525252] text-[16px] whitespace-nowrap" data-node-id="I24:48025;22:11762">
                                Sat
                              </p>
                            </div>
                            <div className="content-stretch flex flex-[1_0_0] h-[32px] items-center justify-center min-w-px overflow-clip relative" data-node-id="I24:48025;22:11763" data-name="Sun">
                              <p className="[word-break:break-word] font-['TT_Interphases_Pro:Regular'] leading-[24px] not-italic relative shrink-0 text-[#525252] text-[16px] whitespace-nowrap" data-node-id="I24:48025;22:11764">
                                Sun
                              </p>
                            </div>
                          </div>
                          <div className="content-stretch flex gap-[4px] items-start overflow-clip relative shrink-0 w-full" data-node-id="I24:48025;22:11765" data-name="Week 1">
                            <CalendarDayOpsiB className="content-stretch flex flex-[1_0_0] flex-col h-[48px] items-center justify-center min-w-px relative rounded-[12px]" day="27" state="Outside month" />
                            <CalendarDayOpsiB className="content-stretch flex flex-[1_0_0] flex-col h-[48px] items-center justify-center min-w-px relative rounded-[12px]" day="28" state="Outside month" />
                            <CalendarDayOpsiB className="content-stretch flex flex-[1_0_0] flex-col h-[48px] items-center justify-center min-w-px relative rounded-[12px]" day="29" state="Outside month" />
                            <CalendarDayOpsiB className="content-stretch flex flex-[1_0_0] flex-col h-[48px] items-center justify-center min-w-px relative rounded-[12px]" day="30" state="Outside month" />
                            <CalendarDayOpsiB className="content-stretch flex flex-[1_0_0] flex-col h-[48px] items-center justify-center min-w-px relative rounded-[12px]" day="31" state="Outside month" />
                            <CalendarDayOpsiB className="content-stretch flex flex-[1_0_0] flex-col h-[48px] items-center justify-center min-w-px relative rounded-[12px]" day="1" />
                            <CalendarDayOpsiB className="content-stretch flex flex-[1_0_0] flex-col h-[48px] items-center justify-center min-w-px relative rounded-[12px]" day="2" />
                          </div>
                          <div className="content-stretch flex gap-[4px] items-start overflow-clip relative shrink-0 w-full" data-node-id="I24:48025;22:11773" data-name="Week 2">
                            <CalendarDayOpsiB className="content-stretch flex flex-[1_0_0] flex-col h-[48px] items-center justify-center min-w-px relative rounded-[12px]" day="3" />
                            <CalendarDayOpsiB className="content-stretch flex flex-[1_0_0] flex-col h-[48px] items-center justify-center min-w-px relative rounded-[12px]" day="4" />
                            <CalendarDayOpsiB className="content-stretch flex flex-[1_0_0] flex-col h-[48px] items-center justify-center min-w-px relative rounded-[12px]" day="5" />
                            <CalendarDayOpsiB className="content-stretch flex flex-[1_0_0] flex-col h-[48px] items-center justify-center min-w-px relative rounded-[12px]" day="6" />
                            <CalendarDayOpsiB className="content-stretch flex flex-[1_0_0] flex-col h-[48px] items-center justify-center min-w-px relative rounded-[12px]" day="7" />
                            <CalendarDayOpsiB className="content-stretch flex flex-[1_0_0] flex-col h-[48px] items-center justify-center min-w-px relative rounded-[12px]" day="8" />
                            <CalendarDayOpsiB className="content-stretch flex flex-[1_0_0] flex-col h-[48px] items-center justify-center min-w-px relative rounded-[12px]" day="9" />
                          </div>
                          <div className="content-stretch flex gap-[4px] items-start overflow-clip relative shrink-0 w-full" data-node-id="I24:48025;22:11781" data-name="Week 3">
                            <CalendarDayOpsiB className="content-stretch flex flex-[1_0_0] flex-col h-[48px] items-center justify-center min-w-px relative rounded-[12px]" day="10" />
                            <CalendarDayOpsiB className="content-stretch flex flex-[1_0_0] flex-col h-[48px] items-center justify-center min-w-px relative rounded-[12px]" day="11" />
                            <CalendarDayOpsiB className="content-stretch flex flex-[1_0_0] flex-col h-[48px] items-center justify-center min-w-px relative rounded-[12px]" day="12" />
                            <CalendarDayOpsiB className="content-stretch flex flex-[1_0_0] flex-col h-[48px] items-center justify-center min-w-px relative rounded-[12px]" day="13" />
                            <CalendarDayOpsiB className="content-stretch flex flex-[1_0_0] flex-col h-[48px] items-center justify-center min-w-px relative rounded-[12px]" day="14" />
                            <CalendarDayOpsiB className="content-stretch flex flex-[1_0_0] flex-col h-[48px] items-center justify-center min-w-px relative rounded-[12px]" day="15" />
                            <CalendarDayOpsiB className="content-stretch flex flex-[1_0_0] flex-col h-[48px] items-center justify-center min-w-px relative rounded-[12px]" day="16" />
                          </div>
                          <div className="content-stretch flex gap-[4px] items-start overflow-clip relative shrink-0 w-full" data-node-id="I24:48025;22:11789" data-name="Week 4">
                            <CalendarDayOpsiB className="content-stretch flex flex-[1_0_0] flex-col h-[48px] items-center justify-center min-w-px relative rounded-[12px]" day="17" />
                            <CalendarDayOpsiB className="bg-[#099697] content-stretch flex flex-[1_0_0] flex-col h-[48px] items-center justify-center min-w-px relative rounded-[9999px]" state="Today" />
                            <CalendarDayOpsiB className="content-stretch flex flex-[1_0_0] flex-col h-[48px] items-center justify-center min-w-px relative rounded-[12px]" day="19" />
                            <CalendarDayOpsiB className="content-stretch flex flex-[1_0_0] flex-col h-[48px] items-center justify-center min-w-px relative rounded-[12px]" day="20" hasSchedule />
                            <CalendarDayOpsiB className="content-stretch flex flex-[1_0_0] flex-col h-[48px] items-center justify-center min-w-px relative rounded-[12px]" day="21" />
                            <CalendarDayOpsiB className="content-stretch flex flex-[1_0_0] flex-col h-[48px] items-center justify-center min-w-px relative rounded-[12px]" day="22" />
                            <CalendarDayOpsiB className="content-stretch flex flex-[1_0_0] flex-col h-[48px] items-center justify-center min-w-px relative rounded-[12px]" day="23" />
                          </div>
                          <div className="content-stretch flex gap-[4px] items-start overflow-clip relative shrink-0 w-full" data-node-id="I24:48025;22:11797" data-name="Week 5">
                            <CalendarDayOpsiB className="content-stretch flex flex-[1_0_0] flex-col h-[48px] items-center justify-center min-w-px relative rounded-[12px]" day="24" />
                            <CalendarDayOpsiB className="content-stretch flex flex-[1_0_0] flex-col h-[48px] items-center justify-center min-w-px relative rounded-[12px]" day="25" />
                            <CalendarDayOpsiB className="content-stretch flex flex-[1_0_0] flex-col h-[48px] items-center justify-center min-w-px relative rounded-[12px]" day="26" />
                            <div className="content-stretch flex flex-[1_0_0] flex-col h-[48px] items-center justify-center min-w-px relative rounded-[12px]" data-node-id="I24:48025;22:11801" data-name="Day 2026-08-27">
                              <p className="[word-break:break-word] font-['TT_Interphases_Pro:Medium'] leading-[24px] not-italic relative shrink-0 text-[#171717] text-[16px] text-center whitespace-nowrap" data-node-id="I24:48025;22:11801;2:19328">
                                27
                              </p>
                              <div className="-translate-x-1/2 absolute bottom-[5px] left-1/2 size-[8px]" data-node-id="I24:48025;22:11801;2:19329" data-name="Schedule dot">
                                <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgScheduleDot2} />
                              </div>
                            </div>
                            <CalendarDayOpsiB className="content-stretch flex flex-[1_0_0] flex-col h-[48px] items-center justify-center min-w-px relative rounded-[12px]" day="28" />
                            <CalendarDayOpsiB className="content-stretch flex flex-[1_0_0] flex-col h-[48px] items-center justify-center min-w-px relative rounded-[12px]" day="29" />
                            <CalendarDayOpsiB className="content-stretch flex flex-[1_0_0] flex-col h-[48px] items-center justify-center min-w-px relative rounded-[12px]" day="30" />
                          </div>
                          <div className="content-stretch flex gap-[4px] items-start overflow-clip relative shrink-0 w-full" data-node-id="I24:48025;22:11805" data-name="Week 6">
                            <CalendarDayOpsiB className="content-stretch flex flex-[1_0_0] flex-col h-[48px] items-center justify-center min-w-px relative rounded-[12px]" day="31" hasSchedule />
                            <CalendarDayOpsiB className="content-stretch flex flex-[1_0_0] flex-col h-[48px] items-center justify-center min-w-px relative rounded-[12px]" day="1" state="Outside month" />
                            <CalendarDayOpsiB className="content-stretch flex flex-[1_0_0] flex-col h-[48px] items-center justify-center min-w-px relative rounded-[12px]" day="2" state="Outside month" />
                            <CalendarDayOpsiB className="content-stretch flex flex-[1_0_0] flex-col h-[48px] items-center justify-center min-w-px relative rounded-[12px]" day="3" state="Outside month" />
                            <CalendarDayOpsiB className="content-stretch flex flex-[1_0_0] flex-col h-[48px] items-center justify-center min-w-px relative rounded-[12px]" day="4" state="Outside month" />
                            <CalendarDayOpsiB className="content-stretch flex flex-[1_0_0] flex-col h-[48px] items-center justify-center min-w-px relative rounded-[12px]" day="5" state="Outside month" />
                            <CalendarDayOpsiB className="content-stretch flex flex-[1_0_0] flex-col h-[48px] items-center justify-center min-w-px relative rounded-[12px]" day="6" state="Outside month" />
                          </div>
                        </div>
                        <div className="content-stretch flex gap-[16px] items-center overflow-clip relative shrink-0" data-node-id="I24:48025;22:11813" data-name="Legend">
                          <div className="content-stretch flex gap-[4px] items-center overflow-clip relative shrink-0" data-node-id="I24:48025;22:11814" data-name="Legend · Today">
                            <div className="bg-[#099697] relative rounded-[3.333px] shrink-0 size-[10px]" data-node-id="I24:48025;22:11815" data-name="Today swatch" />
                            <p className="[word-break:break-word] font-['TT_Interphases_Pro:Regular'] leading-[18px] not-italic relative shrink-0 text-[#525252] text-[12px] whitespace-nowrap" data-node-id="I24:48025;22:11816">
                              Today
                            </p>
                          </div>
                          <div className="content-stretch flex gap-[4px] items-center overflow-clip relative shrink-0" data-node-id="I24:48025;22:11817" data-name="Legend · Expiry date">
                            <div className="bg-[#f97316] relative rounded-[3.333px] shrink-0 size-[10px]" data-node-id="I24:48025;22:11818" data-name="Today swatch" />
                            <p className="[word-break:break-word] font-['TT_Interphases_Pro:Regular'] leading-[18px] not-italic relative shrink-0 text-[#525252] text-[12px] whitespace-nowrap" data-node-id="I24:48025;22:11819">
                              Expiry date
                            </p>
                          </div>
                          <div className="content-stretch flex gap-[4px] items-center overflow-clip relative shrink-0" data-node-id="I24:48025;22:11820" data-name="Legend · Amend extend">
                            <div className="bg-[#3b82f6] relative rounded-[3.333px] shrink-0 size-[10px]" data-node-id="I24:48025;22:11821" data-name="Today swatch" />
                            <p className="[word-break:break-word] font-['TT_Interphases_Pro:Regular'] leading-[18px] not-italic relative shrink-0 text-[#525252] text-[12px] whitespace-nowrap" data-node-id="I24:48025;22:11822">
                              Amend extend (new expiry date)
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="content-stretch flex flex-col gap-[8px] items-start overflow-clip relative shrink-0 w-full" data-node-id="I24:48025;22:11823" data-name="Schedules">
                        <div className="[word-break:break-word] border-[#e5e5e5] border-solid border-t content-stretch flex items-center justify-between leading-[20px] not-italic overflow-clip pt-[16px] relative shrink-0 text-[14px] w-full whitespace-nowrap" data-node-id="I24:48025;22:11824" data-name="Schedules header">
                          <p className="font-['TT_Interphases_Pro:DemiBold'] relative shrink-0 text-[#404040]" data-node-id="I24:48025;22:11825">
                            Upcoming expiries
                          </p>
                          <p className="font-['TT_Interphases_Pro:Regular'] relative shrink-0 text-[#525252]" data-node-id="I24:48025;22:11826">
                            3 expiries
                          </p>
                        </div>
                        <div className="h-[222px] overflow-x-clip overflow-y-auto relative shrink-0 w-full" data-node-id="I24:48025;22:11827" data-name="Schedule list · scroll area (max 3)">
                          <div className="absolute content-stretch flex flex-col items-start left-0 overflow-clip right-0 top-0" data-node-id="I24:48025;22:11828" data-name="Items">
                            <div className="border-[#f5f5f5] border-b border-solid content-stretch flex gap-[16px] h-[74px] items-center pl-[8px] pr-[12px] py-[14px] relative shrink-0 w-full" data-node-id="I24:48025;29:11952" data-name="Expiry item">
                              <div className="[word-break:break-word] bg-[#f9f9f9] content-stretch flex flex-col font-['TT_Interphases_Pro:Medium'] items-center justify-center leading-[0] not-italic relative rounded-[8px] shrink-0 size-[40px] text-[#171717] text-[12px] text-center whitespace-nowrap" data-node-id="I24:48025;29:11952;29:11937" data-name="Date">
                                <div className="flex flex-col justify-center relative shrink-0" data-node-id="I24:48025;29:11952;29:11938">
                                  <p className="leading-[18px]">20</p>
                                </div>
                                <div className="flex flex-col justify-center relative shrink-0" data-node-id="I24:48025;29:11952;37:649">
                                  <p className="leading-[18px]">AUG</p>
                                </div>
                              </div>
                              <div className="content-stretch flex flex-[1_0_0] gap-[8px] items-center min-w-px relative" data-node-id="I24:48025;29:11952;29:11939" data-name="Content">
                                <div className="bg-[#f97316] h-[46px] relative rounded-[24px] shrink-0 w-[4px]" data-node-id="I24:48025;29:11952;29:11940" data-name="Indicator" />
                                <div className="content-stretch flex flex-[1_0_0] flex-col gap-[2px] items-start min-w-px relative" data-node-id="I24:48025;29:11952;29:11941" data-name="Text">
                                  <div className="content-center flex flex-wrap gap-[4px_8px] items-center overflow-clip relative shrink-0 w-full" data-node-id="I24:48025;29:11952;29:11943" data-name="Title row">
                                    <div className="[word-break:break-word] flex flex-col font-['TT_Interphases_Pro:DemiBold'] h-[24px] justify-center leading-[0] max-w-[368px] not-italic relative shrink-0 text-[#0e0e0e] text-[16px] w-[254px]" data-node-id="I24:48025;29:11952;29:11944">
                                      <p className="leading-[24px]">Export LC expiry - ELTRG01236S26</p>
                                    </div>
                                  </div>
                                  <div className="content-stretch flex gap-[8px] items-center relative shrink-0 w-full" data-node-id="I24:48025;29:11952;29:11946" data-name="Meta">
                                    <div className="[word-break:break-word] flex flex-col font-['TT_Interphases_Pro:Regular'] justify-center leading-[0] not-italic relative shrink-0 text-[#4e4e4e] text-[14px] whitespace-nowrap" data-node-id="I24:48025;29:11952;29:11947">
                                      <p className="leading-[20px]">{`Mitsui & Co., Ltd.`}</p>
                                    </div>
                                    <div className="relative shrink-0 size-[4px]" data-node-id="I24:48025;29:11952;29:11948" data-name="Separator">
                                      <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgSeparator} />
                                    </div>
                                    <div className="[word-break:break-word] flex flex-col font-['TT_Interphases_Pro:Regular'] justify-center leading-[0] not-italic relative shrink-0 text-[#4e4e4e] text-[14px] whitespace-nowrap" data-node-id="I24:48025;29:11952;29:11949">
                                      <p className="leading-[20px]">EUR 58,900.00</p>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="border-[#f5f5f5] border-b border-solid content-stretch flex gap-[16px] h-[74px] items-center pl-[8px] pr-[12px] py-[14px] relative shrink-0 w-full" data-node-id="I24:48025;29:11968" data-name="Expiry item">
                              <div className="[word-break:break-word] bg-[#f9f9f9] content-stretch flex flex-col font-['TT_Interphases_Pro:Medium'] items-center justify-center leading-[0] not-italic relative rounded-[8px] shrink-0 size-[40px] text-[#171717] text-[12px] text-center whitespace-nowrap" data-node-id="I24:48025;29:11968;29:11920" data-name="Date">
                                <div className="flex flex-col justify-center relative shrink-0" data-node-id="I24:48025;29:11968;29:11921">
                                  <p className="leading-[18px]">27</p>
                                </div>
                                <div className="flex flex-col justify-center relative shrink-0" data-node-id="I24:48025;29:11968;37:650">
                                  <p className="leading-[18px]">AUG</p>
                                </div>
                              </div>
                              <div className="content-stretch flex flex-[1_0_0] gap-[8px] items-center min-w-px relative" data-node-id="I24:48025;29:11968;29:11922" data-name="Content">
                                <div className="bg-[#3b82f6] h-[46px] relative rounded-[24px] shrink-0 w-[4px]" data-node-id="I24:48025;29:11968;29:11923" data-name="Indicator" />
                                <div className="content-stretch flex flex-[1_0_0] flex-col gap-[2px] items-start min-w-px relative" data-node-id="I24:48025;29:11968;29:11924" data-name="Text">
                                  <div className="content-center flex flex-wrap gap-[4px_8px] items-center overflow-clip relative shrink-0 w-full" data-node-id="I24:48025;29:11968;29:11926" data-name="Title row">
                                    <div className="[word-break:break-word] flex flex-col font-['TT_Interphases_Pro:DemiBold'] h-[24px] justify-center leading-[0] max-w-[368px] not-italic relative shrink-0 text-[#0e0e0e] text-[16px] w-[254px]" data-node-id="I24:48025;29:11968;29:11927">
                                      <p className="leading-[24px]">BG expiry - IGTRG00298A25</p>
                                    </div>
                                    <div className="bg-[#eff6ff] border border-[#bfdbfe] border-solid content-stretch flex h-[22px] items-center px-[8px] py-[2px] relative rounded-[16px] shrink-0" data-node-id="I24:48025;29:11968;29:11928" data-name="Badge · Amend Extend">
                                      <div className="[text-box-edge:cap_alphabetic] [text-box-trim:trim-both] [word-break:break-word] flex flex-col font-['TT_Interphases_Pro:DemiBold'] justify-center leading-[0] not-italic relative shrink-0 text-[#1d4ed8] text-[12px] text-center whitespace-nowrap" data-node-id="I24:48025;29:11968;29:11928;861:20225">
                                        <p className="leading-[1.2]">Amend Extend</p>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="content-stretch flex gap-[8px] items-center relative shrink-0 w-full" data-node-id="I24:48025;29:11968;29:11929" data-name="Meta">
                                    <div className="[word-break:break-word] flex flex-col font-['TT_Interphases_Pro:Regular'] justify-center leading-[0] not-italic relative shrink-0 text-[#4e4e4e] text-[14px] whitespace-nowrap" data-node-id="I24:48025;29:11968;29:11930">
                                      <p className="leading-[20px]">PT Pertamina</p>
                                    </div>
                                    <div className="relative shrink-0 size-[4px]" data-node-id="I24:48025;29:11968;29:11931" data-name="Separator">
                                      <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgSeparator} />
                                    </div>
                                    <div className="[word-break:break-word] flex flex-col font-['TT_Interphases_Pro:Regular'] justify-center leading-[0] not-italic relative shrink-0 text-[#4e4e4e] text-[14px] whitespace-nowrap" data-node-id="I24:48025;29:11968;29:11932">
                                      <p className="leading-[20px]">IDR 2,800,980,000.00</p>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="border-[#f5f5f5] border-b border-solid content-stretch flex gap-[16px] h-[74px] items-center pl-[8px] pr-[12px] py-[14px] relative shrink-0 w-full" data-node-id="I24:48025;29:11983" data-name="Expiry item">
                              <div className="[word-break:break-word] bg-[#f9f9f9] content-stretch flex flex-col font-['TT_Interphases_Pro:Medium'] items-center justify-center leading-[0] not-italic relative rounded-[8px] shrink-0 size-[40px] text-[#171717] text-[12px] text-center whitespace-nowrap" data-node-id="I24:48025;29:11983;29:11937" data-name="Date">
                                <div className="flex flex-col justify-center relative shrink-0" data-node-id="I24:48025;29:11983;29:11938">
                                  <p className="leading-[18px]">31</p>
                                </div>
                                <div className="flex flex-col justify-center relative shrink-0" data-node-id="I24:48025;29:11983;37:649">
                                  <p className="leading-[18px]">AUG</p>
                                </div>
                              </div>
                              <div className="content-stretch flex flex-[1_0_0] gap-[8px] items-center min-w-px relative" data-node-id="I24:48025;29:11983;29:11939" data-name="Content">
                                <div className="bg-[#f97316] h-[46px] relative rounded-[24px] shrink-0 w-[4px]" data-node-id="I24:48025;29:11983;29:11940" data-name="Indicator" />
                                <div className="content-stretch flex flex-[1_0_0] flex-col gap-[2px] items-start min-w-px relative" data-node-id="I24:48025;29:11983;29:11941" data-name="Text">
                                  <div className="content-center flex flex-wrap gap-[4px_8px] items-center overflow-clip relative shrink-0 w-full" data-node-id="I24:48025;29:11983;29:11943" data-name="Title row">
                                    <div className="[word-break:break-word] flex flex-col font-['TT_Interphases_Pro:DemiBold'] h-[24px] justify-center leading-[0] max-w-[368px] not-italic relative shrink-0 text-[#0e0e0e] text-[16px] w-[254px]" data-node-id="I24:48025;29:11983;29:11944">
                                      <p className="leading-[24px]">Limit facility expiry</p>
                                    </div>
                                  </div>
                                  <div className="content-stretch flex gap-[8px] items-center relative shrink-0 w-full" data-node-id="I24:48025;29:11983;29:11946" data-name="Meta">
                                    <div className="[word-break:break-word] flex flex-col font-['TT_Interphases_Pro:Regular'] justify-center leading-[0] not-italic relative shrink-0 text-[#4e4e4e] text-[14px] whitespace-nowrap" data-node-id="I24:48025;29:11983;29:11947">
                                      <p className="leading-[20px]">Bank Guarantee Limit</p>
                                    </div>
                                    <div className="relative shrink-0 size-[4px]" data-node-id="I24:48025;29:11983;29:11948" data-name="Separator">
                                      <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgSeparator} />
                                    </div>
                                    <div className="[word-break:break-word] flex flex-col font-['TT_Interphases_Pro:Regular'] justify-center leading-[0] not-italic relative shrink-0 text-[#4e4e4e] text-[14px] whitespace-nowrap" data-node-id="I24:48025;29:11983;29:11949">
                                      <p className="leading-[20px]">IDR 690,000,000.00</p>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <FooterStampComponent className="border-[#e5e5e5] border-solid border-t content-stretch flex flex-col items-start overflow-clip pt-[16px] relative shrink-0 w-[456px]" />
                  </div>
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
    </div>
  );
}
