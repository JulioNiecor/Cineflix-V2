import { withAuth } from "next-auth/middleware";

export default withAuth({
    pages: {
        signIn: "/auth",
    },
});

export const config = {
    // Proteger todas las rutas bajo /dashboard y sus sub-rutas
    matcher: ["/dashboard/:path*"],
};
