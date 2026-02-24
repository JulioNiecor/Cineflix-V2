
import { Metadata } from "next";
import { tmdb } from "@/lib/tmdb";
import { ContentGrid } from "@/components/shared/ContentGrid";
import { fetchMoreMovies } from "./actions";
import { FilterBar } from "@/components/shared/FilterBar";
import { AnimatedSection } from "@/components/shared/AnimatedSection";

export const metadata: Metadata = {
    title: "Películas",
    description: "Explora las mejores películas, desde estrenos hasta clásicos atemporales.",
};

interface Props {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function MoviesPage({ searchParams }: Props) {
    const resolvedParams = await searchParams;
    const genre = typeof resolvedParams.genre === "string" ? resolvedParams.genre : "";
    const year = typeof resolvedParams.year === "string" ? resolvedParams.year : "";
    const sort = typeof resolvedParams.sort === "string" ? resolvedParams.sort : "popularity.desc";

    const apiParams: Record<string, string> = {
        sort_by: sort,
    };
    if (genre) apiParams.with_genres = genre;
    if (year) apiParams.primary_release_year = year;

    const [initialData, genresRes] = await Promise.all([
        tmdb.getDiscoverMovies(1, apiParams),
        tmdb.getMovieGenres()
    ]);

    // Bind the active filters to the Server Action so infinite scroll remembers them
    const loadMoreAction = fetchMoreMovies.bind(null, apiParams);

    return (
        <div className="container mx-auto px-4 pt-24 pb-8">
            <AnimatedSection direction="up" delay={0.1}>
                <div className="mb-8 space-y-2">
                    <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight">Películas</h1>
                    <p className="text-sky-100/60 max-w-2xl">
                        Descubre un catálogo infinito de películas para todos los gustos. Utiliza los filtros para
                        encontrar exactamente lo que buscas.
                    </p>
                </div>
            </AnimatedSection>

            <AnimatedSection direction="up" delay={0.2} className="space-y-6">
                <FilterBar genres={genresRes.genres} type="movie" />

                <ContentGrid
                    key={`${genre}-${year}-${sort}`}
                    initialData={initialData}
                    mediaType="movie"
                    fetchAction={loadMoreAction}
                />
            </AnimatedSection>
        </div>
    );
}
