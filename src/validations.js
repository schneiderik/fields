function requiredValidation (el, callback) {
  var isRequired = el.hasAttribute('required') && !!this.el.getAttribute('required');
  var hasValue = !!el.value;
  var valid = isRequired && hasValue;

  callback('Required field', valid);
}

function emailValidation (el, callback) {
  var emailRegex = /^[A-Za-z0-9!#$%&'*+\/=?^_`{|}~-]+(?:\.[A-Za-z0-9!#$%&'*+\/=?^_`{|}~-]+)*@(?:[A-Za-z0-9](?:[A-Za-z0-9-]*[A-Za-z0-9])?\.)+[A-Za-z0-9](?:[A-Za-z0-9-]*[A-Za-z0-9])?/;
  var valid = emailRegex.test(el.value);

  callback('Invalid Email', valid);
}

module.exports = {
  required: requiredValidation,
  email: emailValidation
};
