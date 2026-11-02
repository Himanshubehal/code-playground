import jwt from "jsonwebtoken"
import User from "../models/User.js"



async function protect(req, res, next) {
    const authHeader = req.headers.authorization

    if(!authHeader || !authHeader.startsWith("Bearer ")){
        return res.status(401).json({message: "Not authorised, no token"})
    }

    const token  = authHeader.split(" ")[1]

    let decoded

    try {
        decoded = jwt.verify(token, process.env.JWT_SECRET)
    } catch (error) {
        return res.status(401).json({message: "Not authorised, invalid token"})
    }

    const user = await User.findById(decoded.id).select("-password")

    if(!user){
        return res.status(401).json({message: "User not found"})
    }
    req.user = user
    next()
}


export default protect