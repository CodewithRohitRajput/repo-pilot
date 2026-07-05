import Event from "../models/event.js";
import type { Request, Response } from "express";
import Repository from "../models/repository.js";


export const getEvents = async (req: Request, res: Response) => {
    const repos = await Repository.find({
        user: req.user._id
    })

    const repoNames = repos.map(repo => repo.fullName);

    const events = await Event.find({
        repository: {
            $in: repoNames
        }
    })
    .sort({createdAt: -1})

    return res.json(events)

}

export default {
    getEvents
}