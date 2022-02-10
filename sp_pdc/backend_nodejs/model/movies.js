const db = require('./dbConfig');

var moviesDB = {

    getAllMovies: (callback) => {
        var conn = db.getConnection();
        var sql = 'select m.*, g.name as genre_name, g.description as genre_description from movies m, genres g where m.genre_id = g.genre_id';
        conn.query(sql, (err, result) => {
            conn.end();
            if (err) { callback(err, null); }
            else { callback(null, result); }
        })
    },

    getOneMovie: (movieNameOrID, callback) => {
        var conn = db.getConnection();
        var sql = 'select * from movies where movie_id = ? or name = ?';
        conn.query(sql, [movieNameOrID, movieNameOrID], (err, result) => {
            conn.end();
            if (err) { callback(err, null); }
            else { callback(null, result); }
        })
    },

    getMoviesByGenre: (genre, callback) => {
        var conn = db.getConnection();
        var sql = 'select m.*, g.name as genre_name, g.description as genre_description from movies m, genres g where m.genre_id = g.genre_id and g.genre_id = (select genre_id from genres where genre_id = ? or name = ?)';
        conn.query(sql, [genre, genre], (err, result) => {
            conn.end();
            if (err) { callback(err, null); }
            else { callback(null, result); }
        })
    },

    getMoviesBySubstr: (substr, callback) => {
        var conn = db.getConnection();
        var sql = `select m.*, g.name as genre_name, g.description as genre_description from movies m, genres g where m.genre_id = g.genre_id and m.name like '%${substr}%' order by release_date asc`;
        conn.query(sql, [substr], (err, result) => {
            conn.end();
            if (err) { callback(err, null); }
            else { callback(null, result); }
        })
    },

    getMoviesByGenreANDSubstr: (substr, genre, callback) => {
        var conn = db.getConnection();
        var sql = `select m.*, g.name as genre_name, g.description as genre_description from movies m, genres g where m.genre_id = g.genre_id and m.name like '%${substr}%' and g.genre_id = (select genre_id from genres where genre_id = ? or name = ?) order by release_date asc`;
        conn.query(sql, [genre, genre], (err, result) => {
            conn.end();
            if (err) { callback(err, null); }
            else { callback(null, result); }
        })
    },
    
    addMovie: (name, description, release_date, image_url, genre_id, callback) => {
        var conn = db.getConnection();
        var sql = `insert into movies (name, description, release_date, image_url, genre_id) values (?, ?, ?, ?, ?)`;
        conn.query(sql, [name, description, release_date, image_url, genre_id], (err, result) => {
            conn.end();
            if (err) { callback(err, null); }
            else { callback(null, result); }
        })
    },

    updateMovie: (name, description, release_date, image_url, genre_id, movie_id, callback) => {
        var conn = db.getConnection();
        var sql = `UPDATE movies SET name = ?, description = ?, release_date = ?, image_url = ?, genre_id = ? WHERE (movie_id = ?)`;
        conn.query(sql, [name, description, release_date, image_url, genre_id, movie_id], (err, result) => {
            conn.end();
            if (err) { callback(err, null); }
            else { callback(null, result); }
        })
    }
};

module.exports = moviesDB;