"use client";

import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

type StarRatingProps = {
  value: number;
  onChange?: (value: number) => void;
  size?: "sm" | "md";
};

export function StarRating({ value, onChange, size = "md" }: StarRatingProps) {
  const isInteractive = !!onChange;
  const iconSize = size === "sm" ? "h-4 w-4" : "h-5 w-5";

  return (
    <div className="inline-flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={!isInteractive}
          onClick={() => onChange?.(star)}
          className={cn(
            "p-0 border-0 bg-transparent",
            isInteractive
              ? "cursor-pointer hover:scale-110 transition-transform"
              : "cursor-default"
          )}
          aria-label={`${star} étoile${star > 1 ? "s" : ""}`}
        >
          <Star
            className={cn(
              iconSize,
              star <= value
                ? "fill-amber-400 text-amber-400"
                : "fill-none text-gray-300"
            )}
          />
        </button>
      ))}
    </div>
  );
}
