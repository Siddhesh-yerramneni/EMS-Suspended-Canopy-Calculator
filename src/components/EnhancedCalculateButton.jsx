import { useMemo, useRef, useState, useEffect } from "react";
export default function EnhancedCalculateButton({ form, requiredFields, loading, onCalculate, wpEmail }) {
  const [showTip, setShowTip] = useState(false);
  const tipRef = useRef(null);
  const btnRef = useRef(null);

  // ===== Email discovery =====
  const host =
    typeof document !== "undefined"
      ? document.getElementById("canopy-calculator-host")
      : null;
  const hostEmailAttr = host?.getAttribute?.("data-wp-email");

  const isDev =
    !!import.meta?.env?.DEV ||
    /^(localhost|127\.0\.0\.1)$/i.test(window.location.hostname);

  const effectiveEmail =
    (wpEmail && String(wpEmail).trim()) ||
    (hostEmailAttr && String(hostEmailAttr).trim()) ||
    (isDev ? "siddhesh@engineeringexpress.com" : "");

  // ===== ALWAYS use the same WP URL in dev + prod =====
  const API_TRACK_URL =
    "https://engexpstaging.wpengine.com/wp-json/calc/v1/track-calc-hit";

  // ===== Tracking helper =====
  const trackUsage = () => {
    if (!effectiveEmail) {
      // console.warn(
      //   "[EnhancedCalculateButton] No effectiveEmail → skipping tracking"
      // );
      return;
    }

    try {
      const nonce =
        typeof document !== "undefined"
          ? document.querySelector('meta[name="wp-rest-nonce"]')?.content
          : undefined;

      const payload = {
        wp_email: effectiveEmail,
        calc_key: "EMS_host_mounted_suspended_canopy_calculator",
      };

      // console.log("[EnhancedCalculateButton] Tracking usage:", {
      //   url: API_TRACK_URL,
      //   payload,
      // });

      // fire-and-forget; don't await so Calculate feels snappy
      fetch(API_TRACK_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          ...(nonce ? { "X-WP-Nonce": nonce } : {}),
        },
        credentials: "include",
        body: JSON.stringify(payload),
      })
        .then(async (res) => {
          const ct = res.headers.get("content-type") || "";
          const raw = await res.text();
          if (!res.ok) {
            // console.warn(
            //   "[EnhancedCalculateButton] tracking failed HTTP:",
            //   res.status,
            //   res.statusText,
            //   raw.slice(0, 300)
            // );
            return;
          }
          if (!ct.includes("application/json")) {
            // console.warn(
            //   "[EnhancedCalculateButton] tracking non-JSON response:",
            //   ct,
            //   raw.slice(0, 300)
            // );
            return;
          }
          const json = JSON.parse(raw);
          // console.log("[EnhancedCalculateButton] tracking OK:", json);
        })
        .catch((e) => {
          // console.warn("[EnhancedCalculateButton] tracking fetch error:", e);
        });
    } catch (e) {
      // console.warn("[EnhancedCalculateButton] tracking setup error:", e);
    }
  };

  // Decide if a field is currently required
  const isFieldRequired = (rule, f) => {
    if (typeof rule.when === "function") return !!rule.when(f);
    if (typeof rule.requiredIf === "function") return !!rule.requiredIf(f);
    if (rule.dependsOn && "requiredEquals" in rule) return f?.[rule.dependsOn] === rule.requiredEquals;
    if (rule.dependsOn && Array.isArray(rule.requiredIn)) return rule.requiredIn.includes(f?.[rule.dependsOn]);
    return true; // default: required
  };

  const isEmpty = (v) =>
    v == null ||
    (typeof v === "string" && v.trim() === "") ||
    (Array.isArray(v) && v.length === 0);

  // Only include fields that are currently required
  const missing = useMemo(() => {
    const activeRules = requiredFields.filter((rf) => isFieldRequired(rf, form));
    return activeRules.filter(({ name }) => isEmpty(form?.[name]));
  }, [form, requiredFields]);

  const missingCount = missing.length;
  const MAX_VISIBLE = 3;
  const visibleMissing = useMemo(() => missing.slice(0, MAX_VISIBLE), [missing]);
  const remainingCount = Math.max(missingCount - visibleMissing.length, 0);

  const disabled = loading || missingCount > 0;
  const shouldShowTip = disabled && missingCount > 0;

  const tipStyle = {
    position: "absolute",
    top: "100%",
    left: "50%",
    transform: "translateX(-50%)",
    marginTop: "8px",
    zIndex: 9999,
    maxWidth: "90vw",
    whiteSpace: "normal",
  };

  const handleMouseEnter = () => shouldShowTip && setShowTip(true);
  const handleMouseLeave = () => setShowTip(false);
  const handleFocus = () => shouldShowTip && setShowTip(true);
  const handleBlur = () => setShowTip(false);
  const handleTouchStart = (e) => {
    if (shouldShowTip) {
      setShowTip(true);
      e.preventDefault();
    }
  };

  const LOADING_STEPS = [
    "Designing roof element…",
    "Designing beams…",
    "Designing hanger arm…",
    "Designing strut…",
    "Re-checking the entire design as whole..."
  ];

  const [stepIndex, setStepIndex] = useState(0);

  useEffect(() => {
    if (!loading) {            // when not loading, reset the cycle
      setStepIndex(0);
      return;
    }
    const id = setInterval(() => {
      setStepIndex((i) => (i + 1) % LOADING_STEPS.length);
    }, 2000);                  // 2s per message
    return () => clearInterval(id);
  }, [loading]);

  const loadingText = LOADING_STEPS[stepIndex];

  return (
    <div className="flex justify-center relative">
      <button
        ref={btnRef}
        className="btn-black"
        style={{
          marginTop: "60px",
          padding: "0.75rem 1.5rem",
          backgroundColor: disabled ? "#6b7280" : "black",
          color: "white",
          borderRadius: "0.5rem",
          fontWeight: 600,
          transition: "background-color 0.3s ease",
          cursor: disabled ? "not-allowed" : "pointer",
          opacity: disabled ? 0.8 : 1,
          position: "relative",
        }}
        disabled={disabled}
        onMouseOver={(e) => {
          if (!disabled) e.currentTarget.style.backgroundColor = "#4b5563";
          handleMouseEnter();
        }}
        onMouseOut={(e) => {
          if (!disabled) e.currentTarget.style.backgroundColor = "black";
          handleMouseLeave();
        }}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onTouchStart={handleTouchStart}
        onClick={() => {
          if (disabled) return;
          trackUsage();   // count this hit
          onCalculate();  // do the actual calc
        }}
        aria-busy={loading}
        aria-live="polite"
        aria-disabled={disabled}
        aria-describedby={shouldShowTip && showTip ? "missing-fields-tip" : undefined}
      >
        {loading ? loadingText : "Calculate"}

        {shouldShowTip && (
          <span
            aria-hidden="true"
            style={{
              position: "absolute",
              top: "-6px",
              right: "-6px",
              background: "#ef4444",
              color: "white",
              borderRadius: "9999px",
              fontSize: "12px",
              lineHeight: 1,
              padding: "3px 6px",
              border: "2px solid white",
            }}
            title={`${missingCount} fields missing`}
          >
            {missingCount}
          </span>
        )}
      </button>

      {shouldShowTip && showTip && (
        <div
          id="missing-fields-tip"
          ref={tipRef}
          role="tooltip"
          className="pointer-events-none"
          style={tipStyle}
        >
          <div
            className="rounded-md shadow-lg"
            style={{
              background: "rgba(0,0,0,0.9)",
              color: "white",
              padding: "10px 12px",
              fontSize: "0.875rem",
              lineHeight: 1.3,
              border: "1px solid rgba(255,255,255,0.15)",
            }}
          >
            <div className="font-semibold mb-1">
              Please complete ({Math.min(MAX_VISIBLE, missingCount)} of {missingCount})
            </div>

            <ul className="list-disc ml-5">
              {visibleMissing.map(({ name, label }) => (
                <li key={name}>{label}</li>
              ))}
            </ul>

            {remainingCount > 0 && (
              <div className="mt-2 opacity-80">…and {remainingCount} more after these.</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
