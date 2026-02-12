import { useEffect, useRef, useState } from "react";

const LabelWithDialog = ({ label, message }) => {
  const [show, setShow] = useState(false);
  const tooltipRef = useRef(null);
  const isTouchDevice =
    typeof window !== "undefined" &&
    ("ontouchstart" in window ||
      navigator.maxTouchPoints > 0 ||
      navigator.msMaxTouchPoints > 0);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (tooltipRef.current && !tooltipRef.current.contains(e.target)) setShow(false);
    };
    const root = document.getElementById("canopy-calculator-host")?.shadowRoot || document;
    root.addEventListener("click", handleClickOutside);
    return () => root.removeEventListener("click", handleClickOutside);
  }, []);

  return (
    <div
      ref={tooltipRef}
      className={`relative w-full sm:w-1/2 flex items-start gap-1 ${isTouchDevice ? "cursor-pointer" : "cursor-help"
        }`}
      onClick={() => setShow((prev) => !prev)}
    >
      <label className="text-sm whitespace-normal break-words leading-snug font-normal">
        {label}
      </label>
      <span className=" w-3 h-3 min-w-[1rem] min-h-[1rem] text-xs bg-white text-black border border-gray-400 rounded-full flex items-center justify-center font-bold leading-none mt-0.5 shrink-0">
        i
      </span>
      {show && (
        <div className="absolute top-full left-0 mt-1 z-10 w-64 text-xs p-2 rounded shadow bg-black text-white">
          {message}
        </div>
      )}
    </div>
  );
};

export default LabelWithDialog;