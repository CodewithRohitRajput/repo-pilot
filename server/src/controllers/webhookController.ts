import type { Request, Response } from "express";

export const githubWebhook = async (req: Request, res: Response) => {
    console.log(req.headers)
    console.log(req.body)
    
    return res.sendStatus(200)
}

export default {
    githubWebhook
}