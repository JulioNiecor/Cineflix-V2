import { Metadata, ResolvingMetadata } from "next";
import { tmdb } from "@/lib/tmdb";
import { MovieCard } from "@/components/shared/MovieCard";

interface Props {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export async function generateMetadata({ searchParams }: Props, parent: ResolvingMetadata): Promise<Metadata> {
    const resolvedParams = await searchParams;
    const query = typeof resolvedParams.q === "string" ? resolvedParams.q : "";
    return {
        title: `Resultados para "${query}" | Cineflix`,
        description: `Búsqueda en Cineflix para ${query}`,
    };
}

export default async function SearchPage({ searchParams }: Props) {
    const resolvedParams = await searchParams;
    const query = typeof resolvedParams.q === "string" ? resolvedParams.q : "";

    if (!query) {
        return (
            <div className="container mx-auto px-4 pt-24 pb-8 min-h-[50vh] flex flex-col items-center justify-center">
                <h1 className="text-3xl font-bold text-white mb-4">Búsqueda</h1>
                <p className="text-sky-100/60 text-lg">Introduce un término para buscar películas y series.</p>
            </div>
        );
    }

    const { results } = await tmdb.searchAll(query);
    const validResults = results.filter(m => m.media_type === "movie" || m.media_type === "tv");

    return (
        <div className="container mx-auto px-4 pt-24 pb-8 min-h-screen">
            <div className="mb-8 space-y-2">
                <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight">
                    Resultados para &quot;<span className="text-sky-400">{query}</span>&quot;
                </h1>
                <p className="text-sky-100/60 max-w-2xl">
                    Se han encontrado {validResults.length} resultados relevantes.
                </p>
            </div>

            {validResults.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 gap-4 md:gap-6 pt-2 pb-4 px-2 -mx-2">
                    {validResults.map((media) => (
                        <MovieCard
                            key={media.id}
                            media={media}
                            mediaType={media.media_type as "movie" | "tv"}
                        />
                    ))}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center min-h-[40vh] border border-sky-800/30 rounded-2xl bg-sky-950/20 glass">
                    <p className="text-xl text-sky-100/60 text-center px-4">
                        No se encontraron películas ni series para &quot;{query}&quot;.<br />
                        Prueba con otros términos.
                    </p>
                </div>
            )}
        </div>
    );
}
