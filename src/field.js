var util = require('./helpers/util');

function Field (el) {
  this.el = util.isNodeList(el) ? util.nodeListToArray(el) : el;
  this.name = util.isArray(el) ? el[0].name : el.name;
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

module.exports = Field;
