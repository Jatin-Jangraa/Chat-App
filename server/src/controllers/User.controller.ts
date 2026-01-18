import type { Request, Response } from "express";
import { User } from "../models/User.model.js";

import bcrypt from 'bcrypt'
import cloudinary from "../config/cloudinary.js";
import { generateToken } from "../utils/Token.js";
import type { AuthRequest } from "../middlewares/Auth.Middleware.js";


const cookieOptions = {
  httpOnly :true,
  sameSite : "strict" as const,
  secure : false
}


export const signup =  async (req:Request,res:Response) => {

    try {
        const {name , username , password , about} = req.body;
        console.log(req.body);
        

    if(!name || !username || !password){
        return res.status(400).json({message : "All fields are required"})
    }

    if(await User.findOne({username})){
        return res.status(409).json({message : "Username already exists"})
    }   

    const hashedPassword = await bcrypt.hash(password , 10)

    let avatar = "";
    
    if(req.file){
        const uploadResult = await cloudinary.uploader.upload(
            `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`,
            { folder: 'profiles' }
        );
        avatar = uploadResult.secure_url;
    }
    const newUser = new User({
        name,
        username,
        password: hashedPassword,
        about,
        avatar
    });

    await newUser.save();

    const token = generateToken(newUser._id.toString());

    return res.status(201).cookie("accessToken", token, {...cookieOptions,maxAge:7 * 24 * 60 * 60e3}).json({user:newUser})       

    } catch (error) {
        return res.status(500).json({message : "Internal Server Error"})
    }
}



export const signin    = async (req:Request,res:Response) => {

    try {
        
        const {username , password} = req.body;
        

        if(!username || !password){
            return res.status(400).json({message : "All fields are required"})
        }       

        const existingUser = await User.findOne({username});

        if(!existingUser){
            return res.status(404).json({message : "User not found"})
    
        }

        const isPasswordCorrect = await bcrypt.compare(password , existingUser.password)
        if(!isPasswordCorrect){
            return res.status(401).json({message : "Invalid credentials"})
        }
        const token = generateToken(existingUser._id.toString());

        return res.status(200).cookie("accessToken", token, {...cookieOptions,maxAge:7 * 24 * 60 * 60e3}).json({user: existingUser})

    } catch (error) {
        return res.status(500).json({message : "Internal Server Error"})
    }


}



export const logout   = async (req:Request,res:Response) => {

    try {
        
        res.clearCookie("accessToken", cookieOptions)
        return res.status(200).json({message : "Logged out successfully"})

    } catch (error) {
        return res.status(500).json({message : "Internal Server Error"})
    }

}



export const getMe    = async (req:AuthRequest,res:Response) => {

    try {
        
            const user  = await User.findById(req.user!.userid).select("-password")

            return res.status(200).json(user)
            


    } catch (error) {
        return res.status(500).json({message : "Internal Server Error"})
    }   
}






export const updateProfile = async (req:AuthRequest,res:Response) => {

    try {
        const {name , about} = req.body;

        const updatedData : any = {
            name,
            about
        }   
        if(req.file){
            const uploadResult = await cloudinary.uploader.upload(
                `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`,
                { folder: 'profiles' }
            );
            updatedData.avatar = uploadResult.secure_url;
        }
        const updatedUser = await User.findByIdAndUpdate(req.user!.userid,updatedData,{new:true}).select("-password")

        return res.status(200).json(updatedUser)    
    } catch (error) {   
        return res.status(500).json({message : "Internal Server Error"})
    }
}