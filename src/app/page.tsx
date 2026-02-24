import { tmdb } from "@/lib/tmdb";
import { HomeHero } from "@/components/shared/HomeHero";
import { Carousel } from "@/components/shared/Carousel";
import { MovieCard } from "@/components/shared/MovieCard";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/Skeleton";
import { AnimatedSection } from "@/components/shared/AnimatedSection";

export default async function Home() {
  // Fetch initial data concurrently for maximum performance
  const [trendingAll, moviesReq, seriesReq] = await Promise.all([
    tmdb.getTrending("all", "week"),
    tmdb.getTrending("movie", "day"),
    tmdb.getTrending("tv", "day"),
  ]);

  return (
    <div className="flex flex-col min-h-screen pb-20">

      {/* Hero Section with top 10 trending items */}
      <HomeHero trending={trendingAll.results.slice(0, 10)} />

      <div className="container mx-auto px-4 mt-12 space-y-20">

        {/* Trending Movies Section */}
        <AnimatedSection direction="up" delay={0.1}>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white tracking-tight">Películas en Tendencia</h2>
            <a href="/movies" className="text-sm text-sky-400 hover:text-sky-300 transition-colors">
              Ver todas
            </a>
          </div>
          <Suspense fallback={<CarouselSkeleton />}>
            <Carousel>
              {moviesReq.results.map((movie) => (
                <div key={movie.id} className="w-[180px] md:w-[220px] flex-none">
                  <MovieCard media={movie} mediaType="movie" />
                </div>
              ))}
            </Carousel>
          </Suspense>
        </AnimatedSection>

        {/* Trending Series Section */}
        <AnimatedSection direction="up" delay={0.2}>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white tracking-tight">Series en Tendencia</h2>
            <a href="/series" className="text-sm text-sky-400 hover:text-sky-300 transition-colors">
              Ver todas
            </a>
          </div>
          <Suspense fallback={<CarouselSkeleton />}>
            <Carousel>
              {seriesReq.results.map((series) => (
                <div key={series.id} className="w-[180px] md:w-[220px] flex-none">
                  <MovieCard media={series} mediaType="tv" />
                </div>
              ))}
            </Carousel>
          </Suspense>
        </AnimatedSection>

      </div>
    </div>
  );
}

function CarouselSkeleton() {
  return (
    <div className="flex gap-4 overflow-hidden py-4">
      {Array.from({ length: 6 }).map((_, i) => (
        <Skeleton key={i} className="w-[180px] md:w-[220px] aspect-[2/3] flex-none rounded-xl" />
      ))}
    </div>
  );
}
