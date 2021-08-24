const   path = require('path')
        express = require('express'),
        cors = require('cors'),
        http = require('http'),
        bcrypt = require('bcrypt')


const app = express()

app.use(express.json())
// app.use(cors())

app.use(require('./routes.js'))

const PORT = process.env.PORT || 3000

http.createServer(app).listen(PORT, (err) => {
    console.log(`listening on http://127.0.0.1:${PORT}`)
})

// app.listen(PORT, () => {
//     console.log(`server on ${PORT}`)
// })