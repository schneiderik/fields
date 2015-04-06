var validationRegistry = ('./validationRegistry');
var util = require('./helpers/util');

function Field (elements, options) {
  this.elements = util.isNodeList(elements) ? util.nodeListToArray(elements) : elements;
  this.name = elements[0].name;
  this.validations = options.validations ? options.validations : [];
  this.errors = [];
  this.validating = false;

  this.validate();
};

Field.prototype.isValid = function () {
  this.updateErrors(options.validatingMessage, this.validating);

  return this.errors.length === 0;
};

Field.prototype.isRequired = function () {
  var required = false;
  var elementsLength = this.elements.length;

  for (var i = 0; i < elementsLength; i++) {
    var element = this.elements[i];
    if (element.hasAttribute('required') && !!element.getAttribute('required')) {
      require = true;
      break;
    }
  }
}

Field.prototype.value = function () {
  var values = [];
  var radioInputs = [];
  var checkboxInputs = [];
  var elementsLength = this.elements.length;

  for (var i = 0; i < elementsLength; i++) {
    var element = this.elements[i];

    if (element.type === 'radio') {
      radioInputs.push(element);
    } else if (element.type === 'checkbox') {
      checkboxInputs.push(element);
    } else if (element.tagName.toLowerCase() === 'select' && element.multiple) {
      var options = util.nodeListToArray(element.querySelectorAll('option'));
      var optionsLength = options.length;

      for (var i = 0; i < optionsLength; i++) {
        var option = options[i];
        if (option.selected) {
          var value = option.value || option.text;
          values.push(value);
        }
      }
    } else {
      values.push(element.value);
    }
  }

  if (radioInputs.length) {
    var inputLength = radioInputs.length;

    for (var i = 0; i < inputLength; i++) {
      var input = radioInputs[i];

      if (input.checked) {
        values.push(input.value);
        break;
      }
    }
  }

  if (checkboxInputs.length) {
    var inputLength = checkboxInputs.length;

    for (var i = 0; i < inputLength; i++) {
      var input = checkboxInputs[i];
      if (input.checked) {
        values.push(input.value);
      }
    }
  }

  return values;
};

Field.prototype.validate = function () {
  this.validating = true

  if (this.isRequired() && !this.value().length) {
    this.updateErrors(options.requiredMessage, this.validating);
  } else if (this.value().length) {
    var validationsLength = this.validations.length;

    for (var i = 0; i < validationsLength; i++) {
      var validation = this.validations[i];

      validation(this.value(), this.elements, util.bind(this.updateErrors, this));
    }
  }
};

Field.prototype.updateErrors = function (message, valid) {
  var errorIndex = this.errors.indexOf(message);
  if (valid && errorIndex !== -1) {
    this.errors.splice(errorIndex, 1);
  } else if (!valid && errorIndex === -1) {
    this.errors.push(message);
  }

  this.validating = false;
};

module.exports = Field;
