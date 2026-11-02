import { Routes, Route } from "react-router-dom"
import Dashboard from "./pages/Dashboard"
import Editor from "./pages/Editor"
import Login from "./pages/Login"
import Register from "./pages/Register"
import Share from "./pages/Share"
import ProtectedRoute from "./components/ProtectedRoute"

function App() {

  return (
    <>
      <h1>Playground</h1>
      <Routes>
        <Route path="/login" element={<Login />}/>
        <Route path="/register" element={<Register />}/>
        <Route path="/editor/:id"  element={<ProtectedRoute><Editor /></ProtectedRoute>}/>
        <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>}/>
        <Route path="/share/:id" element={<Share />}/>
      </Routes>

    </>
  )
}

export default App