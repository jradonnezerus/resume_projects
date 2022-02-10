const express = require('express');
const cors = require('cors')
const jwt = require('jsonwebtoken');
const secretKey = require('./secretKey');

const genresRoutes = require('./genresRoutes');
const moviesRoutes = require('./moviesRoutes');
const reviewsRoutes = require('./reviewsRoutes');
const usersRoutes = require('./usersRoutes');

var app = express();
app.use(cors({origin: '*'}));
app.use(express.json());

app.use(usersRoutes);
app.use(genresRoutes);
app.use(moviesRoutes);
app.use(reviewsRoutes);

module.exports = app;