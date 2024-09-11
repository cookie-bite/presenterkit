const { WebSocket, WebSocketServer } = require('ws')
const { createServer } = require('http')
const { BlobServiceClient } = require('@azure/storage-blob')
const { MongoClient } = require('mongodb')

const express = require('express')
const Datastore = require('@seald-io/nedb')
const path = require('path')
const cors = require('cors')
const jwt = require('jsonwebtoken')

const { genColor, genRandom } = require('./utils/core.utils')

require('dotenv/config')



// MARK: Express

const app = express()
const server = createServer(app)
const wss = new WebSocketServer({ server })



// MARK: Constants

const cooldown = 2 * 60 * 1000



// MARK: NeDB

const db = {}

db.events = new Datastore()



// MARK: Exports

module.exports = { db }



// MARK: Middlewares

app.use(cors())
app.use(express.json())



// MARK: Functions

console.clearLastLine = () => {
    process.stdout.moveCursor(0, -1)
    process.stdout.clearLine(1)
}


const sendRoom = (eventID, room, obj) => {
    wss.clients.forEach((client) => {
        if ((client.eventID === eventID) && (client.readyState === WebSocket.OPEN)) {
            if (room === 'admin' && !client.isAdmin) return
            client.send(JSON.stringify(obj))
        }
    })
}


const sendUser = (eventID, userID, obj) => {
    wss.clients.forEach((client) => {
        if ((client.eventID === eventID) && (client.userID === userID)) {
            client.send(JSON.stringify(obj))
        }
    })
}


const init = () => {
    console.clear()
    console.log(`\x1b[33mApp running on 🔥\n\n\x1b[36m  http://localhost:${process.env.PORT}  \x1b[0m\n`)
    wss.on('error', console.error)
}



// MARK: Websocket

// const interval = setInterval(() => {
//     console.log('interval')
//     const CLWS = db.getCollection('websocket')
//     const sockets = CLWS.find()

//     sockets.forEach((socket) => {
//         console.log('Users', socket.userRoom.length)
//         socket.userRoom.forEach((client) => {
//             if (client.isAlive === false && client.readyState === WebSocket.OPEN) return client.terminate()

//             client.isAlive = false
//             console.log(client.userID, client.readyState)
//             if (client.readyState) client.send(JSON.stringify({ command: 'PING' }))
//         })
//     })
// }, 30000)



