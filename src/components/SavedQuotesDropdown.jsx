import { useEffect, useMemo, useRef, useState } from "react";
import { ChevronDownIcon, XMarkIcon } from "@heroicons/react/20/solid";

// --- Tooltip label (same as before) ---
const LabelWithDialog = ({ label, message }) => {
  const [show, setShow] = useState(false);
  const ref = useRef(null);
  const isTouch =
    typeof window !== "undefined" &&
    ("ontouchstart" in window || navigator.maxTouchPoints > 0 || navigator.msMaxTouchPoints > 0);

  useEffect(() => {
    const root = document.getElementById("canopy-calculator-host")?.shadowRoot || document;
    const onClick = (e) => { if (ref.current && !ref.current.contains(e.target)) setShow(false); };
    root.addEventListener("click", onClick);
    return () => root.removeEventListener("click", onClick);
  }, []);

  return (
    <div
      ref={ref}
      className={`relative w-full sm:w-1/2 flex items-center gap-1 ${isTouch ? "cursor-pointer" : "cursor-help"
        }`}
      onClick={() => setShow((s) => !s)}
    >
      <label className="text-sm whitespace-nowrap">Saved Projects</label>
      <span className="w-3 h-3 min-w-[1rem] min-h-[1rem] text-xs bg-white text-black border border-gray-400 rounded-full flex items-center justify-center font-bold leading-none">
        i
      </span>
      {show && (
        <div className="absolute top-full left-0 mt-1 z-10 w-64 text-xs p-2 rounded shadow bg-black text-white">
          {message || `Pick one of your most recent saved projects, then click “Load project.”`}
        </div>
      )}
    </div>
  );
};

// --- tiny cache (unchanged) ---
const CACHE = new Map();
async function fetchJSON(url, { signal, ttl = 5 * 60 * 1000 } = {}) {
  const now = Date.now();
  const hit = CACHE.get(url);
  if (hit && now - hit.t < ttl) return hit.data;

  const res = await fetch(url, {
    method: "GET",
    headers: { Accept: "application/json" },
    credentials: "include",
    mode: "cors",
    signal,
  });
  const ct = res.headers.get("content-type") || "";
  if (!res.ok || !ct.includes("application/json")) {
    const text = await res.text();
    throw new Error(
      `Unexpected response (${res.status}) from ${res.url}\nCT: ${ct}\n${text.slice(0, 300)}...`
    );
  }
  const data = await res.json();
  CACHE.set(url, { t: now, data });
  return data;
}

function labelFor(q) {
  let when = q?.created_at || "";
  try {
    const d = q?.created_at ? new Date(q.created_at.replace(" ", "T")) : null;
    if (d && !isNaN(d)) when = d.toLocaleString();
  } catch { }
  return `${q?.quote_name ?? "(no name)"} — ${when}`;
}

/**
 * Props:
 * - onLoad(formObject, meta)
 * - limit = 50
 * - apiOrigin = ""
 * - ttl = 300000
 */
