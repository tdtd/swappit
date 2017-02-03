'use strict';

export default function($stateProvider) {
  'ngInject';
  $stateProvider
    .state('trade', {
      url: '/trade',
      template: '<trade></trade>'
    });
}
