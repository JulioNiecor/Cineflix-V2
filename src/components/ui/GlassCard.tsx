
import { cn } from "@/lib/utils";
import { HTMLAttributes } from "react";

interface GlassCardProps extends HTMLAttributes<HTMLDivElement> {
    className?: string;
    children?: React.ReactNode;
}

export function GlassCard({ className, children, ...props }: GlassCardProps) {
    return (
        <div
            className={cn(
                "glass-card border-sky-800/30 overflow-hidden relative",
                className
            )}
            {...props}
        >
            {/* Subtle inner glow top border */}
            <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-sky-400/20 to-transparent" />
            {children}
        </div>
    );
}
