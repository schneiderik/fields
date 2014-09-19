var Field = require('./field');

function Fields (selector) {
  this.el = selector ? document.querySelector(selector) : document;
  this.models = [];

  this.initialize();
};

Fields.prototype.initialize = function () {
  var fields = Array.prototype.slice.call(this.el.querySelectorAll('input, select, textarea'));
  var fieldLength = fields.length;

  for (var i = 0; i < fieldLength; i++) {
    if (fields[i].name && this.models.indexOf(fields[i].name) === -1) {
      this.models.push(fields[i].name);
    }
  }
}

Fields.addValidation = function (selector, validation) {

}

module.exports = Fields
