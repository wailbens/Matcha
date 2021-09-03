const { response } = require("express");
const pool = require("../_helpers/db.config");
const connection = require("../_helpers/db.config")
const {validationResult} = require('express-validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const secret = require('../config.json').secret;

queryUsersPromise = () => {
    return new Promise((resolve, reject) => {
        pool.query('SELECT email, username, password FROM `users`', (error, results) => {
            if (error) {
                return reject(error);
            }
            return resolve(results);
        })
    });
}

queryInsertPromise = (first, last, username, email, password) => {
    // console.log(username, email, password);
    return new Promise((resolve, reject) => {
        pool.query(`INSERT INTO users (first_name, last_name, email, password) VALUES ('${first}', '${last}', '${email}', '${password}')`, (error, results) => {
            if (error) {
                return reject(error);
            }
            return resolve(results);
        })
    });
}

queryFindByEmailPromise = (email) => {
    return new Promise((resolve, reject) => {
        pool.query(`SELECT * FROM users WHERE email='${email}'`, (error, results) => {
            if (error) {
                return reject(error);
            }
            return resolve(results);
        })
    });
}

queryGetPasswordPromise = (email) => {
    return new Promise((resolve, reject) => {
        pool.query(`SELECT password FROM users WHERE email='${email}'`, (error, results) => {
            if (error) {
                return reject(error);
            }
            return resolve(results);
        })
    });
}

module.exports = {
    getUsers: async function(req,res,next) {
        try {
            const results = await queryUsersPromise();
            return res.status(200).send({
                success: true,
                data: results
            });
        } catch (error) {
            return res.status(500).send({
                success: false,
                error: error.message,
            });
        }
    },
    register: async function(req, res, next) {
        const errors = validationResult(req);
        // console.log(errors);
        if (!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.array() });
        }
        const results = await queryFindByEmailPromise(req.body.email);
            // console.log(results);
        if (results.length > 0) {
            return res.status(422).json({
                success: false,
                message: 'Email already in use',
            });
        }
        const bcryptPass = await bcrypt.hash(req.body.password, 10);
        try {
            // console.log(req.body.username)
            const results = await queryInsertPromise(req.body.first_name, req.body.last_name, req.body.username, req.body.email, bcryptPass);
            return res.status(201).json({
                success: true,
                message: 'Registration successful',
            });
        } catch (error) {
            return res.status(500).send({
                success: false,
                error: error.message
            });
        }
    },
    login: async function(req, res, next) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.array() });
        }
        try {
            const results = await queryFindByEmailPromise(req.body.email);
            // console.log(results);
            if (results.length == 0) {
                return res.status(422).json({
                    success: false,
                    message: 'Invalid Email',
                });
            }
            const hashedP = results[0].password;
            const bcryptPassMatch = await bcrypt.compare(req.body.password, hashedP);
            if(!bcryptPassMatch){
                return res.status(422).json({
                    success: false,
                    message: "Incorrect password",
                });
            }
            const tk = jwt.sign(
                {
                    id:results[0].id},
                    secret,
                    { expiresIn: 86400
                }
            );
            return res.status(200).json({
                success: true,
                message: 'Login successful',
                id: results[0].id,
                email: results[0].email,
                accessToken: tk
            });
        } catch (error) {
            return res.status(500).send({
                success: true,
                error: error.message
            });
        }
    }
};

