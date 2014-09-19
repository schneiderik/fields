!function(e){if("object"==typeof exports)module.exports=e();else if("function"==typeof define&&define.amd)define(e);else{var f;"undefined"!=typeof window?f=window:"undefined"!=typeof global?f=global:"undefined"!=typeof self&&(f=self),f.Fields=e()}}(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(_dereq_,module,exports){
var Field = _dereq_('./field');

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

},{"./field":2}],2:[function(_dereq_,module,exports){
var Field = (function() {
  function Field() {};

  Field.prototype.isValid = function() {
    return false;
  };

})();

module.exports = Field

},{}]},{},[1])
(1)
});