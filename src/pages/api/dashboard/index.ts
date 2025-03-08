import {NextApiRequest, NextApiResponse} from "next";

export default async function (req: NextApiRequest, res: NextApiResponse) {
    try{

        res.send('hello there');
    }catch(err){
        res.status(500).send({})
    }
}