import { Metadata } from "next";
import { AuthFlow } from "@/components/auth/AuthFlow";
import { Suspense } from "react";

export const metadata: Metadata = {
    title: "Acceder",
    description: "Inicia sesión o regístrate en Cineflix para guardar tus favoritos.",
};

export default function AuthPage() {

    return (
        <div className="relative flex min-h-screen flex-col items-center justify-center p-4 bg-sky-950 overflow-hidden">
            {/* Full Screen Cinematic Background */}
            <div className="absolute inset-0 z-0">
                {/* Removed dynamic carousel image */}
                {/* Immersive Dark Gradients */}
                <div className="absolute inset-0 bg-sky-950/50" />
                <div className="absolute inset-0 bg-gradient-to-t from-sky-950 via-sky-950/60 to-sky-950/20 z-10" />
                <div className="absolute inset-0 bg-gradient-to-b from-sky-950/80 via-transparent to-transparent z-10" />
            </div>

            {/* Centered Form */}
            <div className="relative z-20 w-full max-w-[450px] mt-8">
                <Suspense fallback={<div className="h-[500px] rounded-2xl bg-sky-900/20 animate-pulse" />}>
                    <AuthFlow />
                </Suspense>
            </div>
        </div>
    );
}
