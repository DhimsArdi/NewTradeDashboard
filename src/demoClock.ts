// Demo data is anchored to the viewer's current date, so the dashboard always reads as live.
const now = new Date();
export const TODAY = new Date(now.getFullYear(), now.getMonth(), now.getDate());

export const daysFromToday = (n: number) => new Date(TODAY.getFullYear(), TODAY.getMonth(), TODAY.getDate() + n);

// "30 Dec 2026"
export const shortDate = (d: Date) => `${d.getDate()} ${d.toLocaleString("en-US", { month: "short" })} ${d.getFullYear()}`;

// "22 Oct 2026, 09:30 WIB" · data timestamps are always shown in Jakarta time.
export const wibStamp = (d = new Date()) => {
  const parts = Object.fromEntries(
    new Intl.DateTimeFormat("en-GB", { timeZone: "Asia/Jakarta", day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit", hourCycle: "h23" })
      .formatToParts(d)
      .map((p) => [p.type, p.value]),
  );
  return `${parts.day} ${parts.month} ${parts.year}, ${parts.hour}:${parts.minute} WIB`;
};
