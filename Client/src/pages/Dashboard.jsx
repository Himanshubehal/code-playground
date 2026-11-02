import { useContext, useEffect, useState } from "react"
import { AuthContext } from "../context/AuthContext"
import { useNavigate } from "react-router-dom"
import { Link } from "react-router-dom"
import { Trash2 } from "lucide-react"


function Dashboard() {
    const [projects, setProjects] = useState([])
    const { token } = useContext(AuthContext)

    const navigate = useNavigate()

    const [search, setSearch] = useState("")


    useEffect(() => {
        async function loadProjects() {

            try {
                const response = await fetch("http://localhost:5000/api/projects", {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                })
                const data = await response.json()
                if (!response.ok) return
                setProjects(data)
            } catch (error) {
                console.error(error)
            }
        }
        loadProjects()
    }, [token])



    async function handleCreate() {
        try {
            const response = await fetch("http://localhost:5000/api/projects", {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ title: "Untitled" })
            })
            const data = await response.json()
            if (!response.ok) return

            navigate(`/editor/${data._id}`)
        } catch (error) {
            console.error(error)
        }
    }


    async function handleDelete(id) {
        try {
            const response = await fetch(`http://localhost:5000/api/projects/${id}`, {
                method: "DELETE",
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            })
            if (!response.ok) return
            setProjects(projects.filter((p) => {
                return p._id !== id
            }))
        } catch (error) {
            console.error(error)
        }
    }


   const filteredProjects = projects.filter((project) => 
    project.title.toLowerCase().includes(search.toLowerCase())
)


    return (
        <div className="flex-1 bg-gray-100 p-6">
            <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-lg p-8">
                <h2 className="text-3xl font-bold text-center mb-2">Your Projects</h2>
                <p className="text-gray-500 text-center mb-6">Manage your play-ground</p>
                <div className="flex justify-between items-center mb-6 gap-3">
                    <input placeholder="Search project" type="text" value={search} onChange={(e) => setSearch(e.target.value)} className="border flex-1 border-gray-300 rounded px-3 py-1"/>
                    <button onClick={handleCreate} className="bg-blue-600 text-white px-4 py-2 rounded-lg cursor-pointer">Create Project</button>
                </div>
                <div className="flex flex-col gap-3">
                    {filteredProjects.map((project) => {
                        return (
                            <div key={project._id} className="flex justify-between items-center bg-white p-4 rounded shadow">
                                <div>
                                    <p className="text-gray-900 font-semibold"><Link to={`/editor/${project._id}`}>{project.title}</Link></p>
                                    <p className="text-gray-600">Created{new Date(project.createdAt).toLocaleString()}</p>
                                </div>
                                <button onClick={() => handleDelete(project._id)} className="bg-red-50 text-red-600 hover:bg-red-100 p-2 cursor-pointer rounded-lg"><Trash2 size={18}/></button>
                            </div>
                        )
                    })}
                </div>
            </div>
            {filteredProjects.length === 0 && <p className="text-center text-gray-400 text-2xl mt-10">No project yet</p>}
        </div>
    )
}

export default Dashboard