const express = require('express');
const jwt = require('jsonwebtoken');
const verifyToken = require('./verifyToken');

const usersDB = require('../model/users');
const secretKey = require('./secretKey');

var app = express();
app.use(express.json());

app.post('/login', (req, res) => {
    var {email, password} = req.body;

    // use regex to check if email is a valid email format. can npm i validator for more options (not used in this proj).
    var pattern = new RegExp('^[a-zA-Z0-9_.-]{1,}@[a-zA-Z0-9_.-]{1,}$'); // email must be at least _@_
    if (pattern.test(email)) {
        usersDB.login(email, password, (err, result) => {
            if (err) { res.status(500).send(err); }
            else {
                if (result.length == 0) {
                    res.status(400).send({errMessage: "Wrong username / password."});
                } else {
                    var token = jwt.sign({role: result[0].role}, secretKey, {expiresIn: '1h'});
                    res.status(200).send({message: "Welcome back " + result[0].name + "!", name: result[0].name, role: result[0].role, token, user_id: result[0].user_id});
                }
            }
        })
    } else {
        res.status(500).send({errMessage: "Please check email format."});
    }
});

app.post('/loginEncrypt', (req, res) => {
    var {email, password} = req.body;

    var pattern = new RegExp('^[a-zA-Z0-9_.-]{1,}@[a-zA-Z0-9_.-]{1,}$');
    if (pattern.test(email)) {
        usersDB.loginEncrypt(email, password, (err, result) => {
            if (err) { res.status(500).send(err); }
            else {
                if (result.length == 0) {
                    res.status(400).send({errMessage: "Wrong username / password."});
                } else {
                    var token = jwt.sign({role: result[0].role}, secretKey, {expiresIn: '1h'});
                    res.status(200).send({message: "Welcome back " + result[0].name + "!", name: result[0].name, role: result[0].role, token, user_id: result[0].user_id});
                }
            }
        })
    } else {
        res.status(500).send({errMessage: "Please check email format."});
    }
});

app.post('/newUser', (req, res) => {
    var {email, name, password, role} = req.body;

    var pattern = new RegExp('^[a-zA-Z0-9_.-]{1,}@[a-zA-Z0-9_.-]{1,}$');
    if (pattern.test(email)) {
        usersDB.newUser(email, name, password, role, (err, result) => {
            if (err) { res.status(500).send(err); }
            else {
                if (result.length == 0) {
                    res.status(400).send({errMessage: "Wrong username / password."});
                } else {
                    res.status(200).send({message: "New user created successfully!"});
                }
            }
        })
    } else {
        res.status(500).send({errMessage: "Ensure email has a correct format :("});
    }
});

module.exports = app;