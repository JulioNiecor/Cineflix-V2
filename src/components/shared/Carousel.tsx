"use client";

import React, { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

interface CarouselProps {
    children: React.ReactNode;
    className?: string;
}

export function Carousel({ children, className }: CarouselProps) {
    const [emblaRef, emblaApi] = useEmblaCarousel({
        align: "start",
        containScroll: "trimSnaps",
        dragFree: true,
    });

    const [prevBtnEnabled, setPrevBtnEnabled] = useState(false);
    const [nextBtnEnabled, setNextBtnEnabled] = useState(true);

    const scrollPrev = useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi]);
    const scrollNext = useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi]);

    const onSelect = useCallback(() => {
        if (!emblaApi) return;
        setPrevBtnEnabled(emblaApi.canScrollPrev());
        setNextBtnEnabled(emblaApi.canScrollNext());
    }, [emblaApi]);

    useEffect(() => {
        if (!emblaApi) return;
        onSelect();
        emblaApi.on("select", onSelect);
        emblaApi.on("reInit", onSelect);
    }, [emblaApi, onSelect]);

    return (
        <div className={cn("relative group", className)}>
            <div className="overflow-x-hidden overflow-y-visible cursor-grab active:cursor-grabbing py-6 -my-6" ref={emblaRef}>
                <div className="flex touch-pan-y space-x-4 pl-4 md:pl-0 pr-4 will-change-transform [transform:translateZ(0)]">
                    {children}
                </div>
            </div>

            {/* Navigation Buttons - Hidden on mobile, visible on hover desktop */}
            <Button
                variant="glass"
                size="icon"
                className={cn(
                    "absolute -left-4 top-1/2 -translate-y-1/2 z-10 rounded-full h-12 w-12 hidden md:flex opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-0",
                    !prevBtnEnabled && "hidden"
                )}
                onClick={scrollPrev}
                disabled={!prevBtnEnabled}
            >
                <ChevronLeft className="h-6 w-6" />
            </Button>

            <Button
                variant="glass"
                size="icon"
                className={cn(
                    "absolute -right-4 top-1/2 -translate-y-1/2 z-10 rounded-full h-12 w-12 hidden md:flex opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-0",
                    !nextBtnEnabled && "hidden"
                )}
                onClick={scrollNext}
                disabled={!nextBtnEnabled}
            >
                <ChevronRight className="h-6 w-6" />
            </Button>
        </div>
    );
}
