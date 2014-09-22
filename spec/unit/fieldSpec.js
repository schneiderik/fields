var Field = require('../../src/field');
var helpers = require('../support/specHelper');

describe( 'Field', function () {

  beforeEach(function () {
    helpers.setupForm();
  });

  afterEach(function () {
    helpers.teardownForm();
  });

  describe( 'el', function () {
    it( 'references a DOM element', function () {
      var input = document.querySelector('[name="input"]');
      var field = new Field(input);
      expect(field.el).toEqual(input);
    });

    it( 'becomes an array of all DOM elements with the same [name] attribute', function () {
      var checkboxes = document.querySelectorAll('[name="checkbox"]');
      var field = new Field(checkboxes);
      expect(field.el).toEqual(Array.prototype.slice.call(checkboxes));
    });
  });

  describe( 'errors', function () {
    it( 'an array of errors currently validated on the model', function () {
    });
  });

  describe( 'valid', function () {
    it( 'a boolean based on presence of errors', function () {
    });
  });

  describe( '.validate', function () {
    it( 'evaluates and sets the errors attribute', function () {
    });
  });
});
