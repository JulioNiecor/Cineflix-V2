"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { signIn } from "next-auth/react";
import { Film, Github, Loader2 } from "lucide-react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

// Lazy-load forms to reduce initial JS payload
const LoginForm = dynamic(() => import("@/components/auth/LoginForm").then(mod => mod.LoginForm), {
    loading: () => <div className="h-48 flex items-center justify-center text-sky-400"><Loader2 className="w-8 h-8 animate-spin" /></div>
});
const RegisterForm = dynamic(() => import("@/components/auth/RegisterForm").then(mod => mod.RegisterForm), {
    loading: () => <div className="h-48 flex items-center justify-center text-sky-400"><Loader2 className="w-8 h-8 animate-spin" /></div>
});

type AuthMode = "login" | "register";

export function AuthFlow() {
    const [mode, setMode] = useState<AuthMode>("login");

    return (
        <div className="w-full max-w-md mx-auto space-y-8">
            {/* Header / Logo */}
            <div className="flex flex-col items-center justify-center space-y-4">
                <Link href="/" className="flex items-center gap-2 group">
                    <Film className="w-12 h-12 text-sky-400 drop-shadow-md group-hover:text-sky-300 transition-colors" />
                    <span className="text-4xl font-bold tracking-tight text-white group-hover:text-sky-50 transition-colors">
                        Cineflix
                    </span>
                </Link>
                <p className="text-sky-100/60 text-center text-sm">
                    {mode === "login"
                        ? "Bienvenido de nuevo. Accede a tu cuenta."
                        : "Únete a Cineflix para desbloquear todo el contenido."}
                </p>
            </div>

            {/* Glass Container */}
            <motion.div
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="relative overflow-hidden rounded-2xl border border-sky-500/30 bg-sky-950/80 p-6 md:p-8 shadow-2xl backdrop-blur-md will-change-[transform,opacity,height,backdrop-filter] [transform:translateZ(0)]"
            >
                {/* Animated Toggle Tabs */}
                <div className="relative flex w-full p-1 bg-sky-950/50 rounded-xl mb-8 border border-sky-800/50 isolate">
                    <button
                        onClick={() => setMode("login")}
                        className={cn(
                            "relative z-10 w-1/2 py-2.5 text-sm font-semibold transition-colors duration-200 cursor-pointer rounded-lg",
                            mode === "login" ? "text-white" : "text-sky-100/50 hover:text-sky-300"
                        )}
                    >
                        {mode === "login" && (
                            <motion.div
                                layoutId="activeTab"
                                className="absolute inset-0 bg-sky-600/50 rounded-lg border border-sky-500/50 -z-10 will-change-transform [transform:translateZ(0)]"
                                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                            />
                        )}
                        Iniciar Sesión
                    </button>
                    <button
                        onClick={() => setMode("register")}
                        className={cn(
                            "relative z-10 w-1/2 py-2.5 text-sm font-semibold transition-colors duration-200 cursor-pointer rounded-lg",
                            mode === "register" ? "text-white" : "text-sky-100/50 hover:text-sky-300"
                        )}
                    >
                        {mode === "register" && (
                            <motion.div
                                layoutId="activeTab"
                                className="absolute inset-0 bg-sky-600/50 rounded-lg border border-sky-500/50 -z-10 will-change-transform [transform:translateZ(0)]"
                                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                            />
                        )}
                        Registrarse
                    </button>
                </div>

                {/* Form Transition Area */}
                <div className="relative w-full">
                    {mode === "login" ? <LoginForm /> : <RegisterForm />}
                </div>

                {/* Social Login Separator */}
                <div className="relative mt-8">
                    <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t border-sky-800/50" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-sky-950/90 px-2 text-sky-100/50 rounded-full">O continúa con</span>
                    </div>
                </div>

                {/* Social Login Buttons */}
                <div className="grid grid-cols-2 gap-4 mt-6">
                    <Button
                        variant="outline"
                        className="w-full gap-2 border-sky-800/50 hover:bg-sky-800/30"
                        onClick={() => signIn("google", { callbackUrl: "/" })}
                    >
                        <svg className="w-4 h-4" viewBox="0 0 24 24">
                            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.01v2.84C3.82 20.53 7.63 23 12 23z" fill="#34A853" />
                            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.01C1.33 8.41 1 9.94 1 11.5s.33 3.09 1.01 4.43l3.83-2.84z" fill="#FBBC05" />
                            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.63 1 3.82 3.47 2.01 7.07l3.83 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                        </svg>
                        Google
                    </Button>
                    <Button
                        variant="outline"
                        className="w-full gap-2 border-sky-800/50 hover:bg-sky-800/30"
                        onClick={() => signIn("github", { callbackUrl: "/" })}
                    >
                        <Github className="w-4 h-4" />
                        GitHub
                    </Button>
                </div>
            </motion.div>
        </div>
    );
}

