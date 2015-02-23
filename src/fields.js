var util = require('./helpers/util');
var validations = require('./validations');
var Field = require('./field');

function Fields (selector, options) {
  if (typeof selector === 'object') {
    options = selector;
    selector = null;
  }

  this.options = options || {};
  this.el = selector ? document.querySelector(selector) : document.body;
  this.models = [];
  this.validations = Object.create(Fields.defaultValidations);

  this.addValidations(this.options.validations);
  this._createFields();
}

Fields.defaultValidations = {
  'input, select, textarea': validations.required,
  '[type="email"]': validations.email
};

Fields.prototype.addValidations = function (validations) {
  for (selector in validations) {
    if (validations.hasOwnProperty(selector)) {
      this.addValidation(selector, validations[selector]);
    }
  }
};

Fields.prototype.addValidation = function (selector, validationFunc) {
  this.validations[selector] = validationFunc;
};

Fields.prototype._createFields = function () {
  var elements = util.nodeListToArray(this.el.querySelectorAll('input, select, textarea'));
  var elementsLength = elements.length;

  if (this.el.name) {
    this.models.push(new Field(this.el, this));
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
};

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
};

Fields.prototype.isValid = function () {
  var valid = true;
  var modelsLength = this.models.length;

  for (var i = 0; i < modelsLength; i++) {
    if (this.models[i].isValid() === false) {
      valid = false;
    }
  }

  return valid;
};

module.exports = Fields;
