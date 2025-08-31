
import { useEffect, useState } from "react"
import axios from "axios"
import NoteModal from "./NoteModal"
import { useLocation } from "react-router-dom"
import { markdownToHtml } from "./markdown"

const Home = () => {
  const [notes, setNotes] = useState([]);
const [error, setError] = useState("");
const [isModalOpen, setIsModalOpen] = useState(false);
const [editNote, setEditNote] = useState(null);
const location = useLocation();


  const fetchNotes = async () => {
    try {
      const token = localStorage.getItem("token")
      if (!token) {
        setError("No authentication token found. Please log in")
        return
      }
      const searchParams = new URLSearchParams(location.search)
      const search = searchParams.get("search") || ""
      const { data } = await axios.get("/api/notes", {
        headers: { Authorization: `Bearer ${token}` },
      })
      const filteredNotes = search
        ? data.filter(
            (note) =>
              note.title.toLowerCase().includes(search.toLowerCase()) ||
              note.description.toLowerCase().includes(search.toLowerCase()),
          )
        : data
      setNotes(filteredNotes)
    } catch (err) {
      setError("Failed to fetch notes")
    }
  }

  const handleEdit = (note) => {
    setEditNote(note)
    setIsModalOpen(true)
  }

  useEffect(() => {
    fetchNotes()
  }, [location.search])

  const handleSaveNote = (newNote) => {
    if (editNote) {
      setNotes(notes.map((note) => (note._id === newNote._id ? newNote : note)))
    } else {
      setNotes([...notes, newNote])
    }
    setEditNote(null)
    setIsModalOpen(false)
  }

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem("token")
      if (!token) {
        setError("No authentication token found. Please log in")
        return
      }
      await axios.delete(`/api/notes/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      setNotes(notes.filter((note) => note._id !== id))
    } catch (err) {
      setError("Failed to delete note")
    }
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      <div className="container mx-auto px-4 py-8">
        {error && (
          <p className="mb-4 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-red-700 dark:bg-red-950/40 dark:text-red-300">
            {error}
          </p>
        )}

        <NoteModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false)
            setEditNote(null)
          }}
          note={editNote}
          onSave={handleSaveNote}
        />

        {/* FAB */}
        <button
          onClick={() => setIsModalOpen(true)}
          className="fixed bottom-6 right-6 h-14 w-14 rounded-full bg-emerald-600 text-white text-3xl shadow-lg transition hover:bg-emerald-700 hover:rotate-6 active:translate-y-px"
          aria-label="Add note"
          title="Add note"
        >
          <span className="flex h-full w-full items-center justify-center pb-1">+</span>
        </button>

        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">Your Notes</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Create, edit, and format your notes with a clean, modern UI.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {notes.map((note) => (
            <div
              key={note._id}
              className="group rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-4 shadow-sm transition 
                hover:shadow-lg hover:-translate-y-0.5"
            >
              <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-gray-100">{note.title}</h3>
              <div
                className="prose prose-sm max-w-none text-gray-700 dark:text-gray-300 prose-a:text-emerald-600 dark:prose-invert"
                dangerouslySetInnerHTML={{ __html: markdownToHtml(note.description) }}
              />
              <p className="mt-3 text-xs text-gray-500 dark:text-gray-400">
                {new Date(note.updatedAt).toLocaleString()}
              </p>
              <div className="mt-4 flex gap-2">
                <button
                  onClick={() => handleEdit(note)}
                  className="rounded-md bg-amber-600 px-3 py-1 text-white transition hover:bg-amber-700 active:translate-y-px"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(note._id)}
                  className="rounded-md bg-red-600 px-3 py-1 text-white transition hover:bg-red-700 active:translate-y-px"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
          {notes.length === 0 && (
            <div className="col-span-full rounded-lg border border-dashed border-gray-300 dark:border-gray-800 p-8 text-center text-gray-500 dark:text-gray-400">
              No notes yet. Click the green + button to create your first note.
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Home
