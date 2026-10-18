import { useMemo, useState } from "react";

const a = (file: string) => `/assets/${file}`;

type Channel = { label: string; icon: string; comingSoon?: boolean };
type MenuItem = { label: string; icon: string; badge?: string };
type MenuGroup = { title?: string; items: MenuItem[] };

const channels: Channel[] = [
  { label: "Trade Services", icon: a("99317.svg") },
  { label: "Global Nostro", icon: a("19f13.svg") },
  { label: "Cash Management", icon: a("2d9f2.svg"), comingSoon: true },
  { label: "Supply Chain", icon: a("f8560.svg"), comingSoon: true },
  { label: "Forex", icon: a("5b274.svg"), comingSoon: true },
  { label: "Receivables", icon: a("5d4d7.svg"), comingSoon: true },
];

const generalMenu: MenuItem[] = [
  { label: "Overview", icon: a("bd0bb.svg") },
  { label: "Pending Task", icon: a("13e1b.svg"), badge: "10" },
  { label: "Task Monitoring", icon: a("c0068.svg") },
  { label: "Report Overview", icon: a("056d4.svg") },
  { label: "DHE SDA", icon: a("ca8cc.svg") },
  { label: "Mass Account Opening", icon: a("c9439.svg") },
];

const channelGroups: MenuGroup[] = [
  { items: [{ label: "Trade Dashboard", icon: a("1e7c9.svg") }] },
  {
    title: "BANK GUARANTEE",
    items: [
      { label: "Outward Guarantee", icon: a("625b8.svg") },
      { label: "Inward Guarantee", icon: a("cf740.svg") },
    ],
  },
  { title: "TRADE", items: [{ label: "Export LC", icon: a("7c7ea.svg") }] },
];

type Props = {
  collapsed: boolean;
  onToggle: () => void;
  onNotify: (message: string) => void;
};

// Figma tints every icon instance (gray at rest, brand teal when active) on top of the
// exported glyph, so the shape is used as a mask and painted with that tint.
function Icon({ src, size, color }: { src: string; size: number; color: string }) {
  const mask = `url("${src}") center / contain no-repeat`;
  return <span aria-hidden className="block shrink-0" style={{ width: size, height: size, backgroundColor: color, mask, WebkitMask: mask }} />;
}

function NavItem({ item, active, onSelect }: { item: MenuItem; active: boolean; onSelect: () => void }) {
  return (
    <button
      type="button"
      aria-current={active ? "page" : undefined}
      onClick={onSelect}
      className={`flex w-full items-center gap-[12px] max-h-[40px] px-[8px] py-[10px] my-px rounded-[6px] text-left transition-colors outline-none focus-visible:shadow-[0_0_0_2px_white,0_0_0_4px_#077879] ${active ? "bg-[#e5f4eb]" : "hover:bg-[#f5f5f5]"}`}
    >
      <span className="flex flex-1 min-w-0 items-center gap-[8px]">
        <Icon src={item.icon} size={20} color={active ? "#099697" : "#a3a3a3"} />
        <span className={`font-['TT_Interphases_Pro:Medium'] leading-[20px] text-[14px] truncate ${active ? "text-[#077879]" : "text-[#404040]"}`}>
          {item.label}
        </span>
      </span>
      {item.badge && (
        <span className="bg-[#f9fafb] border border-[#e5e7eb] flex h-[22px] items-center px-[8px] rounded-[16px] shrink-0 font-['TT_Interphases_Pro:DemiBold'] leading-[1.2] text-[#374151] text-[12px]">
          {item.badge}
        </span>
      )}
    </button>
  );
}

