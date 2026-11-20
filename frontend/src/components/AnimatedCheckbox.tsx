"use client";

import React from "react";

interface AnimatedCheckboxProps {
  checked: boolean;
  onChange?: () => void;
  id?: string;
  className?: string;
}

/**
 * Animated Checkbox component matching UIverse Tsiangana/tame-lionfish-36
 * with JurisNova Green-To-Heart styling and spring path draw animation.
 */
export default function AnimatedCheckbox({
  checked,
  onChange,
  id,
  className = "",
}: AnimatedCheckboxProps) {
  return (
    <div
      id={id}
      onClick={(e) => {
        e.stopPropagation();
        onChange?.();
      }}
      className={`lionfish-checkbox-wrap shrink-0 ${className}`}
      title={checked ? "Mark as Incomplete" : "Mark as Verified"}
    >
      <div className={`lionfish-checkbox ${checked ? "checked" : ""}`}>
        <svg
          viewBox="0 0 24 24"
          className="w-3.5 h-3.5"
          fill="none"
          stroke={checked ? "#07140F" : "currentColor"}
          strokeWidth="3.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="20 6 9 17 4 12" className="lionfish-path" />
        </svg>
      </div>
    </div>
  );
}
