export interface TMDBMedia {
    id: number;
    title?: string;
    name?: string; // TV Series use 'name' instead of 'title'
    original_title?: string;
    original_name?: string;
    overview: string;
    poster_path: string | null;
    backdrop_path: string | null;
    media_type?: "movie" | "tv";
    genre_ids: number[];
    popularity: number;
    release_date?: string;
    first_air_date?: string;
    vote_average: number;
    vote_count: number;
}

export interface TMDBVideo {
    id: string;
    iso_639_1: string;
    iso_3166_1: string;
    name: string;
    key: string;
    site: string;
    size: number;
    type: string;
    official: boolean;
    published_at: string;
}

export interface TMDBResponse<T> {
    page: number;
    results: T[];
    total_pages: number;
    total_results: number;
}

export interface TMDBCast {
    id: number;
    name: string;
    original_name: string;
    profile_path: string | null;
    character: string;
    order: number;
}

export interface TMDBMediaDetail extends TMDBMedia {
    genres: { id: number; name: string }[];
    runtime?: number;
    episode_run_time?: number[];
    status: string;
    tagline: string;
    videos: { results: TMDBVideo[] };
    credits: { cast: TMDBCast[] };
    similar?: TMDBResponse<TMDBMedia>;
}
