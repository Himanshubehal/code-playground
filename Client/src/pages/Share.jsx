import { useContext, useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { AuthContext } from "../context/AuthContext"




function Share(){

   const [project, setProject ] = useState(null)
   const { id } = useParams()

   const { token } = useContext(AuthContext)
   const navigate = useNavigate()



    useEffect(() => {
    async function loadProject(){
        try {
            const response = await fetch(`http://localhost:5000/api/projects/public/${id}`)
            
            
            const data = await response.json()

            if(!response.ok)return

            setProject(data)
        } catch (error) {
            console.error(error)
        }
    }

    loadProject()
    }, [id])


    async function handleFork(){

        if(!token){
           return navigate("/login")
        }
        try {
            const response = await fetch(`http://localhost:5000/api/projects/${id}/fork`, {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type" : "application/json"
                }
            })
            const data = await response.json()
            if(!response.ok) return
            navigate(`/editor/${data._id}`)
            
        } catch (error) {
            console.error(error)
        }
    }

    if(!project){
        return <p>Loading...</p>
    }


    const srcDoc = `
        <!DOCTYPE html>
        <html>
            <head>
                <style>${project.css}</style>
            </head>
            <body>
                ${project.html}
            

                <script>${project.js}</script>
            </body>
        </html>
    
    `
    
    return (
        <div>

            <h1>{project.title}</h1>
            <iframe srcDoc={srcDoc} title="Preview" sandbox="allow-scripts"></iframe>
            <button onClick={handleFork}>Fork</button>
        </div>
    )
}
export default Share