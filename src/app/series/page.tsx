import { Metadata } from "next";
import { tmdb } from "@/lib/tmdb";
import { ContentGrid } from "@/components/shared/ContentGrid";
import { fetchMoreSeries } from "./actions";
import { FilterBar } from "@/components/shared/FilterBar";
import { AnimatedSection } from "@/components/shared/AnimatedSection";

export const metadata: Metadata = {
    title: "Series ",
    description: "Sumérgete en historias fascinantes con las mejores series de televisión.",
};

interface Props {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function SeriesPage({ searchParams }: Props) {
    const resolvedParams = await searchParams;
    const genre = typeof resolvedParams.genre === "string" ? resolvedParams.genre : "";
    const year = typeof resolvedParams.year === "string" ? resolvedParams.year : "";
    const sort = typeof resolvedParams.sort === "string" ? resolvedParams.sort : "popularity.desc";

    const apiParams: Record<string, string> = {
        sort_by: sort,
    };
    if (genre) apiParams.with_genres = genre;
    if (year) apiParams.first_air_date_year = year;

    const [initialData, genresRes] = await Promise.all([
        tmdb.getDiscoverSeries(1, apiParams),
        tmdb.getSeriesGenres()
    ]);

    const loadMoreAction = fetchMoreSeries.bind(null, apiParams);

    return (
        <div className="container mx-auto px-4 pt-24 pb-8">
            <AnimatedSection direction="up" delay={0.1}>
                <div className="mb-8 space-y-2">
                    <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight">Series</h1>
                    <p className="text-sky-100/60 max-w-2xl">
                        Temporada tras temporada, encuentra las historias que te mantendrán pegado a la pantalla.
                    </p>
                </div>
            </AnimatedSection>

            <AnimatedSection direction="up" delay={0.2} className="space-y-6">
                <FilterBar genres={genresRes.genres} type="tv" />

                <ContentGrid
                    key={`${genre}-${year}-${sort}`}
                    initialData={initialData}
                    mediaType="tv"
                    fetchAction={loadMoreAction}
                />
            </AnimatedSection>
        </div>
    );
}
