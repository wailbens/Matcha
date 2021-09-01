const router = require('express').Router();
const {body} = require('express-validator');
const {getUsers, register} = require('./users/user.controller.js');

const app = module.exports = require('express').Router()

users = []

// router.get('/', (req, res) => {
//     res.sendFile(path.join(__dirname + '/../client/login.html'))
// })

router.get('/users', getUsers);
router.post('/users', register);

function getUserScheme(req) {
    var username, email, password
    
    username = req.body.username
    email = req.body.email
    password = req.body.password

    return {
        username: username,
        email: email,
        password: password
    }
}

function validateInputs(userScheme) {
    if (!userScheme.email || !userScheme.password || !userScheme.username)
        return false
    return true
}


// app.post('/users', async (req, res) => {
//     const userScheme = getUserScheme(req)
//     var user

//     if (!validateInputs(userScheme))
//         return res.status(400).send('Email, username and password cannot be empty')
//     user = await users.find(user => user.email == userScheme.email || user.username == userScheme.username)
//     if (user) {
//         if (user.email === userScheme.email)
//             // console.log(user)
//             return res.status(400).send('Email already exists')
//         else if (user.username === userScheme.username)
//             return res.status(400).send('Username already exists')
//     }
//     try {
//         const hashedP = await bcrypt.hash(req.body.password, 10)
//         const user = {
//             email: req.body.email,
//             username: req.body.username,
//             first_name: req.body.first_name,
//             last_name: req.body.last_name,
//             password: hashedP
//         }
//         users.push(user)
//         res.status(201).send({
//             id_token: "createToken()",
//             access_token: "createAccessToken()"
//         })
//     } catch {
//         res.status(500).send()
//     }
// })

app.post('/users/login', async (req, res) => {
    const userScheme = getUserScheme(req)
    var user

    console.log(userScheme)

    if (!userScheme.username || !userScheme.password)
        return res.status(400).send('Username and password cannot be empty')
    user = await users.find(user => user.username == req.body.username)
    if (!user) return res.status(400).send('Wrong username')
    try {
        if (await bcrypt.compare(req.body.password, user.password)) res.status(200).send({
            id_token: "createToken()",
            access_token: "createAccessToken()"
        })
        else return res.status(401).send('Username and pasword do not match.')
    } catch {
        return res.status(500).send('Something went wrong.')
    }
})

module.exports = router;