export default function AppNavigation({ collapsed, onToggle, onNotify }: Props) {
  const [activeChannel, setActiveChannel] = useState("Trade Services");
  const [activeItem, setActiveItem] = useState("Trade Dashboard");
  const [query, setQuery] = useState("");

  const q = query.trim().toLowerCase();
  const match = (item: MenuItem) => !q || item.label.toLowerCase().includes(q);
  const filteredGeneral = generalMenu.filter(match);
  const filteredGroups = useMemo(
    () => channelGroups.map((g) => ({ ...g, items: g.items.filter(match) })).filter((g) => g.items.length),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [q],
  );
  const noResults = q && !filteredGeneral.length && !filteredGroups.length;

  const select = (label: string) => {
    setActiveItem(label);
    if (label !== "Trade Dashboard") onNotify(`${label} opened`);
  };

  const selectChannel = (channel: Channel) => {
    if (channel.comingSoon) {
      onNotify(`${channel.label} is coming soon`);
      return;
    }
    setActiveChannel(channel.label);
    if (collapsed) onToggle();
  };

  return (
    <nav
      aria-label="App navigation"
      data-name="App Navigation 3.0"
      data-node-id="2:19886"
      className={`fixed z-20 left-0 top-0 h-dvh bg-[#fcfcfc] flex flex-col overflow-hidden transition-[width] duration-200 ease-out ${collapsed ? "w-[88px]" : "w-[336px]"}`}
    >
      <div className={`flex h-[76px] shrink-0 items-center ${collapsed ? "justify-center px-[26px]" : "justify-between pl-[18px] pr-[20px]"}`}>
        {!collapsed && <img alt="BNI direct" className="h-[24px] w-[108.102px] object-cover" src={a("f2ae2.png")} />}
        <button
          type="button"
          onClick={onToggle}
          aria-label={collapsed ? "Expand menu" : "Collapse menu"}
          aria-expanded={!collapsed}
          className="flex h-[36px] min-w-[36px] items-center justify-center rounded-[6px] hover:bg-[#f5f5f5] outline-none focus-visible:shadow-[0_0_0_2px_#077879]"
        >
          <img alt="" className={`block size-[24px] transition-transform duration-200 ${collapsed ? "rotate-180" : ""}`} src={a("5c708.svg")} />
        </button>
      </div>

      <div className="flex flex-1 min-h-0">
        {/* Channel rail */}
        <div className="flex h-full w-[88px] shrink-0 flex-col pt-[16px]">
          <div className="flex flex-1 min-h-0 flex-col items-center gap-[8px] overflow-y-auto pb-[16px] pt-[3px]">
            {channels.map((channel) => {
              const active = channel.label === activeChannel;
              return (
                <button
                  key={channel.label}
                  type="button"
                  onClick={() => selectChannel(channel)}
                  aria-current={active ? "true" : undefined}
                  aria-disabled={channel.comingSoon || undefined}
                  className={`flex w-[80px] shrink-0 flex-col items-center justify-center gap-[4px] px-[8px] py-[6px] rounded-[16px] transition-colors outline-none focus-visible:shadow-[0_0_0_2px_#077879] ${active ? "bg-[#edf8f1]" : "hover:bg-[#f5f5f5]"} ${channel.comingSoon ? "cursor-not-allowed" : ""}`}
                >
                  <Icon src={channel.icon} size={24} color={active ? "#099697" : "#a3a3a3"} />
                  <span className={`text-[10px] leading-[16px] text-center ${active ? "font-['TT_Interphases_Pro:DemiBold'] text-[#099697]" : "font-['TT_Interphases_Pro:Medium'] text-[#404040]"}`}>
                    {channel.label}
                  </span>
                  {channel.comingSoon && (
                    <span className="bg-[#f3f4f6] flex h-[12px] items-center px-[8px] rounded-[16px] font-['TT_Interphases_Pro:Regular'] leading-[1.2] text-[#374151] text-[10px] whitespace-nowrap">
                      Coming soon
                    </span>
                  )}
                </button>
              );
            })}
          </div>
          <div className="flex min-h-[168px] shrink-0 flex-col items-center gap-[8px] pb-[16px]">
            <span className="bg-[#e4e7ec] h-px w-[40px]" />
            <button type="button" aria-label="Language" onClick={() => onNotify("Language: English")} className="flex items-center justify-center p-[10px] rounded-full hover:bg-[#f5f5f5]">
              <img alt="" className="block size-[20px]" src={a("314af.svg")} />
            </button>
            <button type="button" aria-label="Notifications, 13 unread" onClick={() => onNotify("You have 13 unread notifications")} className="relative flex items-center justify-center p-[10px] rounded-full hover:bg-[#f5f5f5]">
              <img alt="" className="block size-[20px]" src={a("5e207.svg")} />
              <span className="absolute left-[18px] top-[2px] flex h-[16px] min-w-[20px] items-center justify-center px-[6px] rounded-[20px] bg-[#d92d20] font-['TT_Interphases_Pro:Medium'] text-[12px] leading-[16px] text-white">
                13
              </span>
            </button>
            <button type="button" aria-label="Profile" onClick={() => onNotify("Profile settings opened")} className="relative size-[32px] rounded-full bg-[#f2f4f7] hover:brightness-95">
              <span className="absolute inset-0 rounded-full border-[0.5px] border-black opacity-8" />
              <span className="font-['TT_Interphases_Pro:DemiBold'] leading-[20px] text-[#475467] text-[14px]">PN</span>
            </button>
          </div>
        </div>

        {/* Menu panel */}
        <div
          aria-hidden={collapsed}
          inert={collapsed}
          className={`relative flex h-full w-[248px] shrink-0 flex-col overflow-y-auto pb-[24px] pl-[17px] pr-[16px] pt-[16px] transition-opacity duration-150 ${collapsed ? "opacity-0" : "opacity-100"}`}
        >
          <span className="absolute left-0 top-0 bottom-0 w-px bg-[#e4e7ec]" />
          <label className="mb-[12px] flex shrink-0 items-center gap-[8px] bg-white border border-[#d4d4d4] rounded-[8px] px-[14px] py-[10px] drop-shadow-[0px_1px_1px_rgba(16,24,40,0.05)] focus-within:border-[#099697] focus-within:shadow-[0_0_0_2px_#b5e0e0]">
            <img alt="" className="block size-[20px] shrink-0" src={a("bbf14.svg")} />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Escape" && setQuery("")}
              placeholder="Search menu"
              aria-label="Search menu"
              className="min-w-0 flex-1 bg-transparent outline-none font-['TT_Interphases_Pro:Regular'] leading-[24px] text-[16px] text-[#171717] placeholder:text-[#737373]"
            />
          </label>

          {filteredGeneral.length > 0 && (
            <div className="flex flex-col gap-[8px] pb-[16px]">
              {filteredGeneral.map((item) => (
                <NavItem key={item.label} item={item} active={activeItem === item.label} onSelect={() => select(item.label)} />
              ))}
            </div>
          )}
          {filteredGeneral.length > 0 && filteredGroups.length > 0 && <span className="h-px w-full shrink-0 bg-[#e4e7ec]" />}

          {filteredGroups.length > 0 && (
            <div className="flex flex-col">
              <p className="pt-[16px] font-['TT_Interphases_Pro:DemiBold'] leading-[24px] text-[#171717] text-[16px]">{activeChannel}</p>
              {filteredGroups.map((group, i) => (
                <div key={group.title ?? i} className={group.title ? "" : "pt-[16px]"}>
                  {group.title && (
                    <p className="min-h-[56px] pb-[8px] pt-[24px] px-[9px] font-['TT_Interphases_Pro:DemiBold'] leading-[18px] text-[#737373] text-[12px]">{group.title}</p>
                  )}
                  {group.items.map((item) => (
                    <NavItem key={item.label} item={item} active={activeItem === item.label} onSelect={() => select(item.label)} />
                  ))}
                </div>
              ))}
            </div>
          )}

          {noResults && (
            <p className="px-[8px] py-[10px] font-['TT_Interphases_Pro:Regular'] text-[14px] leading-[20px] text-[#737373]">
              No menu matches "{query}".
            </p>
          )}
        </div>
      </div>
    </nav>
  );
}
