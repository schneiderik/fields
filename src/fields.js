var util = require('./helpers/util');
var Field = require('./field');

function Fields (selector, validations) {
  this.el = selector ? document.querySelector(selector) : document;
  this.models = [];
  this.validations = this.defaultValidations;

  this._createValidations()
  this._createFields();
};

Fields.defaultValidations = {
  'input, select, textarea': function (field) {
    if (field.isRequired() && !field.hasValue()) {
      return 'Required field';
    }
  },
  '[type="email"]': function (field) {
    if (!emailRegex.match(field.value())) {
      return 'Invalid Email';
    }
  }
}

Fields.prototype._createValidations = function () {
  for (selector in this.validations) {
    this.addValidation(selector, this.validations[selector]);
  }
}

Fields.prototype._createFields = function () {
  var elements = util.nodeListToArray(this.el.querySelectorAll('input, select, textarea'));
  var elementsLength = elements.length;

  if (this.el.name) {
    this.models.push(new Field(this.el));
  }

  for (var i = 0; i < elementsLength; i++) {
    var field = elements[i];
    var name = field.name;

    if (name) {
      if (this.get(name)) {
        this.get(name).addElement(field);
      } else {
        this.models.push(new Field(field, this));
      }
    }
  }
}

Fields.prototype.get = function (name) {
  var modelNames = this.models.map( function (model, index) {
    return model.name;
  });

  var modelIndex = modelNames.indexOf(name);

  if (modelIndex === -1) {
    return null;
  } else {
    return this.models[modelIndex];
  }
}

Fields.addValidation = function (selector, validation, run) {
  this.validations[selector] = validation
}

module.exports = Fields;
