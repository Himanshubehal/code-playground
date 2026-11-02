import { useState } from "react"
import { useContext } from "react"
import { AuthContext } from "../context/AuthContext"
import { Navigate, useNavigate } from "react-router-dom"


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
            const response = await fetch("http://localhost:5000/api/auth/login", {
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
        <div>
            <form onSubmit={handleSubmit} >
                <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)}/>
                <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)}/>
                <button type="submit">Log in</button>
                {error && <p>{error}</p>}
            </form>
        </div>
    )
}

export default Login