var validations = require('../../src/validations');
var Field = require('../../src/field');
var helpers = require('../support/specHelper');

describe('Field', function () {

  beforeEach(function () {
    helpers.setupForm();
  });

  afterEach(function () {
    helpers.teardownForm();
  });

  describe('el', function () {
    it('references a DOM element', function () {
      var input = document.querySelector('[name="input"]');
      var field = new Field(input, {
        el: document.body
      });

      expect(field.el).toEqual(input);
    });

    it('becomes an array of all DOM elements with the same [name] attribute', function () {
      var checkboxes = document.querySelectorAll('[name="checkbox"]');
      var field = new Field(checkboxes, {
        el: document.body
      });

      expect(field.el).toEqual(Array.prototype.slice.call(checkboxes));
    });
  });

  describe('isValid', function () {
    it('returns a false if there is an error in the errors property', function () {
      var email = document.querySelector('[name="email"]');
      email.value = 'foobar';
      var field = new Field(email, {
        el: document.body,
        validations: {
          '[type="email"]': validations.email
        }
      });

      expect(field.isValid()).toBe(false);
    });

    xit('returns a false if a validation has not resolved', function () {
      var email = document.querySelector('[name="email"]');
      email.value = 'foobar';
      var field = new Field(email, {
        el: document.body,
        validations: {
          '[type="email"]': validations.email
        }
      });

      expect(field.isValid()).toBe(false);
    });

    it('returns a true if there are no errors in the errors property', function () {
      var email = document.querySelector('[name="email"]');
      email.value = 'foobar@example.com';
      var field = new Field(email, {
        el: document.body,
        validations: {
          '[type="email"]': validations.email
        }
      });

      console.log(field.validating, field.errors);

      expect(field.isValid()).toBe(true);
    });
  });

  describe( '.validate', function () {
    it( 'evaluates and sets the errors attribute', function () {
    });
  });
});
