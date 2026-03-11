"use client";

import React, { useState, useRef, useEffect } from "react";
import { ChevronDown, LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface DropdownOption {
  label: string;
  value: string;
}

interface CustomDropdownProps {
  options: DropdownOption[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  icon?: LucideIcon;
  className?: string;
}

export default function CustomDropdown({
  options,
  value,
  onChange,
  placeholder = "Select option",
  icon: Icon,
  className,
}: CustomDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((opt) => opt.value === value);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className={cn("relative min-w-[150px]", className)} ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "w-full flex items-center gap-2 px-3 py-2 bg-transparent text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-xl transition-all border border-transparent focus:border-violet-100",
          isOpen && "bg-gray-50 border-violet-100 shadow-sm"
        )}
      >
        {Icon && <Icon className="w-4 h-4 text-gray-500 shrink-0" />}
        <span className="flex-1 text-left truncate">
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <ChevronDown 
          className={cn(
            "w-4 h-4 text-gray-400 transition-transform duration-200",
            isOpen && "rotate-180"
          )} 
        />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 py-2 bg-white rounded-2xl shadow-xl border border-gray-100 z-50 animate-in fade-in zoom-in-95 duration-200 origin-top">
          {options.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => {
                onChange(option.value);
                setIsOpen(false);
              }}
              className={cn(
                "w-full text-left px-4 py-2 text-sm hover:bg-violet-50 hover:text-violet-700 transition-colors",
                value === option.value ? "text-violet-600 font-semibold bg-violet-50/50" : "text-gray-600"
              )}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
