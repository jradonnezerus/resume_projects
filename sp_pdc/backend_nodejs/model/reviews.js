const db = require('./dbConfig');

var reviewsDB = {
    getReviewsOfAMovie: (movieNameOrID, callback) => {
        var conn = db.getConnection();
        var sql = 'select r.*, u.name from reviews r, users u where u.user_id = r.user_id and movie_id = (select movie_id from movies where movie_id = ? or name = ?)';
        conn.query(sql, [movieNameOrID, movieNameOrID], (err, result) => {
            conn.end();
            if (err) { callback(err, null); }
            else { callback(null, result); }
        })
    },

    createReview: (movie_id, user_id, review, callback) => {
        var conn = db.getConnection();
        var sql = `insert into reviews (movie_id, user_id, review) values (?, ?, ?);`;
        conn.query(sql, [movie_id, user_id, review], (err, result) => {
            conn.end();
            if (err) { callback(err, null); }
            else { callback(null, result); }
        })
    }
};

module.exports = reviewsDB;