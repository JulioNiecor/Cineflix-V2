import { TMDBMedia, TMDBMediaDetail, TMDBResponse } from "@/types/tmdb";
import { cache } from "react";

const TMDB_BASE_URL = "https://api.themoviedb.org/3";
const TMDB_API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;

type FetchOptions = RequestInit & {
    params?: Record<string, string | number>;
    tags?: string[];
};

/**
 * Generic Fetcher with Default TMDB Options, Next.js ISR Caching & React Request Deduplication
 */
const fetchTMDB = cache(async <T>(endpoint: string, options: FetchOptions = {}): Promise<T> => {
    if (!TMDB_API_KEY) throw new Error("TMDB_API_KEY is not defined");

    const { params, tags, ...fetchOptions } = options;

    const searchParams = new URLSearchParams({
        api_key: TMDB_API_KEY,
        language: "es-ES",
        ...params,
    });

    const url = `${TMDB_BASE_URL}${endpoint}?${searchParams.toString()}`;

    const res = await fetch(url, {
        next: {
            revalidate: 3600, // Cache data for 1 hour by default
            tags: tags || [endpoint.replace(/\//g, "-")],
        },
        ...fetchOptions,
    });

    if (!res.ok) {
        throw new Error(`TMDB Error: ${res.status} - ${res.statusText}`);
    }

    return res.json();
});

/**
 * Image URL Helper
 */
export const getImageUrl = (path: string | null, size: "w185" | "w500" | "w1280" | "w1920" | "original" = "original") => {
    if (!path) return "/placeholder.jpg"; // Handle missing images gracefully in UI
    const targetSize = size === "original" ? "original" : size;
    return `https://image.tmdb.org/t/p/${targetSize}${path}`;
};


// --- API METHODS ---

export const tmdb = {
    getTrending: (type: "movie" | "tv" | "all" = "all", timeWindow: "day" | "week" = "week") => {
        return fetchTMDB<TMDBResponse<TMDBMedia>>(`/trending/${type}/${timeWindow}`);
    },

    getTopRatedMovies: () => {
        return fetchTMDB<TMDBResponse<TMDBMedia>>("/movie/top_rated");
    },

    getTopRatedSeries: () => {
        return fetchTMDB<TMDBResponse<TMDBMedia>>("/tv/top_rated");
    },

    getDiscoverMovies: (page = 1, params?: Record<string, string>) => {
        return fetchTMDB<TMDBResponse<TMDBMedia>>("/discover/movie", {
            params: { page, ...params },
        });
    },

    getDiscoverSeries: (page = 1, params?: Record<string, string>) => {
        return fetchTMDB<TMDBResponse<TMDBMedia>>("/discover/tv", {
            params: { page, ...params },
        });
    },

    getMovieDetails: (id: string | number) => {
        return fetchTMDB<TMDBMediaDetail>(`/movie/${id}`, {
            params: { append_to_response: "videos,credits,similar" }
        });
    },

    getSeriesDetails: (id: string | number) => {
        return fetchTMDB<TMDBMediaDetail>(`/tv/${id}`, {
            params: { append_to_response: "videos,credits,similar" }
        });
    },

    searchAll: (query: string, page = 1) => {
        return fetchTMDB<TMDBResponse<TMDBMedia>>("/search/multi", {
            params: { query, page: page.toString(), include_adult: "false" }
        });
    },

    getMovieGenres: () => {
        return fetchTMDB<{ genres: { id: number; name: string }[] }>("/genre/movie/list");
    },

    getSeriesGenres: () => {
        return fetchTMDB<{ genres: { id: number; name: string }[] }>("/genre/tv/list");
    }
};
