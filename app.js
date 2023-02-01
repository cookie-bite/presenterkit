const express = require('express')
const cors = require('cors')
const path = require('path')
const app = express()


app.use(cors())
app.use(express.json())

app.use(express.static(path.join(__dirname + '/client/build')))
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname + '/client/build'))
})

app.get('/api', (req, res) => {
    res.json({ message: 'From api with love' })
})

app.listen(3000, () => { console.log('Server Started') })