wss.on('connection', async (ws) => {
    const userID = genRandom(8)

    ws.userID = userID
    ws.isAlive = true


    ws.on('message', async (msg) => {
        const req = JSON.parse(msg)

        if (req.command === 'JOIN_ROOM') {
            ws.eventID = req.eventID

            const event = await db.events.findOneAsync({ eventID: req.eventID })

            const user = {
                userID,
                username: 'In lobby',
                color: genColor(),
                isInLobby: true,
                isPresenter: false,
                isAdmin: false,
                adminKey: ''
            }


            try {
                const payload = jwt.verify(req.token, process.env.ACS_TKN_SCT)
                if (event.presenter.id === payload.sub) {
                    user.username = 'Presenter'
                    user.color = '#ffffff'
                    user.isInLobby = false
                    user.isPresenter = true
                    user.isAdmin = true
                    user.adminKey = genRandom(16)

                }
            } catch (err) {
                console.log(err)
            } finally {
                ws.username = user.username
                ws.isAdmin = user.isAdmin

                await db[`event-${req.eventID}`].insertAsync(user)
                const userList = await db[`event-${req.eventID}`].findAsync({})
                const userShares = event.shares.filter(s => s.isShared)
                const roomActivity = { user: { id: userID, name: user.username }, activity: user.isPresenter ? 'joined' : 'in lobby' }
                await db.events.updateAsync({ eventID: req.eventID }, { $set: { roomActivity } })

                ws.send(JSON.stringify({
                    command: 'INIT_USER',
                    user: { id: userID, name: user.username, color: user.color, isPresenter: user.isPresenter },
                    queue: user.isPresenter ? event.queue : [],
                    quests: event.quests,
                    slides: event.slides,
                    activeSlide: event.activeSlide,
                    shares: user.isPresenter ? event.shares : userShares,
                    roomActivity,
                    display: event.display,
                    config: event.config
                }))

                sendRoom(req.eventID, 'user', { command: 'ROOM_ACTY', roomActivity, userList })
                sendRoom(req.eventID, 'admin', { command: 'UPDT_STTS', userList })
            }
        } else if (req.command === 'SET_USER') {
            const user = await db[`event-${req.eventID}`].findOneAsync({ userID })
            await db[`event-${req.eventID}`].updateAsync({ userID }, { $set: { isInLobby: !user.isInLobby, username: req.username } })
            const userList = await db[`event-${req.eventID}`].findAsync({})
            const roomActivity = { user: { id: userID, name: req.username }, activity: req.roomActivity }
            await db.events.updateAsync({ eventID: req.eventID }, { $set: { roomActivity } })

            sendRoom(req.eventID, 'user', { command: 'ROOM_ACTY', roomActivity, userList })
            sendRoom(req.eventID, 'admin', { command: 'UPDT_STTS', userList })
        } else if (req.command === 'SET_STTS') {
            let userShares = []

            const event = await db.events.findOneAsync({ eventID: req.eventID })

            wss.clients.forEach((client) => {
                if (client.userID === req.userID) {
                    if (req.isAdmin) {
                        client.isAdmin = true
                        userShares = event.shares
                    } else {
                        client.isAdmin = false
                        userShares = event.shares.filter(s => s.isShared)
                    }
                }
            })

            const adminKey = req.isAdmin ? genRandom(16) : ''
            await db[`event-${req.eventID}`].updateAsync({ userID: req.userID }, { $set: { adminKey, isAdmin: req.isAdmin } })

            const userList = await db[`event-${req.eventID}`].findAsync({})

            sendUser(req.eventID, req.userID, { command: 'SET_STTS', queue: event.queue, display: event.display, config: event.config, shares: userShares, isAdmin: req.isAdmin, adminKey })
            sendRoom(req.eventID, 'admin', { command: 'UPDT_STTS', userList })
        } else if (req.command === 'SEND_MSG') {
            console.log(`[${req.username}-${req.userID}]: \x1b[33m${req.quest.label}\x1b[0m`)

            const event = await db.events.findOneAsync({ eventID: req.eventID })

            if (event.config.forwarding.is) {
                const newQueue = { id: genRandom(8), userID: req.userID, author: req.username, color: req.quest.color, label: req.quest.label }
                await db.events.updateAsync({ eventID: req.eventID }, { $push: { queue: newQueue } })

                sendRoom(req.eventID, 'admin', { command: 'SEND_MSG', quest: newQueue, user: { id: req.userID, name: req.username } })
            } else {
                const newQuest = { id: genRandom(8), userID: req.userID, username: req.username, color: req.quest.color, label: req.quest.label, effect: true }
                await db.events.updateAsync({ eventID: req.eventID }, { $push: { quests: newQuest } })

                sendRoom(req.eventID, 'user', { command: 'SEND_USERS', quest: newQuest, user: { id: req.userID, name: req.username } })
            }
        } else if (req.command === 'SEND_USERS') {
            console.log(`[${req.username}-${req.userID}]: \x1b[33m${req.quest.label}\x1b[0m`)

            const event = await db.events.findOneAsync({ eventID: req.eventID })
            event.queue.splice(req.quest.index, 1)
            await db.events.updateAsync({ eventID: req.eventID }, { $set: { queue: event.queue } })

            const newQuest = { id: req.id, userID: req.userID, username: req.username, color: req.quest.color, label: req.quest.label, effect: true }
            await db.events.updateAsync({ eventID: req.eventID }, { $push: { quests: newQuest } })

            sendRoom(req.eventID, 'user', { command: 'SEND_USERS', quest: newQuest, user: { id: req.userID, name: req.username } })
            sendRoom(req.eventID, 'admin', { command: 'UPDT_QUE', queue: event.queue })
        } else if (req.command === 'CLDW_USER') {
            const event = await db.events.findOneAsync({ eventID: req.eventID })
            event.queue = event.queue.filter(msg => msg.userID !== req.userID)
            await db.events.updateAsync({ eventID: req.eventID }, { $set: { queue: event.queue } })

            sendUser(req.eventID, req.userID, { command: 'CLDW_USER', cooldown: Date.now() + cooldown })
            sendRoom(req.eventID, 'admin', { command: 'UPDT_QUE', queue: event.queue })
        } else if (req.command === 'DISP_LBL') {
            console.log(`Display quest: \x1b[33m[${req.display.author ? req.display.author : 'Author'}] ${req.display.quest}\x1b[0m`)

            await db.events.updateAsync({ eventID: req.eventID }, { $set: { display: req.display } })

            // if (req.display.author) quests[req.index].effect = false

            sendRoom(req.eventID, 'user', { command: 'DISP_LBL', display: req.display, index: req.index })
            sendRoom(req.eventID, 'admin', { command: 'DISP_LBL', display: req.display, index: req.index })
        } else if (req.command === 'SHR_ACT') {
            await db.events.updateAsync({ eventID: req.eventID }, { $set: { shares: req.shares } })
            let userShares = req.shares.filter(s => s.isShared)

            if (req.action !== 'save') sendRoom(req.eventID, 'user', { command: 'SHR_ACT', action: req.action, userID, shares: userShares, activeShare: req?.activeShare })
            sendRoom(req.eventID, 'admin', { command: 'SHR_ACT', action: 'save', userID, shares: req.shares })
        } else if (req.command === 'SEND_TYP') {
            sendRoom(req.eventID, 'user', { command: 'SEND_TYP', isTyping: req.isTyping, color: req.color, userID: req.userID, username: req.username })
        } else if (req.command === 'SET_CNFG') {
            if (req.config.name === 'forwarding') await db.events.updateAsync({ eventID: req.eventID }, { $set: { config: { forwarding: { is: req.config.is } } } })

            sendRoom(req.eventID, 'admin', { command: 'UPDT_CNFG', name: req.config.name, updateTo: { is: req.config.is } })
        } else if (req.command === 'UPDT_SLDS') {
            await db.events.updateAsync({ eventID: req.eventID }, { $set: { activeSlide: req.activeSlide } })

            sendRoom(req.eventID, 'user', { command: 'UPDT_SLDS', slidesUpdate: false, isStarted: req.isStarted, pageUpdate: req.pageUpdate, activeSlide: req.activeSlide })
        }

        if (req.command === 'PONG') {
            console.log(`[${userID}] \x1b[33mPONG is received\x1b[0m`)
            ws.isAlive = true
        }
    })


    ws.on('close', async () => {
        const userList = await db[`event-${ws.eventID}`].findAsync({})
        await db[`event-${ws.eventID}`].removeAsync({ userID })
        const roomActivity = { user: { id: userID, name: ws.username }, activity: 'left' }
        await db.events.updateAsync({ eventID: ws.eventID }, { $set: { roomActivity } })

        sendRoom(ws.eventID, 'user', { command: 'ROOM_ACTY', roomActivity, userList })
        sendRoom(ws.eventID, 'admin', { command: 'UPDT_STTS', userList })
    })


    ws.on('error', console.error)
})


