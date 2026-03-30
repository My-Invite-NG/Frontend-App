"use client";

import { useState, useEffect } from "react";
import { MapPin, CalendarDays, Calendar } from "lucide-react";
import { EventFormData } from "./types";

interface Props {
  formData: EventFormData;
  handleChange: (e: any) => void;
  setFormData: (data: EventFormData) => void;
  minStartDate?: string;
}

export default function TimeVenueStep({
  formData,
  handleChange,
  setFormData,
  minStartDate,
}: Props) {
  // Determine initial mode: if end_date exists and differs from start_date, it's multi-day
  const [isMultiDay, setIsMultiDay] = useState(() => {
    if (formData.end_date && formData.start_date) {
      return formData.end_date !== formData.start_date;
    }
    return false;
  });

  // When toggling to single day, sync end_date = start_date
  useEffect(() => {
    if (!isMultiDay && formData.start_date) {
      setFormData({ ...formData, end_date: formData.start_date });
    }
  }, [isMultiDay]);

  // When start_date changes in single-day mode, keep end_date in sync
  useEffect(() => {
    if (!isMultiDay && formData.start_date) {
      if (formData.end_date !== formData.start_date) {
        setFormData({ ...formData, end_date: formData.start_date });
      }
    }
  }, [formData.start_date]);

  return (
    <div className="bg-card rounded-2xl border border-border shadow-sm p-6 md:p-8">
      <div className="flex items-center gap-2 mb-6 text-primary font-medium">
        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-bold">
          2
        </div>
        <h2>Time & Venue</h2>
      </div>

      <div className="space-y-6">
        {/* Single / Multi-day toggle */}
        <div>
          <label className="block text-sm font-semibold text-foreground mb-2">
            Event Duration
          </label>
          <div className="flex bg-muted p-1 rounded-xl w-full sm:w-fit">
            <button
              type="button"
              onClick={() => setIsMultiDay(false)}
              className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-all ${
                !isMultiDay
                  ? "bg-card text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Calendar className="w-4 h-4" />
              Single Day
            </button>
            <button
              type="button"
              onClick={() => setIsMultiDay(true)}
              className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-all ${
                isMultiDay
                  ? "bg-card text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <CalendarDays className="w-4 h-4" />
              Multiple Days
            </button>
          </div>
        </div>

        {/* Date / Time Fields */}
        {isMultiDay ? (
          /* ---- Multi-Day Layout ---- */
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-semibold text-foreground mb-1.5">
                Start Date <span className="text-destructive">*</span>
              </label>
              <input
                name="start_date"
                min={minStartDate}
                value={formData.start_date}
                onChange={handleChange}
                type="date"
                className="w-full px-4 py-2.5 rounded-xl border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-foreground text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-foreground mb-1.5">
                Start Time <span className="text-destructive">*</span>
              </label>
              <input
                name="start_time"
                value={formData.start_time}
                onChange={handleChange}
                type="time"
                className="w-full px-4 py-2.5 rounded-xl border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-foreground text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-foreground mb-1.5">
                End Date <span className="text-destructive">*</span>
              </label>
              <input
                name="end_date"
                min={formData.start_date}
                value={formData.end_date}
                onChange={handleChange}
                type="date"
                className="w-full px-4 py-2.5 rounded-xl border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-foreground text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-foreground mb-1.5">
                End Time
              </label>
              <input
                name="end_time"
                value={formData.end_time}
                onChange={handleChange}
                type="time"
                className="w-full px-4 py-2.5 rounded-xl border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-foreground text-sm"
              />
            </div>
          </div>
        ) : (
          /* ---- Single-Day Layout ---- */
          <div className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-foreground mb-1.5">
                Event Date <span className="text-destructive">*</span>
              </label>
              <input
                name="start_date"
                min={minStartDate}
                value={formData.start_date}
                onChange={handleChange}
                type="date"
                className="w-full px-4 py-2.5 rounded-xl border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-foreground text-sm"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-semibold text-foreground mb-1.5">
                  Start Time <span className="text-destructive">*</span>
                </label>
                <input
                  name="start_time"
                  value={formData.start_time}
                  onChange={handleChange}
                  type="time"
                  className="w-full px-4 py-2.5 rounded-xl border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-foreground text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-foreground mb-1.5">
                  End Time
                </label>
                <input
                  name="end_time"
                  value={formData.end_time}
                  onChange={handleChange}
                  type="time"
                  className="w-full px-4 py-2.5 rounded-xl border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-foreground text-sm"
                />
              </div>
            </div>
          </div>
        )}

        <div>
          <label className="block text-sm font-semibold text-foreground mb-1.5">
            Location <span className="text-destructive">*</span>
          </label>
          <div className="relative mb-3">
            <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              name="location"
              value={formData.location}
              onChange={handleChange}
              type="text"
              placeholder="Enter event location or address"
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-foreground text-sm"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
