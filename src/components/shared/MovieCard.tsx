"use client";

import React, { memo } from "react";
import Image from "next/image";
import Link from "next/link";
import { Star } from "lucide-react";
import { getImageUrl } from "@/lib/tmdb";
import { TMDBMedia } from "@/types/tmdb";
import { GlassCard } from "@/components/ui/GlassCard";

interface MovieCardProps {
    media: TMDBMedia;
    mediaType?: "movie" | "tv";
}

export const MovieCard = memo(function MovieCard({ media, mediaType }: MovieCardProps) {
    const type = mediaType || media.media_type || "movie";
    const title = media.title || media.name || "Untitled";
    const releaseDate = media.release_date || media.first_air_date;
    const year = releaseDate ? new Date(releaseDate).getFullYear() : "N/A";

    const href = `/${type === "movie" ? "movies" : "series"}/${media.id}`;

    return (
        <Link href={href} prefetch={false} className="block group h-full w-full">
            <GlassCard className="h-full flex flex-col cursor-pointer p-0 glass-card-hoverable">

                {/* Poster Image Container */}
                <div className="relative aspect-[2/3] w-full overflow-hidden rounded-t-xl bg-sky-900/50">
                    {media.poster_path ? (
                        <Image
                            src={getImageUrl(media.poster_path, "w500")}
                            alt={title}
                            fill
                            sizes="(max-width: 768px) 180px, 220px"
                            className="object-cover transition-transform duration-500 transform-gpu group-hover:scale-110 will-change-transform"
                            decoding="async"
                        />
                    ) : (
                        <div className="absolute inset-0 flex items-center justify-center text-sky-100/50 text-sm p-4 text-center">
                            Sin Imagen
                        </div>
                    )}

                    {/* Subtle gradient overlay at bottom of poster for text contrast */}
                    <div className="absolute inset-0 bg-gradient-to-t from-sky-950 via-sky-950/20 to-transparent opacity-60" />

                    {/* Top-Right Badge (Rating) */}
                    <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-lg text-white text-xs font-bold px-2 py-1 rounded-md flex items-center gap-1 border border-white/10">
                        <Star className="w-3 h-3 text-yellow-400 fill-current" />
                        {media.vote_average.toFixed(1)}
                    </div>
                </div>

                {/* Info Container */}
                <div className="p-3 flex flex-col flex-1 justify-between">
                    <h3 className="font-semibold text-sm text-sky-50 line-clamp-1 group-hover:text-sky-300 transition-colors">
                        {title}
                    </h3>
                    <p className="text-xs text-sky-100/60 mt-1">
                        {year} • {type === "movie" ? "Película" : "Serie"}
                    </p>
                </div>

            </GlassCard>
        </Link>
    );
});

