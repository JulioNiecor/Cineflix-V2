"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { cn } from "@/lib/utils";
import { Film, User, LogOut, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { SearchBar } from "./SearchBar";
import { motion } from "framer-motion";

const NAV_LINKS = [
    { name: "Inicio", href: "/" },
    { name: "Películas", href: "/movies" },
    { name: "Series", href: "/series" },
];

export function Navbar() {
    const pathname = usePathname();
    const { data: session, status } = useSession();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    // Prevent Next.js/Browser from conflicting with Framer Motion layout shifts on reload
    useEffect(() => {
        if (typeof window !== "undefined") {
            window.history.scrollRestoration = "manual";
        }
    }, []);

    return (
        <motion.header
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed top-0 w-full z-50 transition-all duration-300 glass border-b border-sky-300/10 shadow-lg"
        >
            <div className="container mx-auto px-4 h-16 flex items-center justify-between z-50">

                {/* Mobile Menu Toggle & Logo */}
                <div className="flex items-center gap-3">
                    <button
                        className="md:hidden p-2 -ml-2 text-sky-200 hover:text-white transition-colors cursor-pointer"
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        aria-label="Abrir menú"
                    >
                        {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>
                    <Link href="/" className="flex items-center gap-2 group">
                        <Film className="w-8 h-8 text-sky-400 group-hover:shadow-[0_0_15px_rgba(0,166,244,0.5)] rounded-full transition-all duration-300" />
                        <span className="text-xl font-bold tracking-tight text-white group-hover:text-sky-100 transition-colors hidden sm:block">
                            Cineflix
                        </span>
                    </Link>
                </div>

                {/* Desktop Nav */}
                <nav className="hidden md:flex items-center gap-4 py-2 absolute left-1/2 -translate-x-1/2">
                    {NAV_LINKS.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={cn(
                                "relative px-2 py-1 text-sm font-medium transition-colors duration-300",
                                "after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-full after:bg-sky-400 after:origin-left after:transition-transform after:duration-300",
                                pathname === link.href
                                    ? "text-sky-300 after:scale-x-100"
                                    : "text-sky-100/70 hover:text-white after:scale-x-0 hover:after:scale-x-100"
                            )}
                        >
                            {link.name}
                        </Link>
                    ))}
                </nav>

                {/* Actions Container */}
                <div className="flex items-center gap-2 sm:gap-4">
                    <SearchBar />

                    {status === "loading" ? (
                        <div className="w-20 h-8 skeleton rounded-full hidden sm:block" />
                    ) : session?.user ? (
                        <div className="flex items-center gap-2">
                            <Link href="/dashboard" className="hidden sm:flex items-center gap-2 text-sky-100/90 hover:text-white hover:bg-sky-800/30 px-4 py-2 rounded-full transition-colors text-sm font-medium border border-sky-500/20">
                                <User className="w-4 h-4 text-sky-400" />
                                <span className="hidden lg:inline-block">Mi Panel</span>
                            </Link>
                            <span className="hidden lg:inline-block text-sm text-sky-100 font-medium ml-2 border-l border-sky-800/50 pl-4">
                                {session.user.name?.split(" ")[0]}
                            </span>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="text-sky-100 hover:text-red-400 hover:bg-red-400/10 rounded-full transition-colors hidden sm:flex"
                                onClick={() => signOut()}
                                title="Cerrar sesión"
                            >
                                <LogOut className="w-4 h-4" />
                            </Button>
                        </div>
                    ) : (
                        <Link href="/auth" className="hidden sm:block">
                            <Button variant="glass" size="sm" className="gap-2 rounded-full">
                                <User className="w-4 h-4" />
                                <span>Entrar</span>
                            </Button>
                        </Link>
                    )}
                </div>
            </div>

            {/* Mobile Menu Overlay */}
            <div
                className={cn(
                    "md:hidden absolute top-16 left-0 w-full bg-sky-950/95 backdrop-blur-xl border-b border-sky-800/50 shadow-2xl transition-all duration-300 overflow-hidden transform origin-top will-change-[transform,opacity,height] [transform:translateZ(0)]",
                    isMobileMenuOpen ? "opacity-100 scale-y-100 max-h-[500px]" : "opacity-0 scale-y-95 max-h-0 pointer-events-none"
                )}
            >
                <div className="flex flex-col p-4 gap-2">
                    {NAV_LINKS.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            onClick={() => setIsMobileMenuOpen(false)}
                            className={cn(
                                "px-4 py-3 rounded-xl text-base font-medium transition-all duration-300",
                                pathname === link.href
                                    ? "bg-sky-500/20 text-sky-300"
                                    : "text-sky-100/80 hover:bg-sky-900/50 hover:text-white"
                            )}
                        >
                            {link.name}
                        </Link>
                    ))}

                    <div className="h-px w-full bg-sky-800/50 my-2" />

                    {session?.user ? (
                        <>
                            <Link
                                href="/dashboard"
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="flex items-center gap-3 px-4 py-3 rounded-xl text-sky-300 font-medium hover:bg-sky-500/20 transition-colors w-full"
                            >
                                <User className="w-5 h-5" /> Mi Panel
                            </Link>
                            <button
                                onClick={() => { signOut(); setIsMobileMenuOpen(false); }}
                                className="flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 font-medium hover:bg-red-500/10 transition-colors w-full text-left"
                            >
                                <LogOut className="w-5 h-5" /> Cerrar sesión ({session.user.name?.split(" ")[0]})
                            </button>
                        </>
                    ) : (
                        <Link
                            href="/auth"
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="flex items-center gap-3 px-4 py-3 rounded-xl text-sky-300 font-medium hover:bg-sky-500/20 transition-colors w-full"
                        >
                            <User className="w-5 h-5" /> Iniciar sesión
                        </Link>
                    )}
                </div>
            </div>
        </motion.header>
    );
}
