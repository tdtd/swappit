'use strict';
const angular = require('angular');

const uiRouter = require('angular-ui-router');

import routes from './me.routes';

export class MeComponent {
  /*@ngInject*/
  constructor($http, $timeout) {
    this.$http = $http;
    this.timeout = $timeout;
    this.searching = false;
    this.activeSearch = false;
    this.searchTitle = '';
    this.searchedBooks = [];
    this.libraryBooks = [];
    this.alerts = [];
    this.pag = 0
    this.limit = 10;
    this.state = '';
  }
  
  $onInit(){
    this.myBooks();
  }
  
  togglePanel(id){
    let panels = ['searching-panel', 'library-panel'];
    panels.forEach((panel) => {
      this.retractPanel(panel);
    })
    this.expandPanel(id);
  }
  
  expandPanel(id){
    var expandPanel = document.getElementById(id);
    if (expandPanel.clientHeight) {
      expandPanel.style.height = 0;
    } else {
      expandPanel.style.height = expandPanel.scrollHeight + "px";
    }
  }
  
  retractPanel(id){
    let rp = document.getElementById(id);
    rp.style.height = 0;
  }
  
  /**
   *  Return if param is equal to this.state
   *  check {string} - string that contains the name of the state to be checked
   */
  checkState(check){
    return check === this.state;
  }
  
  /**
   *  Check if param is valid state, then set this.state to param.
   *  toSet {string} - The state to set
   */
  setState(toSet){
    let self = this;
    let availStates = ['searching', 'library'];
    if (this.state === toSet || availStates.indexOf(toSet) < 0){
      return;
    }
    this.state = toSet;
    availStates.forEach((state) => {
      if (state !== toSet) ;
    })
    this.togglePanel(toSet+'-panel');
  }
  
  /**
   *  Returns if this.pag is at 0 or less
   */
  canLess(){
    return (this.pag <= 0);
  }
  
  /**
   *  Returns if less than 10 books in the this.searchedBooks array
   */
  canMore(){
    return (this.searchedBooks.length < this.limit);
  }
  
  /**
   *  Change this.pag and gets a new set of books based on the offset
   *  delt {number} - negative or postive number to change the page by
   */
  changePage(delt){
    this.pag += delt;
    this.getBook(this.searchTitle);
  }
  
  /**
   *  Takes a number between 0 and 5, returns an array of strings to describe stars, either full, half or empty
   *  rate {number} - rating number between 0 and 5
   */
  rating(rate) {
    let arr = [];
    for (var i = 0; i < 5; i++){
      let r = rate - 1;
      if (i <= r){
        arr[i] = 'full';
      } else if (rate % 1 != 0 && (Math.round(rate) - 1)  == i) {
        arr[i] = 'half';
      } else {
        arr[i] = 'empty';
      }
    }
    return arr;
  }
  
  /**
   *  Returns if state parameter is equal to current state
   *  state {string} - string to check
   */
  
  isState(state){
    return (state == this.state);
  }
  
  /**
   *  Add an alert to this.alerts
   *  msg {string} - The message displayed by the alert.
   *  type {string} - the Bootstrap alert type class to show.
   */
  addAlert(msg, type){
    this.alerts.push({msg: msg, type: type});
  }
  
  /**
   *  remove an alert from this.alerts
   *  index {number} - the index of the alert to remove
   */
  removeAlert(index){
    this.alerts.splice(index, 1);
  }
  
  /**
   *  Called by input, if change in title search, reset this.pag to 0
   *  title {string} - title of the book to search 
   */
  searchBook(title){
    this.pag = 0;
    this.getBook(title);
  }
  
  /**
   *  Get any books with similar titles to the string using the api
   *  title {string} - title of the book to search
   */
  getBook(title) {
    this.activeSearch = true;
    let self = this;
    this.$http.get('/api/books/find?title='+title+'&pag='+this.pag)
      .then(res => {
        self.searchedBooks = res.data;
        this.activeSearch = false;
        this.timeout(()=>{
          self.setState('searching');
        }, 10);
      })
      .catch(err => {
        console.log(err)
      })
  }
  
  /**
   *  send an api request to add a new book entry with user and the owner
   *  book {object} - book object provided by getBook()
   */
  claimBook(book) {
    let self = this;
    this.$http.post('/api/books/claim', book)
      .then(res => {
        self.libraryBooks.push(book);
        self.addAlert('Added "'+res.data.title+'" to your library.', 'success');
        self.setState('library');
      })
      .catch(err => {
        console.log(err)
      })
  }
  
  /**
   *  Get any books that belong to the user
   *  title {string} - title of the book to search
   */
  myBooks() {
    let self = this;
    this.$http.get('/api/books/mybooks')
      .then(res => {
        self.libraryBooks = res.data;
       this.timeout(()=>{
          self.setState('library');
        }, 10);
      })
      .catch(err => {
        console.log(err)
      })
  }
  
  /**
   *  Remove a book from your library
   *  id {string} - the _id of the book that will be removed
   *  index {number} - the index of the book in the libraryBooks array;
   */
  removeBook(id, index) {
    let self = this;
    this.$http.delete('/api/books/'+id)
      .then(res => {
        self.libraryBooks.splice(index, 1);
      })
      .catch(err => {
        console.log(err)
      })
  }
  
}

export default angular.module('bookSwapApp.me', [uiRouter])
  .config(routes)
  .component('me', {
    template: require('./me.html'),
    controller: MeComponent,
    controllerAs: 'meCtrl'
  })
  .name;
