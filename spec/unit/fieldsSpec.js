var Fields = require('../../src/fields');
var SpecHelper = require('../support/specHelper');

describe( 'Fields', function() {
  var fields;

  beforeEach(function() {
    SpecHelper.setupForm();
    fields = new Fields;
  });

  describe( '#initialize', function() {
    it( 'creates an instance of the Fields object', function() {
      fields2 = new Fields;
      expect(fields).not.toBe(fields2);
    });

    it( 'populates the models array with Field objects for all uniquely named inputs, textareas, and selects in the DOM', function() {
      expect(fields.models.length).toEqual(4);
    });

    it( 'populates the models array with Field objects for all uniquely named inputs, textareas, and selects within the provided selector', function() {
      fields = new Fields('#scoped');
      expect(fields.models.length).toEqual(2);
    });
  });

  xdescribe( '#addValidation', function() {
    it( 'adds a validation keyed on a selector string', function() {
      Fields.addValidation('[name="input"]', function() {
        if (true) {
          return 'Example validation';
        }
      });
    });
  });

  xdescribe( '.isValid', function() {
    it( 'returns false if the validity of any of its child Field objects is invalid', function() {
      //stub invalid form
      expect(fields.isValid()).toBe(false);
    });
    it( 'returns true if the validity of all of its child Field objects are valid', function() {
      //stub valid form
      expect(fields.isValid()).toBe(true);
    });
  });

  xdescribe( '.getField', function() {
    it( 'returns a child Field object keyed on its name attribute', function() {
      expect(fields.getField('checkbox')).not.toBe(null);
      expect(fields.getField('fake')).toBe(null);
    });
  });
});
