// Lightweight, safe markdown renderer for bold/italic/underline/lists/code/links
export function markdownToHtml(input) {
    if (!input) return ""
    // 1) strip any HTML tags to prevent XSS
    const noHtml = input.replace(/<[^>]*>/g, "")
    // 2) escape entities
    const escape = (s) =>
      s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;")
    let s = escape(noHtml)
  
    // 3) inline code `code`
    s = s.replace(
      /`([^`]+)`/g,
      '<code class="px-1 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100">$1</code>',
    )
  
    // 4) bold **text**
    s = s.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
  
    // 5) italic *text* or _text_
    s = s.replace(/(^|[^*])\*([^*]+)\*(?!\*)/g, "$1<em>$2</em>")
    s = s.replace(/(^|[^_])_([^_]+)_(?!_)/g, "$1<em>$2</em>")
  
    // 6) underline via __text__
    s = s.replace(/__([^_]+)__/g, "<u>$1</u>")
  
    // 7) links [text](url)
    s = s.replace(
      /\[([^\]]+)\]$$(https?:\/\/[^\s)]+)$$/g,
      '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-emerald-600 dark:text-emerald-400 underline hover:no-underline">$1</a>',
    )
  
    // 8) lists and paragraphs
    const lines = s.split(/\r?\n/)
    let html = ""
    let inUl = false
    let inOl = false
  
    const flushUl = () => {
      if (inUl) {
        html += "</ul>"
        inUl = false
      }
    }
    const flushOl = () => {
      if (inOl) {
        html += "</ol>"
        inOl = false
      }
    }
  
    for (const line of lines) {
      if (/^\s*[-*]\s+/.test(line)) {
        if (!inUl) {
          flushOl()
          html += '<ul class="list-disc pl-5 space-y-1">'
          inUl = true
        }
        html += `<li>${line.replace(/^\s*[-*]\s+/, "")}</li>`
      } else if (/^\s*\d+\.\s+/.test(line)) {
        if (!inOl) {
          flushUl()
          html += '<ol class="list-decimal pl-5 space-y-1">'
          inOl = true
        }
        html += `<li>${line.replace(/^\s*\d+\.\s+/, "")}</li>`
      } else if (line.trim() === "") {
        flushUl()
        flushOl()
        html += "<br/>"
      } else {
        flushUl()
        flushOl()
        html += `<p>${line}</p>`
      }
    }
    flushUl()
    flushOl()
  
    return html
  }
  
  // Default export for compatibility with default imports
  export default markdownToHtml
  