var util = require('./helpers/util');
var validations = require('./validations');
var Field = require('./field');

function Fields (selector, options) {
  if (typeof selector === 'object') {
    options = Object.create(selector);
    selector = null;
  }

  this.options = options || {};
  this.el = selector ? document.querySelector(selector) : document.body;
  this.models = [];
  this.validations = {};
  this.requiredMessage = options.requiredMessage || 'Field required';
  this.validatingMessage = options.validatingMessage || 'Asynchronous validations have not completed';

  this._addValidations(this.options.validations);
  this._createFields();
}

Fields.prototype._addValidations = function (validations) {
  for (selector in validations) {
    if (validations.hasOwnProperty(selector)) {
      this._addValidation(selector, validations[selector]);
    }
  }
};

Fields.prototype._addValidation = function (name, validationFunc) {
  if (this.validations[name]) {
    this.validations[name].push(validationFunc);
  } else {
    this.validations[name] = [validationFunc];
  }
};

Fields.prototype._createFields = function () {
  var elements = util.nodeListToArray(this.el.querySelectorAll('input, select, textarea'));
  var elementsLength = elements.length;

  if (this.el.name) {
    this.models.push(new Field([this.el], {
      validations: this.validations[name],
      requiredMessage: this.requiredMessage,
      validatingMessage: this.validatingMessage
    }));
  }

  for (var i = 0; i < elementsLength; i++) {
    var field = elements[i];
    var name = field.name;

    if (name) {
      if (this.get(name)) {
        var fieldModel = this.get(name);

        fieldModel.elements.push(field);
      } else {
        this.models.push(new Field([field], {
          validations: this.validations[name],
          requiredMessage: this.requiredMessage,
          validatingMessage: this.validatingMessage
        }));
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

Fields.validations = validations;

module.exports = Fields;
