const express = require('express');
const logger = require('morgan');
const cors = require('cors');
require('dotenv').config();
require('./database/mongoDB');

const apiRouter = require('./routes');

const app = express();

app.use(logger('dev'));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

/* Ping */
app.get('/ping', (req, res) => {
    return res.status(200).send({success: true, data: {message: `Server Running Successfully`}});
});

app.use('/api', apiRouter);

app.all('*', ((req, res) => {
    res.status(404);
    res.send({error: "api not available"})
}));

module.exports = app;
