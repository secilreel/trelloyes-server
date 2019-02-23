'use strict';

require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const cors = require('cors');
const { NODE_ENV } = require('./config');
const logger = require('../logger');

const app = express();

const morganOption = (NODE_ENV === 'production')
  ? 'tiny'
  : 'common';

app.use(morgan(morganOption, {
  skip: () => process.env.NODE_ENV === 'test'
}));
app.use(helmet());
app.use(cors());

app.use(express.json());

app.use((res, req, next) => {
  const authToken = req.get('Authorization');
  const apiToken = process.env.API_TOKEN;
  if(!authToken || authToken.split(' ')[1] !== apiToken){
    logger.error(`Unathorized request to path: ${req.path}`);
    return res.status(401).send('Unauthorized request');
  }
  next();
});

app.get('/', (req, res) => {
  res.send('Hello, boilerplate!');
});

app.use(function ErrorHandler(error, req, res, next) {
  let response;
  if(NODE_ENV === 'production'){
    response = { error: { message: 'server error' } };
  }
  else {
    console.error(error);
    response = { message: error.message, error };
  }
  res.status(500).json(response);
});

module.exports = app;