export default function SavedQuotesDropdown({
  onLoad,
  limit = 50,
  apiOrigin = "",
  ttl = 5 * 60 * 1000,
}) {
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const [quotes, setQuotes] = useState([]);

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedId, setSelectedId] = useState("");   // current selection in modal
  const [committedId, setCommittedId] = useState(""); // shown in collapsed control

  // NEW: search term state
  const [search, setSearch] = useState("");

  // email discovery (same as before)
  const host =
    typeof document !== "undefined"
      ? document.getElementById("canopy-calculator-host")
      : null;
  const hostEmailAttr = host?.getAttribute?.("data-wp-email");
  const isDev =
    !!import.meta?.env?.DEV || /^(localhost|127\.0\.0\.1)$/i.test(window.location.hostname);

  const effectiveEmail =
    (hostEmailAttr && String(hostEmailAttr).trim()) ||
    (isDev ? "siddhesh@engineeringexpress.com" : "");

  const base = apiOrigin || window.location.origin;
  const nocacheRef = useRef(Date.now());

  const listUrl = useMemo(() => {
    const params = new URLSearchParams({
      limit: String(limit),
      nocache: String(nocacheRef.current),
    });
    if (effectiveEmail) params.set("wp_email", effectiveEmail);
    return `${base}/wp-json/calc/v1/list-suspended-quotes?${params.toString()}`;
  }, [base, limit, effectiveEmail]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      setErr("");
      try {
        const json = await fetchJSON(listUrl, { ttl });
        const arr = Array.isArray(json?.items) ? json.items
          : Array.isArray(json?.quotes) ? json.quotes
            : [];
        if (!cancelled) {
          setQuotes(arr);
          if (!arr.find(q => String(q.quote_id) === String(committedId))) {
            setCommittedId("");
          }
        }
      } catch (e) {
        if (!cancelled) setErr(e.message || "Failed to load saved projects.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [listUrl, ttl, committedId]);

  const committed =
    quotes.find(q => String(q.quote_id) === String(committedId)) || null;
  const selected =
    quotes.find(q => String(q.quote_id) === String(selectedId)) || null;

  // NEW: filtered list by name
  const filteredQuotes = useMemo(() => {
    const s = search.trim().toLowerCase();
    if (!s) return quotes;
    return quotes.filter(q =>
      String(q?.quote_name || "").toLowerCase().includes(s)
    );
  }, [quotes, search]);

  const openModal = () => {
    setSelectedId(committedId || "");
    setSearch(""); // reset search each time you open
    setModalOpen(true);
  };
  const closeModal = () => setModalOpen(false);

  const confirmSelection = () => {
    if (!selected) return;
    setCommittedId(String(selected.quote_id));
    setModalOpen(false);
  };

  const loadSelected = () => {
    if (!committed) return;
    try {
      const formObj = committed.form_json ? JSON.parse(committed.form_json) : null;
      if (!formObj || typeof formObj !== "object") throw new Error("Saved project has no valid form_json.");
      onLoad?.(formObj, {
        quote_id: committed.quote_id,
        quote_name: committed.quote_name,
        created_at: committed.created_at,
      });
    } catch (e) {
      setErr(e.message || "Could not load the saved project.");
    }
  };

  // Empty state
  if (!loading && !err && quotes.length === 0) {
    return (
      <div className="mb-6 w-full">
        <h1 className="text-lg text-center font-semibold mb-2">Previously saved projects</h1>
        <div className="text-sm text-gray-600 text-center border border-gray-200 rounded-md p-3 bg-gray-50">
          No saved projects
        </div>
      </div>
    );
  }

  return (
    <div className="mb-6 w-full">
      <h1 className="text-lg text-center font-semibold mb-4">Previously saved projects</h1>

      {!loading && err && (
        <div className="text-sm text-red-600 whitespace-pre-wrap text-center mb-3">{err}</div>
      )}

      {/* MOBILE */}
      <div className="block sm:hidden">
        <div className="flex flex-col gap-2 w-full">
          <LabelWithDialog
            label="Saved Projects"
            message="Pick one of your most recent saved projects, then tap “Load project.”"
          />
          <button
            type="button"
            className={`w-full border border-gray-300 rounded-md p-3 bg-white text-left text-sm h-[44px] flex items-center ${loading || quotes.length === 0 ? "opacity-60 cursor-not-allowed" : "cursor-pointer"
              }`}
            onClick={openModal}
            disabled={loading || quotes.length === 0}
            aria-haspopup="dialog"
          >
            <span className="flex-grow">
              {committed ? labelFor(committed) : loading ? "Loading..." : "Select a saved project"}
            </span>
            <ChevronDownIcon className="h-5 w-5 text-gray-400 ml-2" aria-hidden="true" />
          </button>
          <button
            type="button"
            className="w-full px-4 py-3 rounded text-white text-sm"
            style={{ backgroundColor: committed ? "black" : "#6b7280" }}
            onClick={loadSelected}
            disabled={!committed}
            title={committed ? "Load this project" : "Select a project first"}
          >
            Load project
          </button>
        </div>
      </div>

      {/* DESKTOP */}
      <div className="hidden sm:block">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4 w-full">
          <LabelWithDialog
            label="Saved Projects"
            message="Pick one of your most recent saved projects, then click “Load project.”"
          />
          <div className="relative w-full sm:w-1/2 flex items-center gap-2">
            <button
              type="button"
              className={`w-full border border-gray-300 rounded-md p-2 bg-white text-left text-sm h-[40px] flex items-center ${loading || quotes.length === 0 ? "opacity-60 cursor-not-allowed" : "cursor-pointer"
                }`}
              onClick={openModal}
              disabled={loading || quotes.length === 0}
              aria-haspopup="dialog"
            >
              <span className="flex-grow">
                {committed ? labelFor(committed) : loading ? "Loading..." : "Select a saved project"}
              </span>
              <ChevronDownIcon className="h-5 w-5 text-gray-400 ml-2" aria-hidden="true" />
            </button>
            <button
              type="button"
              className="px-3 py-2 rounded text-white text-sm"
              style={{ backgroundColor: committed ? "black" : "#6b7280" }}
              onClick={loadSelected}
              disabled={!committed}
              title={committed ? "Load this project" : "Select a project first"}
            >
              Load project
            </button>
          </div>
        </div>
      </div>

      {/* ===== Modal ===== */}
      {modalOpen && (
        <div
          className="fixed inset-0 z-[2147483000] flex items-center justify-center"
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.45)",
            zIndex: 2147483000,
          }}
          onClick={closeModal}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="bg-white rounded-lg shadow-xl w-[92%] max-w-2xl p-0 sm:p-4 max-h-[85vh] overflow-hidden"
            style={{
              background: "white",
              borderRadius: "0.75rem",
              boxShadow:
                "0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -4px rgba(0,0,0,0.1)",
              width: "92%",
              maxWidth: "42rem",
              padding: "0.75rem",
              maxHeight: "85vh",
              display: "flex",
              flexDirection: "column",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-3 sm:px-1 py-2 border-b border-gray-200">
              <div className="text-base sm:text-lg font-semibold">Select a saved project</div>
              <button
                type="button"
                className="p-1 rounded hover:bg-gray-100"
                onClick={closeModal}
                aria-label="Close"
                title="Close"
              >
                <XMarkIcon className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            {/* Search (icon on the right, prod-proof) */}
            <div className="px-3 sm:px-2 pt-3">
              <div className="relative h-10 overflow-visible"> {/* overflow-visible prevents clipping */}
                {/* Right-side icon (inline SVG) */}
                <span
                  className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 z-20 inline-flex items-center justify-center"
                  aria-hidden="true"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    width="20"
                    height="20"
                    className="block min-w-[20px] min-h-[20px]"
                    style={{
                      fill: "currentColor",
                      color: "#9CA3AF" // Tailwind gray-400; guarantees visible color in prod
                    }}
                  >
                    <path d="M8.5 2a6.5 6.5 0 1 1 4.546 11.146l3.904 3.904a1 1 0 0 1-1.414 1.414l-3.904-3.904A6.5 6.5 0 0 1 8.5 2zm0 2a4.5 4.5 0 1 0 0 9 4.5 4.5 0 0 0 0-9z" />
                  </svg>
                </span>

                <input
                  type="text"
                  className={[
                    "w-full h-10",
                    "pl-3 pr-10",               // space for the right icon
                    "py-0",
                    "border border-gray-300 rounded bg-white",
                    "text-sm leading-tight appearance-none",
                    "focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-gray-400",
                    "relative z-0"
                  ].join(" ")}
                  placeholder="Search by name…"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>

              <div className="text-xs text-gray-500 mt-1 min-h-[1.25rem] flex items-center">
                {loading
                  ? "Loading…"
                  : `${filteredQuotes.length} project${filteredQuotes.length === 1 ? "" : "s"}`}
              </div>
            </div>

            {/* List */}
            <div className="flex-1 p-3 sm:p-2">
              {loading ? (
                <div className="text-sm text-gray-600">Loading…</div>
              ) : filteredQuotes.length === 0 ? (
                <div className="text-sm text-gray-600">No matches.</div>
              ) : (
                // Scrollbar when more than 4 items
                <div className={`${filteredQuotes.length > 4 ? "max-h-64 overflow-auto" : ""}`}>
                  <ul className="divide-y divide-gray-200">
                    {filteredQuotes.map((q) => {
                      const id = String(q.quote_id);
                      const active = selectedId === id;
                      return (
                        <li
                          key={id}
                          className={`py-2 px-2 cursor-pointer ${active ? "bg-gray-100" : "bg-white"
                            } hover:bg-gray-100 rounded`}
                          onClick={() => setSelectedId(id)}
                        >
                          <div className="flex items-start gap-2">
                            <input
                              type="radio"
                              name="saved-quote"
                              checked={active}
                              onChange={() => setSelectedId(id)}
                              className="mt-1"
                            />
                            <div className="flex-1">
                              <div className="text-sm font-medium">
                                {q?.quote_name || "(no name)"}
                              </div>
                              <div className="text-xs text-gray-600">
                                {labelFor(q)}
                              </div>
                            </div>
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="flex justify-end gap-2 px-3 sm:px-1 py-2 border-t border-gray-200">
              <button
                type="button"
                className="px-3 py-2 rounded border border-gray-300 text-sm"
                onClick={closeModal}
              >
                Cancel
              </button>
              <button
                type="button"
                className="px-3 py-2 rounded text-white text-sm"
                style={{ backgroundColor: selected ? "black" : "#6b7280" }}
                onClick={confirmSelection}
                disabled={!selected}
                title={selected ? "Use this project" : "Select a project first"}
              >
                Use selection
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
