'use strict';
const angular = require('angular');

const uiRouter = require('angular-ui-router');

import routes from './browse.routes';

export class BrowseComponent {
  /*@ngInject*/
  constructor($http, $uibModal) {
    this.$http = $http;
    this.$uibModal = $uibModal;
    this.books = [];
    this.pag = 0;
    this.limit = 25;
  }
  
  $onInit(){
    this.otherBooks();
  }
  
  /**
   *  Get any books that belong to other users. 
   */
  otherBooks() {
    let self = this;
    this.$http.get('/api/books/otherbooks?pag='+this.pag+'&limit='+this.limit)
      .then(res => {
        self.books = res.data
      })
      .catch(err => {
        console.log(err)
      })
  }
  
  requestTrade(book) {
    let self = this;
    var modalInstance = this.$uibModal.open({
      animation: true,
      component: 'tradeModal',
      resolve: {
        book: function () {
          return book;
        }
      }
    });

    modalInstance.result.then((o)=>{
      self.$http.post('/api/trades/', o)
        .then(res => {
        })
        .catch(err => {
          console.log(err)
        })
    }, (e) => {
      console.log(e);
    });
  };
  
}

export default angular.module('bookSwapApp.browse', [uiRouter])
  .config(routes)
  .component('browse', {
    template: require('./browse.html'),
    controller: BrowseComponent,
    controllerAs: 'browseCtrl'
  })
  .name;
