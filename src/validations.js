function requiredValidation (el) {
  var isRequired = el.hasAttribute('required') && !!this.el.getAttribute('required');
  var hasValue = !!el.value;
  if (isRequired && !hasValue) {
    return 'Required field';
  }
}

function emailValidation (el) {
  var emailRegex = /^[A-Za-z0-9!#$%&'*+\/=?^_`{|}~-]+(?:\.[A-Za-z0-9!#$%&'*+\/=?^_`{|}~-]+)*@(?:[A-Za-z0-9](?:[A-Za-z0-9-]*[A-Za-z0-9])?\.)+[A-Za-z0-9](?:[A-Za-z0-9-]*[A-Za-z0-9])?/;
  if (!emailRegex.test(el.value)) {
    return 'Invalid Email';
  }
}

module.exports = {
  required: requiredValidation,
  email: emailValidation
};
