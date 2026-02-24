"use client";

import { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { Info, Play, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { getImageUrl } from "@/lib/tmdb";
import { TMDBMedia } from "@/types/tmdb";
import { cn } from "@/lib/utils";
import dynamic from "next/dynamic";

const VideoModal = dynamic(() => import("@/components/shared/VideoModal").then(mod => mod.VideoModal), { ssr: false });

interface HomeHeroProps {
    trending: TMDBMedia[];
}

export function HomeHero({ trending }: HomeHeroProps) {
    const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [
        Autoplay({ delay: 6000, stopOnInteraction: false })
    ]);
    const [selectedIndex, setSelectedIndex] = useState(0);

    const onSelect = useCallback(() => {
        if (!emblaApi) return;
        setSelectedIndex(emblaApi.selectedScrollSnap());
    }, [emblaApi]);

    useEffect(() => {
        if (!emblaApi) return;
        onSelect();
        emblaApi.on("select", onSelect);
        emblaApi.on("reInit", onSelect);

        // Reinicia el temporizador de autoplay al soltar el ratón/dedo después de arrastrar
        emblaApi.on("pointerUp", () => {
            const autoplay = emblaApi.plugins()?.autoplay;
            if (autoplay) autoplay.reset();
        });
    }, [emblaApi, onSelect]);

    if (!trending?.length) return null;

    return (
        <div className="relative w-full h-[80vh] md:h-[100vh] overflow-hidden group">
            <div className="absolute inset-0 z-0 cursor-grab active:cursor-grabbing" ref={emblaRef}>
                <div className="flex h-full touch-pan-y will-change-transform [transform:translateZ(0)]">
                    {trending.map((media, idx) => (
                        <div key={media.id} className="relative flex-[0_0_100%] h-full">
                            {/* Background Image */}
                            <Image
                                src={getImageUrl(media.backdrop_path || media.poster_path, "w1280")}
                                alt={media.title || media.name || ""}
                                fill
                                sizes="100vw"
                                quality={85}
                                className="object-cover"
                                priority={idx === 0}
                            />

                            {/* Overlays for depth and text legibility */}
                            <div className="absolute inset-0 bg-gradient-to-r from-sky-950/90 via-sky-950/40   to-transparent" />
                            <div className="absolute inset-0 bg-gradient-to-t from-sky-950 via-sky-950/10 to-transparent" />

                            {/* Content */}
                            <div className="absolute inset-0 flex items-center">
                                <div className="container mx-auto px-4 md:px-12 w-full mt-20">
                                    <div className="max-w-2xl space-y-4">
                                        <h1 className="text-4xl md:text-6xl font-bold text-white drop-shadow-lg tracking-tight">
                                            {media.title || media.name}
                                        </h1>

                                        <div className="flex items-center gap-3 text-sky-200/80 text-sm font-medium">
                                            <span className="bg-sky-500/20 text-sky-300 px-2 py-0.5 rounded border border-sky-400/20">
                                                {media.media_type === "tv" ? "Serie" : "Película"}
                                            </span>
                                            <span>⭐ {media.vote_average.toFixed(1)} Puntuación</span>
                                        </div>

                                        <p className="text-sky-50/80 text-sm md:text-lg line-clamp-3 leading-relaxed max-w-xl drop-shadow">
                                            {media.overview}
                                        </p>

                                        <div className="flex flex-col sm:flex-row gap-4 pt-4">
                                            <VideoModal
                                                tmdbId={media.id}
                                                mediaType={media.media_type === "tv" ? "tv" : "movie"}
                                                title={`Tráiler de ${media.title || media.name}`}
                                                onOpenChange={(isOpen) => {
                                                    const autoplay = emblaApi?.plugins()?.autoplay;
                                                    if (!autoplay) return;
                                                    if (isOpen) autoplay.stop();
                                                    else autoplay.play();
                                                }}
                                            />
                                            <Link href={`/${media.media_type === "tv" ? "series" : "movies"}/${media.id}`}>
                                                <Button variant="glass" size="lg" className="w-full sm:w-auto gap-2">
                                                    <Info className="w-5 h-5" /> Más Información
                                                </Button>
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Pagination dots container */}
            <div className="absolute bottom-12 left-0 right-0 z-10 hidden md:flex justify-center gap-2">
                {trending.map((_, idx) => (
                    <button
                        key={idx}
                        className={cn(
                            "w-2 h-2 rounded-full transition-all duration-300",
                            idx === selectedIndex ? "w-8 bg-sky-400 shadow-glow-sm" : "bg-sky-400/30 hover:bg-sky-400/50 cursor-pointer"
                        )}
                        onClick={() => {
                            emblaApi?.scrollTo(idx);
                            emblaApi?.plugins()?.autoplay?.reset();
                        }}
                        aria-label={`Ir a la diapositiva ${idx + 1}`}
                    />
                ))}
            </div>

            {/* Navigation Arrows */}
            <div className="absolute inset-y-0 left-4 md:left-8 flex items-center z-10 pointer-events-none">
                <Button
                    variant="glass"
                    size="icon"
                    className="w-12 h-12 rounded-full pointer-events-auto opacity-0 group-hover:opacity-100 transition-opacity hidden md:flex bg-black/20 hover:bg-black/50 border-white/10"
                    onClick={() => {
                        emblaApi?.scrollPrev();
                        emblaApi?.plugins()?.autoplay?.reset();
                    }}
                    aria-label="Anterior"
                >
                    <ChevronLeft className="w-8 h-8 text-white" />
                </Button>
            </div>
            <div className="absolute inset-y-0 right-4 md:right-8 flex items-center z-10 pointer-events-none">
                <Button
                    variant="glass"
                    size="icon"
                    className="w-12 h-12 rounded-full pointer-events-auto opacity-0 group-hover:opacity-100 transition-opacity hidden md:flex bg-black/20 hover:bg-black/50 border-white/10"
                    onClick={() => {
                        emblaApi?.scrollNext();
                        emblaApi?.plugins()?.autoplay?.reset();
                    }}
                    aria-label="Siguiente"
                >
                    <ChevronRight className="w-8 h-8 text-white" />
                </Button>
            </div>
        </div>
    );
}
