'use strict';

describe('Component: TradeComponent', function() {
  // load the controller's module
  beforeEach(module('bookSwapApp.trade'));

  var TradeComponent;

  // Initialize the controller and a mock scope
  beforeEach(inject(function($componentController) {
    TradeComponent = $componentController('trade', {});
  }));

  it('should ...', function() {
    expect(1).to.equal(1);
  });
});
