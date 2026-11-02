import { createContext, useState } from "react";
import { useEffect } from "react";



const AuthContext = createContext(null)


function AuthProvider({ children }) {
    const [token, setToken] = useState(localStorage.getItem("token"))
    const [user, setUser] = useState(null)


    function login(newToken, newUser) {
        setToken(newToken)
        setUser(newUser)
        localStorage.setItem("token", newToken)
    }

    function logout() {
        setToken(null)
        setUser(null)
        localStorage.removeItem("token")
    }

   const authFetch = (url, options = {}) => {
    return fetch(url, {
        ...options,
        headers: {
            ...options.headers,
            Authorization: `Bearer ${token}`
        }
    })
   }


    useEffect(() => {
        if (!token) return

        async function fetchUser() {

            try {
                const response = await fetch(
                "http://localhost:5000/api/auth/me", {
                headers: {Authorization: `Bearer ${token}`}
            })
            if(!response.ok){
                logout()
                return
            }
            const data = await response.json()
            setUser(data.user)   
            } catch (error) {
                console.error(error)
            }
        }
        fetchUser()
    }, [token])

    return <AuthContext.Provider value={{ token, user, login, logout, authFetch }} >
        {children}
    </AuthContext.Provider>
}

export { AuthContext, AuthProvider }