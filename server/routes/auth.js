import express from "express";
import User from "../models/User.js"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import publicUser from "../utils/publicUser.js";
import protect from "../middleware/protect.js";



const router = express.Router();

router.post("/register", async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }
  if (password.length < 6) {
    return res
      .status(400)
      .json({ message: "Password must be at least 6 characters" });
  }
  const existingUser = await User.findOne({ email })

  if (existingUser) {
    return res.status(409).json({ message: "Email already registered" })
  }
  const hashedPassword = await bcrypt.hash(password, 10)

  const user = await User.create(
    {
      name,
      email,
      password: hashedPassword
    }
  )

  const token = jwt.sign(
    {
      id: user._id
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "7d"
    }
  )

  res.status(201).json({ token, user: publicUser(user) })

});


router.post("/login", async (req, res) => {
  const { email, password } = req.body

  if(!email || !password){
    return res.status(400).json({message: "All fields are required"})
  }

  const user = await User.findOne({ email })
  if (!user) {
    return res.status(401).json({ message: "Invalid email or password" })
  }

  const isMatch = await bcrypt.compare(password, user.password)

  if (!isMatch) {
    return res.status(401).json({ message: "Invalid email or password" })
  }

  const token = jwt.sign(
    { id: user._id },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  )
  
  res.status(200).json({token, user: publicUser(user)})
})



router.get("/me", protect, (req, res) => {
  return res.status(200).json({user: publicUser(req.user)})
})

export default router;
