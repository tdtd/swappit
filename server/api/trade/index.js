'use strict';

var express = require('express');
var controller = require('./trade.controller');
import * as auth from '../../auth/auth.service';
var router = express.Router();

//router.get('/', auth.isAuthenticated(), controller.index);
//router.get('/:id', controller.show);
router.get('/myTrades', auth.isAuthenticated(), controller.myTrades)
router.put('/accept/:id', auth.isAuthenticated(), controller.acceptTrade)
router.put('/reject/:id', auth.isAuthenticated(), controller.rejectTrade)
router.put('/remove/:id', auth.isAuthenticated(), controller.removeTrade)
router.post('/', auth.isAuthenticated(), controller.createTrade);
//router.delete('/:id', controller.destroy);

module.exports = router;
