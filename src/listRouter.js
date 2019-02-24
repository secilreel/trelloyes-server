'use strict';

const STORE = require('./STORE');
const logger = require('../logger');
const express = require('express');
const listRouter = express.Router();
const lists = STORE.lists;
const uuid = require('uuid/v4');

listRouter
  .route('/list')
  .get((req, res) =>{
    res.json(lists);
  })
  .post((req,res) => {
    const id = uuid();
    const {header, cardIds=[]} = req.body;

    if (!header){
      logger.error('Header is required');
      return res.status(400).send('Invalid data');
    }

    if(cardIds.length <= 0){
      logger.error('Cards are required');
      return res.status(400).send('Invalid data');
    }

    const list = {
      id,
      header,
      cardIds
    };
    
    lists.push(list);

    logger.info(`List with id ${id} created`);
    
    res.status(201).location(`http://localhost:8000/list/${id}`).json(list);
  });

listRouter
  .route('/list/:id')
  .get((req, res) => {
    const id = req.params.id;
    let list = lists.find(list => list.id == id);
    if(!list){
      logger.error(`List with ${id} not found`);
      return res.status(404).send('List not found');
    }
    res.json(list);
  })
  .delete((req,res) =>{
    const id = req.params.id;
    let list = lists.find(list => list.id == id);
    if(!list){
      logger.error(`List with ${id} not found`);
      return res.status(404).send('List not found');
    }

    const index = lists.findIndex(list => list.id ==id);
    lists.splice(index,1);

    logger.info(`List with id ${id} deleted`);
    
    res.status(204).end();
  });

module.exports = listRouter;