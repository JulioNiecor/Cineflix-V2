"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Search, X } from "lucide-react";
import { cn } from "@/lib/utils";

export function SearchBar() {
    const [isOpen, setIsOpen] = useState(false);
    const [query, setQuery] = useState("");
    const router = useRouter();
    const inputRef = useRef<HTMLInputElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    // Handle outside click to close
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Focus input when opened
    useEffect(() => {
        if (isOpen && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isOpen]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (query.trim()) {
            router.push(`/search?q=${encodeURIComponent(query.trim())}`);
            setIsOpen(false);
            setQuery("");
        }
    };

    return (
        <div ref={containerRef} className="relative flex items-center">
            {/* The Expanded Input Form */}
            <form
                onSubmit={handleSubmit}
                className={cn(
                    "absolute right-0 flex items-center bg-sky-950/90 backdrop-blur-md border border-sky-500/30 rounded-full overflow-hidden transition-all duration-300 ease-in-out origin-right z-50 will-change-[transform,opacity,width] [transform:translateZ(0)]",
                    isOpen ? "w-64 md:w-80 opacity-100 scale-100" : "w-0 opacity-0 scale-95 pointer-events-none"
                )}
            >
                <Search className="w-5 h-5 text-sky-400 ml-4 shrink-0" />
                <input
                    ref={inputRef}
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Buscar películas, series..."
                    className="w-full bg-transparent border-none outline-none text-sky-50 placeholder:text-sky-100/40 px-3 py-2 text-sm"
                />
                <button
                    type="button"
                    onClick={() => {
                        setIsOpen(false);
                        setQuery("");
                    }}
                    className="p-2 text-sky-100/50 hover:text-sky-300 transition-colors mr-1 shrink-0 cursor-pointer"
                >
                    <X className="w-4 h-4" />
                </button>
            </form>

            {/* The Trigger Button */}
            <button
                type="button"
                onClick={() => setIsOpen(true)}
                className={cn(
                    "p-2 text-sky-100/70 hover:text-white hover:bg-sky-800/30 rounded-full transition-all duration-300 z-40 cursor-pointer",
                    isOpen && "opacity-0 pointer-events-none"
                )}
                aria-label="Abrir búsqueda"
            >
                <Search className="w-5 h-5" />
            </button>
        </div>
    );
}
