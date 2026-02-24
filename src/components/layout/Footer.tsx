import Link from "next/link";
import { Film, Github } from "lucide-react";

export function Footer() {
    return (
        <footer className="border-t border-sky-800/30 bg-sky-950/80 backdrop-blur-md mt-auto transform-gpu will-change-[transform,backdrop-filter]">
            <div className="container mx-auto px-4 py-12">
                <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-10 text-center md:text-left max-w-6xl mx-auto w-full">

                    {/* Left Column: Brand & Info */}
                    <div className="flex flex-col items-center md:items-start space-y-4 max-w-sm">
                        <Link href="/" className="flex items-center justify-center md:justify-start gap-2 group">
                            <Film className="w-8 h-8 text-sky-400 group-hover:shadow-[0_0_15px_rgba(0,166,244,0.5)] rounded-full transition-all duration-300" />
                            <span className="text-xl font-bold tracking-tight text-white group-hover:text-sky-100 transition-colors">
                                Cineflix
                            </span>
                        </Link>
                        <p className="text-sky-100/60 mt-2 text-sm leading-relaxed">
                            La plataforma premium para descubrir tus próximas películas y series favoritas.
                            Utilizando la API de TheMovieDB.
                        </p>
                        <div className="flex justify-center md:justify-start gap-4 pt-2">
                            <a href="https://github.com/JulioNiecor" target="_blank" rel="noopener noreferrer" className="text-sky-400 hover:text-white transition-colors">
                                <Github className="w-6 h-6 hover:scale-110 transition-transform" />
                            </a>
                        </div>
                    </div>

                    {/* Right Column: Links */}
                    <div className="space-y-4 flex flex-col items-center md:items-end">
                        <h3 className="text-sm font-semibold text-white tracking-wider uppercase">Explorar</h3>
                        <ul className="flex flex-wrap justify-center md:justify-end gap-x-6 gap-y-3 text-sm text-sky-100/70">
                            <li><Link href="/" className="hover:text-sky-400 transition-colors">Inicio</Link></li>
                            <li><Link href="/movies" className="hover:text-sky-400 transition-colors">Películas</Link></li>
                            <li><Link href="/series" className="hover:text-sky-400 transition-colors">Series</Link></li>
                        </ul>
                    </div>

                </div>

                <div className="border-t border-sky-800/30 mt-12 pt-8 flex items-center justify-center text-xs text-sky-100/50 text-center">
                    <p>© {new Date().getFullYear()} Julio Nieto Cordón. Cineflix V2. Todos los derechos reservados.</p>
                </div>
            </div>
        </footer>
    );
}
