"use client";

import { useState } from "react";

export default function StarRating({ value = 0, onChange, readOnly = false, size = 22 }) {
  const [hover, setHover] = useState(0);
  const display = hover || value;

  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          disabled={readOnly}
          onMouseEnter={() => !readOnly && setHover(n)}
          onMouseLeave={() => !readOnly && setHover(0)}
          onClick={() => !readOnly && onChange?.(n)}
          className={`leading-none transition ${readOnly ? "cursor-default" : "cursor-pointer"}`}
          style={{ fontSize: size }}
          aria-label={`${n} star${n > 1 ? "s" : ""}`}
        >
          <span className={n <= display ? "text-emerald-400" : "text-white/15"}>★</span>
        </button>
      ))}
    </div>
  );
}
