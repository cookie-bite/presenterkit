const express = require('express')
const { WebSocket, WebSocketServer } = require('ws')
const cors = require('cors')
const path = require('path')

const app = express()
const wss = new WebSocketServer({ port: 3001 })

const CLIENTS = {}
var texts = []

app.use(cors())
app.use(express.json())


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

const hexToHsl = (hex) => {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
    var r = parseInt(result[1], 16)
    var g = parseInt(result[2], 16)
    var b = parseInt(result[3], 16)
    r /= 255, g /= 255, b /= 255
    var max = Math.max(r, g, b), min = Math.min(r, g, b)
    var h, s, l = (max + min) / 2
    if (max == min) {
        h = s = 0 // achromatic
    } else {
        var d = max - min
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
        switch (max) {
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }
        h /= 6
    }

    h = Math.round(h * 360)
    s = Math.round(s * 100)
    l = Math.round(l * 100)

    return { h, s, l }
}

const hslToHex = (h, s, l) => {
    l /= 100
    const a = s * Math.min(l, 1 - l) / 100
    const f = n => {
        const k = (n + h / 30) % 12
        const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1)
        return Math.round(255 * color).toString(16).padStart(2, '0')   // convert to Hex and prefix "0" if needed
    }
    return `#${f(0)}${f(8)}${f(4)}`
}

const genColor = () => {
    const color = `#${(Math.random() * 0xFFFFFF << 0).toString(16).padEnd(6, 'f')}`
    return hslToHex(hexToHsl(color).h, hexToHsl(color).s < 30 ? 100 - hexToHsl(color).s : hexToHsl(color).s, hexToHsl(color).l < 50 ? 100 - hexToHsl(color).l : hexToHsl(color).l)
}

const send = (obj) => {
    for (const client in CLIENTS) {
        if (CLIENTS[client].readyState === WebSocket.OPEN) {
            CLIENTS[client].send(JSON.stringify(obj))
        }
    }
}


wss.on('connection', (ws) => {
    const userId = require('crypto').randomBytes(4).toString('hex')
    CLIENTS[userId] = ws
    CLIENTS[userId].username = periodicTable[Math.floor(Math.random() * periodicTable.length)]
    periodicTable = periodicTable.filter(x => x !== CLIENTS[userId].username)

    console.log('Active users:', Object.keys(CLIENTS).length, '\nPeriodic table:', periodicTable.length)

    ws.on('message', (wsData) => {
        const data = JSON.parse(wsData)

        if (data.command === 'NEW_MSG') {
            console.log(`[${data.userName}-${data.userId}]: \x1b[33m${data.message}\x1b[0m`)

            const newText = {
                color: genColor(),
                sentence: data.message,
                username: data.userName,
                pos: {
                    web: [ Math.random() * (10 + texts.length / 5) * [-1, 1][Math.floor(Math.random() * 2)], (2 + Math.random() * (texts.length / 3)) * [-1, 1][Math.floor(Math.random() * 2)], Math.random() * 1.5 * [-1, 1][Math.floor(Math.random() * 2)] - 3.5 ],
                    mobile: [ Math.random() * (3 + texts.length / 5) * [-1, 1][Math.floor(Math.random() * 2)], (2 + Math.random() * (8 + texts.length / 2.5)) * [-1, 1][Math.floor(Math.random() * 2)], Math.random() * 2 * [-1, 1][Math.floor(Math.random() * 2)] - 4 ]
                }
            }

            texts.push(newText)

            send({ command: 'NEW_MSG', message: newText, user: { id: data.userId, name: data.userName } })
        } else if (data.command === 'ACT_TXT') {
            console.log(`Active text: \x1b[33m[${data.user ? data.user : 'Opening text'}] ${data.text}\x1b[0m`)

            send({ command: 'ACT_TXT', text: data.text, user: data.user })
        }
    })

    ws.on('close', () => {
        console.log(`[${CLIENTS[userId].username}-${userId}] disconnected ☠️`)
        periodicTable.push(CLIENTS[userId].username)
        delete CLIENTS[userId]
        console.log('Active users:', Object.keys(CLIENTS).length, '\nPeriodic table:', periodicTable.length)
    })

    ws.on('error', console.error)

    setTimeout(() => ws.send(JSON.stringify({ command: 'INIT_WS', texts, user: { id: userId, name: CLIENTS[userId].username } })), 1000)
})


app.use(express.static(path.join(__dirname + '/client/build')))
app.get('*', (req, res) => res.sendFile(path.join(__dirname + '/client/build')))

app.get('/api', (req, res) => res.json({ message: 'From api with love' }))

const PORT = 3000
app.listen(PORT, '0.0.0.0', () => { console.clear(); console.log(`\x1b[33mApp running on 🔥\n\n\x1b[36m  http://localhost:${PORT}  \x1b[0m\n`); wss.on('error', console.error) })