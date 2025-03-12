import * as React from "react"
import { cn } from "@/lib/utils"

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-12 w-full rounded-xl border border-[#593C2D]/20 bg-white px-4 py-2 text-sm font-['Segoe_UI'] text-[#593C2D] transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-[#593C2D]/40 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#593C2D] disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }
