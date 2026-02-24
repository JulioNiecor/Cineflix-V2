"use server";

import { tmdb } from "@/lib/tmdb";
import { TMDBMedia, TMDBResponse } from "@/types/tmdb";

export async function fetchMoreMovies(params: Record<string, string>, page: number): Promise<TMDBResponse<TMDBMedia>> {
    return await tmdb.getDiscoverMovies(page, params);
}
