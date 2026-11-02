import mongoose from "mongoose";

const projectSchema = new mongoose.Schema(
    {
        title:{
            type: String,
            required: true,
            trim: true,
            default: "Untitled"
        },
        html:{
            type: String,
            default: ""
        },
        css:{
            type: String,
            default: ""
        },
        js:{
            type: String,
            default: ""
        },
        owner:{
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required:true
        },
        isPublic:{
            type: Boolean,
            default: false
        },
        forkedFrom:{
            type: mongoose.Schema.Types.ObjectId,
            ref: "Project",
            default: null
        }
    },
    {
        timestamps: true
    }
)

const Project = mongoose.model("Project", projectSchema)


export default Project