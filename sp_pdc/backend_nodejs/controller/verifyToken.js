const express = require('express');
const jwt = require('jsonwebtoken');
const secretKey = require('./secretKey');

var app = express();
app.use(express.json());

const verifyToken = (req, res, next) => {
    var token = req.header('Authorization');
    if (!token || !token.includes('Bearer ')) {
        res.status(401).send({errMessage: 'Authorization token not found. You must be logged in with sufficient privileges to perform this action.'});
    } else {
        token = token.split('Bearer ')[1]; 
        jwt.verify(token, secretKey, (err, decoded) => { 
            // console.log(decoded);
            if (err) {
                res.status(500).send(err);
            } else {
                req.login = decoded;
                next();
            }
        })
    }
}

module.exports = verifyToken;