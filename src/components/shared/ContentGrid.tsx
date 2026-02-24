"use client";

import { useState, useEffect, useCallback } from "react";
import { useInView } from "react-intersection-observer";
import { MovieCard } from "@/components/shared/MovieCard";
import { Skeleton } from "@/components/ui/Skeleton";
import { TMDBMedia, TMDBResponse } from "@/types/tmdb";

interface ContentGridProps {
    initialData: TMDBResponse<TMDBMedia>;
    mediaType: "movie" | "tv";
    fetchAction: (page: number) => Promise<TMDBResponse<TMDBMedia>>;
}

export function ContentGrid({ initialData, mediaType, fetchAction }: ContentGridProps) {
    const [items, setItems] = useState<TMDBMedia[]>(initialData.results);
    const [page, setPage] = useState(initialData.page);
    const [hasMore, setHasMore] = useState(initialData.page < initialData.total_pages);
    const [isLoading, setIsLoading] = useState(false);

    const { ref, inView } = useInView({
        threshold: 0.1,
        rootMargin: "400px",
    });

    const loadMore = useCallback(async () => {
        setIsLoading(true);
        try {
            const nextPage = page + 1;
            const res = await fetchAction(nextPage);

            setItems((prev) => {
                // Prevent duplicates
                const existingIds = new Set(prev.map(i => i.id));
                const newItems = res.results.filter(i => !existingIds.has(i.id));
                return [...prev, ...newItems];
            });

            setPage(nextPage);
            setHasMore(nextPage < res.total_pages);
        } catch (error) {
            console.error("Failed to fetch more items", error);
        } finally {
            setIsLoading(false);
        }
    }, [fetchAction, page]);

    useEffect(() => {
        if (inView && hasMore && !isLoading) {
            loadMore();
        }
    }, [inView, hasMore, isLoading, loadMore]);

    return (
        <div className="space-y-8">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 gap-4 md:gap-6 pt-2 pb-4 px-2 -mx-2">
                {items.map((media) => (
                    <div key={media.id} className="w-full">
                        <MovieCard media={media} mediaType={mediaType} />
                    </div>
                ))}
            </div>

            {hasMore && (
                <div ref={ref} className="flex justify-center py-8">
                    {isLoading ? (
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 gap-4 md:gap-6 w-full pt-2 pb-4 px-2 -mx-2">
                            {Array.from({ length: 7 }).map((_, i) => (
                                <Skeleton key={i} className="w-full aspect-[2/3] rounded-xl" />
                            ))}
                        </div>
                    ) : (
                        <div className="h-10" /> // Spacer to trigger intersection
                    )}
                </div>
            )}
        </div>
    );
}
