import { useState } from "react"
import { useContext } from "react"
import { AuthContext } from "../context/AuthContext"
import { useNavigate } from "react-router-dom"

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
        <div>
            <form onSubmit={handleSubmit}>
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Name"/>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email"/>
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password"/>
                <button type="submit">Register</button>
                {error && <p>{error}</p>}
            </form>
        </div>
    )
}

export default Register
