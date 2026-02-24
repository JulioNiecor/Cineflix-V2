"use client";

import { useOptimistic, useTransition } from "react";
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { toggleFavoriteMovie, toggleFavoriteSeries } from "@/app/dashboard/actions";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { toast } from "sonner";

interface FavoriteButtonProps {
    tmdbId: number;
    mediaType: "movie" | "tv";
    initialIsFavorite: boolean;
    title: string;
    posterPath: string | null;
    voteAverage: number;
}

export function FavoriteButton({ tmdbId, mediaType, initialIsFavorite, title, posterPath, voteAverage }: FavoriteButtonProps) {
    const { status } = useSession();
    const router = useRouter();
    const [isPending, startTransition] = useTransition();

    const [optimisticIsFavorite, addOptimisticToggle] = useOptimistic(
        initialIsFavorite,
        (state: boolean) => !state
    );

    const handleToggle = () => {
        if (status === "unauthenticated") {
            toast.error("Inicia sesión para guardar favoritos.");
            router.push("/auth");
            return;
        }

        const isAdding = !optimisticIsFavorite;

        startTransition(() => {
            addOptimisticToggle(isAdding);

            const promise = mediaType === "movie"
                ? toggleFavoriteMovie(tmdbId, title, posterPath, voteAverage)
                : toggleFavoriteSeries(tmdbId, title, posterPath, voteAverage);

            toast.promise(promise, {
                loading: "Actualizando listas...",
                success: isAdding ? "Añadida a Favoritos" : "Eliminada de Favoritos",
                error: "Inicia sesión para poder guardar favoritos."
            });
        });
    };

    return (
        <Button
            variant={optimisticIsFavorite ? "default" : "glass"}
            size="lg"
            onClick={handleToggle}
            disabled={isPending || status === "loading"}
            className="gap-2 min-w-[200px]"
        >
            <Heart className={`w-5 h-5 ${optimisticIsFavorite ? "fill-current" : ""}`} />
            {optimisticIsFavorite ? "Quitar de Favoritos" : "Guardar en Favoritos"}
        </Button>
    );
}
