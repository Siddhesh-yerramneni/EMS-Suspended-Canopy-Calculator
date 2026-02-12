// import statements
import { useEffect, useState, useMemo } from "react";
import { AnimatePresence, motion } from "framer-motion";
import AsyncDropdown from "./AsyncDropdown";
import AsyncDropdownImage from "./AsyncDropdownImage";
import EnhancedCalculateButton from "./EnhancedCalculateButton";
import SaveQuoteButton from "./SaveQuoteButton";
import SavedQuotesDropdown from "./SavedQuotesDropdown";
import Dropdown from "./Dropdown";
import DropdownOnImage from "./DropdownOnImage";
import SendProjectButton from "./SendProjectButton";
import SentProjectsDropdown from "./SentProjectsDropdown";
import LabelWithDialog from "./LabelWithDialog";
import DismissibleNote from "./DismissibleNote";
import { apiUrl } from "../utils/api";
import {
  computeScrewCount,
  REQUIRED_FIELDS,
  normalize,
  isFieldActuallyRequired,
  isEmpty,
  isInteger,
  isDecimalNumber,
  MIN_WIND,
  MAX_WIND,
  inRange,
  MIN_SNOW,
  MAX_SNOW,
  inRangeSnow,
  MIN_OVERHANG,
  MAX_OVERHANG,
  inRangeOverhang,
  MIN_CANOPY_LEN,
  MAX_CANOPY_LEN,
  inRangeCanopyLen,
  MIN_STRUT_SPACING,
  MAX_STRUT_SPACING,
  inRangeStrutSpacing,
  MIN_CANOPY_PROJ,
  MAX_CANOPY_PROJ,
  inRangeCanopyProj,
  MIN_HANGER_EDGE,
  MAX_HANGER_EDGE,
  inRangeHangerEdge,
  MIN_INSTALL,
  MAX_INSTALL,
  inRangeInstall,
  MIN_HANGER_HEIGHT,
  MAX_HANGER_HEIGHT,
  inRangeHangerHeight,
  MIN_MEAN_ROOF,
  MAX_MEAN_ROOF,
  inRangeMeanRoof,
  MIN_DECKPAN_OVERHANG
} from "../utils/bodyUtils";
import diagram1 from "../assets/01_M.png";
import diagram1_1 from "../assets/02_M.png";
import diagram2 from "../assets/01_S.png";
import diagram3 from "../assets/With_Strut.png";
import diagram3_3 from "../assets/Without_Strut.png";
import diagram5 from "../assets/Parallel_With_Strut.png";
import diagram5_5 from "../assets/Parallel_Without_Strut.png";
import diagram4 from "../assets/ZOOM-02.png"; //2 is parallel
import diagram4_4 from "../assets/ZOOM-04.png";// this is perpendicular
import DotLine from "./Dotline";

