"use server";

import { tmdb } from "@/lib/tmdb";
import { TMDBMedia, TMDBResponse } from "@/types/tmdb";

export async function fetchMoreSeries(params: Record<string, string>, page: number): Promise<TMDBResponse<TMDBMedia>> {
    return await tmdb.getDiscoverSeries(page, params);
}
