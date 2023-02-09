const express = require('express')
const { createServer } = require('http')
const { WebSocket, WebSocketServer } = require('ws')
const cors = require('cors')
const path = require('path')

const app = express()
const server = createServer(app)
const wss = new WebSocketServer({ server })

const clients = {}
let usersids

app.use(cors())
app.use(express.json())

const getUniqueID = () => {
    const s4 = () => Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1)
    return s4() + s4() + '-' + s4()
}


wss.on('connection', (ws) => {
    ws.on('error', console.error)
    let userId = getUniqueID()
    clients[userId] = ws

    ws.on('message', (message) => {
        console.log(`Received message from user: ${JSON.parse(message).userId} message: ${JSON.parse(message).message}`)
        for (const client in clients) { if (clients[client].readyState === WebSocket.OPEN) { clients[client].send(JSON.stringify({ sender: userId, message: JSON.parse(message).message })) } }
    })
    ws.on('close', () => { delete clients[usersids]; console.log(`User ${usersids} disconnected`) })
})


app.use(express.static(path.join(__dirname + '/client/build')))
app.get('*', (req, res) => res.sendFile(path.join(__dirname + '/client/build')))

app.get('/api', (req, res) => res.json({ message: 'From api with love' }))

// app.listen(3000, () => { console.log('App running on port 3000 🔥') })
// server.listen(3000, '0.0.0.0', () => { console.log(`App running on port 3000 🔥`); wss.on('error', console.error) })
server.listen(process.env.PORT, () => { console.log(`App running on port ${process.env.PORT} 🔥`); wss.on('error', console.error) })