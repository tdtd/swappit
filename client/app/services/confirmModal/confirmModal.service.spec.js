'use strict';

describe('Service: confirmModal', function() {
  // load the service's module
  beforeEach(module('bookSwapApp.confirmModal'));

  // instantiate service
  var confirmModal;
  beforeEach(inject(function(_confirmModal_) {
    confirmModal = _confirmModal_;
  }));

  it('should do something', function() {
    expect(!!confirmModal).to.be.true;
  });
});
