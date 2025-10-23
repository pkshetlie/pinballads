"use client";

import * as React from "react";
import * as SliderPrimitive from "@radix-ui/react-slider";

import { cn } from "@/lib/utils";

function SliderMax({
                     className,
                     defaultValue = [100], // Valeur par défaut du max
                     value,
                     max = 100,
                     min = 0,
                     step = 1,
                     onValueChange,
                     ...props
                   }: React.ComponentProps<typeof SliderPrimitive.Root> & {
  onValueChange?: (value: number) => void; // Pour capturer le changement de valeur
}) {
  const handleValueChange = (value: number[]) => {
    // Appeler une fonction callback avec uniquement la valeur maximale
    if (onValueChange) {
      onValueChange(value[0]); // Transmettre uniquement la valeur maximale
    }
  };

  return (
      <SliderPrimitive.Root
          data-slot="slider-max"
          defaultValue={defaultValue}
          value={value ? [value] : undefined}
          min={min}
          max={max}
          step={step}
          onValueChange={handleValueChange}
          className={cn(
              "relative flex w-full touch-none items-center select-none data-[disabled]:opacity-50",
              className
          )}
          {...props}
      >
        <SliderPrimitive.Track
            data-slot="slider-track"
            className={cn(
                "bg-muted relative grow overflow-hidden rounded-full data-[orientation=horizontal]:h-1.5 data-[orientation=horizontal]:w-full data-[orientation=vertical]:h-full data-[orientation=vertical]:w-1.5"
            )}
        >
          <SliderPrimitive.Range
              data-slot="slider-range"
              className={cn(
                  "bg-primary absolute data-[orientation=horizontal]:h-full data-[orientation=vertical]:w-full"
              )}
          />
        </SliderPrimitive.Track>
        <SliderPrimitive.Thumb
            data-slot="slider-thumb"
            className="border-primary bg-background ring-ring/50 block size-4 shrink-0 rounded-full border shadow-sm transition-[color,box-shadow] hover:ring-4 focus-visible:ring-4 focus-visible:outline-hidden disabled:pointer-events-none disabled:opacity-50"
        />
      </SliderPrimitive.Root>
  );
}

export { SliderMax };
