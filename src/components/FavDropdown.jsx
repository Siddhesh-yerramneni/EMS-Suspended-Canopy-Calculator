// FavDropdown.jsx
import { useMemo, useState } from "react";
import { Listbox } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import clsx from "clsx";

function parsePercent(text) {
  if (!text) return null;
  const m = String(text).match(/-?\d+(\.\d+)?/);
  return m ? parseFloat(m[0]) : null;
}
function colorForPercent(text) {
  const n = parsePercent(text);
  if (n == null) return "text-black";
  return n > 100 ? "text-red-600" : "text-green-600";
}
// Split "Left - Right" at the LAST " - "
function splitLabelValue(text) {
  if (!text) return { left: "", right: "" };
  const sep = " - ";
  const i = text.lastIndexOf(sep);
  if (i === -1) return { left: text, right: "" };
  return { left: text.slice(0, i), right: text.slice(i + sep.length) };
}
const INVALID_VALUES = new Set(["#VALUE!", "#DIV/0!", "", "null", "NULL"]);

export default function FavDropdown({
  title = "Select",
  data = [],
  placeholder = "Check the options!",
}) {
  const options = useMemo(() => {
    const arr = Array.isArray(data) ? data : [];
    const combined = arr
      .map((row) => {
        const a = (row?.label1 ?? "").toString().trim();
        const b = (row?.value1 ?? "").toString().trim();
        if (INVALID_VALUES.has(b)) return null;  // omit invalid rights
        if (!b) return null;                     // require a right value
        return [a, b].filter(Boolean).join(" - ");
      })
      .filter(Boolean);
    // de-dupe, preserve order
    return Array.from(new Set(combined));
  }, [data]);

  // selected stays null by default; user can reselect the null option to keep it unset
  const [selected, setSelected] = useState(null);

  const renderValueSpan = (right) => (
    <span className={colorForPercent(right)}>{right}</span>
  );
  const renderLabelValue = (text) => {
    const { left, right } = splitLabelValue(text);
    return (
      <span className="text-black">
        {left}
        {right ? <>{" - "}{renderValueSpan(right)}</> : null}
      </span>
    );
  };

  // Build the list with a selectable "Please select" (null) at the top
  const displayOptions = useMemo(() => [null, ...options], [options]);

  return (
    <div className="w-full">
      <Listbox value={selected} onChange={setSelected}>
        {({ open }) => (
          <div className="w-full">
            <Listbox.Label className="block text-sm font-medium mb-1 text-black">
              {title}
            </Listbox.Label>

            <Listbox.Button className="w-full rounded-xl border border-gray-300 bg-white px-3 py-2 text-left shadow-sm focus:outline-none focus:ring-2 focus:ring-black/20 flex items-center justify-between">
              <span className="text-black">
                {selected === null ? placeholder : renderLabelValue(selected)}
              </span>
              <ChevronDownIcon className="h-5 w-5 shrink-0" />
            </Listbox.Button>

            <div className={clsx("overflow-hidden transition-all duration-200", open ? "max-h-64 mt-2" : "max-h-0")}>
              <Listbox.Options static className="w-full rounded-xl border border-gray-200 bg-white shadow-sm max-h-60 overflow-auto">
                {displayOptions.map((opt, idx) => (
                  <Listbox.Option
                    key={idx}
                    value={opt}
                    className={({ active, selected }) =>
                      clsx(
                        "cursor-pointer px-3 py-2 text-sm",
                        active && "bg-gray-100",
                        selected && "font-semibold",
                        "text-black"
                      )
                    }
                  >
                    {opt === null ? (
                      <span className="text-black">{placeholder}</span>
                    ) : (
                      renderLabelValue(opt)
                    )}
                  </Listbox.Option>
                ))}
              </Listbox.Options>
            </div>
          </div>
        )}
      </Listbox>
    </div>
  );
}
