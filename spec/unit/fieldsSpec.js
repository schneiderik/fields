var Fields = require('../../src/fields');
var helpers = require('../support/specHelper');

describe( 'Fields', function () {
  var fields;

  beforeEach(function () {
    helpers.setupForm();
    fields = new Fields;
  });

  afterEach(function () {
    helpers.teardownForm();
  });

  describe( '#initialize', function () {
    it( 'creates an instance of the Fields object', function () {
      fields2 = new Fields;
      expect(fields).not.toBe(fields2);
    });

    it( 'populates the models array with Field objects for all uniquely named inputs, textareas, and selects in the DOM', function () {
      var checkboxes = document.querySelectorAll('[name="checkbox"]');

      expect(fields.models.length).toEqual(5);
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

    it( 'populates the models array with Field objects for all uniquely named inputs, textareas, and selects within the provided selector', function () {
      var checkboxes = document.querySelectorAll('[name="checkbox"]');

      fields = new Fields('#scoped');

      expect(fields.models.length).toEqual(2);
      expect(fields.get('checkbox').el)
        .toEqual(Array.prototype.slice.call(checkboxes));
      expect(fields.get('textarea').el)
        .toEqual(document.querySelector('[name="textarea"]'));
    });
  });

  xdescribe( '#addValidation', function () {
    it( 'adds a validation keyed on a selector string', function () {
      Fields.addValidation('[name="input"]', function () {
        if (true) {
          return 'Example validation';
        }
      });
    });
  });

  xdescribe( '.isValid', function () {
    it( 'returns false if the validity of any of its child Field objects is invalid', function () {
      //stub invalid form
      expect(fields.isValid()).toBe(false);
    });
    it( 'returns true if the validity of all of its child Field objects are valid', function () {
      //stub valid form
      expect(fields.isValid()).toBe(true);
    });
  });

  describe( '.get', function () {
    it( 'returns a child Field object keyed on its name attribute', function () {
      expect(fields.get('checkbox')).not.toBe(null);
      expect(fields.get('fake')).toBe(null);
    });
  });
});
