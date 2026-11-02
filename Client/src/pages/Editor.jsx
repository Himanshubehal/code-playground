import { useContext, useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { AuthContext } from "../context/AuthContext"


function Editor() {

    const { id } = useParams()
    const [title, setTitle] = useState("")
    const [html, setHtml] = useState("")
    const [css, setCss] = useState("")
    const [js, setJs] = useState("")


    const { token } = useContext(AuthContext)


    useEffect(() => {

        async function loadProject() {
            try {
                const response = await fetch(`http://localhost:5000/api/projects/${id}`, {
                    headers: {
                        "Authorization": `Bearer ${token}`
                    }
                })
                const data = await response.json()
                console.log(data)
                
                if (!response.ok) return


                setTitle(data.title)
                setHtml(data.html)
                setJs(data.js)
                setCss(data.css)
            } catch (error) {
                console.error(error)
            }

        }

        loadProject()

    }, [token, id])


    const srcDoc = `
        <!DOCTYPE html >
        <html>
        <head>
        <style>${css}</style>
        </head>
        <body>
            ${html}

            <script>${js}</script>
        </body>

        </html>

    `


  async function handleSave(){
    try {
        const response = await fetch(`http://localhost:5000/api/projects/${id}`, {
            method: "PUT",
            headers: {
                "Authorization" : `Bearer ${token}`,
                "Content-Type" : "application/json"
            },
            body: JSON.stringify({title, html, css, js})
        })
        if(!response.ok)return
        alert("Saved")
    } catch (error) {
        console.error(error)
    }
  }


 async function handleShare(){
    try {
        const response = await fetch(`http://localhost:5000/api/projects/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type" : "application/json",
                "Authorization" : `Bearer ${token}`
            },
            body: JSON.stringify({isPublic: true})
        })
        if(!response.ok) return
        alert("Shared")

    } catch (error) {
        console.error(error) 
    }
  }


    return (
        <div>
            <h1>{title}</h1>
            <div>
                <div>
                    <label htmlFor="html">HTML</label>
                    <textarea id="html" value={html} onChange={(e) => setHtml(e.target.value)}></textarea>
                </div>
                <div>
                    <label htmlFor="css">CSS</label>
                    <textarea id="css" value={css} onChange={(e) => setCss(e.target.value)}></textarea>
                </div>
                <div>
                    <label htmlFor="js">JS</label>
                    <textarea id="js" value={js} onChange={(e) => setJs(e.target.value)}></textarea>
                </div>
            </div>

            <iframe srcDoc={srcDoc} title="preview" sandbox="allow-scripts"></iframe>
            <button onClick={handleSave}>Save</button>
            <button onClick={handleShare}>Share</button>
        </div>
    )
}

export default Editor