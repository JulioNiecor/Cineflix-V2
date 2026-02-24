import { MetadataRoute } from 'next';
import { tmdb } from '@/lib/tmdb';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';

    // Base core routes
    const routes = [
        '',
        '/movies',
        '/series',
        '/auth', // Public access for SEO
    ].map((route) => ({
        url: `${baseUrl}${route}`,
        lastModified: new Date(),
        changeFrequency: 'daily' as const,
        priority: route === '' ? 1 : 0.8,
    }));

    try {
        // Fetch top 20 trending movies and top 20 series for dynamic indexing
        const [trendingMovies, trendingSeries] = await Promise.all([
            tmdb.getTrending('movie', 'week'),
            tmdb.getTrending('tv', 'week')
        ]);

        const movieUrls = trendingMovies.results.map((movie) => ({
            url: `${baseUrl}/movies/${movie.id}`,
            lastModified: new Date(),
            changeFrequency: 'weekly' as const,
            priority: 0.7,
        }));

        const seriesUrls = trendingSeries.results.map((series) => ({
            url: `${baseUrl}/series/${series.id}`,
            lastModified: new Date(),
            changeFrequency: 'weekly' as const,
            priority: 0.7,
        }));

        return [...routes, ...movieUrls, ...seriesUrls];
    } catch (error) {
        console.error("Sitemap generation error:", error);
        return routes; // Graceful degradation
    }
}
