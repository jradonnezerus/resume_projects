const db = require('./dbConfig');

var genresDB = {
    getAllGenres: (callback) => {
        var conn = db.getConnection();
        var sql = 'select * from genres';
        conn.query(sql, (err, result) => {
            conn.end();
            if (err) { callback(err, null); }
            else { callback(null, result); }
        })
    },

    addGenre: (name, description, callback) => {
        var conn = db.getConnection();
        var sql = 'INSERT INTO `genres` (`name`, `description`) VALUES (?, ?)';
        conn.query(sql, [name, description], (err, result) => {
            conn.end();
            if (err) { callback(err, null); }
            else { callback(null, result); }
        })
    },

    deleteGenre: (name, callback) => {
        var conn = db.getConnection();
        var sql = 'delete from genres where name = ?';
        conn.query(sql, [name], (err, result) => {
            conn.end();
            if (err) { callback(err, null); }
            else { callback(null, result); }
        })
    }
};

module.exports = genresDB;