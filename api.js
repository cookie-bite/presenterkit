const { WebSocket, WebSocketServer } = require('ws')
const { createServer } = require('http')
const pdf2img = require('pdf-img-convert')
const express = require('express')
const path = require('path')
const cors = require('cors')
const os = require('os')
const fs = require('fs-extra')
const electron = require('electron')


const app = express()
const server = createServer(app)
const wss = new WebSocketServer({ server })

const isDev = process.env.NODE_ENV === 'development'


// MARK: Storage

const ip = { address: '', all: [] }
const adminRoom = 0
const userRoom = 1

const rooms = {}

var quests = []
var queue = []
var slides = []
var activeSlide = {}

const cooldown = 2 * 60 * 1000
var shares = [{ body: '', urls: [{ link: '', icon: 'link-o', color: '#0A84FF' }], isShared: false }]
var config = { forwarding: { is: false } }
var display = { quest: 'Welcome to Event', author: '' }
var roomActivity = { user: { id: '', name: '' }, activity: '' }

var periodicTable = [
    'Hydrogen', 'Helium', 'Lithium', 'Beryllium', 'Boron', 'Carbon', 'Nitrogen', 'Oxygen',
    'Fluorine', 'Neon', 'Sodium', 'Magnesium', 'Aluminum', 'Silicon', 'Phosphorus', 'Sulfur',
    'Chlorine', 'Argon', 'Potassium', 'Calcium', 'Scandium', 'Titanium', 'Vanadium', 'Chromium',
    'Manganese', 'Iron', 'Cobalt', 'Nickel', 'Copper', 'Zinc', 'Gallium', 'Germanium', 'Arsenic',
    'Selenium', 'Bromine', 'Krypton', 'Rubidium', 'Strontium', 'Yttrium', 'Zirconium', 'Niobium',
    'Molybdenum', 'Technetium', 'Ruthenium', 'Rhodium', 'Palladium', 'Silver', 'Cadmium', 'Indium',
    'Tin', 'Antimony', 'Tellurium', 'Iodine', 'Xenon', 'Cesium', 'Barium', 'Lanthanum', 'Cerium',
    'Praseodymium', 'Neodymium', 'Promethium', 'Samarium', 'Europium', 'Gadolinium', 'Terbium',
    'Dysprosium', 'Holmium', 'Erbium', 'Thulium', 'Ytterbium', 'Lutetium', 'Hafnium', 'Tantalum',
    'Tungsten', 'Rhenium', 'Osmium', 'Iridium', 'Platinum', 'Gold', 'Mercury', 'Thallium', 'Lead',
    'Bismuth', 'Polonium', 'Astatine', 'Radon', 'Francium', 'Radium', 'Actinium', 'Thorium',
    'Protactinium', 'Uranium', 'Neptunium', 'Plutonium', 'Americium', 'Curium', 'Berkelium',
    'Californium', 'Einsteinium', 'Fermium', 'Mendelevium', 'Nobelium', 'Lawerencium', 'Rutherfordium',
    'Dubnium', 'Seaborgium', 'Bohrium', 'Hassium', 'Meitnerium', 'Darmstadtium', 'Roentgenium',
    'Copernicium', 'Nihonium', 'Flerovium', 'Moscovium', 'Livermorium', 'Tennessine', 'Oganesson'
]



// MARK: Middlewares

app.use(cors())
app.use(express.json())



// MARK: Functions

console.clearLastLine = () => {
    process.stdout.moveCursor(0, -1)
    process.stdout.clearLine(1)
}


const genColor = () => {
    const h = { min: 0, max: 360 }
    const s = { min: 50, max: 100 }
    const l = { min: 30, max: 70 }

    const hslToHex = (h, s, l) => {
        l /= 100
        const a = s * Math.min(l, 1 - l) / 100
        const f = n => {
            const k = (n + h / 30) % 12
            const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1)
            return Math.round(255 * color).toString(16).padStart(2, '0')
        }
        return `#${f(0)}${f(8)}${f(4)}`
    }

    const random = (x) => {
        return +(Math.random() * (x.max - x.min) + x.min).toFixed()
    }

    const r = { h: random(h), s: random(s), l: random(l) }

    return hslToHex(r.h, r.s, r.l)
}


const genRandom = (bytes = 4) => {
    return require('crypto').randomBytes(bytes).toString('hex')
}


