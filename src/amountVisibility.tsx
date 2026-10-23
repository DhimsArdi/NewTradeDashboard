import { createContext, useContext } from "react";

// Hide Amount in the page header masks every nominal on the dashboard; currencies, percentages and dates stay visible.
const AmountsHiddenContext = createContext(false);

export const AmountsHiddenProvider = AmountsHiddenContext.Provider;
export const useAmountsHidden = () => useContext(AmountsHiddenContext);

export const MASK = "••••••••";

// "IDR 400,000,000.00" → "IDR ••••••••"
export const maskAmount = (amount: string) => `${amount.split(" ")[0]} ${MASK}`;
