const express = require('express');
const mainRouter = express.Router();
const {getTracks} = require('./mainController');

mainRouter.get('/:cityName', getTracks);



module.exports = mainRouter;
