import jwt from 'jsonwebtoken'

export const generateToken = (userid : String) =>
    jwt.sign({userid},process.env.JWT_SECRET! , {expiresIn :"7d"})
