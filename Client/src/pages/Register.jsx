import { useState } from "react"
import { useContext } from "react"
import { AuthContext } from "../context/AuthContext"
import { Link, useNavigate } from "react-router-dom"

function Register(){

    const [ name, setName ] = useState("")
    const [ email, setEmail ] = useState("")
    const [ password, setPassword ] = useState("")
    const [ error, setError ] = useState("")
    const { login } = useContext(AuthContext)
    const navigate = useNavigate()

   async function handleSubmit(e){
        e.preventDefault()
        setError("")

        try {
            const response = await fetch("http://localhost:5000/api/auth/register", {
                method: "POST",
                headers: {
                    "Content-Type" : "application/json"
                },
                body: JSON.stringify({name, email, password})
            })
            const data = await response.json()
            if(!response.ok){
                setError(data.message)
                return
            }
            login(data.token, data.user)
            navigate("/")

        } catch (err) {
            console.error(err)
            setError("Something went wrong")
        }
    }


    return(
        <div className="bg-gray-100 flex justify-center items-center flex-1">
            <form onSubmit={handleSubmit} className="flex flex-col gap-4 bg-white shadow-md w-full max-w-sm p-8 rounded-lg">
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" className="border border-gray-300 px-3 py-2 rounded"/>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" className="border border-gray-300 px-3 py-2 rounded"/>
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" className="border border-gray-300 px-3 py-2 rounded"/>
                <button type="submit" className="bg-blue-900 text-white self-center px-4 py-2 rounded-lg font-bold cursor-pointer hover:bg-blue-950">Register</button>
                <p className="text-sm text-gray-600 text-center">Already have an account?<Link to="/login" className="ml-2 hover:underline text-blue-600">Log in</Link></p>
                {error && <p className="text-red-600 text-sm text-center">{error}</p>}
            </form>
        </div>
    )
}

export default Register
