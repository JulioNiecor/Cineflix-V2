import * as React from "react"
import { cn } from "@/lib/utils"

export interface ButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: "default" | "glass" | "ghost" | "outline"
    size?: "default" | "sm" | "lg" | "icon"
    isLoading?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant = "default", size = "default", isLoading, children, ...props }, ref) => {

        const variants = {
            default: "bg-sky-500 text-sky-50 hover:bg-sky-400 hover:shadow-glow-sm shadow-sm",
            glass: "bg-sky-800/40 backdrop-blur-sm border border-sky-400/20 text-sky-100 hover:bg-sky-800/60 hover:shadow-glow-sm transform-gpu will-change-[transform,backdrop-filter]",
            ghost: "hover:bg-sky-800/30 text-sky-100",
            outline: "border border-sky-500 text-sky-100 hover:bg-sky-500/20"
        }

        const sizes = {
            default: "h-10 px-4 py-2",
            sm: "h-9 rounded-md px-3",
            lg: "h-11 rounded-lg px-8",
            icon: "h-10 w-10",
        }

        return (
            <button
                ref={ref}
                className={cn(
                    "inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-medium ring-offset-background transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 disabled:pointer-events-none disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed",
                    variants[variant],
                    sizes[size],
                    className
                )}
                disabled={isLoading || props.disabled}
                {...props}
            >
                {isLoading ? (
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                ) : null}
                {children}
            </button>
        )
    }
)
Button.displayName = "Button"

export { Button }
