const path = require('path')
const express = require('express')
const http = require('http')
const bcrypt = require('bcrypt')

const PORT = process.env.PORT || 3000

const app = express()
app.use(express.json())

users = []

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname + '/../client/login.html'))
})

app.get('/users', (req, res) => {
    res.json(users)
})

app.post('/users', async (req, res) => {
    try {
        const hashedP = await bcrypt.hash(req.body.password, 10)
        const user = {
            email: req.body.email,
            username: req.body.username,
            first_name: req.body.first_name,
            last_name: req.body.last_name,
            password: hashedP
        }
        users.push(user)
        res.status(201).send()
    } catch {
        res.status(500).send()
    }
})

app.post('/users/login', async (req, res) => {
    const user = await users.find(user => user.username == req.body.username)
    
    if (!user) return res.status(400).send('Invalid')
    try {
        if (await bcrypt.compare(req.body.password, user.password)) res.status(200).send('Authenticated')
        else return res.send('Nope.')
    } catch {
        return res.status(500).send('Something went wrong.')
    }
})

app.listen(PORT, () => {
    console.log(`server on ${PORT}`)
})