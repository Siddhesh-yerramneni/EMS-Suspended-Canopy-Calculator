import { useEffect, useState } from "react";

export default function DismissibleNotice() {
  const TEXT =
    "NEW UPDATES: You can give us the feedback using the button to right side and can send the projects to Engineering Express. ";

  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const id = setTimeout(() => setVisible(false), 4000); // 15s auto-hide
    return () => clearTimeout(id);
  }, []);

  if (!visible) return null;

  return (
    <div className="w-full" aria-live="polite">
      <div className="mx-auto max-w-screen-lg px-2 sm:px-2">
        <div
          className={[
            "relative mt-3 rounded-md border border-black/40 bg-black text-white",
            "shadow-sm flex items-start gap-3 p-2",
          ].join(" ")}
          role="status"
        >
          {/* Top progress bar (white) */}
          <div className="absolute left-0 top-0 w-full h-1 bg-white/20 overflow-hidden rounded-t-md">
            <div
              className="h-full bg-white"
              style={{
                width: "0%",
                animation: "noticeFill 15s linear forwards",
              }}
            />
          </div>

          <div className="flex-1 text-sm leading-snug">{TEXT}</div>

          <button
            type="button"
            onClick={() => setVisible(false)}
            className="shrink-0 rounded p-1 text-white/70 hover:bg-white/10 hover:text-white focus:outline-none"
            aria-label="Dismiss notice"
            title="Dismiss"
          >
            {/* Inline X icon */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              width="18"
              height="18"
              className="block"
              style={{ fill: "currentColor" }}
            >
              <path d="M6.225 4.811a1 1 0 0 0-1.414 1.414L8.586 10l-3.775 3.775a1 1 0 1 0 1.414 1.414L10 11.414l3.775 3.775a1 1 0 1 0 1.414-1.414L11.414 10l3.775-3.775a1 1 0 1 0-1.414-1.414L10 8.586 6.225 4.811Z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
