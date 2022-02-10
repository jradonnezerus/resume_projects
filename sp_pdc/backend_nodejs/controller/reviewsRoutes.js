const express = require('express');
const verifyToken = require('./verifyToken');

const reviewsDB = require('../model/reviews');

var app = express();
app.use(express.json());

app.get('/reviews/:movieNameOrID', (req, res) => {
    var movieNameOrID = req.params.movieNameOrID;
    reviewsDB.getReviewsOfAMovie(movieNameOrID, (err, result) => {
        if (err) {
            res.status(500).send(err);
        } else {
            if (result.length == 0) {
                res.status(400).send({errMessage: "No reviews exist for this movie yet."})
            } else {
                res.status(200).send(result);
            }
        }
    })
});

app.post('/reviews/:movieID', verifyToken, (req, res) => {
    if (req.login.role == 'admin' || req.login.role == 'user') {
        var movieID = req.params.movieID;
        var {user_id, review} = req.body;
        reviewsDB.createReview(movieID, user_id, review, (err, result) => {
            if (err) {
                res.status(500).send(err);
            } else {
                res.status(200).send({message: `Review (review_id: ${result.insertId}) added!`, result});
            }
        })
    } else {
        res.status(401).send({errMessage: "You must be logged in to post a review."})
    }
})

module.exports = app;