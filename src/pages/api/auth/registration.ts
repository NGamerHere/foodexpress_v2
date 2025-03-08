import {NextApiRequest, NextApiResponse} from "next";
import bcrypt from "bcrypt";
import {PrismaClient} from "@prisma/client";

const prisma = new PrismaClient();
export default async function handleRequest(req: NextApiRequest, res: NextApiResponse) {
    try {
        const {username, password, name, phone, email} = req.body;
        const previousDetailsCheck = await prisma.users.findFirst({
            where: {
                OR:[
                    {
                        email
                    },{
                        username
                    }
                ]
            }
        });

        const hashedPassword:string = await bcrypt.hash(password, 10);

        if(!previousDetailsCheck) {
           const newUserDetails = await prisma.users.create({
               data: {
                   username: username,
                   password:hashedPassword,
                   phone: phone,
                   email: email,
                   name: name
               }
           });
           res.status(201).json(newUserDetails);
        }else {
            res.status(400).send({error: "User already exists"});
        }
    } catch (err) {
        console.error("Error in adding new users", err);
        res.status(500).send({
            message: 'internal server error',
        })
    }
}