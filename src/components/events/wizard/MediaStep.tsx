"use client";

import { Upload, Trash2 } from "lucide-react";
import { MediaPreview } from "./types";

interface Props {
  mediaPreviews: MediaPreview[];
  mediaFilesLength: number;
  coverIndex: number;
  setCoverIndex: (index: number) => void;
  handleMediaPick: (e: React.ChangeEvent<HTMLInputElement>) => void;
  removeMedia: (index: number) => void;
  uploading?: boolean;
}

export default function MediaStep({
  mediaPreviews,
  mediaFilesLength,
  coverIndex,
  setCoverIndex,
  handleMediaPick,
  removeMedia,
  uploading = false,
}: Props) {
  return (
    <div className="bg-card rounded-2xl border border-border shadow-sm p-6 md:p-8">
      <div className="flex items-center gap-2 mb-6 text-primary font-medium">
        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-bold">
          4
        </div>
        <h2>Media (Max 8)</h2>
      </div>

      <div className="border-2 border-dashed border-border rounded-2xl p-8 text-center hover:bg-muted/30 transition-colors cursor-pointer relative mb-6">
        <input
          type="file"
          accept="image/*,video/*"
          multiple
          onChange={handleMediaPick}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          disabled={mediaFilesLength >= 8 || uploading}
        />
        <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center mx-auto mb-3 text-muted-foreground">
          <Upload className="w-6 h-6" />
        </div>
        <p className="font-medium text-foreground">
          Click or drag images/videos here
        </p>
        <p className="text-xs text-muted-foreground mt-1">
          First image is the cover. Max 8 files. SVG, PNG, JPG or GIF.
        </p>
      </div>

      {/* Media Grid */}
      {mediaPreviews.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
          {mediaPreviews.map((preview, index) => (
            <div
              key={preview.id || index}
              className={`relative rounded-xl overflow-hidden aspect-square border-2 group ${
                index === coverIndex
                  ? "border-primary ring-2 ring-primary/20"
                  : "border-border"
              }`}
            >
              {preview.type === "video" ? (
                <video
                  src={preview.url}
                  className="w-full h-full object-cover"
                />
              ) : (
                <img
                  src={preview.url}
                  alt={`Preview ${index}`}
                  className="w-full h-full object-cover"
                />
              )}

              <div className="absolute inset-0 bg-black/0 hover:bg-black/10 transition-colors">
                <button
                  type="button"
                  onClick={() => removeMedia(index)}
                  className="absolute top-2 right-2 p-1.5 bg-white/90 rounded-full text-destructive hover:bg-white shadow-sm opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-all"
                >
                  <Trash2 className="w-3 h-3" />
                </button>

                <div className="absolute bottom-2 left-2 right-2 flex justify-center opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-all">
                  <button
                    type="button"
                    onClick={() => setCoverIndex(index)}
                    className={`text-xs px-2 py-1 rounded-md font-medium shadow-sm ${
                      index === coverIndex
                        ? "bg-primary text-primary-foreground"
                        : "bg-white text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    {index === coverIndex ? "Cover Image" : "Set as Cover"}
                  </button>
                </div>
              </div>
              {index === coverIndex && (
                <div className="absolute top-2 left-2 bg-primary text-primary-foreground text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm">
                  COVER
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
