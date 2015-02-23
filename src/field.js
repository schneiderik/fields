var validationRegistry = ('./validationRegistry');
var util = require('./helpers/util');

function Field (el, parent) {
  this.el = util.isNodeList(el) ? util.nodeListToArray(el) : el;
  this.name = util.isArray(el) ? el[0].name : el.name;
  this.parent = parent;
  this.validations = parent.validations ? parent.validations : {};
  this.errors = [];
  this.validating = false;

  this.validate();
};

Field.prototype.isValid = function () {
  if (this.validating) {
    return false;
  }

  return this.errors.length === 0;
};

Field.prototype.addElement = function (el) {
  if (util.isNodeList(el)) {
    el = util.nodeListToArray(el);
  }

  this.el = util.toUniqueArray(this.el, el);

  return this.el;
}

Field.prototype.validate = function () {
  this.validating = true

  for (selector in this.validations) {
    var selectedElements = util.nodeListToArray(this.parent.el.querySelectorAll(selector));
    var selectedElementsLength = selectedElements.length;

    for (var i = 0; i < selectedElementsLength; i++) {
      if (util.isArray(this.el)) {
        elementsLength = this.el.length;
        for (var ii = 0; ii < elementsLength; ii++) {
          if (selectedElements.indexOf(this.el[ii]) !== -1) {
            this.validations[selector](this.el[ii], util.bind(this.updateErrors, this));
          }
        }
      } else {
        if (selectedElements.indexOf(this.el) !== -1) {
          this.validations[selector](this.el, util.bind(this.updateErrors, this));
        }
      }
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
