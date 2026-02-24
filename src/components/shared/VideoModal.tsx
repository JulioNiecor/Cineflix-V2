"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { X, Play, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { getTrailerKey } from "@/app/actions";

interface VideoModalProps {
    youtubeKey?: string;
    tmdbId?: number | string;
    mediaType?: "movie" | "tv";
    title?: string;
    onOpenChange?: (isOpen: boolean) => void;
}

export function VideoModal({ youtubeKey, tmdbId, mediaType, title, onOpenChange }: VideoModalProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [mounted, setMounted] = useState(false);

    // Sync external callback
    useEffect(() => {
        if (onOpenChange) {
            onOpenChange(isOpen);
        }
    }, [isOpen, onOpenChange]);

    useEffect(() => {
        setMounted(true);
    }, []);

    const [activeKey, setActiveKey] = useState<string | null>(youtubeKey || null);
    const [isLoading, setIsLoading] = useState(false);
    const [isIframeReady, setIsIframeReady] = useState(false);
    const [error, setError] = useState(false);

    useEffect(() => {
        if (!isOpen) {
            // Reset state when closing but keep the fetched key
            setIsIframeReady(false);
            return;
        }

        let isMountedFlag = true;

        const loadVideo = async () => {
            // Delay iframe mounting slightly so the entrance CSS animation doesn't stutter (lag fix)
            setTimeout(() => {
                if (isMountedFlag) setIsIframeReady(true);
            }, 400);

            if (!activeKey && tmdbId && mediaType) {
                setIsLoading(true);
                setError(false);
                try {
                    const key = await getTrailerKey(tmdbId, mediaType);
                    if (isMountedFlag) {
                        if (key) setActiveKey(key);
                        else setError(true);
                    }
                } catch (e) {
                    if (isMountedFlag) setError(true);
                } finally {
                    if (isMountedFlag) setIsLoading(false);
                }
            }
        };

        loadVideo();
        return () => { isMountedFlag = false; };
    }, [isOpen, activeKey, tmdbId, mediaType]);

    const modalContent = isOpen && mounted ? (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-md p-4 animate-in fade-in duration-300 will-change-[backdrop-filter,opacity]">
            <div className="relative w-full max-w-5xl aspect-video bg-black rounded-xl overflow-hidden shadow-[0_0_50px_rgba(56,189,248,0.15)] animate-in zoom-in-95 duration-400 ease-out border border-white/10 will-change-[transform,opacity] [transform:translateZ(0)]">
                {/* Close Button */}
                <div className="absolute top-4 right-4 z-20">
                    <button
                        onClick={() => setIsOpen(false)}
                        className="p-2.5 bg-black/60 hover:bg-sky-500/80 text-white rounded-full transition-all duration-300 cursor-pointer backdrop-blur"
                        aria-label="Cerrar tráiler"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Loading State */}
                {(isLoading || (!isIframeReady && !error)) && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-sky-950/20 text-sky-400 gap-4">
                        <Loader2 className="w-10 h-10 animate-spin" />
                        <span className="text-sm font-medium animate-pulse">Cargando tráiler...</span>
                    </div>
                )}

                {/* Error State */}
                {error && !activeKey && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-sky-950/20 text-sky-200">
                        <p className="text-lg font-medium">No se encontró tráiler oficial.</p>
                    </div>
                )}

                {/* Iframe - Deferred mounting to stop lag */}
                {isIframeReady && activeKey && !isLoading && (
                    <iframe
                        className="w-full h-full animate-in fade-in duration-500 delay-100"
                        src={`https://www.youtube.com/embed/${activeKey}?autoplay=1&rel=0&modestbranding=1&enablejsapi=1`}
                        title={title || "Tráiler oficial"}
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                    />
                )}
            </div>
        </div>
    ) : null;

    return (
        <>
            <Button
                size="lg"
                onClick={() => setIsOpen(true)}
                className="gap-2 bg-white text-sky-950 hover:bg-sky-100 hover:shadow-glow-md cursor-pointer w-full sm:w-auto"
            >
                <Play className="w-5 h-5 fill-current" /> Reproducir Tráiler
            </Button>

            {modalContent && createPortal(modalContent, document.body)}
        </>
    );
}
