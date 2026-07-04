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

    return res.json(repos)
}


export const connectRepository = async (req: Request, res: Response) => {


    const {githubRepoId, name, owner, fullName}  = req.body;
    const existing = await Repository.findOne({
        githubRepoId,
        user: req.user._id
    })
    if(!existing){
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

    return res.status(201).json({
        success: true, repo
    })

}

export default {
    getRepositories,
    connectRepository
}