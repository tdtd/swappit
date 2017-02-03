'use strict';

describe('Component: tradeModal', function() {
  // load the component's module
  beforeEach(module('bookSwapApp.tradeModal'));

  var tradeModalComponent;

  // Initialize the component and a mock scope
  beforeEach(inject(function($componentController) {
    tradeModalComponent = $componentController('tradeModal', {});
  }));

  it('should ...', function() {
    expect(1).to.equal(1);
  });
});
