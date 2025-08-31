import { useEffect, useRef, useState } from "react"
import axios from "axios"
import { markdownToHtml } from "./markdown"

const NoteModal = ({ isOpen, onClose, note, onSave }) => {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [error, setError] = useState("")
  const [mounted, setMounted] = useState(false)
  const [showPreview, setShowPreview] = useState(false)
  const textareaRef = useRef(null)


  useEffect(() => {
    setTitle(note ? note.title : "")
    setDescription(note ? note.description : "")
    setError("")
  }, [note])

  useEffect(() => {
    if (isOpen) {
      setMounted(true)
      const t = setTimeout(() => setMounted(false), 300) // allow re-triggering animation on re-open
      return () => clearTimeout(t)
    }
  }, [isOpen])

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const token = localStorage.getItem("token")
      if (!token) {
        setError("No authentication token found. Please log in")
        return
      }
      const payload = { title, description } // store markdown/plain text
      const config = { headers: { Authorization: `Bearer ${token}` } }
      if (note) {
        const { data } = await axios.put(`/api/notes/${note._id}`, payload, config)
        onSave(data)
      } else {
        const { data } = await axios.post("/api/notes", payload, config)
        onSave(data)
      }
      setTitle("")
      setDescription("")
      setError("")
      onClose()
    } catch (err) {
      console.log("Note save error")
      setError("Failed to save error")
    }
  }

  if (!isOpen) return null

  // toolbar helpers
  const wrapSelection = (pre, post= pre) => {
    const ta = textareaRef.current
    if (!ta) return
    const start = ta.selectionStart ?? 0
    const end = ta.selectionEnd ?? 0
    const before = description.slice(0, start)
    const selected = description.slice(start, end)
    const after = description.slice(end)
    const next = before + pre + (selected || "text") + post + after
    setDescription(next)
    // restore selection around inserted text
    const cursor = start + pre.length + (selected ? selected.length : 4) + post.length
    requestAnimationFrame(() => {
      ta.focus()
      ta.setSelectionRange(cursor, cursor)
    })
  }

  const insertLink = () => {
    const url = prompt("Enter URL (https://...)")
    if (!url) return
    wrapSelection("[", `](${url})`)
  }

  return (
    <div
      className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center"
      aria-modal="true"
      role="dialog"
    >
      <div
        className={`w-full max-w-xl rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-2xl 
        transition-all duration-200 ${mounted ? "scale-95 opacity-0" : "scale-100 opacity-100"}`}
      >
        <div className="border-b border-gray-200 dark:border-gray-800 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
            {note ? "Edit Note" : "Create Note"}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-md p-2 text-gray-500 hover:text-gray-900 dark:text-gray-400 hover:bg-emerald-50 dark:hover:bg-gray-800 transition-colors"
            aria-label="Close"
          >
            ×
          </button>
        </div>

        {error && <p className="px-6 pt-4 text-sm text-red-600 dark:text-red-400">{error}</p>}

        <form onSubmit={handleSubmit} className="px-6 py-4 space-y-4">
          <div>
            <label className="sr-only" htmlFor="title">
              Title
            </label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Note Title"
              className="w-full px-3 py-2 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 
              outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 transition"
              required
            />
          </div>

          {/* Toolbar */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs text-gray-500 dark:text-gray-400">Formatting:</span>
            <button
              type="button"
              onClick={() => wrapSelection("**")}
              className="px-2 py-1 text-sm rounded border border-gray-300 dark:border-gray-700 hover:bg-emerald-50 dark:hover:bg-gray-800 focus-visible:ring-2 focus-visible:ring-emerald-500"
            >
              Bold
            </button>
            <button
              type="button"
              onClick={() => wrapSelection("*")}
              className="px-2 py-1 text-sm rounded border border-gray-300 dark:border-gray-700 hover:bg-emerald-50 dark:hover:bg-gray-800 focus-visible:ring-2 focus-visible:ring-emerald-500"
            >
              Italic
            </button>
            <button
              type="button"
              onClick={() => wrapSelection("__")}
              className="px-2 py-1 text-sm rounded border border-gray-300 dark:border-gray-700 hover:bg-emerald-50 dark:hover:bg-gray-800 focus-visible:ring-2 focus-visible:ring-emerald-500"
            >
              Underline
            </button>
            <button
              type="button"
              onClick={() => wrapSelection("`")}
              className="px-2 py-1 text-sm rounded border border-gray-300 dark:border-gray-700 hover:bg-emerald-50 dark:hover:bg-gray-800 focus-visible:ring-2 focus-visible:ring-emerald-500"
            >
              Code
            </button>
            <button
              type="button"
              onClick={() => wrapSelection("- ")}
              className="px-2 py-1 text-sm rounded border border-gray-300 dark:border-gray-700 hover:bg-emerald-50 dark:hover:bg-gray-800 focus-visible:ring-2 focus-visible:ring-emerald-500"
            >
              • List
            </button>
            <button
              type="button"
              onClick={() => wrapSelection("1. ")}
              className="px-2 py-1 text-sm rounded border border-gray-300 dark:border-gray-700 hover:bg-emerald-50 dark:hover:bg-gray-800 focus-visible:ring-2 focus-visible:ring-emerald-500"
            >
              1. List
            </button>
            <button
              type="button"
              onClick={insertLink}
              className="px-2 py-1 text-sm rounded border border-gray-300 dark:border-gray-700 hover:bg-emerald-50 dark:hover:bg-gray-800 focus-visible:ring-2 focus-visible:ring-emerald-500"
            >
              Link
            </button>
            <div className="ml-auto">
              <label className="inline-flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={showPreview}
                  onChange={(e) => setShowPreview(e.target.checked)}
                  className="h-4 w-4 accent-emerald-600"
                />
                Preview
              </label>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Editor */}
            <div className={`${showPreview ? "md:col-span-1" : "md:col-span-2"}`}>
              <label className="sr-only" htmlFor="desc">
                Description
              </label>
              <textarea
                id="desc"
                ref={textareaRef}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Write your note... Use **bold**, *italic*, __underline__, `code`, - lists, and [links](https://...)"
                rows={showPreview ? 8 : 10}
                className="w-full px-3 py-2 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 
                outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 transition"
                required
              />
              <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                Tip: Use markdown-like shortcuts. Your note is saved as plain text/markdown.
              </p>
            </div>

            {/* Preview */}
            {showPreview && (
              <div className="rounded-md border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-950 p-3 overflow-auto">
                <div
                  className="prose prose-sm max-w-none prose-emerald dark:prose-invert"
                  dangerouslySetInnerHTML={{ __html: markdownToHtml(description) }}
                />
              </div>
            )}
          </div>

          <div className="flex items-center gap-2 pt-2">
            <button
              type="submit"
              className="inline-flex items-center justify-center rounded-md bg-emerald-600 text-white px-4 py-2 font-medium shadow-sm 
              hover:bg-emerald-700 active:translate-y-px transition"
            >
              {note ? "Update" : "Create"}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="rounded-md bg-gray-800 text-white px-4 py-2 hover:bg-gray-900 transition dark:bg-gray-700 dark:hover:bg-gray-800"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default NoteModal
