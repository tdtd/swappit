/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/trades              ->  index
 * POST    /api/trades              ->  create
 * GET     /api/trades/:id          ->  show
 * PUT     /api/trades/:id          ->  upsert
 * PATCH   /api/trades/:id          ->  patch
 * DELETE  /api/trades/:id          ->  destroy
 */

'use strict';

import jsonpatch from 'fast-json-patch';
let bookController = require('../book/book.controller');
import Trade from './trade.model';
import _ from 'lodash';

function respondWithResult(res, statusCode) {
  statusCode = statusCode || 200;
  return function(entity) {
    if(entity) {
      return res.status(statusCode).json(entity);
    }
    return null;
  };
}

function patchUpdates(patches) {
  return function(entity) {
    try {
      jsonpatch.apply(entity, patches, /*validate*/ true);
    } catch(err) {
      return Promise.reject(err);
    }

    return entity.save();
  };
}

function removeEntity(res) {
  return function(entity) {
    if(entity) {
      return entity.remove()
        .then(() => {
          res.status(204).end();
        });
    }
  };
}

function handleEntityNotFound(res) {
  return function(entity) {
    if(!entity) {
      res.status(404).end();
      return null;
    }
    return entity;
  };
}

function handleError(res, statusCode) {
  statusCode = statusCode || 500;
  return function(err) {
    res.status(statusCode).send(err);
  };
}

// Gets a list of Trades
export function index(req, res) {
  return Trade.find().exec()
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Gets a single Trade from the DB
export function show(req, res) {
  return Trade.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

//Create a trade
export function createTrade(req, res) {
  let trade = _.merge({ sender: req.user._id }, req.body);
  Trade.create(trade)
    .then(respondWithResult(res, 201))
    .catch(handleError(res));
};

//Get a users active trades
export function myTrades(req, res) {
	let owner = req.user._id;
	Trade.loadOwner(owner, function(err, trades){
		if (err){ return handleError(res, err); };
		if(!trades) { return res.status(404).send('Not Found'); }
		
    return res.status(200).json(trades);
	});
};

export function acceptTrade(req, res) {
  return Trade.find({_id: req.params.id, receiver: req.user._id}, (err, doc) => {
    if (err) return handleError(res);
    if (doc.length < 1) return handleEntityNotFound(res);
    return bookController.updateOwner(req.body.book._id, req.body.sender)
      .then(()=>{
       return Trade.findById(req.params.id).exec()
         .then(handleEntityNotFound(res))
         .then(removeEntity(res))
         .then(respondWithResult(res))
         .catch(handleError(res));
     })
  })
}

export function rejectTrade(req, res) {
  console.log('rejecting')
  return Trade.find({_id: req.params.id, receiver: req.user._id}, (err, doc) => {
    if (err) return handleError(res);
    if (doc.length < 1) return handleEntityNotFound(res);
    return Trade.findById(req.params.id).exec()
      .then(handleEntityNotFound(res))
      .then(removeEntity(res))
      .then(respondWithResult(res))
      .catch(handleError(res));
  })
}

export function removeTrade(req, res) {
  console.log('rejecting')
  return Trade.find({_id: req.params.id, sender: req.user._id}, (err, doc) => {
    if (err) return handleError(res);
    if (doc.length < 1) return handleEntityNotFound(res);
    return Trade.findById(req.params.id).exec()
      .then(handleEntityNotFound(res))
      .then(removeEntity(res))
      .then(respondWithResult(res))
      .catch(handleError(res));
  })
}

// Deletes a Trade from the DB
export function destroy(req, res) {
  return Trade.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(removeEntity(res))
    .catch(handleError(res));
}
