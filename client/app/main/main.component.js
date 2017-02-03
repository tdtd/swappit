'use strict';
const angular = require('angular');

const uiRouter = require('angular-ui-router');

import routes from './main.routes';

export class MainComponent {
  /*@ngInject*/
  constructor($http) {
    this.$http = $http;
    this.books = [];
  }
  
  $onInit(){
    this.getCarousel();
  }
  
  getCarousel(){
    this.$http.get('/api/books/frontpage')
      .then((res)=> {
        this.books = res.data;
        console.log(this.books)
      })
    .catch((err) => {
    })
  }
}

export default angular.module('bookSwapApp.main', [uiRouter])
  .config(routes)
  .component('main', {
    template: require('./main.html'),
    controller: MainComponent,
    controllerAs: 'mCtrl'
  })
  .name;
