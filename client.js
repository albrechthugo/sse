const sse = new EventSource('http://localhost:3333/api/events')

const messagesContainerEl = document.querySelector('.messages-container')

sse.onopen = () => {
  console.log('connection was established')
}

sse.onmessage = (e) => {
  const message = JSON.parse(e.data)?.message

  const messageItemEl = document.createElement('article')
  messageItemEl.innerHTML = message

  messagesContainerEl.appendChild(messageItemEl)
}
