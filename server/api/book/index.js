'use strict';

var express = require('express');
var controller = require('./book.controller');
import * as auth from '../../auth/auth.service';



var router = express.Router();

router.get('/', auth.isAuthenticated(), controller.index);
router.get('/find', controller.findBook);
router.get('/frontpage', controller.frontPage);
router.get('/mybooks', auth.isAuthenticated(), controller.myBooks);
router.get('/otherbooks', auth.isAuthenticated(), controller.otherBooks);
router.get('/:id', controller.show);
router.post('/claim', auth.isAuthenticated(), controller.claimBook);
router.delete('/:id', auth.isAuthenticated(), controller.removeMyBook);
//router.delete('/:id', controller.destroy);

module.exports = router;
