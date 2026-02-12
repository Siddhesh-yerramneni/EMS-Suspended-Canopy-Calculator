export default function AnchorOutput({
  plateName,
  anchorCount,
  anchorName,
  hostMaterial,
  designText,   // e.g. "125%"
  statusText,   // e.g. "OK" / "NOT OK!"
  className = "",
  style = {},
}) {
  const safe = (v) => (v == null || v === "" ? "--" : String(v));

  // Find first "number%" token (handles "99%", "99.5%", "99 %")
  const percentTokenRegex = /-?\d+(?:\.\d+)?\s*%/;
  const tokenMatch = String(designText ?? "").match(percentTokenRegex);
  const token = tokenMatch ? tokenMatch[0] : null;

  // parse numeric part of the matched token
  const pct =
    token ? parseFloat(token.replace("%", "").trim()) : null;

  const colorClass =
    pct == null ? "" : pct > 100 ? "text-red-600" : "text-green-600";

  // Build the line with only the % token colored
  let before = designText || "--";
  let colored = null;
  let after = "";

  if (tokenMatch) {
    const idx = tokenMatch.index;
    before = (designText ?? "").slice(0, idx);
    colored = (designText ?? "").slice(idx, idx + token.length);
    after = (designText ?? "").slice(idx + token.length);
  }

  return (
    <div
      className={`border border-black bg-white p-2 text-sm leading-tight ${className}`}
      style={style}
    >
      <div className="tracking-wide font-semibold">
        {safe(plateName)} <span className="font-normal">With</span>
      </div>

      <div className="font-semibold">
        {safe(anchorCount)} {safe(anchorName)}{" "}
        <span className="font-normal">Anchors to</span>
      </div>

      <div className="font-semibold">
        {safe(hostMaterial)} <span className="font-normal">Considered</span>
      </div>

      <div className="mt-1 font-semibold">BOTTOM ANCHOR</div>

      <div className="font-semibold">
        Design Capacity{" "}
        {tokenMatch ? (
          <>
            {before}
            <span className={colorClass}>{colored}</span>
            {after}
          </>
        ) : (
          safe(designText)
        )}
        {statusText ? <> - {safe(statusText)}</> : null}
      </div>
    </div>
  );
}
