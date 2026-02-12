import { useMemo, useState, useRef, useEffect } from "react";
import { Listbox } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import LabelWithDialog from "./LabelWithDialog";

// /** Tooltip label — click to toggle */
// const LabelWithDialog = ({ label, message }) => {
//   const [show, setShow] = useState(false);
//   const tooltipRef = useRef(null);
//   const isTouchDevice =
//     typeof window !== "undefined" &&
//     ("ontouchstart" in window ||
//       navigator.maxTouchPoints > 0 ||
//       navigator.msMaxTouchPoints > 0);

//   useEffect(() => {
//     const handleClickOutside = (e) => {
//       if (tooltipRef.current && !tooltipRef.current.contains(e.target)) setShow(false);
//     };
//     const root = document.getElementById("canopy-calculator-host")?.shadowRoot || document;
//     root.addEventListener("click", handleClickOutside);
//     return () => root.removeEventListener("click", handleClickOutside);
//   }, []);

//   return (
//     <div
//       ref={tooltipRef}
//       className={`relative w-full sm:w-1/2 flex items-start gap-1 ${
//         isTouchDevice ? "cursor-pointer" : "cursor-help"
//       }`}
//       onClick={() => setShow((prev) => !prev)}
//     >
//       <label className="text-sm whitespace-normal break-words leading-snug font-normal">
//         {label}
//       </label>
//       <span className=" w-3 h-3 min-w-[1rem] min-h-[1rem] text-xs bg-white text-black border border-gray-400 rounded-full flex items-center justify-center font-bold leading-none mt-0.5 shrink-0">
//         i
//       </span>
//       {show && (
//         <div className="absolute top-full left-0 mt-1 z-10 w-64 text-xs p-2 rounded shadow bg-black text-white">
//           {message}
//         </div>
//       )}
//     </div>
//   );
// };


/** Normalize options → [{label, value}] */
function normalizeOptions(options) {
  if (Array.isArray(options)) {
    if (options.length && typeof options[0] === "object") {
      return options.map(o => ({ label: String(o.label), value: String(o.value) }));
    }
    return options.map(o => ({ label: String(o), value: String(o) }));
  }
  if (options && typeof options === "object") {
    return Object.entries(options).map(([label, value]) => ({
      label: String(label),
      value: String(value),
    }));
  }
  return [];
}

const Dropdown = ({
  label,
  message,
  options,
  value,                 // stored value
  onChange,              // called with stored value
  placeholder = "Please select",
  disabled = false,
}) => {
  const items = useMemo(() => normalizeOptions(options), [options]);
  const selected = useMemo(
    () => items.find(it => String(it.value) === String(value)) || null,
    [items, value]
  );

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4 mb-3 w-full">
      <LabelWithDialog label={label} message={message} />

      <div className="relative w-full sm:w-1/2 ">
        <Listbox
          as="div"
          value={selected ? selected.value : ""}
          onChange={(val) => onChange?.(val)}
          disabled={disabled}
        >
          {({ open }) => (
            <div>
              <Listbox.Button className={`w-full border border-gray-300 rounded-md p-2 bg-white text-left cursor-pointer text-sm h-[40px] flex items-center ${disabled ? "opacity-60 cursor-not-allowed" : ""}`}>
                <span className="flex-grow">
                  {selected?.label || placeholder}
                </span>
                <span className="ml-2 pointer-events-none">
                  <ChevronDownIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                </span>
              </Listbox.Button>

              {open && !disabled && items.length > 0 && (
                <Listbox.Options
                  as="div"
                  className="absolute mt-1 w-full border border-gray-300 rounded-md bg-white shadow-lg z-[20] max-h-[160px] overflow-auto overscroll-contain"
                >
                  {items.map((it) => (
                    <Listbox.Option
                      key={`${it.label}::${it.value}`}
                      value={it.value}
                      as="div"
                      className={({ active }) =>
                        `cursor-pointer px-4 py-2 ${active ? "bg-gray-300 text-black" : "text-gray-900"}`
                      }
                    >
                      <span className="block">{it.label}</span>
                    </Listbox.Option>
                  ))}
                </Listbox.Options>
              )}
            </div>
          )}
        </Listbox>
      </div>
    </div>
  );
};

export default Dropdown;
