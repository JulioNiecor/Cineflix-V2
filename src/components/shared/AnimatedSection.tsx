"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

interface Props {
    children: ReactNode;
    delay?: number;
    className?: string;
    direction?: "up" | "down" | "left" | "right" | "none";
}

export function AnimatedSection({ children, delay = 0, className, direction = "up" }: Props) {
    const getVariants = () => {
        switch (direction) {
            case "up": return { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } };
            case "down": return { hidden: { opacity: 0, y: -20 }, visible: { opacity: 1, y: 0 } };
            case "left": return { hidden: { opacity: 0, x: 20 }, visible: { opacity: 1, x: 0 } };
            case "right": return { hidden: { opacity: 0, x: -20 }, visible: { opacity: 1, x: 0 } };
            case "none": return { hidden: { opacity: 0 }, visible: { opacity: 1 } };
            default: return { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } };
        }
    };

    return (
        <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "0px 0px -50px 0px" }} // Explicit margins prevent falsy off-screen firing
            transition={{ duration: 0.5, delay, ease: "easeOut" }} // Native hardware-backed easing
            variants={getVariants()}
            className={className ? `will-change-[transform,opacity] ${className}` : "will-change-[transform,opacity]"}
        >
            {children}
        </motion.div>
    );
}
