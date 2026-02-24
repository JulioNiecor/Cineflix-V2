import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import GithubProvider from "next-auth/providers/github";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import crypto from "crypto";
import util from "util";
import type { Adapter } from "next-auth/adapters";
import { rateLimit } from "@/lib/rateLimit";

const pbkdf2 = util.promisify(crypto.pbkdf2);

async function verifyPassword(password: string, hash: string) {
    try {
        if (!hash.includes(":")) {
            // Fallback for bcrypt hashes if any exist
            const bcrypt = require("bcryptjs");
            return await bcrypt.compare(password, hash);
        }
        const [salt, key] = hash.split(":");
        if (!salt || !key) return false;
        const derivedKey = await pbkdf2(password, salt, 100000, 64, "sha512");
        return key === derivedKey.toString("hex");
    } catch {
        return false;
    }
}

export const authOptions: NextAuthOptions = {
    adapter: PrismaAdapter(prisma) as Adapter,
    session: {
        strategy: "jwt",
    },
    pages: {
        signIn: "/auth",
    },
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID || "",
            clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
        }),
        GithubProvider({
            clientId: process.env.GITHUB_CLIENT_ID || "",
            clientSecret: process.env.GITHUB_CLIENT_SECRET || "",
        }),
        CredentialsProvider({
            name: "credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials, req) {
                // Brute-Force Dictionary Attack Protection (Nivel Enterprise)
                // Usar cabeceras para rastrear la IP y bloquear intentos
                const forwardedFor = req?.headers?.["x-forwarded-for"];
                const ip = typeof forwardedFor === "string" ? forwardedFor.split(",")[0] : "unknown";
                const attemptKey = `login_${ip}_${credentials?.email}`;

                const rateLimitRes = rateLimit(attemptKey, {
                    key: "login_attempts",
                    limit: 5, // 5 Intentos máximos
                    windowMs: 5 * 60 * 1000 // Bloqueo de 5 Minutos
                });

                if (!rateLimitRes.success) {
                    throw new Error("⚠️ Cuenta bloqueada temporalmente por seguridad. Demasiados intentos fallidos. Espera 5 minutos.");
                }

                if (!credentials?.email || !credentials?.password) {
                    throw new Error("Credenciales inválidas");
                }

                const user = await prisma.user.findUnique({
                    where: { email: credentials.email },
                });

                if (!user || !user.password) {
                    throw new Error("El usuario no existe o se registró con OAuth");
                }

                const isPasswordValid = await verifyPassword(credentials.password, user.password);

                if (!isPasswordValid) {
                    throw new Error("Contraseña incorrecta");
                }

                return user;
            },
        }),
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
            }
            return token;
        },
        async session({ session, token }) {
            if (session.user) {
                (session.user as any).id = token.id;
            }
            return session;
        },
    },
    secret: process.env.NEXTAUTH_SECRET,
};
