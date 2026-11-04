import express from "express"
import protect from "../middleware/protect.js"
import Project from "../models/Project.js"
import mongoose from "mongoose"



const router = express.Router()


router.post("/", protect,async (req, res) => {
    const {html, css, js, title} = req.body
    const project = await Project.create({
        title,
        html,
        css,
        js,
        owner: req.user._id
    })
    res.status(201).json(project)
})

router.get("/", protect, async (req, res) => {
    const projects = await Project.find({owner: req.user._id}).sort({updatedAt: -1})
    res.status(200).json(projects)
})



router.get("/:id", protect, async (req, res) => {

    if(!mongoose.isValidObjectId(req.params.id)){
        return res.status(404).json({message: "Project not found"})
    }

    const project = await Project.findById(req.params.id)
    if(!project){
        return res.status(404).json({message: "Project not found"})
    }
    if(!project.owner.equals(req.user._id)){
        return res.status(403).json({message: "Not allowed"})
    }
    res.status(200).json(project)
})


router.put("/:id", protect, async(req, res) => {
    
    if(!mongoose.isValidObjectId(req.params.id)){
        return res.status(404).json({message: "Project not found"})
    }

    const project = await Project.findById(req.params.id)

    if(!project){
        return res.status(404).json({message: "Project not found"})
    }
    if(!project.owner.equals(req.user._id)){
        return res.status(403).json({message: "Not allowed"})
    }

    const {title, html, css, js, isPublic} = req.body
    if(title !== undefined){
        project.title = title
    }
    if(html !== undefined){
        project.html = html
    }
    if(css !== undefined){
        project.css = css
    }
    if(js !== undefined){
        project.js = js
    }
    if(isPublic !== undefined){
        project.isPublic = isPublic
    }


    await project.save()
    res.status(200).json(project)
})


router.delete("/:id", protect, async (req, res) => {
    
    if(!mongoose.isValidObjectId(req.params.id)){
        return res.status(404).json({message: "Project not found"})
    }

    const project = await Project.findById(req.params.id)
    if(!project){
        return res.status(404).json({message: "Project not found"})
    }

    if(!project.owner.equals(req.user._id)){
        return res.status(403).json({message: "Not allowed"})
    }

    await project.deleteOne()
    res.status(200).json({message: "Project deleted"})
})


router.get("/public/:id", async (req, res) => {

    if(!mongoose.isValidObjectId(req.params.id)){
        return res.status(404).json({message: "Project not found"})
    }

    const project = await Project.findById(req.params.id)

    if(!project || project.isPublic === false){
        return res.status(404).json({message: "Project not found"})
    }
    res.status(200).json(project)
})


router.post("/:id/fork", protect, async (req, res) => {

    if(!mongoose.isValidObjectId(req.params.id)){
        return res.status(404).json({message: "Project not found"})
    }

    const project = await Project.findById(req.params.id)
    if(!project || (!project.isPublic && !project.owner.equals(req.user._id))){
        return res.status(404).json({message : "Project not found"})
    }
    const fork = await Project.create(
        {
            title: project.title,
            html: project.html,
            css: project.css,
            js: project.js,
            owner: req.user._id,
            forkedFrom: project._id
        }
    )

    res.status(201).json(fork)
})
export default router