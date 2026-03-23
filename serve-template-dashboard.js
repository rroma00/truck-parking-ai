const http = require('http')
const fs = require('fs')
const path = require('path')

const HOST = process.env.TEMPLATE_HOST || '127.0.0.1'
const PORT = Number(process.env.TEMPLATE_PORT || 4321)
const rootDir = path.join(__dirname, 'template', 'Dashboard')
const defaultFile = 'code.html'

const mimeTypes = {
  '.css': 'text/css; charset=utf-8',
  '.gif': 'image/gif',
  '.html': 'text/html; charset=utf-8',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.txt': 'text/plain; charset=utf-8',
  '.webp': 'image/webp'
}

function send(res, statusCode, body, contentType) {
  res.writeHead(statusCode, { 'Content-Type': contentType })
  res.end(body)
}

function resolveFilePath(urlPath) {
  const safePath = decodeURIComponent(urlPath.split('?')[0])
  const relativePath = safePath === '/' ? defaultFile : safePath.replace(/^\/+/, '')
  const filePath = path.normalize(path.join(rootDir, relativePath))

  if (!filePath.startsWith(rootDir)) {
    return null
  }

  return filePath
}

const server = http.createServer((req, res) => {
  const filePath = resolveFilePath(req.url || '/')

  if (!filePath) {
    send(res, 403, 'Forbidden', 'text/plain; charset=utf-8')
    return
  }

  fs.readFile(filePath, (error, data) => {
    if (error) {
      if (error.code === 'ENOENT') {
        send(res, 404, 'Not found', 'text/plain; charset=utf-8')
        return
      }

      send(res, 500, 'Internal server error', 'text/plain; charset=utf-8')
      return
    }

    const ext = path.extname(filePath).toLowerCase()
    send(res, 200, data, mimeTypes[ext] || 'application/octet-stream')
  })
})

server.listen(PORT, HOST, () => {
  console.log(`Template dashboard server running at http://${HOST}:${PORT}`)
})
