import type { Request, Response } from "express";
import Rule from "../models/rule.js";

export const createRule = async (req: Request, res: Response) => {

    const { keyword, label, slackEnabled } = req.body;

    const existingRule = await Rule.findOne({
        user: req.user._id,
    });

    if (existingRule) {

        existingRule.keyword = keyword;
        existingRule.label = label;
        existingRule.slackEnabled = slackEnabled;

        await existingRule.save();

        return res.json(existingRule);
    }

    const rule = await Rule.create({
        keyword,
        label,
        slackEnabled,
        user: req.user._id,
    });

    return res.status(201).json(rule);
};

export const getRule = async (req: Request, res: Response) => {

    const rule = await Rule.findOne({
        user: req.user._id,
    });

    return res.json(rule);
};