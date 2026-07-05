import { githubLogin, githubCallback } from "../controllers/authController.js";
import { Router } from "express";
import express from 'express'
import { protect } from "../middleware/auth.js";
const router = express.Router()


router.get('/github', githubLogin)
router.get('/github/callback', githubCallback)

router.get('/me', protect, (req,res)=>{
    return res.json({
        success: true,
        user: req.user 
    })
})

export default router;

