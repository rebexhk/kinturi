import { createContext, useContext, useEffect, useMemo, useState, ReactNode } from "react";

export type Currency = "GBP" | "EUR" | "USD";

export const CURRENCY_SYMBOLS: Record<Currency, string> = {
  GBP: "£",
  EUR: "€",
  USD: "$",
};

interface RatesCache {
  base: "USD";
  rates: Record<string, number>;
  fetchedAt: number;
}

const STORAGE_KEY_CURRENCY = "kinturi_currency";
const STORAGE_KEY_RATES = "kinturi_fx_rates";
const ONE_DAY = 24 * 60 * 60 * 1000;

// Static fallback rates (relative to USD) used if API fetch fails
const FALLBACK_RATES: Record<string, number> = {
  USD: 1,
  EUR: 0.92,
  GBP: 0.79,
  AUD: 1.52,
  CAD: 1.36,
};

interface CurrencyContextValue {
  currency: Currency;
  setCurrency: (c: Currency) => void;
  rates: Record<string, number>; // base USD
  ready: boolean;
}

const CurrencyContext = createContext<CurrencyContextValue | undefined>(undefined);

export function CurrencyProvider({ children }: { children: ReactNode }) {
  const [currency, setCurrencyState] = useState<Currency>(() => {
    if (typeof window === "undefined") return "GBP";
    const stored = localStorage.getItem(STORAGE_KEY_CURRENCY) as Currency | null;
    return stored && ["GBP", "EUR", "USD"].includes(stored) ? stored : "GBP";
  });
  const [rates, setRates] = useState<Record<string, number>>(FALLBACK_RATES);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    async function loadRates() {
      try {
        const cachedRaw = localStorage.getItem(STORAGE_KEY_RATES);
        if (cachedRaw) {
          const cached: RatesCache = JSON.parse(cachedRaw);
          if (Date.now() - cached.fetchedAt < ONE_DAY && cached.rates) {
            if (!cancelled) {
              setRates({ ...FALLBACK_RATES, ...cached.rates });
              setReady(true);
              return;
            }
          }
        }
        const res = await fetch(
          "https://api.exchangerate.host/latest?base=USD&symbols=GBP,EUR,USD,AUD,CAD"
        );
        const data = await res.json();
        if (data?.rates) {
          const merged = { ...FALLBACK_RATES, ...data.rates, USD: 1 };
          if (!cancelled) {
            setRates(merged);
            localStorage.setItem(
              STORAGE_KEY_RATES,
              JSON.stringify({ base: "USD", rates: merged, fetchedAt: Date.now() })
            );
          }
        }
      } catch {
        // keep fallback
      } finally {
        if (!cancelled) setReady(true);
      }
    }
    loadRates();
    return () => {
      cancelled = true;
    };
  }, []);

  const setCurrency = (c: Currency) => {
    setCurrencyState(c);
    localStorage.setItem(STORAGE_KEY_CURRENCY, c);
  };

  const value = useMemo(
    () => ({ currency, setCurrency, rates, ready }),
    [currency, rates, ready]
  );

  return <CurrencyContext.Provider value={value}>{children}</CurrencyContext.Provider>;
}

export function useCurrency() {
  const ctx = useContext(CurrencyContext);
  if (!ctx) throw new Error("useCurrency must be used within CurrencyProvider");
  return ctx;
}

// Detect source currency from a price string. Returns currency code (3-letter) if detectable.
function detectSourceCurrency(price: string): string | null {
  const trimmed = price.trim();
  // Explicit code (e.g., "AUD", "USD", "EUR", "GBP") at end or start
  const codeMatch = trimmed.match(/\b(USD|EUR|GBP|AUD|CAD)\b/i);
  if (codeMatch) return codeMatch[1].toUpperCase();
  if (trimmed.includes("£")) return "GBP";
  if (trimmed.includes("€")) return "EUR";
  if (trimmed.includes("$")) return "USD";
  return null;
}

function formatNumber(value: number, currency: Currency): string {
  // Round to nearest whole unit, with thousands separators
  const rounded = Math.round(value);
  return new Intl.NumberFormat("en-GB", {
    maximumFractionDigits: 0,
  }).format(rounded);
}

/**
 * Convert a price string (e.g., "From €1,200 per person") into the target currency,
 * preserving surrounding text. Falls back to original string if no number/currency found.
 */
export function convertPriceString(
  price: string | null | undefined,
  target: Currency,
  rates: Record<string, number>
): string {
  if (!price) return "";
  const source = detectSourceCurrency(price);
  if (!source) return price;

  // Extract first number (supports 1,200 or 1200 or 1200.50)
  const numberMatch = price.match(/(\d{1,3}(?:,\d{3})+|\d+)(?:\.(\d+))?/);
  if (!numberMatch) return price;
  const numericStr = numberMatch[0].replace(/,/g, "");
  const amount = parseFloat(numericStr);
  if (Number.isNaN(amount)) return price;

  // Convert: source -> USD -> target. Rates are units of CUR per 1 USD.
  const sourceRate = rates[source] ?? FALLBACK_RATES[source];
  const targetRate = rates[target] ?? FALLBACK_RATES[target];
  if (!sourceRate || !targetRate) return price;
  const inUsd = amount / sourceRate;
  const converted = inUsd * targetRate;

  const targetSymbol = CURRENCY_SYMBOLS[target];
  const formatted = `${targetSymbol}${formatNumber(converted, target)}`;

  // Replace the original "<symbol-or-code><number>" segment with the converted value.
  // Try replacing symbol + number first
  const symbolNumberRegex = new RegExp(
    `[£€$]\s?${numberMatch[0].replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}`
  );
  if (symbolNumberRegex.test(price)) {
    let result = price.replace(symbolNumberRegex, formatted);
    // Strip trailing currency code like " AUD" if it matched the source
    result = result.replace(/\s+(USD|EUR|GBP|AUD|CAD)\b/i, "");
    return result;
  }
  // Otherwise replace just the number and prepend symbol
  return price.replace(numberMatch[0], formatted);
}
