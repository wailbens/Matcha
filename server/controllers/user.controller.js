const { response } = require("express");
const pool = require("../_helpers/db.config");
const connection = require("../_helpers/db.config")
const {validationResult} = require('express-validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { createToken } = require('../_middleware/auth');
// const middleware = require('../_middleware/auth')
const config = require("../_helpers/auth.config.js");
const sendEmail = require("../_helpers/send-email");
// const { v4: uuidv4 } = require("uuid");

// function createToken(userId) {
//     let expiredAt = new Date();
  
//     expiredAt.setSeconds(expiredAt.getSeconds() + config.jwtRefreshExpiration);
  
//     let _token = uuidv4();
  
//     let refreshToken = {
//       token: _token,
//       userId: userId,
//       expiryDate: expiredAt.getTime(),
//     };
  
//     return refreshToken.token;
// }

queryUsersPromise = () => {
    return new Promise((resolve, reject) => {
        pool.query('SELECT * FROM `users`', (error, results) => {
            if (error) {
                return reject(error);
            }
            return resolve(results);
        })
    });
}

queryInsertPromise = (first, last, email, password) => {
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

queryInsertProfilePromise = (userId, username, birthday, sexe, gender_interest, about) => {
    // console.log(username, email, password);
    return new Promise((resolve, reject) => {
        pool.query(`UPDATE users set username='${username}', birthday='${birthday}', sexe='${sexe}', gender_interest='${gender_interest}', about='${about}'  WHERE id = ${userId}`, (error, results) => {
            if (error) {
                // console.log(error);
                return reject(error);
            }
            return resolve(results);
        })
    });
}

queryGetInterestIdPromise = (userId, interest_name) => {
    // console.log(interest_name);
    return new Promise((resolve, reject) => {
        pool.query(`SELECT id FROM interests WHERE name='${interest_name}'`, (error, results) => {
            if (error) {
                return reject(error);
            }
            return resolve(results);
        })
    });
}

queryInsertInterestPromise = (user_id, interest_id) => {
    // console.log(username, email, password);
    return new Promise((resolve, reject) => {
        pool.query(`INSERT INTO user_interests (user_id, interest_id) VALUES ('${user_id}', '${interest_id}')`, (error, results) => {
            if (error) {
                return reject(error);
            }
            return resolve(results);
        })
    });
}

queryGetUserPromise = (userId) => {
    return new Promise((resolve, reject) => {
        pool.query(`SELECT * FROM users WHERE id='${userId}'`, (error, results) => {
            if (error) {
                return reject(error);
            }
            return resolve(results);
        })
    });
}

queryGetInterestPromise = (userId) => {
    return new Promise((resolve, reject) => {
        pool.query(
            `SELECT name from interests where id in (SELECT interest_id FROM user_interests WHERE user_id='${userId}')`,
            (error, results) => {
            if (error) {
                return reject(error);
            }
            return resolve(results);
        })
    });
}

queryGetUserByUsername = (username) => {
    return new Promise((resolve, reject) => {
        pool.query(`SELECT * FROM users WHERE username='${username}'`, (error, results) => {
            if (error) {
                return reject(error);
            }
            return resolve(results);
        })
    });
}

queryUpdateFieldPromise = (userId, value, field) => {
    return new Promise((resolve, reject) => {
        pool.query(`UPDATE users set ${field}='${value}' WHERE id = ${userId}`, (error, results) => {
            if (error) {
                console.log(error);
                return reject(error);
            }
            return resolve(results);
        })
    });
}

queryGetPotentialMatchesPromise = (userId) => {
    return new Promise((resolve, reject) => {
        pool.query(
            `SELECT DISTINCT user_id from user_interests where interest_id in (SELECT interest_id FROM user_interests WHERE user_id='${userId}')`,
            (error, results) => {
            if (error) {
                return reject(error);
            }
            return resolve(results);
        })
    });
}

queryGetByInterestsPromise = (name) => {
    return new Promise((resolve, reject) => {
        pool.query(
            `SELECT DISTINCT user_id from user_interests where interest_id in (SELECT id FROM interests WHERE name='${name}')`,
            (error, results) => {
            if (error) {
                return reject(error);
            }
            return resolve(results);
        })
    });
}

module.exports = {
    getProfileById: async function(req, res, next) {
        try {
            var userId = req.params.id;
            const user = await queryGetUserPromise(userId);
            const interests = await queryGetInterestPromise(userId);
            return res.status(200).json({
                success: true,
                interests: interests,
            });
        } catch (error) {
            return res.status(500).send({
                success: false,
                error: error.message
            });
        }
    },
    getByInterests: async function(req, res, next) {
        try {
            const token = req.headers["x-access-token"];
            const decoded = jwt.verify(token, config.secret);  
            var interestName = req.params.interest;
            const matches = await queryGetByInterestsPromise(interestName);
            var potentialMatches = [];
            for (var id of matches)
            {
                try {
                    var user = await queryGetUserPromise(id.user_id);
                    var interests = await queryGetInterestPromise(id.user_id);
                    var output = {
                        "user": user[0],
                        "interests": interests
                    }
                    potentialMatches.push(output);
                } catch (error) {
                    return res.status(500).send({
                        success: false,
                        error: error.message
                    });
                }
            }
            // const interests = await queryGetInterestPromise(userId);
            return res.status(201).json({
                success: true,
                potentialMatches: potentialMatches
            });
        } catch (error) {
            return res.status(500).send({
                success: false,
                error: error.message
            });
        }
    },
    getPotentialMatches: async function(req, res, next) {
        try {
            const token = req.headers["x-access-token"];
            const decoded = jwt.verify(token, config.secret);  
            var userId = decoded.id;
            const matches = await queryGetPotentialMatchesPromise(userId);
            var potentialMatches = [];
            for (var id of matches)
            {
                try {
                    var user = await queryGetUserPromise(id.user_id);
                    var interests = await queryGetInterestPromise(id.user_id);
                    var output = {
                        "user": user[0],
                        "interests": interests
                    }
                    potentialMatches.push(output);
                } catch (error) {
                    return res.status(500).send({
                        success: false,
                        error: error.message
                    });
                }
            }
            // const interests = await queryGetInterestPromise(userId);
            return res.status(201).json({
                success: true,
                potentialMatches: potentialMatches
            });
        } catch (error) {
            return res.status(500).send({
                success: false,
                error: error.message
            });
        }
    },
    updateProfile: async function(req, res, next) {
        try {
            const token = req.headers["x-access-token"];
            const decoded = jwt.verify(token, config.secret);  
            var userId = decoded.id;
            if (req.body.username)
            {
                let results = await queryUpdateFieldPromise(userId, req.body.username, "username");
            }
            if (req.body.about)
            {
                let results = await queryUpdateFieldPromise(userId, req.body.about, "about");
            }
            if (req.body.sexe)
            {
                let results = await queryUpdateFieldPromise(userId, req.body.sexe, "sexe");
            }
            if (req.body.first_name)
            {
                let results = await queryUpdateFieldPromise(userId, req.body.first_name, "first_name");
            }
            if (req.body.last_name)
            {
                let results = await queryUpdateFieldPromise(userId, req.body.last_name, "last_name");
            }
            // const results = await queryUpdateProfilePromise(userId, req.body.username, req.body.birthday, req.body.sexe, req.body.gender_interest, req.body.about);
            // for (var i = 0; i < req.body.interests.length; i++)
            // {
            //     const interest_id = await queryGetInterestIdPromise(userId, req.body.interests[i]);
            //     const user_interest = await queryInsertInterestPromise(userId, interest_id[i].id);
                
            // }
            return res.status(201).json({
                success: true,
                message: 'Profile info added',
            });
        } catch (error) {
            return res.status(500).send({
                success: false,
                error: error.message
            });
        }
    },
    usernameExists: async function(req, res, next) {
        const query_res = await queryGetUserByUsername(req.params.username);
        var exists = false;
        // console.log(query_res, req.params.username)
        if (query_res.length > 0)
            exists = true;
        return res.status(200).json({
            username: req.params.username,
            exists: exists
        });
    },
    getProfile: async function(req, res, next) {
        try {
            // console.log(req.body.username)
            const token = req.headers["x-access-token"];
            const decoded = jwt.verify(token, config.secret);  
            var userId = decoded.id;
            // console.log(userId, token);
            const user = await queryGetUserPromise(userId);
            // console.log(results);
            const interests = await queryGetInterestPromise(userId);
            // console.log("user_interest")
            return res.status(201).json({
                success: true,
                user: user[0],
                interests: interests
            });
        } catch (error) {
            return res.status(500).send({
                success: false,
                error: error.message
            });
        }
    },
    postProfile: async function(req, res, next) {
        try {
            // console.log(req.body.username)
            const token = req.headers["x-access-token"];
            const decoded = jwt.verify(token, config.secret);  
            var userId = decoded.id;
            // console.log(userId, token);
            const results = await queryInsertProfilePromise(userId, req.body.username, req.body.birthday, req.body.sexe, req.body.gender_interest, req.body.about);
            // console.log(results);
            for (var i = 0; i < req.body.interests.length; i++)
            {
                const interest_id = await queryGetInterestIdPromise(userId, req.body.interests[i]);
                const user_interest = await queryInsertInterestPromise(userId, interest_id[0].id);
            }
            return res.status(201).json({
                success: true,
                message: 'Profile info added',
            });
        } catch (error) {
            return res.status(500).send({
                success: false,
                error: error.message
            });
        }
    },
    verifyEmail: function(req, res, next) {
        
    },
    getUsers: async function(req, res, next) {
        try {
            const results = await queryUsersPromise();
            return res.status(200).send({
                success: true,
                users: results,
            });
        } catch (err) {
            return res.status(500).send({
                error: err.message
            });
        }
    },
    isLoggedIn: (req, res, next) => {
        try {
            const token = req.headers["x-access-token"];
            if (!token) {
                return res.status(403).send({
                    message: "No token provided!"
                });
            }
            const decoded = jwt.verify(
                token,
                config.secret
            );
            req.userData = decoded;
            next();
        } catch (err) {
            return res.status(401).send({
                msg: 'Your session is not valid!'
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
            const results = await queryInsertPromise(req.body.first_name, req.body.last_name, req.body.email, bcryptPass);
            // sendEmail(req.body.email);
            return res.status(201).json({
                success: true,
                message: 'Registration successful, check your email for verification',
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
                return res.status(404).json({
                    success: false,
                    message: 'User not found.',
                });
            }
            const hashedP = results[0].password;
            const bcryptPassMatch = await bcrypt.compare(req.body.password, hashedP);
            if(!bcryptPassMatch){
                return res.status(401).send({
                    accessToken: null,
                    message: "Invalid Password!"
                });
            }
            const accessToken = jwt.sign(
                {
                    id:results[0].id},
                    config.secret,{
                        expiresIn: config.jwtExpiration
                }
            );
            refreshToken = createToken(results[0].id);
            return res.status(200).json({
                message: 'Login successful',
                id: results[0].id,
                email: results[0].email,
                accessToken: accessToken,
                refreshToken: refreshToken,
            });
        } catch (error) {
            return res.status(500).send({
                error: error.message
            });
        }
    }
};

