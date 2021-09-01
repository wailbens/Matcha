const { response } = require("express");
const connection = require("../_helpers/db")

module.exports = {
    getUsers: async function(req,res,next) {
        try {
            const rows = await connection.query("SELECT email, username FROM `users`",
                (err, result, fields) => {
                    if (result.length)
                        res.json({
                            users: result
                        });
                    res.json({
                        message:"No user found"
                    });
                }
            );  
        } catch (err) {
            next(err)
        }
    },
    register: async function(req, res, next) {
        try {
            const rows = await connection.query(`INSERT INTO users (username, email, password) VALUES (${req.username}, ${req.email}, ${req.password}))`,
                (err, result, fields) => {
                    return res.json({response: 'created'});
                }
            );
        } catch (err) {
            next(err)
        }
    }
};

