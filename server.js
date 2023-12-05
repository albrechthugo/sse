import { randomUUID } from 'node:crypto'
import { createServer } from 'node:http'

const PORT = 3333

const defaultHeaders = {
  'Content-Type': 'text/event-stream',
  Connection: 'keep-alive',
  'Cache-Control': 'no-cache',
  'Access-Control-Allow-Origin': '*'
}

const handler = (req, res) => {
  if (req.url === '/api/events') {
    res.writeHead(200, defaultHeaders)

    const messagesIntervalId = setInterval(() => {
      const responseBody = `data: ${JSON.stringify({
        message: `Message ID: ${randomUUID()}`
      })}\n\n`

      res.write(responseBody)
    }, 1000)

    req.on('close', () => {
      clearInterval(messagesIntervalId)
      res.end()
    })

    return
  }

  res.end()
}

const httpServer = createServer(handler)

httpServer.listen(PORT)
