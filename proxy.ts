// Middleware for route protection (NextAuth v5)

import { auth } from '@/lib/auth';
import { NextResponse } from 'next/server';

export default auth((req) => {
    const token = req.auth;
    const isLoggedIn = !!token;
    const isAdmin = token?.user?.role === 'ADMIN';

    const { pathname } = req.nextUrl;

    const isAdminRoute = pathname.startsWith('/admin');
    const isProfileRoute = pathname.startsWith('/profile');
    const isOrdersRoute = pathname.startsWith('/orders');
    const isCheckoutRoute = pathname.startsWith('/checkout');

    // Require auth for these routes
    const requiresAuth = isAdminRoute || isProfileRoute || isOrdersRoute || isCheckoutRoute;

    if (requiresAuth && !isLoggedIn) {
        return NextResponse.redirect(new URL('/login', req.url));
    }

    // Protect admin routes - require ADMIN role
    if (isAdminRoute && !isAdmin) {
        return NextResponse.redirect(new URL('/', req.url));
    }

    return NextResponse.next();
});

export const config = {
    matcher: ['/admin/:path*', '/profile/:path*', '/orders/:path*', '/checkout'],
};
