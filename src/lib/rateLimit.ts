// src/lib/rateLimit.ts
type RateLimitStore = {
    [ip: string]: {
        count: number;
        resetTime: number;
    };
};

const store: Record<string, RateLimitStore> = {};

interface RateLimitConfig {
    key: string;      // Identificador de la acción (ej. 'register', 'favorite')
    limit: number;    // Número máximo de peticiones
    windowMs: number; // Ventana de tiempo en milisegundos
}

/**
 * Limitador de Tráfico en Memoria (LRU Fallback para Next.js Server Actions)
 * No es 100% perfecto para despliegues Serverless Edge de múltiples instancias,
 * pero es extremadamente eficaz para instancias Node únicas o VPS.
 */
export function rateLimit(ip: string, config: RateLimitConfig): { success: boolean, remaining: number } {
    const now = Date.now();
    const { key, limit, windowMs } = config;

    // Inicializar el namespace de esta acción si no existe
    if (!store[key]) {
        store[key] = {};
    }

    const actionStore = store[key];

    // Limpiar entradas cacheadas expiradas de forma pasiva (Evitar memory leak)
    if (Math.random() < 0.05) { // 5% de probabilidad de ejecutar recolección de basura
        for (const [storedIp, data] of Object.entries(actionStore)) {
            if (data.resetTime < now) {
                delete actionStore[storedIp];
            }
        }
    }

    const userData = actionStore[ip];

    // Si no existe registro o el tiempo expiró, reiniciar
    if (!userData || userData.resetTime < now) {
        actionStore[ip] = {
            count: 1,
            resetTime: now + windowMs
        };
        return { success: true, remaining: limit - 1 };
    }

    // Incrementar contador
    userData.count += 1;

    if (userData.count > limit) {
        return { success: false, remaining: 0 };
    }

    return { success: true, remaining: limit - userData.count };
}
