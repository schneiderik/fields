var util = require('./helpers/util');
var Field = require('./field');

function Fields (selector) {
  this.el = selector ? document.querySelector(selector) : document;
  this.models = [];

  this.initialize();
};

Fields.prototype.initialize = function () {
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
        this.models.push(new Field(field));
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

Fields.addValidation = function (selector, validation) {

}

module.exports = Fields;
