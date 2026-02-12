// Watermark.jsx
export default function Watermark({
  text = "ESTIMATING PURPOSES ONLY",
  angle = -30,            // degrees
  size = 48,              // px
  color = "#000000",
  opacity = 0.08,         // 0..1
  letterSpacing = "0.25em",

  // New positioning controls (string or number; e.g., "20%", 40)
  top,
  right,
  bottom,
  left,

  // Optional fine-tuning offsets applied after centering or edge position
  offsetX = 0,            // e.g., 12 or "10%"
  offsetY = 0,
}) {
  const anyEdge = top != null || right != null || bottom != null || left != null;

  const toCSS = (v) =>
    typeof v === "number" ? `${v}px` : v; // numbers become px, strings pass through (%, rem, etc.)

  const spanStyle = {
    position: "absolute",
    // If no edges provided, center it; otherwise respect the given edges.
    ...(anyEdge
      ? {
          top: top != null ? toCSS(top) : undefined,
          right: right != null ? toCSS(right) : undefined,
          bottom: bottom != null ? toCSS(bottom) : undefined,
          left: left != null ? toCSS(left) : undefined,
          // No translate(-50%, -50%) when using explicit edges
          transform: `translate(${toCSS(offsetX)}, ${toCSS(offsetY)}) rotate(${angle}deg)`,
        }
      : {
          top: "50%",
          left: "50%",
          transform: `translate(-50%, -50%) translate(${toCSS(offsetX)}, ${toCSS(offsetY)}) rotate(${angle}deg)`,
        }),
    fontSize: `${size}px`,
    color,
    opacity,
    letterSpacing,
    textTransform: "uppercase",
    whiteSpace: "nowrap",
  };

  return (
    <div
      aria-hidden
      className="pointer-events-none select-none absolute inset-0 overflow-hidden z-[206]"
      style={{ position: "absolute" }}
    >
      <span style={spanStyle}>{text}</span>
    </div>
  );
}
