let mysql = require('mysql2');
const config = require('../config.json');
const { host, port, user, password, database } = config.database;

let connection = mysql.createConnection({
    host: host,
    user: user,
    password: password,
    database: database
});

connection.connect(function(err) {
    if (err)
        return console.error('error:', err.message);
    console.log(`Connected to MYSQL Server at ${host}:${port}`);
    // var sql = "CREATE TABLE users (\
    //     id int(11) NOT NULL AUTO_INCREMENT,\
    //     username varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,\
    //     email varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,\
    //     password varchar(200) COLLATE utf8mb4_unicode_ci NOT NULL,\
    //     PRIMARY KEY (id),\
    //     UNIQUE KEY email (email)\
    //    ) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;";
    // connection.query(sql, function (err, result) {
//     if (err) throw err;
//     console.log("Table created");
//   });
})

module.exports = connection;
