'use strict';
const STORE = require('./STORE');
const logger = require('../logger');
const express = require('express');
const cardRouter = express.Router();
const cards = STORE.allCards;
const lists = STORE.lists;
const uuid = require('uuid/v4');

cardRouter
  .route('/card')
  .get((req, res) => {
    res.json(cards);
  })
  .post((req, res) => {
    const id = uuid();
    const {title, content} = req.body;

    if (!title){
      logger.error('Title is required');
      return res.status(400).send('Invalid data');
    }

    if(!content){
      logger.error('Content is required');
      return res.status(400).send('Invalid data');
    }

    const card = {
      id,
      title,
      content
    };

    cards.push(card);
    logger.info(`Card with ${id} created`);
    res.status(201).location(`http://localhost:8000/card/${id}`).json(card);
  });

cardRouter
  .route('/card/:id')
  .get((req,res) =>{
    const id = req.params.id;
    let card = cards.find(card => card.id == id);
    if(!card){
      logger.error(`Card with ${id} not found`);
      return res.status(404).send('Card not found');
    }
    res.json(card);
  })
  .delete((req,res) => {
    const id =req.params.id;
    let card = cards.find(card => card.id == id);
    if(!card){
      logger.error(`Card with ${id} not found`);
      return res.status(404).send('Card not found');
    }

    let index=cards.findIndex(card => card.id ==id);

    lists.forEach(list => {
      const cardIds = list.cardIds.filter(card => card.id == id);
      list.cardIds = cardIds;
    });

    cards.splice(index,1);

    logger.info(`Card with id ${id} deleted`);

    res.status(204).end();
  });

module.exports = cardRouter;