// main body component
export default function Body({ form, setForm, onCalc, onLoadingChange }) {

  // helpers
  const setField = (key) => (value) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const handleInput = (key) => (e) =>
    setForm((prev) => ({ ...prev, [key]: e.target.value }));

  const handleLoadQuote = (savedForm, meta) => {
    // Merge or replace — here we replace, keeping any defaults you want.
    setForm(prev => ({ ...prev, ...savedForm }));
    console.log("Loaded quote:", meta);
  };

  // Body.jsx (near your component render)
  const [loading, setLoading] = useState(false);
  // === helpers for conditional required fields ===


  // recompute missing using the conditional logic:
  const missing = useMemo(
    () =>
      REQUIRED_FIELDS.filter(
        (f) => isFieldActuallyRequired(f, form) && isEmpty(form?.[f.name])
      ),
    [form] // REQUIRED_FIELDS is static
  );

  const calcDisabled = loading || missing.length > 0;

  // digits-only change handler (keeps your no-decimals rule)
  const handleIntInput = (key) => (e) => {
    const digitsOnly = e.target.value.replace(/\D/g, "");
    setForm((prev) => (prev[key] === digitsOnly ? prev : { ...prev, [key]: digitsOnly }));
  };
  const blockNonNumericKeys = (e) => {
    if ([".", ",", "e", "E", "-", "+"].includes(e.key)) e.preventDefault();
  };
  const blockNonNumericPaste = (e) => {
    const text = (e.clipboardData || window.clipboardData).getData("text");
    if (/\D/.test(text)) e.preventDefault();
  };

  // touched tracking
  const [touched, setTouched] = useState({});
  const markTouched = (key) => () =>
    setTouched((prev) => (prev[key] ? prev : { ...prev, [key]: true }));


  // allow digits + single dot; strip others
  const handleDecimalInput = (key) => (e) => {
    let v = e.target.value;

    // keep only digits and dots
    v = v.replace(/[^0-9.]/g, "");
    // collapse multiple dots to a single dot
    const parts = v.split(".");
    if (parts.length > 2) v = parts[0] + "." + parts.slice(1).join("");

    setForm((prev) => (prev[key] === v ? prev : { ...prev, [key]: v }));
  };

  // optional: block invalid keystrokes (keeps navigation keys)
  const blockBadDecimalKeys = (e) => {
    const allowed = [
      "Backspace", "Tab", "Enter", "Escape", "ArrowLeft", "ArrowRight", "Home", "End", "Delete",
    ];
    if (allowed.includes(e.key)) return;

    // allow one '.' only
    if (e.key === ".") {
      const el = e.currentTarget;
      if (el.value.includes(".")) e.preventDefault();
      return;
    }
    // allow digits only otherwise
    if (!/^[0-9]$/.test(e.key)) e.preventDefault();
  };

  const blockBadDecimalPaste = (e) => {
    const text = (e.clipboardData || window.clipboardData).getData("text");
    const cleaned = text.replace(/[^0-9.]/g, "");
    const dotCount = (cleaned.match(/\./g) || []).length;
    if (!cleaned || dotCount > 1) e.preventDefault();
  };

  // dependent resets
  useEffect(() => {
    setForm((prev) => ({ ...prev, roof_element_item_name: "" }));
  }, [form.roofing_style]);

  useEffect(() => {
    setForm((prev) => ({ ...prev, beam_item_name: "" }));
  }, [form.beam_type]);

  //
  useEffect(() => {
    const next = String(computeScrewCount(form.roofing_style));
    if (form.numof_screws_for_roof_element_to_beam !== next) {
      setForm(f => ({ ...f, numof_screws_for_roof_element_to_beam: next }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.roofing_style]);

  //Diagnol strut condition reset
  const isParallel = (() => {
    const dir = String(form.roof_element_direction ?? "").replace(/\s/g, "");
    // parallel if "||" or the parallel symbol
    return /(\|\||∥)/.test(dir);
  })();

  const hasDiagonal = /^(true|1|yes)$/i.test(String(form.diagonal_strut_condition ?? ""));

  // map the 4 possibilities to the right image
  const key = `${isParallel ? "PAR" : "PERP"}_${hasDiagonal ? "T" : "F"}`;
  const diagramMap = {
    PAR_T: diagram5,      // Roof Element Span || To Host AND TRUE
    PAR_F: diagram5_5,    // Roof Element Span || To Host AND FALSE
    PERP_T: diagram3,     // Roof Element Span ⟂ To Host AND TRUE
    PERP_F: diagram3_3,   // Roof Element Span ⟂ To Host AND FALSE
  };

  // pick with a safe fallback
  const selectedDiagram = diagramMap[key] ?? diagram3_3;

  // endpoints (no memoization; just derived from form)
  const roofItemnameEndpoint = form.roofing_style
    ? apiUrl("wp-json/canopydb/roofElement/", {
      client: "Eastern Metal Supply",
      comptype: form.roofing_style,
      manufacturer: "Eastern Metal Supply",
      //nocache: Date.now(),
    })
    : null;

  //POST API Call
  // Add token, and uncomment the token auth line to make it work in dev
  const [lastError, setLastError] = useState(null);
  const API_URL = import.meta.env.DEV
    ? 'canopy-api/api/canopy-calculator-5.7?nocache=16554'   // goes through Vite proxy
    : 'https://engexpstaging.wpengine.com/wp-json/canopydb/calculate';      // same-origin in prod

  const TOKEN = "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiIwMTk3YTdlZC0zYWUwLTczNWYtOTVkNi0zMWYzMjlmYTAzNjQiLCJqdGkiOiI5YmM5MTIzNzFlOTM2OWUwM2I5OGQ0MTg1YmRiYjMwZDc4ZDUwMWM0YTdmZjAyNjBjYmU3MDA5ZmEwNGQwZWY0MGI2NTQxNWZmNDNiMjFlMSIsImlhdCI6MTc1MDg3MTIwNC4xNzIxOSwibmJmIjoxNzUwODcxMjA0LjE3MjE5MiwiZXhwIjoxNzgyNDA3MjA0LjE2MDM2Niwic3ViIjoiMSIsInNjb3BlcyI6WyIqIl19.Q0fDPWAroqoGiKukONW6UCbKqMXMfgcMV_k8_LRdXyA-IgXeDBZnFg7_Ld-y9fgdAj4XNDAF9-yxmoGKEg2gps-NnhSMYknkSUujIVGZgR44r_11xyV-wyt2U4tUG4ux1pAz55kKLr5oCr1Kxw8I1j9VmKRJ-YHjCsjkGq4-gf9iGZAIeboX3W63yC5gv_SuA8NaO02EuwZY5uEaQAIndQ0gF5E9HFo9-2O1s61giPX6vhEHzBsjCP4J8nlo3bZW42Tse6KpkkzARptxBmNuMBAMzawwYBYRPHdRE5KEyfdlLAMJgzkr9uRYRJ3g4daVDzzp3ZuQm0qP_rm5iEj-eX-xB8vn_rMGZGXAr2SYHgT6YSmBNJe8vspUBRTGj_L4UrSd5OUKudL1JaWiDTBWXm5Y2Osy6d166zT8EQjRbvsIs5f7toQSlN4Oj1BFDojkXv99uxfdWH4PRh8DPpkDGmPNfY5pj5DoczqcVvISIZDhIbWBRWCCH86wkNrT3sZ9L666Xdm18tmL4n8xdk62ELs_ar-LmxUZEV_jXj9lqNSeYoJeoGGwEPm7aLpGIw69QMMZDymXdkl1WHZikyKbqOc-m64w5Q54DzEuuFaoF9uDHMFIR_QnWPmjM4QfeYaPdwUtWl7CD3GfYzRYp6HEldV1YhYZuIeqoSUJHKimyJs"; // <-- put your real token here for dev testing
  const handleCalculate = async () => {
    if (loading) return;
    setLoading(true);
    setLastError(null);
    onLoadingChange?.(true);

    try {
      const payload = form;
      const body = JSON.stringify(payload);

      // console.log("[Calc] POST", API_URL);
      // console.log("[Calc] Payload", payload);

      const res = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
          ...(TOKEN ? { Authorization: `Bearer ${TOKEN}` } : {}),
        },
        body: JSON.stringify(payload),
        credentials: "omit", // you don't need cookies for this POST unless required
      });

      const ct = res.headers.get("content-type") || "";
      const raw = await res.text(); // read once
      console.log("[Calc] status", res.status, res.statusText, "| CT:", ct);

      if (!res.ok) {
        throw new Error(`HTTP ${res.status} ${res.statusText}\n${raw.slice(0, 800)}`);
      }
      if (!ct.includes("application/json")) {
        throw new Error(`Non-JSON response (${ct || "no content-type"})\n${raw.slice(0, 800)}`);
      }

      let data;
      try {
        data = JSON.parse(raw);
      } catch (e) {
        throw new Error(`Invalid JSON parse\n${raw.slice(0, 800)}`);
      }

      console.log("[Calc] Response JSON:", data);
      onCalc?.(data);
    } catch (err) {
      console.error("Canopy calculation failed:", err);
      setLastError(err.message || String(err));
    } finally {
      setLoading(false);
      onLoadingChange?.(false);
    }
  };

  return (
    <div className="w-full max-w-screen-lg mx-auto px-4 sm:px-6 py-6 rounded space-y-3">
      <DismissibleNote message="Saved projects now appear here. Click a project to load it." />
      {/**Sent Projects to EX */}
      <div className="mb-6">
        <SentProjectsDropdown
          onLoad={handleLoadQuote}
          limit={50}
          apiOrigin="https://engexpstaging.wpengine.com"
        />
      </div>
      {/**Previously save quotes */}
      <div className="mb-6">
        <SavedQuotesDropdown
          onLoad={handleLoadQuote}
          limit={50}
          apiOrigin="https://engexpstaging.wpengine.com" // same origin as WP (omit in same-origin pages)
        />
      </div>
      {/**End Previously saved quotes */}
      <h1 className="text-lg text-center font-semibold mb-4">Site & Loading Conditions</h1>
      {/* Ultimate windspeed */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4 mb-3 w-full">
        <LabelWithDialog
          label="Ultimate Windspeed"
          message={`Enter Vult in mph. Whole number only, ${MIN_WIND}–${MAX_WIND} mph.`}
        />

        {(() => {
          const val = form.wind_speed ?? "";
          const hasTouched = touched.wind_speed ?? false;
          const invalid = hasTouched && !inRange(val);

          // choose message
          let msg = "";
          if (hasTouched) {
            if (!isInteger(val)) msg = "Please enter the windspeed without decimals.";
            else if (!inRange(val)) msg = `Must be between ${MIN_WIND} and ${MAX_WIND} mph.`;
          }

          return (
            <div className="relative w-full sm:w-1/2">
              <input
                type="text"                 // keep strict control over input
                inputMode="numeric"         // numeric keypad on mobile
                pattern="[0-9]*"            // hint for numeric input
                maxLength={3}               // optional: windspeed won't exceed 3 digits
                className={[
                  "w-full p-2 border rounded",
                  invalid
                    ? "border-red-500 focus:outline-none focus:ring-2 focus:ring-red-400"
                    : "border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400",
                ].join(" ")}
                value={val}
                onChange={handleIntInput("wind_speed")}
                onKeyDown={blockNonNumericKeys}
                onPaste={blockNonNumericPaste}
                onBlur={/* choose one: */ markTouched("wind_speed") /* or clampOnBlur("windspeedValue") */}
                aria-invalid={invalid || undefined}
                aria-describedby={invalid ? "windspeed-error" : undefined}
                placeholder={`Enter the windspeed`}
              />
              <span className="pointer-events-none absolute right-3 top-1/3 -translate-y-1/3 text-gray-600 text-sm select-none">
                MPH
              </span>

              {invalid && (
                <p id="windspeed-error" className="mt-1 text-xs text-red-600">
                  {msg}
                </p>
              )}
            </div>
          );
        })()}
      </div>
      {/* End Ultimate windspeed */}

      {/* Exposure category */}
      <Dropdown
        label="Exposure Category"
        message="Determine your site exposure category. Help can be found at ecalc.io/Exposure"
        options={["C", "D"]}
        value={form.exposure_category}
        onChange={setField("exposure_category")}
      />
      {/* End Exposure category */}

      {/* Ground snow load */}
      <div className="relative flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4 mb-3 w-full">
        <LabelWithDialog
          label="Ground Snow Load"
          message="Ground Snow Load can be found at https://ascehazardtool.org/ or via your local building department's design standards."
        />

        {(() => {
          const val = form.ground_snow_load ?? "";
          const hasTouched = touched.ground_snow_load ?? false;
          const invalid = hasTouched && !inRangeSnow(val);
          const msg =
            !hasTouched ? "" :
              !isInteger(val) ? "Please enter a whole number (no decimals)." :
                !inRangeSnow(val) ? `Must be between ${MIN_SNOW} and ${MAX_SNOW} psf.` : "";

          return (
            <div className="relative w-full sm:w-1/2">
              {/* PSF suffix (visual only) */}
              <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 text-sm select-none">
                PSF
              </span>

              <input
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={2}  // 0..20 fits in 2 digits
                className={[
                  "w-full p-2 pr-12 border rounded",
                  invalid
                    ? "border-red-500 focus:outline-none focus:ring-2 focus:ring-red-400"
                    : "border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400",
                ].join(" ")}
                value={val}
                onChange={handleIntInput("ground_snow_load")}
                onKeyDown={blockNonNumericKeys}
                onPaste={blockNonNumericPaste}
                onBlur={markTouched("ground_snow_load")}   // or use: clampSnowOnBlur
                aria-invalid={invalid || undefined}
                aria-describedby={invalid ? "snowload-error" : undefined}
                placeholder={`Enter ${MIN_SNOW}–${MAX_SNOW}`}
              />

              {invalid && (
                <p id="snowload-error" className="mt-1 text-xs text-red-600">
                  {msg}
                </p>
              )}
            </div>
          );
        })()}
      </div>
      {/* End Ground snow load */}

      <hr className="mb-4 mt-6" />
      {/* Image1 input section */}
      <h2 className="font-semibold text-lg text-center mb-4">Dimensions & Layout</h2>

      {/* --- Image1 + overlay (desktop/tablet) --- */}
      <div className="relative w-full max-w-5xl mx-auto hidden sm:block overflow-visible mb-12">
        <img
          src={
            // Normalize: remove spaces, then test for parallel or perpendicular marks
            /(\|\||∥)/.test(String(form.roof_element_direction ?? "").replace(/\s/g, ""))
              ? diagram1_1     // parallel: "||" (with or without spaces) or "∥"
              : diagram1    // perpendicular: anything else (incl. "⊥" / "Ʇ")
          }
          alt="Canopy layout"
          className="w-full h-auto relative z-0"
        />

        {/* ===== Leader lines as siblings (relative to the IMAGE container) ===== */}
        <DotLine className="z-0" x="15%" y="10%" angle={30} length="20.5%" />{/* Hanger Arm Dropdown */}
        <DotLine className="z-0" x="42%" y="10%" angle={118} length="20%" />{/* Strut Beam Dropdown */}
        <DotLine className="z-0" x="10%" y="23%" angle={32} length="20%" />{/*Perimeter Beam Dropdown*/}
        <DotLine className="z-0" x="86%" y="78%" angle={190} length="15%" />{/* Canopy Projection field */}
        <DotLine className="z-0" x="32%" y="88%" angle={300} length="13%" />{/* Canopy total length */}
        <DotLine className="z-0" x="11%" y="60%" angle={333} length="11%" />{/* End overhang left */}
        <DotLine className="z-0" x="13%" y="84%" angle={320} length="22.5%" />{/* Strut Spacing */}
        <DotLine className="z-0" x="74%" y="24%" angle={124} length="25%" />{/* Roof Element */}
        <DotLine className="z-0" x="60%" y="6%" angle={95} length="29%" />{/* Roof Element */}
        {/* ===================================================================== */}

        {/* Roof element Direction */}
        <div
          className="absolute pointer-events-auto overflow-visible z-[10] focus-within:z-[2000]"
          style={{ top: "14%", right: "0%", width: "35%", overflow: "visible" }}
        >
          <DropdownOnImage
            label="Roof Element Direction"
            message="Select the direction of the roof element."
            options={{ "Parallel to host": "Roof Element Span | | To Host", "Perpendicular to host": "Roof Element Span Ʇ To Host" }}
            value={form.roof_element_direction}
            onChange={setField("roof_element_direction")}
          />
        </div>
        {/*End Roof Element Direction */}

        {/* Hanger Arm Dropdown */}
        <div
          className="absolute pointer-events-auto overflow-visible z-[10] focus-within:z-[2000]"
          style={{ top: "0%", left: "0%", width: "48%", overflow: "visible" }}
        >
          <AsyncDropdownImage
            label="Select Hanger Arm"
            message="Select the Hanger Arm item."
            value={form.hanger_arm_item_name}
            onChange={setField("hanger_arm_item_name")}
            endpoint={apiUrl("wp-json/canopydb/hangeramName/", {
              client: "Eastern Metal Supply",
              manufacturer: "Eastern Metal Supply",
              comptype: "Hanger Arm",
              //nocache: Date.now(),
            })}
          />
        </div>
        {/*END : Hanger Arm Dropdown*/}

        {/* Strut Beam Dropdown */}
        <div
          className="absolute pointer-events-auto overflow-visible z-[10] focus-within:z-[2000]"
          style={{ top: "0%", left: "30%", width: "40%", overflow: "visible" }}
        >
          <AsyncDropdownImage
            label="Select Strut Beam"
            message="Select the strut beam item."
            value={form.strut_beam_item_name}
            onChange={setField("strut_beam_item_name")}
            endpoint={apiUrl("wp-json/canopydb/strutItemNamebycm/", {
              client: "Eastern Metal Supply",
              manufacturer: "Eastern Metal Supply",
              //nocache: Date.now(),
            })}
          />
        </div>
        {/*END : Strut Beam Dropdown*/}

        {/* Select Perimeter Beam Dropdown */}
        <div
          className="absolute pointer-events-auto overflow-visible z-[10] focus-within:z-[2000]" //Add ring to debug
          style={{ top: "18%", left: "0%", width: "48%", height: "13%", overflow: "visible" }}
        >
          <AsyncDropdownImage
            label="Select Perimeter Beam"
            message="Select the strut beam item."
            value={form.beam_item_name}
            onChange={setField("beam_item_name")}
            endpoint={apiUrl("wp-json/canopydb/beamitemname/", {
              client: "Eastern Metal Supply",
              comptype: "Gutter Beam",
              manufacturer: "Eastern Metal Supply",
              //nocache: Date.now(),
            })}
          />
        </div>
        {/*END : Select Perimeter Beam Dropdown*/}

        {/* Canopy Projection field ON the image (right side) */}
        <div
          className="absolute pointer-events-auto overflow-visible z-[10] focus-within:z-[2000]"
          style={{ top: "65%", right: "4%", width: "10%" }}
        >
          <div className="flex flex-col gap-2 relative">
            <LabelWithDialog label="Canopy Projection" message="Please enter the value." />

            {(() => {
              const val = form.canopy_total_x_width_projection ?? "";
              const hasTouched = touched.canopy_total_x_width_projection ?? false;
              const invalid = hasTouched && !inRangeCanopyProj(val);
              const msg =
                !hasTouched ? "" :
                  !isDecimalNumber(val) ? "Please enter a number." :
                    !inRangeCanopyProj(val) ? `Must be between ${MIN_CANOPY_PROJ} and ${MAX_CANOPY_PROJ} ft.` : "";

              return (
                <div>
                  {/* visual unit (not part of value) */}
                  <span className="pointer-events-none absolute right-3 top-[4rem] -translate-y-1/2 text-gray-600 text-sm select-none">
                    ft
                  </span>

                  <input
                    type="text"
                    inputMode="decimal"
                    className={[
                      "w-full p-2 pr-10 border rounded bg-white",
                      invalid
                        ? "border-red-500 focus:outline-none focus:ring-2 focus:ring-red-400"
                        : "border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400",
                    ].join(" ")}
                    value={val}
                    onChange={handleDecimalInput("canopy_total_x_width_projection")}
                    onKeyDown={blockBadDecimalKeys}
                    onPaste={blockBadDecimalPaste}
                    onBlur={markTouched("canopy_total_x_width_projection")}
                    // or auto-correct into range:
                    // onBlur={clampCanopyProjOnBlur}
                    aria-invalid={invalid || undefined}
                    aria-describedby={invalid ? "canopyproj-error" : undefined}
                    placeholder={`____`}
                  />

                  {invalid && (
                    <p id="canopyproj-error" className="mt-1 text-xs text-red-600">
                      {msg}
                    </p>
                  )}
                </div>
              );
            })()}
          </div>
        </div>
        {/*END : Canopy Projection field ON the image (right side)*/}

        {/* Canopy total length */}
        <div
          className="absolute pointer-events-auto overflow-visible z-[10] focus-within:z-[2000]"
          style={{ bottom: "5%", left: "25%", width: "12%" }}
        >
          <div className="flex flex-col gap-2 relative">
            <LabelWithDialog label="Canopy Total Length" message="Please enter the value." />

            {(() => {
              const val = form.canopy_total_y_length ?? "";
              const hasTouched = touched.canopy_total_y_length ?? false;
              const invalid = hasTouched && !inRangeCanopyLen(val);
              const msg =
                !hasTouched ? "" :
                  !isDecimalNumber(val) ? "Please enter a number." :
                    !inRangeCanopyLen(val) ? `Must be between ${MIN_CANOPY_LEN} and ${MAX_CANOPY_LEN} ft.` : "";

              return (
                <div>
                  {/* visual suffix (not part of value) */}
                  <span className="pointer-events-none absolute right-3 top-[5.5rem] -translate-y-1/2 text-gray-600 text-sm select-none">
                    ft
                  </span>
                  <input
                    type="text"
                    inputMode="decimal"
                    className={[
                      "w-full p-2 pr-10 border rounded bg-white",
                      invalid
                        ? "border-red-500 focus:outline-none focus:ring-2 focus:ring-red-400"
                        : "border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400",
                    ].join(" ")}
                    value={val}
                    onChange={handleDecimalInput("canopy_total_y_length")}
                    onKeyDown={blockBadDecimalKeys}
                    onPaste={blockBadDecimalPaste}
                    onBlur={markTouched("canopy_total_y_length")}
                    // or: onBlur={clampCanopyLenOnBlur}
                    aria-invalid={invalid || undefined}
                    aria-describedby={invalid ? "canopylen-error" : undefined}
                    placeholder={`____`}
                  />

                  {invalid && (
                    <p id="canopylen-error" className="mt-1 text-xs text-red-600">
                      {msg}
                    </p>
                  )}
                </ div>
              );
            })()}
          </div>
        </div>
        {/*END : Canopy total length*/}

        {/**Roof element dropdown */}
        <div
          className="absolute pointer-events-auto overflow-visible z-[10] focus-within:z-[2000]" //Add ring to debug
          style={{ top: "0%", right: "0%", width: "48%", height: "13%", overflow: "visible" }}
        >
          <AsyncDropdownImage
            label="Select Roof element"
            message="Select the roof element."
            value={form.roof_element_item_name}
            onChange={setField("roof_element_item_name")}
            endpoint={roofItemnameEndpoint}
            placeholder={!form.roofing_style ? "Select roof type prior" : "Please select"}
          />
        </div>
        {/**End Roof element dropdown */}


        {/* End overhang length left */}
        <div
          className="absolute pointer-events-auto overflow-visible z-[10] focus-within:z-[2000]"
          style={{ top: "50%", left: "0%", width: "11%" }}
        >
          <div className="flex flex-col gap-2 relative">
            <LabelWithDialog label="End Overhang" message="Please enter the value." />

            {(() => {
              const val = form.perimeterBeamOverhangValue ?? "";
              const hasTouched = touched.perimeterBeamOverhangValue ?? false;
              const invalid = hasTouched && !inRangeOverhang(val);
              const msg =
                !hasTouched ? "" :
                  !isDecimalNumber(val) ? "Please enter a number." :
                    !inRangeOverhang(val) ? `Must be between ${MIN_OVERHANG} and ${MAX_OVERHANG} ft.` : "";

              return (
                <div>
                  {/* visual suffix */}
                  <span className="pointer-events-none absolute right-3 top-[4rem] -translate-y-1/2 text-gray-600 text-sm select-none">
                    ft
                  </span>

                  <input
                    type="text"
                    inputMode="decimal"
                    className={[
                      "w-full p-2 pr-10 border rounded bg-white",
                      invalid
                        ? "border-red-500 focus:outline-none focus:ring-2 focus:ring-red-400"
                        : "border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400",
                    ].join(" ")}
                    value={val}
                    onChange={handleDecimalInput("perimeterBeamOverhangValue")}
                    onKeyDown={blockBadDecimalKeys}
                    onPaste={blockBadDecimalPaste}
                    onBlur={markTouched("perimeterBeamOverhangValue")}
                    // or: onBlur={clampOverhangOnBlur}
                    aria-invalid={invalid || undefined}
                    aria-describedby={invalid ? "overhang-error" : undefined}
                    placeholder={`____`}
                  />

                  {invalid && (
                    <p id="overhang-error" className="mt-1 text-xs text-red-600">
                      {msg}
                    </p>
                  )}
                </div>
              );
            })()}
          </div>
        </div>
        {/*END : End overhang length left*/}

        {/* Strut Spacing */}
        <div
          className="absolute pointer-events-auto overflow-visible z-[10] focus-within:z-[2000]"
          style={{ bottom: "10%", left: "4%", width: "10%" }}
        >
          <div className="flex flex-col gap-2 relative">
            <LabelWithDialog label="Strut Spacing" message="Please enter the value." />

            {(() => {
              const val = form.spacing_between_hanger_arms_or_struts ?? "";
              const hasTouched = touched.spacing_between_hanger_arms_or_struts ?? false;
              const invalid = hasTouched && !inRangeStrutSpacing(val);
              const msg =
                !hasTouched ? "" :
                  !isDecimalNumber(val) ? "Please enter a number." :
                    !inRangeStrutSpacing(val) ? `Must be between ${MIN_STRUT_SPACING} and ${MAX_STRUT_SPACING} ft.` : "";

              return (
                <div>
                  {/* visual suffix (not part of value) */}
                  <span className="pointer-events-none absolute right-3 top-[4rem] -translate-y-1/2 text-gray-600 text-sm select-none">
                    ft
                  </span>

                  <input
                    type="text"
                    inputMode="decimal"
                    className={[
                      "w-full p-2 pr-10 border rounded bg-white",
                      invalid
                        ? "border-red-500 focus:outline-none focus:ring-2 focus:ring-red-400"
                        : "border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400",
                    ].join(" ")}
                    value={val}
                    onChange={handleDecimalInput("spacing_between_hanger_arms_or_struts")}
                    onKeyDown={blockBadDecimalKeys}
                    onPaste={blockBadDecimalPaste}
                    onBlur={markTouched("spacing_between_hanger_arms_or_struts")}
                    // or auto-correct into range:
                    // onBlur={clampStrutSpacingOnBlur}
                    aria-invalid={invalid || undefined}
                    aria-describedby={invalid ? "strutspacing-error" : undefined}
                    placeholder={`____`}
                  />

                  {invalid && (
                    <p id="strutspacing-error" className="mt-1 text-xs text-red-600">
                      {msg}
                    </p>
                  )}
                </div>
              );
            })()}
          </div>
        </div>
        {/*End : Strut Spacing*/}
      </div>
      {/* --- End Image + overlay (desktop/tablet) --- */}

      {/* --- Mobile fallback: stack inputs under image1 --- */}
      <div className="sm:hidden">
        <img
          src={
            // Normalize: remove spaces, then test for parallel or perpendicular marks
            /(\|\||∥)/.test(String(form.roof_element_direction ?? "").replace(/\s/g, ""))
              ? diagram1_1      // parallel: "||" (with or without spaces) or "∥"
              : diagram1    // perpendicular: anything else (incl. "⊥" / "Ʇ")
          }
          alt="Canopy layout"
          className="w-full h-auto rounded-md border border-gray-200 shadow-sm mb-3"
        />

        {/*Roof element Direction */}
        <Dropdown
          label="Roof Element Direction"
          message="Select the direction of the roof element."
          options={["Roof Element Span | | To Host", "Roof Element Span Ʇ To Host"]}
          value={form.roof_element_direction}
          onChange={setField("roof_element_direction")}
        />
        {/*End roof element direction */}

        {/* Canopy Projection */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4 mb-3 w-full">
          <LabelWithDialog label="Canopy Projection" message="Please enter the value." />
          <input
            type="text"
            className="w-full sm:w-1/2 p-2 border border-gray-300 rounded"
            value={form.canopy_total_x_width_projection}
            onChange={handleInput("canopy_total_x_width_projection")}
            placeholder="Enter value in ft"
          />
        </div>
        {/*END : Canopy Projection*/}

        {/* Canopy Total Length */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4 mb-3 w-full">
          <LabelWithDialog label="Canopy Total Length" message="Please enter the value." />

          <input
            type="text"
            className="w-full sm:w-1/2 p-2 border border-gray-300 rounded"
            value={form.canopy_total_y_length}
            onChange={handleInput("canopy_total_y_length")}
            placeholder="Enter value in ft"
          />
        </div>
        {/*END : Canopy Total Length*/}

        {/* Strut Spacing */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4 mb-3 w-full">
          <LabelWithDialog label="Strut Spacing" message="Please enter the value." />
          <input
            type="text"
            className="w-full sm:w-1/2 p-2 border border-gray-300 rounded"
            value={form.spacing_between_hanger_arms_or_struts}
            onChange={handleInput("spacing_between_hanger_arms_or_struts")}
            placeholder="Enter value in ft"
          />
        </div>
        {/*End : Strut Spacing*/}

        {/* End Overhang */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4 mb-3 w-full">
          <LabelWithDialog label="End Overhang" message="Please enter the value." />
          <input
            type="text"
            className="w-full sm:w-1/2 p-2 border border-gray-300 rounded"
            value={form.perimeterBeamOverhangValue}
            onChange={handleInput("perimeterBeamOverhangValue")}
            placeholder="Enter value in ft"
          />
        </div>
        {/*END : End Overhang*/}

        {/* Hanger Arm Dropdown */}
        <div className="mb-3">
          <AsyncDropdown
            label="Select Hanger Arm"
            message="Select the Hanger Arm item."
            value={form.hanger_arm_item_name}
            onChange={setField("hanger_arm_item_name")}
            endpoint={apiUrl("wp-json/canopydb/hangeramName/", {
              client: "Eastern Metal Supply",
              manufacturer: "Eastern Metal Supply",
              comptype: "Hanger Arm",
              //nocache: Date.now(),
            })}
          />
        </div>
        {/*END : Hanger Arm Dropdown*/}

        <div className="mb-3">
          <AsyncDropdown
            label="Select Strut Beam"
            message="Select the strut beam item."
            value={form.strut_beam_item_name}
            onChange={setField("strut_beam_item_name")}
            endpoint={apiUrl("wp-json/canopydb/strutItemNamebycm/", {
              client: "Eastern Metal Supply",
              manufacturer: "Eastern Metal Supply",
              //nocache: Date.now(),
            })}
          />
        </div>
        {/*END : Strut Beam Dropdown*/}

        {/* Select Perimeter Beam Dropdown */}
        <div className="mb-3">
          <AsyncDropdown
            label="Select Perimeter Beam"
            message="Select the strut beam item."
            value={form.beam_item_name}
            onChange={setField("beam_item_name")}
            endpoint={apiUrl("wp-json/canopydb/beamitemname/", {
              client: "Eastern Metal Supply",
              comptype: "Gutter Beam",
              manufacturer: "Eastern Metal Supply",
              //nocache: Date.now(),
            })}
          />
        </div>
        {/*END : Select Perimeter Beam Dropdown*/}

        {/**Select roof element dropdown */}
        <AsyncDropdown
          label="Roof element"
          message=""
          value={form.roof_element_item_name}
          onChange={setField("roof_element_item_name")}
          endpoint={roofItemnameEndpoint}
          placeholder={!form.roofing_style ? "Select roof type prior" : "Please select"}
          disabled={!form.roofing_style}
        />
        {/**End: Roof element dropdown */}
      </div>
      {/* --- End Mobile fallback: stack inputs under image1 --- */}

      {/* --- Image2 + overlay (desktop/tablet) --- */}
      <div className="relative w-full max-w-4xl mx-auto hidden sm:block overflow-visible">
        <img
          src={diagram2}
          alt="Canopy layout"
          className="w-full h-auto" // add border here to see image positioning
        />

        {/* ===== Leader lines as siblings (relative to the IMAGE container) ===== */}
        <DotLine x="86%" y="45%" angle={180} length="18.25%" /> {/* Mean Roof Height */}
        <DotLine x="86%" y="16%" angle={160} length="23.25%" /> {/* HangerArm Height */}
        <DotLine x="86%" y="80%" angle={180} length="22%" /> {/* Canopy Install Height */}
        <DotLine x="10%" y="72%" angle={344} length="32%" /> {/* Canopy Projection */}
        <DotLine x="10%" y="20%" angle={20} length="24.5%" /> {/* HangerArm edge distance */}
        {/* <DotLine x="38%" y="6%" angle={356} length="25%" /> Upper roof length */}
        {/* ===================================================================== */}

        {/* meanRoofHeightValue */}
        <div
          className="absolute z-10 focus-within:z-[9999] pointer-events-auto overflow-visible"
          style={{ top: "30%", right: "4%", width: "10%" }}
        >
          <div className="flex flex-col gap-2 relative">
            <LabelWithDialog label="Mean Roof Height" message="Please enter the value." />

            {(() => {
              const val = form.mean_roof_height ?? "";
              const hasTouched = touched.mean_roof_height ?? false;
              const isNumber = val !== "" && !isNaN(Number(val));

              const installVal = form.canopy_installation_height;
              const hangerVal = form.hanger_arm_height_above_canopy;

              const isInstallValid = installVal !== "" && !isNaN(Number(installVal));
              const isHangerValid = hangerVal !== "" && !isNaN(Number(hangerVal));

              const combinedHeight = (Number(installVal) || 0) + (Number(hangerVal) || 0);

              // If both others are valid numbers, check the sum. 
              // Only flag "TooLow" if the current value is correctly valid but less than sum
              const checkComparison = isNumber && (isInstallValid || isHangerValid);
              const isTooLow = checkComparison && Number(val) < combinedHeight;

              const invalid = hasTouched && (!(isNumber && inRangeMeanRoof(val)) || isTooLow);

              const msg =
                !hasTouched ? "" :
                  !isNumber ? "Please enter a number." :
                    !inRangeMeanRoof(val) ? `Must be between ${MIN_MEAN_ROOF} and ${MAX_MEAN_ROOF} ft.` :
                      isTooLow ? `Must be ≥ Install Ht + Hanger Arm (${combinedHeight} ft).` : "";

              return (
                <div className="relative">
                  {/* visual unit (not part of value) */}
                  <span className="pointer-events-none absolute right-3 top-[5.5rem] -translate-y-1/2 text-gray-600 text-sm select-none">
                    ft
                  </span>

                  <input
                    type="text"
                    inputMode="decimal"
                    className={[
                      "w-full p-2 pr-10 border rounded bg-white",
                      invalid
                        ? "border-red-500 focus:outline-none focus:ring-2 focus:ring-red-400"
                        : "border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400",
                    ].join(" ")}
                    value={val}
                    onChange={handleDecimalInput("mean_roof_height")}
                    onKeyDown={blockBadDecimalKeys}
                    onPaste={blockBadDecimalPaste}
                    onBlur={markTouched("mean_roof_height")}
                    // or auto-correct into range:
                    // onBlur={clampMeanRoofOnBlur}
                    aria-invalid={invalid || undefined}
                    aria-describedby={invalid ? "meanroof-error" : undefined}
                    placeholder={`____`}
                  />

                  {invalid && (
                    <p
                      id="meanroof-error"
                      className="absolute top-10.5 -translate-x-1/4 w-max text-xs text-red-600 font-bold bg-white/80 p-1 rounded z-50 shadow-sm border border-red-200"
                    >
                      {msg}
                    </p>
                  )}
                </div>
              );
            })()}
          </div>
        </div>
        {/*END : meanRoofHeightValue*/}

        {/* Upper roof length */}
        <div
          className="absolute pointer-events-auto overflow-visible z-[10] focus-within:z-[2000]"
          style={{ top: "-10%", right: "5%", width: "32%", overflow: "visible" }}
        >
          <DropdownOnImage
            label="Upper roof length"
            message="Select the  estimated roof length."
            options={{ Unsure: "0", "25 ft": "25", "50 ft": "50", "75 ft": "75", "100 ft": "100", "150 ft": "150", "200 ft": "200", "500 ft": "500", "1000 ft": "1000" }}
            value={form.upper_roof_length}
            onChange={setField("upper_roof_length")}
          />
        </div>
        {/*End : Upper roof length */}

        {/* HangerArm Height */}
        <div
          className="absolute z-10 focus-within:z-[9999] pointer-events-auto"
          style={{ top: "0%", right: "4%", width: "10%" }}
        >
          <div className="flex flex-col gap-2 relative">
            <LabelWithDialog label="HangerArm Height" message="Please enter the value." />

            {(() => {
              const val = form.hanger_arm_height_above_canopy ?? "";
              const hasTouched = touched.hanger_arm_height_above_canopy ?? false;
              const isNumber = val !== "" && !isNaN(Number(val));

              const meanRoofVal = form.mean_roof_height;
              const installVal = form.canopy_installation_height;

              const isMeanRoofValid = meanRoofVal !== "" && !isNaN(Number(meanRoofVal));
              // We check if (Install + Hanger) > MeanRoof
              // Only enforce if both Install and MeanRoof are valid numbers
              const isInstallValid = installVal !== "" && !isNaN(Number(installVal));

              const totalHeight = (Number(installVal) || 0) + Number(val);
              const isTooHigh = isNumber && isMeanRoofValid && isInstallValid && totalHeight > Number(meanRoofVal);

              const invalid = hasTouched && (!(isNumber && inRangeHangerHeight(val)) || isTooHigh);

              const msg =
                !hasTouched ? "" :
                  !isNumber ? "Please enter a number." :
                    !inRangeHangerHeight(val) ? `Must be between ${MIN_HANGER_HEIGHT} and ${MAX_HANGER_HEIGHT} ft.` :
                      isTooHigh ? `Install + Hanger must be ≤ Mean Roof (${meanRoofVal} ft).` : "";

              return (
                <div>
                  {/* visual unit */}
                  <span className="pointer-events-none absolute right-3 top-[4rem] -translate-y-1/2 text-gray-600 text-sm select-none">
                    ft
                  </span>

                  <input
                    type="text"
                    inputMode="decimal"
                    className={[
                      "w-full p-2 pr-10 border rounded bg-white",
                      invalid
                        ? "border-red-500 focus:outline-none focus:ring-2 focus:ring-red-400"
                        : "border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400",
                    ].join(" ")}
                    value={val}
                    onChange={handleDecimalInput("hanger_arm_height_above_canopy")}
                    onKeyDown={blockBadDecimalKeys}
                    onPaste={blockBadDecimalPaste}
                    onBlur={markTouched("hanger_arm_height_above_canopy")}
                    // Or auto-correct into range:
                    // onBlur={clampHangerHeightOnBlur}
                    aria-invalid={invalid || undefined}
                    aria-describedby={invalid ? "hangerarm-height-error" : undefined}
                    placeholder={`____`}
                  />

                  {invalid && (
                    <p id="hangerarm-height-error" className="mt-1 text-xs text-red-600">
                      {msg}
                    </p>
                  )}
                </div>
              );
            })()}
          </div>
        </div>
        {/*END : Hanger Arm Height*/}

        {/* Canopy Install Height */}
        <div
          className="absolute z-10 focus-within:z-[9999] pointer-events-auto"
          style={{ bottom: "16%", right: "4%", width: "10%" }}
        >
          <div className="flex flex-col gap-2 relative">
            <LabelWithDialog label="Canopy Install Height" message="Please enter the value." />

            {(() => {
              const val = form.canopy_installation_height ?? "";
              const hasTouched = touched.canopy_installation_height ?? false;

              const meanRoofVal = form.mean_roof_height;
              const hangerVal = form.hanger_arm_height_above_canopy;

              const isMeanRoofValid = meanRoofVal !== "" && !isNaN(Number(meanRoofVal));
              // Comparison: (Install + Hanger) <= MeanRoof
              // Treat hanger as 0 if missing/invalid for this specific check, or require it? 
              // Let's treat missing hanger as 0 for the check to avoid blocking if hanger isn't filled yet.
              // Actually, user said: canopy_install_height + hangar arm height <= mean roof height

              const hangerNum = (hangerVal !== "" && !isNaN(Number(hangerVal))) ? Number(hangerVal) : 0;
              const totalHeight = Number(val) + hangerNum;

              const isTooHigh = isDecimalNumber(val) && isMeanRoofValid && totalHeight > Number(meanRoofVal);

              const invalid = hasTouched && (!inRangeInstall(val) || isTooHigh);
              const msg =
                !hasTouched ? "" :
                  !isDecimalNumber(val) ? "Please enter a number." :
                    !inRangeInstall(val) ? `Must be between ${MIN_INSTALL} and ${MAX_INSTALL} ft.` :
                      isTooHigh ? `Install + Hanger must be ≤ Mean Roof (${meanRoofVal} ft).` : "";

              return (
                <div>
                  {/* visual unit (not part of value) */}
                  <span className="pointer-events-none absolute right-3 top-[5.5rem] -translate-y-1/2 text-gray-600 text-sm select-none">
                    ft
                  </span>

                  <input
                    type="text"
                    inputMode="decimal"
                    className={[
                      "w-full p-2 pr-10 border rounded bg-white",
                      invalid
                        ? "border-red-500 focus:outline-none focus:ring-2 focus:ring-red-400"
                        : "border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400",
                    ].join(" ")}
                    value={val}
                    onChange={handleDecimalInput("canopy_installation_height")}
                    onKeyDown={blockBadDecimalKeys}
                    onPaste={blockBadDecimalPaste}
                    onBlur={markTouched("canopy_installation_height")}
                    aria-invalid={invalid || undefined}
                    aria-describedby={invalid ? "canopy-install-error" : undefined}
                    placeholder={`____`}
                  />

                  {invalid && (
                    <p id="canopy-install-error" className="mt-1 text-xs text-red-600">
                      {msg}
                    </p>
                  )}
                </div>
              );
            })()}
          </div>
        </div>
        {/*END : Canopy Install Height*/}

        {/* Canopy Projection field ON the image (right side) */}
        <div
          className="absolute z-10 focus-within:z-[9999] pointer-events-auto"
          style={{ top: "60%", left: "0%", width: "10%" }}
        >
          <div className="flex flex-col gap-2">
            <LabelWithDialog label="Canopy Projection" message="Please enter the value." />
            {/* visual unit (not part of value) */}
            <span className="pointer-events-none absolute right-3 top-[4rem] -translate-y-1/2 text-gray-600 text-sm select-none">
              ft
            </span>
            <input
              type="text"
              className="w-full p-2 border border-gray-300 rounded bg-gray-200"
              value={form.canopy_total_x_width_projection}
              readOnly
              onChange={handleInput("canopy_total_x_width_projection")}
              placeholder="____"
            />
          </div>
        </div>
        {/*END : Canopy Projection field ON the image (right side)*/}

        {/* HangerArm Edge distance */}
        <div
          className="absolute z-10 focus-within:z-[9999] pointer-events-auto"
          style={{ top: "0%", left: "0%", width: "10%" }}
        >
          <div className="flex flex-col gap-2 relative">
            <LabelWithDialog
              label="HangerArm to front edge distance"
              message="Please enter the value."
            />

            {(() => {
              const val = form.hanger_arm_attachment_distance_from_canopy_edge ?? "";
              const hasTouched = touched.hanger_arm_attachment_distance_from_canopy_edge ?? false;
              const invalid = hasTouched && !inRangeHangerEdge(val);
              const msg =
                !hasTouched ? "" :
                  !isDecimalNumber(val) ? "Please enter a number." :
                    !inRangeHangerEdge(val) ? `Must be between ${MIN_HANGER_EDGE} and ${MAX_HANGER_EDGE} ft.` : "";

              return (
                <div>
                  {/* visual unit (not part of value) */}
                  <span className="pointer-events-none absolute right-3 top-[6.5rem] -translate-y-1/2 text-gray-600 text-sm select-none">
                    ft
                  </span>

                  <input
                    type="text"
                    inputMode="decimal"
                    className={[
                      "w-full p-2 pr-10 border rounded bg-white",
                      invalid
                        ? "border-red-500 focus:outline-none focus:ring-2 focus:ring-red-400"
                        : "border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400",
                    ].join(" ")}
                    value={val}
                    onChange={handleDecimalInput("hanger_arm_attachment_distance_from_canopy_edge")}
                    onKeyDown={blockBadDecimalKeys}
                    onPaste={blockBadDecimalPaste}
                    onBlur={markTouched("hanger_arm_attachment_distance_from_canopy_edge")}
                    // or auto-correct:
                    // onBlur={clampHangerEdgeOnBlur}
                    aria-invalid={invalid || undefined}
                    aria-describedby={invalid ? "hangeredge-error" : undefined}
                    placeholder={`____`}
                  />

                  {invalid && (
                    <p id="hangeredge-error" className="mt-1 text-xs text-red-600">
                      {msg}
                    </p>
                  )}
                </div>
              );
            })()}
          </div>
        </div>
        {/*END : HangerArm Edge distance*/}
      </div>
      {/* --- End Image + overlay (desktop/tablet) --- */}

      {/* --- Mobile fallback for diagram2 --- */}
      <div className="sm:hidden">
        <img
          src={diagram2}
          alt="Canopy layout"
          className="w-full h-auto rounded-md border border-gray-200 shadow-sm mb-3"
        />

        {/* Mean Roof Height */}
        <div className="flex flex-col gap-2 mb-3 w-full relative">
          <LabelWithDialog label="Mean Roof Height" message="Please enter the value." />
          {(() => {
            const val = form.mean_roof_height ?? "";
            const hasTouched = touched.mean_roof_height ?? false;
            const isNumber = val !== "" && !isNaN(Number(val));

            const installVal = form.canopy_installation_height;
            const hangerVal = form.hanger_arm_height_above_canopy;

            const isInstallValid = installVal !== "" && !isNaN(Number(installVal));
            const isHangerValid = hangerVal !== "" && !isNaN(Number(hangerVal));

            const combinedHeight = (Number(installVal) || 0) + (Number(hangerVal) || 0);

            const checkComparison = isNumber && (isInstallValid || isHangerValid);
            const isTooLow = checkComparison && Number(val) < combinedHeight;

            const invalid = hasTouched && (!(isNumber && inRangeMeanRoof(val)) || isTooLow);
            const msg =
              !hasTouched ? "" :
                !isNumber ? "Please enter a number." :
                  !inRangeMeanRoof(val) ? `Must be between ${MIN_MEAN_ROOF} and ${MAX_MEAN_ROOF} ft.` :
                    isTooLow ? `Must be ≥ Install Ht + Hanger Arm (${combinedHeight} ft).` : "";

            return (
              <div>
                <span className="pointer-events-none absolute right-3 top-[3.2rem] -translate-y-1/2 text-gray-600 text-sm select-none">ft</span>
                <input
                  type="text"
                  inputMode="decimal"
                  className={[
                    "w-full p-2 pr-10 border rounded bg-white",
                    invalid ? "border-red-500 focus:outline-none focus:ring-2 focus:ring-red-400"
                      : "border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400",
                  ].join(" ")}
                  value={val}
                  onChange={handleDecimalInput("mean_roof_height")}
                  onKeyDown={blockBadDecimalKeys}
                  onPaste={blockBadDecimalPaste}
                  onBlur={markTouched("mean_roof_height")}
                  aria-invalid={invalid || undefined}
                  aria-describedby={invalid ? "m2-meanroof-error" : undefined}
                  placeholder={`Enter the value between ${MIN_MEAN_ROOF} and ${MAX_MEAN_ROOF}`}
                />
                {invalid && <p id="m2-meanroof-error" className="mt-1 text-xs text-red-600">{msg}</p>}
              </div>
            );
          })()}
        </div>

        {/*Upper roof length*/}
        <Dropdown
          label="Upper roof length"
          message="Select estimated upper roof length."
          options={{ Unsure: "0", "25 ft": "25", "50 ft": "50", "75 ft": "75", "100 ft": "100", "150 ft": "150", "200 ft": "200", "500 ft": "500", "1000 ft": "1000" }}
          value={form.upper_roof_length}
          onChange={setField("upper_roof_length")}
        />
        {/*End Upper roof lengthn */}

        {/* HangerArm Height */}
        <div className="flex flex-col gap-2 mb-3 w-full relative">
          <LabelWithDialog label="HangerArm Height" message="Please enter the value." />
          {(() => {
            const val = form.hanger_arm_height_above_canopy ?? "";
            const hasTouched = touched.hanger_arm_height_above_canopy ?? false;
            const isNumber = val !== "" && !isNaN(Number(val));

            const meanRoofVal = form.mean_roof_height;
            const installVal = form.canopy_installation_height;

            const isMeanRoofValid = meanRoofVal !== "" && !isNaN(Number(meanRoofVal));
            const isInstallValid = installVal !== "" && !isNaN(Number(installVal));

            const totalHeight = (Number(installVal) || 0) + Number(val);
            const isTooHigh = isNumber && isMeanRoofValid && isInstallValid && totalHeight > Number(meanRoofVal);

            const invalid = hasTouched && (!(isNumber && inRangeHangerHeight(val)) || isTooHigh);
            const msg =
              !hasTouched ? "" :
                !isNumber ? "Please enter a number." :
                  !inRangeHangerHeight(val) ? `Must be between ${MIN_HANGER_HEIGHT} and ${MAX_HANGER_HEIGHT} ft.` :
                    isTooHigh ? `Install + Hanger must be ≤ Mean Roof (${meanRoofVal} ft).` : "";

            return (
              <div>
                <span className="pointer-events-none absolute right-3 top-[3.2rem] -translate-y-1/2 text-gray-600 text-sm select-none">ft</span>
                <input
                  type="text"
                  inputMode="decimal"
                  className={[
                    "w-full p-2 pr-10 border rounded bg-white",
                    invalid ? "border-red-500 focus:outline-none focus:ring-2 focus:ring-red-400"
                      : "border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400",
                  ].join(" ")}
                  value={val}
                  onChange={handleDecimalInput("hanger_arm_height_above_canopy")}
                  onKeyDown={blockBadDecimalKeys}
                  onPaste={blockBadDecimalPaste}
                  onBlur={markTouched("hanger_arm_height_above_canopy")}
                  aria-invalid={invalid || undefined}
                  aria-describedby={invalid ? "m2-hangerarm-height-error" : undefined}
                  placeholder={`Enter value between ${MIN_HANGER_HEIGHT} and ${MAX_HANGER_HEIGHT}`}
                />
                {invalid && <p id="m2-hangerarm-height-error" className="mt-1 text-xs text-red-600">{msg}</p>}
              </div>
            );
          })()}
        </div>

        {/* Canopy Install Height */}
        <div className="flex flex-col gap-2 mb-3 w-full relative">
          <LabelWithDialog label="Canopy Install Height" message="Please enter the value." />
          {(() => {
            const val = form.canopy_installation_height ?? "";
            const hasTouched = touched.canopy_installation_height ?? false;

            const meanRoofVal = form.mean_roof_height;
            const hangerVal = form.hanger_arm_height_above_canopy;

            const isMeanRoofValid = meanRoofVal !== "" && !isNaN(Number(meanRoofVal));

            const hangerNum = (hangerVal !== "" && !isNaN(Number(hangerVal))) ? Number(hangerVal) : 0;
            const totalHeight = Number(val) + hangerNum;

            const isTooHigh = isDecimalNumber(val) && isMeanRoofValid && totalHeight > Number(meanRoofVal);

            const invalid = hasTouched && (!inRangeInstall(val) || isTooHigh);
            const msg =
              !hasTouched ? "" :
                !isDecimalNumber(val) ? "Please enter a number." :
                  !inRangeInstall(val) ? `Must be between ${MIN_INSTALL} and ${MAX_INSTALL} ft.` :
                    isTooHigh ? `Install + Hanger must be ≤ Mean Roof (${meanRoofVal} ft).` : "";

            return (
              <div>
                <span className="pointer-events-none absolute right-3 top-[3.2rem] -translate-y-1/2 text-gray-600 text-sm select-none">ft</span>
                <input
                  type="text"
                  inputMode="decimal"
                  className={[
                    "w-full p-2 pr-10 border rounded bg-white",
                    invalid ? "border-red-500 focus:outline-none focus:ring-2 focus:ring-red-400"
                      : "border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400",
                  ].join(" ")}
                  value={val}
                  onChange={handleDecimalInput("canopy_installation_height")}
                  onKeyDown={blockBadDecimalKeys}
                  onPaste={blockBadDecimalPaste}
                  onBlur={markTouched("canopy_installation_height")}
                  aria-invalid={invalid || undefined}
                  aria-describedby={invalid ? "m2-canopy-install-error" : undefined}
                  placeholder={`Enter value between ${MIN_INSTALL} and ${MAX_INSTALL}`}
                />
                {invalid && <p id="m2-canopy-install-error" className="mt-1 text-xs text-red-600">{msg}</p>}
              </div>
            );
          })()}
        </div>

        {/* Canopy Projection (read-only) */}
        <div className="flex flex-col gap-2 mb-3 w-full relative">
          <LabelWithDialog label="Canopy Projection" message="Calculated value." />
          <span className="pointer-events-none absolute right-3 top-[3.2rem] -translate-y-1/2 text-gray-600 text-sm select-none">ft</span>
          <input
            type="text"
            className="w-full p-2 pr-10 border rounded bg-gray-200"
            value={form.canopy_total_x_width_projection}
            readOnly
            placeholder=""
          />
        </div>

        {/* HangerArm to front edge distance */}
        <div className="flex flex-col gap-2 mb-3 w-full relative">
          <LabelWithDialog
            label="HangerArm to front edge distance"
            message="Please enter the value."
          />
          {(() => {
            const val = form.hanger_arm_attachment_distance_from_canopy_edge ?? "";
            const hasTouched = touched.hanger_arm_attachment_distance_from_canopy_edge ?? false;
            const invalid = hasTouched && !inRangeHangerEdge(val);
            const msg =
              !hasTouched ? "" :
                !isDecimalNumber(val) ? "Please enter a number." :
                  !inRangeHangerEdge(val) ? `Must be between ${MIN_HANGER_EDGE} and ${MAX_HANGER_EDGE} ft.` : "";

            return (
              <div>
                <span className="pointer-events-none absolute right-3 top-[3.2rem] -translate-y-1/2 text-gray-600 text-sm select-none">ft</span>
                <input
                  type="text"
                  inputMode="decimal"
                  className={[
                    "w-full p-2 pr-10 border rounded bg-white",
                    invalid ? "border-red-500 focus:outline-none focus:ring-2 focus:ring-red-400"
                      : "border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400",
                  ].join(" ")}
                  value={val}
                  onChange={handleDecimalInput("hanger_arm_attachment_distance_from_canopy_edge")}
                  onKeyDown={blockBadDecimalKeys}
                  onPaste={blockBadDecimalPaste}
                  onBlur={markTouched("hanger_arm_attachment_distance_from_canopy_edge")}
                  aria-invalid={invalid || undefined}
                  aria-describedby={invalid ? "m2-hangeredge-error" : undefined}
                  placeholder={`Enter value between ${MIN_HANGER_EDGE} and ${MAX_HANGER_EDGE}`}
                />
                {invalid && <p id="m2-hangeredge-error" className="mt-1 text-xs text-red-600">{msg}</p>}
              </div>
            );
          })()}
        </div>
      </div>
      {/* --- End mobile fallback for diagram2 --- */}

      {/* Keep these below the image (they’re not “callouts”): */}
      <Dropdown
        label="Corner Canopy Condition"
        message="Select the corner canopy condition."
        options={["TRUE", "FALSE"]}
        value={form.corner_canopy_condition}
        onChange={setField("corner_canopy_condition")}
      />

      {/* Corner canopy condition value - Conditionally show this field with animation */}
      <AnimatePresence initial={false}>
        {String(form.corner_canopy_condition).toLowerCase() === "true" && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="mb-3 overflow-visible"
          >
            {/* <Dropdown
                label="Which Front Gutter Beam Supports Decking?"
                message="Select the option."
                options={["Canopy Length L1", "Canopy Length L2", "Neither (Decking Meets At The Corner)"]}
                value={form.if_no_diagonal_strut_which_front_gutterbeam_supp_decking}
                onChange={setField("if_no_diagonal_strut_which_front_gutterbeam_supp_decking")}
              /> */}
            <div className="relative w-full max-w-5xl mx-auto hidden sm:block overflow-visible mb-12">
              <img
                src={selectedDiagram}
                alt="Canopy layout"
                className="w-full h-auto"
              />
              <DotLine className="z-0" x="51.5%" y="10%" angle={89.5} length="32%" />
              <div
                className="absolute pointer-events-auto overflow-visible z-[10] focus-within:z-[2000]"
                style={{ top: "4%", right: "16%", width: "48%", overflow: "visible" }}
              >
                <DropdownOnImage
                  label="Diagonal Strut?"
                  message="Select exists or not."
                  options={["TRUE", "FALSE"]}
                  value={form.diagonal_strut_condition}
                  onChange={setField("diagonal_strut_condition")}
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      {/* End Corner canopy condition value */}

      {/* NoofScrewsForRE2BValue - Hidden*/}
      <div className="hidden flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4 mb-3 w-full">
        <LabelWithDialog
          label="# Screws for Roof Element to Beam"
          message="Auto-selected based on roofing style: Deck Pan → 2, Foam Panel → 3, Other → 5."
        />

        <div className="w-full sm:w-1/2">
          <div className="p-2 border rounded bg-gray-200 text-gray-800">
            {form.numof_screws_for_roof_element_to_beam || '—'}
          </div>

          {/* keep a hidden input if any downstream logic queries inputs */}
          <input
            type="hidden"
            name="numof_screws_for_roof_element_to_beam"
            value={form.numof_screws_for_roof_element_to_beam || ''}
            readOnly
          />
        </div>
      </div>
      {/* End NoofScrewsForRE2BValue */}

      {/* --- Mobile fallback: stack under the image --- */}
      <div className="sm:hidden w-full">

        <AnimatePresence initial={false}>
          {String(form.corner_canopy_condition).toLowerCase() === "true" && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="mb-3 overflow-visible"
            >

              <img
                src={
                  /^(true|1|yes)$/i.test(String(form.diagonal_strut_condition ?? ''))
                    ? diagram3        // show when TRUE
                    : diagram3_3      // show when FALSE
                }
                alt="Canopy layout"
                className="w-full h-auto rounded-md border border-gray-200 shadow-sm mb-3"
              />

              <Dropdown
                label="Diagonal Strut?"
                message="Select exists or not."
                options={["TRUE", "FALSE"]}
                value={form.diagonal_strut_condition}
                onChange={setField("diagonal_strut_condition")}
              />
            </motion.div>
          )}
        </AnimatePresence>

      </div>
      {/**End of mobile fallback for corner canopy condition */}

      <hr />

      {/**End: Roofing component & design */}

      {/* MountingPlate Input Area */}

      <h2 className="font-semibold text-lg text-center mb-4">Connection To Host Design</h2>
      <div className="relative w-full max-w-5xl mx-auto hidden sm:block overflow-visible">
        <img
          src={
            // Normalize: remove spaces, then test for parallel or perpendicular marks
            /(\|\||∥)/.test(String(form.roof_element_direction ?? "").replace(/\s/g, ""))
              ? diagram4_4      // parallel: "||" (with or without spaces) or "∥"
              : diagram4    // perpendicular: anything else (incl. "⊥" / "Ʇ")
          }
          alt="Canopy layout"
          className="w-full h-auto" // add border here to see image positioning
        />
        <DotLine x="24%" y="22%" angle={1.8} length="44%" /> {/** Host Material line */}
        <DotLine x="24%" y="8%" angle={6} length="62%" /> {/** Mounting plate item name line */}
        <DotLine x="24%" y="86%" angle={355} length="64%" /> {/** Bottom Anchor connection line */}
        <DotLine x="24%" y="37%" angle={354} length="67%" /> {/** Top Wall plate connection type line */}
        {/**Inputs on the image */}
        {/**Host Material */}
        <div
          className="absolute pointer-events-auto overflow-visible z-[10] focus-within:z-[2000]"
          style={{ top: "15%", left: "0%", width: "48%", overflow: "visible" }}
        >
          <DropdownOnImage
            label="Host Material"
            message="Select the material of the structure to which the canopy will be attached."
            options={["Wood", "Concrete", "Steel", "ASTM C90 Grout-Filled CMU Block (GFB)", "ASTM C90 Hollow Block", "Aluminum"]}
            value={form.host_material}
            onChange={setField("host_material")}
          />
        </div>
        {/**End: Host Material */}

        {/**Mounting plate dropdown */}
        <div
          className="absolute pointer-events-auto overflow-visible z-[15] focus-within:z-[2000]"
          style={{ top: "0%", left: "0%", width: "48%", overflow: "visible" }}
        >
          <AsyncDropdownImage
            label="Mounting Plate Item Name"
            message="Select the Mounting plate item name."
            value={form.client_top_wall_plate_options}
            onChange={setField("client_top_wall_plate_options")}
            endpoint={apiUrl("wp-json/canopydb/mountingplateItemNamebycm/", {
              client: "Eastern Metal Supply",
              manufacturer: "Eastern Metal Supply",
              //nocache: Date.now(),
            })}
          />
        </div>
        {/**End: MountingPlate dropdown */}

        {/**Top Wall Plate Anchor Type dropdown */}
        <div
          className="absolute pointer-events-auto overflow-visible z-[10] focus-within:z-[2000]"
          style={{ top: "30%", left: "0%", width: "48%", overflow: "visible" }}
        >
          <DropdownOnImage
            label="Top Wall Plate Anchor Type"
            message="Direct Connection means the bracket is anchored straight into the wall.
                       Thru-Bolt means bolts go completely through the wall with nuts on the other side."
            options={{ "Screw or Wedge anchor": "Direct Connection", "Thru-Bolt": "Thru-Bolt" }}
            value={form.top_wall_plate_anchor_type_dc_or_tb}
            onChange={setField("top_wall_plate_anchor_type_dc_or_tb")}
          />
        </div>
        {/**End : Top Wall Plate Anchor Type dropdown  */}

        {/**Top Wall Plate: Anchor Diameter Selection dropdown */}
        <div
          className="absolute pointer-events-auto overflow-visible z-[10] focus-within:z-[2000]"
          style={{ top: "45%", left: "0%", width: "48%", overflow: "visible" }}
        >
          <DropdownOnImage
            label="Top Wall Plate: Anchor Diameter "
            message="Select the option."
            options={['1/4"', '3/8"', '1/2"']}
            value={form.top_wall_plate_anchor_dia_selection}
            onChange={setField("top_wall_plate_anchor_dia_selection")}
          />
        </div>
        {/**End: Top Wall Plate: Anchor Diameter Selection dropdown */}

        {/** Bottom Anchor connection type */}
        <div
          className="absolute pointer-events-auto overflow-visible z-[10] focus-within:z-[2000]"
          style={{ top: "62%", left: "0%", width: "48%", overflow: "visible" }}
        >
          <DropdownOnImage
            label="Bottom Anchor connection type"
            message="Select the option."
            options={{ "Screw or Wedge anchor": "Direct Connection", "Thru-Bolt": "Thru-Bolt" }}
            value={form.bottom_anchor_connection_dc_or_tb}
            onChange={setField("bottom_anchor_connection_dc_or_tb")}
          />
        </div>
        {/**End: Bottom Anchor connection type */}

        {/**Bottom Anchor connection */}
        <div
          className="absolute pointer-events-auto overflow-visible z-[10] focus-within:z-[2000]"
          style={{ top: "80%", left: "0%", width: "48%", overflow: "visible" }}
        >
          <DropdownOnImage
            label="Bottom Anchor connection"
            message="Anchors At Plate Only = Bolts only where the bracket sits.
                       Continuous Anchors Along Ledger = Bolts all the way along the support board for stronger hold."
            options={["Anchors At Plate Only", "Continuous Anchors Along Ledger"]}
            value={form.bottom_anchor_connection}
            onChange={setField("bottom_anchor_connection")}
          />
        </div>
        {/**End : Bottom Anchor connection */}

        {/** Bottom Anchor Diameter Selection*/}
        <div
          className="absolute pointer-events-auto overflow-visible z-[10] focus-within:z-[2000]"
          style={{ top: "93%", left: "0%", width: "48%", overflow: "visible" }}
        >
          <DropdownOnImage
            label="Bottom Anchor Diameter Selection"
            message="Select the option."
            options={['1/4"', '3/8"', '1/2"']}
            value={form.bottom_anchor_dia_selection}
            onChange={setField("bottom_anchor_dia_selection")}
          />
        </div>
        {/** End: Bottom Anchor Diameter Selection */}
      </div>

      {/** Fall back for Connection to Host design image4 */}
      <div className="sm:hidden">
        <img
          src={
            // Normalize: remove spaces, then test for parallel or perpendicular marks
            /(\|\||∥)/.test(String(form.roof_element_direction ?? "").replace(/\s/g, ""))
              ? diagram4_4      // parallel: "||" (with or without spaces) or "∥"
              : diagram4    // perpendicular: anything else (incl. "⊥" / "Ʇ")
          }
          alt="Canopy layout"
          className="w-full h-auto rounded-md border border-gray-200 shadow-sm mb-3"
        />
        {/*Host Material*/}
        <Dropdown
          label="Host Material"
          message="Select the material of the structure to which the canopy will be attached."
          options={["Wood", "Concrete", "Steel", "ASTM C90 Grout-Filled CMU Block (GFB)", "ASTM C90 Hollow Block", "Aluminum"]}
          value={form.host_material}
          onChange={setField("host_material")}
        />
        {/*End : Host Material*/}

        {/*Mounting Plate Item Name*/}
        <AsyncDropdown
          label="Mounting Plate Item Name"
          message="Select the Mounting plate item name."
          value={form.client_top_wall_plate_options}
          onChange={setField("client_top_wall_plate_options")}
          endpoint={apiUrl("wp-json/canopydb/mountingplateItemNamebycm/", {
            client: "Eastern Metal Supply",
            manufacturer: "Eastern Metal Supply",
            //nocache: Date.now(),
          })}
        />
        {/*End : Mounting Plate Item Name*/}

        {/*Top Wall Plate Anchor Type*/}
        <Dropdown
          label="Top Wall Plate Anchor Type"
          message="Direct Connection means the bracket is anchored straight into the wall.
                       Thru-Bolt means bolts go completely through the wall with nuts on the other side."
          options={{ "Screw or Wedge anchor": "Direct Connection", "Thru-Bolt": "Thru-Bolt" }}
          value={form.top_wall_plate_anchor_type_dc_or_tb}
          onChange={setField("top_wall_plate_anchor_type_dc_or_tb")}
        />
        {/*End : Top Wall Plate Anchor Type*/}

        {/*Top Wall Plate: Anchor Diameter Selection*/}
        <Dropdown
          label="Top Wall Plate: Anchor Diameter Selection"
          message="Select the option."
          options={['1/4"', '3/8"', '1/2"']}
          value={form.top_wall_plate_anchor_dia_selection}
          onChange={setField("top_wall_plate_anchor_dia_selection")}
        />
        {/*End : Top Wall Plate: Anchor Diameter Selection*/}

        {/*Bottom Anchor connection type*/}
        <Dropdown
          label="Bottom Anchor connection type"
          message="Select the option."
          options={{ "Screw or Wedge anchor": "Direct Connection", "Thru-Bolt": "Thru-Bolt" }}
          value={form.bottom_anchor_connection_dc_or_tb}
          onChange={setField("bottom_anchor_connection_dc_or_tb")}
        />
        {/*End : Bottom Anchor connection type*/}

        {/*Bottom Anchor connection*/}
        <Dropdown
          label="Bottom Anchor connection"
          message="Select the option."
          options={["Continuous Anchors Along Ledger", "Anchors At Plate Only"]}
          value={form.bottom_anchor_connection}
          onChange={setField("bottom_anchor_connection")}
        />
        {/*End : Bottom Anchor connection*/}

        {/*Bottom Anchor Diameter Selection */}
        <Dropdown
          label="Bottom Anchor Diameter Selection"
          message="Select the option."
          options={['1/4"', '3/8"', '1/2"']}
          value={form.bottom_anchor_dia_selection}
          onChange={setField("bottom_anchor_dia_selection")}
        />
        {/*End : Bottom Anchor Diameter Selection */}
      </div>

      {/**End: Fall back for Connection to Host design image4 */}

      {/* Buttons row */}
      <div className="flex justify-center items-start gap-3 flex-wrap">
        {/* Calculate Button */}
        <EnhancedCalculateButton
          form={form}
          requiredFields={REQUIRED_FIELDS}
          loading={loading}
          onCalculate={handleCalculate}
          wpEmail={window.WP_USER_EMAIL}
        />

        {/* Save Quote Button (visible only when Calculate is enabled) */}
        {!calcDisabled && (
          <div>
            <SaveQuoteButton
              form={form}
              disabled={calcDisabled}            // optional: also disable while calculating
              wpEmail={window.WP_USER_EMAIL} // optional, if you have it
            />

            <SendProjectButton
              form={form}
              disabled={calcDisabled}
              wpEmail={window.WP_USER_EMAIL}
            />
          </div>
        )}
      </div>
      {/**End buttons row */}
    </div>
  );
}
