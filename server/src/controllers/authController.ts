import express, { response } from 'express'
import type { Request, Response } from 'express'
import User from '../models/user.js'
import { generateToken } from '../utils/jwt.js'
// import { protect } from '../middleware/auth.js'



export const githubLogin = async (req: Request, res: Response) => {
    const url = `https://github.com/login/oauth/authorize`+
    `?client_id=${process.env.GITHUB_CLIENT_ID}`+
    `&scope=repo user`

    res.redirect(url)
}

export const githubCallback = async(req: Request, res: Response) => {
    try{

        console.log(req.query)
        
        const code = req.query.code as string;
        
        const response = await fetch("https://github.com/login/oauth/access_token", {
            method: "POST",
            headers: {
                 Accept: "application/json",
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                client_id: process.env.GITHUB_CLIENT_ID,
            client_secret: process.env.GITHUB_CLIENT_SECRET,
            code
        })
    })
    const data = await response.json()
    // console.log(data)
    // res.send("access token received")

    const accessToken = data.access_token;

    const userResponse = await fetch("https://api.github.com/user", {
        headers: {
            Authorization: `Bearer ${accessToken}`,
            Accept: "application/vnd.github+json"
        }
    })

    const githubUser = await userResponse.json()
    console.log(githubUser)

    let user = await User.findOne({
        githubId: githubUser.id
    })
    if(!user){
        user = await User.create({
            githubId: githubUser.id,
            username: githubUser.login,
            name: githubUser.name,
            email: githubUser.email,
            avatar: githubUser.avatar_url,
            accessToken
        })
    }else{
        user.accessToken = accessToken
        user.name = githubUser.name
        user.email = githubUser.email
        user.avatar = githubUser.avatar_url
        await user.save()



    }

    const token = generateToken(user._id.toString())
    res.cookie("token", token, {
        httpOnly: true,
        secure: true,
        sameSite: "lax",
        maxAge: 7 * 24* 60 * 60* 1000
    })
    return res.redirect("https://repo-pilot-five.vercel.app/dashboard")

}catch(err){
    console.log(err)
}
}

export const logout = async (req: Request, res: Response) => {
    res.clearCookie("token")
    return res.json({
        success: TextTrackCue
    })
}

export default {
    githubLogin,
    githubCallback,
    logout
}