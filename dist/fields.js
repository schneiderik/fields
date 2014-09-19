!function(e){if("object"==typeof exports)module.exports=e();else if("function"==typeof define&&define.amd)define(e);else{var f;"undefined"!=typeof window?f=window:"undefined"!=typeof global?f=global:"undefined"!=typeof self&&(f=self),f.Fields=e()}}(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(_dereq_,module,exports){
var util = _dereq_('./helpers/util');
var Field = _dereq_('./field');

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

},{"./field":2,"./helpers/util":3}],2:[function(_dereq_,module,exports){
var util = _dereq_('./helpers/util');

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

},{"./helpers/util":3}],3:[function(_dereq_,module,exports){
function isNodeList (obj) {
  return Object.prototype.toString.call(obj) === '[object NodeList]';
}

function isArray (obj) {
  return Object.prototype.toString.call(obj) === '[object Array]';
}

function nodeListToArray (obj) {
  return Array.prototype.slice.call(obj);
}

function uniqueArray(array) {
  var a = array.concat();
  for (var i = 0; i < a.length; ++i) {
    for (var j = i+1; j < a.length; ++j) {
      if (a[i] === a[j]) {
        a.splice(j--, 1);
      }
    }
  }

  return a;
};

// Takes any combination of single objects or arrays
// of objects and returns a unique array
function toUniqueArray(obj1, obj2) {
  if (isArray(obj1)) {
    if (isArray(obj2)) {
      obj1 = uniqueArray(obj1.concat(obj2));
    } else {
      obj1.push(obj2);
      obj1 = uniqueArray(obj1);
    }
  } else {
    if (isArray(obj2)) {
      el.push(obj1);
      obj1 = uniqueArray(obj2);
    } else {
      obj1 = [obj1, obj2];
    }
  }

  return obj1;
}

module.exports = {
  isNodeList: isNodeList,
  isArray: isArray,
  nodeListToArray: nodeListToArray,
  uniqueArray: uniqueArray,
  toUniqueArray: toUniqueArray
}

},{}]},{},[1])
(1)
});