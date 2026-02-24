"use client";

import { motion } from "framer-motion";

export default function Template({ children }: { children: React.ReactNode }) {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="w-full flex-1 will-change-opacity [transform:translateZ(0)]"
        >
            {children}
        </motion.div>
    );
}
