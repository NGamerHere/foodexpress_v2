import type { NextApiRequest, NextApiResponse } from "next";
import bcrypt from "bcrypt";
import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";
import cookie from "cookie";

type user = {
    id: number;
    name: string | null;
    username: string | null;
    password: string | null;
    email: string | null;
    phone: string | null;
}

const SECRET_KEY = process.env.JWT_SECRET || 'mysecret';
const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required" });
        }

        const userDetails:user | null = await prisma.users.findFirst({
            where: { email },
        });

        if (!userDetails) {
            return res.status(404).json({ message: "User not found" });
        }
        const match:Promise<boolean> = bcrypt.compare(password, userDetails.password || '');
        if (await match) {
            const token = jwt.sign({ user_id:userDetails.id }, SECRET_KEY, { expiresIn: "1h" });
            res.setHeader(
                "Set-Cookie",
                cookie.serialize("token", token, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === "production",
                    sameSite: "strict",
                    path: "/",
                })
            );
            return res.status(200).json({ message: "Authentication successful" });
        } else {
            return res.status(401).json({ message: "Incorrect password" });
        }
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Something went wrong" });
    }
}
