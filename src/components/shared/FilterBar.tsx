"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useCallback, useState, useRef, useEffect, useTransition } from "react";
import { ChevronDown, Check, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface Genre {
    id: number;
    name: string;
}

interface FilterBarProps {
    genres: Genre[];
    type: "movie" | "tv";
}

// Custom Dropdown Component for Premium Look
function CustomSelect({ label, value, options, onChange, placeholder }: any) {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const selectedOption = options.find((o: any) => o.value === value) || { label: placeholder, value: "" };

    return (
        <div className="relative flex flex-col gap-1.5 w-full sm:w-56" ref={containerRef}>
            <label className="text-xs text-sky-200/60 font-medium px-1 uppercase tracking-wider">{label}</label>
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className={cn(
                    "flex items-center justify-between w-full bg-sky-950/50 hover:bg-sky-900/60 border border-sky-800/50 text-sky-50 text-sm rounded-xl px-4 py-2.5 transition-all duration-300 cursor-pointer outline-none focus:ring-2 focus:ring-sky-500/50 focus:border-sky-500/50",
                    isOpen && "bg-sky-900/80 border-sky-500/50 shadow-[0_0_15px_rgba(14,165,233,0.15)]"
                )}
            >
                <span className="truncate">{selectedOption.label}</span>
                <ChevronDown className={cn("inline w-4 h-4 text-sky-400 transition-transform duration-300", isOpen && "rotate-180")} />
            </button>

            {/* Dropdown Menu */}
            <div className={cn(
                "absolute top-full left-0 w-full mt-2 bg-sky-950/95 backdrop-blur-xl border border-sky-700/50 rounded-xl shadow-2xl z-50 overflow-hidden transition-all duration-300 transform origin-top will-change-[transform,opacity] [transform:translateZ(0)]",
                isOpen ? "opacity-100 scale-100 translate-y-0" : "opacity-0 scale-95 -translate-y-2 pointer-events-none"
            )}>
                <div className="max-h-60 overflow-y-auto custom-scrollbar flex flex-col p-1">
                    <button
                        type="button"
                        onClick={() => { onChange(""); setIsOpen(false); }}
                        className={cn(
                            "flex items-center justify-between w-full text-left px-3 py-2.5 rounded-lg text-sm transition-colors cursor-pointer",
                            !value ? "bg-sky-500/20 text-sky-300 font-medium" : "text-sky-100/70 hover:bg-sky-900/50 hover:text-sky-50"
                        )}
                    >
                        <span>{placeholder}</span>
                        {!value && <Check className="w-4 h-4 text-sky-400" />}
                    </button>
                    {options.map((option: any) => (
                        <button
                            key={option.value}
                            type="button"
                            onClick={() => { onChange(option.value); setIsOpen(false); }}
                            className={cn(
                                "flex items-center justify-between w-full text-left px-3 py-2.5 rounded-lg text-sm transition-colors cursor-pointer",
                                value === option.value ? "bg-sky-500/20 text-sky-300 font-medium" : "text-sky-100/70 hover:bg-sky-900/50 hover:text-sky-50"
                            )}
                        >
                            <span>{option.label}</span>
                            {value === option.value && <Check className="w-4 h-4 text-sky-400" />}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}


export function FilterBar({ genres, type }: FilterBarProps) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const [isPending, startTransition] = useTransition();

    const currentGenre = searchParams.get("genre") || "";
    const currentYear = searchParams.get("year") || "";
    const currentSort = searchParams.get("sort") || "popularity.desc";

    const updateFilter = useCallback((name: string, value: string) => {
        const params = new URLSearchParams(searchParams.toString());
        if (value) {
            params.set(name, value);
        } else {
            params.delete(name);
        }
        startTransition(() => {
            router.push(`${pathname}?${params.toString()}`);
        });
    }, [pathname, router, searchParams]);

    const currentYearNum = new Date().getFullYear();
    const yearsOptions = Array.from({ length: 40 }, (_, i) => {
        const y = (currentYearNum - i).toString();
        return { label: y, value: y };
    });

    const sortOptions = [
        { label: "Populares (Más a menos)", value: "popularity.desc" },
        { label: "Populares (Menos a más)", value: "popularity.asc" },
        { label: "Mejor valoradas", value: "vote_average.desc" },
        { label: "Peor valoradas", value: "vote_average.asc" },
        ...(type === "movie" ? [
            { label: "Estrenos recientes", value: "primary_release_date.desc" },
            { label: "Estrenos clásicos", value: "primary_release_date.asc" }
        ] : [
            { label: "Nuevas series", value: "first_air_date.desc" },
            { label: "Series clásicas", value: "first_air_date.asc" }
        ])
    ];

    return (
        <div className="flex flex-col gap-6 bg-sky-950/30 p-5 md:p-6 rounded-2xl border border-sky-800/40 backdrop-blur-md mb-8 shadow-xl relative overflow-visible transform-gpu will-change-[transform,backdrop-filter] z-10">

            {/* Responsive Genre Wrap */}
            <div className="flex flex-col gap-3 w-full">
                <label className="text-xs text-sky-200/60 font-medium px-1 uppercase tracking-wider flex items-center justify-between">
                    <span className="flex items-center gap-2">
                        Géneros
                        {isPending && <span className="animate-pulse w-2 h-2 rounded-full bg-sky-400" title="Cargando filtros..." />}
                    </span>
                    {(currentGenre || currentYear || currentSort !== "popularity.desc") && (
                        <button
                            onClick={() => startTransition(() => router.push(pathname))}
                            className="text-sky-400 hover:text-sky-300 transition-colors flex items-center gap-1 cursor-pointer font-medium"
                            disabled={isPending}
                        >
                            <X className="w-3.5 h-3.5" /> Limpiar Todo
                        </button>
                    )}
                </label>
                <div className="flex flex-wrap gap-2.5 w-full">
                    <button
                        onClick={() => updateFilter("genre", "")}
                        className={cn(
                            "flex-none px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 cursor-pointer border",
                            !currentGenre
                                ? "bg-sky-500 text-white border-sky-400 shadow-[0_0_15px_rgba(14,165,233,0.4)]"
                                : "bg-sky-950/50 text-sky-100/70 border-sky-800/50 hover:bg-sky-900 hover:text-white hover:border-sky-600/50"
                        )}
                    >
                        Todos
                    </button>
                    {genres.map((g) => (
                        <button
                            key={g.id}
                            onClick={() => updateFilter("genre", g.id.toString())}
                            className={cn(
                                "flex-none px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 cursor-pointer border",
                                currentGenre === g.id.toString()
                                    ? "bg-sky-500 text-white border-sky-400 shadow-[0_0_15px_rgba(14,165,233,0.4)]"
                                    : "bg-sky-950/50 text-sky-100/70 border-sky-800/50 hover:bg-sky-900 hover:text-white hover:border-sky-600/50"
                            )}
                        >
                            {g.name}
                        </button>
                    ))}
                </div>
            </div>

            {/* Dropdowns Row - overflow-visible allows the absolute dropdown to escape */}
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 z-30 overflow-visible relative">
                <CustomSelect
                    label="Año de Lanzamiento"
                    value={currentYear}
                    options={yearsOptions}
                    onChange={(val: string) => updateFilter("year", val)}
                    placeholder="Cualquier año"
                />

                <CustomSelect
                    label="Ordenar Catálogo"
                    value={currentSort}
                    options={sortOptions}
                    onChange={(val: string) => updateFilter("sort", val)}
                    placeholder="Orden predeterminado"
                />
            </div>

        </div>
    );
}
