const express = require('express');
const jwt = require('jsonwebtoken');
const verifyToken = require('./verifyToken');

const moviesDB = require('../model/movies');

var app = express();
app.use(express.json());

app.get('/movies', (req, res) => {
    var {genre, search} = req.query;

    if (genre && search) {
        moviesDB.getMoviesByGenreANDSubstr(search, genre, (err, result) => {
            if (err) {
                res.status(500).send(err);
            } else {
                if (result.length == 0) {
                    res.status(400).send({errMessage: "Unable to find movies under these filters."})
                } else {
                    res.status(200).send(result);
                }
            }
        })
    } else if (genre) {
        moviesDB.getMoviesByGenre(genre, (err, result) => {
            if (err) {
                res.status(500).send(err);
            } else {
                if (result.length == 0) {
                    res.status(400).send({errMessage: "Genre does not exist."})
                } else {
                    res.status(200).send(result);
                }
            }
        })
    } else if (search) {
        moviesDB.getMoviesBySubstr(search, (err, result) => {
            if (err) {
                res.status(500).send(err);
            } else {
                if (result.length == 0) {
                    res.status(400).send({errMessage: "No such movie found."})
                } else {
                    res.status(200).send(result);
                }
            }
        })
    } else { // if no query param
        moviesDB.getAllMovies((err, result) => {
            if (err) {
                res.status(500).send(err);
            } else {
                res.status(200).send(result);
            }
        })
    }
});

app.get('/movies/:movieNameOrID', (req, res) => {
    var movieNameOrID = req.params.movieNameOrID;
    moviesDB.getOneMovie(movieNameOrID, (err, result) => {
        if (err) {
            res.status(500).send(err);
        } else {
            if (result.length == 0) {
                res.status(400).send({errMessage: "Unable to find movie."})
            } else if (result.length > 1) {
                res.status(300).send({message: "Multiple possible movies. Please choose.", result})
            } else {
                res.status(200).send(result);
            }
        }
    })
})

app.post('/movies', verifyToken, (req, res) => {
    if (req.login.role == 'admin') {
        var {name, description, release_date, image_url, genre_id} = req.body;
        moviesDB.addMovie(name, description, release_date, image_url, genre_id, (err, result) => {
            if (err) {
                res.status(500).send(err);
            } else {
                res.status(200).send({message: "Movie added successfully!", movieName: name, insertId: result.insertId});
            }
        })
    } else {
        res.status(401).send({errMessage: "Unauthorised action. Only for admins."})
    }
})

app.put('/movies/:movieID', verifyToken, (req, res) => {
    if (req.login.role == 'admin') {
        var {name, description, release_date, image_url, genre_id} = req.body;
        var movieID = req.params.movieID;
        moviesDB.updateMovie(name, description, release_date, image_url, genre_id, movieID, (err, result) => {
            if (err) {
                res.status(500).send(err);
            } else {
                res.status(200).send({message: `The movie '${name}' was updated successfully!`, result});
            }
        })
    } else {
        res.status(401).send({errMessage: "Unauthorised action. Only for admins."})
    }
})

module.exports = app;