/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/books              ->  index
 * POST    /api/books              ->  create
 * GET     /api/books/:id          ->  show
 * PUT     /api/books/:id          ->  upsert
 * PATCH   /api/books/:id          ->  patch
 * DELETE  /api/books/:id          ->  destroy
 */

'use strict';

import jsonpatch from 'fast-json-patch';
import Book from './book.model';
import _ from 'lodash';
let Promise = require('bluebird');
let gbs = require('google-books-search-promise')('AIzaSyBYSzDpc3bahE5LX911-_v5-oN40JeKThU');

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

// Gets a list of Books
export function index(req, res) {
  return Book.find().exec()
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Gets a list of Books
export function findBook(req, res) {
  let options = {
    offset: 0,
    limit: 10
  };
  if('query' in req && 'pag' in req.query) options.offset = parseInt(req.query.pag)*options.limit;
  if(!("query" in req) || !req.query.title) return res.status(400).send(new Error("Search Text Required"))
  gbs.searchByTitle(req.query.title, options)
    .then(info => {
      return res.status(200).json(info);
    })
    .catch(err => {
      handleError(err)
  })
}

//Claims ownership of a book
export function claimBook(req, res){
  let book = _.merge({ owner: req.user._id }, req.body);
  console.log(book)
  return Book.create(book)
    .then(respondWithResult(res, 201))
    .catch(handleError(res));
}

//Get user's libraries
export function myBooks(req, res) {
	let owner = req.user._id;
	return Book.loadOwner(owner, (err, books) => {
		if (err){ return handleError(res, err); };
		if(!books) { return res.status(404).send('Not Found'); }
		
    return res.status(200).json(books);
	});
};

//Get all other user's library
export function otherBooks(req, res) {
	let owner = req.user._id, pag, limit;
  if (("query" in req)){
    pag = req.query.pag || 0;
    limit = req.query.limit || 25;
  }
	Book.loadOthers({owner: owner, pag: pag, limit: limit}, (err, books) => {
		if (err){ return handleError(res, err); };
		if(!books) { return res.status(404).send('Not Found'); }
		return res.status(200).json(books);
	});
};

//Get Books for FrontPage Use
export function frontPage (req, res) {
	Book.loadFP(function(err, books){
		if (err){ return handleError(res, err); };
		if(!books) { return res.status(404).send('Not Found'); }	
    return res.status(200).json(books);
	});
};

// Gets a single Book from the DB
export function show(req, res) {
  return Book.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Creates a new Book in the DB
export function create(req, res) {
  return Book.create(req.body)
    .then(respondWithResult(res, 201))
    .catch(handleError(res));
}

// Upserts the given Book in the DB at the specified ID
export function upsert(req, res) {
  if(req.body._id) {
    delete req.body._id;
  }
  return Book.findOneAndUpdate({_id: req.params.id}, req.body, {upsert: true, setDefaultsOnInsert: true, runValidators: true}).exec()

    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Updates an existing Book in the DB
export function patch(req, res) {
  if(req.body._id) {
    delete req.body._id;
  }
  return Book.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(patchUpdates(req.body))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Updates an existing Book in the DB
export function updateOwner(id, newOwner) {
  return Book.findById(id).exec()
    .then((doc)=>{
      doc.owner = newOwner;
      doc.markModified('owner');
      console.log(doc)
      doc.save();
    })
    .catch((err)=>{
      console.log(err)
    })
}

// Deletes a Book from the DB that you own
export function removeMyBook(req, res) {
  return Book.find({_id: req.params.id, owner: req.user._id}, (err, doc) => {
    console.log(doc);
    
    if (err) return handleError(res);
    if (doc.length < 1) return handleEntityNotFound(res);
    return Book.findById(req.params.id).exec()
      .then(handleEntityNotFound(res))
      .then(removeEntity(res))
      .catch(handleError(res));
  })
}

// Deletes a Book from the DB
export function destroy(req, res) {
  return Book.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(removeEntity(res))
    .catch(handleError(res));
}
