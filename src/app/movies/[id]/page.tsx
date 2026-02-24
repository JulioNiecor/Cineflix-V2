import { Metadata, ResolvingMetadata } from "next";
import Image from "next/image";
import { Star, Clock, CalendarDays, Play } from "lucide-react";
import { tmdb, getImageUrl } from "@/lib/tmdb";
import { Button } from "@/components/ui/Button";
import { Carousel } from "@/components/shared/Carousel";
import { MovieCard } from "@/components/shared/MovieCard";
import { FavoriteButton } from "@/components/shared/FavoriteButton";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/authOptions";
import { prisma } from "@/lib/prisma";
import { AnimatedSection } from "@/components/shared/AnimatedSection";
import { VideoModal } from "@/components/shared/VideoModal";
interface Props {
    params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props, parent: ResolvingMetadata): Promise<Metadata> {
    const resolvedParams = await params;
    const movie = await tmdb.getMovieDetails(resolvedParams.id);
    const previousImages = (await parent).openGraph?.images || [];
    const bannerUrl = getImageUrl(movie.backdrop_path || movie.poster_path, "w1280");

    return {
        title: `${movie.title} | Cineflix`,
        description: movie.overview || "Descubre todo sobre esta película en Cineflix V2.",
        openGraph: {
            title: `${movie.title} | Cineflix`,
            description: movie.overview || "Descubre todo sobre esta película en Cineflix V2.",
            images: [bannerUrl, ...previousImages],
            type: "video.movie",
        },
        twitter: {
            card: "summary_large_image",
            title: `${movie.title} | Cineflix`,
            description: movie.overview || "Descubre todo sobre esta película en Cineflix V2.",
            images: [bannerUrl],
        },
    };
}

