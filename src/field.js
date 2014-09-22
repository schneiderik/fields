var validationRegistry = ('./validationRegistry');
var util = require('./helpers/util');

function Field (el, validationRegistry) {
  this.el = util.isNodeList(el) ? util.nodeListToArray(el) : el;
  this.name = util.isArray(el) ? el[0].name : el.name;
  this.errors = [];
  this.valid = true;
  this.validationRegistry = validationRegistry;

  this.validate();
};

Field.prototype.isValid = function () {
  return false;
};

Field.prototype.addElement = function (el) {
  if (util.isNodeList(el)) {
    el = util.nodeListToArray(el);
  }

  this.el = util.toUniqueArray(this.el, el);

  return this.el;
}

Field.prototype.validate = function() {
}

module.exports = Field;
