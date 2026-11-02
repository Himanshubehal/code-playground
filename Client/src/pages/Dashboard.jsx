import { useContext, useEffect, useState } from "react"
import { AuthContext } from "../context/AuthContext"
import { useNavigate } from "react-router-dom"
import { Link } from "react-router-dom"



function Dashboard() {
    const [projects, setProjects] = useState([])
    const { token, logout } = useContext(AuthContext)
    
    const navigate = useNavigate()


    useEffect(() => {
        async function loadProjects() {

            try {
                const response = await fetch("http://localhost:5000/api/projects", {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                })
                const data = await response.json()
                if(!response.ok) return
                setProjects(data)
            } catch (error) {
                console.error(error)
            }
        }
        loadProjects()
    }, [token])



   async function handleCreate(){
        try {
            const response =  await fetch("http://localhost:5000/api/projects", {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({title: "Untitled"})
            })
            const data = await response.json()
            if(!response.ok) return

            navigate(`/editor/${data._id}`)
        } catch (error) {
            console.error(error)
        }
    }


    async function handleDelete(id) {
        try {
            const response = await fetch(`http://localhost:5000/api/projects/${id}`, {
                method: "Delete",
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            })
            if(!response.ok)return
            setProjects(projects.filter((p) => {
                return p._id !== id
            }))
        } catch (error) {
            console.error(error)            
        }
    }

    function handleLogout(){
        logout()
        navigate("/login")
    }


    return (
        <div>
            {projects.map((project) => {
                return(
                    <div key={project._id}>
                        <p><Link to={`/editor/${project._id}`}>{project.title}</Link></p>
                        <button onClick={() => handleDelete(project._id)}>Delete</button>
                    </div>

                )
            })}
            <button onClick={handleCreate}>Create Project</button>
            <button onClick={handleLogout}>Logout</button>
        </div>

        
    )
}

export default Dashboard