export default async function MovieDetailPage({ params }: Props) {
    const resolvedParams = await params;

    // Parallelize TMDB fetch and Session fetch
    const [movie, session] = await Promise.all([
        tmdb.getMovieDetails(resolvedParams.id),
        getServerSession(authOptions)
    ]);

    // Check if favorited initially
    let initialIsFavorite = false;
    if (session?.user?.email) {
        const user = await prisma.user.findUnique({ where: { email: session.user.email } });
        if (user) {
            const existing = await prisma.userMediaList.findUnique({
                where: { userId_tmdbId_listType: { userId: user.id, tmdbId: Number(resolvedParams.id), listType: "FAVORITE" } }
            });
            initialIsFavorite = !!existing;
        }
    }

    const year = movie.release_date ? new Date(movie.release_date).getFullYear() : "";
    const trailer = movie.videos?.results?.find((v) => v.type === "Trailer" && v.site === "YouTube");

    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "Movie",
        name: movie.title,
        image: getImageUrl(movie.poster_path, "w500"),
        description: movie.overview,
        datePublished: movie.release_date,
        aggregateRating: movie.vote_average ? {
            "@type": "AggregateRating",
            ratingValue: movie.vote_average.toFixed(1),
            bestRating: "10",
            worstRating: "1",
        } : undefined,
    };

    return (
        <div className="flex flex-col min-h-screen">
            {/* Inject JSON-LD Rich Snippet for SEO */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />

            {/* Hero Backdrop Segment */}
            <div className="relative w-full h-[60vh] md:h-[80vh]">
                <Image
                    src={getImageUrl(movie.backdrop_path || movie.poster_path, "w1920")}
                    alt={movie.title || "Movie Backdrop"}
                    fill
                    sizes="100vw"
                    quality={85}
                    className="object-cover object-top"
                    priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-sky-950 via-sky-950/60 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-r from-sky-950 via-sky-950/40   to-transparent" />

                <div className="absolute bottom-0 left-0 w-full">
                    <div className="container mx-auto px-4 md:px-8 pb-12 flex flex-col md:flex-row gap-8 items-end">

                        {/* Floating Poster */}
                        <div className="hidden md:block flex-shrink-0 w-64 rounded-xl overflow-hidden shadow-glow-lg border border-sky-500/30 transform translate-y-16">
                            <Image
                                src={getImageUrl(movie.poster_path, "w500")}
                                alt={movie.title || ""}
                                width={256}
                                height={384}
                                className="w-full h-auto object-cover"
                                priority
                            />
                        </div>

                        {/* Title and Metadata */}
                        <AnimatedSection direction="up" delay={0.2} className="flex-1 space-y-4">
                            <h1 className="text-4xl md:text-6xl font-bold text-white tracking-tight drop-shadow-md">
                                {movie.title}
                            </h1>

                            <div className="flex flex-wrap items-center gap-4 text-sm text-sky-100/90 font-medium">
                                <span className="flex items-center gap-1 bg-black/40 px-2 py-1 rounded backdrop-blur border border-white/10">
                                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                                    {movie.vote_average.toFixed(1)} / 10
                                </span>
                                {movie.runtime && (
                                    <span className="flex items-center gap-1">
                                        <Clock className="w-4 h-4" />
                                        {movie.runtime} min
                                    </span>
                                )}
                                {year && (
                                    <span className="flex items-center gap-1">
                                        <CalendarDays className="w-4 h-4" />
                                        {year}
                                    </span>
                                )}
                                <div className="flex gap-2">
                                    {movie.genres?.map(g => (
                                        <span key={g.id} className="bg-sky-500/20 text-sky-300 px-2 py-0.5 rounded border border-sky-400/20">
                                            {g.name}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            {movie.tagline && (
                                <p className="text-sky-300 italic text-lg drop-shadow">{movie.tagline}</p>
                            )}

                            <div className="flex flex-wrap gap-4 pt-4">
                                {trailer ? (
                                    <VideoModal youtubeKey={trailer.key} title={`${movie.title} Tráiler`} />
                                ) : null}

                                <FavoriteButton
                                    tmdbId={movie.id}
                                    mediaType="movie"
                                    initialIsFavorite={initialIsFavorite}
                                    title={movie.title || "Untitled"}
                                    posterPath={movie.poster_path}
                                    voteAverage={movie.vote_average || 0}
                                />
                            </div>
                        </AnimatedSection>
                    </div>
                </div>
            </div>

            {/* Main Content Body (Below Fold) */}
            <div className="container mx-auto px-4 md:px-8 py-16 md:pt-24 space-y-16">

                {/* Overview Row */}
                <AnimatedSection direction="up" delay={0.1}>
                    <section className="max-w-4xl">
                        <h2 className="text-2xl font-bold text-white mb-4">Sinopsis</h2>
                        <p className="text-sky-100/70 text-lg leading-relaxed">
                            {movie.overview || "No hay sinopsis disponible."}
                        </p>
                    </section>
                </AnimatedSection>

                {/* Cast Carousel */}
                {movie.credits?.cast && movie.credits.cast.length > 0 && (
                    <AnimatedSection direction="up" delay={0.2}>
                        <section>
                            <h2 className="text-2xl font-bold text-white mb-6">Reparto Principal</h2>
                            <Carousel className="pb-4">
                                {movie.credits.cast.slice(0, 15).map(actor => (
                                    <div key={actor.id} className="w-[140px] flex-none group">
                                        <div className="aspect-[2/3] rounded-lg overflow-hidden bg-sky-900/50 mb-3 border border-sky-800/30 group-hover:border-sky-500/50 transition-colors">
                                            <Image
                                                src={getImageUrl(actor.profile_path, "w185")}
                                                alt={actor.name}
                                                width={140}
                                                height={210}
                                                className="w-full h-full object-cover"
                                                loading="lazy"
                                                decoding="async"
                                            />
                                        </div>
                                        <h4 className="text-sm font-semibold text-sky-50 line-clamp-1">{actor.name}</h4>
                                        <p className="text-xs text-sky-100/60 line-clamp-1">{actor.character}</p>
                                    </div>
                                ))}
                            </Carousel>
                        </section>
                    </AnimatedSection>
                )}

                {/* Similar Recommendations */}
                {movie.similar?.results && movie.similar.results.length > 0 && (
                    <AnimatedSection direction="up" delay={0.3}>
                        <section>
                            <h2 className="text-2xl font-bold text-white mb-6">Títulos Similares</h2>
                            <Carousel>
                                {movie.similar.results.map((sim: any) => (
                                    <div key={sim.id} className="w-[180px] md:w-[220px] flex-none">
                                        <MovieCard media={sim} mediaType="movie" />
                                    </div>
                                ))}
                            </Carousel>
                        </section>
                    </AnimatedSection>
                )}

            </div>
        </div>
    );
}
