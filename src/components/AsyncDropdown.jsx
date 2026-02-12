// AsyncDropdown.jsx
import { useEffect, useState, useRef } from "react";
import { Listbox } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import LabelWithDialog from "./LabelWithDialog";

/* ---------- iPhone-only detector (keeps iPad on Listbox path) ---------- */
const isIPhone =
  typeof navigator !== "undefined" &&
  /iPhone|iPhone Simulator|iPod/i.test(navigator.userAgent) &&
  !(navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1); // exclude iPadOS

/* ---------- dumb-simple normalizer ---------- */
const CANDIDATE_KEYS = [
  "Component_Type","component_type",
  "ItemName","itemname","item_name",
  "name","label","title","value"
];

function toDisplayString(row) {
  if (row == null) return "";
  if (typeof row !== "object") return String(row);
  for (const k of CANDIDATE_KEYS) if (row[k]) return String(row[k]);
  const entries = Object.entries(row);
  if (entries.length === 1) return String(entries[0][1]);
  const vals = Object.values(row).filter(Boolean);
  const firstStr = vals.find(v => typeof v === "string" && v.trim() !== "");
  if (firstStr) return firstStr;
  const firstPrim = vals.find(v => ["string","number","boolean"].includes(typeof v));
  return firstPrim !== undefined ? String(firstPrim) : JSON.stringify(row);
}

function pickArray(payload) {
  if (Array.isArray(payload)) return payload;
  if (payload && typeof payload === "object") {
    for (const key of ["data","results","items","options"]) {
      if (Array.isArray(payload[key])) return payload[key];
    }
  }
  return [];
}

/* ---------- FAST: in-memory cache with TTL ---------- */
const CACHE = new Map(); // endpoint -> { t, data }

async function fetchJSON(endpoint, { signal, ttl = 5 * 60 * 1000 } = {}) {
  const now = Date.now();
  const cached = CACHE.get(endpoint);
  if (cached && now - cached.t < ttl) return cached.data;

  const res = await fetch(endpoint, { headers: { Accept: "application/json" }, signal });
  const ct = res.headers.get("content-type");
  if (!res.ok || !ct?.includes("application/json")) {
    const text = await res.text();
    throw new Error(`Unexpected response (${res.status}) from ${res.url}\nCT: ${ct}\n${text.slice(0,300)}...`);
  }
  const data = await res.json();
  CACHE.set(endpoint, { t: now, data });
  return data;
}

/* ---------- Async dropdown with iPhone fallback ---------- */
export default function AsyncDropdown({
  label = "Result",
  message = "",
  value,
  onChange,
  endpoint,
  disabled = false,
  placeholder = "Please select",
  ttl = 5 * 60 * 1000,          // <— control cache freshness
  debounceMs = 0                // <— optional debounce for flappy params
}) {
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(false);

  // Debounce endpoint changes
  const [debouncedEndpoint, setDebouncedEndpoint] = useState(endpoint);
  useEffect(() => {
    if (!debounceMs) { setDebouncedEndpoint(endpoint); return; }
    const id = setTimeout(() => setDebouncedEndpoint(endpoint), debounceMs);
    return () => clearTimeout(id);
  }, [endpoint, debounceMs]);

  useEffect(() => {
    if (!debouncedEndpoint || disabled) return;
    const ctrl = new AbortController();
    const isCached = !!CACHE.get(debouncedEndpoint);
    if (!isCached) setLoading(true);

    (async () => {
      try {
        const json = await fetchJSON(debouncedEndpoint, { signal: ctrl.signal, ttl });
        const raw = pickArray(json);
        const mapped = raw.map(toDisplayString).filter(Boolean);
        const unique = Array.from(new Set(mapped)).sort((a,b) => a.localeCompare(b));
        setOptions(unique);
      } catch (err) {
        if (err.name !== "AbortError") console.error("Failed to load dropdown data:", err);
      } finally {
        setLoading(false);
      }
    })();

    return () => ctrl.abort();
  }, [debouncedEndpoint, disabled, ttl]);

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4 mb-3 w-full">
      <LabelWithDialog label={label} message={message || "Select a result from the list."} />

      <div className="relative w-full sm:w-1/2">
        {isIPhone ? (
          /* ---------------- iPhone fallback: native <select> ---------------- */
          <div className="relative">
            <select
              className="w-full border border-gray-400 rounded-md p-2 text-sm h-[40px] appearance-none pr-8 bg-white"
              style={{
                fontSize: 16,                    // prevent iOS zoom
                WebkitAppearance: "none",
                WebkitTapHighlightColor: "transparent",
              }}
              value={value || ""}
              onChange={(e) => onChange(e.target.value)}
              disabled={disabled}
            >
              <option value="">{loading ? "Loading..." : (placeholder || "Please select")}</option>
              {options.map((opt) => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
            {/* Chevron to match your look */}
            <ChevronDownIcon
              className="pointer-events-none h-5 w-5 text-gray-400 absolute right-2 top-1/2 -translate-y-1/2"
              aria-hidden="true"
            />
          </div>
        ) : (
          /* ---------------- Default Listbox for all other devices ---------------- */
          <Listbox value={value} onChange={onChange} disabled={disabled}>
            {({ open }) => (
              <div>
                <Listbox.Button
                  className={`w-full border border-gray-300 rounded-md p-2 bg-white text-left text-sm h-[40px] flex items-center ${
                    disabled ? "opacity-60 cursor-not-allowed" : "cursor-pointer"
                  }`}
                >
                  <span className="flex-grow">
                    {value || (loading ? "Loading..." : placeholder)}
                  </span>
                  <ChevronDownIcon className="h-5 w-5 text-gray-400 ml-2" aria-hidden="true" />
                </Listbox.Button>

                {open && !disabled && options.length > 0 && (
                  <Listbox.Options className="absolute mt-1 w-full border border-gray-300 rounded-md bg-white shadow-lg z-10 max-h-[160px] overflow-auto overscroll-contain">
                    {options.map((opt) => (
                      <Listbox.Option
                        key={opt}
                        value={opt}
                        className={({ active }) =>
                          `cursor-pointer px-4 py-2 ${
                            active ? "bg-gray-300 text-black" : "text-gray-900"
                          }`
                        }
                      >
                        {({ selected }) => (
                          <span className={selected ? "font-semibold" : "font-normal"}>
                            {opt}
                          </span>
                        )}
                      </Listbox.Option>
                    ))}
                  </Listbox.Options>
                )}
              </div>
            )}
          </Listbox>
        )}
      </div>
    </div>
  );
}
