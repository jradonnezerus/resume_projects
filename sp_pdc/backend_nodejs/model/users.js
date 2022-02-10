const db = require('./dbConfig');
const bcrypt = require('bcrypt');

var usersDB = {
    // for those without encrypted passwords (legacy accounts)
    login: (email, password, callback) => {
        var conn = db.getConnection();
        var sql = 'select * from users where email = ? and password = ?';

        conn.query(sql, [email, password], (err, result) => {
            conn.end();
            if (err) { return callback(err, null); }
            else { return callback(null, result); }
        })
    },
    // for those w encrypted passwords
    loginEncrypt: (email, password, callback) => {
        var conn = db.getConnection();
        var sql = 'select * from users where email = ?';
    
        conn.query(sql, [email], (err, result) => {
            conn.end();
            if (err) { return callback(err, null); }
            else { 
                if (bcrypt.compareSync(password, result[0].password)) {
                    return callback(null, result); 
                } else {
                    return callback(err, null); 
                }
            }
        })
    },
    newUser: (email, name, password, role, callback) => {
        var conn = db.getConnection();
        var sql = 'INSERT INTO `movies_sp_bdd`.`users` (`email`, `name`, `password`, `role`) VALUES (?, ?, ?, ?)';
        password = bcrypt.hashSync(password, 5);
        console.log(password);
        conn.query(sql, [email, name, password, role], (err, result) => {
            conn.end();
            if (err) { return callback(err, null); }
            else { return callback(null, result); }
        })
    },

};

module.exports = usersDB;