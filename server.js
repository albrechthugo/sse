import { randomUUID } from 'node:crypto'
import express from 'express'

const PORT = 3333

const defaultHeaders = {
  'Content-Type': 'text/event-stream',
  Connection: 'keep-alive',
  'Cache-Control': 'no-cache',
  'Access-Control-Allow-Origin': '*'
}

let connectedClients = []

const getMessagesHandler = (req, res) => {
  res.writeHead(200, defaultHeaders)

  const clientId = randomUUID()
  connectedClients.push({ id: clientId, response: res })

  req.on('close', () => {
    connectedClients = connectedClients.filter(
      (client) => client.id !== clientId
    )

    res.end()
  })
}

const postMessageHandler = (req, res) => {
  const message = req.body?.message

  if (!message) {
    throw new Error(
      'Message parameter is required, please retry providing correct arguments'
    )
  }

  connectedClients.forEach((client) => {
    const responseBody = `data: ${JSON.stringify({
      message
    })}\n\n`

    client.response.write(responseBody)
  })

  res.end()
}

const app = express()

app.use(express.json())

app.get('/api/events', getMessagesHandler)
app.post('/api/postEvent', postMessageHandler)

app.listen(PORT, () => {
  console.log(`server is running on port ${PORT}`)
})
