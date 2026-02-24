"use server";

import { tmdb } from "@/lib/tmdb";
import { prisma } from "@/lib/prisma";
import crypto from "crypto";
import util from "util";
import { z } from "zod";
import { headers } from "next/headers";
import { rateLimit } from "@/lib/rateLimit";

// --- TMDB Actions ---

export async function getTrailerKey(tmdbId: number | string, mediaType: "movie" | "tv") {
    try {
        const data = mediaType === "tv"
            ? await tmdb.getSeriesDetails(tmdbId)
            : await tmdb.getMovieDetails(tmdbId);

        const trailer = data.videos?.results?.find((v: any) => v.type === "Trailer" && v.site === "YouTube");
        return trailer?.key || null;
    } catch (error) {
        console.error("Error fetching trailer:", error);
        return null;
    }
}

// --- Auth Actions ---

const pbkdf2 = util.promisify(crypto.pbkdf2);

const RegisterSchema = z.object({
    name: z.string()
        .min(2, "El nombre debe tener al menos 2 caracteres")
        .max(50, "El nombre es demasiado largo")
        .regex(/^[a-zA-Z0-9\s-_]+$/, "El nombre solo puede contener letras, números, espacios, guiones y guiones bajos"),
    email: z.string().email("Correo electrónico inválido").max(100),
    password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres").max(100, "La contraseña no puede exceder los 100 caracteres"),
});

export async function registerUser(data: any) {
    try {
        const reqHeaders = await headers();
        const ip = reqHeaders.get("x-forwarded-for") || "unknown";

        // Protección Anti-Spam / Anti-DDoS
        const rateLimitRes = rateLimit(ip, {
            key: "register",
            limit: 5, // Máximo 5 intentos
            windowMs: 15 * 60 * 1000 // Por cada 15 minutos
        });

        // CSRF Server-Side Protection
        const origin = reqHeaders.get("origin") || reqHeaders.get("referer");
        if (origin && !origin.includes(process.env.NEXTAUTH_URL?.replace("https://", "")?.replace("http://", "") || "localhost:3000")) {
            return { error: "Acción no permitida desde este origen." };
        }

        const validatedData = RegisterSchema.safeParse(data);

        if (!validatedData.success) {
            return { error: validatedData.error.issues[0]?.message || "Datos inválidos" };
        }

        const { name, email, password } = validatedData.data;

        const exists = await prisma.user.findUnique({
            where: { email },
        });

        if (exists) {
            return { error: "El correo ya está en uso" };
        }

        const salt = crypto.randomBytes(16).toString("hex");
        const derivedKey = await pbkdf2(password, salt, 100000, 64, "sha512");
        const hashedPassword = `${salt}:${derivedKey.toString("hex")}`;

        const user = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
            },
        });

        return { success: true, user: { id: user.id, email: user.email } };
    } catch (error: any) {
        console.error("REGISTRATION ACTION ERROR:", error);
        return { error: "Error interno del servidor al crear cuenta" };
    }
}
