import { Listbox } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import { useMemo, useState, useRef, useEffect } from "react";
import LabelWithDialog from "./LabelWithDialog";

/**
 * Normalize options into [{label, value}]
 * Supported inputs:
 *  - ["A", "B"]                        => [{label:"A", value:"A"}, ...]
 *  - [{label:"Unsure", value:"0"}]     => passthrough
 *  - { Unsure: "0", "25": "25", ... }  => map to array
 */
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

export default function DropdownOnImage({
  label,
  message,
  options,
  value,          // stored value (e.g., "0")
  onChange,       // called with stored value (e.g., "0")
  placeholder = "Please select",
  disabled = false,
  className = "",
}) {
  const items = useMemo(() => normalizeOptions(options), [options]);

  // Find the display label for the current stored value
  const selectedItem = useMemo(
    () => items.find(it => String(it.value) === String(value)) || null,
    [items, value]
  );

  return (
    <div className={`flex flex-col sm:flex-col items-start gap-2 ${className}`}>
      <LabelWithDialog label={label} message={message} />

      <div className="relative w-full sm:w-1/2">
        <Listbox
          value={selectedItem ? selectedItem.value : ""}
          onChange={(val) => onChange?.(val)}
          disabled={disabled}
        >
          {({ open }) => (
            <div>
              <Listbox.Button
                className={`w-full border border-gray-300 rounded-md p-2 bg-white text-left cursor-pointer text-sm h-[40px] flex items-center ${
                  disabled ? "opacity-60 cursor-not-allowed" : ""
                }`}
              >
                <span className="flex-grow">
                  {selectedItem?.label || placeholder}
                </span>
                <span className="ml-2 pointer-events-none">
                  <ChevronDownIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                </span>
              </Listbox.Button>

              {open && !disabled && items.length > 0 && (
                <Listbox.Options className="absolute mt-1 w-full border border-gray-300 rounded-md bg-white shadow-lg z-[20] max-h-[160px] overflow-auto overscroll-contain">
                  {items.map((it) => (
                    <Listbox.Option
                      key={`${it.label}::${it.value}`}
                      value={it.value}
                      className={({ active }) =>
                        `cursor-pointer px-4 py-2 ${
                          active ? "bg-gray-300 text-black" : "text-gray-900"
                        }`
                      }
                    >
                      {it.label}
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
}
