// AsyncDropdownImage.jsx
import { useEffect, useState, useRef } from "react";
import { Listbox } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import LabelWithDialog from "./LabelWithDialog";

/* ---------- dumb-simple normalizer ---------- */
const CANDIDATE_KEYS = [
  "Component_Type", "component_type",
  "ItemName", "itemname", "item_name",
  "name", "label", "title", "value"
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
  const firstPrim = vals.find(v => ["string", "number", "boolean"].includes(typeof v));
  return firstPrim !== undefined ? String(firstPrim) : JSON.stringify(row);
}

function pickArray(payload) {
  if (Array.isArray(payload)) return payload;
  if (payload && typeof payload === "object") {
    for (const key of ["data", "results", "items", "options"]) {
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
    throw new Error(`Unexpected response (${res.status}) from ${res.url}\nCT: ${ct}\n${text.slice(0, 300)}...`);
  }
  const data = await res.json();
  CACHE.set(endpoint, { t: now, data });
  return data;
}

/* ---------- Async dropdown ---------- */
export default function AsyncDropdownImage({
  label = "Result",
  message = "",
  value,
  onChange,
  endpoint,
  disabled = false,
  placeholder = "Please select",
  ttl = 5 * 60 * 1000,
  debounceMs = 0
}) {
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef(null);
  const optionsRef = useRef(null);

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
        const unique = Array.from(new Set(mapped)).sort((a, b) => a.localeCompare(b));
        setOptions(unique);
      } catch (err) {
        if (err.name !== "AbortError") console.error("Failed to load dropdown data:", err);
      } finally {
        setLoading(false);
      }
    })();

    return () => ctrl.abort();
  }, [debouncedEndpoint, disabled, ttl]);

  // Fix iOS scroll issues - prevent body scroll when dropdown is open
  useEffect(() => {
    const handleTouchMove = (e) => {
      if (optionsRef.current && optionsRef.current.contains(e.target)) {
        // Allow scrolling inside dropdown
        const scrollTop = optionsRef.current.scrollTop;
        const scrollHeight = optionsRef.current.scrollHeight;
        const height = optionsRef.current.clientHeight;
        const isAtTop = scrollTop === 0;
        const isAtBottom = scrollTop + height >= scrollHeight;

        // Prevent overscroll bounce
        if ((isAtTop && e.touches[0].clientY > e.touches[0].pageY) ||
          (isAtBottom && e.touches[0].clientY < e.touches[0].pageY)) {
          e.preventDefault();
        }
      }
    };

    const root = document.getElementById("canopy-calculator-host")?.shadowRoot || document;
    root.addEventListener('touchmove', handleTouchMove, { passive: false });

    return () => root.removeEventListener('touchmove', handleTouchMove);
  }, []);

  return (
    <div className="flex flex-col sm:flex-col items-start sm:items-start gap-2 sm:gap-0">
      <LabelWithDialog label={label} message={message || "Select a result from the list."} />
      <div
        ref={dropdownRef}
        className="relative w-full sm:w-1/2"
        style={{
          isolation: 'isolate',
          transform: 'translateZ(0)',
          WebkitTransform: 'translateZ(0)'
        }}
      >
        <Listbox value={value} onChange={onChange} disabled={disabled}>
          {({ open }) => (
            <div>
              <Listbox.Button
                className={`w-full border border-gray-400 rounded-md p-2 bg-white text-left text-sm h-[40px] flex items-center font-normal ${disabled ? "opacity-60 cursor-not-allowed" : "cursor-pointer"
                  }`}
                style={{
                  WebkitTapHighlightColor: 'transparent',
                  WebkitAppearance: 'none',
                  position: 'relative',
                  zIndex: 1
                }}
              >
                <span className="flex-grow overflow-hidden text-ellipsis whitespace-nowrap">
                  {value || (loading ? "Loading..." : placeholder)}
                </span>
                <ChevronDownIcon className="h-5 w-5 text-gray-400 ml-2 flex-shrink-0" aria-hidden="true" />
              </Listbox.Button>

              {open && !disabled && options.length > 0 && (
                <Listbox.Options
                  ref={optionsRef}
                  className="absolute mt-1 w-full border border-gray-400 rounded-md bg-white shadow-lg max-h-60 overflow-auto"
                  style={{
                    WebkitOverflowScrolling: 'touch',
                    position: 'absolute',
                    zIndex: 50,
                    top: '100%',
                    left: 0,
                    right: 0,
                    transform: 'translateZ(0)',
                    WebkitTransform: 'translateZ(0)',
                    backfaceVisibility: 'hidden',
                    WebkitBackfaceVisibility: 'hidden',
                    willChange: 'scroll-position'
                  }}
                >
                  {options.map((opt) => (
                    <Listbox.Option
                      key={opt}
                      value={opt}
                      className={({ active }) =>
                        `cursor-pointer px-4 py-2 text-sm ${active ? "bg-gray-300 text-black" : "text-gray-900"}`
                      }
                      style={{
                        WebkitTapHighlightColor: 'transparent',
                        touchAction: 'manipulation',
                        minHeight: '40px',
                        display: 'flex',
                        alignItems: 'center'
                      }}
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
      </div>
    </div>
  );
}