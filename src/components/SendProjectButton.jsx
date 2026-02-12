import { useState, useRef, useEffect } from "react";

export default function SendProjectButton({
  form,
  wpEmail,
  disabled = false,
  onSaved,
}) {
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState("idle"); // "idle" | "success"
  const [savedInfo, setSavedInfo] = useState(null); // holds server response
  const [projectName, setProjectName] = useState("");
  const [emailInput, setEmailInput] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const inputRef = useRef(null);

  const host =
    typeof document !== "undefined"
      ? document.getElementById("canopy-calculator-host")
      : null;
  const hostEmailAttr = host?.getAttribute?.("data-wp-email");

  const effectiveEmailRaw =
    (wpEmail && String(wpEmail).trim()) ||
    (hostEmailAttr && String(hostEmailAttr).trim()) ||
    (import.meta?.env?.MODE === "development" ? "dev@example.com" : "");
  const effectiveEmail = effectiveEmailRaw || "";

  useEffect(() => {
    if (open && status === "idle") {
      setTimeout(() => inputRef.current?.focus(), 0);
    }
    if (!open) {
      // reset everything when modal fully closes
      setProjectName("");
      setEmailInput("");
      setError("");
      setSaving(false);
      setStatus("idle");
      setSavedInfo(null);
    }
  }, [open, status]);

  const isEmail = (s) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(s || "").trim());

  const handleSave = async () => {
    if (!projectName.trim()) {
      setError("Please enter a project name.");
      inputRef.current?.focus();
      return;
    }

    // If not logged in and you didn't inject an email, ask for one
    const emailToSend = effectiveEmail || emailInput.trim();
    if (!emailToSend || !isEmail(emailToSend)) {
      setError("Please provide a valid email to save this project.");
      return;
    }

    setSaving(true);
    setError("");

    try {
      const nonce =
        typeof document !== "undefined"
          ? document.querySelector('meta[name="wp-rest-nonce"]')?.content
          : undefined;

      const payload = {
        projectName: projectName.trim(),               // API expects camelCase
        wp_email: emailToSend,                     // ok to include even if logged in
        form,
      };

      const res = await fetch(
        "https://engexpstaging.wpengine.com/wp-json/calc/v1/save-canopy-solution-suspended-sent-project",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            ...(nonce ? { "X-WP-Nonce": nonce } : {}),
          },
          body: JSON.stringify(payload),
          credentials: "include", // send cookies if present
        }
      );

      const ct = res.headers.get("content-type") || "";
      const raw = await res.text();

      if (!res.ok) {
        let msg = raw;
        try { msg = JSON.parse(raw)?.message || msg; } catch { }
        throw new Error(`HTTP ${res.status} ${res.statusText}${msg ? `\n${msg}` : ""}`);
      }
      if (!ct.includes("application/json")) {
        throw new Error(`Non-JSON response (${ct || "no content-type"})\n${raw.slice(0, 800)}`);
      }

      const data = JSON.parse(raw);
      setSavedInfo(data);
      setStatus("success");
      onSaved?.(data);

      // Optional: auto-close after 2s
      // setTimeout(() => setOpen(false), 2000);

    } catch (e) {
      setError(e.message || "Failed to send project.");
    } finally {
      setSaving(false);
    }
  };

  const closeModal = () => setOpen(false);

  const onKeyDown = (e) => {
    if (status === "success") {
      if (e.key === "Enter" || e.key === "Escape") closeModal();
      return;
    }
    if (e.key === "Enter") { e.preventDefault(); handleSave(); }
    if (e.key === "Escape") closeModal();
  };

  return (
    <>
      <button
        type="button"
        className="btn-green"
        style={{
          marginTop: "60px",
          padding: "0.75rem 1.5rem",
          backgroundColor: disabled ? "#6b7280" : "green",
          color: "white",
          borderRadius: "0.5rem",
          fontWeight: 600,
          transition: "background-color 0.3s ease",
          cursor: disabled ? "not-allowed" : "pointer",
          opacity: disabled ? 0.8 : 1,
          marginLeft: "12px",
        }}
        disabled={disabled}
        onMouseOver={(e) => { if (!disabled) e.currentTarget.style.backgroundColor = "green"; }}
        onMouseOut={(e) => { if (!disabled) e.currentTarget.style.backgroundColor = "green"; }}
        onClick={() => !disabled && setOpen(true)}
        aria-disabled={disabled}
      >
        Send Project to Engineering Express
      </button>

      {open && (
        <div
          className="fixed inset-0 z-[2147483000] flex items-center justify-center"
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.45)",
            zIndex: 2147483000,
          }}
          onClick={() => !saving && status !== "success" && closeModal()}
        >
          <div
            className="bg-white rounded-lg shadow-xl w-[92%] max-w-md p-4"
            style={{
              background: "white",
              borderRadius: "0.75rem",
              boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -4px rgba(0,0,0,0.1)",
              width: "92%",
              maxWidth: "28rem",
              padding: "1rem",
            }}
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            onKeyDown={onKeyDown}
          >
            {status === "success" ? (
              // ------- Success view -------
              <div>
                <div className="mb-3">
                  <div className="text-lg font-semibold">Project sent to Engineering Express successfully</div>
                  <p className="text-sm text-gray-600 mt-1">
                    {savedInfo?.quote_name
                      ? <>“<strong>{savedInfo.quote_name}</strong>”</>
                      : "Your Project"}
                    {" "}has been sent{savedInfo?.quote_id ? <> as <strong>#{savedInfo.quote_id}</strong></> : ""}.
                  </p>
                </div>

                <div className="flex justify-end mt-4">
                  <button
                    type="button"
                    className="px-3 py-2 rounded text-white text-sm"
                    style={{ backgroundColor: "green" }}
                    onClick={closeModal}
                    autoFocus
                  >
                    OK
                  </button>
                </div>
              </div>
            ) : (
              // ------- Form view -------
              <div>
                <div className="mb-3">
                  <div className="text-lg font-semibold">Send Project to Engineering Express</div>
                </div>

                <label className="block text-sm font-medium mb-1">Project name</label>
                <input
                  ref={inputRef}
                  type="text"
                  className="w-full p-2 border border-gray-300 rounded mb-2"
                  style={{
                    width: "100%",
                    padding: "0.5rem",
                    border: "1px solid #D1D5DB",
                    borderRadius: "0.375rem",
                    marginBottom: "0.5rem",
                  }}
                  placeholder="e.g. East patio pergola"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  disabled={saving}
                />

                {!effectiveEmail && (
                  <>
                    <label className="block text-sm font-medium mb-1">Email</label>
                    <input
                      type="email"
                      className="w-full p-2 border border-gray-300 rounded mb-2"
                      style={{
                        width: "100%",
                        padding: "0.5rem",
                        border: "1px solid #D1D5DB",
                        borderRadius: "0.375rem",
                        marginBottom: "0.5rem",
                      }}
                      placeholder="you@example.com"
                      value={emailInput}
                      onChange={(e) => setEmailInput(e.target.value)}
                      disabled={saving}
                    />
                  </>
                )}

                {error && (
                  <div
                    className="text-sm text-red-600 mb-2 whitespace-pre-wrap"
                    style={{ color: "#DC2626", marginBottom: "0.5rem", whiteSpace: "pre-wrap" }}
                  >
                    {error}
                  </div>
                )}

                <div className="flex justify-end gap-2 mt-2">
                  <button
                    type="button"
                    className="px-3 py-2 rounded border border-gray-300 text-sm"
                    style={{
                      padding: "0.5rem 0.75rem",
                      borderRadius: "0.375rem",
                      border: "1px solid #D1D5DB",
                      fontSize: "0.875rem",
                    }}
                    onClick={closeModal}
                    disabled={saving}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    className="px-3 py-2 rounded text-white text-sm"
                    style={{
                      padding: "0.5rem 0.75rem",
                      borderRadius: "0.375rem",
                      color: "white",
                      backgroundColor: saving ? "#6b7280" : "green",
                      fontSize: "0.875rem",
                    }}
                    onClick={handleSave}
                    disabled={saving}
                  >
                    {saving ? "Sending…" : "Send"}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
