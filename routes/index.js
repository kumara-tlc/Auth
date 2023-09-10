const express = require('express');
const api = express.Router();

/* User API Router*/
const userRouter = require('./user');
api.use('/v1/user', userRouter);

module.exports = api;
