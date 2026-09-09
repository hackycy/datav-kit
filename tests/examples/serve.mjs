import { readFile } from 'node:fs/promises'
import http from 'node:http'
import path from 'node:path'
import process from 'node:process'

const root = path.resolve('docs/.vitepress/dist')
const base = (process.env.VITEPRESS_BASE || '/').replace(/\/$/, '')
const types = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css', '.png': 'image/png', '.svg': 'image/svg+xml' }
http.createServer(async (request, response) => {
  const url = new URL(request.url, 'http://localhost')
  const decoded = decodeURIComponent(url.pathname)
  const pathname = base && decoded.startsWith(`${base}/`) ? decoded.slice(base.length) : decoded
  if (pathname === '/favicon.ico') {
    response.writeHead(204).end()
    return
  }
  const filename = pathname.endsWith('/') ? `${pathname}index.html` : path.extname(pathname) ? pathname : `${pathname}.html`
  const file = path.resolve(root, `.${filename}`)
  if (!file.startsWith(`${root}${path.sep}`)) {
    response.writeHead(403).end()
    return
  }
  try {
    const content = await readFile(file)
    response.writeHead(200, { 'Content-Type': types[path.extname(file)] || 'text/plain' })
    response.end(content)
  }
  catch {
    response.writeHead(404).end('Not found')
  }
}).listen(4173, '127.0.0.1')
