import jwt from 'jsonwebtoken'  
import type { Request, Response, NextFunction } from 'express'
import User from '../models/user.js'


interface jwtUser{
    id: string
}

export const protect = async (req: Request, res: Response, next: NextFunction) => {
    try{

        const token = req.cookies.token
        if(!token){
            return res.status(401).json({message: "Unauthorized"})
        }
        const decoded = jwt.verify(
            token, process.env.JWT_SECRET as string
        ) as jwtUser
        const user = await User.findById(decoded.id as string)
        if(!user){
            return res.status(401).json({
                message: "User not found"
            })
        }
        req.user = user

        next()
    }catch(err){
        return res.status(401).json({message:"Invalid Token"})
    }
}