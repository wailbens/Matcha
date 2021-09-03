const router = require('express').Router();
const {check} = require('express-validator');
const {getUsers, register, login} = require('../controllers/user.controller');

var loginValidate = [
    check('email', 'Email Must Be a valid Email Address').isEmail(),
];

var registerValidate = [
    check('first_name', 'First Name can\'t be empty').not().isEmpty(),
    check('last_name', 'Last Name can\'t be empty').not().isEmpty(),
    check('email', 'Email Must Be a valid Email Address').isEmail().normalizeEmail(),
    check('password').isLength({ min: 6 })
    .withMessage('Password Must Be at Least 6 Characters')
    .matches('[0-9]').withMessage('Password Must Contain a Number')
    .matches('[A-Z]').withMessage('Password Must Contain an Uppercase Letter')
];

router.get(
    '/users',
    getUsers
);

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

module.exports = router;
