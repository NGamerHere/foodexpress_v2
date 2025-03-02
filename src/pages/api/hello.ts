import type { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

type ResponseData = {
    id: number;
    name: string | null;
    username: string | null;
    password: string | null;
    email: string | null;
    phone: string | null;
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<ResponseData[]>
) {
    const users = await prisma.users.findMany();
    return res.status(200).json(users);
}