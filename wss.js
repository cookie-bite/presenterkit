const { WebSocket, WebSocketServer } = require('ws')
const { ObjectId } = require('mongodb')
const Datastore = require('@seald-io/nedb')
const jwt = require('jsonwebtoken')

const { genColor, genRandom } = require('./utils/core.utils')
const { collection, db, server } = require('./api')

require('dotenv/config')



// MARK: Constants

const wss = new WebSocketServer({ server })
const cooldown = 2 * 60 * 1000



// MARK: Functions

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



// MARK: Exports

module.exports = { sendRoom, sendUser }



// MARK: Websocket

const interval = setInterval(() => {
    wss.clients.forEach((client) => {
        if (client.isAlive === false && client.readyState === WebSocket.OPEN) return client.terminate()

        client.isAlive = false
        if (client.readyState) client.send(JSON.stringify({ command: 'PING' }))
    })
}, 20000)



wss.on('connection', async (ws) => {

    ws.isAlive = true


    ws.on('message', async (msg) => {
        const req = JSON.parse(msg)

        if (req.command === 'JOIN_ROOM') {
            ws.eventID = req.eventID

            let event = await db.events.findOneAsync({ eventID: req.eventID })

            // if (!event) {
            //     event = await collection('events').findOne({ eventID: req.eventID }, { projection: { _id: 0 } })

            //     if (!event) return

            //     try {
            //         const payload = jwt.verify(req.token, process.env.ACS_TKN_SCT)
            //         if (event.presenter.id === payload.sub) {
            //             await db.events.insertAsync(event)
            //             db[`event-${req.eventID}`] = new Datastore()
            //         } else {
            //             // handle first user join
            //         }
            //     } catch (err) {
            //         // handle first user join
            //     }
            // }


            let user = {
                userID: genRandom(8, 10),
                username: 'In lobby',
                color: genColor(),
                isActive: true,
                isInLobby: true,
                isPresenter: false,
                isAdmin: false,
                adminKey: ''
            }


            if (req.userID) {
                const newUser = await db[`event-${req.eventID}`].findOneAsync({ userID: req.userID })
                if (newUser) {
                    user = newUser
                    user.isActive = true
                    await db[`event-${req.eventID}`].updateAsync({ userID: req.userID }, { $set: { isActive: true } })
                }
            }


            try {
                const payload = jwt.verify(req.token, process.env.ACS_TKN_SCT)
                if (event.presenter.id === payload.sub) {
                    const presenter = await collection('users').findOne({ _id: new ObjectId(payload.sub) })

                    user.username = presenter.username
                    user.color = presenter.color
                    user.isInLobby = false
                    user.isPresenter = true
                    user.isAdmin = true
                    user.adminKey = genRandom(16)
                }
            } catch (err) {
                // console.log(err)
            } finally {
                ws.userID = user.userID
                ws.username = user.username
                ws.isAdmin = user.isAdmin

                await db[`event-${req.eventID}`].updateAsync({ userID: user.userID }, user, { upsert: true })


                const userShares = event.shares.filter(s => s.isShared)
                const userList = await db[`event-${req.eventID}`].findAsync({})
                const roomActivity = { user: { id: user.userID, name: user.username }, activity: (user.isPresenter || !user.isInLobby) ? 'joined' : 'in lobby' }
                await db.events.updateAsync({ eventID: req.eventID }, { $set: { roomActivity } })

                ws.send(JSON.stringify({
                    command: 'INIT_USER',
                    user: { id: ws.userID, name: user.username, color: user.color, isPresenter: user.isPresenter, isInLobby: user.isInLobby },
                    eventID: req.eventID,
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
            let event = await db.events.findOneAsync({ eventID: req.eventID })

            const user = await db[`event-${req.eventID}`].findOneAsync({ userID: ws.userID })
            await db[`event-${req.eventID}`].updateAsync({ userID: ws.userID }, { $set: { isInLobby: !user.isInLobby, username: req.username } })

            try {
                const payload = jwt.verify(req.token, process.env.ACS_TKN_SCT)
                if (event.presenter.id === payload.sub) {
                    await collection('users').updateOne({ _id: new ObjectId(payload.sub) }, { $set: { username: req.username } })
                }
            } catch (err) {

            }

            const userList = await db[`event-${req.eventID}`].findAsync({})
            const roomActivity = { user: { id: ws.userID, name: req.username }, activity: req.roomActivity }
            await db.events.updateAsync({ eventID: req.eventID }, { $set: { roomActivity } })

            ws.username = req.username

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
            console.log(`[${ws.username}-${ws.userID}] \x1b[33m${req.quest.label}\x1b[0m`)

            const event = await db.events.findOneAsync({ eventID: req.eventID })

            if (event.config.forwarding.is) {
                const newQueue = { id: genRandom(8), userID: ws.userID, author: ws.username, color: req.quest.color, label: req.quest.label }
                await db.events.updateAsync({ eventID: req.eventID }, { $push: { queue: newQueue } })

                sendRoom(req.eventID, 'admin', { command: 'SEND_MSG', quest: newQueue, user: { id: ws.userID, name: ws.username } })
            } else {
                const newQuest = { id: genRandom(8), userID: ws.userID, username: ws.username, color: req.quest.color, label: req.quest.label, effect: true }
                await db.events.updateAsync({ eventID: req.eventID }, { $push: { quests: newQuest } })

                sendRoom(req.eventID, 'user', { command: 'SEND_USERS', quest: newQuest, user: { id: ws.userID, name: ws.username } })
            }
        } else if (req.command === 'SEND_USERS') {
            console.log(`[${ws.username}-${ws.userID}] \x1b[33m${req.quest.label}\x1b[0m`)

            const event = await db.events.findOneAsync({ eventID: req.eventID })
            event.queue.splice(req.quest.index, 1)
            await db.events.updateAsync({ eventID: req.eventID }, { $set: { queue: event.queue } })

            const newQuest = { id: req.id, userID: ws.userID, username: ws.username, color: req.quest.color, label: req.quest.label, effect: true }
            await db.events.updateAsync({ eventID: req.eventID }, { $push: { quests: newQuest } })

            sendRoom(req.eventID, 'user', { command: 'SEND_USERS', quest: newQuest, user: { id: ws.userID, name: ws.username } })
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

            if (req.action !== 'save') sendRoom(req.eventID, 'user', { command: 'SHR_ACT', action: req.action, userID: ws.userID, shares: userShares, activeShare: req?.activeShare })
            sendRoom(req.eventID, 'admin', { command: 'SHR_ACT', action: 'save', userID: ws.userID, shares: req.shares })
        } else if (req.command === 'SEND_TYP') {
            sendRoom(req.eventID, 'user', { command: 'SEND_TYP', isTyping: req.isTyping, color: req.color, userID: ws.userID, username: ws.username })
        } else if (req.command === 'SET_CNFG') {
            if (req.config.name === 'forwarding') await db.events.updateAsync({ eventID: req.eventID }, { $set: { config: { forwarding: { is: req.config.is } } } })

            sendRoom(req.eventID, 'admin', { command: 'UPDT_CNFG', name: req.config.name, updateTo: { is: req.config.is } })
        } else if (req.command === 'UPDT_SLDS') {
            await db.events.updateAsync({ eventID: req.eventID }, { $set: { activeSlide: req.activeSlide } })

            sendRoom(req.eventID, 'user', { command: 'UPDT_SLDS', slidesUpdate: false, isStarted: req.isStarted, pageUpdate: req.pageUpdate, activeSlide: req.activeSlide })
        } else if (req.command === 'SWAP_SLDS') {
            await db.events.updateAsync({ eventID: req.eventID }, { $set: { slides: req.slides } })

            sendRoom(req.eventID, 'user', { command: 'SWAP_SLDS', slides: req.slides })
        }

        if (req.command === 'PONG') {
            console.log(`[${ws.username}-${ws.userID}] \x1b[33mPONG is received\x1b[0m`)
            ws.isAlive = true
        }
    })


    ws.on('close', async () => {
        console.log('[WS Close] ws.eventID:', ws.eventID)
        console.log('NeDB', db[`event-${ws.eventID}`])

        if (db[`event-${ws.eventID}`]) {
            await db[`event-${ws.eventID}`].updateAsync({ userID: ws.userID }, { $set: { isActive: false } })
            const activeUsers = await db[`event-${ws.eventID}`].findAsync({ isActive: true })
            const userList = await db[`event-${ws.eventID}`].findAsync({})

            const roomActivity = { user: { id: ws.userID, name: ws.username }, activity: 'left' }
            await db.events.updateAsync({ eventID: ws.eventID }, { $set: { roomActivity } })


            if (activeUsers.length === 0) {
                const event = await db.events.findOneAsync({ eventID: ws.eventID }, { _id: 0 })
                event.activeSlide = {}
                await collection('events').replaceOne({ eventID: ws.eventID }, event)
                await db.events.removeAsync({ eventID: ws.eventID })
                delete db[`event-${ws.eventID}`]
            }


            sendRoom(ws.eventID, 'user', { command: 'ROOM_ACTY', roomActivity, userList })
            sendRoom(ws.eventID, 'admin', { command: 'UPDT_STTS', userList })
        }
    })


    ws.on('error', console.error)
})


wss.on('close', () => clearInterval(interval))
wss.on('error', console.error)