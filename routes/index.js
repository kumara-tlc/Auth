const express = require('express');
const api = express.Router();

/* User API Router*/
const userRouter = require('./user');
api.use('/v1/user', userRouter);

/* Project API Router*/
const projectRouter = require('./project');
api.use('/v1/project', projectRouter);

/* Item API Router */
const itemRouter = require('./item');
api.use('/v1/item', itemRouter);

module.exports = api;
