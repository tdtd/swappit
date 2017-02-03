'use strict';
const angular = require('angular');

const uiRouter = require('angular-ui-router');

import routes from './trade.routes';

export class TradeComponent {
  /*@ngInject*/
  constructor($http, Auth, confirmModal) {
    this.$http = $http;
    this.confirmModal = confirmModal;
    this.sentTrades = [];
    this.receivedTrades = [];
    this.user = Auth.getCurrentUserSync;
  }
  
  $onInit(){
    this.getTrades();
  }
  
  toggleActive(index, arr){
    this.receivedTrades.forEach((item, i)=>{
      this.retractPanel('receivedTrades'+i);
    })
    if (typeof(index) != undefined && typeof(arr) != undefined){
      this.expandPanel('receivedTrades'+index)
    }
    
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
  
  hardRejectTrade(trade){
    let self = this;
    this.$http.put('/api/trades/reject/'+trade._id, trade)
      .then((res) => {
        this.receivedTrades.forEach((tr, i) => {
          if (tr._id == trade._id){
            this.receivedTrades.splice(i, 1);
          }
        })
        this.toggleActive();
      })
      .catch((err) => {
        console.log(err)
      })
  }
  
  hardRemoveTrade(trade){
    let self = this;
    this.$http.put('/api/trades/remove/'+trade._id, trade)
      .then((res) => {
        this.sentTrades.forEach((tr, i) => {
          if (tr._id == trade._id){
            this.sentTrades.splice(i, 1);
          }
        })
      })
      .catch((err) => {
        console.log(err)
      })
  }
  
  hardAcceptTrade(trade){
    let self = this;
    this.$http.put('/api/trades/accept/'+trade._id, trade)
      .then((res) => {
        this.receivedTrades.forEach((tr, i) => {
          if (tr._id == trade._id){
            this.receivedTrades.splice(i, 1);
          }
        })
        this.toggleActive();
      })
      .catch((err) => {
        console.log(err)
      })
    
  }
  
  getTrades(){
    let self = this;
    this.$http.get('/api/trades/myTrades')
      .then((res) => {
        this.parseTrades(res.data);
      })
      .catch((err) => {
      })
  }
  
  rejectTrade(trade) {
    let self = this;
    this.confirmModal.reject((e)=>{
      self.hardRejectTrade(trade);
    }, trade.sender.name)
  };
  
  acceptTrade(trade) {
    let self = this;
    this.confirmModal.accept((e) => {
      self.hardAcceptTrade(trade);
    }, trade.sender.name)
  }
  
  removeTrade(trade) {
    let self = this;
    this.confirmModal.remove((e)=>{
      self.hardRemoveTrade(trade);
    }, trade.sender.name)
  };
  
  parseTrades(arr){
    let id = this.user()._id;
    arr.forEach((item) => {
      item.active = false;
      if (item.sender._id == id){
        this.sentTrades.push(item);
      }
      
      if (item.receiver._id == id){
        this.receivedTrades.push(item);
      } 
    })
  }
}

export default angular.module('bookSwapApp.trade', [uiRouter])
  .config(routes)
  .component('trade', {
    template: require('./trade.html'),
    controller: TradeComponent,
    controllerAs: 'tradeCtrl'
  })
  .name;
