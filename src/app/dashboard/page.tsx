import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/authOptions";
import { redirect } from "next/navigation";
import { getUserFavorites } from "./actions";
import { tmdb } from "@/lib/tmdb";
import { MovieCard } from "@/components/shared/MovieCard";

export default async function DashboardPage() {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
        redirect("/auth");
    }

    const { movies, series } = await getUserFavorites();

    return (
        <div className="container mx-auto px-4 pt-32 pb-12 min-h-screen">

            <div className="mb-12 border-b border-sky-800/30 pb-6">
                <h1 className="text-3xl font-bold text-white">Mi Panel</h1>
                <p className="text-sky-100/60 mt-2">Bienvenido, {session.user.name}</p>
            </div>

            <div className="space-y-12">

                {/* Favorite Movies */}
                <section>
                    <h2 className="text-2xl font-bold text-white mb-6">Mis Películas Favoritas</h2>
                    {movies.length > 0 ? (
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 gap-4 pt-2 pb-4 px-2 -mx-2">
                            {movies.map((item: any) => (
                                <MovieCard key={item.id} media={item} mediaType="movie" />
                            ))}
                        </div>
                    ) : (
                        <div className="p-8 text-center bg-sky-950/50 rounded-xl border border-sky-800/30 text-sky-100/50">
                            Aún no has añadido películas a tus favoritos.
                        </div>
                    )}
                </section>

                {/* Favorite Series */}
                <section>
                    <h2 className="text-2xl font-bold text-white mb-6">Mis Series Favoritas</h2>
                    {series.length > 0 ? (
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 gap-4 pt-2 pb-4 px-2 -mx-2">
                            {series.map((item: any) => (
                                <MovieCard key={item.id} media={item} mediaType="tv" />
                            ))}
                        </div>
                    ) : (
                        <div className="p-8 text-center bg-sky-950/50 rounded-xl border border-sky-800/30 text-sky-100/50">
                            Aún no has añadido series a tus favoritos.
                        </div>
                    )}
                </section>

            </div>
        </div>
    );
}
