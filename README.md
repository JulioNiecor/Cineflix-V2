# 🎬 Cineflix V2

Un clon moderno, ultra-rápido y seguro de plataformas de streaming, construido desde cero con las últimas tecnologías del ecosistema React. Cineflix V2 te permite explorar, buscar y guardar en tus listas de favoritos miles de películas y series en tiempo real consumiendo la API de TMDB.

## 🚀 Características Principales

- **Catálogo Dinámico:** Integración en vivo con *The Movie Database (TMDB)* para mostrar los últimos estrenos, películas populares y series del momento.
- **Scroll Infinito y Paginación Transparente:** Navega por cientos de películas sin cambiar de página gracias a la detección de intersección (Intersection Observer) que carga nuevos elementos a medida que bajas.
- **Rendimiento Extremo (Lazy Loading):** Las portadas y componentes pesados se diferencian mediante carga perezosa (`next/image` y React Lazy), priorizando la visualización del contenido vital (Above-The-Fold) para un TTI (Time to Interactive) casi instantáneo.
- **UX Inmersiva con Skeleton Previews:** Durante las cargas de red (Data Fetching), la aplicación muestra *esqueletos animados* que imitan la forma del contenido final impulsado por `Suspense`, evitando el temido *Layout Shift* y las pantallas en blanco.
- **Búsqueda Avanzada:** Motor de búsqueda en tiempo real segmentado por Películas y Series.
- **Autenticación Completa:** Sistema de cuentas protegido por **NextAuth.js**. Soporta inicio de sesión con Credenciales customizadas o inicios rápidos sociales (Google y GitHub OAuth).
- **Listas de Favoritos Interactivas:** Añade películas o series a tu Panel Personal (*Dashboard*) con un solo clic. Funciona mediante un sistema asíncrono optimizado sin esperas perceptibles (*Optimistic Updates & Sonner Promises*).
- **Diseño Glassmorphism Premium:** Interfaz de usuario (UI) diseñada con Tailwind CSS, ofreciendo fondos inmersivos de pantalla completa, desenfoques cristalinos, carruseles infinitos y animaciones fluidas a 60FPS con Framer Motion.
- **Reproductor de Tráilers:** Modal integrado para reproducir automáticamente los tráilers de YouTube de cualquier título.

---

## 🛠️ Stack Tecnológico

El proyecto está construido sobre las arquetipuras más modernas para garantizar SEO, velocidad y escalabilidad:

- **Framework:** [Next.js 15](https://nextjs.org/) (App Router, Server Actions, React Compiler activado).
- **Lenguaje:** TypeScript estricto.
- **Base de Datos:** [MySQL](https://www.mysql.com/) manejada a través del ORM [Prisma](https://www.prisma.io/) (Consultas Preparadas & Zero N+1 Queries).
- **Autenticación:** [NextAuth.js](https://next-auth.js.org/) (JSON Web Encryption AES-256).
- **Estilos:** Vanilla [Tailwind CSS v3](https://tailwindcss.com/) + Micro-animaciones.
- **Validación del Servidor:** [Zod](https://zod.dev/).
- **Notificaciones UI:** [Sonner](https://sonner.emilkowal.ski/).

---

## 🛡️ Arquitectura de Seguridad (Nivel Enterprise)

Cineflix V2 no es solo un frontend bonito; su backend Node.js está fuertemente acorazado contra ciberataques modernos:

1. **Anti-SQL Injections:** Todo el tráfico SQL está sanitizado nativamente mediante sentencias preparadas por el motor de Prisma.
2. **Defensa DDoS & Bot Spam (Rate Limiting en Memoria):** Un algoritmo interno *Sliding Window* rechaza el tráfico abusivo. Limita los intentos de registro a 5 cada 15 minutos por IP, evadiendo caídas del servidor por ataques volumétricos.
3. **Bloqueo de Fuerza Bruta (NextAuth Lockout):** El middleware intercepta el login; si adivinan contraseñas incorrectamente 5 veces, la cuenta es bloqueada temporalmente para derribar los ataques de diccionario (*Dictionary Attacks*).
4. **Zero Data-Exposure (DTOs):** Las consultas de servidor aíslan matemáticamente el hash criptográfico de contraseñas (`PBKDF2`) usando selectores estrictos en Prisma, asegurando que nunca viajen hacia el navegador del cliente.
5. **Filtros Anti-XSS (Zod Regex):** El sistema rechaza directamente cualquier registro que contenga carácteres de sintaxis HTML (`<`, `>`, `{`), impidiendo la inserción pasiva de scripts piratas en la Base de Datos.
6. **Políticas HTTP Militares:** Inyección global de `Content-Security-Policy (CSP)` anulando la ejecución de scripts de terceros, `X-Frame-Options: DENY` contra el *Clickjacking*, y `HSTS` forzando el tráfico HTTPS en todo momento.
7. **Edge Middleware Firewall:** Archivo `middleware.ts` en la raíz asegurando la impenetrabilidad de todas las rutas de `/dashboard` desde los bordes del servidor si no existe una *Cookie JWE* íntegra.
8. **Anti-CSRF (Cross-Site Request Forgery):** Las *Server Actions* mutables rechazan peticiones cuyos *Headers de Origen* no pertenezcan al dominio legítimo de la aplicación.

---

## ⚙️ Estructura de Base de Datos Optimizada

Cineflix V2 utiliza una estructura relacional altamente eficiente:
- **Modelo Polimórfico (`UserMediaList`):** En lugar de tener cuatro tablas separadas (ej. Películas Favoritas, Series Favoritas, Películas Vistas, etc.), el sistema usa una única tabla unificada diferenciada por `mediaType` y `listType`.
- **Caché Local Geográfica:** La tabla guarda localmente identificadores clave y miniaturas de TMDB (`title`, `posterPath`) para eliminar las letales solicitudes de Red externa N+1 al cargar el *Dashboard* del usuario, haciendo la carga inicial instantánea y ahorrando cuota de API.

---

## 💻 Instalación Local

Sigue estos pasos para arrancar el entorno de desarrollo en tu propia máquina:

### 1. Clonar el Repositorio
```bash
git clone https://github.com/Jniecor/cineflixv2.git
cd cineflixv2
```

### 2. Instalar Dependencias
```bash
npm install
```

### 3. Variables de Entorno (`.env`)
Configura las llaves maestras en un archivo `.env` en la raíz:
```env
# Conexión MySQL Local o PlanetScale
DATABASE_URL="mysql://usuario:contraseña@localhost:3306/cineflix"

# API The Movie Database (Versión 3 Auth)
TMDB_API_KEY="tu_api_key_de_tmdb"
TMDB_BASE_URL="https://api.themoviedb.org/3"

# NextAuth Secret (Generar con: openssl rand -base64 32)
NEXTAUTH_SECRET="tu_llave_secreta_aqui"
NEXTAUTH_URL="http://localhost:3000"

# (Opcional) OAuth Logins
GOOGLE_CLIENT_ID=""
GOOGLE_CLIENT_SECRET=""
GITHUB_ID=""
GITHUB_SECRET=""
```

### 4. Lanzar Base de Datos (Prisma)
Aplica la estructura de datos a tu MySQL:
```bash
npx prisma generate
npx prisma db push
```

### 5. Iniciar el Servidor Turbopack
```bash
npm run dev
```
Dirígete a `http://localhost:3000` en tu navegador. ¡A disfrutar!

---
