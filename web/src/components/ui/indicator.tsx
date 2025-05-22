import { cn } from "@/lib/utils"
import React, { ComponentProps } from 'react'

export default function Indicator({ className, children, ...rest }: ComponentProps<'p'>) {
  return (
    <p
      className={cn(
        "dark:bg-input/40 border-input flex h-14 w-full min-w-0 rounded-xl bg-transparent px-3 py-3.5 text-base shadow-xs transition-[color,box-shadow] outline-none md:text-sm",
        className
      )}
      {...rest}
    >{children}</p>
  )
}
