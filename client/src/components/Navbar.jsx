
import { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { ThemeToggle } from "../theme-toggle"

const Navbar = ({ user, setUser }) => {
  const [search, setSearch] = useState("")
  const navigate = useNavigate()

  useEffect(() => {
    if (!user) return
    const delay = setTimeout(() => {
      navigate(search.trim() ? `/?search=${encodeURIComponent(search)}` : "/")
    }, 500)
    return () => clearTimeout(delay)
  }, [search, navigate, user])

  useEffect(() => {
    setSearch("")
  }, [user])

  const handleLogout = () => {
    localStorage.removeItem("token")
    setUser(null)
    navigate("/login")
  }

  return (
    <nav className="sticky top-0 z-40 border-b border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-950/80 backdrop-blur">
      <div className="container mx-auto flex items-center justify-between gap-3 px-4 py-3">
        <Link
          to="/"
          className="inline-flex items-center gap-2 rounded-md px-2 py-1 text-lg font-semibold text-emerald-700 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-gray-900 transition"
        >
          <span className="h-3 w-3 rounded-full bg-emerald-500" aria-hidden />
          Notes App
        </Link>

        <div className="ml-auto flex items-center gap-3">
          {user && (
            <>
              <div className="hidden sm:block">
                <label className="sr-only" htmlFor="search">
                  Search
                </label>
                <input
                  id="search"
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search notes..."
                  className="w-56 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 
                    outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 transition"
                />
              </div>
              <div className="flex items-center gap-2">
                <span className="hidden sm:inline text-gray-600 dark:text-gray-300 font-medium">{user.username}</span>
                <ThemeToggle />
                <button
                  onClick={handleLogout}
                  className="rounded-md bg-gray-900 text-white px-3 py-1.5 text-sm hover:bg-black transition dark:bg-gray-700 dark:hover:bg-gray-800"
                >
                  Logout
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}

export default Navbar