const sendRooms = (ids, obj) => {
    // Object.entries(rooms[room]).forEach(([, sock]) => sock.send({ message }))

    let IDs = Number.isInteger(ids) ? [ids] : ids
    for (let id in IDs) {
        for (const client in rooms[IDs[id]]) {
            if (rooms[IDs[id]][client].readyState === WebSocket.OPEN) {
                rooms[IDs[id]][client].send(JSON.stringify(obj))
            }
        }
    }
}


const sendUser = (roomID, userID, obj) => {
    if (rooms[roomID][userID]) rooms[roomID][userID].send(JSON.stringify(obj))
}


const getUserList = () => {
    var list = []
    Object.keys(rooms[userRoom]).forEach((userID) => {
        let user = rooms[userRoom][userID]
        list.push({
            userID,
            username: user.username,
            userColor: user.color,
            isPresenter: user.isPresenter,
            isAdmin: user.isAdmin,
            isInLobby: user.isInLobby
        })
    })
    return list
}


const getSlides = () => {
    slides = []
    fs.ensureDirSync(path.join(electron.app.getPath('userData'), 'uploads', 'imgs'))
    fs.readdirSync(path.join(electron.app.getPath('userData'), 'uploads', 'imgs')).forEach((folder) => {
        slides.push({ name: folder, pageCount: fs.readdirSync(path.join(electron.app.getPath('userData'), 'uploads', 'imgs', folder)).length })
    })
}


const initIpAddress = () => {
    const ips = []

    Object.keys(os.networkInterfaces()).forEach((type) => {
        os.networkInterfaces()[type].forEach((ip) => {
            if (ip.family === 'IPv4' && !/^(::f{4}:)?127\.([0-9]{1,3})\.([0-9]{1,3})\.([0-9]{1,3})/.test(ip.address)) ips.push(ip.address)
        })
    })

    ip.address = ips[0]
    ip.all = ips
}


const init = () => {
    initIpAddress()
    getSlides()

    console.clear()
    console.log(`\x1b[33mApp running on 🔥\n\n\x1b[36m  http://localhost:${PORT}  \x1b[0m\n`); wss.on('error', console.error)
}



// MARK: Websocket

const interval = setInterval(() => {
    for (const client in rooms[userRoom]) {
        if (rooms[userRoom][client].isAlive === false && rooms[userRoom][client].readyState === WebSocket.OPEN) {
            console.log(`[${rooms[userRoom][client].username}] \x1b[36mWebsocket is terminated\x1b[0m`)
            return rooms[userRoom][client].terminate()
        }

        rooms[userRoom][client].isAlive = false
        rooms[userRoom][client].send(JSON.stringify({ command: 'PING' }))
    }
}, 30000)


