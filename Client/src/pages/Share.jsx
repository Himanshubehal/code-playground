import { useContext, useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { AuthContext } from "../context/AuthContext"
import { API_URL } from "../config"




function Share(){

   const [project, setProject ] = useState(null)
   const { id } = useParams()

   const { token } = useContext(AuthContext)
   const navigate = useNavigate()

   const [notFound, setNotFound] = useState(false)



    useEffect(() => {
    async function loadProject(){
        try {
            const response = await fetch(`${API_URL}/api/projects/public/${id}`)
            
            
            const data = await response.json()

            if(!response.ok){
                setNotFound(true)
                return
            }

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
            const response = await fetch(`${API_URL}/api/projects/${id}/fork`, {
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
       if (notFound){
        return <p className="text-center text-gray-400 text-2xl mt-10">Project not found</p>
    }

    if(!project){
        return <p className="text-center text-gray-400 text-2xl mt-10">Loading...</p>
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
        <div className="flex-1 bg-gray-100 p-6">
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-bold">{project.title}</h1>
                <button onClick={handleFork} className="bg-blue-600 text-white px-4 py-2 rounded-lg cursor-pointer hover:bg-blue-700">Fork</button>
            </div>
            <iframe srcDoc={srcDoc} title="Preview" sandbox="allow-scripts" className="w-full h-[70vh] bg-white rounded-lg shadow"></iframe>
        </div>
    )
}
export default Share