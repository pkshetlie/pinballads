"use client"

import * as React from "react"
import * as LabelPrimitive from "@radix-ui/react-label"

import { cn } from "@/lib/utils"

function Label({
                 className,
                 noFlex,
                 ...props
               }: React.ComponentProps<typeof LabelPrimitive.Root> & { noFlex?: boolean }) {
  return (
      <LabelPrimitive.Root
          data-slot="label"
          className={cn(
              "text-sm leading-none font-medium select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50",
              !noFlex && "flex items-center gap-2",
              className
          )}
          {...props}
      />
  )
}

export { Label }
