const router = require('express').Router();
const {check} = require('express-validator');
const { isLoggedIn } = require('../controllers/user.controller');
const controller = require('../controllers/user.controller');
const auth = require('../_middleware/auth');

var loginValidate = [
    check('email', 'Invalid Email').isEmail(),
];

var registerValidate = [
    check('first_name', 'All fields are required').not().isEmpty(),
    check('last_name', 'All fields are required').not().isEmpty(),
    check('email', 'Invalid Email').isEmail().normalizeEmail(),
    check('password').isLength({ min: 6 })
    .withMessage('Password Must Be at Least 6 Characters')
    .matches('[0-9]').withMessage('Password Must Contain a Number')
    .matches('[A-Z]').withMessage('Password Must Contain an Uppercase Letter')
];

router.post(
    '/profile',
    controller.isLoggedIn,
    controller.profile
)

router.get(
    '/users',
    controller.isLoggedIn,
    controller.getUsers
);

router.post(
    '/users',
    registerValidate,
    controller.register
);

router.post(
    '/users/login',
    loginValidate,
    controller.login
);

module.exports = router;
