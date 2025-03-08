import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import jwt from "jsonwebtoken";

const SECRET_KEY = process.env.JWT_SECRET || "mysecret";

export const config = {
    matcher: ["/api/dashboard/:path*","/api/dashboard"],
    runtime: "nodejs",
};

export function middleware(req: NextRequest) {
    const pathname = req.nextUrl.pathname;

    if (pathname.startsWith("/api/dashboard")) {
        const token = req.cookies.get("token");

        if (!token) {
            return NextResponse.json(
                { message: "Forbidden: Authentication required" },
                { status: 403 }
            );
        }

        try {
            jwt.verify(token.value, SECRET_KEY);
        } catch (error) {
            return NextResponse.json(
                { message: "Forbidden: Token expired" },
                { status: 403 }
            );
        }
    }

    if (pathname.startsWith("/dashboard")) {
        const authToken = req.cookies.get("token");

        if (!authToken) {
            return NextResponse.redirect(new URL("/login", req.url));
        }
    }

    return NextResponse.next();
}
