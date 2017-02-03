'use strict';

import angular from 'angular';
//import ngAnimate from 'angular-animate';
import ngCookies from 'angular-cookies';
import ngResource from 'angular-resource';
import ngSanitize from 'angular-sanitize';

import uiRouter from 'angular-ui-router';
import uiBootstrap from 'angular-ui-bootstrap';
// import ngMessages from 'angular-messages';
// import ngValidationMatch from 'angular-validation-match';


import {
  routeConfig
} from './app.config';

import _Auth from '../components/auth/auth.module';
import account from './account';
import admin from './admin';
import navbar from '../components/navbar/navbar.component';
import footer from '../components/footer/footer.component';
import Modal from '../components/modal/modal.service';
import main from './main/main.component';
import constants from './app.constants';
import util from '../components/util/util.module';
import BrowseComponent from './browse/browse.component';
import MeComponent from './me/me.component';
import TradeComponent from './trade/trade.component';
import confirmModal from './services/confirmModal/confirmModal.service';
import tradeModal from './components/custommodals/tradeModal/tradeModal.component';

import './app.scss';

angular.module('swappitApp', [ngCookies, ngResource, ngSanitize, uiRouter, uiBootstrap, Modal, _Auth,
  account, admin, navbar, footer, main, constants, util, BrowseComponent, MeComponent, TradeComponent, tradeModal, confirmModal
])
  .config(routeConfig)
  .run(function($rootScope, $location, Auth) {
    'ngInject';
    // Redirect to login if route requires auth and you're not logged in

    $rootScope.$on('$stateChangeStart', function(event, next) {
      Auth.isLoggedIn(function(loggedIn) {
        if(next.authenticate && !loggedIn) {
          $location.path('/login');
        }
      });
    });
  });

angular.element(document)
  .ready(() => {
    angular.bootstrap(document, ['swappitApp'], {
      strictDi: true
    });
  });