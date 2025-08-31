
import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import axios from "axios"

const Login = ({ setUser }) => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const { data } = await axios.post("/api/users/login", { email, password })
      localStorage.setItem("token", data.token)
      setUser(data)
      navigate("/")
    } catch (error) {
      setError(error?.response?.data?.message || "Server error")
    }
  }

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center bg-white dark:bg-gray-950 px-4">
      <div className="w-full max-w-md rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-xl transition">
        <div className="border-b border-gray-200 dark:border-gray-800 px-6 py-4">
          <h2 className="text-center text-2xl font-semibold text-gray-900 dark:text-gray-100">Login</h2>
        </div>

        {error && (
          <p className="mx-6 mt-4 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 dark:bg-red-950/40 dark:text-red-300">
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit} className="px-6 py-6 space-y-4">
          <div>
            <label className="sr-only" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              className="w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2 text-gray-900 dark:text-gray-100 
                outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 transition"
              required
            />
          </div>
          <div>
            <label className="sr-only" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2 text-gray-900 dark:text-gray-100 
                outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 transition"
              required
            />
          </div>
          <button className="w-full rounded-md bg-emerald-600 text-white py-2 font-medium shadow-sm transition hover:bg-emerald-700 active:translate-y-px">
            Login
          </button>
        </form>

        <p className="px-6 pb-6 text-center text-sm text-gray-600 dark:text-gray-300">
          {"Don't have an account? "}
          <Link className="text-emerald-700 dark:text-emerald-400 underline hover:no-underline" to="/register">
            Register
          </Link>
        </p>
      </div>
    </div>
  )
}

export default Login
