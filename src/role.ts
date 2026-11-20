import { useSyncExternalStore } from "react";

// The signed-in user's role decides what the dashboard asks of them (Figma 2425:16248 · POV per role).
// Maker: Action needed lists their tasks per product, and there's no Pending Task menu.
// Approver & Releaser: Action needed shows one count with View Tasks, and Pending Task is in the menu.
// The prototype has no login, so ?role=maker|approver picks one; Approver & Releaser is the default.

export const roles = ["approver", "maker"] as const;
export type Role = (typeof roles)[number];

export const roleLabels: Record<Role, string> = { approver: "Approver & Releaser", maker: "Maker" };

const EVENT = "rolechange";

export const currentRole = (): Role => (new URLSearchParams(window.location.search).get("role") === "maker" ? "maker" : "approver");

export const setRole = (r: Role) => {
  const url = new URL(window.location.href);
  if (r === "approver") url.searchParams.delete("role");
  else url.searchParams.set("role", r);
  window.history.replaceState(null, "", url);
  window.dispatchEvent(new Event(EVENT));
};

const subscribe = (cb: () => void) => {
  window.addEventListener(EVENT, cb);
  window.addEventListener("popstate", cb);
  return () => {
    window.removeEventListener(EVENT, cb);
    window.removeEventListener("popstate", cb);
  };
};

export const useRole = () => useSyncExternalStore(subscribe, currentRole, () => "approver" as Role);
