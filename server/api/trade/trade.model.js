'use strict';

import mongoose from 'mongoose';
let Schema = mongoose.Schema;
let shortid = require('shortid');

var TradeSchema = new mongoose.Schema({
  _id: {
    type: String,
    'default': shortid.generate
  },
  sender: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  receiver: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  date: {
    type: Date,
    default: Date.now
  },
  book : {
    type: Schema.Types.ObjectId,
    ref: 'Book'
  },
  thumbnail: {
    type: String
  },
  message: {
    type: String
  },
  active: {
    type: Boolean,
    default: true
  }
});

TradeSchema.statics = {
	loadOwner: function(param, cb) {
    this.find({})
			.or([{'sender': param}, {'receiver': param}])
			.populate({path:'sender', select: 'name'})
			.populate({path:'receiver', select: 'name'})
      .populate({path:'book', select: 'title authors thumbnail'})
			.exec(cb);	
  }
};

export default mongoose.model('Trade', TradeSchema);
