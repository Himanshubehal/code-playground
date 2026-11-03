import { useContext, useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { AuthContext } from "../context/AuthContext"
import CodeMirror from "@uiw/react-codemirror"
import { html as htmlLang } from "@codemirror/lang-html"
import { css as cssLang } from "@codemirror/lang-css"
import { javascript } from "@codemirror/lang-javascript"

function Editor() {

    const { id } = useParams()
    const [title, setTitle] = useState("")
    const [html, setHtml] = useState("")
    const [css, setCss] = useState("")
    const [js, setJs] = useState("")
    const [saved, setSaved] = useState(false)

    const [copied, setCopied] = useState(false)

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


    async function handleSave() {
        try {
            const response = await fetch(`http://localhost:5000/api/projects/${id}`, {
                method: "PUT",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ title, html, css, js })
            })
            if (!response.ok) return
            setSaved(true)
            setTimeout(() => {
                setSaved(false)
            }, 2000)
        } catch (error) {
            console.error(error)
        }
    }


    async function handleShare() {
        try {
            const response = await fetch(`http://localhost:5000/api/projects/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({ isPublic: true })
            })
            if (!response.ok) return
            const link = `${window.location.origin}/share/${id}`
            await navigator.clipboard.writeText(link)
            setCopied(true)
            setTimeout(() => {
            setCopied(false)
        }, 2000)

        } catch (error) {
            console.error(error)
        }
    }



    return (
        <div className="flex-1 bg-gray-100 p-6 flex flex-col gap-4">
            <div className="flex justify-between items-center">
                <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="flex-1 max-w-md truncate min-w-0 text-2xl font-bold border  border-transparent focus:border-gray-400 outline-none" />

                <div className="flex gap-2">
                    <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg cursor-pointer " onClick={handleSave}>{saved === true ? "Saved" : "Save"}</button>
                    <button onClick={handleShare} className="bg-gray-500 hover:bg-gray-700 text-white px-4 py-2 rounded-lg cursor-pointer">{copied === true ? "Link copied" : "Share"}</button>
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-4">
                    <div className="flex flex-col gap-1">
                        <label htmlFor="html" className="text-sm font-semibold text-gray-700">HTML</label>
                        <CodeMirror value={html} onChange={(value) => setHtml(value)} extensions={[htmlLang()]} height="20vh" />
                    </div>
                    <div className="flex flex-col gap-1">
                        <label htmlFor="css" className="text-sm font-semibold text-gray-700">CSS</label>
                        <CodeMirror value={css} onChange={(value) => setCss(value)} extensions={[cssLang()]} height="20vh" />
                    </div>
                    <div className="flex flex-col gap-1">
                        <label htmlFor="js" className="text-sm font-semibold text-gray-700">JS</label>
                        <CodeMirror value={js} onChange={(value) => setJs(value)} extensions={[javascript()]} height="20vh" />
                    </div>
                </div>
                <div className="flex flex-col gap-1">
                    <h2 className="text-sm font-semibold text-gray-700">Preview</h2>
                    <iframe srcDoc={srcDoc} title="preview" sandbox="allow-scripts" className="w-full flex-1 min-h-[300px] bg-white rounded-lg"></iframe>
                </div>
            </div>
            
        </div>
    )
}

export default Editor