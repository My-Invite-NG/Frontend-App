"use client";

import React, { useState, useRef, useEffect } from "react";
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

interface CustomDatePickerProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export default function CustomDatePicker({
  value,
  onChange,
  placeholder = "Any Date",
  className,
}: CustomDatePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const [viewDate, setViewDate] = useState(value ? new Date(value) : new Date());

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const daysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const startOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const handlePrevMonth = () => {
    setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1));
  };

  const isToday = (day: number) => {
    const today = new Date();
    return today.getDate() === day && today.getMonth() === viewDate.getMonth() && today.getFullYear() === viewDate.getFullYear();
  };

  const isSelected = (day: number) => {
    if (!value) return false;
    const selected = new Date(value);
    return selected.getDate() === day && selected.getMonth() === viewDate.getMonth() && selected.getFullYear() === viewDate.getFullYear();
  };

  const renderDays = () => {
    const days = [];
    const count = daysInMonth(viewDate);
    const start = startOfMonth(viewDate);

    // Padding for start of month
    for (let i = 0; i < start; i++) {
      days.push(<div key={`empty-${i}`} className="h-8 w-8" />);
    }

    for (let day = 1; day <= count; day++) {
      days.push(
        <button
          key={day}
          type="button"
          onClick={() => {
            const selectedDate = new Date(viewDate.getFullYear(), viewDate.getMonth(), day);
            onChange(format(selectedDate, "yyyy-MM-dd"));
            setIsOpen(false);
          }}
          className={cn(
            "h-8 w-8 rounded-lg flex items-center justify-center text-xs transition-all",
            isSelected(day) ? "bg-violet-600 text-white font-bold" : "hover:bg-violet-50 text-gray-700",
            isToday(day) && !isSelected(day) && "text-violet-600 font-bold border border-violet-100"
          )}
        >
          {day}
        </button>
      );
    }
    return days;
  };

  return (
    <div className={cn("relative min-w-[140px]", className)} ref={containerRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "w-full flex items-center gap-2 px-3 py-2 bg-transparent text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-xl transition-all border border-transparent focus:border-violet-100",
          isOpen && "bg-gray-50 border-violet-100 shadow-sm"
        )}
      >
        <CalendarIcon className="w-4 h-4 text-gray-500 shrink-0" />
        <span className="flex-1 text-left truncate">
          {value ? format(new Date(value), "MMM d, yyyy") : placeholder}
        </span>
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 p-4 bg-white rounded-2xl shadow-2xl border border-gray-100 z-50 animate-in fade-in zoom-in-95 duration-200 origin-top w-[280px]">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-sm font-bold text-gray-900">
              {format(viewDate, "MMMM yyyy")}
            </h4>
            <div className="flex items-center gap-1">
              <button 
                type="button" 
                onClick={handlePrevMonth}
                className="p-1 hover:bg-gray-50 rounded-lg text-gray-400 hover:text-gray-600 transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button 
                type="button" 
                onClick={handleNextMonth}
                className="p-1 hover:bg-gray-50 rounded-lg text-gray-400 hover:text-gray-600 transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-1 mb-2">
            {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map(day => (
              <div key={day} className="h-8 w-8 flex items-center justify-center text-[10px] uppercase font-bold text-gray-400">
                {day}
              </div>
            ))}
            {renderDays()}
          </div>
          
          <button 
            type="button"
            onClick={() => { onChange(""); setIsOpen(false); }}
            className="w-full mt-2 py-1.5 text-[10px] font-bold text-gray-400 hover:text-violet-600 hover:bg-violet-50 rounded-lg transition-all"
          >
            Clear Selection
          </button>
        </div>
      )}
    </div>
  );
}
