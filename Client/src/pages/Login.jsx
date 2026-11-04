import { useState } from "react"
import { useContext } from "react"
import { AuthContext } from "../context/AuthContext"
import { Link, useNavigate } from "react-router-dom"
import { API_URL } from "../config"


function Login(){

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState("")
    const {login} = useContext(AuthContext)

    const navigate = useNavigate()

    async function handleSubmit(e) {
        e.preventDefault()
        setError("")

        try {
            const response = await fetch(`${API_URL}/api/auth/login`, {
            method: "POST",
            headers: {
                "Content-Type" : "application/json",
            },
            body: JSON.stringify({email, password})
        })
        const data = await response.json()
        if(!response.ok){
           return setError(data.message)
        }
        login(data.token, data.user)
        navigate("/")
        } catch (err) {
            console.error(err)
            setError("Something went wrong, please try again")
        }
    }
    return (
        <div className="flex justify-center items-center flex-1 bg-gray-100">
            <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-md w-full max-w-sm flex flex-col gap-4" >
                <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className="border border-gray-300 rounded px-3 py-2"/>
                <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className="border border-gray-300 rounded px-3 py-2" />
                <button type="submit" className="bg-blue-900 hover:bg-blue-950 cursor-pointer text-white self-center px-4 py-2 rounded-lg font-bold">Log in</button>
                <p className="text-sm text-center text-gray-600">Don't have an account?<Link to="/register" className="text-blue-600 hover:underline ml-2">Register</Link></p>
                {error && <p className="text-red-600 text-sm text-center">{error}</p>}
            </form>
        </div>
    )
}

export default Login