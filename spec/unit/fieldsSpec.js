var Fields = require('../../src/fields');
var helpers = require('../support/specHelper');

describe('Fields', function () {
  beforeEach(function () {
    helpers.setupForm();
  });

  afterEach(function () {
    helpers.teardownForm();
  });

  describe('#initialize', function () {
    it('populates the models array with Field objects for all uniquely named inputs, textareas, and selects in the DOM', function () {
      var fields = new Fields();
      var checkboxes = document.querySelectorAll('[name="checkbox"]');

      expect(fields.models.length).toEqual(6);
      expect(fields.get('input').el)
        .toEqual(document.querySelector('[name="input"]'));
      expect(fields.get('input2').el)
        .toEqual(document.querySelector('[name="input2"]'));
      expect(fields.get('checkbox').el)
        .toEqual(Array.prototype.slice.call(checkboxes));
      expect(fields.get('select').el)
        .toEqual(document.querySelector('[name="select"]'));
      expect(fields.get('textarea').el)
        .toEqual(document.querySelector('[name="textarea"]'));
    });

    it('populates the models array with Field objects for all uniquely named inputs, textareas, and selects within the provided selector if the first argument is a string', function () {
      var checkboxes = document.querySelectorAll('[name="checkbox"]');

      var fields = new Fields('#scoped');

      expect(fields.models.length).toEqual(2);
      expect(fields.get('checkbox').el)
        .toEqual(Array.prototype.slice.call(checkboxes));
      expect(fields.get('textarea').el)
        .toEqual(document.querySelector('[name="textarea"]'));
    });

    it('adds validations to the validations property if the first argument is an object', function () {
      var fields = new Fields({
        validations: {
          '[name="input"]': function () {
            if (true) {
              return 'Example validation';
            }
          }
        }
      });

      expect(fields.validations['[name="input"]']).toBeDefined();
    });

    it('adds validations to the validations property if the first argument is a string but the second is an object', function () {
      var fields = new Fields('#scoped', {
        validations: {
          '[name="input"]': function () {
            if (true) {
              return 'Example validation';
            }
          }
        }
      });

      expect(fields.validations['[name="input"]']).toBeDefined();
    });
  });

  describe( '.addValidation', function () {
    it( 'adds a validation keyed on a selector string', function () {
      var fields = new Fields();

      fields.addValidation('[name="input"]', function () {
        if (true) {
          return 'Example validation';
        }
      });

      expect(fields.validations['[name="input"]']).toBeDefined();
    });
  });

  describe( '.get', function () {
    it( 'returns a child Field object keyed on its name attribute', function () {
      var fields = new Fields();

      expect(fields.get('checkbox')).not.toBe(null);
      expect(fields.get('fake')).toBe(null);
    });
  });

  describe( '.isValid', function () {
    it( 'returns false if the validity of any of its child Field objects is invalid', function () {
      var fields = new Fields();
      expect(fields.isValid()).toBe(false);
    });

    it( 'returns true if the validity of all of its child Field objects are valid', function (done) {
      var fields = new Fields();
      fields.get('email').el.value = 'example@email.com';

      setTimeout(function () {
        expect(fields.isValid()).toBe(true);
        done();
      }, 1000)
    });
  });
});
