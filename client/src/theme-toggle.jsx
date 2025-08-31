"use client"
import React from "react"
export function ThemeToggle({ className = "" }) {
    const [isDark, setIsDark] = React.useState(false);
  
  React.useEffect(() => {
    const root = document.documentElement
    const prefersDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches
    const initialDark = root.classList.contains("dark") || prefersDark
    if (initialDark) root.classList.add("dark")
    setIsDark(initialDark)
  }, [])

  const toggle = () => {
    const root = document.documentElement
    const next = !isDark
    setIsDark(next)
    root.classList.toggle("dark", next)
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={isDark}
      className={`inline-flex items-center gap-2 rounded-md border border-gray-300 dark:border-gray-700 px-3 py-1.5 text-sm transition-colors 
        hover:bg-emerald-50 dark:hover:bg-gray-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 ${className}`}
      title="Toggle theme"
    >
      <span className="h-4 w-4 rounded-full bg-emerald-500" aria-hidden />
      <span className="text-gray-800 dark:text-gray-100">{isDark ? "Dark" : "Light"}</span>
    </button>
  )
}

export default ThemeToggle
