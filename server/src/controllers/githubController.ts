import Repository from "../models/repository.js";
import type { Request, Response } from "express";

export const getRepositories = async (req: Request, res: Response) => {
    const response = await fetch('https://api.github.com/user/repos', {
        headers: {
            Authorization: `token ${req.user?.accessToken}`,
            Accept: "application/vnd.github+json",
        }

    })
    const repos = await response.json()
    console.log(repos)

    return res.json(repos)
}


export const connectRepository = async (req: Request, res: Response) => {


    const {githubRepoId, name, owner, fullName}  = req.body;
    const existing = await Repository.findOne({
        githubRepoId,
        user: req.user._id
    })
    if(existing){
        return res.status(400).json({
            message: "Repository already connected"
        })
    }

    const repo = await Repository.create({
        githubRepoId,
        name,
        owner,
        fullName,
        user: req.user._id
    })

    const webhookResponse = await fetch(
        `https://api.github.com/repos/${owner}/${name}/hooks`,
        {method: "POST",

        headers: {
            Authorization: `token ${req.user.accessToken}`,
            Accept: "application/vnd.github+json",
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            name: "web",
            active: true,
            events: ['issues', "pull_request", "push"],

            config: {
                url: process.env.WEBHOOK_URL,
                content_type: "json",
                secret: process.env.GITHUB_WEBHOOK_SECRET,
            }
        })
        }
    )

    const webhookData = await webhookResponse.json()

    console.log(webhookData)

    return res.status(201).json({
        success: true, repo
    })

}

export const connectedRepo = async (req: Request, res: Response) => {
    const connectedRepos = await Repository.find({user: req.user._id})

    return res.json(connectedRepos)
}

export default {
    getRepositories,
    connectRepository,
    connectedRepo
}