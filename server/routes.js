const router = require('express').Router();
const {check} = require('express-validator');
const {getUsers, register, login} = require('./users/user.controller.js');

const app = module.exports = require('express').Router()

users = []

// router.get('/', (req, res) => {
//     res.sendFile(path.join(__dirname + '/../client/login.html'))
// })

router.get(
    '/users',
    getUsers
);

const registerSchema = {
    email: {
        normalizeEmail: true,
        isEmail: true,
        errorMessage: "Invalid email"
    },
    password: {
        isStrongPassword: {
            minLength: 6,
            // minLowercase: 1,
            // minUppercase: 1,
            // minNumbers: 1
        },
        errorMessage: "Password must be greater than 6 and contain at least one uppercase letter, one lowercase letter, and one number",
    },
}
var loginValidate = [
    check('email', 'Email Must Be a valid Email Address').isEmail(),
];

var registerValidate = [
    check('first_name', 'First Name can\'t be empty').not().isEmpty(),
    check('last_name', 'Last Name can\'t be empty').not().isEmpty(),
    check('email', 'Email Must Be a valid Email Address').isEmail().normalizeEmail(),
    check('password').isLength({ min: 8 })
    .withMessage('Password Must Be at Least 8 Characters')
    .matches('[0-9]').withMessage('Password Must Contain a Number')
    .matches('[A-Z]').withMessage('Password Must Contain an Uppercase Letter')
];

router.post(
    '/users',
    registerValidate,
    register
);

router.post(
    '/users/login',
    loginValidate,
    login
);

// app.post('/users/login', async (req, res) => {
//     const userScheme = getUserScheme(req)
//     var user

//     console.log(userScheme)

//     if (!userScheme.username || !userScheme.password)
//         return res.status(400).send('Username and password cannot be empty')
//     user = await users.find(user => user.username == req.body.username)
//     if (!user) return res.status(400).send('Wrong username')
//     try {
//         if (await bcrypt.compare(req.body.password, user.password)) res.status(200).send({
//             id_token: "createToken()",
//             access_token: "createAccessToken()"
//         })
//         else return res.status(401).send('Username and pasword do not match.')
//     } catch {
//         return res.status(500).send('Something went wrong.')
//     }
// })

module.exports = router;
