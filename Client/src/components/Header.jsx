import { useContext, useState } from "react"
import { AuthContext } from "../context/AuthContext"
import { useNavigate, Link } from "react-router-dom"


function Header() {
    const { user, logout } = useContext(AuthContext)
    const [menuOpen, setMenuOpen] = useState(false)
    const navigate = useNavigate()

    function handleLogout() {
        setMenuOpen(false)
        logout()
        navigate("/login")
    }


    return (
        <div className="flex justify-between items-center bg-gray-900 text-white p-4">
            <Link to={user ? "/" : "/register"}> <h1 className="text-xl font-bold">Code Playground</h1> </Link>
            {user && (<div className="relative">
                <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center cursor-pointer" onClick={() => setMenuOpen(!menuOpen)}>{user.name.split(" ").map((word) => word[0]).join("").toUpperCase()}</div>
                {menuOpen && (<div className="absolute right-0 mt-2 bg-white text-gray-800 rounded shadow-md py-2"><button onClick={handleLogout} className="px-4 py-2 whitespace-nowrap hover:bg-gray-100 cursor-pointer">Log out</button></div>)}
            </div>)}
        </div>
    )
}

export default Header