wss.on('connection', (ws) => {
    const userID = genRandom(4)
    ws.isAlive = true

    ws.on('message', (msg) => {
        const req = JSON.parse(msg)

        if (req.command === 'JOIN_ROOM') {
            if (!rooms[userRoom]) rooms[userRoom] = {}
            if (!rooms[adminRoom]) rooms[adminRoom] = {}

            rooms[userRoom][userID] = ws
            rooms[userRoom][userID].username = 'In lobby'
            rooms[userRoom][userID].isInLobby = true
            rooms[userRoom][userID].color = genColor()
            rooms[userRoom][userID].isPresenter = req.isPresenter
            rooms[userRoom][userID].isAdmin = false
            rooms[userRoom][userID].adminKey = ''

            if (req.isPresenter) {
                rooms[userRoom][userID].isInLobby = false
                rooms[userRoom][userID].color = '#ffffff'
                rooms[userRoom][userID].isAdmin = true
                rooms[userRoom][userID].adminKey = genRandom(8)
                rooms[adminRoom][userID] = rooms[userRoom][userID]
            }

            const userShares = shares.filter(s => s.isShared)
            roomActivity = { user: { id: userID, name: rooms[userRoom][userID].username }, activity: req.roomActivity }

            ws.send(JSON.stringify({ command: 'INIT_USER', quests, display, roomActivity, slides, activeSlide, ip, queue, config, shares: req.isPresenter ? shares : userShares, user: { id: userID, name: rooms[userRoom][userID].username, color: rooms[userRoom][userID].color } }))
            sendRooms(userRoom, { command: 'ROOM_ACTY', roomActivity, userList: getUserList() })
            sendRooms(adminRoom, { command: 'UPDT_STTS', userList: getUserList() })
            console.log(`Active users: \x1b[32m${Object.keys(rooms[userRoom]).length}\x1b[0m\nPeriodic table: \x1b[33m${periodicTable.length}\x1b[0m`)
        } else if (req.command === 'SET_STTS') {
            let userShares = []

            if (req.isAdmin) {
                userShares = shares
                rooms[userRoom][req.userID].isAdmin = true
                rooms[userRoom][req.userID].adminKey = genRandom(8)
                rooms[adminRoom][req.userID] = rooms[userRoom][req.userID]
            } else {
                userShares = shares.filter(s => s.isShared)
                rooms[userRoom][req.userID].isAdmin = false
                rooms[userRoom][req.userID].adminKey = ''
                delete rooms[adminRoom][req.userID]
            }

            sendUser(req.room, req.userID, { command: 'SET_STTS', queue, display, config, shares: userShares, isAdmin: req.isAdmin, adminKey: rooms[userRoom][req.userID].adminKey })
            sendRooms(adminRoom, { command: 'UPDT_STTS', userList: getUserList() })
        } else if (req.command === 'APR_REQ') {
            console.log(`[${req.username}-${req.userID}]: \x1b[33m${req.quest.label}\x1b[0m`)

            if (config.forwarding.is) {
                queue.push({ id: genRandom(4), userID: req.userID, author: req.username, label: req.quest.label, color: req.quest.color })
                sendRooms(adminRoom, { command: 'APR_REQ', quest: queue.at(-1), user: { id: req.userID, name: req.username } })
            } else {
                quests.push({ id: genRandom(4), color: req.quest.color, label: req.quest.label, userID: req.userID, username: req.username, effect: true })
                sendRooms(userRoom, { command: 'SEND_USER', quest: quests.at(-1), user: { id: req.userID, name: req.username } })
            }
        } else if (req.command === 'SEND_USER') {
            console.log(`[${req.username}-${req.userID}]: \x1b[33m${req.quest.label}\x1b[0m`)

            queue.splice(req.quest.index, 1)
            quests.push({ effect: true, color: req.quest.color, label: req.quest.label, username: req.username })

            sendRooms(userRoom, { command: 'SEND_USER', quest: quests.at(-1), user: { id: req.userID, name: req.username } })
            sendRooms(adminRoom, { command: 'UPDT_QUE', isFullUpdate: false, index: req.quest.index })
        } else if (req.command === 'CLDW_USER') {
            const queueLength = queue.length
            queue = queue.filter(msg => msg.userID !== req.userID)
            const isFullUpdate = queueLength - queue.length > 1
            const update = isFullUpdate ? { queue } : { index: req.quest.index }

            sendUser(userRoom, req.userID, { command: 'CLDW_USER', cooldown: Date.now() + cooldown })
            sendRooms(adminRoom, { command: 'UPDT_QUE', isFullUpdate, ...update })
        } else if (req.command === 'DISP_LBL') {
            console.log(`Display quest: \x1b[33m[${req.display.author ? req.display.author : 'Author'}] ${req.display.quest}\x1b[0m`)
            display = req.display
            if (req.display.author) quests[req.index].effect = false
            sendRooms(req.room, { command: 'DISP_LBL', display, index: req.index })
        } else if (req.command === 'SHR_ACT') {
            shares = req.shares
            if (req.action === 'send') {
                let userShares = shares.filter(s => s.isShared)
                sendRooms(userRoom, { command: 'SHR_ACT', action: 'send', userID, shares: userShares, activeShare: req.activeShare })
            } else if (req.action === 'update') {
                let userShares = shares.filter(s => s.isShared)
                sendRooms(userRoom, { command: 'SHR_ACT', action: 'update', userID, shares: userShares })
            }
            sendRooms(adminRoom, { command: 'SHR_ACT', action: 'save', userID, shares })
        } else if (req.command === 'SEND_TYP') {
            sendRooms(req.room, { command: 'SEND_TYP', isTyping: req.isTyping, color: req.color, userID: req.userID, username: req.username })
        } else if (req.command === 'SET_USER') {
            console.log(`Username changed from [\x1b[33m${rooms[req.room][userID].username}\x1b[0m] to [\x1b[32m${req.username}\x1b[0m]`)
            if (rooms[userRoom][userID].isInLobby) rooms[userRoom][userID].isInLobby = false
            rooms[userRoom][userID].username = req.username

            roomActivity = { user: { id: userID, name: rooms[req.room][userID].username }, activity: req.roomActivity }
            sendRooms(userRoom, { command: 'ROOM_ACTY', roomActivity, userList: getUserList() })
            sendRooms(adminRoom, { command: 'UPDT_STTS', userList: getUserList() })
        } else if (req.command === 'SET_CNFG') {
            if (req.config.name === 'forwarding') {
                config.forwarding.is = req.config.is
            }

            sendRooms(adminRoom, { command: 'UPDT_CNFG', name: req.config.name, updateTo: config[req.config.name] })
        } else if (req.command === 'UPDT_SLDS') {
            activeSlide = req.activeSlide
            sendRooms(userRoom, { command: 'UPDT_SLDS', slidesUpdate: false, isStarted: req.isStarted, pageUpdate: req.pageUpdate, activeSlide })
        }

        if (req.command === 'PONG') {
            console.log(`[${ws.username}] \x1b[33mPONG is received\x1b[0m`)
            ws.isAlive = true
        }
    })

    ws.on('close', () => {
        Object.keys(rooms).forEach((room) => {
            if (!rooms[room][userID]) return

            console.log(`[${rooms[room][userID].username}-${userID}]\x1b[1;31m Disconnected\x1b[0m ☠️`)
            console.log(`Active users: \x1b[32m${Object.keys(rooms[room]).length}\x1b[0m\nPeriodic table: \x1b[33m${periodicTable.length}\x1b[0m`)

            if (Object.keys(rooms[room]).length === 1) {
                console.log(`[Room-${room}]\x1b[1;31m is closed\x1b[0m ☠️`)
                delete rooms[room]
            } else {
                const leftUser = rooms[room][userID].username
                delete rooms[room][userID]

                if (room == userRoom) {
                    roomActivity = { user: { id: userID, name: leftUser }, activity: 'left' }
                    sendRooms(userRoom, { command: 'ROOM_ACTY', roomActivity, userList: getUserList() })
                    sendRooms(adminRoom, { command: 'UPDT_STTS', userList: getUserList() })
                }
            }
        })
    })

    ws.on('error', console.error)
})


