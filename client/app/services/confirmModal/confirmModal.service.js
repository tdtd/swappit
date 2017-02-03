'use strict';
const angular = require('angular');

/*@ngInject*/
export function confirmModalService($rootScope, $uibModal) {
	 'ngInject';
  function openModal(scope = {}, modalClass = 'modal-default') {
    var modalScope = $rootScope.$new();
    angular.extend(modalScope, scope);
    return $uibModal.open({
      animation: true,
      size: 'sm',
      template: require('./confirmModal.html'),
      windowClass: modalClass,
      scope: modalScope
    });
  }

  
  return {
      reject: function(rej, name) {
        return function() {
          let rejectModal;

          rejectModal = openModal({
            modal: {
              dismissable: true,
              title: 'Confirm Delete',
              html: `<p>Are you sure you want to reject the trade from <strong>${name}</strong> ?</p>`,
              buttons: [{
                classes: 'btn-danger',
                text: 'Delete',
                click(e) {
                  rejectModal.close(e);
                }
              }, {
                classes: 'btn-default',
                text: 'Cancel',
                click(e) {
                  rejectModal.dismiss(e);
                }
              }]
            }
          }, 'modal-danger');

          rejectModal.result.then(function(event) {
            rej(event);
          });
        }();
      },
    
    accept: function(acc, name) {
        return function() {
          let acceptModal;

          acceptModal = openModal({
            modal: {
              dismissable: true,
              title: 'Confirm Accept',
              html: `<p>Are you sure you want to accept the trade from <strong>${name}</strong> ?</p>`,
              buttons: [{
                classes: 'btn-success',
                text: 'Accept',
                click(e) {
                  acceptModal.close(e);
                }
              }, {
                classes: 'btn-default',
                text: 'Cancel',
                click(e) {
                  acceptModal.dismiss(e);
                }
              }]
            }
          }, 'modal-success');

          acceptModal.result.then(function(event) {
            acc(event);
          });
        }();
      },
    
    remove: function(rem, name) {
        return function() {
          let removeModal;

          removeModal = openModal({
            modal: {
              dismissable: true,
              title: 'Confirm Remove',
              html: `<p>Are you sure you want to remove your request to trade with <strong>${name}</strong> ?</p>`,
              buttons: [{
                classes: 'btn-danger',
                text: 'Remove',
                click(e) {
                  removeModal.close(e);
                }
              }, {
                classes: 'btn-default',
                text: 'Cancel',
                click(e) {
                  removeModal.dismiss(e);
                }
              }]
            }
          }, 'modal-danger');

          removeModal.result.then(function(event) {
            rem(event);
          });
        }();
      }
  };
}

export default angular.module('bookSwapApp.confirmModal', [])
  .service('confirmModal', confirmModalService)
  .name;
