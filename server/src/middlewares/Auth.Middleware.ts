import type { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken'




export interface AuthRequest extends Request {
    user? : any
}



export const Protect = async (req:AuthRequest , res :Response , next : NextFunction) =>{

    try {
        
         const token  = req.cookies.accessToken;
         
        if(!token) return res.sendStatus(401)

            const decoded = jwt.verify(token,process.env.JWT_SECRET!)
            
            req.user = decoded        
        next()
    } catch (error) {
        res.sendStatus(401)        
    }

}