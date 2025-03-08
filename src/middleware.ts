import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const SECRET_KEY = process.env.JWT_SECRET || "mysecret";

export const config = {
    matcher: ["/api/dashboard/:path*", "/api/dashboard"],
    runtime: "edge",
};

async function verifyToken(token: string) {
    try {
        const secret = new TextEncoder().encode(SECRET_KEY);
        return await jwtVerify(token, secret);
    } catch (error) {
        return null;
    }
}

export async function middleware(req: NextRequest) {
    const pathname = req.nextUrl.pathname;

    if (pathname.startsWith("/api/dashboard")) {
        const token = req.cookies.get("token");

        if (!token) {
            return NextResponse.json(
                { message: "Forbidden: Authentication required" },
                { status: 403 }
            );
        }

        const isValid = await verifyToken(token.value);

        if (!isValid) {
            return NextResponse.json(
                { message: "Forbidden: Token expired or invalid" },
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
