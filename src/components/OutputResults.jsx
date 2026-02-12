// src/components/OutputResults.jsx
import { useState, useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import diagram from "../assets/img1.png";
import DotLine from "./Dotline";
export default function OutputResults({ canopyProjection = "" }) {
  /** Tooltip label — click to toggle */
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
  return (
    <div className="order-3 sm:order-3 col-span-1 lg:col-span-2 bg-black text-white py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h2 className="text-xl font-semibold mb-6 text-center tracking-wide">Results</h2>
        <div className="grid grid-cols-2 text-sm bg-gray-200 text-black rounded shadow overflow-hidden relative z-0">

          {/* Calculated design Pressures section */}
          <div className="col-span-2 relative">
            {/* Actual subsection content */}
            <div className="grid grid-cols-2">
              <div className="col-span-2 text-center font-semibold text-md tracking-wide text-black bg-white py-2 rounded-md shadow-sm border border-gray-200">Calculated Design Pressures</div>
              <div className="p-4 space-y-2 font-semibold text-center z-0">
                <p>Gravity Components & Cladding</p>
                <p>Uplift Components & Cladding</p>
              </div>
              <div className="p-4 space-y-2 bg-gray-100 text-center z-0">
                <p><span>5</span> PSF</p>
                <p><span>20</span> PSF</p>
              </div>
            </div>
          </div>

          {/* Deck Pan Design Capacities Section with Watermark */}
          <div className="col-span-2 relative">
            {/* Watermark Layer */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
              <p className="text-4xl sm:text-2xl font-extrabold text-gray-500 opacity-40 rotate-[-10deg] whitespace-nowrap">
                {/* FABRICATED RESULTS - INVALID TO USE */}
              </p>
            </div>

            {/* Content Grid */}
            <div className="grid grid-cols-2">
              <div className="col-span-2 text-center font-semibold text-md tracking-wide text-black bg-white py-2 rounded-md shadow-sm border border-gray-200">Deck Pan Design Capacities</div>
              <div className="p-4 space-y-2 font-semibold text-center z-0">
                <p>Max Gravity At Each Deck Pan, Cmax</p>
                <p>Max Tension At Each Deck Pan, Tmax</p>
                <p>Absolute Max Moment On Beam, Mmax</p>
                <p>Bending Moment Capacity</p>
                <p>Shear Capacity</p>
                <p>Reduced Bending And Shear Interaction</p>
                <p>Axial And Bending Interaction</p>
                <p>Axial With Reduced Bending And Shear Interaction</p>
                <p>Deflection Capacity</p>
                <p>Deck Pan Screw Capacity</p>
              </div>
              <div className="p-4 space-y-2 bg-gray-100 text-center z-0">
                <p><span>142</span> lb</p>
                <p><span>0</span> lb</p>
                <p><span>0.067</span> kip-ft</p>
                <p><span>8</span> %</p>
                <p><span>2</span> %</p>
                <p><span>8</span> %</p>
                <p><span>0</span> %</p>
                <p><span>0</span> %</p>
                <p><span>51</span> %</p>
                <p><span>0</span> %</p>
              </div>
            </div>
          </div>
        </div>

        {/* --- Image + overlay (desktop/tablet) --- */}
        <div className="relative isolate w-full max-w-4xl mx-auto hidden sm:block overflow-visible mb-12">
          <img
            src={diagram}
            alt="Canopy layout"
            className="w-full h-auto relative z-0" //add border here to see image positioning
          />
          {/* Canopy Projection field ON the image (right side) */}
          <div
            className="absolute pointer-events-auto overflow-visible z-[10] focus-within:z-[2000]"    // on top, clickable
            style={{
              top: "58%",                                       // ⬅ move up/down
              right: "4%",                                      // ⬅ move left/right
              width: "10%",                                     // ⬅ field width
            }}
          >
            {/* Your label + input */}
            <div className="flex flex-col gap-2">
              <div className="relative">
                <input
                  type="text"
                  value={canopyProjection ?? ""}
                  readOnly
                  onFocus={(e) => e.target.blur()}
                  className="w-full p-2 pr-10 border border-gray-300 rounded bg-white select-none cursor-default"
                  placeholder="__"
                  aria-readonly="true"
                />
                <span className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none">
                  ft
                </span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
