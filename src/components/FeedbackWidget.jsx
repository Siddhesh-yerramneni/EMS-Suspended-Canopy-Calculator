import { useEffect, useRef, useState } from "react";

export default function FeedbackWidget({
  onSubmit,
  buttonLabel = "Feedback?",
  placeholder = "Tell us what’s on your mind…",
  maxLength = 1000,
}) {
  const [open, setOpen] = useState(false);
  const [text, setText] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState("idle"); // "idle" | "success"
  const textareaRef = useRef(null);

  // --- email discovery (same pattern as SavedQuotesDropdown / SaveQuoteButton) ---
  const host =
    typeof document !== "undefined"
      ? document.getElementById("canopy-calculator-host")
      : null;

  const hostEmailAttr = host?.getAttribute?.("data-wp-email");

  const isDev =
    !!import.meta?.env?.DEV ||
    /^(localhost|127\.0\.0\.1)$/i.test(window.location.hostname);

  const effectiveEmail =
    (hostEmailAttr && String(hostEmailAttr).trim()) ||
    (isDev ? "siddhesh@engineeringexpress.com" : "");

  // Close on ESC
  useEffect(() => {
    if (!open) return;
    const handleKey = (e) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [open]);

  // Focus textarea when modal opens (only in idle/form mode)
  useEffect(() => {
    if (open && status === "idle" && textareaRef.current) {
      const id = requestAnimationFrame(() => textareaRef.current?.focus());
      return () => cancelAnimationFrame(id);
    }
  }, [open, status]);

  // Reset state when modal fully closes
  useEffect(() => {
    if (!open) {
      setText("");
      setSubmitting(false);
      setStatus("idle");
    }
  }, [open]);

  const handleSubmit = async () => {
    const value = text.trim();
    if (!value) return;
    try {
      setSubmitting(true);
      if (onSubmit) {
        // pass both feedback text and wp_email (dev → siddhesh@engineeringexpress.com)
        await onSubmit(value, effectiveEmail);
      } else {
        console.log("[FeedbackWidget] Feedback submitted:", {
          message: value,
          wp_email: effectiveEmail,
        });
      }
      setText("");
      // Switch to success view instead of closing
      setStatus("success");
    } finally {
      setSubmitting(false);
    }
  };

  const closeModal = () => setOpen(false);

  const onKeyDown = (e) => {
    if (status === "success") {
      if (e.key === "Enter" || e.key === "Escape") {
        e.preventDefault();
        closeModal();
      }
      return;
    }
    if (e.key === "Enter") {
      e.preventDefault();
      handleSubmit();
    }
    if (e.key === "Escape") {
      e.preventDefault();
      closeModal();
    }
  };

  return (
    <>
      {/* Floating vertical button (fixed to viewport, huge z-index) */}
      <button
        type="button"
        aria-haspopup="dialog"
        aria-expanded={open}
        onClick={() => setOpen(true)}
        style={{
          position: "fixed",
          top: "80%",
          right: "0.75rem",
          transform: "translateY(-50%) rotate(-180deg)",
          zIndex: 2147483600, // very high, like your SavedQuotes modal
          writingMode: "sideways-rl",
          textOrientation: "mixed",
          background: "#6b7280", // orange
          color: "white",
          borderRadius: "9999px",
          border: "1px solid rgba(0,0,0,0.25)",
          padding: "0.75rem 0.35rem",
          fontWeight: 600,
          fontSize: "0.875rem",
          letterSpacing: "0.03em",
          boxShadow: "0 4px 8px rgba(0,0,0,0.15)",
          cursor: "pointer",
        }}
      >
        {buttonLabel}
      </button>

      {/* Modal overlay */}
      {open && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Feedback form"
          onClick={() => status === "idle" && !submitting && closeModal()}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.45)",
            zIndex: 2147483601, // above the button
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: "white",
              borderRadius: "0.75rem",
              boxShadow:
                "0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -4px rgba(0,0,0,0.1)",
              width: "92%",
              maxWidth: "32rem",
              padding: "1rem",
              maxHeight: "80vh",
              display: "flex",
              flexDirection: "column",
            }}
            onKeyDown={onKeyDown}
          >
            {status === "success" ? (
              // ------- Success view (like SaveQuoteButton) -------
              <div>
                <div style={{ marginBottom: "0.75rem" }}>
                  <div style={{ fontSize: "1.05rem", fontWeight: 600 }}>
                    Feedback received
                  </div>
                  <p
                    style={{
                      marginTop: "0.35rem",
                      fontSize: "0.9rem",
                      color: "#4b5563",
                    }}
                  >
                    Your feedback is received!
                  </p>
                </div>

                <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "0.75rem" }}>
                  <button
                    type="button"
                    style={{
                      padding: "0.45rem 0.9rem",
                      borderRadius: "0.5rem",
                      border: "none",
                      backgroundColor: "#6b7280",
                      color: "white",
                      fontSize: "0.85rem",
                      fontWeight: 600,
                      cursor: "pointer",
                    }}
                    onClick={closeModal}
                    autoFocus
                  >
                    OK
                  </button>
                </div>
              </div>
            ) : (
              // ------- Form view -------
              <>
                {/* Header */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginBottom: "0.5rem",
                  }}
                >
                  <div style={{ fontSize: "1.05rem", fontWeight: 600 }}>
                    The development team is hard at work developing new features.
                    Tell us what you would like to see!
                  </div>
                  <button
                    type="button"
                    onClick={closeModal}
                    aria-label="Close"
                    style={{
                      border: "none",
                      background: "transparent",
                      cursor: "pointer",
                      borderRadius: "9999px",
                      padding: "0.25rem",
                    }}
                    disabled={submitting}
                  >
                    ✕
                  </button>
                </div>

                {/* Textarea */}
                <label htmlFor="feedback-text" style={{ display: "none" }}>
                  Feedback
                </label>
                <textarea
                  id="feedback-text"
                  ref={textareaRef}
                  value={text}
                  onChange={(e) =>
                    setText(e.target.value.slice(0, maxLength))
                  }
                  placeholder={placeholder}
                  rows={6}
                  style={{
                    width: "100%",
                    flexGrow: 1,
                    resize: "vertical",
                    borderRadius: "0.75rem",
                    border: "1px solid #d1d5db",
                    padding: "0.75rem",
                    fontSize: "0.9rem",
                    outline: "none",
                  }}
                  disabled={submitting}
                />

                {/* Footer info */}
                <div
                  style={{
                    marginTop: "0.25rem",
                    display: "flex",
                    justifyContent: "space-between",
                    fontSize: "0.75rem",
                    color: "#6b7280",
                  }}
                >
                  <span>
                    {text.trim().length} / {maxLength}
                  </span>
                  <span style={{ fontStyle: "italic" }}>Press Enter to submit, Esc to close</span>
                </div>

                {/* Buttons */}
                <div
                  style={{
                    marginTop: "0.75rem",
                    display: "flex",
                    justifyContent: "flex-end",
                    gap: "0.5rem",
                  }}
                >
                  <button
                    type="button"
                    onClick={closeModal}
                    style={{
                      padding: "0.4rem 0.9rem",
                      borderRadius: "0.5rem",
                      border: "1px solid #d1d5db",
                      background: "white",
                      cursor: submitting ? "not-allowed" : "pointer",
                      fontSize: "0.85rem",
                      opacity: submitting ? 0.7 : 1,
                    }}
                    disabled={submitting}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={!text.trim() || submitting}
                    style={{
                      padding: "0.4rem 0.9rem",
                      borderRadius: "0.5rem",
                      border: "none",
                      background: "#6b7280",
                      color: "white",
                      fontWeight: 600,
                      fontSize: "0.85rem",
                      cursor:
                        !text.trim() || submitting ? "not-allowed" : "pointer",
                      opacity: !text.trim() || submitting ? 0.6 : 1,
                    }}
                  >
                    {submitting ? "Sending…" : "Submit"}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
