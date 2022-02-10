const express = require('express');
const verifyToken = require('./verifyToken');

const genresDB = require('../model/genres');

var app = express();
app.use(express.json());

app.get('/genres', (req, res) => {
    genresDB.getAllGenres((err, result) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.status(200).send(result);
        }
    })
});

app.post('/genres', verifyToken, (req, res) => {
    if (req.login.role == 'admin') {
        var {name, description} = req.body;
        genresDB.addGenre(name, description, (err, result) => {
            if (err) {
                res.status(500).send(err);
            } else {
                res.status(201).send({message: "The '" + name + "' genre was added successfullly!"});
            }
        })
    } else {
        res.status(401).send({errMessage: "Unauthorised action. Only for admins."})
    }
})

app.delete('/genres/:genreName', verifyToken, (req, res) => {
    if (req.login.role == 'admin') {
        var genreName = req.params.genreName;
        genresDB.deleteGenre(genreName, (err, result) => {
            if (err) {
                res.status(500).send(err);
            } else {
                if (result.affectedRows == 0) {
                    res.status(400).send({errMessage: "Invalid genre name given. If there are spacings, use a '%20' instead."})
                } else {
                    res.status(200).send({message: "Genre deleted successfully."});
                }
            }
        })
    } else {
        res.status(401).send({errMessage: "Unauthorised action. Only for admins."})      
    }
})

module.exports = app;