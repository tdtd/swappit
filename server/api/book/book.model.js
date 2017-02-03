'use strict';

import mongoose from 'mongoose';
let Schema = mongoose.Schema;

var BookSchema = new mongoose.Schema({
  title: String,
  authors: Array,
  industryIdentifiers: Array,
  thumbnail: String,
  publishedDate: Date,
  categories: Array,
  rating: Number,
  infoLink: String,
  owner: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  }
});

BookSchema.statics = {
  loadOwner: function(param, cb) {
    this.find({})
			.where('owner').equals(param)
			.populate({path:'owner', select: 'name'})
			.exec(cb);	
  },
	loadOthers: function(params, cb) {
    this.find({})
			.where('owner').ne(params.owner)
      .skip(params.limit*params.pag)
      .limit(params.limit)
			.populate({path:'owner', select: 'name'})
			.exec(cb);	
  },
	loadFP: function(cb) {
    this.find({})
			.sort('-date')
      .select('title thumbnail')
      .limit(5)
			.exec(cb);	
  }
};


export default mongoose.model('Book', BookSchema);
