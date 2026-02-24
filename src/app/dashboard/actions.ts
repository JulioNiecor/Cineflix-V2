"use server";

import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth/authOptions";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { rateLimit } from "@/lib/rateLimit";

export async function toggleFavoriteMovie(tmdbId: number, title: string, posterPath: string | null, voteAverage: number) {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) throw new Error("Unauthorized");

    const reqHeaders = await headers();
    const ip = reqHeaders.get("x-forwarded-for") || "unknown";
    const rateLimitRes = rateLimit(ip, { key: "favorite", limit: 100, windowMs: 60 * 1000 });
    if (!rateLimitRes.success) throw new Error("Too Many Requests");

    const user = await prisma.user.findUnique({ where: { email: session.user.email } });
    if (!user) throw new Error("User not found");

    const existing = await prisma.userMediaList.findUnique({
        where: { userId_tmdbId_listType: { userId: user.id, tmdbId, listType: "FAVORITE" } }
    });

    if (existing) {
        await prisma.userMediaList.delete({ where: { id: existing.id } });
    } else {
        await prisma.userMediaList.create({
            data: {
                userId: user.id,
                tmdbId,
                mediaType: "MOVIE",
                listType: "FAVORITE",
                title,
                posterPath,
                voteAverage
            }
        });
    }
    revalidatePath("/dashboard");
}

export async function toggleFavoriteSeries(tmdbId: number, title: string, posterPath: string | null, voteAverage: number) {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) throw new Error("Unauthorized");

    const reqHeaders = await headers();
    const ip = reqHeaders.get("x-forwarded-for") || "unknown";
    const rateLimitRes = rateLimit(ip, { key: "favorite", limit: 100, windowMs: 60 * 1000 });
    if (!rateLimitRes.success) throw new Error("Too Many Requests");

    const user = await prisma.user.findUnique({ where: { email: session.user.email } });
    if (!user) throw new Error("User not found");

    const existing = await prisma.userMediaList.findUnique({
        where: { userId_tmdbId_listType: { userId: user.id, tmdbId, listType: "FAVORITE" } }
    });

    if (existing) {
        await prisma.userMediaList.delete({ where: { id: existing.id } });
    } else {
        await prisma.userMediaList.create({
            data: {
                userId: user.id,
                tmdbId,
                mediaType: "TV",
                listType: "FAVORITE",
                title,
                posterPath,
                voteAverage
            }
        });
    }
    revalidatePath("/dashboard");
}

export async function getUserFavorites() {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) return { movies: [], series: [] };

    const user = await prisma.user.findUnique({
        where: { email: session.user.email },
        select: {
            id: true,
            email: true,
            name: true,
            image: true,
            userMediaList: {
                where: { listType: "FAVORITE" },
                orderBy: { createdAt: "desc" }
            }
        }
    });

    const list = user?.userMediaList || [];

    return {
        movies: list.filter((m: any) => m.mediaType === "MOVIE").map((m: any) => ({
            id: m.tmdbId,
            title: m.title,
            poster_path: m.posterPath,
            vote_average: m.voteAverage,
            media_type: "movie"
        })),
        series: list.filter((s: any) => s.mediaType === "TV").map((s: any) => ({
            id: s.tmdbId,
            name: s.title,
            title: s.title, // Fallback for components that carelessly use title
            poster_path: s.posterPath,
            vote_average: s.voteAverage,
            media_type: "tv"
        }))
    };
}
