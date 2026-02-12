// DotLine.jsx
import React from "react";

/**
 * x, y  : anchor position (0..1 or CSS length "30%", "120px").
 * angle : degrees (0 = right, 90 = down).
 * length: px number or CSS length ("14%", "160px").
 * dotAt : "end" | "start" | number 0..1 (where along the line the dot sits).
 * anchor: "tail" | "dot"  (which end x,y anchor to).
 */
export default function DotLine({
  x = 0.5,
  y = 0.5,
  angle = 0,
  length = 140,
  stroke = "black",
  strokeWidth = 1.25,
  dotSize = 8,
  dotAt = "end",
  anchor = "tail",
  className = "",
  style = {},
}) {
  const left = typeof x === "number" ? `${x * 100}%` : x;
  const top  = typeof y === "number" ? `${y * 100}%` : y;
  const w    = typeof length === "number" ? `${length}px` : length;

  const dotRatio =
    dotAt === "start" ? 0 :
    dotAt === "end"   ? 1 :
    Math.max(0, Math.min(1, Number(dotAt)));

  const h = Math.max(dotSize, strokeWidth * 4); // a thin box just tall enough

  const origin =
    anchor === "dot"
      ? (dotRatio === 0 ? "left center" : "right center")
      : "left center";

  return (
    <div
      className={`absolute pointer-events-none ${className}`}
      style={{
        left,
        top,
        width: w,
        height: h,
        transform: `translateY(-50%) rotate(${angle}deg)`,
        transformOrigin: origin,
        overflow: "visible",            // let the dot hang over the edge if needed
        ...style,
      }}
    >
      {/* the line */}
      <svg
        width="100%"
        height={strokeWidth}
        viewBox="0 0 100 1"
        preserveAspectRatio="none"
        style={{ position: "absolute", top: "50%", left: 0, transform: "translateY(-50%)" }}
      >
        <line x1="0" y1="0.5" x2="100" y2="0.5" stroke={stroke} strokeWidth={strokeWidth} />
      </svg>

      {/* the dot — always perfectly round */}
      <div
        style={{
          position: "absolute",
          left: `${dotRatio * 100}%`,
          top: "50%",
          width: dotSize,
          height: dotSize,
          borderRadius: 9999,
          background: stroke,
          transform: "translate(-50%, -50%)",
        }}
      />
    </div>
  );
}