wss.on('close', () => clearInterval(interval))



// MARK: Routes

app.get('/api', (req, res) => res.json({ message: 'From api with love' }))

app.use('/', express.static(path.join(__dirname, 'client', 'build')))
app.use('/uploads', express.static(path.join(electron.app.getPath('userData'), 'uploads')))
app.get('*', (req, res) => res.sendFile(path.join(__dirname, 'client', 'build')))

app.post('/slide', async (req, res) => {
    slides.push({ name: genRandom(2), pageCount: 0 })
    fs.ensureDirSync(path.join(electron.app.getPath('userData'), 'uploads', 'pdfs'))
    fs.ensureDirSync(path.join(electron.app.getPath('userData'), 'uploads', 'imgs'))
    const pipe = req.pipe(fs.createWriteStream(path.join(electron.app.getPath('userData'), 'uploads', 'pdfs', `${slides.at(-1).name}.pdf`)))

    console.log('Slide saved')

    pipe.on('finish', async () => {
        console.log('Convert started')

        const pages = await pdf2img.convert(path.join(electron.app.getPath('userData'), 'uploads', 'pdfs', `${slides.at(-1).name}.pdf`))
        await fs.mkdir(path.join(electron.app.getPath('userData'), 'uploads', 'imgs', `${slides.at(-1).name}`))
        for (let i = 1; i <= pages.length; i++) {
            fs.writeFile(path.join(electron.app.getPath('userData'), 'uploads', 'imgs', slides.at(-1).name, `${i}.png`), pages[i - 1])
        }

        console.log('Convert finished')
        slides.at(-1).pageCount = pages.length
        sendRooms(userRoom, { command: 'UPDT_SLDS', slidesUpdate: true, slides })
        res.json({ success: true, message: 'File uploaded', slide: slides.at(-1) })
    })
})

app.delete('/slide', async (req, res) => {
    fs.rmSync(path.join(electron.app.getPath('userData'), 'uploads', 'imgs', req.body.name), { recursive: true, force: true })
    await fs.remove(path.join(electron.app.getPath('userData'), 'uploads', 'pdfs', `${req.body.name}.pdf`))
    getSlides()
    sendRooms(userRoom, { command: 'UPDT_SLDS', slidesUpdate: true, slides })
    res.json({ success: true, message: 'File deleted' })
})



// MARK: Server

const PORT = isDev ? '50000' : '3000'
exports.start = () => new Promise(async (resolve, reject) => { server.listen(PORT, '0.0.0.0', () => { init(); resolve() }) })