// wss.on('close', () => clearInterval(interval))



// MARK: Server

let DB

const connectDB = async () => {
    const client = new MongoClient(process.env.DB_CONNECT)
    await client.connect()
    DB = client.db('presenterkit')
}


(async () => await connectDB().then(() => {
    console.log('Connected to MongoDB')
    server.listen(process.env.PORT, '0.0.0.0', () => init())
}).catch((err) => console.log(err)))()



module.exports.collection = (c) => DB.collection(c)



// MARK: Routes

app.use('/auth', require('./routes/auth.routes'))
app.use('/event', require('./routes/event.routes'))


app.post('/slide', async (req, res) => {
    const { eventID, slide } = req.body

    const newSlide = { name: slide.name, pageCount: slide.pageCount }
    await db.events.updateAsync({ eventID }, { $push: { slides: newSlide } })
    const event = await db.events.findOneAsync({ eventID })

    sendRoom(eventID, 'user', { command: 'UPDT_SLDS', slidesUpdate: true, slides: event.slides })
    res.json({ success: true, message: 'File uploaded', slide: newSlide })
})


app.delete('/slide', async (req, res) => {
    const { eventID, slide } = req.body

    const blobService = await BlobServiceClient.fromConnectionString(process.env.AZURE_BLOB_CONNECT)
    const pdfsContainer = await blobService.getContainerClient(`event/${eventID}/pdfs`)
    const imgsContainer = await blobService.getContainerClient(`event/${eventID}/imgs`)

    const pdfBlob = pdfsContainer.getBlockBlobClient(`${slide.name}.pdf`)
    pdfBlob.delete()

    for (let i = 1; i <= slide.pageCount; i++) {
        const imgBlob = imgsContainer.getBlockBlobClient(`${slide.name}/${i}.webp`)
        imgBlob.delete()
    }

    const event = await db.events.findOneAsync({ eventID })
    event.slides = event.slides.filter((s) => s.name !== slide.name)
    await db.events.updateAsync({ eventID }, { $set: { slides: event.slides } })

    sendRoom(eventID, 'user', { command: 'UPDT_SLDS', slidesUpdate: true, slides: event.slides })
    res.json({ success: true, message: 'Slide deleted' })
})


app.use('/', express.static(path.join(__dirname, 'client', 'build')))
app.get('*', (req, res) => res.sendFile(path.join(__dirname, 'client', 'build', 'index.html')))