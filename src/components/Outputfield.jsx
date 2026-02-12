export default function Outputfield({
  componentHeading,
  componentName,      // string (e.g., form.hangerArmItemName)
  designText,         // string from API, e.g. "57%"
  deflectionText,     // string from API, e.g. "75%"
  showDeflection = true, // <— NEW: toggle visibility
  className = "",
  style = {},
}) {
  const safe = (v) => (v == null || v === "" ? "--" : String(v));

  // robust % parser: accepts "57%", " 57 % ", 57, "57.3%", etc.
  const parsePercent = (v) => {
    if (v == null) return null;
    const s = String(v).trim();
    const m = s.match(/-?\d+(\.\d+)?/);
    if (!m) return null;
    const num = parseFloat(m[0]);
    return Number.isFinite(num) ? num : null;
  };

  const pctClass = (val) => {
    const n = parsePercent(val);
    if (n == null) return "";
    return n <= 100 ? "text-green-600" : "text-red-600";
  };

  return (
    <div
      className={`border border-black bg-white p-1 text-sm leading-tight ${className}`}
      style={style}
    >
      <div className="font-bold tracking-wide">{componentHeading}</div>
      <div className="font-semibold mt-2">{safe(componentName)}</div>

      <div>
        Design Capacity{" "}
        <span className={`font-semibold ${pctClass(designText)}`}>
          {safe(designText)}
        </span>
      </div>

      {showDeflection && (
        <div>
          Deflection Capacity{" "}
          <span className={`font-semibold ${pctClass(deflectionText)}`}>
            {safe(deflectionText)}
          </span>
        </div>
      )}
    </div>
  );
}
