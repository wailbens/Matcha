const { response } = require("express");
const pool = require("../_helpers/db");
const connection = require("../_helpers/db")
const {validationResult} = require('express-validator');

queryPromise1 = () => {
    return new Promise((resolve, reject) => {
        pool.query('SELECT email, username, password FROM `users`', (error, results) => {
            if (error) {
                return reject(error);
            }
            return resolve(results);
        })
    });
}

queryPromise2 = (username, email, password) => {
    console.log(username, email, password);
    return new Promise((resolve, reject) => {
        pool.query(`INSERT INTO users (username, email, password) VALUES ("${username}", "${email}", "${password}")`, (error, results) => {
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
            const results = await queryPromise1();
            return res.status(200).send({
                status: 'success',
                data: results
            });
        } catch (error) {
            return res.status(400).send({
                status: 'error',
                error: error.message
            });
        }
    },
    register: async function(req, res, next) {
        const errors = validationResult(req);
        console.log(errors);
        if (!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.array() });
        }
        try {
            // console.log(req.body.username)
            const results = await queryPromise2(req.body.username, req.body.email, req.body.password);
            return res.status(201).json({
                status: 'created',
            });
        } catch (error) {
            return res.status(400).send({
                status: 'error',
                error: error.message
            });
        }
    }
};

