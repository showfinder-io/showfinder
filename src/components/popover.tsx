"use client";

import * as React from "react";
import { Popover as PopoverPrimitive } from "@base-ui/react/popover";
import { cn } from "@/lib/utils";

/**
 * Popover Agoris — wrapper léger autour de Base UI Popover.
 * Style éditorial : fond papier, bordure prune translucide, ombre douce.
 * Utilisé pour les sélecteurs de tri/ville/période sur le listing.
 */
function Popover({ ...props }: PopoverPrimitive.Root.Props) {
  return <PopoverPrimitive.Root {...props} />;
}

function PopoverTrigger({ ...props }: PopoverPrimitive.Trigger.Props) {
  return <PopoverPrimitive.Trigger {...props} />;
}

function PopoverContent({
  className,
  align = "start",
  sideOffset = 6,
  ...props
}: PopoverPrimitive.Popup.Props & {
  align?: "start" | "center" | "end";
  sideOffset?: number;
}) {
  return (
    <PopoverPrimitive.Portal>
      <PopoverPrimitive.Positioner align={align} sideOffset={sideOffset}>
        <PopoverPrimitive.Popup
          className={cn(
            "z-50 min-w-[14rem] rounded-md border border-prune/10 bg-papier p-2 text-sm text-prune shadow-[0_8px_24px_-12px_rgba(59,31,51,0.18)] outline-none",
            "data-starting-style:opacity-0 data-ending-style:opacity-0 transition-opacity duration-150",
            className
          )}
          {...props}
        />
      </PopoverPrimitive.Positioner>
    </PopoverPrimitive.Portal>
  );
}

function PopoverClose({ ...props }: PopoverPrimitive.Close.Props) {
  return <PopoverPrimitive.Close {...props} />;
}

export { Popover, PopoverTrigger, PopoverContent, PopoverClose };
