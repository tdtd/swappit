'use strict';
const angular = require('angular');

function Trade(book, message){
  this.message = message;
  this.receiver = book.owner._id;
  this.book = book._id;
  this.thumbnail = book.thumbnail;
}

export class tradeModalComponent {
  /*@ngInject*/
  constructor() {
    this.book = this.resolve.book;
    this.message = '';
    this.resolve.info = 'test it';
  }
  
  $onInit(){
    
  }
  
  ok() {
    this.close({$value: new Trade(this.book, this.message)});
  };

  cancel() {
    this.dismiss({$value: 'cancel'});
  };
}

export default angular.module('bookSwapApp.tradeModal', [])
  .component('tradeModal', {
    template: require('./tradeModal.html'),
    bindings: { 
      resolve: '<',
      close: '&',
      dismiss: '&'
    },
    controller: tradeModalComponent,
    controllerAs: "tradeModal"
  })
  .name;
