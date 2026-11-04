import "dotenv/config"
import express from "express"
import cors from "cors"
import mongoose from "mongoose"
import dns from "node:dns"
import authRoutes from "./routes/auth.js"
import projectRoutes from "./routes/projects.js"



dns.setServers(["8.8.8.8"])

const app = express()
app.use(cors({origin: "https://code-playground-indol-sigma.vercel.app"}))
app.use(express.json())
const PORT = process.env.PORT || 5000



app.get("/", (req, res) => {
    res.json({ message: "Api is working" })
})

app.use("/api/auth", authRoutes)
app.use("/api/projects", projectRoutes)

async function startServer() {
    try {
        await mongoose.connect(process.env.MONGO_URI)
        console.log("MongoDB connected")
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`)
        })
    } catch (error) {
        console.error("MongoDB Failed", error.message)
        process.exit(1)
    }
}

startServer()