"use client";

import { ChevronRight, Hash, X } from "lucide-react";
import { EventFormData } from "./types";

interface Props {
  formData: EventFormData;
  handleChange: (e: any) => void;
  tagInput: string;
  setTagInput: (val: string) => void;
  handleAddTag: (e: any) => void;
  handleTagPaste: (e: React.ClipboardEvent<HTMLInputElement>) => void;
  removeTag: (tag: string) => void;
}

export default function BasicInfoStep({
  formData,
  handleChange,
  tagInput,
  setTagInput,
  handleAddTag,
  handleTagPaste,
  removeTag,
}: Props) {
  return (
    <div className="bg-card rounded-2xl border border-border shadow-sm p-6 md:p-8">
      <div className="flex items-center gap-2 mb-6 text-primary font-medium">
        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-bold">
          1
        </div>
        <h2>Basic Information</h2>
      </div>

      <div className="space-y-5">
        <div>
          <label className="block text-sm font-semibold text-foreground mb-1.5">
            Event Title <span className="text-destructive">*</span>
          </label>
          <input
            name="title"
            value={formData.title}
            onChange={handleChange}
            type="text"
            placeholder="e.g. Annual Tech Conference 2025"
            className="w-full px-4 py-2.5 rounded-xl border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all placeholder:text-muted-foreground text-foreground text-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-foreground mb-1.5">
            Description <span className="text-destructive">*</span>
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={4}
            placeholder="Describe your event..."
            className="w-full px-4 py-2.5 rounded-xl border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all placeholder:text-muted-foreground text-foreground text-sm"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-semibold text-foreground mb-1.5">
              Category <span className="text-destructive">*</span>
            </label>
            <div className="relative">
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-xl border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-foreground text-sm appearance-none"
              >
                <option value="">Select Category</option>
                <option value="Music">Music</option>
                <option value="Technology">Technology</option>
                <option value="Business">Business</option>
                <option value="Food & Drink">Food & Drink</option>
                <option value="Arts">Arts</option>
                <option value="Sports">Sports</option>
                <option value="Wellness">Wellness</option>
              </select>
              <ChevronRight className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground rotate-90" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-foreground mb-1.5">
              Tags
            </label>
            <div className="flex items-center gap-2 px-3 py-2 rounded-xl border border-input bg-background focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary transition-all">
              <Hash className="w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Add tags (Press Enter)..."
                className="flex-1 focus:outline-none text-sm placeholder:text-muted-foreground bg-transparent text-foreground"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleAddTag}
                onPaste={handleTagPaste}
              />
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {formData.tags.map((tag) => (
                <span
                  key={tag}
                  className="flex items-center gap-1 px-2 py-1 bg-muted text-muted-foreground text-xs rounded-md"
                >
                  {tag}
                  <button type="button" onClick={() => removeTag(tag)}>
                    <X className="w-3 h-3 hover:text-destructive" />
                  </button>
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
