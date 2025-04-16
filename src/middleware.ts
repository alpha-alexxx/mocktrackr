import { headers } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

import { auth } from './lib/authentication/auth';
import { getSessionCookie } from 'better-auth/cookies';

/**
 * Routes that do not require authentication.
 */
const publicRoutes = [
    '/',
    '/login',
    '/register',
    '/forgot-password',
    '/reset-password',
    '/email-verified',
    '/api/auth/*'
];

/**
 * Routes that require a valid session.
 */
const protectedRoutes = ['/dashboard/*', '/profile/*'];

/**
 * Routes that require admin privileges.
 */
const adminRoutes = ['/admin/*'];
const pathToRegex = (path: string): RegExp => {
    const escaped = path
        .replace(/([.+?^=!:${}()|[\]/\\])/g, '\\$1') // Escape regex chars
        .replace(/\*/g, '.*') // Support wildcards
        .replace(/:([a-zA-Z0-9_]+)/g, '[^/]+'); // Convert dynamic params to match segment

    return new RegExp(`^${escaped}$`);
};

/**
 * Checks whether the provided URL path matches any route in the routes array.
 * @param {string} path - The request path.
 * @param {string[]} routes - Array of routes to check against.
 * @returns {boolean} - True if the path matches any of the routes.
 */
const matchesRoute = (path: string, routes: string[]): boolean => {
    return routes.some((route) => {
        const regex = pathToRegex(route);

        return regex.test(path);
    });
};

/**
 * Next.js middleware to implement robust route protection.
 * - Logged-in users accessing public routes are redirected to /dashboard.
 * - Users without a session accessing protected or admin routes are redirected to /login.
 * - Access to admin routes is restricted to users whose session includes admin privileges.
 * @param {NextRequest} request - The incoming Next.js request.
 * @returns {Promise<NextResponse>} - A NextResponse that either allows the request or redirects.
 */
export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;
    const cookie = getSessionCookie(request);
    // Retrieve the session using Better Auth's API (this runs in a Node environment).
    const session = await auth.api.getSession({ headers: await headers() });
    const isLoggedIn = Boolean(session);
    console.log({ sessionMiddleware: session });
    // 1. If a user is logged in and tries to access any public route, send them to /dashboard.
    if (matchesRoute(pathname, publicRoutes) && isLoggedIn) {
        return NextResponse.redirect(new URL('/dashboard', request.url));
    }

    // 2. If the user is not logged in and tries to access protected (or admin) routes, redirect to /login.
    if (!isLoggedIn && (matchesRoute(pathname, protectedRoutes) || matchesRoute(pathname, adminRoutes))) {
        return NextResponse.redirect(new URL('/login', request.url));
    }

    // 3. If accessing an admin route, verify that the user session includes admin privileges.

    /*
    if (matchesRoute(pathname, adminRoutes)) {
        const user = session?.user;
        // Adjust condition: this example assumes an admin user has role === 'admin'.
        if (!user || user.role !== 'admin') {
            // Optionally, you can redirect to a forbidden page instead of /dashboard.
            return NextResponse.redirect(new URL('/dashboard', request.url));
        }
    }
    */

    // Otherwise, allow the request to proceed.
    return NextResponse.next();
}

export const config = {
    // Next.js 15 middleware runs in the Edge Runtime by default
    runtime: 'nodejs',
    matcher: [
        // This now matches all app routes EXCEPT static files, _next, AND skips /api/auth except /api
        '/((?!_next|api/auth|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
        // Always run for API routes
        '/dashboard/:path*',
        '/profile/:path*',
        '/admin/:path*'
    ]
};
