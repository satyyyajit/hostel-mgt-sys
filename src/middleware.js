import { NextResponse } from "next/server";
import { jwtVerify } from "jose";

const SECRET_KEY = new TextEncoder().encode(process.env.JWT_SECRET);

export const middleware = async (req) => {
    const token = req.cookies.get('token')?.value;

    const isLoginOrSignupPage = req.nextUrl.pathname.startsWith('/login') || req.nextUrl.pathname.startsWith('/signup');

    if (token) {
        try {
            if (!SECRET_KEY) {
                throw new Error('Secret key is missing');
            }

            const { payload } = await jwtVerify(token, SECRET_KEY);

            // console.log("Token received:", token);

            // console.log("Token payload:", payload);

            if (req.nextUrl.pathname.startsWith('/admin') && (payload.role !== 'admin' && payload.role !== 'warden')) {
                console.log(payload.role === 'admin' || payload.role === 'warden');
                
                return NextResponse.redirect(new URL('/', req.url));
            }

            if (req.nextUrl.pathname.startsWith('/student') && payload.role !== 'student') {
                return NextResponse.redirect(new URL('/', req.url));
            }

            if (isLoginOrSignupPage) {
                if (
                    (req.nextUrl.pathname.startsWith('/login/admin') && payload.role === 'admin') ||
                    (req.nextUrl.pathname.startsWith('/login/student') && payload.role === 'student')
                ) {
                    const redirectPath = payload.role === 'admin' || payload.role === 'warden'
                        ? '/admin/dashboard'
                        : '/student/dashboard';
                    return NextResponse.redirect(new URL(redirectPath, req.url));
                }
            }

            return NextResponse.next();

        } catch (err) {
            console.error('Error verifying token:', err);
            return NextResponse.redirect(new URL('/', req.url));
        }
    } else {
        
        if (req.nextUrl.pathname.startsWith('/admin')) {
            return NextResponse.redirect(new URL('/login/admin', req.url));
        }

        if (req.nextUrl.pathname.startsWith('/student')) {
            return NextResponse.redirect(new URL('/login/student', req.url));
        }

        return NextResponse.next();
    }
};

export const config = {
    matcher: ['/login/:path*', '/signup/:path*', '/admin/:path*', '/student/:path*'],
};
