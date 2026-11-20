// Figma 2425:18535 · Section header (Home - Trade · POV per role)
export default function PageHeader() {
  return (
    <header className="flex flex-col gap-[2px] items-start w-full" data-name="Section header">
      <h1 className="font-['TT_Interphases_Pro:Bold'] leading-[1.2] text-[#171717] text-[20px] w-full">Trade &amp; Guarantee Activities</h1>
      <p className="font-['TT_Interphases_Pro:Regular'] leading-[24px] overflow-hidden text-[#525252] text-[16px] text-ellipsis w-full whitespace-nowrap">
        Monitor your trade activities, check limits, and manage tasks.
      </p>
    </header>
  );
}
